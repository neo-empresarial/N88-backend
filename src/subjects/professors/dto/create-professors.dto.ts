import { IsNotEmpty, IsString } from "class-validator";

export class CreateProfessorsDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}