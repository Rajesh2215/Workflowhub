import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './api-gateway.controller';
import { AppService } from './api-gateway.service';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/̉task.module';
import { HttpCorrelationMiddleware, RabbitmqSetupModule, RedisModule } from '@app/shared';
import { RedisThrottlerGuard } from './common/guards/redis-throttler.guard';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'apps/api-gateway/.env' }),
    AuthModule,
    TaskModule,
    RabbitmqSetupModule,
    RedisModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RedisThrottlerGuard,
    },
  ],
})
export class ApiGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpCorrelationMiddleware).forRoutes('*');
  }
}
