import { Partial } from "../../../utils/resources";
import { DeployModel } from "./deploy.model";

export class DeployDtoCreate extends DeployModel {}

export class DeployDtoUpdate implements Partial<DeployModel> {}

export class DeployDtoFindQuery implements Partial<DeployModel> {}
