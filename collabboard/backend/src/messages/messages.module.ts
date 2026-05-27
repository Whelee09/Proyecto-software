import { Module } from '@nestjs/common';
import { ChannelsModule } from '../channels/channels.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { MessagesGateway } from './messages.gateway';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({ imports: [ChannelsModule, NotificationsModule], controllers: [MessagesController], providers: [MessagesService, MessagesGateway] })
export class MessagesModule {}
