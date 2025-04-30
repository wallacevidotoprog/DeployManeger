import { DBBase } from "../database.model";

export interface ProjectModel extends DBBase {
  profile: string;
  node_id: string;
  name: string;
  clone_url: string;
  created_project: Date;
  updated_project: Date;
}
