import { Module } from '@nestjs/common';
import { AppController } from './api-gateway.controller';
import { AppService } from './api-gateway.service';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/̉task.module';
import { RabbitmqSetupModule } from '@app/shared';

@Module({
  imports: [
    AuthModule,
    TaskModule,
    RabbitmqSetupModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class ApiGatewayModule {}
