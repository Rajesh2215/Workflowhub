import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Task, TaskSchema } from "../schemas/task.schema";
import { TaskServiceService } from "./task.service";
import { TaskServiceController } from "./task.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema }
    ])
  ],
  controllers: [TaskServiceController],
  providers: [TaskServiceService],
  exports: [TaskServiceService],
})
export class TaskModule {}