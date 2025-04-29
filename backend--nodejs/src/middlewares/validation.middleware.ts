import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RequestHandler } from "express";
import { ResponseApi } from "../utils/response-api";

export function validateDto<T>(type: ClassConstructor<T>): RequestHandler {
  return async (req, res, next) => {
    const dto = plainToInstance(type, req.body);
    const errors = await validate(dto as object);

    if (errors.length > 0) {
      return res.status(400).json(
        ResponseApi.response({
          message: errors.map((err) => `${err.property}: ${Object.values(err.constraints || {}).join(", ")}`).join("; "),
          data: errors,
        })
      );
    }

    req.body = dto;
    return next();
  };
}
