import { RoleUser } from "@prisma/client";
import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { Partial } from "../../utils/resources";
import { DBBaseValidator } from "../database.model";
import { UserModel } from "./user.model";

export class UserValidator extends DBBaseValidator {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsEnum(RoleUser)
  @IsOptional()
  role!: RoleUser;
}

export class UserToken {
  id!: number;
  email!: string;
  role!: RoleUser;
}

export interface UserDtoCreate extends Omit<UserModel,'id'|'createAt'|'updateAt'> {}

export interface UserDtoRegisterCreate extends Omit<UserModel,'id'|'role'|'createAt'|'updateAt'> {}

export interface UserDtoUpdate extends Partial<UserDtoCreate> {}

export interface UserDtoFindQuery extends Partial<UserModel> {}
