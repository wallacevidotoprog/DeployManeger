import { DBBase } from "../database.model";

export interface ProjectModel extends DBBase {
  profile: string;
  node_id: number;
  name: string;
  clone_url: string;
  created_project: Date;
  updated_project: Date;
}
