import { ValidateNested } from "class-validator";
import { CreateSubjectsDto } from "./create-subjects.dto";
import { CreateSchedulesDto } from "./create-schedules.dto";
import { CreateProfessorsDto } from "./create-professors.dto";
import { Type } from "class-transformer";

export class CreateSubjectsSchedulesProfessorsDto {
  @Type(() => CreateSubjectsDto)
  @ValidateNested()
  subjects: CreateSubjectsDto[];

  @Type(() => CreateSchedulesDto)
  @ValidateNested()
  schedules: CreateSchedulesDto[];

  @Type(() => CreateProfessorsDto)
  @ValidateNested()
  professors: CreateProfessorsDto[];
}