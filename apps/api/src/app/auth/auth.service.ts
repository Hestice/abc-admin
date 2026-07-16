import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UsersService } from '../users/users.service';

export interface SupabaseIdentity {
  id: string;
  email: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private configService: ConfigService
  ) {}

  async verifySupabaseToken(
    supabaseToken: string
  ): Promise<SupabaseIdentity | null> {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>(
      'SUPABASE_ANON_KEY'
    );

    if (!supabaseUrl || !supabaseAnonKey) {
      this.logger.error(
        'SUPABASE_URL and SUPABASE_ANON_KEY must be configured'
      );
      return null;
    }

    const normalizedUrl = supabaseUrl.replace(/\/$/, '');

    try {
      const response = await axios.get(`${normalizedUrl}/auth/v1/user`, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseToken}`,
        },
        validateStatus: () => true,
      });

      if (response.status < 200 || response.status >= 300) {
        this.logger.warn('Supabase rejected the access token');
        return null;
      }

      const payload: unknown = response.data;
      if (!this.hasRequiredClaims(payload)) {
        this.logger.warn('Supabase user response is missing required claims');
        return null;
      }

      return { id: payload.id, email: payload.email };
    } catch (error) {
      this.logger.warn(
        `Supabase token verification failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return null;
    }
  }

  async getAuthenticatedUser(supabaseToken: string) {
    const identity = await this.verifySupabaseToken(supabaseToken);

    if (!identity) {
      return null;
    }

    const user = await this.usersService.findBySupabaseId(identity.id);

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  }

  private hasRequiredClaims(
    payload: unknown
  ): payload is { id: string; email: string } {
    return (
      typeof payload === 'object' &&
      payload !== null &&
      'id' in payload &&
      'email' in payload &&
      typeof payload.id === 'string' &&
      typeof payload.email === 'string'
    );
  }

  async getUserFromSupabaseId(supabaseUserId: string) {
    const user = await this.usersService.findBySupabaseId(supabaseUserId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
