import { exec } from "child_process";
import dotenv from "dotenv";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { DepoymentDtoCreate, DepoymentDtoFindQuery, DepoymentDtoUpdate } from "../models/depoyment/depoyment.dto";
import { HttpStatus } from "../utils/HttpStatus";
import { ResponseApi } from "../utils/response-api";

dotenv.config();

class DepoymentService {
  private static deployDir = process.env.FILE_DEPLOY ?? "./DEPLOY";
  static async runScript(req: Request, res: Response): Promise<void> {
    try {
      const { dirPath, script } = req.body;
      const projectPath = path.resolve(this.deployDir, dirPath);
      console.log(projectPath);
      
      if (!fs.existsSync(projectPath)) {
        res.status(HttpStatus.BAD_REQUEST).json(ResponseApi.response({ message: `Diretório não encontrado: ${projectPath}` }));
        return;
      }

      const x = exec(`npm run ${script}`, { cwd: projectPath }, (error, stdout, stderr) => {
        if (error) {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            ResponseApi.response({
              message: `npm run ${script}`,
              data: stderr || error.message,
            })
          );
          return;
        }

        res.status(HttpStatus.OK).json(
          ResponseApi.response({
            message: `npm run ${script}`,
            data: stdout,
          })
        );
      });

      // console.log(x);

      // exec(`npm install`, { cwd: projectPath }, (error, stdout, stderr) => {
      //   if (error) {
      //     console.error('stderr || error.message',stderr || error.message)
      //   }

      //   console.log('stdout:',stdout);
        
      // });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        ResponseApi.response({
          message: (error as Error)?.message || "Erro desconhecido",
        })
      );
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    const data: DepoymentDtoCreate = req.body;
    // Implement CREATE logic here
    res.status(201).send({ message: "Depoyment created", data });
  }

  static async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    // Implement GET by ID logic here
    res.status(200).send({ message: "Fetched Depoyment by ID", id });
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    const query: DepoymentDtoFindQuery = req.query;
    // Implement GET ALL logic with query parameters
    res.status(200).send({ message: "Fetched all Depoyments", query });
  }

  static async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data: DepoymentDtoUpdate = req.body;
    // Implement PATCH logic here
    res.status(200).send({ message: "Updated Depoyment", id, data });
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    // Implement DELETE logic here
    res.status(200).send({ message: "Deleted Depoyment", id });
  }
}

export default DepoymentService;
