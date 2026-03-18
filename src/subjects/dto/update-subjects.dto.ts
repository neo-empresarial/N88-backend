import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class UpdateSubjectsDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt({ message: 'Pedidos sem vaga deve ser um número inteiro' })
  @Min(0, { message: 'Pedidos sem vaga não pode ser negativo' })
  pedidos_sem_vaga?: number;
}
