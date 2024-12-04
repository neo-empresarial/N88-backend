import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':code')
  async findById(@Param('code') id: number){
    return this.usersService.findById(id);
  }

  @Post()
  async create(@Body(ValidationPipe) createUsersDto: CreateUsersDto) {
    return this.usersService.create(createUsersDto);
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteOne(id);
  }

}
