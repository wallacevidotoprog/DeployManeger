import { PrismaClient } from "@prisma/client";
import { compareSync } from "bcrypt";
import { Request, Response } from "express";
import { AuthModel } from "../models/auth/auth.model";
import { UserToken } from "../models/user/user.dto";
import { HttpStatus } from "../utils/HttpStatus";
import { ResponseApi } from "../utils/response-api";
import { generateToken } from "../utils/token";

class AuthService {
  constructor(private prisma = new PrismaClient()) {
    this.auth = this.auth.bind(this);
  }

  async auth(req: Request, res: Response): Promise<void> {
    const loginDto: AuthModel = req.body;

    const user = await this.prisma.user.findFirst({ where: { email: loginDto.email } });

    if (!user || !compareSync(loginDto.password, user.password)) {
      res.status(HttpStatus.BAD_REQUEST).json();
      return;
    }

    const token = generateToken({ id: user?.id, email: user?.email, role: user.role } );

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
  async logoff(req: Request, res: Response): Promise<void> {
    res.clearCookie("Auth", {
      httpOnly: true,
      secure: false, // Em produção: true (HTTPS)
    });
  }
}

export default new AuthService();
