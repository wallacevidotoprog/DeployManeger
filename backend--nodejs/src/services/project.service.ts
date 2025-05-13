import { PrismaClient, StatusDeployment } from "@prisma/client";
import dotenv from "dotenv";
import { Request, Response } from "express";
import fs from "fs";
import { writeFile } from "fs/promises";
import os from "os";
import path from "path";
import { ProcessModal } from "../@types/process.types";
import { ProjectDtoCreate } from "../models/project/project.dto";
import { CREATE } from "../utils/actions";
import { HttpStatus } from "../utils/HttpStatus";
import { ResponseApi } from "../utils/response-api";
import { ReturnGitClone } from "../utils/returtGihub";
import { GitHubService } from "./github.service";
import { PM2Manager } from "./pm2.service";

dotenv.config();

class ProjectService {
  constructor(private prisma = new PrismaClient()) {}

  private deployDir = process.env.FILE_DEPLOY ?? "./DEPLOY";

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
          status: StatusDeployment.pending,
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
      if (!fs.existsSync(this.deployDir)) {
        res.status(HttpStatus.NOT_FOUND).json(
          ResponseApi.response({
            message: "Empty folder",
          })
        );
        return;
      }
      const getDirectoryStructure = (dirPath: string, basePath = "") => {
        const items = fs.readdirSync(dirPath, { withFileTypes: true });
        const result: any[] = [];

        for (const item of items) {
          const fullPath = path.join(dirPath, item.name);
          const relativePath = basePath ? path.join(basePath, item.name) : item.name;

          if (item.isDirectory()) {
            result.push({
              name: item.name,
              path: relativePath,
              type: "directory",
              children: getDirectoryStructure(fullPath, relativePath),
            });
          } else if (item.isFile()) {
            const stats = fs.statSync(fullPath);
            result.push({
              name: item.name,
              path: relativePath,
              type: "file",
              size: stats.size,
              modified: stats.mtime,
            });
          }
        }

        return result;
      };
      const directoryStructure = getDirectoryStructure(this.deployDir);

      res.status(HttpStatus.OK).json(
        ResponseApi.response({
          data: directoryStructure,
        })
      );

      // const itens = await fs
      //   .readdirSync(this.deployDir, { withFileTypes: true })
      //   .filter((item) => item.isDirectory)
      //   .map((item) => item.name);

      // res.status(HttpStatus.OK).json(
      //   ResponseApi.response({
      //     data: itens,
      //   })
      // );
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        ResponseApi.response({
          message: (error as Error)?.message || "Erro desconhecido",
        })
      );
    }
  }

  async getFile(req: Request, res: Response): Promise<void> {
    try {
      const filename = req.query.filename as string;

      if (!filename) {
        res.status(HttpStatus.NOT_FOUND).json(
          ResponseApi.response({
            message: "Filename is required",
          })
        );
        return;
      }

      if (!fs.existsSync(this.deployDir) || !fs.existsSync(path.join(this.deployDir, filename))) {
        res.status(HttpStatus.NOT_FOUND).json(
          ResponseApi.response({
            message: "Empty folder or file",
          })
        );
        return;
      }

      const resultFile = await fs.readFileSync(path.join(this.deployDir, filename));
      res.status(HttpStatus.OK).json(
        ResponseApi.response({
          data: resultFile,
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
  async setFile(req: Request, res: Response): Promise<void> {
    try {
      if (!fs.existsSync(this.deployDir)) {
        res.status(HttpStatus.NOT_FOUND).json(
          ResponseApi.response({
            message: "Empty folder",
          })
        );
        return;
      }
      const { action, filename, pathfile, data } = req.body;

      await writeFile(path.join(this.deployDir, pathfile, filename), data, { encoding: "utf-8" });
      res.status(action === CREATE ? HttpStatus.CREATED : HttpStatus.OK).send();

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
      const db = await this.prisma.project.findMany({ include: { deployment: true } });

      const result = db.map((data) => {
        return {
          process: processes.find((x) => x.name === data.node_id),
          db: data,
          os: {
            totalmem: os.totalmem(),
            freemem: os.freemem(),
          },
        } as ProcessModal;
      });

      res.status(HttpStatus.OK).json(
        ResponseApi.response({
          data: result,
        })
      );
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        ResponseApi.response({
          message: (error as Error).message,
        })
      );
    }
  }

  async createProcess(req: Request, res: Response): Promise<void> {
    const { name } = req.body;

    if (!name) {
      res.status(HttpStatus.BAD_REQUEST).json(
        ResponseApi.response({
          message: "Name and scriptPath are required.",
        })
      );
      return;
    }

    try {
      const result = await PM2Manager.createProcess(name, this.prisma);

      res.status(HttpStatus.OK).json(
        ResponseApi.response({
          data: result,
        })
      );
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        ResponseApi.response({
          message: (error as Error).message,
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
        return;
      }
      const result = await PM2Manager.startProcess(name, this.prisma);
      res.status(HttpStatus.OK).json(
        ResponseApi.response({
          data: result,
        })
      );
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        ResponseApi.response({
          message: (error as Error).message,
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
        return;
      }

      const result = await PM2Manager.stopProcess(name, this.prisma);
      res.status(HttpStatus.OK).json(
        ResponseApi.response({
          data: result,
        })
      );
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        ResponseApi.response({
          message: (error as Error).message,
        })
      );
    }
  }

  async deleteProcess(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;

      if (!name) {
        res.status(HttpStatus.BAD_REQUEST).json(
          ResponseApi.response({
            message: "Name and scriptPath are required.",
          })
        );
        return;
      }

      const result = await PM2Manager.deleteProcess(name, this.prisma);
      res.status(HttpStatus.OK).json(
        ResponseApi.response({
          data: result,
        })
      );
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        ResponseApi.response({
          message: (error as Error).message,
        })
      );
    }
  }
}

export default new ProjectService();
