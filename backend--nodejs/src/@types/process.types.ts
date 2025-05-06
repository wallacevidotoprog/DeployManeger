import { StatusDeployment } from "@prisma/client";
import { ProjectModel } from "../models/project/project.model";

export type ProcessPM2 = {
  id: number;
  name: string;
  status: StatusDeployment;
  cpu: number;
  memory: number;
};
export type OS = {
  totalmem: number;
  freemem: number;
};

export type ProcessModal = {
  process: ProcessPM2;
  db: ProjectModel;
  os : OS
};
