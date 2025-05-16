import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateDto } from "../middlewares/validation.middleware";
import { RunPackageValidator } from "../models/depoyment/depoyment.dto";
import DepoymentService from "../services/depoyment.service";
const routerDeployment = express.Router();

routerDeployment.post("/", authMiddleware, DepoymentService.create.bind(DepoymentService));
routerDeployment.get("/:id", authMiddleware, DepoymentService.getById.bind(DepoymentService));
routerDeployment.get("/", authMiddleware, DepoymentService.getAll.bind(DepoymentService));
routerDeployment.patch("/:id", authMiddleware, DepoymentService.update.bind(DepoymentService));
routerDeployment.delete("/:id", authMiddleware, DepoymentService.delete.bind(DepoymentService));

routerDeployment.post("/package/run", authMiddleware, validateDto(RunPackageValidator), DepoymentService.runScript.bind(DepoymentService));

export default routerDeployment;
