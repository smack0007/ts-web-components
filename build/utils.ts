import { listFiles, readFile, writeFile } from "./node";

export async function updateImportStatements(dir: string): Promise<void> {
    const files = (await listFiles(dir)).filter((x) => x.endsWith(".ts"));

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