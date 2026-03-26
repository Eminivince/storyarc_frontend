/**
 * One-shot: replace <span className="...material-symbols-outlined...">…</span>
 * with <MaterialSymbol />. Skips ambiguous cases (fill-1 + ${ in className).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcRoot = path.join(root, "src");

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      out.push(...walk(p));
    } else if (ent.name.endsWith(".jsx")) {
      out.push(p);
    }
  }
  return out;
}

function importPathFor(file) {
  const rel = path.relative(srcRoot, file);
  const parts = rel.split(path.sep);
  if (parts[0] === "components") {
    return "./MaterialSymbol";
  }
  const depth = path.dirname(rel).split(path.sep).filter(Boolean).length;
  return `${"../".repeat(depth)}components/MaterialSymbol`;
}

function stripMaterialTokens(s) {
  return s
    .replace(/\bmaterial-symbols-outlined\b/g, "")
    .replace(/\bfill-1\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseClassName(openTag) {
  const matchIdx = openTag.search(/\bclassName=/);
  if (matchIdx === -1) {
    return { text: "", source: "omit" };
  }
  const afterEq = openTag.slice(matchIdx + "className=".length);
  if (afterEq[0] === '"') {
    const end = afterEq.indexOf('"', 1);
    const val = afterEq.slice(1, end);
    const cleaned = stripMaterialTokens(val);
    return { text: cleaned, source: "string" };
  }
  if (afterEq.startsWith("{`")) {
    const end = afterEq.indexOf("`}", 2);
    if (end === -1) {
      return null;
    }
    const inner = afterEq.slice(2, end);
    if (inner.includes("${")) {
      return { text: stripMaterialTokens(inner), source: "templateExpr", rawInner: inner };
    }
    return { text: stripMaterialTokens(inner), source: "template" };
  }
  if (afterEq[0] === "{") {
    let depth = 0;
    let j = 0;
    for (; j < afterEq.length; j++) {
      if (afterEq[j] === "{") {
        depth++;
      } else if (afterEq[j] === "}") {
        depth--;
        if (depth === 0) {
          j++;
          break;
        }
      }
    }
    const expr = afterEq.slice(1, j - 1).trim();
    const cleaned = stripMaterialTokens(expr);
    return { text: cleaned, source: "expr", expr: expr };
  }
  return null;
}

function innerToName(inner) {
  const t = inner.trim();
  if (/^[a-z][a-z0-9_]*$/.test(t)) {
    return `name="${t}"`;
  }
  if (t.startsWith("{") && t.endsWith("}")) {
    return `name={${t.slice(1, -1).trim()}}`;
  }
  return null;
}

function ensureImport(src, file) {
  if (src.includes('from "./MaterialSymbol"') || src.includes("from './MaterialSymbol'")) {
    return src;
  }
  if (src.includes('from "../components/MaterialSymbol"') || src.includes("MaterialSymbol.jsx")) {
    return src;
  }
  if (/from\s+["'].*MaterialSymbol["']/.test(src)) {
    return src;
  }
  const imp = importPathFor(file);
  const line = `import MaterialSymbol from "${imp}";\n`;
  const lines = src.split("\n");
  let insertAt = 0;
  for (let i = 0; i < lines.length; i++) {
    if (/^import\s/.test(lines[i])) {
      insertAt = i + 1;
    } else if (lines[i].trim() !== "" && !lines[i].startsWith("//")) {
      break;
    }
  }
  lines.splice(insertAt, 0, line.trimEnd());
  return lines.join("\n");
}

function transform(content, file) {
  let out = "";
  let i = 0;
  let changed = false;

  while (i < content.length) {
    const spanStart = content.indexOf("<span ", i);
    if (spanStart === -1) {
      out += content.slice(i);
      break;
    }
    const gt = content.indexOf(">", spanStart);
    if (gt === -1) {
      out += content.slice(i);
      break;
    }
    const openTag = content.slice(spanStart, gt + 1);
    if (!openTag.includes("material-symbols-outlined")) {
      out += content.slice(i, spanStart + 6);
      i = spanStart + 6;
      continue;
    }

    if (openTag.includes("fill-1") && openTag.includes("${")) {
      out += content.slice(i, gt + 1);
      i = gt + 1;
      continue;
    }

    const closeIdx = content.indexOf("</span>", gt + 1);
    if (closeIdx === -1) {
      out += content.slice(i);
      break;
    }
    const inner = content.slice(gt + 1, closeIdx).trim();
    if (inner.includes("<")) {
      out += content.slice(i, closeIdx + 7);
      i = closeIdx + 7;
      continue;
    }

    const nameProp = innerToName(inner);
    if (!nameProp) {
      out += content.slice(i, closeIdx + 7);
      i = closeIdx + 7;
      continue;
    }

    const cls = parseClassName(openTag);
    if (cls === null) {
      out += content.slice(i, closeIdx + 7);
      i = closeIdx + 7;
      continue;
    }

    const filledStatic = openTag.includes("fill-1") && !openTag.includes("${");

    let classProp = "";
    if (cls.source === "omit" || !cls.text) {
      classProp = "";
    } else if (cls.source === "string") {
      classProp = cls.text ? ` className="${cls.text}"` : "";
    } else if (cls.source === "template" || cls.source === "templateExpr") {
      const raw = cls.rawInner ?? cls.text;
      const t = stripMaterialTokens(raw);
      classProp = t ? ` className={\`${t}\`}` : "";
    } else if (cls.source === "expr") {
      classProp = cls.text ? ` className={${cls.text}}` : "";
    }

    const filledProp = filledStatic ? " filled" : "";
    const el = `<MaterialSymbol ${nameProp}${filledProp}${classProp} />`;

    out += content.slice(i, spanStart) + el;
    i = closeIdx + 7;
    changed = true;
  }

  if (!changed) {
    return { content, changed: false };
  }
  let next = ensureImport(out, file);
  return { content: next, changed: next !== content };
}

let total = 0;
for (const file of walk(srcRoot)) {
  const raw = fs.readFileSync(file, "utf8");
  if (!raw.includes("material-symbols-outlined")) {
    continue;
  }
  const { content, changed } = transform(raw, file);
  if (changed) {
    fs.writeFileSync(file, content);
    total++;
    console.log("updated", path.relative(root, file));
  }
}
console.log("files changed:", total);
