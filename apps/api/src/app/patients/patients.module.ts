import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { Patient } from './entities/patient.entity';
import { UsersModule } from '../users/users.module';
import { SchedulesModule } from '../schedules/schedules.module';
import { AuthModule } from '../auth/auth.module';
import { ExposuresModule } from '../exposures/exposures.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient]),
    UsersModule,
    forwardRef(() => SchedulesModule),
    forwardRef(() => ExposuresModule),
    AuthModule,
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
