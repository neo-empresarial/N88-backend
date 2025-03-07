import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  course: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  refreshToken: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  googleAccessToken: string;

  @IsOptional()
  avatarUrl: string;
}
