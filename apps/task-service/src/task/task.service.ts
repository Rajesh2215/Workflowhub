import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TaskServiceService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,

    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
  ) {}
  
  async create(body) {
    const task = await this.taskModel.create(body);

    this.notificationClient.emit('task.created', {
      userId: body.userId,
      taskId: task._id,
      title: task.title,
      message: "Task Created Successfully",
      type: "EMAIL"
    });

    return {
      message: 'Task created successfully',
      task,
    };
  }
}
