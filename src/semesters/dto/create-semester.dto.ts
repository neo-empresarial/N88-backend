import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateSemesterDto {
  @IsNotEmpty({ message: 'Semestre é obrigatório' })
  @IsString({ message: 'Semestre deve ser uma string' })
  @Matches(/^\d{4}\.[123]$/, {
    message: 'Formato de semestre inválido. Use YYYY.S (ex: 2026.1)',
  })
  semester: string;
}
