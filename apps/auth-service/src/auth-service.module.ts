import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth/auth.controller';
import { AuthConfigModule } from './core/config.module';
import { DatabaseModule } from './core/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthConfigModule, DatabaseModule, AuthModule],
  controllers: [AuthServiceController],
})
export class AuthServiceModule {}
