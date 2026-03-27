import { Test, TestingModule } from '@nestjs/testing';
import { CampusService } from './campus.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Campus } from './campus.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('CampusService', () => {
  let service: CampusService;

  const mockCampusRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampusService,
        {
          provide: getRepositoryToken(Campus),
          useValue: mockCampusRepository,
        },
      ],
    }).compile();

    service = module.get<CampusService>(CampusService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of campus', async () => {
      const campusList = [
        { id: 1, name: 'Florianópolis' },
        { id: 2, name: 'Joinville' },
      ];
      mockCampusRepository.find.mockResolvedValue(campusList);

      const result = await service.findAll();

      expect(result).toEqual(campusList);
      expect(mockCampusRepository.find).toHaveBeenCalledWith({
        order: { name: 'ASC' },
      });
    });
  });

  describe('findByName', () => {
    it('should return a campus by name', async () => {
      const campus = { id: 1, name: 'Florianópolis' };
      mockCampusRepository.findOne.mockResolvedValue(campus);

      const result = await service.findByName('Florianópolis');

      expect(result).toEqual(campus);
      expect(mockCampusRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'Florianópolis' },
      });
    });

    it('should return null if campus not found', async () => {
      mockCampusRepository.findOne.mockResolvedValue(null);

      const result = await service.findByName('Nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a campus by ID', async () => {
      const campus = { id: 1, name: 'Florianópolis' };
      mockCampusRepository.findOne.mockResolvedValue(campus);

      const result = await service.findById(1);

      expect(result).toEqual(campus);
    });

    it('should throw NotFoundException if campus not found', async () => {
      mockCampusRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new campus', async () => {
      const createDto = { name: 'Curitibanos' };
      const newCampus = { id: 3, name: 'Curitibanos' };

      mockCampusRepository.findOne.mockResolvedValue(null);
      mockCampusRepository.create.mockReturnValue(newCampus);
      mockCampusRepository.save.mockResolvedValue(newCampus);

      const result = await service.create(createDto);

      expect(result).toEqual(newCampus);
      expect(mockCampusRepository.save).toHaveBeenCalledWith(newCampus);
    });

    it('should throw ConflictException if campus already exists', async () => {
      const createDto = { name: 'Florianópolis' };
      mockCampusRepository.findOne.mockResolvedValue({
        id: 1,
        name: 'Florianópolis',
      });

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getOrCreate', () => {
    it('should return existing campus', async () => {
      const campus = { id: 1, name: 'Florianópolis' };
      mockCampusRepository.findOne.mockResolvedValue(campus);

      const result = await service.getOrCreate('Florianópolis');

      expect(result).toEqual(campus);
      expect(mockCampusRepository.save).not.toHaveBeenCalled();
    });

    it('should create new campus if not exists', async () => {
      const newCampus = { id: 4, name: 'Araranguá' };
      mockCampusRepository.findOne.mockResolvedValue(null);
      mockCampusRepository.create.mockReturnValue(newCampus);
      mockCampusRepository.save.mockResolvedValue(newCampus);

      const result = await service.getOrCreate('Araranguá');

      expect(result).toEqual(newCampus);
      expect(mockCampusRepository.save).toHaveBeenCalled();
    });
  });
});
