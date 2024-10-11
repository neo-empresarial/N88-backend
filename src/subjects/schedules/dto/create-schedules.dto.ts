import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSchedulesDto {
  @IsNotEmpty()
  @IsString()
  weekday: string;

  @IsNotEmpty()
  @IsString()
  starttime: string;

  @IsNotEmpty()
  @IsNumber()
  classesnumber: number;

  @IsNotEmpty()
  @IsString()
  building: string;

  @IsNotEmpty()
  @IsString()
  room: string;
}