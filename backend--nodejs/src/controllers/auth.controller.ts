import { Router } from "express";
import AuthService from "../services/auth.service";


const routerAuth = Router();

//@ ts-ignore
routerAuth.post("/auth", AuthService.auth);

export default routerAuth;
