import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getContentRoutes } from "./content-routes.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

function extractQuotedArray(source, arrayName) {
  const match = source.match(new RegExp(`\\bconst\\s+${arrayName}\\s*=\\s*\\[([\\s\\S]*?)\\]`));
  if (!match) return null;
  return Array.from(match[1].matchAll(/"([^"]+)"/g), (item) => item[1]);
}

function extractRichWorkBranches(source) {
  return new Set(Array.from(source.matchAll(/\bif\s*\(\s*slug\s*===\s*"([^"]+)"\s*\)\s*return\s*</g), (match) => match[1]));
}

function extractExportedArray(source, relativePath) {
  const exportIndex = source.search(/export const \w+ = \[/);
  if (exportIndex < 0) throw new Error(`${relativePath} does not declare an exported content array.`);

  const start = source.indexOf("[", exportIndex);
  const end = source.indexOf("\n];", start);
  if (start < 0 || end < 0) throw new Error(`${relativePath} exported content array is not closed with ];.`);

  return source.slice(start + 1, end);
}

function extractBlocks(arraySource) {
  return Array.from(arraySource.matchAll(/\n\s*\{[\s\S]*?\n\s*\},/g), (match) => match[0]);
}

function hasField(block, fieldName) {
  return new RegExp(`\\b${fieldName}:`).test(block);
}

function getField(block, fieldName) {
  return block.match(new RegExp(`\\b${fieldName}:\\s*"([^"]+)"`))?.[1] ?? null;
}

function countStringItemsInArray(block, fieldName) {
  const match = block.match(new RegExp(`\\b${fieldName}:\\s*\\[([\\s\\S]*?)\\]`));
  if (!match) return 0;
  return Array.from(match[1].matchAll(/"[^"]+"/g)).length;
}

function verifyArticleBlocks({ relativePath, type, summaryField, readingTimeField, labelField }) {
  const arraySource = extractExportedArray(read(relativePath), relativePath);
  const blocks = extractBlocks(arraySource);

  expect(blocks.length > 0, `${relativePath} must include at least one ${type} item.`);

  for (const [index, block] of blocks.entries()) {
    const slug = getField(block, "slug") ?? `item ${index + 1}`;
    const label = `${relativePath} ${slug}`;

    for (const fieldName of ["slug", "href", "date", "title", summaryField, readingTimeField, labelField]) {
      expect(hasField(block, fieldName), `${label} is missing ${fieldName}.`);
    }

    expect(countStringItemsInArray(block, "paragraphs") >= 3, `${label} needs at least 3 paragraph entries for the detail page.`);
    expect(countStringItemsInArray(block, "highlights") >= 3, `${label} needs at least 3 highlight entries for the detail page.`);
  }
}

const routes = getContentRoutes();
const workSlugs = new Set(routes.filter((route) => route.type === "work").map((route) => route.path.replace(/^\/works\//, "")));
const workDetailSource = read("src/app/components/WorkDetailPage.tsx");
const richWorkSlugs = extractQuotedArray(workDetailSource, "richWorkSlugs");
const richWorkBranches = extractRichWorkBranches(workDetailSource);
const directToolSlugs = new Set(
  Array.from(workDetailSource.matchAll(/\bwork\.slug\s*===\s*"([^"]+)"\s*\?\s*</g), (match) => match[1])
);

const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

expect(workSlugs.size > 0, "Works content routes must not be empty.");
expect(Array.isArray(richWorkSlugs), "WorkDetailPage.tsx must declare richWorkSlugs.");

if (richWorkSlugs) {
  for (const slug of richWorkSlugs) {
    expect(workSlugs.has(slug), `richWorkSlugs includes missing work route: ${slug}`);
    expect(richWorkBranches.has(slug), `richWorkSlugs includes ${slug}, but RichWorkContent has no matching branch.`);
  }

  for (const slug of richWorkBranches) {
    expect(richWorkSlugs.includes(slug), `RichWorkContent handles ${slug}, but richWorkSlugs does not include it.`);
  }
}

for (const slug of directToolSlugs) {
  expect(workSlugs.has(slug), `WorkDetailPage renders direct tool content for missing work route: ${slug}`);
}

for (const slug of workSlugs) {
  const hasRichContent = richWorkSlugs?.includes(slug) ?? false;
  const hasDirectTool = directToolSlugs.has(slug);
  expect(hasRichContent || hasDirectTool, `Work route /works/${slug} needs rich content or a direct tool in WorkDetailPage.`);
}

verifyArticleBlocks({
  relativePath: "src/app/components/Notes.tsx",
  type: "note",
  summaryField: "excerpt",
  readingTimeField: "readTime",
  labelField: "tag",
});

verifyArticleBlocks({
  relativePath: "src/app/components/ResearchEssays.tsx",
  type: "research essay",
  summaryField: "body",
  readingTimeField: "readMin",
  labelField: "label",
});

if (failures.length) {
  console.error("Content integrity verification failed.");
  console.error(failures.map((failure) => `  - ${failure}`).join("\n"));
  process.exit(1);
}

const articleRouteCount = routes.filter((route) => route.type !== "work").length;
console.log(`Content integrity verified: ${workSlugs.size} work routes and ${articleRouteCount} article routes have detail content coverage.`);
