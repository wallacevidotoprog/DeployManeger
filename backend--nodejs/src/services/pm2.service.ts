import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class PM2Manager {
    static async listProcesses() {
        try {
            const { stdout, stderr } = await execAsync('pm2 jlist');
            
if (stderr) throw new Error(stderr);
            const processes = JSON.parse(stdout);
            const simplifiedProcesses = processes.map((proc: any) => ({
                id: proc.pm_id,
                name: proc.name,
                status: proc.pm2_env.status, // online, stopped, errored
                uptime: proc.pm2_env.uptime,
                cpu: proc.monit.cpu,
                memory: proc.monit.memory
            }));

            return simplifiedProcesses;
        } catch (error) {
            console.error('Erro no PM2Manager:', error);
            throw new Error(`PM2 falhou: ${error}`);
        }
       
    }

    static async createProcess(name: string, scriptPath: string) {
        try {
            const { stdout } = await execAsync(`pm2 start ${scriptPath} --name ${name}`);

            const processes = JSON.parse(stdout);
            return processes;
        } catch (error) {
            throw new Error(`Erro ao iniciar processo: ${error}`);
        }
    }
    static async startProcess(name: string) {
        try {
            const { stdout } = await execAsync(`pm2 start ${name}`);
            const processes = JSON.parse(stdout);
            return processes;
        } catch (error) {
            throw new Error(`Erro ao iniciar processo: ${error}`);
        }
    }

    static async stopProcess(name: string) {
        try {
            const { stdout } = await execAsync(`pm2 stop ${name}`);
            const processes = JSON.parse(stdout);
            return processes;
        } catch (error) {
            throw new Error(`Erro ao iniciar processo: ${error}`);
        }
    }
}