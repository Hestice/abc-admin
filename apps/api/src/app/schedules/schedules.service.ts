import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Schedule,
  ScheduleStatus,
  VaccinationDay,
} from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PatientsService } from '../patients/patients.service';

@Injectable()
export class SchedulesService {
  private readonly logger = new Logger(SchedulesService.name);

  constructor(
    @InjectRepository(Schedule)
    private schedulesRepository: Repository<Schedule>,
    @Inject(forwardRef(() => PatientsService))
    private patientsService: PatientsService
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    this.logger.log(
      `Creating schedule for patient: ${createScheduleDto.patientId}`
    );

    // Check if patient exists
    const patient = await this.patientsService.findOne(
      createScheduleDto.patientId
    );

    // Check if patient already has a schedule
    if (patient.schedule) {
      throw new BadRequestException(
        'Patient already has a vaccination schedule'
      );
    }

    // Calculate the vaccination dates
    // Always set to current date in UTC to avoid timezone issues
    const today = new Date();
    const startDate = createScheduleDto.startDate
      ? new Date(createScheduleDto.startDate)
      : today;

    // Create the date string in YYYY-MM-DD format to ensure no timezone issues
    const dateStr = startDate.toISOString().split('T')[0];
    const day0Date = new Date(dateStr);

    // Calculate future dates based on day0
    const day3Date = this.calculateVaccinationDate(
      day0Date,
      VaccinationDay.DAY_3
    );
    const day7Date = this.calculateVaccinationDate(
      day0Date,
      VaccinationDay.DAY_7
    );
    const day28Date = this.calculateVaccinationDate(
      day0Date,
      VaccinationDay.DAY_28
    );

    this.logger.debug(`DAY CALCULATION:
      today: ${today.toISOString()}
      startDate: ${startDate.toISOString()}
      dateStr: ${dateStr}
      day0Date: ${day0Date.toISOString()}
      day3Date: ${day3Date.toISOString()} (should be +3 days)
      day7Date: ${day7Date.toISOString()} (should be +7 days)
      day28Date: ${day28Date.toISOString()} (should be +28 days)
    `);

    // Create schedule
    const schedule = this.schedulesRepository.create({
      patient,
      status: ScheduleStatus.IN_PROGRESS,
      day0Date,
      day3Date,
      day7Date,
      day28Date,
    });

    // Log the created schedule object for debugging
    this.logger.debug('Schedule object created:');
    this.logger.debug(`day0Date: ${schedule.day0Date}`);
    this.logger.debug(`day3Date: ${schedule.day3Date}`);
    this.logger.debug(`day7Date: ${schedule.day7Date}`);
    this.logger.debug(`day28Date: ${schedule.day28Date}`);

    const savedSchedule = await this.schedulesRepository.save(schedule);
    this.logger.debug('Schedule saved with ID:', savedSchedule.id);

    // Double-check that the days are stored correctly in DB
    const query = await this.schedulesRepository.query(
      `SELECT "day0Date", "day3Date", "day7Date", "day28Date" FROM schedules WHERE id = $1`,
      [savedSchedule.id]
    );
    this.logger.debug('Raw DB values:', JSON.stringify(query, null, 2));

    // Fetch the full schedule with all fields
    const fullSchedule = await this.findOne(savedSchedule.id);
    return fullSchedule;
  }

  // Helper method to calculate vaccination dates based on days
  private calculateVaccinationDate(startDate: Date, daysToAdd: number): Date {
    // Make sure we're working with a date string to avoid timezone issues
    const startDateStr =
      startDate instanceof Date
        ? startDate.toISOString().split('T')[0]
        : String(startDate);

    // Create a new date from the string (this will be in local timezone)
    const date = new Date(startDateStr);

    // Add the days
    date.setDate(date.getDate() + daysToAdd);

    // Convert back to YYYY-MM-DD string and create a new date
    const resultDateStr = date.toISOString().split('T')[0];
    const result = new Date(resultDateStr);

    this.logger.debug(
      `Calculating vaccination date: ${startDateStr} + ${daysToAdd} days = ${resultDateStr}`
    );
    return result;
  }

