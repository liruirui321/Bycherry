import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { getContentRoutes } from "./content-routes.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const siteUrl = "https://bycherry.me";

function maxDate(routes) {
  return routes.reduce((latest, route) => route.lastmod > latest ? route.lastmod : latest, "1970-01-01");
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
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
  const loc = `${siteUrl}${route.path === "/" ? "/" : route.path}`;
  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${escapeXml(route.lastmod)}</lastmod>`,
    `    <changefreq>${meta.changefreq}</changefreq>`,
    `    <priority>${meta.priority}</priority>`,
    "  </url>",
  ].join("\n");
}

const contentRoutes = getContentRoutes();
if (!contentRoutes.length) {
  throw new Error("Cannot generate sitemap without content routes.");
}

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
