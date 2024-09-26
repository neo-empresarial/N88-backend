import { IsNotEmpty, IsString } from "class-validator";

export class CreateUsersDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  subjects: number[];
}