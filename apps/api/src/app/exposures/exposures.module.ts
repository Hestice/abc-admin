import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExposuresService } from './exposures.service';
import { ExposuresController } from './exposures.controller';
import { Exposure } from './entities/exposure.entity';
import { PatientsModule } from '../patients/patients.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exposure]),
    forwardRef(() => PatientsModule),
    AuthModule,
  ],
  controllers: [ExposuresController],
  providers: [ExposuresService],
  exports: [ExposuresService],
})
export class ExposuresModule {}
