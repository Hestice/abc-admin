import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsOptional } from 'class-validator';
import { VaccinationDay } from '../entities/schedule.entity';

export class UpdateVaccinationDto {
  @ApiProperty({
    description: 'The exposure ID associated with this vaccination',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  exposureId?: string;

  @ApiProperty({
    description: 'The patient ID (for backward compatibility)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  patientId?: string;

  @ApiProperty({
    description: 'The vaccination day to mark as completed',
    enum: VaccinationDay,
    example: VaccinationDay.DAY_0,
  })
  @IsEnum(VaccinationDay)
  day!: VaccinationDay;
}
