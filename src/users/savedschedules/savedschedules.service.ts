import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedSchedules } from './savedschedules.entity';
import { SavedScheduleItems } from './savedscheduleitems.entity';
import { CreateSavedScheduleDto } from './dto/create-savedschedule.dto';
import { SavedScheduleResponseDto } from './dto/saved-schedule-response.dto';

@Injectable()
export class SavedSchedulesService {
  constructor(
    @InjectRepository(SavedSchedules)
    private readonly savedSchedulesRepository: Repository<SavedSchedules>,
    @InjectRepository(SavedScheduleItems)
    private readonly savedScheduleItemsRepository: Repository<SavedScheduleItems>,
  ) {}

  async create(
    userId: number,
    createSavedScheduleDto: CreateSavedScheduleDto,
  ): Promise<SavedScheduleResponseDto> {
    const savedSchedule = new SavedSchedules();
    savedSchedule.title = createSavedScheduleDto.title;
    savedSchedule.description = createSavedScheduleDto.description;
    savedSchedule.user = { iduser: userId } as any;

    const savedScheduleItems = createSavedScheduleDto.items.map((item) => {
      const scheduleItem = new SavedScheduleItems();
      scheduleItem.subjectCode = item.subjectCode;
      scheduleItem.classCode = item.classCode;
      scheduleItem.activated = item.activated;
      scheduleItem.savedSchedule = savedSchedule;
      return scheduleItem;
    });

    savedSchedule.items = savedScheduleItems;

    const result = await this.savedSchedulesRepository.save(savedSchedule);
    return this.findOne(result.idsavedschedule, userId);
  }

  async findAllByUser(userId: number): Promise<SavedScheduleResponseDto[]> {
    const schedules = await this.savedSchedulesRepository.find({
      where: { user: { iduser: userId } },
      relations: ['items'],
    });

    return schedules.map((schedule) => ({
      idsavedschedule: schedule.idsavedschedule,
      title: schedule.title,
      description: schedule.description,
      items: schedule.items.map((item) => ({
        subjectCode: item.subjectCode,
        classCode: item.classCode,
        activated: item.activated,
      })),
    }));
  }

  async findOne(id: number, userId: number): Promise<SavedScheduleResponseDto> {
    const savedSchedule = await this.savedSchedulesRepository.findOne({
      where: { idsavedschedule: id, user: { iduser: userId } },
      relations: ['items'],
    });

    if (!savedSchedule) {
      throw new NotFoundException(`Saved schedule with ID ${id} not found`);
    }

    return {
      idsavedschedule: savedSchedule.idsavedschedule,
      title: savedSchedule.title,
      description: savedSchedule.description,
      items: savedSchedule.items.map((item) => ({
        subjectCode: item.subjectCode,
        classCode: item.classCode,
        activated: item.activated,
      })),
    };
  }

  async update(
    id: number,
    userId: number,
    updateSavedScheduleDto: CreateSavedScheduleDto,
  ): Promise<SavedScheduleResponseDto> {
    const savedSchedule = await this.findOne(id, userId);

    savedSchedule.title = updateSavedScheduleDto.title;
    savedSchedule.description = updateSavedScheduleDto.description;

    await this.savedScheduleItemsRepository.delete({
      savedSchedule: { idsavedschedule: id },
    });

    const savedScheduleItems = updateSavedScheduleDto.items.map((item) => {
      const scheduleItem = new SavedScheduleItems();
      scheduleItem.subjectCode = item.subjectCode;
      scheduleItem.classCode = item.classCode;
      scheduleItem.activated = item.activated;
      scheduleItem.savedSchedule = savedSchedule as any;
      return scheduleItem;
    });

    const scheduleToUpdate = await this.savedSchedulesRepository.findOne({
      where: { idsavedschedule: id },
    });

    if (!scheduleToUpdate) {
      throw new NotFoundException(`Saved schedule with ID ${id} not found`);
    }

    scheduleToUpdate.title = updateSavedScheduleDto.title;
    scheduleToUpdate.description = updateSavedScheduleDto.description;
    scheduleToUpdate.items = savedScheduleItems;

    const result = await this.savedSchedulesRepository.save(scheduleToUpdate);
    return this.findOne(result.idsavedschedule, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    const savedSchedule = await this.findOne(id, userId);
    await this.savedSchedulesRepository.delete(id);
  }
}
