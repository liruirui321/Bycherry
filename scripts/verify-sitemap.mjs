import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const siteUrl = "https://bycherry.me";

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

function extractHrefs(relativePath) {
  const source = read(relativePath);
  return Array.from(source.matchAll(/href:\s*"([^"]+)"/g), (match) => match[1])
    .filter((href) => href.startsWith("/"));
}

const expectedPaths = new Set([
  "/",
  ...extractHrefs("src/app/components/Works.tsx"),
  ...extractHrefs("src/app/components/Notes.tsx"),
  ...extractHrefs("src/app/components/ResearchEssays.tsx"),
]);

const sitemap = read("public/sitemap.xml");
const sitemapUrls = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]);
const sitemapPaths = new Set();
const invalidUrls = [];

for (const url of sitemapUrls) {
  if (!url.startsWith(siteUrl)) {
    invalidUrls.push(url);
    continue;
  }

  const path = url.slice(siteUrl.length) || "/";
  sitemapPaths.add(path);
}

const missing = Array.from(expectedPaths).filter((path) => !sitemapPaths.has(path));
const stale = Array.from(sitemapPaths).filter((path) => !expectedPaths.has(path));

if (invalidUrls.length || missing.length || stale.length) {
  console.error("Sitemap verification failed.");
  if (invalidUrls.length) console.error(`Invalid domain:\n${invalidUrls.map((url) => `  - ${url}`).join("\n")}`);
  if (missing.length) console.error(`Missing routes:\n${missing.map((path) => `  - ${path}`).join("\n")}`);
  if (stale.length) console.error(`Stale routes:\n${stale.map((path) => `  - ${path}`).join("\n")}`);
  process.exit(1);
}

console.log(`Sitemap covers ${expectedPaths.size} public routes.`);
