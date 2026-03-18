import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Semesters } from './semesters.entity';
import { CreateSemesterDto } from './dto/create-semester.dto';

@Injectable()
export class SemestersService {
  constructor(
    @InjectRepository(Semesters)
    private readonly semestersRepository: Repository<Semesters>,
  ) {}

  async findAll(): Promise<Semesters[]> {
    return this.semestersRepository.find({
      order: { semester: 'DESC' },
    });
  }

  async findBySemester(semester: string): Promise<Semesters | null> {
    return this.semestersRepository.findOne({
      where: { semester },
    });
  }

  async findById(id: number): Promise<Semesters> {
    const semester = await this.semestersRepository.findOne({
      where: { id },
    });

    if (!semester) {
      throw new NotFoundException(`Semestre com ID ${id} não encontrado`);
    }

    return semester;
  }

  async create(createSemesterDto: CreateSemesterDto): Promise<Semesters> {
    const exists = await this.findBySemester(createSemesterDto.semester);

    if (exists) {
      throw new ConflictException(
        `Semestre ${createSemesterDto.semester} já existe`,
      );
    }

    const newSemester = this.semestersRepository.create({
      semester: createSemesterDto.semester,
    });

    return this.semestersRepository.save(newSemester);
  }

  async getOrCreate(semester: string): Promise<Semesters> {
    const exists = await this.findBySemester(semester);

    if (exists) {
      return exists;
    }

    const newSemester = this.semestersRepository.create({ semester });
    return this.semestersRepository.save(newSemester);
  }
}
