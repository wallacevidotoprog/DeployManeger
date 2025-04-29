import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { Role } from "../../generated/prisma";
import { DBBase } from "../database.model";

export class UserModel extends DBBase {

  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsEnum(Role)
  @IsOptional()
  role!: Role;
}
