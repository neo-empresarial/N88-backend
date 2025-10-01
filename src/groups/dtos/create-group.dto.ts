import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsArray,
} from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(50)
  maxMembers?: number = 10;

  @IsArray()
  @IsNumber({}, { each: true })
  members: number[];
}
