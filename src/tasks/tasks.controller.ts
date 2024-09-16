import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { GetTaskFilterDto } from '../dtos/get-task-filter.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { ITask } from './task.module';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTaskFilterDto): ITask[] {
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTasksWithFilters(filterDto);
    }

    return this.tasksService.getAllTasks();
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() taskBody: CreateTaskDto) {
    return this.tasksService.createTask(taskBody);
  }

  @Patch('/:id/status')
  updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const { status } = updateTaskDto;
    return this.tasksService.updateTask(id, status);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
