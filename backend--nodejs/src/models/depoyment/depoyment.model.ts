import { DBBase } from "../database.model";

export interface DepoymentModel extends DBBase {
  status: string;
  project_id: number;
  user_id: number;
}
