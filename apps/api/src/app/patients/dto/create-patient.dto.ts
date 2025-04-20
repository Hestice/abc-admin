import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

import { Category, Sex } from '@abc-admin/enums';

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

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  category!: Category;

  @ApiProperty({ example: 'Hand' })
  @IsString()
  @IsNotEmpty()
  bodyPartsAffected!: string;

  @ApiProperty({ example: 'Carmona Municipal Hall' })
  @IsString()
  @IsNotEmpty()
  placeOfExposure!: string;
  //can be string, if isExposureAtHome is true, it will be 'Home'

  @ApiProperty({ example: '2025-02-13' })
  @IsDateString()
  @IsNotEmpty()
  dateOfExposure!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  isExposureAtHome!: boolean;

  @ApiProperty({ example: 'cat' })
  @IsString()
  @IsNotEmpty()
  sourceOfExposure!: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsNotEmpty()
  isWoundCleaned!: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsNotEmpty()
  antiTetanusGiven!: boolean;

  @ApiProperty({ example: '2025-02-13' })
  @IsDateString()
  @IsOptional()
  dateOfAntiTetanus?: string;

  @ApiProperty({ example: 'Scratched when playing with a cat' })
  @IsString()
  @IsNotEmpty()
  briefHistory!: string;

  @ApiProperty({ example: 'antibiotics' })
  @IsString()
  @IsNotEmpty()
  allergy!: string;
  //can be string that says 'none'

  @ApiProperty({ example: 'loperamide' })
  @IsString()
  @IsNotEmpty()
  medications!: string;
  //can be string that says 'none'
}
