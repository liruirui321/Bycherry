import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const siteUrl = "https://bycherry.me";

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

function extractDatedRoutes(relativePath, dateField) {
  const source = read(relativePath);
  const pattern = new RegExp(`href:\\s*"([^"]+)"[\\s\\S]*?${dateField}:\\s*"([^"]+)"`, "g");
  return Array.from(source.matchAll(pattern), (match) => ({
    path: match[1],
    lastmod: match[2],
  })).filter((item) => item.path.startsWith("/"));
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

function xmlEntry(route) {
  const meta = routeMeta(route);
  return [
    "  <url>",
    `    <loc>${siteUrl}${route.path === "/" ? "/" : route.path}</loc>`,
    `    <lastmod>${route.lastmod}</lastmod>`,
    `    <changefreq>${meta.changefreq}</changefreq>`,
    `    <priority>${meta.priority}</priority>`,
    "  </url>",
  ].join("\n");
}

const contentRoutes = [
  ...extractDatedRoutes("src/app/components/Works.tsx", "updated"),
  ...extractDatedRoutes("src/app/components/Notes.tsx", "date"),
  ...extractDatedRoutes("src/app/components/ResearchEssays.tsx", "date"),
];
const routes = [
  { path: "/", lastmod: maxDate(contentRoutes) },
  ...contentRoutes,
];
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  routes.map(xmlEntry).join("\n"),
  "</urlset>",
  "",
].join("\n");

writeFileSync(resolve(root, "public/sitemap.xml"), sitemap);
console.log(`Sitemap generated: ${routes.length} public routes.`);
