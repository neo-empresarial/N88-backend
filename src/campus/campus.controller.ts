import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CampusService } from './campus.service';
import { CreateCampusDto } from './dto/create-campus.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { Campus } from './campus.entity';

@Controller('campus')
export class CampusController {
  constructor(private readonly campusService: CampusService) {}

  @Get()
  findAll(): Promise<Campus[]> {
    return this.campusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Campus> {
    return this.campusService.findById(id);
  }

  @Post()
  create(@Body() createCampusDto: CreateCampusDto): Promise<Campus> {
    return this.campusService.create(createCampusDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCampusDto: UpdateCampusDto,
  ): Promise<Campus> {
    return this.campusService.update(id, updateCampusDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.campusService.remove(id);
  }
}
