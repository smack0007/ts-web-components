import { exec } from "./node";

export function tsc(projectPath: string): Promise<number> {
    return exec(`tsc -p "${projectPath}" --pretty --listEmittedFiles`);
}