import { Module } from '@nestjs/common';
import { AppController } from './api-gateway.controller';
import { AppService } from './api-gateway.service';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/̉task.module';

@Module({
  imports: [
    AuthModule,
    TaskModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class ApiGatewayModule {}
