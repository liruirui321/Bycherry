import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getContentHrefs } from "./content-routes.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourceRoot = resolve(root, "src/app");
const publicRoot = resolve(root, "public");

function walkFiles(directory, extensions, files = []) {
  for (const entry of readdirSync(directory)) {
    const fullPath = resolve(directory, entry);
    if (statSync(fullPath).isDirectory()) {
      walkFiles(fullPath, extensions, files);
      continue;
    }

    if (extensions.some((extension) => fullPath.endsWith(extension))) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractStaticInternalLinks(filePath) {
  const source = readFileSync(filePath, "utf8");
  const patterns = [
    /\bhref\s*=\s*"([^"]+)"/g,
    /\bhref:\s*"([^"]+)"/g,
    /\bnavigateClient\(\s*"([^"]+)"/g,
    /\bnavigateHome\(\s*"([^"]+)"/g,
    /\bnavigateHomeSection\(\s*"([^"]+)"/g,
  ];

  return patterns.flatMap((pattern) => Array.from(source.matchAll(pattern), (match) => match[1]))
    .filter((href) => href.startsWith("/") || href.startsWith("#"))
    .map((href) => ({ href, filePath }));
}

function extractTargetBlankAnchors(filePath) {
  const source = readFileSync(filePath, "utf8");
  return Array.from(source.matchAll(/<a\b[\s\S]*?>/g), (match) => ({ tag: match[0], filePath }));
}

function extractStaticIds(relativePath) {
  return Array.from(readFileSync(resolve(root, relativePath), "utf8").matchAll(/\bid="([^"]+)"/g), (match) => match[1]);
}

const publicRoutes = new Set([
  "/",
  ...getContentHrefs(),
]);

const homeAnchors = new Set([
  ...extractStaticIds("src/app/App.tsx"),
  ...extractStaticIds("src/app/components/Hero.tsx"),
  ...extractStaticIds("src/app/components/Works.tsx"),
  ...extractStaticIds("src/app/components/ResearchEssays.tsx"),
  ...extractStaticIds("src/app/components/Notes.tsx"),
  ...extractStaticIds("src/app/components/Footer.tsx"),
]);

const internalLinks = [
  ...walkFiles(sourceRoot, [".tsx", ".ts"]).flatMap(extractStaticInternalLinks),
  ...walkFiles(publicRoot, [".html"]).flatMap(extractStaticInternalLinks),
];
const targetBlankAnchors = [
  ...walkFiles(sourceRoot, [".tsx", ".ts"]).flatMap(extractTargetBlankAnchors),
  ...walkFiles(publicRoot, [".html"]).flatMap(extractTargetBlankAnchors),
];

const failures = [];

function sourceLabel(filePath) {
  return filePath.replace(`${root}/`, "");
}

function splitHref(href) {
  const [pathPart, hashPart] = href.split("#");
  return {
    path: pathPart || "/",
    hash: hashPart ? `#${hashPart}` : "",
  };
}

function isPublicAssetPath(path) {
  return /\.[a-z0-9]+$/i.test(path);
}

function hasTargetBlank(tag) {
  return /\btarget\s*=\s*"_blank"/.test(tag) || /\btarget\s*=\s*\{[^}]*"_blank"[^}]*\}/.test(tag);
}

function hasSafeExternalRel(tag) {
  const literalRel = tag.match(/\brel\s*=\s*"([^"]+)"/)?.[1];
  if (literalRel?.split(/\s+/).some((value) => value === "noreferrer" || value === "noopener")) return true;

  const expressionRel = tag.match(/\brel\s*=\s*\{([^}]+)\}/)?.[1];
  return Boolean(expressionRel && /["'](?:noreferrer|noopener)["']/.test(expressionRel));
}

for (const { href, filePath } of internalLinks) {
  const { path, hash } = splitHref(href);
  const normalizedPath = path.replace(/\/$/, "") || "/";
  const normalizedHash = hash.replace(/^#/, "");

  if (isPublicAssetPath(normalizedPath)) {
    if (!existsSync(resolve(publicRoot, normalizedPath.replace(/^\//, "")))) {
      failures.push(`${sourceLabel(filePath)} links to missing public asset: ${href}`);
    }
    continue;
  }

  if (!publicRoutes.has(normalizedPath)) {
    failures.push(`${sourceLabel(filePath)} links to unknown route: ${href}`);
    continue;
  }

  if (normalizedPath === "/" && normalizedHash && !homeAnchors.has(normalizedHash)) {
    failures.push(`${sourceLabel(filePath)} links to missing home anchor: ${href}`);
  }
}

let checkedTargetBlankLinks = 0;
for (const { tag, filePath } of targetBlankAnchors) {
  if (!hasTargetBlank(tag)) continue;
  checkedTargetBlankLinks += 1;

  if (!hasSafeExternalRel(tag)) {
    failures.push(`${sourceLabel(filePath)} opens a link in a new tab without rel="noreferrer" or rel="noopener".`);
  }
}

if (failures.length) {
  console.error("Internal link verification failed.");
  console.error(failures.map((failure) => `  - ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Internal links verified: ${internalLinks.length} static internal links, ${publicRoutes.size} public routes, ${homeAnchors.size} home anchors, and ${checkedTargetBlankLinks} safe new-tab links.`);
