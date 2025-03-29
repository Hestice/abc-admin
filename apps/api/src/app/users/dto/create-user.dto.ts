import { UserRole } from "@abc-admin/enums";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: 'juanacruz' })
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'juanacruz@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: UserRole, default: UserRole.PATIENT })
  @IsEnum(UserRole)
  role: UserRole;
}