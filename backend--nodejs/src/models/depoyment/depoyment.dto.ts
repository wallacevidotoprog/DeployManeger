import { StatusDeployment } from "@prisma/client";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { Partial } from "../../utils/resources";
import { DBBaseValidator } from "../database.model";
import { DepoymentModel } from "./depoyment.model";

export class DepoymentValidator extends DBBaseValidator {
  @IsEnum(StatusDeployment)
  status!: string;

  @IsNumber()
  project_id!: number;

  @IsNumber()
  user_id!: number;
}

export class RunPackageValidator {
  @IsString()
  dirPath!: string;

  @IsString()
  script!: number;
}

export interface DepoymentDtoCreate extends Omit<DepoymentModel, "id" | "createAt" | "updateAt"> {}

export interface DepoymentDtoUpdate extends Partial<DepoymentDtoCreate> {}

export interface DepoymentDtoFindQuery extends Partial<DepoymentModel> {}
