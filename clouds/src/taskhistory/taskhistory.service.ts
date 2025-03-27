import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Result } from "src/results/schemas/result.schema";
import { Task } from "src/tasks/schemas/task.schema";

@Injectable()
export class TaskHistoryService {
    constructor(@InjectModel(Task.name) private taskModel : Model<Task>, @InjectModel(Result.name) private resultModel : Model<Result>) {}
    
    async fetchTaskResult() {
        const allResults = await this.resultModel.find({})
        
        const history = []

            allResults.map((result) => {
                    history.push({"task_id": result.task_id, "result_id": result.result_id, "contents": result.contents, "success": result.success})
        })

        return history;
    }
}