import { Partial } from "../../utils/resources";
import { ProjectModel } from "./project.model";

export class ProjectDtoCreate extends ProjectModel {}

export class ProjectDtoUpdate implements Partial<ProjectModel> {}

export class ProjectDtoFindQuery implements Partial<ProjectModel> {}
