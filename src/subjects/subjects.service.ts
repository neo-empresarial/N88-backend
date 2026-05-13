import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Subjects } from './subjects.entity';
import { CreateSubjectsDto } from './dto/create-subjects.dto';
import { UpdateSubjectsDto } from './dto/update-subjects.dto';
import { Schedules } from './schedules/schedules.entity';
import { Professors } from './professors/professors.entity';
import { Classes } from './classes/classes.entity';
import { SemestersService } from 'src/semesters/semesters.service';
import { CampusService } from 'src/campus/campus.service';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subjects)
    private readonly subjectsRepository: Repository<Subjects>,

    @InjectRepository(Schedules)
    private readonly schedulesRepository: Repository<Schedules>,

    @InjectRepository(Professors)
    private readonly professorsRepository: Repository<Professors>,

    @InjectRepository(Classes)
    private readonly classesRepository: Repository<Classes>,

    private readonly semestersService: SemestersService,
    private readonly campusService: CampusService,
  ) {}

  async findAll(): Promise<Subjects[]> {
    return this.subjectsRepository.find({
      relations: [
        'classes',
        'classes.schedules',
        'classes.professors',
        'semester',
        'campus',
      ],
    });
  }

  async findAllWithRelations(): Promise<Subjects[]> {
    return this.subjectsRepository.find({
      relations: [
        'classes',
        'classes.schedules',
        'classes.professors',
        'semester',
        'campus',
      ],
    });
  }

  async findByCampus(campusId: number): Promise<Subjects[]> {
    return this.subjectsRepository.find({
      where: {
        campus: { id: campusId },
      },
      relations: [
        'classes',
        'classes.schedules',
        'classes.professors',
        'semester',
        'campus',
      ],
    });
  }

  async findByParameter(name: string): Promise<Subjects[]> {
    const subjects = this.subjectsRepository.find();
    const filteredSubjects = (await subjects).filter((subject) =>
      subject.name.toLowerCase().includes(name.toLowerCase()),
    );
    return filteredSubjects;
  }

  async findOne(id: number): Promise<Subjects> {
    const subject = await this.subjectsRepository.findOne({
      where: { idsubject: id },
      relations: [
        'classes',
        'classes.schedules',
        'classes.professors',
        'semester',
        'campus',
      ],
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    return subject;
  }

  async findOneByName(name: string): Promise<Subjects> {
    const result = this.subjectsRepository.findOne({
      where: { name: name },
      relations: [
        'classes',
        'classes.schedules',
        'classes.professors',
        'semester',
        'campus',
      ],
    });

    if ((await result) === undefined) {
      throw new Error(`Subject with name ${name} not found`);
    }

    return result;
  }

  async create(createSubjectDto: CreateSubjectsDto) {
    const classes = createSubjectDto.classes;

    const semesterEntity = await this.semestersService.getOrCreate(
      createSubjectDto.semester,
    );

    const campusEntity = await this.campusService.getOrCreate(
      createSubjectDto.campus,
    );

    const classes_objects = await Promise.all(
      classes.map(async (class_) => {
        const schedules_objects = await Promise.all(
          (class_.schedules || []).map(async (schedule) => {
            const newSchedule = new Schedules();
            newSchedule.weekday = schedule.weekday;
            newSchedule.starttime = schedule.starttime;
            newSchedule.classesnumber = schedule.classesnumber;
            newSchedule.building = schedule.building;
            newSchedule.room = schedule.room;
            return newSchedule;
          }),
        );

        const uniqueProfessorsMap = new Map();
        for (const prof of class_.professors || []) {
          if (!uniqueProfessorsMap.has(prof.name)) {
            uniqueProfessorsMap.set(prof.name, prof);
          }
        }
        const uniqueProfessors = Array.from(uniqueProfessorsMap.values());

        const professors_objects = await Promise.all(
          uniqueProfessors.map(async (professor: any) => {
            const professor_exists = await this.professorsRepository.findOne({
              where: { name: professor.name },
            });

            if (professor_exists) {
              return professor_exists;
            }

            const newProfessor = new Professors();
            newProfessor.name = professor.name;
            return this.professorsRepository.save(newProfessor);
          }),
        );

        const newClass = new Classes();
        newClass.classcode = class_.classcode;
        newClass.totalvacancies = class_.totalvacancies;
        newClass.freevacancies = class_.freevacancies;
        newClass.schedules = schedules_objects;
        newClass.professors = professors_objects;
        return newClass;
      }),
    );

    const subject = createSubjectDto;

    const subject_exists = await this.subjectsRepository.findOne({
      where: {
        code: subject.code,
        semester: { id: semesterEntity.id },
        campus: { id: campusEntity.id },
      },
      relations: [
        'classes',
        'classes.schedules',
        'classes.professors',
        'semester',
        'campus',
      ],
    });

    if (subject_exists) {
      const existingClassCodes = new Set(
        subject_exists.classes.map((c) => c.classcode),
      );
      const newClassesObjects = classes_objects.filter(
        (c) => !existingClassCodes.has(c.classcode),
      );

      if (newClassesObjects.length > 0) {
        subject_exists.classes =
          subject_exists.classes.concat(newClassesObjects);
        subject_exists.orders_without_vacancy =
          subject.orders_without_vacancy ?? 0;
        return this.subjectsRepository.save(subject_exists);
      }
      subject_exists.orders_without_vacancy =
        subject.orders_without_vacancy ?? 0;
      await this.subjectsRepository.save(subject_exists);
      return subject_exists;
    } else {
      const newSubject = new Subjects();
      newSubject.code = subject.code;
      newSubject.name = subject.name;
      newSubject.semester = semesterEntity;
      newSubject.campus = campusEntity;
      newSubject.classes = classes_objects;
      newSubject.orders_without_vacancy = subject.orders_without_vacancy ?? 0;
      return this.subjectsRepository.save(newSubject);
    }
  }

  async deleteAll() {
    return this.subjectsRepository.delete({});
  }

  async findByCodes(codes: string[]): Promise<Subjects[]> {
    if (!codes || codes.length === 0) {
      return [];
    }

    try {
      const subjects = await this.subjectsRepository.find({
        where: { code: In(codes) },
        relations: [
          'classes',
          'classes.schedules',
          'classes.professors',
          'semester',
        ],
      });

      return subjects;
    } catch (error) {
      console.error('Error finding subjects by codes:', error);
      throw error;
    }
  }

  async update(
    id: number,
    updateSubjectDto: UpdateSubjectsDto,
  ): Promise<Subjects> {
    const subject = await this.findOne(id);

    if (updateSubjectDto.code) {
      subject.code = updateSubjectDto.code;
    }
    if (updateSubjectDto.name) {
      subject.name = updateSubjectDto.name;
    }
    if (updateSubjectDto.orders_without_vacancy !== undefined) {
      subject.orders_without_vacancy = updateSubjectDto.orders_without_vacancy;
    }

    return this.subjectsRepository.save(subject);
  }

  async updateByCode(
    code: string,
    updateSubjectDto: UpdateSubjectsDto,
  ): Promise<Subjects> {
    const subject = await this.subjectsRepository.findOne({
      where: { code },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with code ${code} not found`);
    }

    if (updateSubjectDto.code) {
      subject.code = updateSubjectDto.code;
    }
    if (updateSubjectDto.name) {
      subject.name = updateSubjectDto.name;
    }
    if (updateSubjectDto.orders_without_vacancy !== undefined) {
      subject.orders_without_vacancy = updateSubjectDto.orders_without_vacancy;
    }

    return this.subjectsRepository.save(subject);
  }

  async remove(id: number): Promise<void> {
    const subject = await this.findOne(id);
    await this.subjectsRepository.remove(subject);
  }
}
