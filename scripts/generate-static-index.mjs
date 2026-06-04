import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { getContentRoutes } from "./content-routes.mjs";
import { articlesListDescription, homeTitle, shareDescription, shareImageAlt, siteDescription, siteTitle, siteUrl, worksListDescription } from "./site-metadata.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

function listItemObject(route) {
  if (route.type === "work") {
    return {
      "@type": "CreativeWork",
      name: route.title,
      description: route.description,
      url: `${siteUrl}${route.path}`,
      genre: route.category,
      keywords: route.tags.join(", "),
      learningResourceType: route.category,
      teaches: [route.task, route.starter, ...route.pathSteps, ...route.outputs].filter(Boolean),
      dateModified: route.lastmod,
      creator: { "@id": `${siteUrl}/#person` },
    };
  }

  return {
    "@type": "Article",
    headline: route.title,
    description: route.description,
    url: `${siteUrl}${route.path}`,
    datePublished: route.lastmod,
    articleSection: route.type === "research" ? "科研证据" : "学习方法",
    author: { "@id": `${siteUrl}/#person` },
  };
}

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
      item: listItemObject(route),
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
      itemList("works", "By Cherry 学习模块", worksListDescription, works),
      itemList("articles", "By Cherry 学习资料库", articlesListDescription, articles),
    ],
  };
}

function listItems(routes) {
  return routes.map((route) => {
    const pathSteps = route.pathSteps?.length
      ? `              <div style="font-size: 0.92rem; margin-top: 0.2rem;">学习路径：${route.pathSteps.map(escapeHtml).join(" → ")}</div>`
      : "";
    const task = route.task
      ? `              <div style="font-size: 0.92rem; margin-top: 0.2rem;">立即任务：${escapeHtml(route.task)}</div>`
      : "";
    const starter = route.starter
      ? `              <div style="font-size: 0.92rem; margin-top: 0.2rem;">先做这个：${escapeHtml(route.starter)}</div>`
      : "";

    return [
      `            <li style="margin-bottom: 0.9rem;">`,
      `              <a href="${escapeHtml(route.path)}">${escapeHtml(route.title)}</a>`,
      `              <p style="margin: 0.2rem 0 0; color: #73583b;">${escapeHtml(route.description)}</p>`,
      task,
      starter,
      pathSteps,
      "            </li>",
    ].filter(Boolean).join("\n");
  }).join("\n");
}

function buildNoscript(routes) {
  const works = routes.filter((route) => route.type === "work");
  const articles = routes.filter((route) => route.type !== "work");

  return [
    "      <noscript>",
    "        <main style=\"font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 760px; margin: 0 auto; padding: 2rem 1.25rem; color: #5e442a; line-height: 1.7;\">",
    "          <h1 style=\"font-size: 2rem; line-height: 1.2; margin: 0 0 0.75rem;\">By Cherry</h1>",
    `          <p>${escapeHtml(siteDescription)}当前浏览器没有启用 JavaScript，下面保留了学习模块、方法库和证据库目录。</p>`,
    "          <h2 style=\"font-size: 1.2rem; margin-top: 1.5rem;\">学习模块</h2>",
    "          <ul>",
    listItems(works),
    "          </ul>",
    "          <h2 style=\"font-size: 1.2rem; margin-top: 1.5rem;\">学习资料库</h2>",
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
const fullHomeTitle = `${siteTitle} | ${homeTitle}`;
let html = readFileSync(resolve(root, "index.html"), "utf8");
html = replaceRequired(
  html,
  /      <title>[^<]*<\/title>/,
  `      <title>${escapeHtml(fullHomeTitle)}</title>`,
  "document title"
);
html = replaceRequired(
  html,
  /      <meta name="description" content="[^"]*" \/>/,
  `      <meta name="description" content="${escapeHtml(siteDescription)}" />`,
  "meta description"
);
html = replaceRequired(
  html,
  /      <meta property="og:title" content="[^"]*" \/>/,
  `      <meta property="og:title" content="${escapeHtml(fullHomeTitle)}" />`,
  "OG title"
);
html = replaceRequired(
  html,
  /      <meta property="og:description" content="[^"]*" \/>/,
  `      <meta property="og:description" content="${escapeHtml(shareDescription)}" />`,
  "OG description"
);
html = replaceRequired(
  html,
  /      <meta name="twitter:title" content="[^"]*" \/>/,
  `      <meta name="twitter:title" content="${escapeHtml(fullHomeTitle)}" />`,
  "Twitter title"
);
html = replaceRequired(
  html,
  /      <meta name="twitter:description" content="[^"]*" \/>/,
  `      <meta name="twitter:description" content="${escapeHtml(shareDescription)}" />`,
  "Twitter description"
);
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
