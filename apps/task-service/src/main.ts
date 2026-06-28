import { initTracer } from '@app/shared';
initTracer('task-service');
import { NestFactory } from '@nestjs/core';
import { TaskServiceModule } from './task-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppLogger, RpcCorrelationIdInterceptor } from '@app/shared';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(TaskServiceModule, {
    transport: Transport.GRPC,
    options: {
      package: 'task',
      protoPath: join(__dirname, '../../../libs/shared/src/proto/task.proto'),
      url: '0.0.0.0:50052', // Port 50052 for Task service
    },
    logger: new AppLogger(),
  });

  app.useGlobalInterceptors(new RpcCorrelationIdInterceptor());
  await app.listen();
}
bootstrap();
