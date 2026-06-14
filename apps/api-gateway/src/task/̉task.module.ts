import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TaskController } from './task.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthJwtModule } from '@app/auth';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TASK_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
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
    AuthJwtModule
  ],
  controllers: [TaskController],
})
export class TaskModule {}
