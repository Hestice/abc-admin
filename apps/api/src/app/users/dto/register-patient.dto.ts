import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { CreatePatientProfileDto } from './create-patient-profile.dto';

export class RegisterPatientDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user!: CreateUserDto;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreatePatientProfileDto)
  profile!: CreatePatientProfileDto;
} 