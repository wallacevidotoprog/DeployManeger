import DepoymentService from "../services/depoyment.service";
import express from "express";
const routerDeployment = express.Router();

routerDeployment.post("/depoyment", DepoymentService.create);
routerDeployment.get("/:id", DepoymentService.getById);
routerDeployment.get("/", DepoymentService.getAll);
routerDeployment.patch("/:id", DepoymentService.update);
routerDeployment.delete("/:id", DepoymentService.delete);

export default routerDeployment;
