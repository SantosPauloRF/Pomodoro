import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const cargoBin = path.join(os.homedir(), ".cargo", "bin");
const pathKey = process.env.PATH !== undefined ? "PATH" : "Path";
const env = {
  ...process.env,
  [pathKey]: `${cargoBin}${path.delimiter}${process.env[pathKey] ?? ""}`,
};

const require = createRequire(import.meta.url);
const tauriJs = path.join(
  path.dirname(require.resolve("@tauri-apps/cli/package.json")),
  "tauri.js",
);

const child = spawn(process.execPath, [tauriJs, ...process.argv.slice(2)], {
  stdio: "inherit",
  env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
