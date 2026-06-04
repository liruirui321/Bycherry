import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { getContentRoutes } from "./content-routes.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const siteUrl = "https://bycherry.me";
const siteDescription = "By Cherry 是一个可爱插画风的个人网站，收录科学教育、AI 学习工具、项目制课程和创作工作流。";
const shareImageAlt = "By Cherry 科学、课程与 AI 主题作品集预览图";
const worksListDescription = "科学教育、AI 工具和课程设计主题作品。";
const articlesListDescription = "课程开发、科学传播、AI 创作和科研转译记录。";

function itemList(id, name, description, routes) {
  return {
    "@type": "ItemList",
    "@id": `${siteUrl}/#${id}`,
    name,
    description,
    numberOfItems: routes.length,
    itemListElement: routes.map((route, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}${route.path}`,
      name: route.title,
    })),
  };
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function replaceRequired(source, pattern, replacement, label) {
  if (!pattern.test(source)) {
    throw new Error(`Cannot generate static index fallback: missing ${label}.`);
  }
  return source.replace(pattern, replacement);
}

function buildJsonLd(routes) {
  const works = routes.filter((route) => route.type === "work");
  const articles = routes.filter((route) => route.type !== "work");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Cherry",
        url: `${siteUrl}/`,
        sameAs: ["https://github.com/liruirui321"],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: "By Cherry",
        alternateName: "Bycherry",
        description: siteDescription,
        inLanguage: "zh-CN",
        image: `${siteUrl}/social-preview.png`,
        publisher: { "@id": `${siteUrl}/#person` },
      },
      itemList("works", "By Cherry 主题作品", worksListDescription, works),
      itemList("articles", "By Cherry 笔记与科研随笔", articlesListDescription, articles),
    ],
  };
}

function listItems(routes) {
  return routes.map((route) => `            <li><a href="${escapeHtml(route.path)}">${escapeHtml(route.title)}</a></li>`).join("\n");
}

function buildNoscript(routes) {
  const works = routes.filter((route) => route.type === "work");
  const articles = routes.filter((route) => route.type !== "work");

  return [
    "      <noscript>",
    "        <main style=\"font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 760px; margin: 0 auto; padding: 2rem 1.25rem; color: #5e442a; line-height: 1.7;\">",
    "          <h1 style=\"font-size: 2rem; line-height: 1.2; margin: 0 0 0.75rem;\">By Cherry</h1>",
    "          <p>这是一个收录科学教育、AI 学习工具、项目制课程和创作工作流的个人网站。当前浏览器没有启用 JavaScript，下面保留了主题作品、笔记和科研随笔目录。</p>",
    "          <h2 style=\"font-size: 1.2rem; margin-top: 1.5rem;\">主题作品</h2>",
    "          <ul>",
    listItems(works),
    "          </ul>",
    "          <h2 style=\"font-size: 1.2rem; margin-top: 1.5rem;\">笔记与科研随笔</h2>",
    "          <ul>",
    listItems(articles),
    "          </ul>",
    "        </main>",
    "      </noscript>",
  ].join("\n");
}

function indentedJson(data) {
  return JSON.stringify(data, null, 2)
    .split("\n")
    .map((line) => `        ${line}`)
    .join("\n");
}

const routes = getContentRoutes();
let html = readFileSync(resolve(root, "index.html"), "utf8");
html = replaceRequired(
  html,
  /      <script type="application\/ld\+json" data-schema="bycherry-page">[\s\S]*?      <\/script>/,
  `      <script type="application/ld+json" data-schema="bycherry-page">\n${indentedJson(buildJsonLd(routes))}\n      </script>`,
  "JSON-LD script block"
);
html = replaceRequired(
  html,
  /      <meta property="og:image:alt" content="[^"]*" \/>/,
  `      <meta property="og:image:alt" content="${escapeHtml(shareImageAlt)}" />`,
  "OG image alt text"
);
html = replaceRequired(
  html,
  /      <meta name="twitter:image:alt" content="[^"]*" \/>/,
  `      <meta name="twitter:image:alt" content="${escapeHtml(shareImageAlt)}" />`,
  "Twitter image alt text"
);
html = replaceRequired(html, /      <noscript>[\s\S]*?      <\/noscript>/, buildNoscript(routes), "noscript block");

writeFileSync(resolve(root, "index.html"), html);
console.log(`Static index fallback generated: ${routes.length} content routes.`);
