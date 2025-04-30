import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class PM2Manager {
    static async listProcesses() {
        try {
            const { stdout } = await execAsync('pm2 list --json');
            return JSON.parse(stdout);
        } catch (error) {
            throw new Error(`Erro ao listar processos PM2: ${error}`);
        }
    }

    static async startProcess(name: string, scriptPath: string) {
        try {
            const { stdout } = await execAsync(`pm2 start ${scriptPath} --name ${name}`);
            return { success: true, message: stdout };
        } catch (error) {
            throw new Error(`Erro ao iniciar processo: ${error}`);
        }
    }
}