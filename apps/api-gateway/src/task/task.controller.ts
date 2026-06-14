import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';
import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@UseGuards(JwtAuthGuard)
@Controller('task')
export class TaskController {
  constructor(
    @Inject('TASK_SERVICE')
    private readonly taskClient: ClientProxy,
  ) {}

  @Post('create')
  create(@Body() body: any) {
    return this.taskClient.send('task.create', body);
  }

}
