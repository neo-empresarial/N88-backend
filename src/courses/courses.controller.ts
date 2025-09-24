import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Courses } from './courses.entity';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from 'src/auth/guards/local-auth.guard';
//import { UpdateSubjectsDto } from './dto/update-subjects.dto'; possivelmente terei que fazer um desses para cursos

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll(): Promise<Courses[]> {
    return await this.coursesService.findAll();
  }

  @Get('search')
  async findByName(@Query('name') name: string): Promise<Courses[]> {
    return await this.coursesService.findByName(name);
  }


  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Courses> {
    return await this.coursesService.findOne(id);
  }
}