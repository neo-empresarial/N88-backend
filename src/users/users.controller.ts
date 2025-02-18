import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard) 
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('/check_extra_info')
  async checkExtraInfo(@Param('email') email: string){
    return this.usersService.checkExtraInfo(email);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: number){
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
