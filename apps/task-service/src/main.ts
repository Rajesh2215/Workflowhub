import { NestFactory } from '@nestjs/core';
import { TaskServiceModule } from './task-service.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TaskServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: 'task_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.listen();
}
bootstrap()
