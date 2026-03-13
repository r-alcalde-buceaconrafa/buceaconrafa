import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeText(filePath, text) {
  fs.writeFileSync(filePath, text, "utf8");
}

function listHtmlFiles(dir) {
  /** @type {string[]} */
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      out.push(...listHtmlFiles(full));
      continue;
    }
    if (!entry.isFile()) continue;
    if (entry.name.toLowerCase().endsWith(".html")) out.push(full);
  }
  return out;
}

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function getPartnerBandTemplate() {
  const indexPath = path.join(repoRoot, "index.html");
  const indexHtml = readText(indexPath);
  const match = indexHtml.match(/<a class="partner-band"[\s\S]*?<\/a>/);
  if (!match) {
    throw new Error("No se encontró el bloque .partner-band en index.html");
  }
  return match[0];
}

function computePrefix(filePath) {
  const dir = path.dirname(filePath);
  const rel = path.relative(dir, repoRoot);
  if (!rel || rel === ".") return "";
  const ups = rel.split(path.sep).filter((p) => p === "..").length;
  return "../".repeat(ups);
}

function buildPartnerBandHtml(template, href) {
  return template.replace(/href="[^"]*"/, `href="${href}"`);
}

function findHeroSectionEnd(html) {
  const heroOpen = html.match(/<section\b[^>]*\bid=["']hero["'][^>]*>/i);
  if (!heroOpen || heroOpen.index == null) return null;

  let i = heroOpen.index;
  let depth = 0;
  while (i < html.length) {
    const nextOpen = html.indexOf("<section", i);
    const nextClose = html.indexOf("</section", i);
    if (nextClose === -1) return null;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      i = nextOpen + 8;
      continue;
    }

    depth -= 1;
    const closeEnd = html.indexOf(">", nextClose);
    if (closeEnd === -1) return null;
    i = closeEnd + 1;
    if (depth <= 0) return i;
  }
  return null;
}

function findDivEndByClass(html, className) {
  const re = new RegExp(`<div\\b[^>]*\\bclass=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>`, "i");
  const m = html.match(re);
  if (!m || m.index == null) return null;

  let i = m.index;
  let depth = 0;
  while (i < html.length) {
    const nextOpen = html.indexOf("<div", i);
    const nextClose = html.indexOf("</div", i);
    if (nextClose === -1) return null;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      i = nextOpen + 4;
      continue;
    }

    depth -= 1;
    const closeEnd = html.indexOf(">", nextClose);
    if (closeEnd === -1) return null;
    i = closeEnd + 1;
    if (depth <= 0) return i;
  }
  return null;
}

function findNavEnd(html) {
  const navClose = html.toLowerCase().indexOf("</nav>");
  if (navClose === -1) return null;
  return navClose + "</nav>".length;
}

function ensureSpacing(html, insertPos, snippet) {
  const before = html.slice(0, insertPos);
  const after = html.slice(insertPos);
  const prefix = before.endsWith("\n") ? "" : "\n";
  const suffix = after.startsWith("\n") ? "" : "\n";
  return before + prefix + snippet + suffix + after;
}

const template = getPartnerBandTemplate();
const files = listHtmlFiles(repoRoot).sort((a, b) => toPosix(a).localeCompare(toPosix(b)));

/** @type {{file:string, inserted:boolean, reason:string}[]} */
const report = [];

for (const filePath of files) {
  const relPath = toPosix(path.relative(repoRoot, filePath));
  const html = readText(filePath);

  if (html.includes('class="partner-band"')) {
    report.push({ file: relPath, inserted: false, reason: "ya_existe" });
    continue;
  }

  const prefix = computePrefix(filePath);
  const href = `${prefix}seguro-buceo.html#contratar`;
  const snippet = buildPartnerBandHtml(template, href);

  let insertPos = findHeroSectionEnd(html);
  let mode = "after_hero";

  if (insertPos == null) {
    insertPos = findDivEndByClass(html, "nmob");
    mode = "after_nmob";
  }
  if (insertPos == null) {
    insertPos = findNavEnd(html);
    mode = "after_nav";
  }

  if (insertPos == null) {
    report.push({ file: relPath, inserted: false, reason: "no_punto_insercion" });
    continue;
  }

  const next = ensureSpacing(html, insertPos, snippet);
  writeText(filePath, next);
  report.push({ file: relPath, inserted: true, reason: mode });
}

const inserted = report.filter((r) => r.inserted);
const skipped = report.filter((r) => !r.inserted);

console.log(`OK: insertadas ${inserted.length}, sin cambios ${skipped.length}`);
for (const r of report) {
  if (r.inserted) continue;
  if (r.reason === "ya_existe") continue;
  console.log(`WARN: ${r.file} (${r.reason})`);
}

