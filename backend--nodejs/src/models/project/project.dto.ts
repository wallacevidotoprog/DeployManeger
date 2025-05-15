import { Transform } from "class-transformer";
import { IsDate, IsIn, IsString, IsUrl } from "class-validator";
import { Partial } from "../../utils/resources";
import { DBBaseValidator } from "../database.model";
import { ActionType, CREATE, UPDATE } from "./../../utils/actions";
import { ProjectModel } from "./project.model";

export class ProjectValidator extends DBBaseValidator {
  @IsString()
  profile!: string;

  @IsString()
  node_id!: string;

  @IsString()
  name!: string;

  @IsUrl()
  clone_url!: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  created_project!: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  updated_project!: Date;
}

export class FileActionValidator {
  @IsString()
  @IsIn([CREATE, UPDATE])  
  action!: ActionType;

  @IsString()
  filename!: string;

  @IsString()
  pathfile!: string;

  @IsString()
  data!: string;
}

export class ProcessPm2Start {
  @IsString()
  name!: string;

  @IsString()
  filename!: string;

  @IsString()
  pathfile!: string;

  @IsString()
  data!: string;
}

export interface ProjectDtoCreate extends Omit<ProjectModel, "id" | "createAt" | "updateAt"> {}

export interface ProjectDtoUpdate extends Partial<ProjectDtoCreate> {}

export interface ProjectDtoFindQuery extends Partial<ProjectModel> {}

export interface FileActionDto extends FileActionValidator {}
