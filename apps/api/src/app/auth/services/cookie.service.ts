import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CookieService {
  private readonly logger = new Logger(CookieService.name);
  constructor(private configService: ConfigService) {}

  getCookieOptions() {
    const isProd = this.configService.get('NODE_ENV') === 'production';
    let domain = isProd ? this.configService.get('FRONTEND_URL') : undefined;
    if (domain && domain.includes('://')) {
      try {
        const url = new URL(domain);
        domain = url.hostname;
      } catch (e) {
        this.logger.error(`Invalid domain URL: ${domain}`);
        domain = undefined;
      }
    }

    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax' as const,
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
      ...(domain && { domain }),
    };

    this.logger.log(`Cookie options: ${JSON.stringify(cookieOptions)}`);

    return cookieOptions;
  }

  getCookieName() {
    // Use NextAuth's default cookie name
    return 'next-auth.session-token';
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
        maxAge: 0,
      },
    };
  }
}
