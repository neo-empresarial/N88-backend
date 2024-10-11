import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { CreateClassesDto } from "../classes/dto/create-classes.dto";

export class CreateSubjectsDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Type(() => CreateClassesDto)
  @ValidateNested()
  classes: CreateClassesDto[];
}