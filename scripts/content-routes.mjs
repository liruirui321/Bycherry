import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

const contentSources = [
  { relativePath: "src/app/components/Works.tsx", dateField: "updated", prefix: "/works", type: "work" },
  { relativePath: "src/app/components/Notes.tsx", dateField: "date", prefix: "/notes", type: "note" },
  { relativePath: "src/app/components/ResearchEssays.tsx", dateField: "date", prefix: "/research", type: "research" },
];

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

function extractExportedArray(source, relativePath) {
  const exportIndex = source.search(/export const \w+ = \[/);
  if (exportIndex < 0) throw new Error(`${relativePath} does not declare an exported content array.`);

  const start = source.indexOf("[", exportIndex);
  const end = source.indexOf("\n];", start);
  if (start < 0 || end < 0) throw new Error(`${relativePath} exported content array is not closed with ];.`);

  return source.slice(start + 1, end);
}

function extractField(block, fieldName) {
  return block.match(new RegExp(`\\b${fieldName}:\\s*"([^"]+)"`))?.[1] ?? null;
}

function extractBlocks(arraySource) {
  return Array.from(arraySource.matchAll(/\n\s*\{[\s\S]*?\n\s*\},/g), (match) => match[0]);
}

export function getContentRoutes() {
  const failures = [];
  const routes = [];

  for (const source of contentSources) {
    const arraySource = extractExportedArray(read(source.relativePath), source.relativePath);
    const blocks = extractBlocks(arraySource);

    if (!blocks.length) {
      failures.push(`${source.relativePath} has no extractable content items.`);
      continue;
    }

    blocks.forEach((block, index) => {
      const label = `${source.relativePath} item ${index + 1}`;
      const slug = extractField(block, "slug");
      const path = extractField(block, "href");
      const lastmod = extractField(block, source.dateField);
      const title = extractField(block, "title");

      if (!slug) failures.push(`${label} is missing slug.`);
      if (!path) failures.push(`${label} is missing href.`);
      if (!lastmod) failures.push(`${label} is missing ${source.dateField}.`);
      if (!title) failures.push(`${label} is missing title.`);

      if (path && !path.startsWith(`${source.prefix}/`)) {
        failures.push(`${label} href must start with ${source.prefix}/.`);
      }

      if (slug && path && path !== `${source.prefix}/${slug}`) {
        failures.push(`${label} slug and href disagree: ${slug} vs ${path}.`);
      }

      if (lastmod && !/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) {
        failures.push(`${label} ${source.dateField} must use YYYY-MM-DD.`);
      }

      if (path && lastmod && title) {
        routes.push({ path, lastmod, title, source: source.relativePath, type: source.type });
      }
    });
  }

  const seenPaths = new Set();
  for (const route of routes) {
    if (seenPaths.has(route.path)) failures.push(`Duplicate public route: ${route.path}.`);
    seenPaths.add(route.path);
  }

  if (failures.length) {
    throw new Error(`Content route extraction failed:\n${failures.map((failure) => `  - ${failure}`).join("\n")}`);
  }

  return routes;
}

export function getContentHrefs() {
  return getContentRoutes().map((route) => route.path);
}
