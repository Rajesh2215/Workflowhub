import { Controller, Get } from '@nestjs/common';
import { NotificationServiceService } from './notification-service.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class NotificationServiceController {
  constructor(private readonly notificationService: NotificationServiceService) {}

  @EventPattern('task.created')
  async handleTaskCreated(data: any) {
    return this.notificationService.handleTaskCreated(data);
  }
}
