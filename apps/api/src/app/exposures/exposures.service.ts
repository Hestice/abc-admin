import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exposure } from './entities/exposure.entity';
import { CreateExposureDto } from './dto/create-exposure.dto';
import { UpdateExposureDto } from './dto/update-exposure.dto';
import { PatientsService } from '../patients/patients.service';
import { Status } from '@abc-admin/enums';

@Injectable()
export class ExposuresService {
  private readonly logger = new Logger(ExposuresService.name);

  constructor(
    @InjectRepository(Exposure)
    private exposuresRepository: Repository<Exposure>,
    @Inject(forwardRef(() => PatientsService))
    private patientsService: PatientsService
  ) {}

  async create(
    createExposureDto: CreateExposureDto,
    userId: string
  ): Promise<Exposure> {
    this.logger.log(
      `Creating exposure for patient: ${createExposureDto.patientId}`
    );

    // Verify patient exists and user has access
    const patient = await this.patientsService.findOne(
      createExposureDto.patientId,
      userId
    );

    const exposure = this.exposuresRepository.create({
      patient,
      category: createExposureDto.category,
      bodyPartsAffected: createExposureDto.bodyPartsAffected,
      placeOfExposure: createExposureDto.placeOfExposure,
      dateOfExposure: new Date(createExposureDto.dateOfExposure),
      isExposureAtHome: createExposureDto.isExposureAtHome,
      sourceOfExposure: createExposureDto.sourceOfExposure,
      animalStatus: createExposureDto.animalStatus || Status.UNKNOWN,
      isWoundCleaned: createExposureDto.isWoundCleaned,
      antiTetanusGiven: createExposureDto.antiTetanusGiven,
      dateOfAntiTetanus: createExposureDto.dateOfAntiTetanus
        ? new Date(createExposureDto.dateOfAntiTetanus)
        : undefined,
      briefHistory: createExposureDto.briefHistory,
      allergy: createExposureDto.allergy,
      medications: createExposureDto.medications,
    });

    const savedExposure = await this.exposuresRepository.save(exposure);
    this.logger.log(
      `Exposure created successfully with ID: ${savedExposure.id}`
    );

    return this.findOne(savedExposure.id, userId);
  }

  async findAll(userId: string): Promise<Exposure[]> {
    this.logger.log('Finding all exposures');
    const exposures = await this.exposuresRepository.find({
      relations: ['patient', 'schedules'],
      where: { patient: { managedBy: { id: userId } } },
    });

    return exposures;
  }

  async findOne(id: string, userId: string): Promise<Exposure> {
    this.logger.log(`Finding exposure with ID: ${id}`);
    const exposure = await this.exposuresRepository.findOne({
      where: { id, patient: { managedBy: { id: userId } } },
      relations: ['patient', 'schedules'],
    });

    if (!exposure) {
      this.logger.error(`Exposure not found with ID: ${id}`);
      throw new NotFoundException('Exposure not found');
    }

    return exposure;
  }

  async findAllByPatientId(
    patientId: string,
    userId: string
  ): Promise<Exposure[]> {
    this.logger.log(`Finding all exposures for patient with ID: ${patientId}`);
    const exposures = await this.exposuresRepository.find({
      where: { patient: { id: patientId, managedBy: { id: userId } } },
      relations: ['patient', 'schedules'],
      order: { createdAt: 'DESC' },
    });

    this.logger.debug(
      `Found ${exposures.length} exposure(s) for patient ${patientId}`
    );
    return exposures;
  }

  async update(
    id: string,
    updateExposureDto: UpdateExposureDto,
    userId: string
  ): Promise<Exposure> {
    this.logger.log(`Updating exposure with ID: ${id}`);
    const exposure = await this.findOne(id, userId);

    // Handle date conversions
    if (updateExposureDto.dateOfExposure) {
      updateExposureDto.dateOfExposure = new Date(
        updateExposureDto.dateOfExposure
      ) as any;
    }
    if (updateExposureDto.dateOfAntiTetanus) {
      updateExposureDto.dateOfAntiTetanus = new Date(
        updateExposureDto.dateOfAntiTetanus
      ) as any;
    }

    Object.assign(exposure, updateExposureDto);
    await this.exposuresRepository.save(exposure);
    this.logger.log(`Exposure with ID: ${id} updated successfully`);

    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    this.logger.log(`Removing exposure with ID: ${id}`);
    const exposure = await this.findOne(id, userId);
    await this.exposuresRepository.remove(exposure);
    this.logger.log(`Exposure with ID: ${id} removed successfully`);
  }
}
