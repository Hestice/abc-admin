import { UserRole } from '@abc-admin/enums';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'juanacruz' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ example: 'juanacruz@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8)
  password!: string;

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
