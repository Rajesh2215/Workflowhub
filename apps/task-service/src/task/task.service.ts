import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';
import { Model } from 'mongoose';

@Injectable()
export class TaskServiceService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>
  ){}
  create(body){
    return {
      message: "Task created successfully",
      body
    }
  }
}
