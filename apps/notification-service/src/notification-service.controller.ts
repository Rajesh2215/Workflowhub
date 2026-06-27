import { Controller, Logger } from '@nestjs/common';
import { NotificationServiceService } from './notification-service.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext, RpcException } from '@nestjs/microservices';
import { QUEUES, EXCHANGES, getRetryCount, RedisService } from '@app/shared';

@Controller()
export class NotificationServiceController {
  private readonly logger = new Logger(NotificationServiceController.name);

  constructor(
    private readonly notificationService: NotificationServiceService,
    private readonly redisService: RedisService, // <-- Inject Redis
  ) { }

  @EventPattern('task.created')
  async handleTaskCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    const headers = message.properties?.headers || {};
    const retryCount = getRetryCount(headers, QUEUES.NOTIFY.RETRY);

    // 1. Idempotency Check using ioredis positional arguments
    const redis = this.redisService.getClient();
    const key = `event:${data.taskId || data.eventId}`; // or whichever field has the unique ID

    const result = await redis.set(
      key,
      'processed',
      'EX',
      86400, // 24 Hours TTL
      'NX'   // Only set if it doesn't exist
    );

    if (result !== 'OK') {
      console.warn(`Duplicate event detected for taskId: ${data.taskId}. Skipping processing.`);
      channel.ack(message);
      return;
    }

    // 2. Process message
    try {
      await this.notificationService.handleTaskCreated(data);
      channel.ack(message);
    } catch (error) {
      // 3. Clear Redis key if processing fails so we can retry
      await redis.del(key);

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

  @MessagePattern('notification.sendSaga')
  async sendSaga(@Payload() data: any) {
    try {
      this.logger.log(`Sending welcome notification via Saga for user: ${data.userId}`);
      const notification = await this.notificationService.createNotification(data);
      return {
        message: 'Notification sent successfully via Saga',
        notification,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: error.message || 'Notification creation failed in Saga',
      });
    }
  }

  @MessagePattern('notification.deleteSaga')
  async deleteNotification(@Payload() data: { notificationId: string }) {
    try {
      const result = await this.notificationService.deleteNotification(data.notificationId);
      return result;
    } catch (error) {
      throw new RpcException({
        statusCode: 404,
        message: error.message || 'Notification deletion failed',
      });
    }
  }
}
