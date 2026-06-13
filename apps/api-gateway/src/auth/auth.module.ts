import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports:[
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST,
          port: Number(process.env.AUTH_SERVICE_PORT),
        },
      }
    ]),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
