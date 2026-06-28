import { initTracer } from '@app/shared';
initTracer('auth-service');
import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppLogger, RpcCorrelationIdInterceptor } from '@app/shared';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthServiceModule, {
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(__dirname, '../../../libs/shared/src/proto/auth.proto'),
      url: '0.0.0.0:50051',
    },
    logger: new AppLogger(),
  });

  app.useGlobalInterceptors(new RpcCorrelationIdInterceptor());
  await app.listen();
}
bootstrap();
