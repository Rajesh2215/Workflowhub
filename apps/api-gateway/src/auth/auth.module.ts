import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RegistrationSagaService } from './registration-saga.service';
import { QUEUES, CorrelationIdClientRmq } from '@app/shared';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          customClass: CorrelationIdClientRmq,
          options: {
            urls: [config.get('RABBITMQ_URL')],
            queue: 'auth_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
      {
        name: 'NOTIFICATION_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          customClass: CorrelationIdClientRmq,
          options: {
            urls: [config.get('RABBITMQ_URL')],
            queue: 'notification_queue',
            queueOptions: {
              durable: true,
              arguments: {
                'x-dead-letter-exchange': 'retry.exchange',
                'x-dead-letter-routing-key': QUEUES.NOTIFY.RETRY,
              },
            },
          },
        }),
      },
      {
        name: 'TASK_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          customClass: CorrelationIdClientRmq,
          options: {
            urls: [config.get('RABBITMQ_URL')],
            queue: 'task_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [RegistrationSagaService]
})
export class AuthModule { }
