import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create-task')
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get('list-tasks')
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.taskService.findAll();
  }
}
