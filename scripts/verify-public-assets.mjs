import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getContentHrefs } from "./content-routes.mjs";
import {
  articlesListDescription,
  expectedDomain,
  manifestDescription,
  shareDescription,
  shareImageAlt,
  shareTagline,
  siteDescription,
  siteUrl,
  worksListDescription,
} from "./site-metadata.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const publicRoot = resolve(root, "public");
const retiredShareCopy = "可打开、可阅读、可操作";
const retiredSiteDescription = "清爽科普风的个人网站";
const retiredSharePositioning = "主题作品集";
const appThemeColor = "#F5F1EA";
const generatedIllustrationsBySlug = {
  "concept-explainer": { path: "illustrations/concept-explainer-map.webp", width: 1448, height: 1086 },
  "crispr-interactive": { path: "illustrations/crispr-editing-flow.webp", width: 1448, height: 1086 },
  "gene-expression": { path: "illustrations/gene-expression-flow.webp", width: 1448, height: 1086 },
  "plant-evolution-stories": { path: "illustrations/plant-evolution-story.webp", width: 941, height: 1672 },
  "research-prompt-kit": { path: "illustrations/research-prompt-workflow.webp", width: 1448, height: 1086 },
};
const generatedIllustrations = Object.values(generatedIllustrationsBySlug);

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

function readVp8WebpSize(relativePath) {
  const bytes = readFileSync(resolve(publicRoot, relativePath));
  if (bytes.subarray(0, 4).toString("ascii") !== "RIFF" || bytes.subarray(8, 12).toString("ascii") !== "WEBP") {
    throw new Error(`${relativePath} is not a WebP file.`);
  }
  if (bytes.subarray(12, 16).toString("ascii") !== "VP8 ") {
    throw new Error(`${relativePath} must use VP8 lossy WebP encoding.`);
  }
  if (bytes[23] !== 0x9d || bytes[24] !== 0x01 || bytes[25] !== 0x2a) {
    throw new Error(`${relativePath} has an invalid VP8 start code.`);
  }

  return {
    width: bytes.readUInt16LE(26) & 0x3fff,
    height: bytes.readUInt16LE(28) & 0x3fff,
  };
}

const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

expect(readPublic("CNAME").trim() === expectedDomain, `CNAME must be ${expectedDomain}.`);

