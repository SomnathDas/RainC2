import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Task } from "./schemas/task.schema";
import { Model } from "mongoose";
import { CreateTaskDto } from "./dto/create-task.dto";
import { randomUUID } from "crypto";

@Injectable()
export class TasksService {
    constructor(@InjectModel(Task.name) private taskModel : Model<Task>) {}

    async fetchAll() : Promise<Task[]> {
        return this.taskModel.find().exec();
    }

    async createTask(createTaskDto : CreateTaskDto) : Promise<Task> {
        const createdTask = new this.taskModel(createTaskDto);
        createdTask.task_id = randomUUID().toString();
        return createdTask.save();
    }
}