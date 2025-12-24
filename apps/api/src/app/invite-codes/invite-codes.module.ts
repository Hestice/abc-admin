import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteCodesController } from './invite-codes.controller';
import { InviteCodesService } from './invite-codes.service';
import { InviteCode } from './entities/invite-code.entity';
import { InviteCodeGuard } from './guards/invite-code.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InviteCode]),
    forwardRef(() => AuthModule),
  ],
  controllers: [InviteCodesController],
  providers: [InviteCodesService, InviteCodeGuard],
  exports: [InviteCodesService, InviteCodeGuard],
})
export class InviteCodesModule {}