  async findAll(): Promise<Schedule[]> {
    this.logger.log('Finding all schedules');
    const schedules = await this.schedulesRepository.find({
      relations: ['patient'],
    });

    // Log the first schedule's dates if available
    if (schedules.length > 0) {
      const schedule = schedules[0];
      this.logger.debug(`First schedule dates:
        day0Date: ${
          schedule.day0Date instanceof Date
            ? schedule.day0Date.toISOString()
            : schedule.day0Date
        }
        day3Date: ${
          schedule.day3Date instanceof Date
            ? schedule.day3Date.toISOString()
            : schedule.day3Date
        }
        day7Date: ${
          schedule.day7Date instanceof Date
            ? schedule.day7Date.toISOString()
            : schedule.day7Date
        }
        day28Date: ${
          schedule.day28Date instanceof Date
            ? schedule.day28Date.toISOString()
            : schedule.day28Date
        }
      `);
    }

    return schedules;
  }

  async findOne(id: string): Promise<Schedule> {
    this.logger.log(`Finding schedule with ID: ${id}`);
    const schedule = await this.schedulesRepository.findOne({
      where: { id },
      relations: ['patient'],
    });

    if (!schedule) {
      this.logger.error(`Schedule not found with ID: ${id}`);
      throw new NotFoundException('Schedule not found');
    }

    // Log the schedule's dates
    this.logger.debug(`Schedule ${id} dates:
      day0Date: ${
        schedule.day0Date instanceof Date
          ? schedule.day0Date.toISOString()
          : schedule.day0Date
      }
      day3Date: ${
        schedule.day3Date instanceof Date
          ? schedule.day3Date.toISOString()
          : schedule.day3Date
      }
      day7Date: ${
        schedule.day7Date instanceof Date
          ? schedule.day7Date.toISOString()
          : schedule.day7Date
      }
      day28Date: ${
        schedule.day28Date instanceof Date
          ? schedule.day28Date.toISOString()
          : schedule.day28Date
      }
    `);

    return schedule;
  }

  async findByPatientId(patientId: string): Promise<Schedule> {
    this.logger.log(`Finding schedule for patient with ID: ${patientId}`);
    const schedule = await this.schedulesRepository.findOne({
      where: { patient: { id: patientId } },
      relations: ['patient'],
    });

    if (!schedule) {
      this.logger.error(`Schedule not found for patient with ID: ${patientId}`);
      throw new NotFoundException(
        `Schedule not found for patient ${patientId}`
      );
    }

    // Log the schedule's dates
    this.logger.debug(`Patient ${patientId} schedule dates:
      day0Date: ${
        schedule.day0Date instanceof Date
          ? schedule.day0Date.toISOString()
          : schedule.day0Date
      }
      day3Date: ${
        schedule.day3Date instanceof Date
          ? schedule.day3Date.toISOString()
          : schedule.day3Date
      }
      day7Date: ${
        schedule.day7Date instanceof Date
          ? schedule.day7Date.toISOString()
          : schedule.day7Date
      }
      day28Date: ${
        schedule.day28Date instanceof Date
          ? schedule.day28Date.toISOString()
          : schedule.day28Date
      }
    `);

    return schedule;
  }

