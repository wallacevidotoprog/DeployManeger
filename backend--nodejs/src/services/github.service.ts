import fs from "fs";
import path from "path";
import simpleGit, { SimpleGit } from "simple-git";
import { ReturnGitClone } from "../utils/returtGihub";

export class GitHubService {
  static async cloneRepoNew(repoUrl: string, projectName: string): Promise<ReturnGitClone> {
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
        return {
          success: false,
          message: "Project already exists",
          path: projectPath,
        };
      }

      const git: SimpleGit = simpleGit();
      await git.clone(repoUrl, projectPath);      

      return {
        success: true,
        message: "Success",
        path: projectPath,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error cloning repository",
        data: error,
      };
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
