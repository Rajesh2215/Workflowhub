import { Controller } from '@nestjs/common';
import { NotificationServiceService } from './notification-service.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { QUEUES, EXCHANGES, getRetryCount } from '@app/shared';

@Controller()
export class NotificationServiceController {
  constructor(
    private readonly notificationService: NotificationServiceService,
  ) { }

  @EventPattern('task.created')
  async handleTaskCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    const headers = message.properties?.headers || {};
    const retryCount = getRetryCount(headers, QUEUES.NOTIFY.RETRY);

    try {
      await this.notificationService.handleTaskCreated(data);
      channel.ack(message);
    } catch (error) {
      console.log("handleTaskCreated retryCount:", retryCount);
      if (retryCount < 3) {
        console.log(`Failed to process notification, dead-lettering to retry queue.`);
        channel.nack(message, false, false);
      } else {
        console.log('Retry limit reached, publishing to DLQ and acknowledging original message.');
        channel.publish(
          EXCHANGES.DLQ.name,
          QUEUES.NOTIFY.DLQ,
          message.content,
          {
            headers,
            deliveryMode: 2,
            contentType: message.properties?.contentType || 'application/json',
          }
        );
        channel.ack(message);
      }
    }
  }
}
