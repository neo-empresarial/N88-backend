import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SemestersService } from './semesters.service';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { JwtAuthGuard } from 'src/auth/guards/local-auth.guard';

@Controller('semesters')
export class SemestersController {
  constructor(private readonly semestersService: SemestersService) {}

  @Get()
  async findAll() {
    return this.semestersService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body(ValidationPipe) createSemesterDto: CreateSemesterDto) {
    return this.semestersService.create(createSemesterDto);
  }
}
