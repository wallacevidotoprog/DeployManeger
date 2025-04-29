import { Request, Response } from "express";
import { UserDtoFindQuery, UserDtoUpdate } from "../models/user/user.dto";
import { UserModel } from "../models/user/user.model";
import { PrismaClient } from "../generated/prisma";
import { HttpStatus } from "../utils/HttpStatus";
import { ResponseApi } from "../utils/response-api";

class UserService {

  constructor(private prisma = new PrismaClient()){}


  async create(req: Request, res: Response): Promise<void> {
    const dataUser: UserModel = req.body;
    
    const userExist = await this.prisma.user.count({where:{email: dataUser.email}})
    if (userExist > 0) {
      res.status(HttpStatus.CONFLICT).json(ResponseApi.response({
        message: 'Try another email address'
      }))
    }
    
    await this.prisma.user.create({data: dataUser})
    
    
    
    
    
    
    
    res.status(201).send({ message: "User created", data: dataUser });
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
