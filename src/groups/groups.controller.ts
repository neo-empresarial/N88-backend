// src/groups/groups.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dtos/create-group.dto';
import { UpdateGroupDto } from './dtos/update-group.dto';
import { AddMemberDto } from './dtos/add-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @Request() req) {
    console.log('Creating group with data:', createGroupDto);
    console.log('User from request:', req.user);
    return this.groupsService.create(createGroupDto, req.user.iduser);
  }

  @Get()
  findAll(@Request() req) {
    console.log('Finding all groups for user:', req.user.iduser);
    return this.groupsService.findAll(req.user.iduser);
  }

  @Get('search-users')
  searchUsers(@Query('q') query: string, @Request() req) {
    return this.groupsService.searchUsers(query, req.user.iduser);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.groupsService.findOne(id, req.user.iduser);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @Request() req,
  ) {
    return this.groupsService.update(id, updateGroupDto, req.user.iduser);
  }

  @Post(':id/members/:userId')
  addMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Request() req,
  ) {
    return this.groupsService.addMember(id, userId, req.user.iduser);
  }

  @Delete(':id/members/:userId')
  removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Request() req,
  ) {
    return this.groupsService.removeMember(id, userId, req.user.iduser);
  }

  @Post(':id/leave')
  leaveGroup(@Param('id') id: string, @Request() req) {
    return this.groupsService.removeMember(
      id,
      req.user.iduser,
      req.user.iduser,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.groupsService.remove(id, req.user.iduser);
  }
}
