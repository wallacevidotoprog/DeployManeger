import { PrismaClient, StatusDepoyment } from "@prisma/client";
import { Request, Response } from "express";
import fs from "fs";
import { ProjectDtoCreate } from "../models/project/project.dto";
import { HttpStatus } from "../utils/HttpStatus";
import { ResponseApi } from "../utils/response-api";
import { ReturnGitClone } from "../utils/returtGihub";
import { GitHubService } from "./github.service";
import { PM2Manager } from "./pm2.service";

class ProjectService {
  constructor(private prisma = new PrismaClient()) {}

  private deployDir = process.env.FILE_DEPLOY ?? "../DEPLOY";

  //implementar rollback
  async registerProject(req: Request, res: Response): Promise<void> {
    try {
      const create: ProjectDtoCreate = req.body;

      const registerDb = await this.prisma.project.create({ data: create });
      if (!registerDb) {
        res.status(HttpStatus.BAD_REQUEST).json(
          ResponseApi.response({
            data: create,
            message: "Erro create projec db",
          })
        );
        return;
      }

      const result: ReturnGitClone = await GitHubService.cloneRepoNew(create.clone_url, create.name);

      if (!result.success) {
        res.status(HttpStatus.BAD_REQUEST).json(
          ResponseApi.response({
            data: {
              dataError: result.data,
              dataPath: result.path,
            },
            message: result.message,
          })
        );
        await this.prisma.project.delete({ where: { id: registerDb.id } });
        return;
      }

      const reusltD = await this.prisma.deployment.create({
        data: {
          path: result.path ?? "",
          project_id: registerDb.id,
          user_id: req.user.id,
          status: StatusDepoyment.PENDING,
        },
      });

      res.status(HttpStatus.CREATED).json(
        ResponseApi.response({
          data: result,
          message: "Repository cloned successfully!",
        })
      );
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        ResponseApi.response({
          message: (error as Error)?.message || "Erro desconhecido",
        })
      );
    }
  }

  async pathList(req: Request, res: Response): Promise<void> {
    try {
      if (fs.existsSync(this.deployDir)) {
        res.status(HttpStatus.NOT_FOUND).json(
          ResponseApi.response({
            message: "Empty folder",
          })
        );
      }
      const itens = await fs
        .readdirSync(this.deployDir, { withFileTypes: true })
        .filter((item) => item.isDirectory)
        .map((item) => item.name);

      res.status(HttpStatus.OK).json(
        ResponseApi.response({
          data: itens,
        })
      );
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        ResponseApi.response({
          message: (error as Error)?.message || "Erro desconhecido",
        })
      );
    }
  }

  async processList(req: Request, res: Response): Promise<void> {
    try {
      const processes = await PM2Manager.listProcesses();
      res.status(HttpStatus.OK).json(
        ResponseApi.response({
          data: processes,
        })
      );
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        ResponseApi.response({
          data: error,
        })
      );
    }
  }

  async createProcess(req: Request, res: Response): Promise<void> {
    const { name, scriptPath } = req.body;

    if (!name || !scriptPath) {
      res.status(HttpStatus.BAD_REQUEST).json(
        ResponseApi.response({
          message: "Name and scriptPath are required.",
        })
      );
    }

    try {
      const result = await PM2Manager.createProcess(name, scriptPath);

      res.status(HttpStatus.OK).json(
        ResponseApi.response({
          data: result,
        })
      );
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        ResponseApi.response({
          data: error,
        })
      );
    }
  }

  async startProcess(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;

      if (!name) {
        res.status(HttpStatus.BAD_REQUEST).json(
          ResponseApi.response({
            message: "Name and scriptPath are required.",
          })
        );
      }
      const result = await PM2Manager.startProcess(name);
      res.status(HttpStatus.OK).json(
        ResponseApi.response({
          data: result,
        })
      );
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        ResponseApi.response({
          data: error,
        })
      );
    }
  }
  async stopProcess(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;

      if (!name) {
        res.status(HttpStatus.BAD_REQUEST).json(
          ResponseApi.response({
            message: "Name and scriptPath are required.",
          })
        );
      }

      const result = await PM2Manager.stopProcess(name);
      res.status(HttpStatus.OK).json(
        ResponseApi.response({
          data: result,
        })
      );
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        ResponseApi.response({
          data: error,
        })
      );
    }
  }
}

export default new ProjectService();
