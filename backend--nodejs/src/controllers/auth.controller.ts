import { Router } from "express";
import AuthService from "../services/auth.service";


const routerAuth = Router();


routerAuth.post("/auth", AuthService.auth);

export default routerAuth;
