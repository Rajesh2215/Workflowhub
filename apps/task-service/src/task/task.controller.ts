import { Controller, Get } from '@nestjs/common';
import { TaskServiceService } from './task.service';
import { MessagePattern } from '@nestjs/microservices';
import { TaskDto } from '../dto/create-task.dto';

@Controller('task')
export class TaskServiceController {
  constructor(private readonly taskService: TaskServiceService) { }

  @MessagePattern('task.create')
  create(body: TaskDto) {
    return this.taskService.create(body);
  }

  @MessagePattern('task.findAllByUserId')
  findAllByUserId(body: { userId: string }) {
    return this.taskService.findAllByUserId(body.userId);
  }

  @MessagePattern('task.createSaga')
  createSaga(data: TaskDto) {
    return this.taskService.createSaga(data);
  }

  @MessagePattern('task.deleteSaga')
  deleteSaga(data: { taskId: string }) {
    return this.taskService.deleteSaga(data.taskId)
  }
}
