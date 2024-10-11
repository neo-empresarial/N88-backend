import { IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { CreateSchedulesDto } from "../../schedules/dto/create-schedules.dto";
import { CreateProfessorsDto } from "../../professors/dto/create-professors.dto";
import { Type } from "class-transformer";

export class CreateClassesDto {
  @IsNotEmpty()
  @IsString()
  classcode: string;

  @IsNotEmpty()
  @IsNumber()
  totalvacancies: number;

  @IsNotEmpty()
  @IsNumber()
  freevacancies: number;

  @IsNotEmpty()
  @Type(() => CreateSchedulesDto)
  @ValidateNested()
  schedules: CreateSchedulesDto[];

  @IsNotEmpty()
  @Type(() => CreateProfessorsDto)
  @ValidateNested()
  professors: CreateProfessorsDto[];
}