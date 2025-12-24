import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ExposuresService } from './exposures.service';
import { CreateExposureDto } from './dto/create-exposure.dto';
import { UpdateExposureDto } from './dto/update-exposure.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { Exposure } from './entities/exposure.entity';

@ApiTags('exposures')
@Controller('exposures')
@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth()
export class ExposuresController {
  private readonly logger = new Logger(ExposuresController.name);

  constructor(private readonly exposuresService: ExposuresService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new exposure' })
  @ApiResponse({
    status: 201,
    description: 'The exposure has been successfully created.',
    type: Exposure,
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
    @Body() createExposureDto: CreateExposureDto,
    @Request() req: any
  ): Promise<Exposure> {
    if (!req.user?.id) {
      this.logger.error('User ID not found in request');
      throw new Error('User authentication failed');
    }

    this.logger.log(
      `Creating exposure for patient ${createExposureDto.patientId} by user ${req.user.id}`
    );

    return await this.exposuresService.create(createExposureDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exposures' })
  @ApiResponse({
    status: 200,
    description: 'Return all exposures.',
    type: [Exposure],
  })
  async findAll(@Request() req: any): Promise<Exposure[]> {
    if (!req.user?.id) {
      throw new Error('User authentication failed');
    }
    return this.exposuresService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an exposure by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the exposure.',
    type: Exposure,
  })
  @ApiResponse({ status: 404, description: 'Exposure not found.' })
  async findOne(
    @Param('id') id: string,
    @Request() req: any
  ): Promise<Exposure> {
    if (!req.user?.id) {
      throw new Error('User authentication failed');
    }
    return this.exposuresService.findOne(id, req.user.id);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all exposures for a patient' })
  @ApiResponse({
    status: 200,
    description: 'Return all exposures for the patient.',
    type: [Exposure],
  })
  async findAllByPatientId(
    @Param('patientId') patientId: string,
    @Request() req: any
  ): Promise<Exposure[]> {
    if (!req.user?.id) {
      throw new Error('User authentication failed');
    }
    return this.exposuresService.findAllByPatientId(patientId, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an exposure' })
  @ApiResponse({
    status: 200,
    description: 'The exposure has been successfully updated.',
    type: Exposure,
  })
  @ApiResponse({ status: 404, description: 'Exposure not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateExposureDto: UpdateExposureDto,
    @Request() req: any
  ): Promise<Exposure> {
    if (!req.user?.id) {
      throw new Error('User authentication failed');
    }
    return this.exposuresService.update(id, updateExposureDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an exposure' })
  @ApiResponse({
    status: 200,
    description: 'The exposure has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Exposure not found.' })
  async remove(@Param('id') id: string, @Request() req: any): Promise<void> {
    if (!req.user?.id) {
      throw new Error('User authentication failed');
    }
    return this.exposuresService.remove(id, req.user.id);
  }
}
