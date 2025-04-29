import { Request, Response } from "express";
import { GitHubService } from "./github.service";
import { HttpStatus } from "../utils/HttpStatus";
import { DeployDtoCreate } from "../models/deploy/deploy/deploy.dto";
import { ResponseApi } from "../utils/response-api";

export class DeployService {
    async registerDeploy(req:Request,res: Response): Promise<void>{
        try {
            const create: DeployDtoCreate = req.body;
        
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
                message: (error as Error)?.message || 'Erro desconhecido',
              })
            );
          }
    }
}

export default new DeployService();
