import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InviteCodesService } from './invite-codes.service';
import { InviteCode } from './entities/invite-code.entity';
import { CreateInviteCodeDto } from './dto/create-invite-code.dto';
import { ConsumeInviteCodeDto } from './dto/consume-invite-code.dto';
import { ValidateInviteCodeDto } from './dto/validate-invite-code.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { SupabaseIdentityGuard } from '../auth/guards/supabase-identity.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@abc-admin/enums';

@ApiTags('invite-codes')
@Controller('invite-codes')
export class InviteCodesController {
  constructor(private readonly inviteCodesService: InviteCodesService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate a new invite code (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Invite code has been generated successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only.' })
  async create(
    @Body() createInviteCodeDto: CreateInviteCodeDto,
    @Request() req: any
  ): Promise<InviteCode> {
    const createdBy = req.user.id;
    return this.inviteCodesService.create(createdBy);
  }

  @Get()
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all invite codes (admin only)' })
  @ApiResponse({ status: 200, description: 'Return all invite codes.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only.' })
  async findAll(): Promise<InviteCode[]> {
    return this.inviteCodesService.findAll();
  }

  @Get(':id')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get invite code details by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Return the invite code.' })
  @ApiResponse({ status: 404, description: 'Invite code not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only.' })
  async findOne(@Param('id') id: string): Promise<InviteCode> {
    return this.inviteCodesService.findOne(id);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate an invite code (public)' })
  @ApiResponse({
    status: 200,
    description: 'Return validation result.',
    schema: {
      properties: {
        valid: { type: 'boolean' },
        message: { type: 'string', nullable: true },
      },
    },
  })
  async validate(@Body() validateDto: ValidateInviteCodeDto) {
    return this.inviteCodesService.validate(validateDto.code);
  }

  @Post('consume')
  @UseGuards(SupabaseIdentityGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Consume an invite code (requires authentication)',
  })
  @ApiResponse({
    status: 200,
    description: 'Invite code has been consumed successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid invite code state.' })
  @ApiResponse({ status: 404, description: 'Invite code not found.' })
  @ApiResponse({ status: 409, description: 'Invite code already used.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async consume(
    @Body() consumeDto: ConsumeInviteCodeDto,
    @Request() req: any
  ): Promise<InviteCode> {
    return this.inviteCodesService.consumeAndProvision(
      consumeDto.code,
      req.identity
    );
  }
}
