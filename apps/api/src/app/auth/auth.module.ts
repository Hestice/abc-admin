import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { SupabaseIdentityGuard } from './guards/supabase-identity.guard';
import { CookieService } from './services/cookie.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SupabaseAuthGuard,
    SupabaseIdentityGuard,
    CookieService,
  ],
  exports: [AuthService, SupabaseAuthGuard, SupabaseIdentityGuard],
})
export class AuthModule {}
