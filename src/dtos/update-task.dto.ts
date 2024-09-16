import { IsEnum } from 'class-validator';
import { TaskStatus } from '../tasks/task.module';

export class UpdateTaskDto {
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
