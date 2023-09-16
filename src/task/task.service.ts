import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './interfaces/task.interface';
import { Model } from 'mongoose';

@Injectable()
export class TaskService {
  constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto) {
    const task = await this.taskModel.create(createTaskDto);
    return {
      task: {
        id: task._id,
        name: task.name,
      },
    };
  }

  async findAll() {
    const tasks = await this.taskModel.find();
    return {
      tasks: tasks,
    };
  }
}
