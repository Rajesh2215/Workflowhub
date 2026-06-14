import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';
import { Body, Controller, HttpException, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';

@UseGuards(JwtAuthGuard)
@Controller('task')
export class TaskController {
  constructor(
    @Inject('TASK_SERVICE')
    private readonly taskClient: ClientProxy,
  ) {}

  @Post('create')
  create(@Body() body: any, @Req() req: any,) {

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
}
