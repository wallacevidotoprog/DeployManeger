import { Partial } from "../../utils/resources";
import { ProjectModel } from "../project/project.model";

export class DepoymentDtoCreate extends ProjectModel {}

export class DepoymentDtoUpdate implements Partial<ProjectModel> {}

export class DepoymentDtoFindQuery implements Partial<ProjectModel> {}
