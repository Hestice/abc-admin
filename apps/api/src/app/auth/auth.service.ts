import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async verifySupabaseToken(supabaseToken: string): Promise<any> {
    this.logger.debug(`🔍 Verifying Supabase token...`);

    try {
      // Decode the token to get user info
      // Note: In production, you should verify the token signature with Supabase's public key
      const decoded = this.jwtService.decode(supabaseToken) as any;

      if (!decoded || !decoded.sub) {
        this.logger.warn('❌ Invalid token: missing sub claim');
        return null;
      }

      const user = await this.usersService.findBySupabaseId(decoded.sub);

      if (!user || !user.isActive) {
        this.logger.warn(
          `❌ User validation failed: ${decoded.sub} - ${
            !user ? 'Not found' : 'Inactive account'
          }`
        );
        return null;
      }

      this.logger.log(`✅ User authenticated via Supabase: ${user.email}`);
      return user;
    } catch (error) {
      this.logger.error('❌ Token verification failed:', error);
      return null;
    }
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
