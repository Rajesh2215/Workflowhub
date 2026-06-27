import { NestFactory } from '@nestjs/core';
import { TaskServiceModule } from './task-service.module';
import { Transport } from '@nestjs/microservices';
import { AppLogger, RpcCorrelationIdInterceptor } from '@app/shared';

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
    logger: new AppLogger(),
  });

  app.useGlobalInterceptors(new RpcCorrelationIdInterceptor());
  await app.listen();
}
bootstrap()
