import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InviteCodesService } from '../invite-codes.service';

@Injectable()
export class InviteCodeGuard implements CanActivate {
  constructor(private inviteCodesService: InviteCodesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const inviteCode = request.body?.inviteCode || request.query?.inviteCode;

    if (!inviteCode) {
      throw new BadRequestException('Invite code is required');
    }

    const validation = await this.inviteCodesService.validate(inviteCode);

    if (!validation.valid) {
      throw new UnauthorizedException(
        validation.message || 'Invalid invite code'
      );
    }

    return true;
  }
}
