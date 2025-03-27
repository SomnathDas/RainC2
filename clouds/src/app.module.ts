import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksController } from './tasks/tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksService } from './tasks/tasks.service';
import { Task, TaskSchema } from './tasks/schemas/task.schema';
import { ResultsController } from './results/results.controller';
import { Result, ResultSchema } from './results/schemas/result.schema';
import { ResultsService } from './results/results.service';
import { TaskhistoryController } from './taskhistory/taskhistory.controller';
import { TaskHistoryService } from './taskhistory/taskhistory.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{name: Task.name, schema: TaskSchema}]),
    MongooseModule.forFeature([{name: Result.name, schema: ResultSchema}]),
    
  ],
  controllers: [AppController, TasksController, ResultsController, TaskhistoryController],
  providers: [AppService, TasksService, ResultsService, TaskHistoryService],
})
export class AppModule {}
