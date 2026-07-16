import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class SupabaseIdentityGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const identity = await this.authService.verifySupabaseToken(
      authorization.substring(7)
    );

    if (!identity) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    request.identity = identity;
    return true;
  }
}
