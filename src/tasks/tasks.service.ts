import { Injectable, NotFoundException } from '@nestjs/common';

import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilterTasksDTO } from './dto/filter-task-dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private taskRepository: TasksRepository,
  ) {}

  async getTasks(filterDto: FilterTasksDTO, user: User): Promise<Array<Task>> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  createTask(newTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    return this.taskRepository.createTask(newTaskDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id, user } });
    if (!task) throw new NotFoundException(`Task with ID:${id} not found`);

    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, user });

    if (result.affected === 0)
      throw new NotFoundException(`Task with ID "${id}" not found.`);
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}
