import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(
  root,
  "node_modules/@fontsource-variable/material-symbols-outlined/files/material-symbols-outlined-latin-full-normal.woff2",
);
const destDir = path.join(root, "public/fonts");
const dest = path.join(destDir, "material-symbols-outlined-latin-full-normal.woff2");

if (!fs.existsSync(src)) {
  console.warn(
    "[sync-material-symbols-font] Source woff2 missing (run after yarn/npm install). Skipping.",
  );
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);
