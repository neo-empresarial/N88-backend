import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/guards/local-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('invite')
  async createGroupInvitation(
    @Body() body: { recipientId: number; groupId: number },
    @Request() req,
  ) {
    return this.notificationsService.createGroupInvitation(
      req.userId,
      body.recipientId,
      body.groupId,
    );
  }

  @Get()
  async getUserNotifications(@Request() req) {
    console.log('Fetching notifications for user ID:', req.userId);
    return this.notificationsService.getUserNotifications(req.userId);
  }

  @Post(':id/respond')
  async respondToInvitation(
    @Param('id') id: string,
    @Body() body: { accept: boolean },
    @Request() req,
  ) {
    return this.notificationsService.respondToInvitation(
      Number(id),
      req.userId,
      body.accept,
    );
  }
}
