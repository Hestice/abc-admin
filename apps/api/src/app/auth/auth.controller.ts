import {
  Controller,
  Post,
  Res,
  UseGuards,
  Get,
  Request,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { CookieService } from './services/cookie.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService
  ) {}

  @Post('verify-supabase-token')
  @ApiOperation({ summary: 'Verify Supabase JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Token verified successfully',
    schema: {
      properties: {
        valid: { type: 'boolean' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid token.' })
  async verifySupabaseToken(
    @Headers('authorization') authorization: string,
    @Request() req: any
  ) {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header'
      );
    }

    const token = authorization.substring(7);
    const user = await this.authService.getAuthenticatedUser(token);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  @UseGuards(SupabaseAuthGuard)
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

  @UseGuards(SupabaseAuthGuard)
  @Get('verify-token')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify Supabase token validity' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  verifyToken(@Request() req: any) {
    return {
      valid: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
    };
  }
}
