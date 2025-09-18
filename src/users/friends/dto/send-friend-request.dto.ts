import { IsNotEmpty, IsNumber } from 'class-validator';

export class SendFriendRequestDto {
  @IsNotEmpty()
  @IsNumber()
  friendId: number;
}

export class RespondToFriendRequestDto {
  @IsNotEmpty()
  @IsNumber()
  friendshipId: number;

  @IsNotEmpty()
  accept: boolean;
}
