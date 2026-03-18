import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSavedScheduleItemDto {
  @IsNotEmpty()
  @IsString()
  subjectCode: string;

  @IsNotEmpty()
  @IsString()
  classCode: string;

  @IsNotEmpty()
  @IsBoolean()
  activated: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  credits?: number;
}

export class CreateSavedSchedulePlanDto {
  @IsInt()
  @Min(1)
  @Max(3)
  planNumber: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSavedScheduleItemDto)
  items: CreateSavedScheduleItemDto[];
}

export class CreateSavedScheduleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSavedSchedulePlanDto)
  plans?: CreateSavedSchedulePlanDto[];

  @IsOptional()
  @IsArray()
  items?: CreateSavedScheduleItemDto[];

  @IsOptional()
  @IsInt()
  @Min(0)
  totalCredits?: number;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}\.[123]$/, {
    message: 'Semester must be in format YYYY.S (e.g. "2026.1")',
  })
  semester?: string;
}
