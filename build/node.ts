import { exec as _exec } from "child_process";
import { 
    copyFile as _copyFile,
    lstatSync,
    mkdir as _mkdir,
    PathLike,
    readdirSync,
    readFile as _readFile,
    readlinkSync,
    symlinkSync,
    writeFile as _writeFile
} from "fs";
import { join } from "path";
import { chdir } from "process";
import { promisify } from "util";

export { cwd } from "process";
export { join, resolve } from "path";

export const readFile = promisify(_readFile);
export const writeFile = promisify(_writeFile);

export async function copyDir(src: string, dest: string): Promise<void> {
    console.info(`Copy directory: ${src} => ${dest}`);
    await mkDir(dest);
    const files = readdirSync(src);
    for (const file of files) {
        const current = lstatSync(join(src, file));
        if (current.isDirectory()) {
            await copyDir(join(src, file), join(dest, file));
        } else if (current.isSymbolicLink()) {
            const symlink = readlinkSync(join(src, file));
            symlinkSync(symlink, join(dest, file));
        } else {
            await __copyFile(join(src, file), join(dest, file));
        }
    }
}

const __copyFile = promisify(_copyFile);
export async function copyFile(src: string, dest: string): Promise<void> {
    console.info(`Copy file: ${src} => ${dest}`);
    return __copyFile(src, dest);
}

export function chDir(directory: string): void {
    console.info(`Working directory: ${directory}`);
    chdir(directory);
}

export function exec(command: string): Promise<number> {
    return new Promise((resolve, reject) => {
        const childProcess = _exec(command);

        childProcess.stdout?.on("data", data => {
            console.info(data);
        });

        childProcess.stderr?.on("data", data => {
            console.error(data);
        });
        
        childProcess.on("close", code => {
            resolve(code || 0);
        });

        childProcess.on("error", error => {
            reject(error);
        });
    });
}

export async function listFiles(path: string): Promise<string[]> {
    const files = [];
    for (const file of readdirSync(path)) {
        const filePath = join(path, file);
        const fileStat = lstatSync(filePath);
        if (fileStat.isDirectory()) {
            files.push(...(await listFiles(filePath)));
        } else {
            files.push(filePath);
        }
    }

    return files;
}

const __mkdir = promisify(_mkdir);
export async function mkDir(dir: string, recursive: boolean = true): Promise<string | void | undefined> {
    return __mkdir(dir, { mode: 755, recursive }).catch((error) => {
        if (error.code !== "EEXIST") {
            console.error(`mkdir: Error: ${error}`);
            throw error;
        }
    });
}
