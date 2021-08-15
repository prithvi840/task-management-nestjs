import { TaskStatus } from '../task-status.enum';
import { IsEnum } from 'class-validator';

export class UpdateStatusDTO {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
