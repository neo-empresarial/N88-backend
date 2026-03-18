import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedSchedules } from './savedschedules.entity';
import { SavedScheduleItems } from './savedscheduleitems.entity';
import {
  CreateSavedScheduleDto,
  CreateSavedSchedulePlanDto,
} from './dto/create-savedschedule.dto';
import {
  SavedScheduleResponseDto,
  SavedSchedulePlanResponseDto,
} from './dto/saved-schedule-response.dto';

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
    savedSchedule.totalCredits = createSavedScheduleDto.totalCredits || 0;
    savedSchedule.user = { iduser: userId } as any;

    const plansToCreate = this.normalizePlans(createSavedScheduleDto);

    const savedScheduleItems: SavedScheduleItems[] = [];
    for (const plan of plansToCreate) {
      for (const item of plan.items) {
        const scheduleItem = new SavedScheduleItems();
        scheduleItem.subjectCode = item.subjectCode;
        scheduleItem.classCode = item.classCode;
        scheduleItem.activated = item.activated;
        scheduleItem.credits = item.credits || 0;
        scheduleItem.planNumber = plan.planNumber;
        scheduleItem.savedSchedule = savedSchedule;
        savedScheduleItems.push(scheduleItem);
      }
    }

    savedSchedule.items = savedScheduleItems;

    const result = await this.savedSchedulesRepository.save(savedSchedule);
    return this.findOne(result.idsavedschedule, userId);
  }

  private normalizePlans(
    dto: CreateSavedScheduleDto,
  ): CreateSavedSchedulePlanDto[] {
    if (dto.plans && dto.plans.length > 0) {
      return dto.plans;
    }

    if (dto.items && dto.items.length > 0) {
      return [{ planNumber: 1, items: dto.items }];
    }

    return [];
  }

  private groupItemsByPlan(items: SavedScheduleItems[]): {
    plans: SavedSchedulePlanResponseDto[];
    legacyItems: any[];
  } {
    const planMap = new Map<number, SavedScheduleItems[]>();

    items.forEach((item) => {
      const planNumber = item.planNumber || 1;
      if (!planMap.has(planNumber)) {
        planMap.set(planNumber, []);
      }
      planMap.get(planNumber).push(item);
    });

    const plans: SavedSchedulePlanResponseDto[] = [];
    const legacyItems = [];

    planMap.forEach((planItems, planNumber) => {
      const mappedItems = planItems.map((item) => ({
        subjectCode: item.subjectCode,
        classCode: item.classCode,
        activated: item.activated,
        credits: item.credits,
      }));

      const planCredits = planItems
        .filter((item) => item.activated)
        .reduce((sum, item) => sum + (item.credits || 0), 0);

      plans.push({
        planNumber,
        credits: planCredits,
        items: mappedItems,
      });

      legacyItems.push(...mappedItems);
    });

    plans.sort((a, b) => a.planNumber - b.planNumber);

    return { plans, legacyItems };
  }

  async findAllByUser(userId: number): Promise<SavedScheduleResponseDto[]> {
    const schedules = await this.savedSchedulesRepository.find({
      where: { user: { iduser: userId } },
      relations: ['items'],
    });

    return schedules.map((schedule) => {
      const { plans, legacyItems } = this.groupItemsByPlan(schedule.items);
      return {
        idsavedschedule: schedule.idsavedschedule,
        title: schedule.title,
        description: schedule.description,
        totalCredits: schedule.totalCredits,
        plans,
        items: legacyItems,
      };
    });
  }

  async findOne(id: number, userId: number): Promise<SavedScheduleResponseDto> {
    const savedSchedule = await this.savedSchedulesRepository.findOne({
      where: { idsavedschedule: id, user: { iduser: userId } },
      relations: ['items'],
    });

    if (!savedSchedule) {
      throw new NotFoundException(`Saved schedule with ID ${id} not found`);
    }

    const { plans, legacyItems } = this.groupItemsByPlan(savedSchedule.items);

    return {
      idsavedschedule: savedSchedule.idsavedschedule,
      title: savedSchedule.title,
      description: savedSchedule.description,
      totalCredits: savedSchedule.totalCredits,
      plans,
      items: legacyItems,
    };
  }

  async update(
    id: number,
    userId: number,
    updateSavedScheduleDto: CreateSavedScheduleDto,
  ): Promise<SavedScheduleResponseDto> {
    const savedSchedule = await this.findOne(id, userId);

    await this.savedScheduleItemsRepository.delete({
      savedSchedule: { idsavedschedule: id },
    });

    const plansToCreate = this.normalizePlans(updateSavedScheduleDto);

    const savedScheduleItems: SavedScheduleItems[] = [];
    for (const plan of plansToCreate) {
      for (const item of plan.items) {
        const scheduleItem = new SavedScheduleItems();
        scheduleItem.subjectCode = item.subjectCode;
        scheduleItem.classCode = item.classCode;
        scheduleItem.activated = item.activated;
        scheduleItem.credits = item.credits || 0;
        scheduleItem.planNumber = plan.planNumber;
        scheduleItem.savedSchedule = savedSchedule as any;
        savedScheduleItems.push(scheduleItem);
      }
    }

    const scheduleToUpdate = await this.savedSchedulesRepository.findOne({
      where: { idsavedschedule: id },
    });

    if (!scheduleToUpdate) {
      throw new NotFoundException(`Saved schedule with ID ${id} not found`);
    }

    scheduleToUpdate.title = updateSavedScheduleDto.title;
    scheduleToUpdate.description = updateSavedScheduleDto.description;
    scheduleToUpdate.totalCredits = updateSavedScheduleDto.totalCredits || 0;
    scheduleToUpdate.items = savedScheduleItems;

    const result = await this.savedSchedulesRepository.save(scheduleToUpdate);
    return this.findOne(result.idsavedschedule, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.findOne(id, userId);
    await this.savedSchedulesRepository.delete(id);
  }
}
