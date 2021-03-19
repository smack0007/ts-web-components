import { repoRootDir } from '../../build/constants';
import { chDir, copyDir, copyFile, cwd, join, mkDir } from "../../build/node";
import { tsc } from "../../build/tsc";
import { updateImportStatements } from "../../build/utils";

const outDir = join(repoRootDir, "dist", "app");

export async function build(): Promise<void> {
    mkDir(outDir);
    
    const oldDir = cwd();
    chDir(__dirname);

    await updateImportStatements(".");
    await compile();
    await copyFiles();

    chDir(oldDir);
}

async function compile(): Promise<void> {
    tsc("./tsconfig.json");
}

async function copyFiles(): Promise<void> {
    await copyFile("index.html", join(outDir, "index.html"));
    await copyDir(join(repoRootDir, "assets"), join(outDir, "assets"));
}
