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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
      req.user.iduser,
      body.recipientId,
      body.groupId,
    );
  }

  @Get()
  async getUserNotifications(@Request() req) {
    return this.notificationsService.getUserNotifications(req.user.iduser);
  }

  @Post(':id/respond')
  async respondToInvitation(
    @Param('id') id: string,
    @Body() body: { accept: boolean },
    @Request() req,
  ) {
    return this.notificationsService.respondToInvitation(
      Number(id),
      req.user.iduser,
      body.accept,
    );
  }
}
