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
  @IsInt({ message: 'Pedidos sem vaga deve ser um número inteiro' })
  @Min(0, { message: 'Pedidos sem vaga não pode ser negativo' })
  pedidos_sem_vaga?: number;
}
