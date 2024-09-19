import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subjects } from './subjects.entity';
import { CreateSubjectsDto } from './dto/create-subjects.dto';
import { CreateSubjectsSchedulesProfessorsDto } from './dto/create-subjects-schedules-professors.dto';
import { Schedules } from './schedules.entity';
import { Professors } from './professors.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subjects)
    private readonly subjectsRepository: Repository<Subjects>,

    @InjectRepository(Schedules)
    private readonly schedulesRepository: Repository<Schedules>,

    @InjectRepository(Professors)
    private readonly professorsRepository: Repository<Professors>,
  ) { }

  async findAll(): Promise<Subjects[]> {
    return this.subjectsRepository.find({
      relations: ["schedules", "professors"]
    });
  }

  async findOne(id: number): Promise<Subjects> {
    const result = this.subjectsRepository.findOne({
      where: { idsubject: id },
      relations: ["schedules", "professors"]
    })

    if ((await result) === undefined) {
      throw new Error(`Subject with id ${id} not found`);
    }

    return result;
  }

  async create(createSubjectDto: CreateSubjectsDto) {
    const newSubject = new Subjects();
    newSubject.code = createSubjectDto.code;
    newSubject.classcode = createSubjectDto.classcode;
    newSubject.name = createSubjectDto.name;
    newSubject.totalvacancies = createSubjectDto.totalvacancies;
    newSubject.freevacancies = createSubjectDto.freevacancies;
    return this.subjectsRepository.save(newSubject);
  }

  async createAll(CreateSubjectsSchedulesProfessorsDto: CreateSubjectsSchedulesProfessorsDto) {
    if (CreateSubjectsSchedulesProfessorsDto.subjects.length !== 1) {
      throw new Error("Only one subject can be created at a time");
    }

    if (CreateSubjectsSchedulesProfessorsDto.schedules.length === 0) {
      throw new Error("At least one schedule must be provided");
    }

    if (CreateSubjectsSchedulesProfessorsDto.professors.length === 0) {
      throw new Error("At least one professor must be provided");
    }

    const schedules = CreateSubjectsSchedulesProfessorsDto.schedules;

    const schedules_objects = await Promise.all(schedules.map(async (schedule) => {
      // check if schedule already exists
      const schedule_exists = await this.schedulesRepository.findOne({
        where: {
          weekday: schedule.weekday,
          starttime: schedule.starttime,
          classesnumber: schedule.classesnumber,
          building: schedule.building,
          room: schedule.room
        }
      });

      if (schedule_exists) {
        // Return the existing schedule object
        return schedule_exists;
      }

      const newSchedule = new Schedules();
      newSchedule.weekday = schedule.weekday;
      newSchedule.starttime = schedule.starttime;
      newSchedule.classesnumber = schedule.classesnumber;
      newSchedule.building = schedule.building;
      newSchedule.room = schedule.room;
      return newSchedule;
    }));

    const professors = CreateSubjectsSchedulesProfessorsDto.professors;

    const professors_objects = await Promise.all(professors.map(async (professor) => {
      // check if professor already exists
      const professor_exists = await this.professorsRepository.findOne({
        where: { name: professor.name }
      });

      if (professor_exists) {
        // Return the existing professor object
        return professor_exists;
      }

      const newProfessor = new Professors();
      newProfessor.name = professor.name;
      return newProfessor; // Return the new professor object
    }));

    const subjects = CreateSubjectsSchedulesProfessorsDto.subjects;
    const newSubject = new Subjects();
    newSubject.code = subjects[0].code;
    newSubject.classcode = subjects[0].classcode;
    newSubject.name = subjects[0].name;
    newSubject.totalvacancies = subjects[0].totalvacancies;
    newSubject.freevacancies = subjects[0].freevacancies;
    newSubject.schedules = schedules_objects;
    newSubject.professors = professors_objects;

    return this.subjectsRepository.save(newSubject);

  }
}
