import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getContentHrefs } from "./content-routes.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const publicRoot = resolve(root, "public");
const siteUrl = "https://bycherry.me";
const expectedDomain = "bycherry.me";
const shareTagline = "科学、课程与 AI 主题作品集";
const manifestDescription = `${shareTagline}。`;
const shareDescription = "科学、课程与 AI 主题作品集，收录科学教育、学习工具、课程卡片和科研转译记录。";
const shareImageAlt = "By Cherry 科学、课程与 AI 主题作品集预览图";
const worksListDescription = "科学教育、AI 工具和课程设计主题作品。";
const articlesListDescription = "课程开发、科学传播、AI 创作和科研转译记录。";
const retiredShareCopy = "可打开、可阅读、可操作";
const appThemeColor = "#F5F1EA";
const generatedIllustrations = [
  "illustrations/crispr-editing-flow.webp",
  "illustrations/gene-expression-flow.webp",
  "illustrations/plant-evolution-story.webp",
];

function readRoot(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

function rootExists(relativePath) {
  return existsSync(resolve(root, relativePath));
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

function isWebp(relativePath) {
  const bytes = readFileSync(resolve(publicRoot, relativePath));
  return bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
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
for (const illustrationPath of generatedIllustrations) {
  expect(publicExists(illustrationPath), `${illustrationPath} is missing.`);
}
expect(publicExists("site.webmanifest"), "site.webmanifest is missing.");
expect(publicExists("_redirects"), "Netlify _redirects fallback is missing.");
expect(publicExists("404.html"), "Static-host 404 fallback is missing.");
expect(rootExists("vercel.json"), "Vercel rewrite config is missing.");

const redirects = readPublic("_redirects").trim();
expect(redirects === "/* /index.html 200", "public/_redirects must rewrite all routes to /index.html with 200.");

const staticFallback = readPublic("404.html");
expect(staticFallback.includes('<meta name="robots" content="noindex" />'), "public/404.html must be noindex.");
expect(staticFallback.includes('sessionStorage.setItem(') && staticFallback.includes('"bycherry-redirect-path"'), "public/404.html must preserve the requested route in sessionStorage.");
expect(staticFallback.includes('window.location.replace("/")'), "public/404.html must redirect back to the app root.");

const vercel = JSON.parse(readRoot("vercel.json"));
expect(Array.isArray(vercel.rewrites), "vercel.json must declare rewrites.");
expect(
  vercel.rewrites?.some((rewrite) => rewrite.source === "/(.*)" && rewrite.destination === "/index.html"),
  "vercel.json must rewrite direct client routes to /index.html."
);

const manifest = JSON.parse(readPublic("site.webmanifest"));
expect(manifest.name === "By Cherry", "site.webmanifest must use the By Cherry app name.");
expect(manifest.short_name === "By Cherry", "site.webmanifest must use the By Cherry short name.");
expect(manifest.description === manifestDescription, "site.webmanifest description must match the current share description.");
expect(manifest.start_url === "/", "site.webmanifest start_url must be /.");
expect(manifest.scope === "/", "site.webmanifest scope must be /.");
expect(manifest.display === "standalone", "site.webmanifest display must be standalone.");
expect(manifest.lang === "zh-CN", "site.webmanifest lang must be zh-CN.");
expect(manifest.background_color === appThemeColor, "site.webmanifest background_color must match the app theme color.");
expect(manifest.theme_color === appThemeColor, "site.webmanifest theme_color must match the app theme color.");
expect(Array.isArray(manifest.icons) && manifest.icons.some((icon) => icon.src === "/favicon.svg" && icon.type === "image/svg+xml"), "site.webmanifest must include /favicon.svg as an SVG icon.");
const favicon = readPublic("favicon.svg");
expect(favicon.includes(`fill="${appThemeColor}"`), "favicon.svg background fill must match the app theme color.");

const socialPreview = readPngSize("social-preview.png");
expect(socialPreview.width === 1200 && socialPreview.height === 630, "social-preview.png must be 1200x630 for OG/Twitter cards.");
const socialPreviewSvg = readPublic("social-preview.svg");
expect(socialPreviewSvg.includes(shareTagline), "social-preview.svg must include the current share tagline.");
expect(!socialPreviewSvg.includes(retiredShareCopy), "social-preview.svg must not include retired share copy.");
for (const illustrationPath of generatedIllustrations) {
  if (!publicExists(illustrationPath)) continue;
  const illustrationSize = statSync(resolve(publicRoot, illustrationPath)).size;
  expect(isWebp(illustrationPath), `${illustrationPath} must be a WebP file.`);
  expect(illustrationSize > 100_000 && illustrationSize < 500_000, `${illustrationPath} should stay detailed but lightweight.`);
}

const indexHtml = readRoot("index.html");
const contentHrefs = getContentHrefs();
expect(indexHtml.includes('<html lang="zh-CN">'), "index.html must declare zh-CN language.");
expect(indexHtml.includes(`<meta name="theme-color" content="${appThemeColor}" />`), "index.html theme-color must match the app theme color.");
expect(indexHtml.includes('<meta name="application-name" content="By Cherry" />'), "index.html must include the PWA application name.");
expect(indexHtml.includes('<meta name="apple-mobile-web-app-title" content="By Cherry" />'), "index.html must include the Apple mobile web app title.");
expect(indexHtml.includes('<meta name="mobile-web-app-capable" content="yes" />'), "index.html must declare mobile web app capability.");
expect(indexHtml.includes('<link rel="canonical" href="https://bycherry.me/" />'), "index.html must include the home canonical URL.");
expect(indexHtml.includes('<meta property="og:url" content="https://bycherry.me/" />'), "index.html must include the home OG URL.");
expect(indexHtml.includes(`<meta property="og:description" content="${shareDescription}" />`), "index.html must include the current OG description.");
expect(indexHtml.includes(`<meta name="twitter:description" content="${shareDescription}" />`), "index.html must include the current Twitter description.");
expect(indexHtml.includes(`<meta property="og:image:alt" content="${shareImageAlt}" />`), "index.html must include the current OG image alt text.");
expect(indexHtml.includes(`<meta name="twitter:image:alt" content="${shareImageAlt}" />`), "index.html must include the current Twitter image alt text.");
expect(!indexHtml.includes(retiredShareCopy), "index.html must not include retired share copy.");
expect(indexHtml.includes('<meta property="og:image" content="https://bycherry.me/social-preview.png" />'), "index.html must include the current OG image URL.");
expect(indexHtml.includes('<meta property="og:image:secure_url" content="https://bycherry.me/social-preview.png" />'), "index.html must include og:image:secure_url.");
expect(indexHtml.includes('<meta name="twitter:image" content="https://bycherry.me/social-preview.png" />'), "index.html must include the current Twitter image URL.");
expect(indexHtml.includes('<link rel="preconnect" href="https://fonts.googleapis.com" />'), "index.html must preconnect to Google Fonts.");
expect(indexHtml.includes("<noscript>"), "index.html must include a noscript content index.");
for (const href of contentHrefs) {
  expect(indexHtml.includes(`href="${href}"`), `index.html noscript content index must link to ${href}.`);
}

const jsonLdMatch = indexHtml.match(/<script type="application\/ld\+json" data-schema="bycherry-page">\s*([\s\S]*?)\s*<\/script>/);
expect(Boolean(jsonLdMatch), "index.html must include static home JSON-LD.");
if (jsonLdMatch) {
  try {
    const jsonLd = JSON.parse(jsonLdMatch[1]);
    const graph = Array.isArray(jsonLd["@graph"]) ? jsonLd["@graph"] : [];
    expect(graph.some((item) => item["@type"] === "WebSite" && item.url === `${siteUrl}/`), "Static JSON-LD must include the By Cherry WebSite.");
    const worksList = graph.find((item) => item["@type"] === "ItemList" && item["@id"] === `${siteUrl}/#works`);
    const articlesList = graph.find((item) => item["@type"] === "ItemList" && item["@id"] === `${siteUrl}/#articles`);
    expect(Boolean(worksList), "Static JSON-LD must include the works ItemList.");
    expect(Boolean(articlesList), "Static JSON-LD must include the articles ItemList.");
    expect(worksList?.description === worksListDescription, "Static works ItemList must include the current description.");
    expect(articlesList?.description === articlesListDescription, "Static articles ItemList must include the current description.");
    expect(worksList?.numberOfItems === contentHrefs.filter((href) => href.startsWith("/works/")).length, "Static works ItemList must include the current numberOfItems.");
    expect(articlesList?.numberOfItems === contentHrefs.filter((href) => !href.startsWith("/works/")).length, "Static articles ItemList must include the current numberOfItems.");
    const jsonLdText = JSON.stringify(jsonLd);
    for (const href of contentHrefs) {
      expect(jsonLdText.includes(`${siteUrl}${href}`), `Static JSON-LD must include ${href}.`);
    }
  } catch (error) {
    failures.push(`Static JSON-LD must be valid JSON: ${error.message}`);
  }
}

if (failures.length) {
  console.error("Public asset verification failed.");
  console.error(failures.map((failure) => `  - ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Public assets verified: domain, host fallbacks, robots, manifest, favicon, PWA titles, social preview metadata, generated illustrations, and index metadata.");
