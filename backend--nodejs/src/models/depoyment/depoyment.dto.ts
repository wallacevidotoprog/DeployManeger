import { StatusDepoyment } from "@prisma/client";
import { IsEnum, IsNumber } from "class-validator";
import { Partial } from "../../utils/resources";
import { DBBaseValidator } from "../database.model";
import { DepoymentModel } from "./depoyment.model";

export class DepoymentValidator extends DBBaseValidator {
  @IsEnum(StatusDepoyment)
  status!: string;

  @IsNumber()
  project_id!: number;

  @IsNumber()
  user_id!: number;
}

export interface DepoymentDtoCreate extends Omit<DepoymentModel,'id'|'createAt'|'updateAt'> {}

export interface DepoymentDtoUpdate extends Partial<DepoymentDtoCreate> {}

export interface DepoymentDtoFindQuery extends Partial<DepoymentModel> {}
