import { PartialType } from '@nestjs/swagger';
import { CreateExposureDto } from './create-exposure.dto';

export class UpdateExposureDto extends PartialType(CreateExposureDto) {}
