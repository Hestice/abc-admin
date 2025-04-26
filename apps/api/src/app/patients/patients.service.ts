import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UsersService } from '../users/users.service';
import { SchedulesService } from '../schedules/schedules.service';
import { SimplifiedPatient } from './types/simplifiedPatients.type';
import { Schedule } from '../schedules/entities/schedule.entity';
import { Sex } from '@abc-admin/enums';
import { Logger } from '@nestjs/common';
import { PatientSummaryDto } from './dto/patient-summary.dto';
@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    private usersService: UsersService, // To track who manages patients
    @Inject(forwardRef(() => SchedulesService))
    private schedulesService: SchedulesService
  ) {}

  async create(
    createPatientDto: CreatePatientDto,
    userId?: string
  ): Promise<Patient> {
    const patient = this.patientsRepository.create(createPatientDto);

    if (userId) {
      const user = await this.usersService.findOne(userId);
      patient.managedBy = user;
    }

    // Save the patient first to get an ID
    const savedPatient = await this.patientsRepository.save(patient);

    // Create a vaccination schedule for the patient
    try {
      await this.schedulesService.create({ patientId: savedPatient.id });
    } catch (error) {
      // Log the error but don't fail the patient creation
      console.error('Failed to create vaccination schedule:', error);
    }

    // Return the patient with the newly added schedule
    this.logger.log('Patient created successfully: ', savedPatient);
    return this.findOne(savedPatient.id);
  }

  private getNextVaccinationDate(schedule: Schedule): {
    date: Date | undefined;
    day: string;
  } {
    if (!schedule) {
      return { date: undefined, day: 'No schedule' };
    }

    if (!schedule.day0Completed) {
      return { date: schedule.day0Date, day: 'Day 0' };
    }

    if (!schedule.day3Completed) {
      return { date: schedule.day3Date, day: 'Day 3' };
    }

    if (!schedule.day7Completed) {
      return { date: schedule.day7Date, day: 'Day 7' };
    }

    if (!schedule.day28Completed) {
      return { date: schedule.day28Date, day: 'Day 28' };
    }

    return { date: undefined, day: 'Completed' };
  }

  async findAll(
    page = 1,
    limit = 10
  ): Promise<{
    patients: SimplifiedPatient[];
    total: number;
  }> {
    const [patients, total] = await this.patientsRepository.findAndCount({
      relations: ['managedBy', 'schedule'],
      skip: (page - 1) * limit,
      take: limit,
    });

    const simplifiedPatients = patients.map((patient) => {
      const nextVaccination = this.getNextVaccinationDate(
        patient.schedule || ({} as Schedule)
      );

      return {
        id: patient.id,
        firstName: patient.firstName,
        middleName: patient.middleName,
        lastName: patient.lastName,
        scheduleStatus: patient.schedule?.status,
        nextVaccinationDate: nextVaccination.date,
        nextVaccinationDay: nextVaccination.day,
        dateOfBirth: patient.dateOfBirth,
        dateRegistered: patient.createdAt,
        email: patient.email,
        sex: patient.sex as Sex,
      };
    });

    return { patients: simplifiedPatients, total };
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({
      where: { id },
      relations: ['managedBy', 'schedule'],
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async findOneAsSummary(id: string): Promise<{ patient: PatientSummaryDto }> {
    const patient = await this.findOne(id);

    const nextVaccination = this.getNextVaccinationDate(
      patient.schedule || ({} as Schedule)
    );

    const patientSummary: PatientSummaryDto = {
      id: patient.id,
      firstName: patient.firstName,
      middleName: patient.middleName || '',
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      animalStatus: patient.animalStatus,
      antiTetanusGiven: patient.antiTetanusGiven,
      dateOfAntiTetanus: patient.dateOfAntiTetanus || null,
      dateRegistered: patient.createdAt,
      scheduleStatus: patient.schedule?.status || '',
      nextVaccinationDate: nextVaccination.date || null,
      nextVaccinationDay: nextVaccination.day,
    };

    return { patient: patientSummary };
  }

  async update(
    id: string,
    updatePatientDto: Partial<CreatePatientDto>
  ): Promise<Patient> {
    const patient = await this.findOne(id);
    this.logger.log(updatePatientDto);
    Object.assign(patient, updatePatientDto);
    patient.updatedAt = new Date();

    return this.patientsRepository.save(patient);
  }

  async remove(id: string): Promise<void> {
    const patient = await this.findOne(id);
    await this.patientsRepository.remove(patient);
  }
}
