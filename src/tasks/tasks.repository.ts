import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { Repository, EntityRepository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilterTasksDTO } from './dto/filter-task-dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository', { timestamp: true });

  async getTasks(filterDto: FilterTasksDTO, user: User): Promise<Task[]> {
    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (filterDto.status)
      query.andWhere('task.status = :status', { status: filterDto.status });

    if (filterDto.search)
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${filterDto.search}%` },
      );

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }". Filters ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(newTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    const task = this.create({
      title: newTaskDto.title,
      description: newTaskDto.description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);

    return task;
  }
}
