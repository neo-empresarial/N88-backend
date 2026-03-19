import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  ValidateNested,
  Matches,
  IsInt,
  Min,
  IsOptional,
} from 'class-validator';
import { CreateClassesDto } from '../classes/dto/create-classes.dto';

export class CreateSubjectsDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Semestre é obrigatório' })
  @IsString({ message: 'Semestre deve ser uma string' })
  @Matches(/^\d{4}\.[123]$/, {
    message: 'Formato de semestre inválido. Use YYYY.S (ex: 2026.1)',
  })
  semester: string;

  @IsNotEmpty()
  @Type(() => CreateClassesDto)
  @ValidateNested()
  classes: CreateClassesDto[];

  @IsOptional()
  @IsInt({ message: 'Orders without vacancy deve ser um número inteiro' })
  @Min(0, { message: 'Orders without vacancy não pode ser negativo' })
  orders_without_vacancy?: number;
}
