import { Controller, Get } from '@nestjs/common';
import { TaskHistoryService } from './taskhistory.service';

@Controller('taskhistory')
export class TaskhistoryController {
    constructor(private readonly taskHistoryService : TaskHistoryService) {}

    @Get()
    fetchHistory() {
        return this.taskHistoryService.fetchTaskResult()
    }
}
