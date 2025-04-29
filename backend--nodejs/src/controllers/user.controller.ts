import { validateDto } from "../middlewares/validation.middleware";
import { UserDtoCreate, UserDtoFindQuery, UserDtoUpdate } from "../models/user/user.dto";
import UserService from "../services/user.service";
import express from "express";
const routerUser = express.Router();

routerUser.post("/create", validateDto(UserDtoCreate), UserService.create);
routerUser.get("/:id", UserService.getById);
routerUser.get("/", validateDto(UserDtoFindQuery), UserService.getAll);
routerUser.patch("/:id", validateDto(UserDtoUpdate), UserService.update);
routerUser.delete("/:id", UserService.delete);

export default routerUser;
