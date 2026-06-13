import { NestFactory } from '@nestjs/core';
import { TaskServiceModule } from './task-service.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TaskServiceModule, {
    transport: Transport.TCP,
    options: {
      port: 3002,
    },
  });

  await app.listen();
}
bootstrap()
