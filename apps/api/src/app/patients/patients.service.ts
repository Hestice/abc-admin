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

@Injectable()
export class PatientsService {
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
    return this.findOne(savedPatient.id);
  }

  async findAll(): Promise<Patient[]> {
    return this.patientsRepository.find({
      relations: ['managedBy', 'schedule'],
    });
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

  async update(
    id: string,
    updatePatientDto: Partial<CreatePatientDto>
  ): Promise<Patient> {
    const patient = await this.findOne(id);

    Object.assign(patient, updatePatientDto);

    return this.patientsRepository.save(patient);
  }

  async remove(id: string): Promise<void> {
    const patient = await this.findOne(id);
    await this.patientsRepository.remove(patient);
  }
}
