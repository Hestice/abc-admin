import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CookieService } from './services/cookie.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService
  ) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            role: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
    @Request() req: any
  ) {
    const { access_token, user } = await this.authService.login(loginDto, req);

    const authCookie = this.cookieService.getCookieWithJwtToken(access_token);
    response.cookie(authCookie.name, authCookie.value, authCookie.options);

    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  async logout(@Res({ passthrough: true }) response: Response) {
    const cookie = this.cookieService.getCookieForLogout();
    response.cookie(cookie.name, cookie.value, cookie.options);

    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-token')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify JWT token validity' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  verifyToken(@Request() req: any) {
    return {
      valid: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        role: req.user.role,
      },
    };
  }

  @Post('get-token')
  @ApiOperation({ summary: 'Get token for manual cookie setting' })
  async getToken(@Body() loginDto: LoginDto) {
    const { access_token, user } = await this.authService.login(loginDto);
    return { access_token, user };
  }
}
