import { Request, Response } from "express";
import { ProjectDtoCreate } from "../models/project/project.dto";
import { HttpStatus } from "../utils/HttpStatus";
import { ResponseApi } from "../utils/response-api";
import { GitHubService } from "./github.service";

export class ProjectService {
  async registerDeploy(req: Request, res: Response): Promise<void> {
    try {
      const create: ProjectDtoCreate = req.body;

      const result = await GitHubService.cloneRepoNew(create.clone_url, create.name);

      res.status(HttpStatus.CREATED).json(
        ResponseApi.response({
          data: result,
          message: "Repositório clonado com sucesso!",
        })
      );
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json(
        ResponseApi.response({
          message: (error as Error)?.message || "Erro desconhecido",
        })
      );
    }
  }
}

export default new ProjectService();
