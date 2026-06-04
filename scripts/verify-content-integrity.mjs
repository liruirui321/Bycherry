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

if (failures.length) {
  console.error("Content integrity verification failed.");
  console.error(failures.map((failure) => `  - ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Content integrity verified: ${workSlugs.size} work routes have detail content coverage.`);
