import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(NotificationServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: 'notification_queue',
      noAck: false,
      queueOptions: {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': '',
          'x-dead-letter-routing-key': 'notification_dlq',
        },
      },
    },
  });

  app.listen()

}
bootstrap();
