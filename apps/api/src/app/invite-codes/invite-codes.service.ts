import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { InviteCode } from './entities/invite-code.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '@abc-admin/enums';
import { SupabaseIdentity } from '../auth/auth.service';

@Injectable()
export class InviteCodesService {
  constructor(
    @InjectRepository(InviteCode)
    private inviteCodesRepository: Repository<InviteCode>
  ) {}

  async create(createdBy: string): Promise<InviteCode> {
    const code = randomUUID();
    const inviteCode = this.inviteCodesRepository.create({
      code,
      createdBy,
      isActive: true,
    });

    return this.inviteCodesRepository.save(inviteCode);
  }

  async findAll(): Promise<InviteCode[]> {
    return this.inviteCodesRepository.find({
      relations: ['creator', 'consumer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<InviteCode> {
    const inviteCode = await this.inviteCodesRepository.findOne({
      where: { id },
      relations: ['creator', 'consumer'],
    });

    if (!inviteCode) {
      throw new NotFoundException('Invite code not found');
    }

    return inviteCode;
  }

  async findByCode(code: string): Promise<InviteCode | null> {
    return this.inviteCodesRepository.findOne({
      where: { code },
      relations: ['creator', 'consumer'],
    });
  }

  async validate(code: string): Promise<{ valid: boolean; message?: string }> {
    const inviteCode = await this.findByCode(code);

    if (!inviteCode) {
      return { valid: false, message: 'Invite code not found' };
    }

    if (!inviteCode.isActive) {
      return { valid: false, message: 'Invite code is no longer active' };
    }

    if (inviteCode.consumedBy) {
      return { valid: false, message: 'Invite code has already been used' };
    }

    return { valid: true };
  }

  async consume(code: string, consumedBy: string): Promise<InviteCode> {
    const inviteCode = await this.findByCode(code);

    if (!inviteCode) {
      throw new NotFoundException('Invite code not found');
    }

    if (!inviteCode.isActive) {
      throw new BadRequestException('Invite code is no longer active');
    }

    if (inviteCode.consumedBy) {
      throw new ConflictException('Invite code has already been used');
    }

    inviteCode.consumedBy = consumedBy;
    inviteCode.consumedAt = new Date();
    inviteCode.isActive = false;

    return this.inviteCodesRepository.save(inviteCode);
  }

  async consumeAndProvision(
    code: string,
    identity: SupabaseIdentity
  ): Promise<InviteCode> {
    return this.inviteCodesRepository.manager.transaction(async (manager) => {
      const inviteCode = await manager.findOne(InviteCode, {
        where: { code },
        lock: { mode: 'pessimistic_write' },
      });

      if (!inviteCode) {
        throw new NotFoundException('Invite code not found');
      }
      if (!inviteCode.isActive) {
        throw new BadRequestException('Invite code is no longer active');
      }
      if (inviteCode.consumedBy) {
        throw new ConflictException('Invite code has already been used');
      }

      const existingUser = await manager.findOne(User, {
        where: { id: identity.id },
      });
      if (!existingUser) {
        const emailOwner = await manager.findOne(User, {
          where: { email: identity.email },
        });
        if (emailOwner) {
          throw new ConflictException('Email already belongs to another user');
        }

        await manager.save(
          manager.create(User, {
            id: identity.id,
            email: identity.email,
            role: UserRole.ADMIN,
            isActive: true,
          })
        );
      }

      inviteCode.consumedBy = identity.id;
      inviteCode.consumedAt = new Date();
      inviteCode.isActive = false;
      return manager.save(inviteCode);
    });
  }
}
