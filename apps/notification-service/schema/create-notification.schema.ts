import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type NotificationDocument = Notification & Document

export enum NotificationType {
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  userId!: string;
  
  @Prop({ required: true })
  taskId!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  message!: string;

  @Prop({
    enum: NotificationType,
    default: NotificationType.IN_APP,
  })
  type!: NotificationType;

  @Prop({ default: false })
  isRead!: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
