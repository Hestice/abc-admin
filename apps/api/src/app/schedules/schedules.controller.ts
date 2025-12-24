import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  Request,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { SchedulesService } from './schedules.service';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { UpdateVaccinationDto } from './dto/update-vaccination.dto';

// Response class for better Swagger documentation
class ScheduleResponse {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  patient!: Record<string, any>;

  @ApiProperty()
  status!: string;

  @ApiProperty({ type: String, format: 'date' })
  day0Date!: Date;

  @ApiProperty({ type: String, format: 'date' })
  day3Date!: Date;

  @ApiProperty({ type: String, format: 'date' })
  day7Date!: Date;

  @ApiProperty({ type: String, format: 'date' })
  day28Date!: Date;

  @ApiProperty()
  day0Completed!: boolean;

  @ApiProperty()
  day3Completed!: boolean;

  @ApiProperty()
  day7Completed!: boolean;

  @ApiProperty()
  day28Completed!: boolean;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  day0CompletedAt?: Date;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  day3CompletedAt?: Date;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  day7CompletedAt?: Date;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  day28CompletedAt?: Date;
}

@ApiTags('schedules')
@Controller('schedules')
@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth()
export class SchedulesController {
  private readonly logger = new Logger(SchedulesController.name);

  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vaccination schedule' })
  @ApiResponse({
    status: 201,
    description: 'The schedule has been successfully created.',
    type: ScheduleResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input.',
  })
  @ApiResponse({
    status: 404,
    description: 'Patient not found.',
  })
  async create(
    @Body() createScheduleDto: CreateScheduleDto,
    @Request() req: any
  ): Promise<Schedule> {
    try {
      if (!req.user?.id) {
        this.logger.error('User ID not found in request');
        throw new BadRequestException('User authentication failed');
      }

      this.logger.log(
        `Creating schedule for patient ${createScheduleDto.patientId} by user ${req.user.id}`
      );

      return await this.schedulesService.create(createScheduleDto, req.user.id);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(`Error creating schedule: ${errorMessage}`, errorStack);

      // Re-throw known exceptions (they'll be handled by NestJS exception filters)
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      // Handle database constraint violations
      if (error instanceof QueryFailedError) {
        if (error.message.includes('unique constraint')) {
          throw new ConflictException(
            'A schedule already exists for this patient. Please use the existing schedule or contact support.'
          );
        }
        if (error.message.includes('foreign key constraint')) {
          throw new BadRequestException('Invalid patient ID provided.');
        }
      }

      // Wrap unexpected errors
      throw new InternalServerErrorException(
        errorMessage || 'Failed to create schedule'
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all vaccination schedules' })
  @ApiResponse({
    status: 200,
    description: 'Return all schedules.',
    type: [ScheduleResponse],
  })
  async findAll(): Promise<Schedule[]> {
    return this.schedulesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a schedule by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the schedule.',
    type: ScheduleResponse,
  })
  @ApiResponse({ status: 404, description: 'Schedule not found.' })
  async findOne(@Param('id') id: string): Promise<Schedule> {
    return this.schedulesService.findOne(id);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all schedules for a patient' })
  @ApiResponse({
    status: 200,
    description: 'Return all schedules for the patient.',
    type: [ScheduleResponse],
  })
  async findAllByPatientId(
    @Param('patientId') patientId: string
  ): Promise<Schedule[]> {
    return this.schedulesService.findAllByPatientId(patientId);
  }

  @Get('patient/:patientId/latest')
  @ApiOperation({ summary: 'Get the most recent schedule for a patient' })
  @ApiResponse({
    status: 200,
    description: 'Return the most recent schedule for the patient.',
    type: ScheduleResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Schedule not found for the patient.',
  })
  async findByPatientId(
    @Param('patientId') patientId: string
  ): Promise<Schedule> {
    return this.schedulesService.findByPatientId(patientId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vaccination schedule' })
  @ApiResponse({
    status: 200,
    description: 'The schedule has been successfully updated.',
    type: ScheduleResponse,
  })
  @ApiResponse({ status: 404, description: 'Schedule not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto
  ): Promise<Schedule> {
    return this.schedulesService.update(id, updateScheduleDto);
  }

  @Patch(':id/vaccination')
  @ApiOperation({ summary: 'Mark a vaccination day as completed' })
  @ApiResponse({
    status: 200,
    description: 'The vaccination has been successfully marked as completed.',
    type: ScheduleResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Schedule and patient do not match.',
  })
  @ApiResponse({ status: 404, description: 'Schedule not found.' })
  async updateVaccination(
    @Param('id') id: string,
    @Body() updateVaccinationDto: UpdateVaccinationDto
  ): Promise<Schedule> {
    // Get the schedule
    const schedule = await this.schedulesService.findOne(id);

    // Verify that the schedule belongs to the patient
    if (schedule.patient.id !== updateVaccinationDto.patientId) {
      throw new BadRequestException(
        'Schedule does not belong to the specified patient'
      );
    }

    // Update the vaccination day
    return this.schedulesService.updateVaccination(
      id,
      updateVaccinationDto.day
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vaccination schedule' })
  @ApiResponse({
    status: 200,
    description: 'The schedule has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Schedule not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.schedulesService.remove(id);
  }
}
