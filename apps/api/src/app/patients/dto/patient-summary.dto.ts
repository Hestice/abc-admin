import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@abc-admin/enums';

export class PatientSummaryDto {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'John' })
  firstName!: string;

  @ApiProperty({ example: 'D' })
  middleName!: string;

  @ApiProperty({ example: 'Doe' })
  lastName!: string;

  @ApiProperty({ example: '1990-01-01' })
  dateOfBirth!: Date;

  @ApiProperty({ enum: Category })
  category!: Category;

  @ApiProperty({ example: true })
  antiTetanusGiven!: boolean;

  @ApiProperty({ example: '2021-01-01' })
  dateOfAntiTetanus!: Date | null;

  @ApiProperty({ example: '2021-01-01' })
  dateRegistered!: Date;

  @ApiProperty({ example: 'Pending' })
  scheduleStatus!: string;

  @ApiProperty({ example: '2021-01-01' })
  nextVaccinationDate!: Date | null;

  @ApiProperty({ example: 'Day 0' })
  nextVaccinationDay!: string | null;
}
