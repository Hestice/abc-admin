import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    this.logger.debug(`🔍 Validating user credentials...`);
    const user = await this.usersService.findByUsername(username);

    if (!user || !user.isActive) {
      this.logger.warn(
        `❌ User validation failed: ${username} - ${
          !user ? 'Not found' : 'Inactive account'
        }`
      );
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      this.logger.log(`✅ User authenticated: ${username}`);
      const { password, ...result } = user;
      return result;
    }

    this.logger.warn(
      `❌ Authentication failed: Invalid password for ${username}`
    );
    return null;
  }

  async login(loginDto: LoginDto, request?: any) {
    this.logger.log(`🔐 Login attempt for user: ${loginDto.username}`);
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      this.logger.warn(
        `Login rejected: Invalid credentials for ${loginDto.username}`
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    const logData = {
      event: 'USER_LOGIN_SUCCESS',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      token: {
        value:
          token.substring(0, 3) + '...' + token.substring(token.length - 3), // Partial token for security
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      },
      timestamp: new Date().toISOString(),
    };

    this.logger.log(
      `Authentication successful:\n${JSON.stringify(logData, null, 2)}`
    );

    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
}
