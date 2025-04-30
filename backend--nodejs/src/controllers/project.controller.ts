import { Router } from "express";
import { validateDto } from "../middlewares/validation.middleware";
import { ProjectValidator } from "../models/project/project.dto";
import ProjectService from "../services/project.service";

const routerProject = Router();

routerProject.post("/import", validateDto(ProjectValidator), ProjectService.registerDeploy);

export default routerProject;
