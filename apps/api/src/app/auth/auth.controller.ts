import { Controller, Post, Body, Res, UseGuards, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import type { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CookieService } from './services/cookie.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('login')
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
            email: { type: 'string' },
            role: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const { access_token, user } = await this.authService.login(loginDto);
    
    const authCookie = this.cookieService.getCookieWithJwtToken(access_token);
    response.cookie(authCookie.name, authCookie.value, authCookie.options);
    
    if (user && user.role) {
      const roleCookie = this.cookieService.getCookieWithUserRole(user.role);
      response.cookie(roleCookie.name, roleCookie.value, roleCookie.options);
    }
    
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
    
    response.cookie('user_role', '', { 
      ...cookie.options,
      httpOnly: false 
    });
    
    return { success: true };
  }
} 