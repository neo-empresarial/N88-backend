import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campus } from './campus.entity';
import { CreateCampusDto } from './dto/create-campus.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';

@Injectable()
export class CampusService {
  constructor(
    @InjectRepository(Campus)
    private readonly campusRepository: Repository<Campus>,
  ) {}

  async findAll(): Promise<Campus[]> {
    return this.campusRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findByName(name: string): Promise<Campus | null> {
    return this.campusRepository.findOne({
      where: { name },
    });
  }

  async findById(id: number): Promise<Campus> {
    const campus = await this.campusRepository.findOne({
      where: { id },
    });

    if (!campus) {
      throw new NotFoundException(`Campus com ID ${id} não encontrado`);
    }

    return campus;
  }

  async create(createCampusDto: CreateCampusDto): Promise<Campus> {
    const exists = await this.findByName(createCampusDto.name);

    if (exists) {
      throw new ConflictException(`Campus ${createCampusDto.name} já existe`);
    }

    const newCampus = this.campusRepository.create({
      name: createCampusDto.name,
    });

    return this.campusRepository.save(newCampus);
  }

  async update(id: number, updateCampusDto: UpdateCampusDto): Promise<Campus> {
    const campus = await this.findById(id);

    if (updateCampusDto.name && updateCampusDto.name !== campus.name) {
      const exists = await this.findByName(updateCampusDto.name);
      if (exists) {
        throw new ConflictException(`Campus ${updateCampusDto.name} já existe`);
      }
    }

    Object.assign(campus, updateCampusDto);
    return this.campusRepository.save(campus);
  }

  async remove(id: number): Promise<void> {
    const campus = await this.findById(id);
    await this.campusRepository.remove(campus);
  }

  async getOrCreate(name: string): Promise<Campus> {
    const exists = await this.findByName(name);

    if (exists) {
      return exists;
    }

    const newCampus = this.campusRepository.create({ name });
    return this.campusRepository.save(newCampus);
  }
}
