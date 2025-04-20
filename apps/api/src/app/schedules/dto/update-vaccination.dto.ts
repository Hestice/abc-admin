import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum } from 'class-validator';
import { VaccinationDay } from '../entities/schedule.entity';

export class UpdateVaccinationDto {
  @ApiProperty({
    description: 'The patient ID associated with this vaccination',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  patientId!: string;

  @ApiProperty({
    description: 'The vaccination day to mark as completed',
    enum: VaccinationDay,
    example: VaccinationDay.DAY_0,
  })
  @IsEnum(VaccinationDay)
  day!: VaccinationDay;
}
