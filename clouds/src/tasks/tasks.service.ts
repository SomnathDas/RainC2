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
        if(typeof(createTaskDto.task_options) == "string") {
            createdTask.task_options = JSON.parse(createTaskDto.task_options)
        }
        createdTask.task_id = randomUUID().toString();
        console.log(createdTask)
        return createdTask.save();
    }
}