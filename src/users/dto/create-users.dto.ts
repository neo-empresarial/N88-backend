import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUsersDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  course: string;

  @IsString()
  refreshToken: string;
}