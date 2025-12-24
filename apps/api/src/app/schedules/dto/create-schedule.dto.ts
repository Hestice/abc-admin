import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateScheduleDto {
  @ApiProperty({
    description: 'The exposure ID this schedule belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  exposureId?: string;

  @ApiProperty({
    description:
      'The patient ID (for backward compatibility - will use most recent exposure or create new one)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  patientId?: string;

  @ApiProperty({
    description:
      'Optional start date for the vaccination schedule (defaults to today if not provided)',
    required: false,
    type: Date,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;
}
