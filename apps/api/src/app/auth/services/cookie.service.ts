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

  getCookieName() {
    return this.configService.get('AUTH_COOKIE_NAME') || 'auth_token';
  }

  getCookieWithJwtToken(token: string) {
    return {
      name: this.getCookieName(),
      value: token,
      options: this.getCookieOptions(),
    };
  }

  getCookieForLogout() {
    return {
      name: this.getCookieName(),
      value: '',
      options: {
        ...this.getCookieOptions(),
        maxAge: 0
      }
    };
  }
}
