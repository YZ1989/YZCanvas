import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const web = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = resolve(process.argv[2] || process.env.CARGO_TARGET_DIR || join(web, "src-tauri/target"));
const version = readFileSync(join(web, "../VERSION"), "utf8").trim();
const installer = join(target, `release/bundle/nsis/YZCanvas_${version}_x64-setup.exe`);
const executable = join(target, "release/yzcanvas.exe");
const dist = join(web, "dist");
if (![installer, executable, dist].every(existsSync)) throw new Error("Build the Windows NSIS release before measuring.");
const directoryBytes = (directory) => readdirSync(directory, { withFileTypes: true }).reduce((bytes, entry) => bytes + (entry.isDirectory() ? directoryBytes(join(directory, entry.name)) : statSync(join(directory, entry.name)).size), 0);
const measurement = {
    version,
    platform: "windows-x64",
    nativeExeBytes: statSync(executable).size,
    installerBytes: statSync(installer).size,
    frontendBytes: directoryBytes(dist),
    installerSha256: createHash("sha256").update(readFileSync(installer)).digest("hex"),
    excludes: ["WebView2 runtime", "user media", "development dependencies and build caches"],
};
writeFileSync(join(web, "../docs/measurements/yzcanvas.json"), JSON.stringify(measurement, null, 2) + "\n");
console.log(JSON.stringify(measurement, null, 2));
