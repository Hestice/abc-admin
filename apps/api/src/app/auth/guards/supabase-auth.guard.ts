import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header'
      );
    }

    const token = authHeader.substring(7);
    const user = await this.authService.getAuthenticatedUser(token);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Attach user to request
    request.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return true;
  }
}
