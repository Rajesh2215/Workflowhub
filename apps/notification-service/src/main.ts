import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module';
import { Transport } from '@nestjs/microservices';
import { QUEUES, AppLogger, RpcCorrelationIdInterceptor } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(NotificationServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: QUEUES.NOTIFY.MAIN,
      noAck: false,
      queueOptions: {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': 'retry.exchange',
          'x-dead-letter-routing-key': QUEUES.NOTIFY.RETRY,
        },
      },
    },
    logger: new AppLogger(),
  });

  app.useGlobalInterceptors(new RpcCorrelationIdInterceptor());
  await app.listen();
}
bootstrap();
