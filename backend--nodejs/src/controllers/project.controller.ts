import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateDto } from "../middlewares/validation.middleware";
import { ProjectValidator } from "../models/project/project.dto";
import ProjectService from '../services/project.service'
import { PM2Manager } from "../services/pm2.service";

const routerProject = Router();

routerProject.post("/import", authMiddleware, validateDto(ProjectValidator), ProjectService.registerProject.bind(ProjectService));

routerProject.post("/path_list", authMiddleware, ProjectService.pathList.bind(ProjectService));


routerProject.get('/processes', authMiddleware, ProjectService.pathList.bind(ProjectService));

routerProject.post('/processes', authMiddleware, ProjectService.createProcess.bind(ProjectService));

export default routerProject;
