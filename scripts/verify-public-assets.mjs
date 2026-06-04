import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const publicRoot = resolve(root, "public");
const siteUrl = "https://bycherry.me";
const expectedDomain = "bycherry.me";

function readRoot(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

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

const indexHtml = readRoot("index.html");
expect(indexHtml.includes('<html lang="zh-CN">'), "index.html must declare zh-CN language.");
expect(indexHtml.includes('<link rel="canonical" href="https://bycherry.me/" />'), "index.html must include the home canonical URL.");
expect(indexHtml.includes('<meta property="og:image:secure_url" content="https://bycherry.me/social-preview.png" />'), "index.html must include og:image:secure_url.");
expect(indexHtml.includes('<link rel="preconnect" href="https://fonts.googleapis.com" />'), "index.html must preconnect to Google Fonts.");
expect(indexHtml.includes("<noscript>") && indexHtml.includes("/works/gene-expression") && indexHtml.includes("/research/science-to-classroom-question"), "index.html must include a noscript content index.");

const jsonLdMatch = indexHtml.match(/<script type="application\/ld\+json" data-schema="bycherry-page">\s*([\s\S]*?)\s*<\/script>/);
expect(Boolean(jsonLdMatch), "index.html must include static home JSON-LD.");
if (jsonLdMatch) {
  try {
    const jsonLd = JSON.parse(jsonLdMatch[1]);
    const graph = Array.isArray(jsonLd["@graph"]) ? jsonLd["@graph"] : [];
    expect(graph.some((item) => item["@type"] === "WebSite" && item.url === `${siteUrl}/`), "Static JSON-LD must include the By Cherry WebSite.");
    expect(graph.some((item) => item["@type"] === "ItemList" && item["@id"] === `${siteUrl}/#works`), "Static JSON-LD must include the works ItemList.");
  } catch (error) {
    failures.push(`Static JSON-LD must be valid JSON: ${error.message}`);
  }
}

if (failures.length) {
  console.error("Public asset verification failed.");
  console.error(failures.map((failure) => `  - ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Public assets verified: domain, robots, manifest, favicon, social preview, and index metadata.");
