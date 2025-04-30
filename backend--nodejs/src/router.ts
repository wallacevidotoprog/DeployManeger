import { Router } from "express";
import routerAuth from "./controllers/auth.controller";
import routerDeployment from "./controllers/depoyment.controller";
import routerProject from "./controllers/project.controller";
import routerUser from "./controllers/user.controller";

const routeres = Router();

routeres.use("/auth", routerAuth);
routeres.use("/user", routerUser);
routeres.use("/project", routerProject);
routeres.use("/deployment", routerDeployment);

export default routeres;
