import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourceRoot = resolve(root, "src/app");
const publicRoot = resolve(root, "public");

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

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

function extractDataHrefs(relativePath) {
  return Array.from(read(relativePath).matchAll(/href:\s*"([^"]+)"/g), (match) => match[1])
    .filter((href) => href.startsWith("/"));
}

function extractLiteralHrefs(filePath) {
  const source = readFileSync(filePath, "utf8");
  return Array.from(source.matchAll(/\bhref\s*=\s*"([^"]+)"/g), (match) => match[1])
    .filter((href) => href.startsWith("/") || href.startsWith("#"))
    .map((href) => ({ href, filePath }));
}

function extractStaticIds(relativePath) {
  return Array.from(read(relativePath).matchAll(/\bid="([^"]+)"/g), (match) => match[1]);
}

const publicRoutes = new Set([
  "/",
  ...extractDataHrefs("src/app/components/Works.tsx"),
  ...extractDataHrefs("src/app/components/Notes.tsx"),
  ...extractDataHrefs("src/app/components/ResearchEssays.tsx"),
]);

const homeAnchors = new Set([
  ...extractStaticIds("src/app/App.tsx"),
  ...extractStaticIds("src/app/components/Hero.tsx"),
  ...extractStaticIds("src/app/components/Works.tsx"),
  ...extractStaticIds("src/app/components/About.tsx"),
  ...extractStaticIds("src/app/components/ResearchEssays.tsx"),
  ...extractStaticIds("src/app/components/Notes.tsx"),
  ...extractStaticIds("src/app/components/Contact.tsx"),
]);

const internalLinks = [
  ...walkFiles(sourceRoot, [".tsx", ".ts"]).flatMap(extractLiteralHrefs),
  ...walkFiles(publicRoot, [".html"]).flatMap(extractLiteralHrefs),
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

if (failures.length) {
  console.error("Internal link verification failed.");
  console.error(failures.map((failure) => `  - ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Internal links verified: ${internalLinks.length} literal links, ${publicRoutes.size} public routes, ${homeAnchors.size} home anchors.`);
