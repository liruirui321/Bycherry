import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { getContentRoutes } from "./content-routes.mjs";
import { siteUrl } from "./site-metadata.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

function unescapeXml(value) {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&");
}

function maxDate(routes) {
  return routes.reduce((latest, route) => route.lastmod > latest ? route.lastmod : latest, "1970-01-01");
}

function routeMeta(route) {
  if (route.path === "/") return { changefreq: "weekly", priority: "1.0" };
  if (route.path === "/works/gene-expression" || route.path === "/works/crispr-interactive") return { changefreq: "monthly", priority: "0.9" };
  if (route.path.startsWith("/works/")) return { changefreq: "monthly", priority: "0.85" };
  if (route.path.startsWith("/research/")) return { changefreq: "monthly", priority: "0.75" };
  return { changefreq: "monthly", priority: "0.7" };
}

const contentRoutes = getContentRoutes();
const expectedRoutes = [
  { path: "/", lastmod: maxDate(contentRoutes) },
  ...contentRoutes,
];
const expectedPaths = new Set(expectedRoutes.map((route) => route.path));
const expectedLastmods = new Map(expectedRoutes.map((route) => [route.path, route.lastmod]));
const expectedMeta = new Map(expectedRoutes.map((route) => [route.path, routeMeta(route)]));

const sitemap = read("public/sitemap.xml");
const sitemapEntries = Array.from(sitemap.matchAll(/<url>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<lastmod>([^<]+)<\/lastmod>[\s\S]*?<changefreq>([^<]+)<\/changefreq>[\s\S]*?<priority>([^<]+)<\/priority>[\s\S]*?<\/url>/g), (match) => ({
  url: unescapeXml(match[1]),
  lastmod: unescapeXml(match[2]),
  changefreq: unescapeXml(match[3]),
  priority: unescapeXml(match[4]),
}));
const sitemapPaths = new Set();
const sitemapLastmods = new Map();
const sitemapMeta = new Map();
const invalidUrls = [];

for (const { url, lastmod, changefreq, priority } of sitemapEntries) {
  if (!url.startsWith(siteUrl)) {
    invalidUrls.push(url);
    continue;
  }

  const path = url.slice(siteUrl.length) || "/";
  sitemapPaths.add(path);
  sitemapLastmods.set(path, lastmod);
  sitemapMeta.set(path, { changefreq, priority });
}

const missing = Array.from(expectedPaths).filter((path) => !sitemapPaths.has(path));
const stale = Array.from(sitemapPaths).filter((path) => !expectedPaths.has(path));
const lastmodMismatches = Array.from(expectedLastmods).filter(([path, date]) => sitemapLastmods.get(path) !== date);
const metaMismatches = Array.from(expectedMeta).filter(([path, meta]) => {
  const found = sitemapMeta.get(path);
  return found?.changefreq !== meta.changefreq || found?.priority !== meta.priority;
});

if (invalidUrls.length || missing.length || stale.length || lastmodMismatches.length || metaMismatches.length) {
  console.error("Sitemap verification failed.");
  if (invalidUrls.length) console.error(`Invalid domain:\n${invalidUrls.map((url) => `  - ${url}`).join("\n")}`);
  if (missing.length) console.error(`Missing routes:\n${missing.map((path) => `  - ${path}`).join("\n")}`);
  if (stale.length) console.error(`Stale routes:\n${stale.map((path) => `  - ${path}`).join("\n")}`);
  if (lastmodMismatches.length) {
    console.error(`Mismatched lastmod:\n${lastmodMismatches.map(([path, date]) => `  - ${path}: expected ${date}, found ${sitemapLastmods.get(path) ?? "missing"}`).join("\n")}`);
  }
  if (metaMismatches.length) {
    console.error(`Mismatched sitemap metadata:\n${metaMismatches.map(([path, meta]) => {
      const found = sitemapMeta.get(path);
      return `  - ${path}: expected ${meta.changefreq}/${meta.priority}, found ${found ? `${found.changefreq}/${found.priority}` : "missing"}`;
    }).join("\n")}`);
  }
  process.exit(1);
}

console.log(`Sitemap covers ${expectedPaths.size} public routes with current lastmod, changefreq, and priority metadata.`);