const robots = readPublic("robots.txt");
const expectedRobots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml`;
expect(robots.trim() === expectedRobots, "robots.txt must exactly declare the default crawler group, allow rule, and shared-metadata sitemap URL.");

expect(publicExists("favicon.svg"), "favicon.svg is missing.");
expect(publicExists("social-preview.png"), "social-preview.png is missing.");
expect(publicExists("social-preview.svg"), "social-preview.svg is missing.");
for (const illustration of generatedIllustrations) {
  expect(publicExists(illustration.path), `${illustration.path} is missing.`);
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
expect(!socialPreviewSvg.includes(retiredSharePositioning), "social-preview.svg must not include the retired share positioning.");
for (const illustration of generatedIllustrations) {
  if (!publicExists(illustration.path)) continue;
  const illustrationSize = statSync(resolve(publicRoot, illustration.path)).size;
  const illustrationDimensions = readVp8WebpSize(illustration.path);
  expect(isWebp(illustration.path), `${illustration.path} must be a WebP file.`);
  expect(illustrationSize > 100_000 && illustrationSize < 500_000, `${illustration.path} should stay detailed but lightweight.`);
  expect(illustrationDimensions.width === illustration.width && illustrationDimensions.height === illustration.height, `${illustration.path} must be ${illustration.width}x${illustration.height}.`);
}

const indexHtml = readRoot("index.html");
const appSource = readRoot("src/app/App.tsx");
const appMetadataSource = readRoot("src/app/siteMetadata.ts");
const staticIndexSource = readRoot("scripts/generate-static-index.mjs");
const sitemapGeneratorSource = readRoot("scripts/generate-sitemap.mjs");
const sitemapVerifierSource = readRoot("scripts/verify-sitemap.mjs");
const siteMetadataSource = readRoot("scripts/site-metadata.mjs");
const workPreviewSource = readRoot("src/app/components/WorkPreviewIllustration.tsx");
const contentHrefs = getContentHrefs();
expect(appSource.includes('from "./siteMetadata"'), "App.tsx must import runtime metadata from src/app/siteMetadata.ts.");
for (const exportName of ["siteTitle", "homeTitle", "siteDescription", "siteUrl", "socialImageUrl", "shareImageAlt"]) {
  expect(appMetadataSource.includes(`export const ${exportName}`), `src/app/siteMetadata.ts must export ${exportName}.`);
  expect(!new RegExp(`const\\s+${exportName}\\s*=`).test(appSource), `App.tsx must not redeclare ${exportName}; use src/app/siteMetadata.ts.`);
}
expect(staticIndexSource.includes('from "./site-metadata.mjs"'), "Static index generator must import shared site metadata.");
for (const exportName of ["siteUrl", "siteDescription", "shareDescription", "shareImageAlt", "worksListDescription", "articlesListDescription"]) {
  expect(siteMetadataSource.includes(`export const ${exportName}`), `site-metadata.mjs must export ${exportName}.`);
  expect(!new RegExp(`const\\s+${exportName}\\s*=`).test(staticIndexSource), `Static index generator must not redeclare ${exportName}; use site-metadata.mjs.`);
}
for (const [label, source] of [["sitemap generator", sitemapGeneratorSource], ["sitemap verifier", sitemapVerifierSource]]) {
  expect(source.includes('from "./site-metadata.mjs"'), `${label} must import shared site metadata.`);
  expect(!/const\s+siteUrl\s*=/.test(source), `${label} must not redeclare siteUrl; use site-metadata.mjs.`);
}
for (const [slug, illustration] of Object.entries(generatedIllustrationsBySlug)) {
  expect(workPreviewSource.includes(`slug === "${slug}"`), `WorkPreviewIllustration must define a preview branch for ${slug}.`);
  expect(workPreviewSource.includes(`src="/${illustration.path}"`), `WorkPreviewIllustration must use /${illustration.path} for ${slug}.`);
}
expect(indexHtml.includes('<html lang="zh-CN">'), "index.html must declare zh-CN language.");
expect(indexHtml.includes(`<meta name="theme-color" content="${appThemeColor}" />`), "index.html theme-color must match the app theme color.");
expect(indexHtml.includes('<meta name="application-name" content="By Cherry" />'), "index.html must include the PWA application name.");
expect(indexHtml.includes('<meta name="apple-mobile-web-app-title" content="By Cherry" />'), "index.html must include the Apple mobile web app title.");
expect(indexHtml.includes('<meta name="mobile-web-app-capable" content="yes" />'), "index.html must declare mobile web app capability.");
expect(indexHtml.includes(`<meta name="description" content="${siteDescription}" />`), "index.html must include the current site description.");
expect(appMetadataSource.includes(siteDescription), "Runtime metadata module must include the current site description.");
expect(appMetadataSource.includes(shareImageAlt), "Runtime metadata module must include the current share image alt text.");
expect(indexHtml.includes('<link rel="canonical" href="https://bycherry.me/" />'), "index.html must include the home canonical URL.");
expect(indexHtml.includes('<meta property="og:url" content="https://bycherry.me/" />'), "index.html must include the home OG URL.");
expect(indexHtml.includes(`<meta property="og:description" content="${shareDescription}" />`), "index.html must include the current OG description.");
expect(indexHtml.includes(`<meta name="twitter:description" content="${shareDescription}" />`), "index.html must include the current Twitter description.");
expect(indexHtml.includes(`<meta property="og:image:alt" content="${shareImageAlt}" />`), "index.html must include the current OG image alt text.");
expect(indexHtml.includes(`<meta name="twitter:image:alt" content="${shareImageAlt}" />`), "index.html must include the current Twitter image alt text.");
expect(!indexHtml.includes(retiredShareCopy), "index.html must not include retired share copy.");
expect(!indexHtml.includes(retiredSiteDescription), "index.html must not include the retired personal-site description.");
expect(!indexHtml.includes(retiredSharePositioning), "index.html must not include the retired share positioning.");
expect(indexHtml.includes('<meta property="og:image" content="https://bycherry.me/social-preview.png" />'), "index.html must include the current OG image URL.");
expect(indexHtml.includes('<meta property="og:image:secure_url" content="https://bycherry.me/social-preview.png" />'), "index.html must include og:image:secure_url.");
expect(indexHtml.includes('<meta name="twitter:image" content="https://bycherry.me/social-preview.png" />'), "index.html must include the current Twitter image URL.");
expect(indexHtml.includes('<link rel="preconnect" href="https://fonts.googleapis.com" />'), "index.html must preconnect to Google Fonts.");
expect(indexHtml.includes("<noscript>"), "index.html must include a noscript content index.");
expect(indexHtml.includes("学习路径："), "index.html noscript content index must include work learning paths.");
expect(indexHtml.includes("拖拽 TF、RNA 聚合酶和核糖体"), "index.html noscript content index must include work descriptions.");
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
    expect(graph.some((item) => item["@type"] === "WebSite" && item.description === siteDescription), "Static JSON-LD WebSite must include the current site description.");
    expect(Boolean(worksList), "Static JSON-LD must include the works ItemList.");
    expect(Boolean(articlesList), "Static JSON-LD must include the articles ItemList.");
    expect(worksList?.description === worksListDescription, "Static works ItemList must include the current description.");
    expect(articlesList?.description === articlesListDescription, "Static articles ItemList must include the current description.");
    expect(worksList?.numberOfItems === contentHrefs.filter((href) => href.startsWith("/works/")).length, "Static works ItemList must include the current numberOfItems.");
    expect(articlesList?.numberOfItems === contentHrefs.filter((href) => !href.startsWith("/works/")).length, "Static articles ItemList must include the current numberOfItems.");
    const jsonLdText = JSON.stringify(jsonLd);
    expect(jsonLdText.includes('"@type":"CreativeWork"'), "Static JSON-LD works ListItems must include CreativeWork item objects.");
    expect(jsonLdText.includes('"@type":"Article"'), "Static JSON-LD article ListItems must include Article item objects.");
    expect(jsonLdText.includes("拖拽 TF、RNA 聚合酶和核糖体"), "Static JSON-LD must include work descriptions.");
    expect(jsonLdText.includes("AI 可以参与课程开发"), "Static JSON-LD must include article descriptions.");
    expect(jsonLdText.includes('"teaches"'), "Static JSON-LD work items must include teaches learning outcomes.");
    expect(jsonLdText.includes("观察转录翻译"), "Static JSON-LD work items must include learning path steps.");
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
