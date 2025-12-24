import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Category, Status } from '@abc-admin/enums';

export class CreateExposureDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsNotEmpty()
  patientId!: string;

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

  @ApiProperty({ example: Status.ALIVE })
  @IsEnum(Status)
  @IsOptional()
  animalStatus?: Status;

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

  @ApiProperty({ example: 'loperamide' })
  @IsString()
  @IsNotEmpty()
  medications!: string;
}
