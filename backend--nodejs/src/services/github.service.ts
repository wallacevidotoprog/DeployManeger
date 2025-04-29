import fs from "fs";
import path from "path";
import simpleGit, { SimpleGit } from "simple-git";

export class GitHubService {
  static async cloneRepoNew(repoUrl: string, projectName: string): Promise<boolean> {
    try {
      if (!process.env.BASE_PATH_DEPLOY) {
        throw new Error("BASE_PATH_DEPLOY environment variable is not set");
      }
    
      const pathname = path.join(process.env.BASE_PATH_DEPLOY, "DEPLOY");
      const projectPath = path.join(pathname, projectName);
    
      if (!fs.existsSync(pathname)) {
        fs.mkdirSync(pathname, { recursive: true });
      }
    
      if (fs.existsSync(projectPath)) {
        throw new Error("Project already exists");
      }
    
      const git: SimpleGit = simpleGit();
      await git.clone(repoUrl, projectPath);
      console.log(`Cloned repository: ${projectName}`);
      
      return true;
    } catch (error) {
      throw new Error(`Error cloning repository: ${error}`);
    }
  }
  static async pullRepo(repoUrl: string, localPath: string): Promise<void> {
    if (process.env.BASE_PATH_DEPLOY === undefined) {
      throw new Error("BASE_PATH_DEPLOY environment variable is not set");
    }
    const projectPath = path.join(process.env.BASE_PATH_DEPLOY, localPath);
    const git: SimpleGit = simpleGit(projectPath);
    await git.pull(repoUrl, "main");
  }
  static async checkoutBranch(repoUrl: string, localPath: string, branchName: string): Promise<void> {
    if (process.env.BASE_PATH_DEPLOY === undefined) {
      throw new Error("BASE_PATH_DEPLOY environment variable is not set");
    }
    const projectPath = path.join(process.env.BASE_PATH_DEPLOY, localPath);
    const git: SimpleGit = simpleGit(projectPath);
    await git.checkout(branchName);
  }
}
