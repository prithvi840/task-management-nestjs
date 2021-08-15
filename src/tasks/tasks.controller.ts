import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilterTasksDTO } from './dto/filter-task-dto';
import { UpdateStatusDTO } from './dto/update-status-dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private readonly logger = new Logger('TasksController');
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: FilterTasksDTO,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User: "${user.username}" retrieving all tasks. Filters "${JSON.stringify(
        filterDto,
      )}"`,
    );
    return this.taskService.getTasks(filterDto, user);
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDTO,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" creating new task. Data ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.taskService.createTask(createTaskDto, user);
  }

  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    const task: Task = await this.taskService.getTaskById(id, user);
    if (!task) return null;
    return task;
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string, @GetUser() user: User): void {
    this.taskService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDTO,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, updateStatusDto.status, user);
  }
}
