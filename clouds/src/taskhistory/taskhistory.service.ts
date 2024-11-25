import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Result } from "src/results/schemas/result.schema";
import { Task } from "src/tasks/schemas/task.schema";

@Injectable()
export class TaskHistoryService {
    constructor(@InjectModel(Task.name) private taskModel : Model<Task>, @InjectModel(Result.name) private resultModel : Model<Result>) {}
    
    async fetchTaskResult() {
        const allTasks = await this.taskModel.find({})
        const allResults = await this.resultModel.find({})
        
        const history = []

        allTasks.map((task) => {
            allResults.map((result) => {
                if(task.task_id == result.task_id) {
                    history.push({"task_id": task.task_id, "task_type": task.task_type, "task_options": task.task_options, "result_id": result.result_id, "contents": result.contents, "success": result.success})
                }
            })
        })

        return history;
    }
}