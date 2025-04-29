import { Router } from "express";
import { validateDto } from "../middlewares/validation.middleware";
import { DeployDtoCreate } from "../models/deploy/deploy/deploy.dto";
import  DeployService  from "../services/deploy.service";

const routerDeploy = Router();

routerDeploy.post("/import", validateDto(DeployDtoCreate), DeployService.registerDeploy);

routerDeploy.post("/update", async (req, res) => {
  res.status(200).json({ message: "Atualização realizada com sucesso!" });
});
export default routerDeploy;
