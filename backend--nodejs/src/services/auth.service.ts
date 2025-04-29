import { compareSync } from "bcryptjs";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { AuthModel } from "../models/auth/auth.model";
import { HttpStatus } from "../utils/HttpStatus";
import { ResponseApi } from "../utils/response-api";
import { generateToken } from "../utils/token";

class AuthService {
  constructor(private prisma = new PrismaClient()) {}

  async auth(req: Request, res: Response): Promise<void> {
    const loginDto = plainToInstance(AuthModel, req.body);

    const errors = await validate(loginDto);
    if (errors.length > 0) {
      res.status(400).json(errors);
    }

    const user = await this.prisma.user.findFirst({ where: { email: loginDto.email } });

    if (!user || !compareSync(loginDto.password, user.password)) {
      res.status(HttpStatus.UNAUTHORIZED).json();
    }

    const token = generateToken({ id: user?.id, email: user?.email });

    res
      .cookie("Auth", token, {
        httpOnly: true,
        secure: false, // Em produção: true (HTTPS)
        sameSite: "lax",
        maxAge: 60 * 60 * 8000,
      })
      .status(HttpStatus.OK)
      .json(ResponseApi.response({ message: "Login successful" }));
  }
}

export default new AuthService();
