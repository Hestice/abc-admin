import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CookieService {
  private readonly logger = new Logger(CookieService.name);
  constructor(private configService: ConfigService) {}

  getCookieOptions() {
    const isProd = this.configService.get('NODE_ENV') === 'production';
    const domain = isProd ? this.configService.get('FRONTEND_URL') : 'http://localhost:3000';

    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict' as const,
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
      ...(domain && { domain }),
    }
    this.logger.log(`Cookie options: ${JSON.stringify(cookieOptions)}`);
    return cookieOptions;
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
