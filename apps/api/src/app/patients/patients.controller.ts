import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SimplifiedPatient } from './types/simplifiedPatients.type';
import { PatientSummaryDto } from './dto/patient-summary.dto';
@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({
    status: 201,
    description: 'Patient has been created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async create(
    @Body() createPatientDto: CreatePatientDto,
    @Request() req: any
  ): Promise<Patient> {
    return this.patientsService.create(createPatientDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({ status: 200, description: 'Return all patients.' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination (default: 1)',
    schema: { type: 'integer', default: 1 },
  })
  async findAll(
    @Query('page') page = 1,
    @Request() req: any
  ): Promise<{ patients: SimplifiedPatient[]; total: number }> {
    return this.patientsService.findAll(page, 10, req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a patient by ID' })
  @ApiResponse({ status: 200, description: 'Return the patient.' })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  async findOne(
    @Param('id') id: string,
    @Request() req: any
  ): Promise<Patient> {
    return this.patientsService.findOne(id, req.user.id);
  }

  @Get(':id/summary')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a patient by ID as a summary' })
  @ApiResponse({ status: 200, description: 'Return the patient sumamry.' })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  async findOneAsSummary(
    @Param('id') id: string,
    @Request() req: any
  ): Promise<{ patient: PatientSummaryDto }> {
    return this.patientsService.findOneAsSummary(id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a patient' })
  @ApiResponse({
    status: 200,
    description: 'Patient has been updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  @ApiBody({
    type: CreatePatientDto,
    description: 'Patient data to update. All fields are optional.',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: Partial<CreatePatientDto>,
    @Request() req: any
  ): Promise<Patient> {
    return this.patientsService.update(id, updatePatientDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a patient' })
  @ApiResponse({
    status: 200,
    description: 'Patient has been deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  async remove(@Param('id') id: string, @Request() req: any): Promise<void> {
    return this.patientsService.remove(id, req.user.id);
  }

  // Add other endpoints as needed (update, delete, etc.)
}
