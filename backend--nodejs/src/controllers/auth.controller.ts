import { Request, Response, Router } from "express";
import AuthService from "../services/auth.service";
import { validateDto } from "../middlewares/validation.middleware";
import { AuthDto, AuthValidator } from "../models/auth/auth.dto";
import { authMiddleware } from "../middlewares/authMiddleware";
import { HttpStatus } from "../utils/HttpStatus";
import { ResponseApi } from "../utils/response-api";

const routerAuth = Router();

routerAuth.post("/login", validateDto(AuthValidator), AuthService.auth);
routerAuth.post("/logoff", authMiddleware, AuthService.logoff);
routerAuth.get("/me", authMiddleware, (req:Request,res:Response)=>{
    res.status(HttpStatus.OK).json(ResponseApi.response({message:"Authorized"}))
});


export default routerAuth;
