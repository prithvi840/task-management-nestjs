import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TasksRepository]), AuthModule], // for making tasks repository available anywhere inside tasks module.
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
