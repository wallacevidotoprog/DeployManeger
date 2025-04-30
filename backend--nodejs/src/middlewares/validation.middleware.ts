import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { HttpStatus } from "../utils/HttpStatus";
import { ResponseApi } from "../utils/response-api";

export function validateDto<T>(type: ClassConstructor<T>): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);
    const errors = await validate(dto as object);

    if (errors.length > 0) {
      res.status(HttpStatus.BAD_REQUEST).json(
        ResponseApi.response({
          message: errors.map((err) => `${err.property}: ${Object.values(err.constraints || {}).join(", ")}`).join("; "),
          data: errors,
        })
      );
      return;
    }

    req.body = dto;
    next();
  };
}
