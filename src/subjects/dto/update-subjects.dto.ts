import { IsOptional, IsString } from 'class-validator';

export class UpdateSubjectsDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
