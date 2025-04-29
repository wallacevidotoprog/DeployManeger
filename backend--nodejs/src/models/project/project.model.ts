import { IsDateString, IsString, IsUrl } from "class-validator";
import { DBBase } from "../database.model";

export class ProjectModel extends DBBase {
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
