import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './schemas/task.schema';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private readonly taskService : TasksService) {}

    @Get()
    fetchTasks() : Promise<Task[]> {
        return this.taskService.fetchAll();
    }

    @Post()
    submitTask(@Body() createTaskDto : CreateTaskDto) : Promise<Task> {
        return this.taskService.createTask(createTaskDto);
    }
}
