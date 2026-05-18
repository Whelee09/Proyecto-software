import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, CurrentUser } from '../common/current-user.decorator';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto';

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messages: MessagesService) {}
  @Get('channel/:channelId') byChannel(@Param('channelId') channelId: string, @CurrentUser() user: AuthUser) { return this.messages.byChannel(channelId, user); }
  @Post() send(@Body() dto: SendMessageDto, @CurrentUser() user: AuthUser) { return this.messages.send(dto, user); }
}
