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
  Query,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('/check_extra_info')
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
    console.log('Controller - Received ID:', id);
    console.log('Controller - Update data:', updateUserDto);
    const result = await this.usersService.updateUser(id, updateUserDto);
    console.log('Controller - Service result:', result);
    return result;
  }

  @Post()
  async create(@Body(ValidationPipe) createUsersDto: CreateUsersDto) {
    return this.usersService.create(createUsersDto);
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteOne(id);
  }

  @Get('search')
  async searchUsers(@Query('q') query: string, @Request() req) {
    const currentUserId = req.user?.userId || req.user?.iduser || 1;
    if (!query || query.trim().length < 2) {
      return [];
    }
    return this.usersService.searchUsers(query.trim(), currentUserId);
  }
}
