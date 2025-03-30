import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreatePatientProfileDto } from './dto/create-patient-profile.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';  
import { InjectRepository } from '@nestjs/typeorm';
import { PatientProfile } from './entities/patient-profile.entity';
import * as bcrypt from 'bcrypt';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { UserRole } from '@abc-admin/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PatientProfile)
    private patientProfileRepository: Repository<PatientProfile>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.role = UserRole.ADMIN;
    return this.createUser(createUserDto);
  }

  async createPatientWithProfile(registerPatientDto: RegisterPatientDto): Promise<User> {
    const { user: userDto, profile: profileDto } = registerPatientDto;
    userDto.role = UserRole.PATIENT;
    const user = await this.createUser(userDto);
    
    await this.createPatientProfile(user.id, profileDto);
    
    return this.findOneWithProfile(user.id);
  }

  async createPatientProfile(userId: string, profileDto: CreatePatientProfileDto): Promise<PatientProfile> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const profile = this.patientProfileRepository.create({
      ...profileDto,
      user,
    });
    
    return this.patientProfileRepository.save(profile);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async findOneWithProfile(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['patientProfile'],
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user || undefined;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { username } });
    return user || undefined;
  }
}
