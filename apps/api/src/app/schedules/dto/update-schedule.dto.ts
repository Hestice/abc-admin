import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ScheduleStatus } from '../entities/schedule.entity';

export class UpdateScheduleDto {
  @ApiProperty({
    description: 'Scheduled date for day 0 vaccination',
    required: false,
    type: Date,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  day0Date?: Date;

  @ApiProperty({
    description: 'Scheduled date for day 3 vaccination',
    required: false,
    type: Date,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  day3Date?: Date;

  @ApiProperty({
    description: 'Scheduled date for day 7 vaccination',
    required: false,
    type: Date,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  day7Date?: Date;

  @ApiProperty({
    description: 'Scheduled date for day 28 vaccination',
    required: false,
    type: Date,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  day28Date?: Date;

  @ApiProperty({
    description: 'Completed status for day 0 vaccination',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  day0Completed?: boolean;

  @ApiProperty({
    description: 'Completed status for day 3 vaccination',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  day3Completed?: boolean;

  @ApiProperty({
    description: 'Completed status for day 7 vaccination',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  day7Completed?: boolean;

  @ApiProperty({
    description: 'Completed status for day 28 vaccination',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  day28Completed?: boolean;

  @ApiProperty({
    description: 'Overall status of the schedule',
    required: false,
    enum: ScheduleStatus,
    example: ScheduleStatus.COMPLETED,
  })
  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;
}
