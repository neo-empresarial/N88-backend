import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCampusDto {
  @IsNotEmpty({ message: 'O nome do campus é obrigatório' })
  @IsString({ message: 'O nome do campus deve ser uma string' })
  @MaxLength(100, {
    message: 'O nome do campus não pode exceder 100 caracteres',
  })
  name: string;
}
