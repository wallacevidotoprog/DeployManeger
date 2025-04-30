import { IsDate, IsDateString, IsString, IsUrl } from "class-validator";
import { Partial } from "../../utils/resources";
import { DBBaseValidator } from "../database.model";
import { ProjectModel } from "./project.model";
import { Transform } from "class-transformer";

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
  @Transform(({value }) => new Date(value))
  created_project!: Date;

  @IsDate()
  @Transform(({value }) => new Date(value))
  updated_project!: Date;
} 

export interface ProjectDtoCreate extends  Omit<ProjectModel,'id'|'createAt'|'updateAt'> {}

export interface ProjectDtoUpdate extends Partial<ProjectDtoCreate> {}

export interface ProjectDtoFindQuery extends Partial<ProjectModel> {}
