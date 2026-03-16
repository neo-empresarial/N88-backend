import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Request,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { UsersService } from '../users.service';
import { BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/local-auth.guard';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly usersService: UsersService,
  ) {}

  @Post(':friendId')
  async sendFriendRequest(
    @Request() req,
    @Param('friendId', ParseIntPipe) friendId: number,
  ) {
    const userId = req.userId;
    if (userId === friendId) {
      throw new BadRequestException('Cannot add yourself as friend');
    }
    return this.friendsService.sendFriendRequest(userId, friendId);
  }

  @Post('accept/:friendshipId')
  async acceptFriendRequest(
    @Request() req,
    @Param('friendshipId', ParseIntPipe) friendshipId: number,
  ) {
    const userId = req.userId;
    return this.friendsService.acceptFriendRequest(friendshipId, userId);
  }

  @Post('decline/:friendshipId')
  async declineFriendRequest(
    @Request() req,
    @Param('friendshipId', ParseIntPipe) friendshipId: number,
  ) {
    const userId = req.userId;
    return this.friendsService.declineFriendRequest(friendshipId, userId);
  }

  @Get()
  async getFriends(@Request() req) {
    const userId = req.userId;
    return this.friendsService.getFriends(userId);
  }

  @Get('pending')
  async getPendingRequests(@Request() req) {
    const userId = req.user?.iduser || req.userId;
    if (!userId) {
      throw new BadRequestException('User ID not found');
    }
    return this.friendsService.getPendingRequests(userId);
  }

  @Delete(':friendId')
  async removeFriend(
    @Request() req,
    @Param('friendId', ParseIntPipe) friendId: number,
  ) {
    const userId = req.userId;
    return this.friendsService.removeFriend(userId, friendId);
  }

  @Get('search')
  async searchUsers(@Query('q') query: string, @Request() req) {
    const currentUserId = req.userId;
    if (!query || query.trim().length < 2) {
      return [];
    }
    return this.usersService.searchUsers(query.trim(), currentUserId);
  }
}
