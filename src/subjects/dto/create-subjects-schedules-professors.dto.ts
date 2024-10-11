import { ValidateNested } from "class-validator";
import { CreateSubjectsDto } from "./create-subjects.dto";
import { Type } from "class-transformer";
import { CreateClassesDto } from "../classes/dto/create-classes.dto";

export class CreateSubjectsSchedulesProfessorsDto {
  @Type(() => CreateSubjectsDto)
  @ValidateNested()
  subject: CreateSubjectsDto;

  @Type(() => CreateClassesDto)
  @ValidateNested()
  classes: CreateClassesDto[];
}