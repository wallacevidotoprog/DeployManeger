import { RoleUser } from "@prisma/client";
import { DBBase } from "../database.model";

export interface UserModel extends DBBase {
  name: string;
  email: string;
  password: string;
  role: RoleUser;
}
