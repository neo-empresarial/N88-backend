import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Courses } from 'src/courses/courses.entity';

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

  
  idcourse: number;
}
