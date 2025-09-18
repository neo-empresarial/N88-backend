import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friends, FriendStatus } from './dto/friends.entity';
import { Users } from '../user.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friends)
    private readonly friendsRepository: Repository<Friends>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async sendFriendRequest(requesterId: number, addresseeId: number) {
    if (requesterId === addresseeId) {
      throw new BadRequestException('Cannot add yourself as friend');
    }

    const existingFriendship = await this.friendsRepository.findOne({
      where: [
        { requester_id: requesterId, addressee_id: addresseeId },
        { requester_id: addresseeId, addressee_id: requesterId },
      ],
    });

    if (existingFriendship) {
      throw new BadRequestException('Friendship already exists');
    }

    const friendship = new Friends();
    friendship.requester_id = requesterId;
    friendship.addressee_id = addresseeId;
    friendship.status = FriendStatus.PENDING;

    return this.friendsRepository.save(friendship);
  }

  async acceptFriendRequest(friendshipId: number, userId: number) {
    const friendship = await this.friendsRepository.findOne({
      where: { id: friendshipId, addressee_id: userId },
    });

    if (!friendship) {
      throw new NotFoundException('Friend request not found');
    }

    friendship.status = FriendStatus.ACCEPTED;
    return this.friendsRepository.save(friendship);
  }

  async getFriends(userId: number) {
    const friendships = await this.friendsRepository.find({
      where: [
        { requester_id: userId, status: FriendStatus.ACCEPTED },
        { addressee_id: userId, status: FriendStatus.ACCEPTED },
      ],
      relations: ['requester', 'addressee'],
    });

    return friendships.map((friendship) => {
      return friendship.requester_id === userId
        ? friendship.addressee
        : friendship.requester;
    });
  }

  async getPendingRequests(userId: number) {
    return this.friendsRepository.find({
      where: { addressee_id: userId, status: FriendStatus.PENDING },
      relations: ['requester'],
    });
  }

  async removeFriend(userId: number, friendId: number) {
    const friendship = await this.friendsRepository.findOne({
      where: [
        {
          requester_id: userId,
          addressee_id: friendId,
          status: FriendStatus.ACCEPTED,
        },
        {
          requester_id: friendId,
          addressee_id: userId,
          status: FriendStatus.ACCEPTED,
        },
      ],
    });

    if (!friendship) {
      throw new NotFoundException('Friendship not found');
    }

    return this.friendsRepository.remove(friendship);
  }
}
