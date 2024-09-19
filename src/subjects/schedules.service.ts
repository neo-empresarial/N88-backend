import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Schedules } from "./schedules.entity";
import { Repository } from "typeorm";
import { CreateSchedulesDto } from "./dto/create-schedules.dto";

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedules)
    private readonly schedulesRepository: Repository<Schedules>
  ) { }

  async findAll(): Promise<Schedules[]> {
    return this.schedulesRepository.find();
  }

  async create(createSchedulesDto: CreateSchedulesDto) {
    const newSchedule = new Schedules();
    newSchedule.weekday = createSchedulesDto.weekday;
    newSchedule.starttime = createSchedulesDto.starttime;
    newSchedule.classesnumber = createSchedulesDto.classesnumber;
    newSchedule.building = createSchedulesDto.building;
    newSchedule.room = createSchedulesDto.room;
    // newSchedule.subject = createSchedulesDto.subject;
    return this.schedulesRepository.save(newSchedule);
  }

  async findWithSubject(id: number): Promise<Schedules[]> {
    const result = this.schedulesRepository.find({
      where: { subject: { idsubject: id } },
      relations: ["subject"]
    });

    if ((await result).length === 0) {
      throw new NotFoundException(`Schedule with subject id ${id} not found`);
    }

    return result;
  }
}