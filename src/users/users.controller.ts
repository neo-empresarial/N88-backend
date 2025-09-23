import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { JwtAuthGuard } from 'src/auth/guards/local-auth.guard';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('/check_extra_info')
  @UseGuards(JwtAuthGuard)
  async checkExtraInfo(@Param('email') email: string) {
    return this.usersService.checkExtraInfo(email);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: any,
  ) {
    const result = await this.usersService.updateUser(id, updateUserDto);
    return result;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body(ValidationPipe) createUsersDto: CreateUsersDto) {
    return this.usersService.create(createUsersDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteOne(id);
  }
}
