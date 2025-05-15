import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateDto } from "../middlewares/validation.middleware";
import { FileActionValidator, ProjectValidator } from "../models/project/project.dto";
import ProjectService from "../services/project.service";

const routerProject = Router();

routerProject.post("/import", authMiddleware, validateDto(ProjectValidator), ProjectService.registerProject.bind(ProjectService));

routerProject.get("/path-list", authMiddleware, ProjectService.pathList.bind(ProjectService));

routerProject.get("/get-file", authMiddleware, ProjectService.getFile.bind(ProjectService));

routerProject.post("/set-file", authMiddleware,validateDto(FileActionValidator), ProjectService.setFile.bind(ProjectService));

routerProject.get("/processes", authMiddleware, ProjectService.processList.bind(ProjectService));

routerProject.post("/processes", authMiddleware, ProjectService.createProcess.bind(ProjectService));

routerProject.post("/start", authMiddleware, ProjectService.startProcess.bind(ProjectService));

routerProject.post("/stop", authMiddleware, ProjectService.stopProcess.bind(ProjectService));

routerProject.post("/delete", authMiddleware, ProjectService.deleteProcess.bind(ProjectService));

routerProject.get("/package", authMiddleware, ProjectService.getPackage.bind(ProjectService));

export default routerProject;
