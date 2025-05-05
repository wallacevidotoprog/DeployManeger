import { StatusDeployment } from "../enum/db.enum";
import { ProjectModel } from "../models/db.modal";


export type ProcessPM2 = {
  id: number;
  name: string;
  status: StatusDeployment;
  cpu: number;
  memory: number;
};

export type ProcessModal = {
  process: ProcessPM2;
  db: ProjectModel;
};