  async update(
    id: string,
    updateScheduleDto: UpdateScheduleDto
  ): Promise<Schedule> {
    this.logger.log(`Updating schedule with ID: ${id}`);
    const schedule = await this.findOne(id);

    // Update fields
    Object.assign(schedule, updateScheduleDto);

    // If a day is marked as completed, set the completion timestamp
    if (updateScheduleDto.day0Completed && !schedule.day0CompletedAt) {
      schedule.day0CompletedAt = new Date();
    }

    if (updateScheduleDto.day3Completed && !schedule.day3CompletedAt) {
      schedule.day3CompletedAt = new Date();
    }

    if (updateScheduleDto.day7Completed && !schedule.day7CompletedAt) {
      schedule.day7CompletedAt = new Date();
    }

    if (updateScheduleDto.day28Completed && !schedule.day28CompletedAt) {
      schedule.day28CompletedAt = new Date();
    }

    // Auto-mark as completed if all days are done
    if (
      schedule.day0Completed &&
      schedule.day3Completed &&
      schedule.day7Completed &&
      schedule.day28Completed
    ) {
      schedule.status = ScheduleStatus.COMPLETED;
    }

    await this.schedulesRepository.save(schedule);
    this.logger.log(`Schedule with ID: ${id} updated successfully`);

    return this.findOne(id);
  }

  // This method can be called to fix existing schedules in the database
  async fixExistingSchedules(): Promise<void> {
    this.logger.log('Fixing all existing schedules with proper dates');
    const schedules = await this.schedulesRepository.find();

    for (const schedule of schedules) {
      // Use day0Date as the base date and recalculate other dates
      if (schedule.day0Date) {
        // Make sure we're using the date string to avoid timezone issues
        const day0DateStr =
          schedule.day0Date instanceof Date
            ? schedule.day0Date.toISOString().split('T')[0]
            : String(schedule.day0Date);

        const day0Date = new Date(day0DateStr);

        schedule.day3Date = this.calculateVaccinationDate(
          day0Date,
          VaccinationDay.DAY_3
        );
        schedule.day7Date = this.calculateVaccinationDate(
          day0Date,
          VaccinationDay.DAY_7
        );
        schedule.day28Date = this.calculateVaccinationDate(
          day0Date,
          VaccinationDay.DAY_28
        );

        this.logger.debug(`Fixed schedule ${schedule.id} dates:
          day0Date: ${day0Date.toISOString()}
          day3Date: ${schedule.day3Date.toISOString()}
          day7Date: ${schedule.day7Date.toISOString()}
          day28Date: ${schedule.day28Date.toISOString()}
        `);

        await this.schedulesRepository.save(schedule);
      }
    }

    this.logger.log(`Fixed ${schedules.length} schedules`);
  }

  async updateVaccination(id: string, day: VaccinationDay): Promise<Schedule> {
    const schedule = await this.findOne(id);

    switch (day) {
      case VaccinationDay.DAY_0:
        schedule.day0Completed = !schedule.day0Completed;
        schedule.day0CompletedAt = schedule.day0Completed
          ? new Date()
          : (null as unknown as undefined);
        break;
      case VaccinationDay.DAY_3:
        schedule.day3Completed = !schedule.day3Completed;
        schedule.day3CompletedAt = schedule.day3Completed
          ? new Date()
          : (null as unknown as undefined);
        break;
      case VaccinationDay.DAY_7:
        schedule.day7Completed = !schedule.day7Completed;
        schedule.day7CompletedAt = schedule.day7Completed
          ? new Date()
          : (null as unknown as undefined);
        break;
      case VaccinationDay.DAY_28:
        schedule.day28Completed = !schedule.day28Completed;
        schedule.day28CompletedAt = schedule.day28Completed
          ? new Date()
          : (null as unknown as undefined);
        break;
    }

    schedule.updatedAt = new Date();

    if (
      schedule.day0Completed &&
      schedule.day3Completed &&
      schedule.day7Completed &&
      schedule.day28Completed
    ) {
      schedule.status = ScheduleStatus.COMPLETED;
    } else {
      schedule.status = ScheduleStatus.IN_PROGRESS;
    }

    return this.schedulesRepository.save(schedule);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing schedule with ID: ${id}`);
    const schedule = await this.findOne(id);
    await this.schedulesRepository.remove(schedule);
    this.logger.log(`Schedule with ID: ${id} removed successfully`);
  }
}
