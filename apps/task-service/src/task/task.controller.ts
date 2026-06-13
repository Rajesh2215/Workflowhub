import { Controller, Get } from '@nestjs/common';
import { TaskServiceService } from './task.service';
import { MessagePattern } from '@nestjs/microservices';
import { TaskDto } from '../dto/create-task.dto';

@Controller('task')
export class TaskServiceController {
  constructor(private readonly taskService: TaskServiceService) {}

  @MessagePattern('task.create')
  create(body: TaskDto) {
    return this.taskService.create(body);
  }
}
