import { Router } from "express";
import { validateDto } from "../middlewares/validation.middleware";
import { ProjectDtoCreate } from "../models/project/project.dto";
import ProjectService from "../services/project.service";

const routerProject = Router();

routerProject.post("/import", validateDto(ProjectDtoCreate), ProjectService.registerDeploy);


export default routerProject;
