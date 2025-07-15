import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateSavedScheduleItemDto {
  @IsNotEmpty()
  @IsString()
  subjectCode: string;

  @IsNotEmpty()
  @IsString()
  classCode: string;

  @IsNotEmpty()
  activated: boolean;
}

export class CreateSavedScheduleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsArray()
  @IsNotEmpty()
  items: CreateSavedScheduleItemDto[];
}
