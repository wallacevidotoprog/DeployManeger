import { PrismaClient, RoleUser } from "@prisma/client";
import { Request, Response } from "express";
import { UserDtoCreate, UserDtoFindQuery, UserDtoRegisterCreate, UserDtoUpdate } from "../models/user/user.dto";
import { HttpStatus } from "../utils/HttpStatus";
import { ResponseApi } from "../utils/response-api";
import bcrypt from "bcrypt";

class UserService {
  constructor(private prisma = new PrismaClient()) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      if (req.user?.role != RoleUser.ADMIN) {
        res.status(HttpStatus.BAD_REQUEST).json(
          ResponseApi.response({
            message: "You are not an admin",
          })
        );
        return;
      }

      const dataUser: UserDtoCreate = req.body;

      const userExist = await this.prisma.user.count({ where: { email: dataUser.email } });
      if (userExist > 0) {
        res.status(HttpStatus.CONFLICT).json(
          ResponseApi.response({
            message: "Try another email address",
          })
        );
      }
      dataUser.password = bcrypt.hashSync(dataUser.password,10)
      await this.prisma.user.create({ data: dataUser });

      res.status(HttpStatus.CREATED).send({ message: "User created" });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: "Error", data: error });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const dataUser: UserDtoRegisterCreate = req.body;      
      const userExist = await this.prisma.user.count({ where: { email: dataUser.email } });
      if (userExist > 0) {
        res.status(HttpStatus.CONFLICT).json(
          ResponseApi.response({
            message: "Try another email address",
          })
        );
        return;
      }

      dataUser.password = bcrypt.hashSync(dataUser.password,10)
      await this.prisma.user.create({ data: dataUser });

      res.status(HttpStatus.CREATED).send({ message: "User created" });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: "Error", data: error });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    // Implement GET by ID logic here
    res.status(200).send({ message: "Fetched User by ID", id });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const query: UserDtoFindQuery = req.query;
    // Implement GET ALL logic with query parameters
    res.status(200).send({ message: "Fetched all Users", query });
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data: UserDtoUpdate = req.body;
    // Implement PATCH logic here
    res.status(200).send({ message: "Updated User", id, data });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    // Implement DELETE logic here
    res.status(200).send({ message: "Deleted User", id });
  }
}

export default new UserService();
