import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SchedulesController {
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
    description: 'Invalid input or patient already has a schedule.',
  })
  async create(
    @Body() createScheduleDto: CreateScheduleDto
  ): Promise<Schedule> {
    return this.schedulesService.create(createScheduleDto);
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
  @ApiOperation({ summary: 'Get a schedule by patient ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the schedule for the patient.',
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
