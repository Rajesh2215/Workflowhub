import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';
import { Body, Controller, Get, HttpException, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { TaskDto } from '@app/shared';

function toHttpStatus(err: any) {
  const status = Number(err?.statusCode ?? err?.status);
  return Number.isInteger(status) ? status : 500;
}
@UseGuards(JwtAuthGuard)
@Controller('task')
export class TaskController {
  constructor(
    @Inject('TASK_SERVICE')
    private readonly taskClient: ClientProxy,
  ) { }

  @Post('create')
  create(@Body() body: TaskDto, @Req() req: any,) {
    return this.taskClient
      .send('task.create', { ...body, userId: req.user.id })
      .pipe(
        catchError((err) => {
          console.log('🚀 ~ TaskController ~ create ~ err:', err);
          throw new HttpException(
            err.message || 'Task Creation failed',
            err.statusCode || 500,
          );
        }),
      );
  }

  @Get('all')
  getAll(@Req() req: any) {
    return this.taskClient
      .send('task.findAllByUserId', { userId: req.user.id })
      .pipe(
        catchError((err) => {
          console.log('🚀 ~ TaskController ~ getAll ~ err:', err);
          throw new HttpException(
            err.message || 'Failed to fetch tasks',
            toHttpStatus(err),
          );
        }),
      );
  }
}
