import { Injectable, Res } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Result } from "./schemas/result.schema";
import { Model } from "mongoose";
import { CreateResultDto } from "./dto/create-result.dto";
import { randomUUID } from "crypto";
import { Task } from "src/tasks/schemas/task.schema";

@Injectable()
export class ResultsService {
    constructor(@InjectModel(Result.name) private resultModel : Model<Result>, @InjectModel(Task.name) private taskModel: Model<Task>) {}

    async fetchAll() : Promise<Result[]> {
        return this.resultModel.find().exec();
    }

    async createResult(createResultDto : CreateResultDto) : Promise<Result> {
        const isResultPresent = (await this.resultModel.find({"task_id" : createResultDto.task_id}).exec()).length
        if(isResultPresent > 0) {
            return;
        }
        
        const createdResult = new this.resultModel(createResultDto)
        createdResult.result_id = randomUUID().toString()
        createdResult.task_id = createdResult.task_id;
        return createdResult.save()
    }

}