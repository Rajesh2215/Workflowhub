import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('task')
export class TaskController {
  constructor(
    @Inject('TASK_SERVICE')
    private readonly taskClient: ClientProxy,
  ) {}

  @Post('create')
  create(@Body() body: any) {
    return this.taskClient.emit('task.create', body);
  }

}
