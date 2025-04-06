import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CookieService {
  constructor(private configService: ConfigService) {}

  getCookieOptions() {
    const isProd = this.configService.get('NODE_ENV') === 'production';
    
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict' as const,
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    };
  }

  getCookieWithJwtToken(token: string) {
    return {
      name: 'auth_token',
      value: token,
      options: this.getCookieOptions(),
    };
  }

  getCookieWithUserRole(role: string) {
    return {
      name: 'user_role',
      value: role,
      options: {
        ...this.getCookieOptions(),
        httpOnly: false
      }
    };
  }

  getCookieForLogout() {
    return {
      name: 'auth_token',
      value: '',
      options: {
        ...this.getCookieOptions(),
        maxAge: 0
      }
    };
  }
}
