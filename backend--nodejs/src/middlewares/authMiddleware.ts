import { RoleUser } from "@prisma/client";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { UserToken } from "../models/user/user.dto";
import { HttpStatus } from "../utils/HttpStatus";
import { ResponseApi } from "../utils/response-api";
import { verifyToken } from "../utils/token";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.Auth;
     if (!token) {
      res.status(HttpStatus.UNAUTHORIZED).json(ResponseApi.response({ message: "Unauthorized: No token provided." }));
      return
    }
    const decoded = verifyToken(token) as UserToken;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ResponseApi.response({ message: "Error token.", data: error }));
  }
}

export function requireRole(role: RoleUser): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) res.status(HttpStatus.UNAUTHORIZED).json(ResponseApi.response({ message: "No token provided" }));
    if (req.user?.role !== role) res.status(HttpStatus.FORBIDDEN).json(ResponseApi.response({ message: "Access denied" }));
    next();
  };
}

export const isAdmin = requireRole(RoleUser.ADMIN);
export const isUser = requireRole(RoleUser.USER);
