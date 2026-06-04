import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { getContentRoutes } from "./content-routes.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const siteUrl = "https://bycherry.me";

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

const contentRoutes = getContentRoutes();
const expectedPaths = new Set([
  "/",
  ...contentRoutes.map((route) => route.path),
]);
const expectedLastmods = new Map([
  ...contentRoutes.map((route) => [route.path, route.lastmod]),
]);

const sitemap = read("public/sitemap.xml");
const sitemapEntries = Array.from(sitemap.matchAll(/<url>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<lastmod>([^<]+)<\/lastmod>[\s\S]*?<\/url>/g), (match) => ({
  url: match[1],
  lastmod: match[2],
}));
const sitemapPaths = new Set();
const sitemapLastmods = new Map();
const invalidUrls = [];

for (const { url, lastmod } of sitemapEntries) {
  if (!url.startsWith(siteUrl)) {
    invalidUrls.push(url);
    continue;
  }

  const path = url.slice(siteUrl.length) || "/";
  sitemapPaths.add(path);
  sitemapLastmods.set(path, lastmod);
}

const missing = Array.from(expectedPaths).filter((path) => !sitemapPaths.has(path));
const stale = Array.from(sitemapPaths).filter((path) => !expectedPaths.has(path));
const lastmodMismatches = Array.from(expectedLastmods).filter(([path, date]) => sitemapLastmods.get(path) !== date);

if (invalidUrls.length || missing.length || stale.length || lastmodMismatches.length) {
  console.error("Sitemap verification failed.");
  if (invalidUrls.length) console.error(`Invalid domain:\n${invalidUrls.map((url) => `  - ${url}`).join("\n")}`);
  if (missing.length) console.error(`Missing routes:\n${missing.map((path) => `  - ${path}`).join("\n")}`);
  if (stale.length) console.error(`Stale routes:\n${stale.map((path) => `  - ${path}`).join("\n")}`);
  if (lastmodMismatches.length) {
    console.error(`Mismatched lastmod:\n${lastmodMismatches.map(([path, date]) => `  - ${path}: expected ${date}, found ${sitemapLastmods.get(path) ?? "missing"}`).join("\n")}`);
  }
  process.exit(1);
}

console.log(`Sitemap covers ${expectedPaths.size} public routes and ${expectedLastmods.size} dated entries.`);
