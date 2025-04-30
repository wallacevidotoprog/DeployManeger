import { IsEmail, IsString, MinLength } from "class-validator";
import { AuthModel } from "./auth.model";

export class AuthValidator {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export interface AuthDto extends AuthModel {}
