import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const publicRoot = resolve(root, "public");
const siteUrl = "https://bycherry.me";
const expectedDomain = "bycherry.me";

function readPublic(relativePath) {
  return readFileSync(resolve(publicRoot, relativePath), "utf8");
}

function publicExists(relativePath) {
  return existsSync(resolve(publicRoot, relativePath));
}

function readPngSize(relativePath) {
  const bytes = readFileSync(resolve(publicRoot, relativePath));
  const signature = bytes.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") {
    throw new Error(`${relativePath} is not a PNG file.`);
  }

  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

expect(readPublic("CNAME").trim() === expectedDomain, `CNAME must be ${expectedDomain}.`);

const robots = readPublic("robots.txt");
expect(robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`), "robots.txt must point to the public sitemap.");
expect(robots.includes("User-agent: *"), "robots.txt must declare the default crawler group.");

expect(publicExists("favicon.svg"), "favicon.svg is missing.");
expect(publicExists("social-preview.png"), "social-preview.png is missing.");
expect(publicExists("social-preview.svg"), "social-preview.svg is missing.");
expect(publicExists("site.webmanifest"), "site.webmanifest is missing.");

const manifest = JSON.parse(readPublic("site.webmanifest"));
expect(manifest.name === "By Cherry", "site.webmanifest must use the By Cherry app name.");
expect(manifest.short_name === "By Cherry", "site.webmanifest must use the By Cherry short name.");
expect(manifest.start_url === "/", "site.webmanifest start_url must be /.");
expect(manifest.scope === "/", "site.webmanifest scope must be /.");
expect(manifest.display === "standalone", "site.webmanifest display must be standalone.");
expect(manifest.lang === "zh-CN", "site.webmanifest lang must be zh-CN.");
expect(Array.isArray(manifest.icons) && manifest.icons.some((icon) => icon.src === "/favicon.svg" && icon.type === "image/svg+xml"), "site.webmanifest must include /favicon.svg as an SVG icon.");

const socialPreview = readPngSize("social-preview.png");
expect(socialPreview.width === 1200 && socialPreview.height === 630, "social-preview.png must be 1200x630 for OG/Twitter cards.");

if (failures.length) {
  console.error("Public asset verification failed.");
  console.error(failures.map((failure) => `  - ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Public assets verified: domain, robots, manifest, favicon, and social preview.");
