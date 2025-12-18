import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { CookieService } from './services/cookie.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, SupabaseAuthGuard, CookieService],
  exports: [AuthService, SupabaseAuthGuard],
})
export class AuthModule {}
