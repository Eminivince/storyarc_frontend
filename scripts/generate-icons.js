/**
 * Generates PNG icons from public/Logo.svg for favicon and PWA.
 * Run: node scripts/generate-icons.js
 * Requires: npm install -D sharp
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const svgPath = join(publicDir, "Logo.svg");

const sizes = [
  { name: "favicon-32.png", size: 32 },
  { name: "icon-180.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.error("Run: npm install -D sharp");
    process.exit(1);
  }

  const svg = readFileSync(svgPath);
  for (const { name, size } of sizes) {
    const out = join(publicDir, name);
    await sharp(svg).resize(size, size).png().toFile(out);
    console.log("Wrote", name);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
