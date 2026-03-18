import { Test, TestingModule } from '@nestjs/testing';
import { SubjectsService } from './subjects.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Subjects } from './subjects.entity';
import { Schedules } from './schedules/schedules.entity';
import { Professors } from './professors/professors.entity';
import { Classes } from './classes/classes.entity';
import { SemestersService } from 'src/semesters/semesters.service';

describe('SubjectsService', () => {
  let service: SubjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubjectsService,
        {
          provide: getRepositoryToken(Subjects),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Schedules),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Professors),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Classes),
          useValue: {},
        },
        {
          provide: SemestersService,
          useValue: {
            getOrCreate: jest.fn().mockResolvedValue({
              id: 1,
              semester: '2026.1',
              createdAt: new Date(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<SubjectsService>(SubjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
