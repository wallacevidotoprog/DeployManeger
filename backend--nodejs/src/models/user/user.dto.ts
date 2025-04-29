import { Partial } from "../../utils/resources";
import { UserModel } from "./user.model";

export class UserDtoCreate extends UserModel {}

export class UserDtoUpdate implements Partial<UserModel> {}

export class UserDtoFindQuery implements Partial<UserModel> {}
