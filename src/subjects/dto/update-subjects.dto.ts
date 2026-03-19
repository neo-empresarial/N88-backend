import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class UpdateSubjectsDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt({ message: 'Orders without vacancy deve ser um número inteiro' })
  @Min(0, { message: 'Orders without vacancy não pode ser negativo' })
  orders_without_vacancy?: number;
}
