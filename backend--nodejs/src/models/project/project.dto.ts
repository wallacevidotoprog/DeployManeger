import { IsDateString, IsString, IsUrl } from "class-validator";
import { Partial } from "../../utils/resources";
import { DBBaseValidator } from "../database.model";
import { ProjectModel } from "./project.model";

export class ProjectValidator extends DBBaseValidator {
  @IsString()
  profile!: string;

  @IsString()
  node_id!: number;

  @IsString()
  name!: string;

  @IsUrl()
  clone_url!: string;

  @IsDateString()
  created_project!: Date;

  @IsDateString()
  updated_project!: Date;
}

export interface ProjectDtoCreate extends  Omit<ProjectModel,'id'|'createAt'|'updateAt'> {}

export interface ProjectDtoUpdate extends Partial<ProjectDtoCreate> {}

export interface ProjectDtoFindQuery extends Partial<ProjectModel> {}
