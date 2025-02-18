﻿import { CreateUsersDto } from "./create-users.dto";
import { PartialType } from "@nestjs/mapped-types"; //Instaled with npm i @nestjs/mapped-types -D

export class UpdateUsersDto extends PartialType(CreateUsersDto) {}