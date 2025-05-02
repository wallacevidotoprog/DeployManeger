import { PrismaClient, StatusDeployment } from "@prisma/client";
import { exec } from "child_process";
import { promisify } from "util";
import { ProcessModel } from "../@types/process.types";

const execAsync = promisify(exec);

export class PM2Manager {
  static async listProcesses() {
    try {
      const { stdout, stderr } = await execAsync("pm2 jlist");

      if (stderr) throw new Error(stderr);
      const processes = JSON.parse(stdout);
      const simplifiedProcesses: ProcessModel[] = processes.map((proc: any) => ({
        id: proc.pm_id,
        name: proc.name,
        status: proc.pm2_env.status, // online, stopped, errored
        uptime: proc.pm2_env.uptime,
        cpu: proc.monit.cpu,
        memory: proc.monit.memory,
      })) as ProcessModel[];

      return simplifiedProcesses;
    } catch (error) {
      console.error("Erro no PM2Manager:", error);
      throw new Error(`PM2 falhou: ${error}`);
    }
  }

  static async createProcess(name: string, prisma: PrismaClient) {
    try {
      const verify = (await this.getFindProcess(name)) as ProcessModel;

      if (verify) {
        throw new Error("The process is already instantiated");
      }

      const ps = await this.getNameProcess(name, prisma);

      const result = {
        name: await ps?.node_id,
        path: await ps?.deployment?.path,
      };
      if (!result.name || !result.path) {
        throw new Error(`Error ${result}`);
      }

      const { stdout, stderr } = await execAsync(`pm2 start ${result.path} --name ${result.name}`);
      if (stderr) throw new Error(stderr);

      const tempPm2: ProcessModel = (await this.getFindProcess(result.name)) as ProcessModel;
      if (tempPm2) {
        const t = await prisma.deployment.count({ where: { id: ps?.deployment?.id } });

        if (t <= 0) {
          this.deleteProcess(result.name, prisma);

          throw new Error("Deploy not created");
        }
        await prisma.deployment.update({ where: { id: ps?.deployment?.id }, data: { status: tempPm2.status } });
      }

      return tempPm2;
    } catch (error) {
      console.error("createProcess err", error);
      throw new Error(`Error starting process: ${error}`);
    }
  }

  static async startProcess(name: string, prisma: PrismaClient) {
    try {
      const result = await this.getNameProcess(name, prisma);

      const verify = (await this.getFindProcess(result?.node_id)) as ProcessModel;

      if (verify) {
        throw new Error("The process is already instantiated");
      }
      const { stdout, stderr } = await execAsync(`pm2 start ${result?.node_id}`);
      if (stderr) throw new Error(stderr);
      const ps: ProcessModel = (await this.getFindProcess(result?.node_id)) as ProcessModel;

      //@ts-ignore
      await this.setStatusProcess(result.deployment.id, ps.status, prisma);
      return await this.getFindProcess(result?.node_id);
    } catch (error) {
      console.error("startProcess err", error);
      throw new Error(`Error starting process: ${error}`);
    }
  }

  static async stopProcess(name: string, prisma: PrismaClient) {
    try {
      const result = await this.getNameProcess(name, prisma);

      const verify = (await this.getFindProcess(result?.node_id)) as ProcessModel;

      if (verify) {
        throw new Error("The process is already instantiated");
      }

      const { stdout, stderr } = await execAsync(`pm2 stop ${result?.node_id}`);
      if (stderr) throw new Error(stderr);
      const ps: ProcessModel = (await this.getFindProcess(result?.node_id)) as ProcessModel;

      //@ts-ignore
      await this.setStatusProcess(result.deployment.id, ps.status, prisma);
      return await this.getFindProcess(result?.node_id);
    } catch (error) {
      console.error("stopProcess err", error);
      throw new Error(`Error stopping process: ${error}`);
    }
  }

  static async deleteProcess(name: string, prisma: PrismaClient) {
    try {
      const result = await this.getNameProcess(name, prisma);

      const verify = (await this.getFindProcess(result?.node_id)) as ProcessModel;

      if (verify) {
        throw new Error("The process is already instantiated");
      }

      const { stdout, stderr } = await execAsync(`pm2 delete ${result?.node_id}`);
      if (stderr) throw new Error(stderr);
      const ps: ProcessModel = (await this.getFindProcess(result?.node_id)) as ProcessModel;

      //@ts-ignore
      await this.setStatusProcess(result.deployment.id, StatusDeployment.pending, prisma);
      return await this.getFindProcess(result?.node_id);
    } catch (error) {
      console.error("deleteProcess err", error);
      throw new Error(`Error deleting process: ${error}`);
    }
  }

  private static async getFindProcess(name: string | null = null): Promise<ProcessModel[] | ProcessModel | null> {
    try {
      const temppm2: ProcessModel[] = await this.listProcesses();

      return name ? temppm2.find((x) => x.name === name) || null : temppm2;
    } catch (error) {
      throw new Error(`Erro ao iniciar processo: ${error}`);
    }
  }

  private static async getNameProcess(name: string, prisma: PrismaClient) {
    return await prisma.project.findFirst({
      where: {
        name,
      },
      include: {
        deployment: true,
      },
    });
  }

  private static async setStatusProcess(id: number, status: StatusDeployment, prisma: PrismaClient) {
    return await prisma.deployment.update({ where: { id: id }, data: { status: status } });
  }
}
