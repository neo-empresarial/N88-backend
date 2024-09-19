import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Schedules } from "../schedules.entity";

export class CreateSubjectsDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  classcode: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  totalvacancies: number;

  @IsNotEmpty()
  @IsNumber()
  freevacancies: number;
}