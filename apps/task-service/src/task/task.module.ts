import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Task, TaskSchema } from "../schemas/task.schema";
import { TaskServiceService } from "./task.service";
import { TaskServiceController } from "./task.controller";
import { ClientsModule } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { QUEUES, CorrelationIdClientRmq } from "@app/shared";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema }
    ]),
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATION_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          customClass: CorrelationIdClientRmq,
          options: {
            urls: [config.get('RABBITMQ_URL')],
            queue: QUEUES.NOTIFY.MAIN,
            queueOptions: {
              durable: true,
              arguments: {
                'x-dead-letter-exchange': 'retry.exchange',
                'x-dead-letter-routing-key': QUEUES.NOTIFY.RETRY,
              },
            },
          },
        }),
      },
    ]),
  ],
  controllers: [TaskServiceController],
  providers: [TaskServiceService],
  exports: [TaskServiceService],
})
export class TaskModule { }