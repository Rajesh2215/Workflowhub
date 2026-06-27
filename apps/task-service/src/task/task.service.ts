import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';
import { Model } from 'mongoose';
import { ClientProxy, RpcException } from '@nestjs/microservices';

@Injectable()
export class TaskServiceService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,

    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
  ) { }

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

  async findAllByUserId(userId: string) {
    const tasks = await this.taskModel.find({ userId });

    return {
      message: 'Tasks fetched successfully',
      tasks,
    };
  }
  async createSaga(body) {
    const task = await this.taskModel.create(body)
    if (!task) {
      throw new RpcException({
        statusCode: 400,
        message: 'Task creation failed via Saga',
      });
    }

    return {
      message: 'Task created successfully via Saga',
      task,
    };
  }

  async deleteSaga(taskId: string) {
    const result = await this.taskModel.findByIdAndDelete(taskId);
    if (!result) {
      throw new RpcException({
        statusCode: 404,
        message: `Task with ID ${taskId} not found for deletion`,
      });
    }
    return { success: true, message: 'Task deleted successfully' };
  }
}
