import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Courses } from './courses.entity';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from 'src/auth/guards/local-auth.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll(): Promise<Courses[]> {
    return this.coursesService.findAll();
  }

  @Get('search')
  async findByName(@Query('name') name: string): Promise<Courses[]> {
    return this.coursesService.findByName(name);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Courses> {
    return this.coursesService.findOne(id);
  }
}
