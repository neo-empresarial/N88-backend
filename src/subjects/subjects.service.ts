import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subjects } from './subjects.entity';
import { CreateSubjectsDto } from './dto/create-subjects.dto';
// import { CreateSubjectsSchedulesProfessorsDto } from './dto/create-subjects-schedules-professors.dto';
import { Schedules } from './schedules/schedules.entity';
import { Professors } from './professors/professors.entity';
import { Classes } from './classes/classes.entity';

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
  ) { }

  async findAll(): Promise<Subjects[]> {
    return this.subjectsRepository.find();
  }
  async findAllWithRelations(): Promise<Subjects[]> {
    return this.subjectsRepository.find(
      {
        relations: ["classes", "classes.schedules", "classes.professors"]
      }
    );
  }

  async findByParameter(name: string): Promise<Subjects[]> {
    // it dosent look to optmized
    const subjects = this.subjectsRepository.find()
    const filteredSubjects = (await subjects).filter(subject => subject.name.toLowerCase().includes(name.toLowerCase()))
    return filteredSubjects
  }

  async findOne(id: number): Promise<Subjects> {
    const result = this.subjectsRepository.findOne({
      where: { idsubject: id },
      relations: ["classes", "classes.schedules", "classes.professors"]
    })

    if ((await result) === undefined) {
      throw new Error(`Subject with id ${id} not found`);
    }

    return result;
  }

  async findOneByName(name: string): Promise<Subjects> {
    console.log('find one by name:', name)
    const result = this.subjectsRepository.findOne({
      where: { name: name },
      relations: ["classes", "classes.schedules", "classes.professors"]
    })

    if ((await result) === undefined) {
      throw new Error(`Subject with name ${name} not found`);
    }

    return result;
  }

  async create(createSubjectDto: CreateSubjectsDto) {
    const schedules = createSubjectDto.classes.map((class_) => class_.schedules).flat();

    const schedules_objects = await Promise.all(schedules.map(async (schedule) => {
      const newSchedule = new Schedules();
      newSchedule.weekday = schedule.weekday;
      newSchedule.starttime = schedule.starttime;
      newSchedule.classesnumber = schedule.classesnumber;
      newSchedule.building = schedule.building;
      newSchedule.room = schedule.room;
      return newSchedule;
    }));

    const professors = createSubjectDto.classes.map((class_) => class_.professors).flat();

    const professors_objects = await Promise.all(professors.map(async (professor) => {
      const professor_exists = await this.professorsRepository.findOne({
        where: { name: professor.name }
      });

      if (professor_exists) {
        return professor_exists;
      }

      const newProfessor = new Professors();
      newProfessor.name = professor.name;
      return newProfessor;
    }));

    const classes = createSubjectDto.classes;

    const classes_objects = await Promise.all(classes.map(async (class_) => {
      const newClass = new Classes();
      newClass.classcode = class_.classcode;
      newClass.totalvacancies = class_.totalvacancies;
      newClass.freevacancies = class_.freevacancies;
      newClass.schedules = schedules_objects;
      newClass.professors = professors_objects;
      return newClass;
    }));

    const subject = createSubjectDto;

    const subject_exists = await this.subjectsRepository.findOne({
      where: { code: subject.code },
      relations: ["classes", "classes.schedules", "classes.professors"]
    });

    if (subject_exists) {
      // Add the new classes to the existing subject
      subject_exists.classes = subject_exists.classes.concat(classes_objects);
      return this.subjectsRepository.save(subject_exists);
    } else {
      const newSubject = new Subjects();
      newSubject.code = subject.code;
      newSubject.name = subject.name;
      newSubject.classes = classes_objects;
      return this.subjectsRepository.save(newSubject);
    }
  }

  // async createAll(CreateSubjectsSchedulesProfessorsDto: CreateSubjectsSchedulesProfessorsDto) {


  // }

  // Delete all subjects
  async deleteAll() {
    return this.subjectsRepository.delete({});
  }
}
