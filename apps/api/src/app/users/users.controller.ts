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
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@abc-admin/enums';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user or create if not exists' })
  @ApiResponse({ status: 200, description: 'Return the current user.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getMe(@Request() req: any): Promise<User> {
    // User is already verified by SupabaseAuthGuard and attached to request
    // The guard's verifySupabaseToken already creates the user if they don't exist
    const userId = req.user.id;
    return this.usersService.findOne(userId);
  }

  @Post()
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'User has been created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({
    status: 409,
    description: 'Username or email already exists.',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Post('admin')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new admin user (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Admin user has been created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({
    status: 409,
    description: 'Username or email already exists.',
  })
  async createAdmin(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createAdminUser(createUserDto);
  }

  @Get()
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }
}
