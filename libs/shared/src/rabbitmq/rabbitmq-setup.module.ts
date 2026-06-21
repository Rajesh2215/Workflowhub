import { Module } from '@nestjs/common';
import { RabbitmqSetupService } from './rabbitmq-setup.service';

@Module({
  providers: [RabbitmqSetupService],
  exports: [RabbitmqSetupService],
})
export class RabbitmqSetupModule {}
