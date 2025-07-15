import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SharedSchedulesService } from './shared-schedules.service';
import { SharedSchedules } from './shared-schedules.entity';
import { SavedSchedules } from './savedschedules.entity';
import { SavedScheduleItems } from './savedscheduleitems.entity';
import { Users } from '../user.entity';
import { Group } from '../../groups/groups.entity';
import { NotFoundException } from '@nestjs/common';

describe('SharedSchedulesService', () => {
  let service: SharedSchedulesService;
  let mockSharedSchedulesRepository: any;
  let mockSavedSchedulesRepository: any;
  let mockSavedScheduleItemsRepository: any;
  let mockUsersRepository: any;
  let mockGroupsRepository: any;

  beforeEach(async () => {
    mockSharedSchedulesRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    mockSavedSchedulesRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockSavedScheduleItemsRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    mockUsersRepository = {
      findOne: jest.fn(),
    };

    mockGroupsRepository = {
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SharedSchedulesService,
        {
          provide: getRepositoryToken(SharedSchedules),
          useValue: mockSharedSchedulesRepository,
        },
        {
          provide: getRepositoryToken(SavedSchedules),
          useValue: mockSavedSchedulesRepository,
        },
        {
          provide: getRepositoryToken(SavedScheduleItems),
          useValue: mockSavedScheduleItemsRepository,
        },
        {
          provide: getRepositoryToken(Users),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(Group),
          useValue: mockGroupsRepository,
        },
      ],
    }).compile();

    service = module.get<SharedSchedulesService>(SharedSchedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('shareSchedule', () => {
    it('should throw NotFoundException when schedule not found', async () => {
      mockSavedSchedulesRepository.findOne.mockResolvedValue(null);
      mockGroupsRepository.createQueryBuilder.mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.shareSchedule(1, { scheduleId: 1, groupId: 1 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when group not found or user not member', async () => {
      mockSavedSchedulesRepository.findOne.mockResolvedValue({ id: 1 });
      mockGroupsRepository.createQueryBuilder.mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.shareSchedule(1, { scheduleId: 1, groupId: 1 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getSharedSchedulesForUser', () => {
    it('should return shared schedules for user', async () => {
      const mockSharedSchedules = [
        {
          id: 1,
          scheduleId: 1,
          sharedByUserId: 2,
          sharedByUser: { name: 'John' },
          sharedWithUserId: 1,
          groupId: 1,
          group: { name: 'Test Group' },
          sharedAt: new Date(),
          isAccepted: false,
          originalSchedule: {
            title: 'Test Schedule',
            description: 'Test Description',
            items: [],
          },
        },
      ];

      mockSharedSchedulesRepository.find.mockResolvedValue(mockSharedSchedules);

      const result = await service.getSharedSchedulesForUser(1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].sharedByUserName).toBe('John');
    });
  });
});
