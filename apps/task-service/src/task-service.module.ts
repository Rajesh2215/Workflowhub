import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { TaskConfigModule } from './core/config.module';
import { DatabaseModule } from './core/database.module';

@Module({
  imports: [TaskModule, TaskConfigModule, DatabaseModule],
})
export class TaskServiceModule {}
