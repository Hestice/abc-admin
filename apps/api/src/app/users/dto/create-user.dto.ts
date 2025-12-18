import { UserRole } from '@abc-admin/enums';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Supabase user ID',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({ example: 'juanacruz@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.ADMIN,
    description: 'User role',
  })
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({
    example: true,
    description: 'Whether the user can log in to the system',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
