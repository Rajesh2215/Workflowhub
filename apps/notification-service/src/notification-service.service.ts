import { Injectable } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from '../schema/create-notification.schema';
import { Model } from 'mongoose';

@Injectable()
export class NotificationServiceService {

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Document>
  ) { }
  async handleTaskCreated(data: any) {
    // send email or push notification
    return this.notificationModel.create(data)

  }
}
