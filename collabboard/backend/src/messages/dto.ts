import { IsString, MinLength } from 'class-validator';

export class SendMessageDto {
  @IsString() channelId!: string;
  @IsString() @MinLength(1) content!: string;
}

