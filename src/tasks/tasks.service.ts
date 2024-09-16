import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { GetTaskFilterDto } from '../dtos/get-task-filter.dto';
import { ITask, TaskStatus } from './task.module';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  getAllTasks(): ITask[] {
    return this.tasks;
  }

  getTaskById(id: string): ITask {
    const found = this.tasks.find((task) => task.id === id);

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto;
    const task: ITask = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string) {
    this.getTaskById(id);

    this.tasks = this.tasks.filter((task) => task.id !== id);

    return { message: 'Task deleted successfully' };
  }

  updateTask(id: string, status: TaskStatus) {
    const task = this.getTaskById(id);
    if (!task) {
      return { message: 'Task not found' };
    }
    task.status = status;
    return task;
  }

  getTasksWithFilters(filterDto: GetTaskFilterDto): ITask[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }
}
