#!/usr/bin/env ts-node
import { exec as _exec, spawn } from "child_process";
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
import { chdir, cwd } from "process";
import { join } from "path";
import { promisify } from "util";
import { PromiseWithChild } from "node:child_process";

const copyFile = promisify(_copyFile);
const readFile = promisify(_readFile);
const writeFile = promisify(_writeFile);

const outDir = join(__dirname, "../../dist/app");

export async function build(): Promise<void> {
    const oldDir = cwd();
    chdir(__dirname);

    await updateImportStatements();
    await compile();
    await copyFiles();

    chdir(oldDir);
}

async function updateImportStatements(): Promise<void> {
    const files = (await listFiles(".")).filter((x) => x.endsWith(".ts"));

    for (const file of files) {
        const data = await readFile(file, "utf8");

        // If no imports then nothing to do.
        if (!data.match(/import .* from\s+['"][.][\\/]/g)) {
            continue;
        }

        let shouldWrite = false;

        // All imports where the file name starts with "./"
        const newData = data.replace(/(import .* from\s+['"][.][\\/])(.*)(?=['"])/g, (substring) => {
            if (!substring.endsWith(".js")) {
                substring += ".js";
                shouldWrite = true;
            }

            return substring;
        });

        if (shouldWrite) {
            console.info(`Updating imports in ${file}`);
            await writeFile(file, newData);
        }
    }
}

async function compile(): Promise<void> {
    await exec("tsc --pretty");
}

async function copyFiles(): Promise<void> {
    await copyFile("index.html", join(outDir, "index.html"));
    await copyDir("../../assets", join(outDir, "assets"));
}

//
// Utility functions
//

async function copyDir(src: string, dest: string): Promise<void> {
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
            await copyFile(join(src, file), join(dest, file));
        }
    }
}

function exec(command: string): Promise<number> {
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

async function listFiles(path: string): Promise<string[]> {
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
async function mkDir(dir: PathLike): Promise<void> {
    return __mkdir(dir, 755).catch((error) => {
        if (error.code !== "EEXIST") {
            console.error(`mkdir: Error: ${error}`);
            throw error;
        }
    });
}
