import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { PatientProfile } from './users/entities/patient-profile.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const useSupabase = configService.get<string>('USE_SUPABASE') === 'true';
        
        if (useSupabase) {
          const supabaseUrl = configService.get<string>('SUPABASE_URL');
          if (!supabaseUrl) {
            throw new Error('SUPABASE_URL is required when USE_SUPABASE is true');
          }
          
          return {
            type: 'postgres',
            host: new URL(supabaseUrl).hostname,
            port: 5432,
            username: 'postgres',
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_DATABASE'),
            ssl: true,
            entities: [User, PatientProfile],
            synchronize: false,
            extra: {
              poolSize: 20,
            },
          };
        }
        
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'postgres'),
          database: configService.get<string>('DB_DATABASE', 'abc_admin'),
          entities: [User, PatientProfile],
          synchronize: configService.get<string>('NODE_ENV') !== 'production',
        };
      },
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
