import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UsersService } from '../users/users.service';
import { SimplifiedPatient } from './types/simplifiedPatients.type';
import {
  Schedule,
  ScheduleStatus,
} from '../schedules/entities/schedule.entity';
import { Sex, Status } from '@abc-admin/enums';
import { Logger } from '@nestjs/common';
import { PatientSummaryDto } from './dto/patient-summary.dto';
@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    private usersService: UsersService // To track who manages patients
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

    // Return the patient
    // Note: Exposure and schedule creation should be handled separately
    // by the frontend or through separate API calls
    this.logger.log('Patient created successfully: ', savedPatient);
    if (!userId) {
      throw new Error('User ID is required to create a patient');
    }
    return this.findOne(savedPatient.id, userId);
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

  private getMostRecentSchedule(schedules: Schedule[]): Schedule | null {
    if (!schedules || schedules.length === 0) {
      return null;
    }
    // Return the most recent schedule (assuming they're ordered by createdAt DESC)
    // Or find the most recent in-progress schedule, otherwise the most recent overall
    const inProgressSchedule = schedules.find(
      (s) => s.status === ScheduleStatus.IN_PROGRESS
    );
    return inProgressSchedule || schedules[0];
  }

  async findAll(
    page = 1,
    limit = 10,
    userId: string
  ): Promise<{
    patients: SimplifiedPatient[];
    total: number;
  }> {
    const [patients, total] = await this.patientsRepository.findAndCount({
      where: { managedBy: { id: userId } },
      relations: ['managedBy', 'exposures', 'exposures.schedules'],
      skip: (page - 1) * limit,
      take: limit,
    });

    const simplifiedPatients = await Promise.all(
      patients.map(async (patient) => {
        // Get all schedules from all exposures
        const allSchedules: Schedule[] = [];
        for (const exposure of patient.exposures || []) {
          if (exposure.schedules) {
            allSchedules.push(...exposure.schedules);
          }
        }

        const mostRecentSchedule = this.getMostRecentSchedule(allSchedules);
        const nextVaccination = this.getNextVaccinationDate(
          mostRecentSchedule || ({} as Schedule)
        );

        return {
          id: patient.id,
          firstName: patient.firstName,
          middleName: patient.middleName,
          lastName: patient.lastName,
          scheduleStatus: mostRecentSchedule?.status,
          nextVaccinationDate: nextVaccination.date,
          nextVaccinationDay: nextVaccination.day,
          dateOfBirth: patient.dateOfBirth,
          dateRegistered: patient.createdAt,
          email: patient.email,
          sex: patient.sex as Sex,
        };
      })
    );

    return { patients: simplifiedPatients, total };
  }

  async findOne(id: string, userId: string): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({
      where: { id, managedBy: { id: userId } },
      relations: ['managedBy', 'exposures', 'exposures.schedules'],
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async findOneAsSummary(
    id: string,
    userId: string
  ): Promise<{ patient: PatientSummaryDto }> {
    const patient = await this.findOne(id, userId);

    // Get all schedules from all exposures
    const allSchedules: Schedule[] = [];
    for (const exposure of patient.exposures || []) {
      if (exposure.schedules) {
        allSchedules.push(...exposure.schedules);
      }
    }

    const mostRecentSchedule = this.getMostRecentSchedule(allSchedules);
    const nextVaccination = this.getNextVaccinationDate(
      mostRecentSchedule || ({} as Schedule)
    );

    // Get exposure data from most recent exposure
    const mostRecentExposure = patient.exposures?.[0] || null;

    const patientSummary: PatientSummaryDto = {
      id: patient.id,
      firstName: patient.firstName,
      middleName: patient.middleName || '',
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      animalStatus: mostRecentExposure?.animalStatus || Status.UNKNOWN,
      antiTetanusGiven: mostRecentExposure?.antiTetanusGiven || false,
      dateOfAntiTetanus: mostRecentExposure?.dateOfAntiTetanus || null,
      dateRegistered: patient.createdAt,
      scheduleStatus: mostRecentSchedule?.status || '',
      nextVaccinationDate: nextVaccination.date || null,
      nextVaccinationDay: nextVaccination.day,
    };

    return { patient: patientSummary };
  }

  async update(
    id: string,
    updatePatientDto: Partial<CreatePatientDto>,
    userId: string
  ): Promise<Patient> {
    const patient = await this.findOne(id, userId);
    this.logger.log(updatePatientDto);
    Object.assign(patient, updatePatientDto);
    patient.updatedAt = new Date();

    return this.patientsRepository.save(patient);
  }

  async remove(id: string, userId: string): Promise<void> {
    const patient = await this.findOne(id, userId);
    await this.patientsRepository.remove(patient);
  }
}
