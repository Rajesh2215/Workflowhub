import { Controller, Get } from '@nestjs/common';
import { NotificationServiceService } from './notification-service.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class NotificationServiceController {
  constructor(
    private readonly notificationService: NotificationServiceService,
  ) {}

  @EventPattern('task.created')
  async handleTaskCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.notificationService.handleTaskCreated(data);
      channel.ack(message);
    } catch (error) {
      // channel.nack(message);
      channel.nack(message, false, false);
      // allUpTo=false => reject only this message
      // requeue=false => do not put it back on the queue (send to DLQ if configured)
      // changing requeue to true means Retries using 
    }
  }
}
