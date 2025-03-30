import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Sex } from "../entities/patient.entity";

export class CreatePatientDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'D' })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  dateOfBirth!: string;
  
  @ApiProperty({ enum: Sex })
  @IsEnum(Sex)
  sex!: Sex;

  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  address!: string;
  
  @ApiProperty({ example: 'patient@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;
} 