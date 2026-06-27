import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { Transport } from '@nestjs/microservices';
import { AppLogger, RpcCorrelationIdInterceptor } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AuthServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: 'auth_queue',
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
