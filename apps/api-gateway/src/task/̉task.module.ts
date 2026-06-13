import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TaskController } from './task.controller';

@Module({
  imports:[
    ClientsModule.register([
      {
        name: 'TASK_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.TASK_SERVICE_HOST,
          port: Number(process.env.TASK_SERVICE_PORT),
        },
      },
    ]),
  ],
  controllers: [TaskController],
})
export class TaskModule {}
