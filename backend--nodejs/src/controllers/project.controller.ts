import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateDto } from "../middlewares/validation.middleware";
import { ProjectValidator } from "../models/project/project.dto";
import ProjectService from '../services/project.service'
import { PM2Manager } from "../services/pm2.service";

const routerProject = Router();

routerProject.post("/import", authMiddleware, validateDto(ProjectValidator), ProjectService.registerProject.bind(ProjectService));
routerProject.post("/path_list", authMiddleware, ProjectService.pathList.bind(ProjectService));


routerProject.get('/processes', async (req, res) => {
    try {
        const processes = await PM2Manager.listProcesses();
        res.json(processes);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

routerProject.post('/processes', async (req, res) => {
    const { name, scriptPath } = req.body;

    if (!name || !scriptPath) {
    res.status(400).json({ error: "Nome e scriptPath são obrigatórios." });
    }

    try {
        const result = await PM2Manager.startProcess(name, scriptPath);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

export default routerProject;
