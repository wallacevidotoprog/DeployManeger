import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";
import { validateDto } from "../middlewares/validation.middleware";
import { UserValidator } from "../models/user/user.dto";
import UserService from "../services/user.service";
const routerUser = express.Router();

routerUser.post("/register", validateDto(UserValidator), UserService.register.bind(UserService));
routerUser.post("/create", authMiddleware, isAdmin, validateDto(UserValidator), UserService.create.bind(UserService));
routerUser.get("/:id", authMiddleware, isAdmin, UserService.getById.bind(UserService));
routerUser.get("/", authMiddleware, isAdmin, validateDto(UserValidator), UserService.getAll.bind(UserService));
routerUser.patch("/:id", authMiddleware, validateDto(UserValidator), UserService.update.bind(UserService));
routerUser.delete("/:id", authMiddleware, isAdmin, UserService.delete.bind(UserService));

export default routerUser;
