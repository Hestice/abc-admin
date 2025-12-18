import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserRole } from '@abc-admin/enums';
import { CreateUserDto } from '../users/dto/create-user.dto';

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

      let user = await this.usersService.findBySupabaseId(decoded.sub);

      // If user doesn't exist in our database but exists in Supabase auth, create them
      if (!user) {
        this.logger.log(
          `🆕 Creating new user record for Supabase user: ${decoded.sub}`
        );

        const email = decoded.email || decoded.user_email;
        if (!email) {
          this.logger.warn('❌ Cannot create user: email not found in token');
          return null;
        }

        // Check if user with this email already exists (edge case)
        const existingUserByEmail = await this.usersService.findByEmail(email);
        if (existingUserByEmail) {
          this.logger.warn(
            `⚠️ User with email ${email} already exists but with different ID. Using existing user.`
          );
          user = existingUserByEmail;
        } else {
          // Create new user record
          const createUserDto: CreateUserDto = {
            id: decoded.sub, // Use Supabase user ID
            email: email,
            role: UserRole.ADMIN, // Default role for new users
            isActive: true,
          };

          try {
            user = await this.usersService.createUser(createUserDto);
            this.logger.log(`✅ Created new user: ${user.email} (${user.id})`);
          } catch (error) {
            this.logger.error(
              `❌ Failed to create user record: ${
                error instanceof Error ? error.message : String(error)
              }`
            );
            return null;
          }
        }
      }

      if (!user.isActive) {
        this.logger.warn(`❌ User account is inactive: ${user.email}`);
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
