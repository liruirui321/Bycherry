import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getContentRoutes } from "./content-routes.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

function collectSourceFiles(relativeDirectory) {
  const absoluteDirectory = resolve(root, relativeDirectory);
  return readdirSync(absoluteDirectory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = `${relativeDirectory}/${entry.name}`;
    if (entry.isDirectory()) return collectSourceFiles(relativePath);
    if (!/\.(ts|tsx)$/.test(entry.name)) return [];
    return [relativePath];
  });
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

    for (const fieldName of ["slug", "href", "date", "title", summaryField, readingTimeField, labelField, "actionSteps", "checklist", "starterTemplate", "pitfalls"]) {
      expect(hasField(block, fieldName), `${label} is missing ${fieldName}.`);
    }

    expect(countStringItemsInArray(block, "paragraphs") >= 6, `${label} needs at least 6 paragraph entries for the detail page.`);
    expect(countStringItemsInArray(block, "highlights") >= 3, `${label} needs at least 3 highlight entries for the detail page.`);
    expect(countStringItemsInArray(block, "actionSteps") >= 5, `${label} needs at least 5 action steps for hands-on use.`);
    expect(countStringItemsInArray(block, "checklist") >= 4, `${label} needs at least 4 checklist items.`);
    expect(countStringItemsInArray(block, "starterTemplate") >= 5, `${label} needs at least 5 starter template lines.`);
    expect(countStringItemsInArray(block, "pitfalls") >= 4, `${label} needs at least 4 pitfall reminders.`);
  }
}

function verifyWorkBlocks() {
  const relativePath = "src/app/components/Works.tsx";
  const arraySource = extractExportedArray(read(relativePath), relativePath);
  const blocks = extractBlocks(arraySource);

  expect(blocks.length > 0, `${relativePath} must include at least one theme work item.`);

  for (const [index, block] of blocks.entries()) {
    const slug = getField(block, "slug") ?? `item ${index + 1}`;
    const label = `${relativePath} ${slug}`;

    for (const fieldName of ["id", "slug", "category", "title", "desc", "task", "starter", "success", "href", "updated", "tags", "outputs", "path", "action"]) {
      expect(hasField(block, fieldName), `${label} is missing ${fieldName}.`);
    }

    expect((getField(block, "task") ?? "").length >= 24, `${label} needs a concrete immediate task for direct learner use.`);
    expect((getField(block, "starter") ?? "").length >= 24, `${label} needs a first-action starter for direct learner use.`);
    expect((getField(block, "success") ?? "").length >= 30, `${label} needs a concrete completion standard for direct learner use.`);
    expect(countStringItemsInArray(block, "tags") >= 3, `${label} needs at least 3 tags for scanning and filtering context.`);
    expect(countStringItemsInArray(block, "outputs") >= 3, `${label} needs at least 3 visible outputs.`);
    expect(countStringItemsInArray(block, "path") === 3, `${label} needs exactly 3 learning path steps for homepage and work card entry clarity.`);
  }
}

function verifyVisibleLearningModuleCopy() {
  const visibleShellSources = [
    "src/app/App.tsx",
    "src/app/components/Footer.tsx",
    "src/app/components/Hero.tsx",
    "src/app/components/Nav.tsx",
    "src/app/components/WorkDetailPage.tsx",
    "src/app/components/Works.tsx",
  ].map((relativePath) => [relativePath, read(relativePath)]);

  const requiredCopy = [
    "工具与项目",
    "内容目录",
  ];

  const retiredCopyPatterns = [
    { label: "portfolio-like theme work copy", pattern: /主题作品/ },
    { label: "打开作品", pattern: />\s*打开作品\s*</ },
    { label: "查看作品", pattern: />\s*查看作品\s*</ },
    { label: "浏览作品", pattern: /浏览作品/ },
    { label: "全部作品", pattern: /全部作品/ },
    { label: "上一个作品", pattern: /label:\s*"上一个作品"/ },
    { label: "下一个作品", pattern: /label:\s*"下一个作品"/ },
    { label: "作品前后导航", pattern: /aria-label="作品前后导航"/ },
    { label: "按作品类型筛选", pattern: /aria-label="按作品类型筛选"/ },
    { label: "没有找到这个作品", pattern: /title="没有找到这个作品"/ },
    { label: "这个作品地址可能已经移动", pattern: /body="这个作品地址可能已经移动/ },
    { label: "科学、课程和 AI 作品", pattern: /科学、课程和 AI 作品\s*·/ },
  ];

  const combinedSource = visibleShellSources.map(([relativePath, source]) => `\n/* ${relativePath} */\n${source}`).join("\n");

  for (const text of requiredCopy) {
    expect(combinedSource.includes(text), `Visible shell copy should include: ${text}`);
  }

  for (const [relativePath, source] of visibleShellSources) {
    for (const item of retiredCopyPatterns) {
      expect(!item.pattern.test(source), `${relativePath} still contains retired visible copy: ${item.label}`);
    }
  }
}

function verifyNoLowQualityVisibleContent() {
  const sourceFiles = collectSourceFiles("src/app");
  const retiredContentPatterns = [
    { label: "demo", pattern: /\bdemo\b/i },
    { label: "TODO", pattern: /\bTODO\b/ },
    { label: "MVP", pattern: /\bMVP\b/ },
    { label: "coming soon", pattern: /coming soon/i },
    { label: "lorem ipsum", pattern: /lorem ipsum/i },
    { label: "示例作品", pattern: /示例作品/ },
    { label: "占位文案", pattern: /占位文案|占位内容|占位页面/ },
    { label: "设计想法", pattern: /设计想法/ },
    { label: "可以带走的想法", pattern: /可以带走的想法/ },
    { label: "为什么做", pattern: /为什么做/ },
    { label: "future API copy", pattern: /真正调用 API 的版本|API 版目标|API 版/ },
    { label: "roadmap framing", pattern: /迭代路线/ },
    { label: "继续打开", pattern: /继续打开/ },
    { label: "自动生成花粉", pattern: /自动生成花粉/ },
    { label: "Caveat hand-written font", pattern: /Caveat/ },
    { label: "手账", pattern: /手账/ },
    { label: "小纸条", pattern: /小纸条/ },
    { label: "small tool navigation copy", pattern: /小工具/ },
    { label: "misleading contact send copy", pattern: /发送信息/ },
    { label: "overly cute copy", pattern: /可爱|绘本|打个招呼|只是想说|Cherry 会怎么叫你/ },
    { label: "cute about illustration face", pattern: /circle cx="21" cy="39"|C30 56 37 56 44 51/ },
    { label: "cute article AI face", pattern: /circle cx="116" cy="76"|C123 89 128 88 132 84/ },
    { label: "cute note card face", pattern: /circle cx="30" cy="35"|C36 49 42 49 47 45/ },
    { label: "cute research card face", pattern: /circle cx="99" cy="43"|C104 57 111 57 116 53/ },
    { label: "note-style contact illustration", pattern: /ContactNote|DeliveredNote|contact-note|Washi|\bwashi\b|\btape\b/i },
  ];

  for (const relativePath of sourceFiles) {
    const source = read(relativePath);
    for (const item of retiredContentPatterns) {
      expect(!item.pattern.test(source), `${relativePath} contains low-quality or retired visible content: ${item.label}`);
    }
  }
}

function verifyWorkCardActions() {
  const worksSource = read("src/app/components/Works.tsx");
  const heroSource = read("src/app/components/Hero.tsx");
  const appSource = read("src/app/App.tsx");
  const copyActionMatches = Array.from(worksSource.matchAll(/\baction:\s*"复制[^"]*"/g), (match) => match[0]);

  expect(copyActionMatches.length === 0, `Work card entry actions should open or start the tool, not imply direct copy behavior: ${copyActionMatches.join(", ")}`);
  expect(worksSource.includes('title: "科研学习工作台"'), "Research AI work card should be titled 科研学习工作台 for learner-facing clarity.");
  expect(worksSource.includes('tags: ["AI", "科研阅读", "证据核查"]') && worksSource.includes('outputs: ["研究记录", "引用核查", "复核报告"]'), "Research AI work card must describe learner-facing research reading outputs.");
  expect(!worksSource.includes('title: "科研 Agent 工作台"') && !worksSource.includes("可复制 API JSON"), "Research AI work card must not lead with agent/API wording.");
  expect(!worksSource.includes("科研助手 Prompt Kit"), "Visible work card title must not use the old Prompt Kit naming.");
  expect(heroSource.includes('id="works"') && heroSource.includes('aria-label="内容目录"'), "Hero must own the #works anchor and all-module directory.");
  expect(heroSource.includes("hero-entry-card") && !heroSource.includes("hero-work-open") && !heroSource.includes("hero-entry-action"), "Hero module entries must stay as compact clickable entries without repeated open pills.");
  expect(heroSource.includes('gridTemplateColumns: "minmax(390px, 0.38fr) minmax(760px, 0.62fr)"') && heroSource.includes("hero-featured-panel") && heroSource.includes("精选内容") && heroSource.includes("hero-entry-grid"), "Hero must keep the original-studio first-screen layout while exposing a compact directly visible content directory.");
  expect(heroSource.includes('gridTemplateColumns: "repeat(3, minmax(0, 1fr))"') && heroSource.includes('gridColumn: index === 0 ? "span 2" : undefined') && !heroSource.includes('gridRow: index === 0 ? "span 2" : undefined') && heroSource.includes("个内容"), "Homepage work directory must use a denser three-column index instead of leaving the first screen visually empty.");
  expect(!heroSource.includes("hero-layout") && !heroSource.includes("hero-quick-index") && !heroSource.includes("hero-flow-board"), "Hero must not reintroduce repeated side indexes or bottom structure strips.");
  expect(heroSource.includes("A tiny studio for") && heroSource.includes("hero-wash") && heroSource.includes("hero-stem") && heroSource.includes("hero-float-deco"), "Hero must keep the original studio atmosphere while avoiding a large empty slogan-only first screen.");
  expect(heroSource.includes('className="hero-title-break"') && heroSource.includes('className="hero-title-mobile-break"') && heroSource.includes("font-size: 1.56rem !important"), "Homepage hero title must have explicit mobile-safe breaks and small-screen font size.");
  expect(heroSource.includes('className="hero-subtitle"') && heroSource.includes("overflowWrap: \"anywhere\"") && heroSource.includes(".hero-subtitle") && heroSource.includes("word-break: break-word !important"), "Homepage mobile subtitle must wrap instead of clipping at the right edge.");
  expect(heroSource.includes(".hero-inner,") && heroSource.includes(".hero-featured-panel,") && heroSource.includes(".hero-entry-grid") && !heroSource.includes(".hero-summary-panel,") && heroSource.includes("max-width: 100% !important"), "Homepage mobile layout must keep content inside the viewport instead of clipping at the right edge.");
  expect(heroSource.includes("grid-template-columns: 2.1rem minmax(0, 1fr) !important") && heroSource.includes("width: calc(100% - 0.7rem) !important") && heroSource.includes("max-width: 100% !important") && heroSource.includes("justify-self: start !important") && heroSource.includes("gap: 0.5rem !important") && heroSource.includes("overflow: hidden !important") && heroSource.includes(".hero-entry-desc") && heroSource.includes("-webkit-line-clamp: 2 !important") && heroSource.includes("overflow-wrap: anywhere !important"), "Homepage mobile rows must keep compact module titles and wrapped context without right-edge overflow.");
  expect(heroSource.includes('className="hero-entry-grid-note"') && heroSource.includes(".hero-entry-grid-note") && heroSource.includes("display: none !important"), "Homepage mobile layout must hide the optional grid note that can clip on narrow screens.");
  expect(heroSource.includes("hero-entry-desc") && heroSource.includes("-webkit-line-clamp: 2") && heroSource.includes(".hero-entry-desc") && heroSource.includes("white-space: normal !important"), "Hero directory cards must show compact descriptions on desktop and short context on narrow mobile rows.");
  expect(heroSource.includes("heroMobileDescriptions") && heroSource.includes("hero-entry-desc-full") && heroSource.includes("hero-entry-desc-short") && heroSource.includes("调节分子，观察 mRNA 和多肽链变化。") && heroSource.includes(".hero-entry-desc-full") && heroSource.includes("display: none !important") && heroSource.includes(".hero-entry-desc-short") && heroSource.includes("display: inline !important"), "Homepage mobile cards must use short learner-facing descriptions instead of clipping desktop copy.");
  expect(heroSource.includes('minHeight: "calc(100svh - 50px)"') && heroSource.includes('alignItems: "start"') && heroSource.includes('alignContent: "start"') && heroSource.includes('padding: "clamp(1.2rem, 2.8vh, 2rem)') && heroSource.includes('margin: "0 auto"') && heroSource.includes('gridTemplateColumns: "minmax(390px, 0.38fr) minmax(760px, 0.62fr)"') && heroSource.includes("maxWidth: 1440") && !heroSource.includes('height: "calc(100vh - 116px)"') && !heroSource.includes('margin: "clamp(-4.2rem') && !heroSource.includes('transform: "translateY('), "Homepage hero must return to the original studio feel while starting near the top of the first viewport.");
  expect(heroSource.includes('className="hero-entry-grid"') && heroSource.includes('gridTemplateColumns: "repeat(3, minmax(0, 1fr))"') && heroSource.includes('gap: "0.72rem"'), "Homepage module entries must render as a compact first-screen grid, not repeated sections.");
  expect(heroSource.includes("borderLeft: `0.5rem solid ${entry.border}`") && heroSource.includes("minHeight: 176") && heroSource.includes("linear-gradient(135deg, ${entry.color}") && heroSource.includes(".hero-entry-card::after") && !heroSource.includes("minHeight: 260"), "Homepage module entries must keep science-card density without returning to overly long sticky-note panels.");
  expect(heroSource.includes("hero-workbench-visual") && heroSource.includes("hero-primary-link") && heroSource.includes("浏览内容") && !heroSource.includes("hero-studio-index"), "Homepage left side must fill the first screen with original-style CTAs and a visual workbench instead of repeated category rows.");
  expect(heroSource.includes("width: 10.2rem") && heroSource.includes("height: 3.6rem") && heroSource.includes(".hero-entry-card:first-child {") && heroSource.includes("grid-template-rows: auto auto auto !important") && heroSource.includes("hero-entry-focus-line") && heroSource.includes("固定序列 ATG GAA TTT CCG") && heroSource.includes(".hero-entry-card:first-child .hero-mini-visual") && heroSource.includes("height: 4.55rem") && heroSource.includes(".hero-entry-card:first-child .hero-mini-visual-gene .hero-mini-chain i") && heroSource.includes("width: 0.62rem"), "Homepage mini science visuals must be compact illustrated cues instead of oversized blank areas.");
  expect(!heroSource.includes('gridRow: entry.featuredImage ? "span 2" : undefined') && !heroSource.includes("featuredImage") && heroSource.includes("hero-entry-side"), "Homepage plant evolution entry must stay a compact directory card instead of a two-row illustration card.");
  expect(!heroSource.includes('aria-label="内容类型"') && !heroSource.includes("hero-start-strip") && !heroSource.includes("先选一个卡住的问题") && !heroSource.includes("点卡片直接开始") && !heroSource.includes("hero-scope-strip") && !heroSource.includes("hero-scope-item"), "Homepage should not use repeated usage indexes or instruction strips.");
  expect(!heroSource.includes("hero-method-board") && !heroSource.includes("hero-specimen-band"), "Homepage must not reintroduce lower duplicate method panels or specimen panels in the first screen.");
  expect(!heroSource.includes("hero-count") && !heroSource.includes("homeWorkStatus") && !heroSource.includes("hero-work-status") && !heroSource.includes("个内容入口") && !heroSource.includes("个可直接打开的入口") && !heroSource.includes("首页就是目录"), "Homepage first-screen directory must not add duplicate count or status labels.");
  expect(!heroSource.includes("entry.updated") && !heroSource.includes("updated: work.updated"), "Homepage first-screen cards must not show date metadata that makes the directory feel like an article list.");
  expect(!heroSource.includes("entry.action") && !heroSource.includes("action: work.action"), "Homepage cards must not repeat action pills inside already-clickable directory entries.");
  expect(heroSource.includes("hero-entry-path") && heroSource.includes("entry.path.map") && heroSource.includes("hero-entry-output-list") && heroSource.includes("entry.outputs.slice(0, 3)") && !heroSource.includes("hero-entry-task") && !heroSource.includes("task: work.task"), "Homepage cards must preserve useful learning-path and output density without restoring long task blocks.");
  expect(!heroSource.includes('import { notes } from "./Notes"') && !heroSource.includes('import { essays } from "./ResearchEssays"'), "Homepage first screen must not import article data just to create another entry group.");
  expect(!heroSource.includes("hero-reading-library") && !heroSource.includes("阅读库 ·") && heroSource.includes('const readingHref = "/reading"') && heroSource.includes("读读笔记"), "Homepage may include one compact reading CTA, but not a separate repeated reading block.");
  expect(!heroSource.includes("hero-article-row") && !heroSource.includes("articleLinks.map((article)") && !heroSource.includes("const firstArticle = articleLinks[0]"), "Homepage must not expand article entries or jump to the first article.");
  expect(!heroSource.includes('role="group" aria-label="文章"'), "Homepage must not render all article links as a second always-visible entrance row.");
  expect(!heroSource.includes("{article.excerpt}") && !heroSource.includes("{article.body}") && !heroSource.includes("{article.readTime}") && !heroSource.includes("{article.date}"), "Homepage article entries must not expand into repeated article cards.");
  expect(!appSource.includes("<Works") && !appSource.includes('import { Works }'), "Homepage should not render a second Works section below the hero.");
  expect(appSource.includes('className="route-loading-shell"') && appSource.includes('className="route-loading-grid"') && appSource.includes("正在载入内容") && appSource.includes("正在准备工具界面、学习记录和可复制输出。") && !appSource.includes('placeItems: "center", fontFamily: "\'Nunito\', sans-serif" }}>\n      <div role="status"'), "Routed content loading state must render a top-aligned content skeleton instead of a centered empty card.");
  expect(!worksSource.includes("export function Works") && !worksSource.includes("function WorkCard"), "Works.tsx should stay data-only so module entries are not duplicated on the homepage.");
  for (const retiredWorksEntry of ["work-recommended-start", "work-filter-button", "activeCategory", "recommendedWork"]) {
    expect(!worksSource.includes(retiredWorksEntry), `Works section should not repeat first-screen entries or filters: ${retiredWorksEntry}.`);
  }
  expect(!worksSource.includes("work-card-first-step") && !worksSource.includes("work-card-output-strip"), "Works data module should not include retired homepage card rendering.");
  expect(!worksSource.includes("work-scan-strip"), "Works data module should not repeat a second compact scan strip below the first-screen directory.");
  expect(!worksSource.includes("moduleChecklistText") && !worksSource.includes("学习模块清单"), "Works section should not add a homepage-level copy checklist.");
  expect(!worksSource.includes("learningPathBundles") && !worksSource.includes("配套阅读路径"), "Works section should not repeat paired reading paths on the homepage.");
}

function verifyWorkDetailCardsStayCompact() {
  const source = read("src/app/components/WorkDetailPage.tsx");
  const geneSource = read("src/app/components/GeneExpressionTool.tsx");

  expect(!source.includes("isPlantEvolution"), "Work detail cards must not use plant-specific tall preview sizing.");
  expect(!source.includes("<WorkSequenceLinks work={work} />"), "Work detail pages should not render repeated previous/next module entries below the product.");
  expect(!source.includes('gridTemplateColumns: "112px minmax(0, 1fr)"') && !source.includes("height: 88"), "Work detail pages must not reintroduce related-module preview cards.");
  expect(source.includes('id="work-primary-tool"') && source.includes('boxSizing: "border-box"') && source.includes('width: "100%"') && source.includes('overflowX: "hidden"'), "Work detail primary tool wrapper must not overflow mobile viewports when section padding is applied.");
  for (const className of ["concept-support-pack-details", "crispr-support-pack-details"]) {
    const supportPackPattern = new RegExp(`className="${className}[\\s\\S]{0,220}background: "transparent"[\\s\\S]{0,120}border: "none"[\\s\\S]{0,120}boxShadow: "none"`);
    expect(supportPackPattern.test(source), `${className} must stay as a lightweight folded row instead of a framed card.`);
  }
  expect(source.includes('className="plant-support-pack-panel"') && source.includes('id="plant-support-pack-title"') && source.includes('<details open className="plant-compact-details plant-stage-comparison-details"') && source.includes('<details open className="plant-compact-details plant-evidence-audit-details"'), "Plant evolution records and evidence tools must be directly visible instead of hidden behind a wrapper fold.");
  expect(geneSource.includes('className="gene-support-pack-panel"') && geneSource.includes('id="gene-support-pack-title"') && geneSource.includes("<details open className=\"gene-compact-details gene-process-focus-details\""), "Gene expression practice and record tools must be directly visible, with process tracking open by default.");
  expect(geneSource.includes('className="gene-peptide-readout-strip"') && geneSource.includes("当前多肽链") && geneSource.includes("peptidePreviewCount"), "Gene expression readout must expose a visible bead-chain polypeptide strip.");
  for (const retiredSupportPackCopy of ["说明、可视化与导出 · 7 项", "说明、练习、记录与报告 · 10 项", "记录、复盘与文献 · 6 项", "练习、记录与状态 · 9 项"]) {
    expect(!source.includes(retiredSupportPackCopy) && !geneSource.includes(retiredSupportPackCopy), `Support pack summaries should not expose item-count chrome: ${retiredSupportPackCopy}.`);
  }
  expect(source.includes("conceptInputQuality"), "Concept explainer must judge whether learner inputs are complete enough.");
  expect(source.includes("concept-agent-input-grid"), "Concept explainer context inputs must be visible in the initial agent panel.");
  expect(source.includes("资料边界") && source.includes("当前卡点"), "Concept explainer must collect source boundary and current confusion.");
  expect(source.includes("复制自查记录"), "Concept explainer must expose a copyable understanding audit.");
  expect(source.includes("conceptInputQualityScore"), "Concept explainer must surface input quality before generating outputs.");
  expect(source.includes("taskRouteRecipes"), "Research agent workbench must expose task route recipes.");
  expect(source.includes("待填写材料") && !source.includes("未填写材料"), "Research agent copied records must use learner-facing input-state wording for empty material.");
  expect(source.includes("research-agent-route-recipes"), "Research agent task route recipes must be visible near the top of the workbench.");
  expect(source.includes("任务路由速查"), "Research agent workbench must show a quick route lookup panel.");
  for (const routeName of ["文献精读", "图表解读", "实验设计检查", "论文逻辑检查", "审稿意见回应", "术语一致性检查"]) {
    expect(source.includes(routeName), `Research agent route recipes must include ${routeName}.`);
  }
  expect(source.includes("timelineReviewOutput"), "Plant evolution module must provide a copyable full timeline review output.");
  expect(source.includes("copyTimelineReview"), "Plant evolution module must expose a full timeline review copy action.");
  expect(source.includes("全线复盘包"), "Plant evolution module must visibly expose a full timeline review pack.");
  expect(source.includes("复制全线复盘"), "Plant evolution module must expose a visible full timeline review copy button.");
  expect(source.includes("plant-timeline-review-grid"), "Plant evolution full timeline review must have a stable responsive grid.");
  expect(source.includes("plant-timeline-review-row"), "Plant evolution full timeline review must use compact stage rows.");
  expect(source.includes("plant-timeline-check-strip"), "Plant evolution full timeline review checks must stay as a compact strip.");
  expect(!source.includes('className="plant-timeline-review-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))"'), "Plant evolution full timeline review must not return to tall two-column cards.");
  expect(source.includes("chapters.map((chapter, index)") && source.includes("plantStageLabels[index]"), "Plant evolution full timeline review must summarize all stages.");
  expect(source.includes("timelineReviewChecks"), "Plant evolution full timeline review must include completion checks.");
}

function verifyArticleCardsStayStructured() {
  const files = [
    "src/app/components/ArticleDetailPage.tsx",
    "src/app/components/EmptyStateCard.tsx",
  ];

  for (const relativePath of files) {
    const source = read(relativePath);
    expect(!source.includes("border: 1.5px dashed"), `${relativePath} must not use dashed illustration frames.`);
    expect(!source.includes("transform: rotate("), `${relativePath} must not use rotated tape or stamp styling.`);
  }

  const appSource = read("src/app/App.tsx");

  expect(!appSource.includes("<HomeLibrary />") && !appSource.includes('import { HomeLibrary }'), "Homepage must not render a second article index below the first-screen module directory.");
  expect(!appSource.includes("<ResearchEssays />") && !appSource.includes("<Notes />"), "Homepage should not render separate long Research and Notes sections.");
  expect(!existsSync(resolve(root, "src/app/components/HomeLibrary.tsx")), "Retired HomeLibrary component must stay removed so the homepage cannot regain a repeated article index.");
}

function verifyPlatformGuideConfigBuilder() {
  const articleSource = read("src/app/components/ArticleDetailPage.tsx");
  const researchSource = read("src/app/components/ResearchEssays.tsx");

  expect(researchSource.includes('platformUrl: "https://scifusion.top"'), "SciFusion guide must keep the direct platform link.");
  expect(articleSource.includes("platformCustomConfigItems"), "Platform guide must build learner-specific paste fields.");
  expect(articleSource.includes("platformLearnerLevel"), "Platform guide must collect learner level before copying a config.");
  expect(articleSource.includes("platformKnowledgeRange"), "Platform guide must collect the knowledge range before copying a config.");
  expect(articleSource.includes("platformLearningGoal"), "Platform guide must collect an observable learning goal before copying a config.");
  expect(articleSource.includes("platformQuestionCount") && articleSource.includes("platformTimeBudget"), "Platform guide must collect question count and time budget.");
  expect(articleSource.includes("platformTopicTemplates"), "Platform guide must provide one-click topic fill packages.");
  expect(articleSource.includes("applyPlatformTopicTemplate"), "Platform guide must let learners load a topic package into the platform config.");
  expect(articleSource.includes("常用主题照填包"), "Platform guide must visibly expose reusable topic packages.");
  expect(articleSource.includes(">平台使用面板</summary>") && !articleSource.includes("照填配置与审核面板 ·") && articleSource.includes("当前方案：{activePlatformPlan.title}"), "Platform guide details summary must stay short while keeping the active plan inside expanded content.");
  expect(articleSource.includes('gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))"') && articleSource.includes('aria-label={`${plan.title}：${plan.fields.join("；")}；${plan.output}`}') && /className="platform-plan-button"[\s\S]{0,520}padding: "0\.48rem 0\.56rem"[\s\S]{0,180}gridTemplateColumns: "minmax\(0, 1fr\) auto"/.test(articleSource), "Platform use plan buttons must stay as short selectors instead of repeating the full fill-in configuration in each button.");
  expect(articleSource.includes("platformAuditFocus"), "Platform guide must collect the learner's question-audit focus.");
  expect(articleSource.includes("审核重点：${platformAuditFocus"), "Platform copied configs must include the audit focus.");
  expect(articleSource.includes("我的照填配置"), "Platform guide must visibly expose the learner's custom config builder.");
  expect(articleSource.includes("即将复制到平台的字段"), "Platform guide must preview the exact fields that will be copied to the platform.");
  expect(articleSource.includes("测后复盘表"), "Platform guide must keep a copyable post-assessment review table.");
}

function verifyPlantGenomeEvidenceChainBuilder() {
  const articleSource = read("src/app/components/ArticleDetailPage.tsx");

  expect(articleSource.includes("evidenceChainBuilderEnabled"), "Plant genome evidence article must expose a special evidence-chain builder.");
  expect(articleSource.includes('article?.slug === "plant-genome-evidence-chain"'), "Evidence-chain builder must target the plant genome evidence article.");
  expect(articleSource.includes("evidenceChainFields"), "Evidence-chain builder must define learner-fillable fields.");
  expect(articleSource.includes("evidenceChainCardText"), "Evidence-chain builder must produce a copyable evidence card.");
  expect(articleSource.includes("copyEvidenceChainCard"), "Evidence-chain builder must expose a copy handler.");
  expect(articleSource.includes("证据四格卡"), "Evidence-chain builder must visibly name the four-cell evidence card.");
  expect(articleSource.includes("现象") && articleSource.includes("证据") && articleSource.includes("解释") && articleSource.includes("限制"), "Evidence-chain builder must keep phenomenon, evidence, interpretation, and limit fields.");
  expect(articleSource.includes("避免把相关线索写成因果结论"), "Evidence-chain builder must explicitly preserve correlation/causation boundaries.");
  expect(articleSource.includes("plant-evidence-chain-builder") && articleSource.includes("plant-evidence-chain-grid"), "Evidence-chain builder must have stable classes for layout checks.");
}

function verifyGenomeAssemblyStoryFrameBuilder() {
  const articleSource = read("src/app/components/ArticleDetailPage.tsx");

  expect(articleSource.includes("genomeStoryBuilderEnabled"), "Genome assembly article must expose a special story-frame builder.");
  expect(articleSource.includes('article?.slug === "genome-assembly-story"'), "Story-frame builder must target the genome assembly article.");
  expect(articleSource.includes("genomeStoryFields"), "Story-frame builder must define learner-fillable fields.");
  expect(articleSource.includes("genomeStoryFrameText"), "Story-frame builder must produce a copyable story frame.");
  expect(articleSource.includes("copyGenomeStoryFrame"), "Story-frame builder must expose a copy handler.");
  expect(articleSource.includes("科学故事骨架"), "Story-frame builder must visibly name the story frame.");
  expect(articleSource.includes("研究对象") && articleSource.includes("主问题") && articleSource.includes("结构证据") && articleSource.includes("功能证据") && articleSource.includes("比较证据") && articleSource.includes("连接句"), "Story-frame builder must keep object, question, structure, function, comparison, and connection fields.");
  expect(articleSource.includes("避免把流程步骤当成故事主线"), "Story-frame builder must keep the article's main caution visible.");
  expect(articleSource.includes("genome-story-frame-builder") && articleSource.includes("genome-story-frame-grid"), "Story-frame builder must have stable classes for layout checks.");
}

function verifyBarcodingEvidenceTableBuilder() {
  const articleSource = read("src/app/components/ArticleDetailPage.tsx");

  expect(articleSource.includes("barcodeEvidenceBuilderEnabled"), "Barcoding evidence article must expose a special evidence table builder.");
  expect(articleSource.includes('article?.slug === "barcoding-evidence-chain"'), "Barcoding evidence builder must target the Barcoding evidence article.");
  expect(articleSource.includes("barcodeEvidenceFields"), "Barcoding evidence builder must define learner-fillable fields.");
  expect(articleSource.includes("barcodeEvidenceTableText"), "Barcoding evidence builder must produce a copyable evidence table.");
  expect(articleSource.includes("copyBarcodeEvidenceTable"), "Barcoding evidence builder must expose a copy handler.");
  expect(articleSource.includes("鉴定证据链表"), "Barcoding evidence builder must visibly name the identification evidence table.");
  expect(articleSource.includes("样本记录") && articleSource.includes("实验质量") && articleSource.includes("序列质量") && articleSource.includes("BLAST 证据") && articleSource.includes("树图位置") && articleSource.includes("结论边界"), "Barcoding evidence builder must keep sample, lab, sequence, BLAST, tree, and conclusion-boundary fields.");
  expect(articleSource.includes("避免把最高匹配直接当最终答案"), "Barcoding evidence builder must keep the highest-match caution visible.");
  expect(articleSource.includes("barcode-evidence-table-builder") && articleSource.includes("barcode-evidence-table-grid"), "Barcoding evidence builder must have stable classes for layout checks.");
}

function verifyProjectEvidenceTableBuilder() {
  const articleSource = read("src/app/components/ArticleDetailPage.tsx");

  expect(articleSource.includes("projectEvidenceBuilderEnabled"), "Project evidence article must expose a special project evidence table builder.");
  expect(articleSource.includes('article?.slug === "pbl-rubric-evidence"'), "Project evidence builder must target the PBL evidence article.");
  expect(articleSource.includes("projectEvidenceFields"), "Project evidence builder must define learner-fillable fields.");
  expect(articleSource.includes("projectEvidenceTableText"), "Project evidence builder must produce a copyable project evidence table.");
  expect(articleSource.includes("copyProjectEvidenceTable"), "Project evidence builder must expose a copy handler.");
  expect(articleSource.includes("项目证据表"), "Project evidence builder must visibly name the project evidence table.");
  expect(articleSource.includes("驱动问题") && articleSource.includes("最终作品") && articleSource.includes("任务节点") && articleSource.includes("过程证据") && articleSource.includes("评价量规") && articleSource.includes("修订记录"), "Project evidence builder must keep driving-question, final-work, task-node, process-evidence, rubric, and revision fields.");
  expect(articleSource.includes("避免活动很多但作品不能证明理解"), "Project evidence builder must keep the activity-without-evidence caution visible.");
  expect(articleSource.includes("project-evidence-table-builder") && articleSource.includes("project-evidence-table-grid"), "Project evidence builder must have stable classes for layout checks.");
}

function verifyCreationRunRecordBuilder() {
  const articleSource = read("src/app/components/ArticleDetailPage.tsx");

  expect(articleSource.includes("creationRunBuilderEnabled"), "AI creation workflow article must expose a special run record builder.");
  expect(articleSource.includes('article?.slug === "ai-comic-video-workflow"'), "AI creation run record builder must target the creation workflow article.");
  expect(articleSource.includes("creationRunFields"), "AI creation run record builder must define learner-fillable fields.");
  expect(articleSource.includes("creationRunRecordText"), "AI creation run record builder must produce a copyable run record.");
  expect(articleSource.includes("copyCreationRunRecord"), "AI creation run record builder must expose a copy handler.");
  expect(articleSource.includes("AI 创作生成记录表"), "AI creation run record builder must visibly name the run record.");
  expect(articleSource.includes("场景目标") && articleSource.includes("角色锁定") && articleSource.includes("镜头表") && articleSource.includes("资产提示") && articleSource.includes("失败原因") && articleSource.includes("剪辑检查"), "AI creation run record builder must keep scene, character, shot, asset, failure, and edit-check fields.");
  expect(articleSource.includes("避免每次生成都重新试错"), "AI creation run record builder must keep the reusable-process caution visible.");
  expect(articleSource.includes("creation-run-record-builder") && articleSource.includes("creation-run-record-grid"), "AI creation run record builder must have stable classes for layout checks.");
}

function verifyResearchQuestionTranslationBuilder() {
  const articleSource = read("src/app/components/ArticleDetailPage.tsx");

  expect(articleSource.includes("researchQuestionBuilderEnabled"), "Research translation article must expose a special question translation card builder.");
  expect(articleSource.includes('article?.slug === "science-to-learning-question"'), "Research question translation builder must target the science-to-learning-question article.");
  expect(articleSource.includes("researchQuestionFields"), "Research question translation builder must define learner-fillable fields.");
  expect(articleSource.includes("researchQuestionCardText"), "Research question translation builder must produce a copyable translation card.");
  expect(articleSource.includes("copyResearchQuestionCard"), "Research question translation builder must expose a copy handler.");
  expect(articleSource.includes("科研问题转译卡"), "Research question translation builder must visibly name the translation card.");
  expect(articleSource.includes("科研主题") && articleSource.includes("已有经验") && articleSource.includes("可观察问题") && articleSource.includes("证据材料") && articleSource.includes("解释任务") && articleSource.includes("边界/下一步"), "Research question translation builder must keep theme, experience, question, evidence, task, and boundary fields.");
  expect(articleSource.includes("避免只复述前沿术语"), "Research question translation builder must keep the terminology-only caution visible.");
  expect(articleSource.includes("research-question-card-builder") && articleSource.includes("research-question-card-grid"), "Research question translation builder must have stable classes for layout checks.");
}

function verifyAiMaterialAuditTableBuilder() {
  const articleSource = read("src/app/components/ArticleDetailPage.tsx");
  const appSource = read("src/app/App.tsx");
  const notesSource = read("src/app/components/Notes.tsx");

  expect(articleSource.includes("aiMaterialAuditBuilderEnabled"), "AI material audit article must expose a special audit table builder.");
  expect(articleSource.includes('article?.slug === "ai-learning-material-audit"'), "AI material audit table builder must target the AI material audit article.");
  expect(!articleSource.includes('article?.slug === "ai-course-development"'), "AI material audit table builder must not use the retired course-framed slug.");
  expect(notesSource.includes('slug: "ai-learning-material-audit"') && notesSource.includes('href: "/notes/ai-learning-material-audit"'), "AI material audit article must use the learner-facing slug.");
  expect(!notesSource.includes('slug: "ai-course-development"') && !notesSource.includes('href: "/notes/ai-course-development"'), "AI material audit article data must not expose the retired course-framed slug.");
  expect(appSource.includes('"ai-course-development": "ai-learning-material-audit"'), "App router must keep a compatibility rewrite from the retired slug to the learner-facing slug.");
  expect(articleSource.includes("aiMaterialAuditFields"), "AI material audit table builder must define learner-fillable fields.");
  expect(articleSource.includes("aiMaterialAuditTableText"), "AI material audit table builder must produce a copyable audit table.");
  expect(articleSource.includes("copyAiMaterialAuditTable"), "AI material audit table builder must expose a copy handler.");
  expect(articleSource.includes("AI 学习材料质检表"), "AI material audit table builder must visibly name the audit table.");
  expect(articleSource.includes("学习目标") && articleSource.includes("资料边界") && articleSource.includes("常见误解") && articleSource.includes("练习检查") && articleSource.includes("证据边界") && articleSource.includes("复盘动作"), "AI material audit table builder must keep goal, source, misconception, practice, evidence, and revision fields.");
  expect(articleSource.includes("避免把 AI 输出直接当成理解"), "AI material audit table builder must keep the output-is-not-understanding caution visible.");
  expect(articleSource.includes("ai-material-audit-table-builder") && articleSource.includes("ai-material-audit-table-grid"), "AI material audit table builder must have stable classes for layout checks.");
}

function verifyArticleOutcomeSnapshot() {
  const articleSource = read("src/app/components/ArticleDetailPage.tsx");

  expect(articleSource.includes("copyActionPack") && articleSource.includes("copyLearningRecord"), "Article detail pages must still expose action pack and learning record copy actions.");
  expect(articleSource.includes("focusArticleStart"), "Article detail direct start action must focus the primary action or body anchor.");
  expect(articleSource.includes('id="article-primary-action"') && articleSource.includes('id="article-body-points"'), "Article detail pages must expose focusable action and body anchors.");
  expect(articleSource.includes('className="article-first-action-strip"') && articleSource.includes("先做这个") && articleSource.includes(">正文<"), "Article detail pages must show one compact first action before the body, then move directly into article content.");
  expect(!articleSource.includes("const articleReadingSteps") && !articleSource.includes('className="article-reading-steps-strip"') && !articleSource.includes('aria-label="文章阅读步骤"'), "Article detail pages must not reintroduce a separate four-card reading-step strip.");
  expect(articleSource.includes('className="article-detail-card"') && articleSource.includes('background: "transparent"') && articleSource.includes('border: "none"') && articleSource.includes('boxShadow: "none"'), "Article detail page must not wrap the whole article in a long visible card frame.");
  expect(!articleSource.includes("articleOutcomeSnapshot") && !articleSource.includes("readingPath"), "Article detail pages must not keep dead top-task derivations after removing the repeated task strip.");
  expect(!articleSource.includes("article-outcome-snapshot") && !articleSource.includes("article-reading-task-pack"), "Article detail pages must not reintroduce a duplicate top task strip.");
  expect(articleSource.includes('className="article-title-row"') && articleSource.includes('gridTemplateColumns: "26px minmax(0, 1fr)"'), "Article detail header must place the back action and title in one compact row.");
  expect(!articleSource.includes("article-meta-row") && !articleSource.includes("IconCoffee") && !articleSource.includes('约 {"readTime" in article ? article.readTime : article.readMin} 分钟'), "Article detail header must not show a separate category/date/read-time metadata row before content.");
  expect(articleSource.includes("复制学习任务") && articleSource.includes("学习任务已复制到剪贴板。") && !articleSource.includes("阅读摘要") && !articleSource.includes("复制摘要") && !articleSource.includes("日期：${article.date}") && !articleSource.includes("阅读时间：约"), "Article detail copy action must export a learner task rather than passive reading metadata.");
  expect(!articleSource.includes("读完带走") && !articleSource.includes("读完产出"), "Article detail pages must avoid repeated output-summary blocks.");
  expect(!articleSource.includes('className="article-paired-work-panel"') && !articleSource.includes('className="article-paired-work-link"'), "Article detail pages must not repeat paired module entrances inside articles.");
  expect(!articleSource.includes("配套模块"), "Article detail pages must avoid repeated module entrances inside articles.");
  expect(!articleSource.includes("完成验收卡"), "Article detail pages must not add a second completion card after the main checklist.");
  expect(articleSource.includes("article-record-panel") && articleSource.includes("article-record-preview-grid"), "Article detail learning record panel must expose stable compact layout classes.");
  const articleRecordPanelSource = articleSource.slice(articleSource.indexOf('className="article-record-panel'), articleSource.indexOf('className="article-record-preview-grid"'));
  const learningRecordTextSource = articleSource.slice(articleSource.indexOf("const learningRecordText"), articleSource.indexOf("async function copyActionPack"));
  expect(articleRecordPanelSource.includes("待填写") && !articleRecordPanelSource.includes("待补充"), "Article learning-record field status must read as user input state, not unfinished site content.");
  expect(learningRecordTextSource.includes("待完善") && !learningRecordTextSource.includes('item.pass ? "可用" : "待补充"'), "Copied article learning-record quality checks must use learner-facing improvement language.");
  expect(/className="article-practice-pack-details article-compact-tool-details"[\s\S]{0,240}background: "transparent"[\s\S]{0,120}border: "none"[\s\S]{0,120}boxShadow: "none"/.test(articleSource), "Article practice pack wrapper must stay a lightweight folded row instead of a nested framed card.");
  expect(!articleSource.includes("练习、模板与记录 · {practicePackItemCount} 项"), "Article practice pack summary must not expose item-count chrome.");
  for (const retiredArticleSummaryChrome of ["证据四格卡 · 完成度", "科学故事骨架 · 完成度", "鉴定证据链表 · 完成度", "项目证据表 · 完成度", "AI 创作生成记录表 · 完成度", "科研问题转译卡 · 完成度", "AI 学习材料质检表 · 完成度", "AI 质检提示词包 ·", "上手步骤 ·", "检查清单 ·", "避坑提醒 ·", "读完填写 · 完成度"]) {
    expect(!articleSource.includes(retiredArticleSummaryChrome), `Article details summaries should stay short and not expose count/status chrome: ${retiredArticleSummaryChrome}.`);
  }
  expect(articleSource.includes("填写完成度：{articleRecordScore}/4") && articleSource.includes("完成度 {evidenceChainScore}/4") && articleSource.includes("完成度 {aiMaterialAuditScore}/6"), "Article detail expanded panels must keep useful completion feedback after removing summary count chrome.");
  expect(articleSource.includes("min-height: 64px !important"), "Article detail mobile learning record textareas must stay compact.");
  expect(!articleSource.includes('articleReadingTaskPackCards.map((item, index) => (') && !articleSource.includes('minHeight: 136'), "Article detail task pack must not render a front-loaded five-card grid before the body.");
  for (const retiredArticleHeaderBlock of ["function ArticleIllustration", "article-illustration-stamp", "paddingRight: 162", "padding-right: 10.5rem", "articleReadingTaskPackCards", "readingTaskPackText", "copyReadingTaskPack", "copiedReadingTaskPack", "目标是带走可执行材料，而不是只浏览", "先做、抓证据、留产出、验收、接着做", "【阅读任务包】", "已复制任务包", "复制任务包", "已复制行动包"]) {
    expect(!articleSource.includes(retiredArticleHeaderBlock), `Article detail header should stay short and not reintroduce retired top chrome: ${retiredArticleHeaderBlock}.`);
  }
  const bodyPointsRenderIndex = articleSource.indexOf('id="article-body-points"');
  const primaryActionRenderIndex = articleSource.indexOf('id="article-primary-action"');
  expect(bodyPointsRenderIndex !== -1 && primaryActionRenderIndex !== -1 && bodyPointsRenderIndex < primaryActionRenderIndex, "Article body points must appear before action/checklist panels.");
  const firstActionRenderIndex = articleSource.indexOf('className="article-first-action-strip"');
  expect(firstActionRenderIndex !== -1 && bodyPointsRenderIndex !== -1 && primaryActionRenderIndex !== -1 && firstActionRenderIndex < bodyPointsRenderIndex && bodyPointsRenderIndex < primaryActionRenderIndex, "Article first action, body, and practice panels must appear in that order.");
}

function verifyWorkJsonLdLearningOutcomes() {
  const appSource = read("src/app/App.tsx");
  const navigationSource = read("src/app/navigation.ts");
  const staticIndexSource = read("scripts/generate-static-index.mjs");
  const heroSource = read("src/app/components/Hero.tsx");
  const workDetailSource = read("src/app/components/WorkDetailPage.tsx");
  const worksSource = read("src/app/components/Works.tsx");
  const notesSource = read("src/app/components/Notes.tsx");
  const researchSource = read("src/app/components/ResearchEssays.tsx");
  const footerSource = read("src/app/components/Footer.tsx");

  expect(appSource.includes("learningResourceType: work.category"), "Runtime work JSON-LD must include learningResourceType.");
  expect(appSource.includes("teaches: [work.task, work.starter, work.success, ...work.path, ...work.outputs]"), "Runtime work JSON-LD must include immediate task, starter action, completion standard, learning path, and output outcomes.");
  expect(appSource.includes("const metaDescriptionMaxLength = 180"), "Runtime meta descriptions must have a readable length cap.");
  expect(appSource.includes("function buildMetaDescription"), "Runtime page metadata must use a shared meta description builder.");
  expect(appSource.includes("const workActionDescription = work ? `先做这个：${work.starter}。完成标准：${work.success}` : null"), "Runtime work meta descriptions must include starter and completion standard.");
  expect(appSource.includes("function scrollToHashTarget"), "App router must support hash target scrolling on routed pages.");
  expect(appSource.includes("window.setTimeout(() => scrollToHashTarget(shouldMoveFocus, attempt + 1), 60)"), "App router must retry hash scrolling while lazy routed content loads.");
  expect(appSource.includes("if (!unknownPath && scrollToHashTarget(shouldMoveFocus)) return;"), "App router must honor hash targets on work detail routes.");
  expect(navigationSource.includes('export const workPrimaryToolHash = "#work-primary-tool"'), "Navigation helpers must centralize the primary work tool hash.");
  expect(navigationSource.includes("export function getWorkToolHref"), "Navigation helpers must expose a direct-to-tool work href builder.");
  expect(staticIndexSource.includes("learningResourceType: route.category"), "Static work JSON-LD generator must include learningResourceType.");
  expect(staticIndexSource.includes("teaches: [route.task, route.starter, route.success, ...route.pathSteps, ...route.outputs].filter(Boolean)"), "Static work JSON-LD generator must include immediate task, starter action, completion standard, learning path, and output outcomes.");
  expect(staticIndexSource.includes("操作内容："), "Static index fallback must expose concise work task labels.");
  expect(staticIndexSource.includes("先做这个："), "Static index fallback must expose first concrete starter actions.");
  expect(staticIndexSource.includes("完成标准："), "Static index fallback must expose concrete completion standards.");
  expect(!heroSource.includes("{work.starter}") && !heroSource.includes("{work.success}"), "Homepage hero work cards must not repeat long starter or completion text.");
  expect(!heroSource.includes("{work.outputs[0]}"), "Homepage hero work cards must not repeat saved-output text.");
  expect(!heroSource.includes("hero-work-open"), "Homepage hero entries must not repeat a separate open pill inside every module.");
  expect(heroSource.includes("aria-label={`打开${entry.title}：${entry.desc}`}"), "Homepage hero work cards must keep visual labels short while preserving descriptions for assistive labels.");
  expect(heroSource.includes('id="works"'), "Homepage #works anchor must point to the first-screen module directory instead of a duplicate section.");
  expect(heroSource.includes('aria-label="内容目录"'), "Homepage hero must label the first-screen module directory.");
  expect(heroSource.includes("hero-entry-card") && heroSource.includes('display: "grid"') && heroSource.includes("hero-featured-panel") && !heroSource.includes("hero-work-card"), "Homepage hero module entries must use one featured directory, not repeated card sections.");
  expect(heroSource.includes("hero-entry-desc") && !heroSource.includes("hero-entry-description-card"), "Homepage hero can expose module descriptions only inside compact featured cards.");
  expect(!heroSource.includes("hero-reading-library") && !heroSource.includes("hero-article-row") && heroSource.includes('const readingHref = "/reading"'), "Homepage hero may include one compact reading CTA but must not repeat article entrances on the first screen.");
  expect(!heroSource.includes("minHeight: 230") && !heroSource.includes("minHeight: 260") && !heroSource.includes("hero-work-summary"), "Homepage hero module entries must not use tall sticky-note cards.");
  expect(heroSource.includes(".hero-entry-grid") && heroSource.includes("justify-items: start !important") && heroSource.includes("grid-template-columns: 2.1rem minmax(0, 1fr) !important") && heroSource.includes("padding: 0.58rem 0.82rem 0.58rem 0.64rem !important") && heroSource.includes(".hero-entry-card::after") && heroSource.includes("display: none !important") && heroSource.includes("padding-right: 0.12rem !important") && heroSource.includes("-webkit-line-clamp: 2 !important") && heroSource.includes(".hero-entry-side"), "Homepage hero mobile featured directory must remain short while fitting the visible viewport with a right-side text safe area.");
  expect(heroSource.includes('boxSizing: "border-box"'), "Homepage hero containers must use border-box sizing to avoid mobile overflow.");
  expect(!heroSource.includes("scroll-snap-type") && !heroSource.includes("overflow-x: auto"), "Homepage hero must not hide module entries behind horizontal scrolling.");
  expect(heroSource.includes('import { getWorkToolHref, navigateClient, shouldUseClientNavigation } from "../navigation"'), "Homepage hero must use the direct-to-tool work href helper without duplicate home-section CTAs.");
  expect(heroSource.includes("href: getWorkToolHref(work.href)") && heroSource.includes("href={entry.href}"), "Homepage first-screen module cards must link directly to work tools.");
  for (const retiredHeroBlock of ["sessionPlans", "materialRoutes", "heroModuleStats", "hero-session-copy-status", "hero-material-route-grid", "hero-actions", "hero-cta", "navigateHomeSection", "science learning lab", "完成标准，", "先做这个，"]) {
    expect(!heroSource.includes(retiredHeroBlock), `Homepage hero should stay short and not include retired duplicate block: ${retiredHeroBlock}.`);
  }
  expect(!appSource.includes("<Works") && !appSource.includes('import { Works }'), "Homepage must not render a duplicate Works section below the hero.");
  for (const retiredWorksBlock of ["work-scan-strip", "work-module-checklist-panel", "work-reading-path-panel"]) {
    expect(!worksSource.includes(retiredWorksBlock), `Works data module should stay shorter and not include retired duplicate block: ${retiredWorksBlock}.`);
  }
  expect(!worksSource.includes("export function Works") && !worksSource.includes("function WorkCard"), "Works module should stay data-only; homepage cards live in Hero.");
  expect(!notesSource.includes("export function Notes") && !notesSource.includes("note-card"), "Notes module should stay data-only; homepage must not regain article card UI.");
  expect(!researchSource.includes("export function ResearchEssays") && !researchSource.includes("research-essay-card"), "Research module should stay data-only; homepage must not regain article card UI.");
  for (const retiredWorkQuickStartBlock of ["function WorkQuickStart", "<WorkQuickStart work={work} />", "workFirstRunPlanText", "copyFirstRunPlan", "work-run-summary", "work-run-actions", "work-quick-start", "work-start-tool-link", "work-first-run-copy-button", "复制运行卡", "第一次运行卡"]) {
    expect(!workDetailSource.includes(retiredWorkQuickStartBlock), `Work detail pages should open directly into the product, not a retired quick-start strip: ${retiredWorkQuickStartBlock}.`);
  }
  expect(!workDetailSource.includes("<WorkCompletionEvidence work={work} />"), "Work detail pages should not append a duplicate completion evidence panel after the primary product.");
  expect(workDetailSource.includes('id="work-primary-tool"') && workDetailSource.includes("tabIndex={-1}"), "Work detail primary tool anchor must be focusable.");
  const workHeroRenderIndex = workDetailSource.indexOf("<WorkHero work={work} compact />");
  const primaryToolRenderIndex = workDetailSource.indexOf('id="work-primary-tool"');
  expect(workHeroRenderIndex !== -1 && primaryToolRenderIndex !== -1, "Work detail pages must render title and primary tool.");
  expect(workHeroRenderIndex < primaryToolRenderIndex, "Work detail pages must place the primary product directly after the compact title bar.");
  expect(workDetailSource.includes('padding: compact ? "0.22rem 1.5rem"') && workDetailSource.includes('gridTemplateColumns: compact ? "22px minmax(0, 1fr)"'), "Work detail compact title bar must stay short so the product appears immediately.");
  expect(workDetailSource.includes("回到内容目录") && !workDetailSource.includes("回到学习模块"), "Work detail return copy must point to the shared content directory.");
  expect(workDetailSource.includes("{compact ? null : (") && workDetailSource.includes("{work.tags.map((tag) => (") && !workDetailSource.includes("work.tags.slice(0, compact ? 2"), "Work detail compact title bar must not show multi-tag chrome.");
  expect(!workDetailSource.includes('padding: "0.11rem 0.48rem"') && !workDetailSource.includes("whiteSpace: \"nowrap\",\n              }}\n            >\n              {work.category}"), "Work detail compact title bar must not show a right-side category pill.");
  for (const retiredWorkArticleBlock of ["pairedArticleSlugsByWorkSlug", "function WorkPairedReading", "配套文章", "work-paired-reading-link", "article.actionSteps[0]", "aria-label={`打开配套文章：${article.title}`", "全部文章 →"]) {
    expect(!workDetailSource.includes(retiredWorkArticleBlock), `Work detail pages should not reintroduce a separate paired-article entrance: ${retiredWorkArticleBlock}.`);
  }
  for (const slug of ["gene-expression", "concept-explainer", "research-prompt-kit", "plant-evolution-stories", "crispr-interactive"]) {
    expect(workDetailSource.includes(`"${slug}"`), `Work detail page routing must include ${slug}.`);
  }
  expect(!workDetailSource.includes("getWorkToolHref"), "Work detail pages should not keep related-work direct-link helper code when bottom entries are removed.");
  expect(!workDetailSource.includes("学习模块前后导航"), "Work detail pages should not reintroduce previous/next module navigation copy.");
  expect(!workDetailSource.includes("work-sequence-card"), "Work detail pages should not reintroduce previous/next module cards.");
  for (const retiredWorkTailBlock of ["function WorkContinueLinks", "<WorkContinueLinks work={work} />", "work-next-card", "继续探索", "全部学习模块 →", "继续探索${item.title}", "先做这个：{item.work.starter}"]) {
    expect(!workDetailSource.includes(retiredWorkTailBlock), `Work detail pages should not reintroduce duplicate long related-module cards: ${retiredWorkTailBlock}.`);
  }
  expect(!footerSource.includes('navigateHomeSection'), "Footer should not repeat homepage section navigation.");
  expect(appSource.includes('display: "flex"') && appSource.includes('flexDirection: "column"') && appSource.includes('flex: isHome ? "0 0 auto" : "1 0 auto"'), "App shell must use a column layout that pushes footer to the bottom on short non-home pages.");
  expect(footerSource.includes("externalLinks"), "Footer should keep compact external contact links.");
  expect(footerSource.includes("科学学习与 AI · 2026"), "Footer should stay as a compact brand line.");
  expect(footerSource.includes("footer-inner") && footerSource.includes("footer-links"), "Footer should expose mobile-safe layout hooks.");
  expect(footerSource.includes("@media (max-width: 560px)") && footerSource.includes("grid-template-columns: 1fr !important"), "Footer must stack on narrow screens instead of clipping links.");
  for (const retiredFooterBlock of ["footerWorkLinks", "footer-work-link", "footerNextPlanText", "copyFooterNextPlan", "页尾继续学习清单", "footer-next-plan-panel", "学习模块", "证据库", "方法库", "联系", "bycherry.me"]) {
    expect(!footerSource.includes(retiredFooterBlock), `Footer should stay short and not include retired duplicate block: ${retiredFooterBlock}.`);
  }
}

function verifyResearchAgentWorkbenchContract() {
  const workDetailSource = read("src/app/components/WorkDetailPage.tsx");
  const researchSkillSource = read("public/skills/research-agent/SKILL.md");
  const promptKitMatch = workDetailSource.match(/const promptPracticeCases = \[([\s\S]*?)\nfunction PromptKitContent\(\) \{([\s\S]*?)\nfunction PlantEvolutionContent\(\)/);

  expect(Boolean(promptKitMatch), "WorkDetailPage must define promptPracticeCases before PromptKitContent and before PlantEvolutionContent.");

  if (!promptKitMatch) return;

  const practiceCasesSource = promptKitMatch[1];
  const promptKitSource = promptKitMatch[2];
  expect(promptKitSource.includes('"待填写"') && promptKitSource.includes("写明未提供") && !promptKitSource.includes("待补充"), "Research workbench input statuses must read as user input state, not unfinished site content.");
  const requiredWorkbenchFeatures = [
    { label: "practice cases", text: "promptPracticeCases" },
    { label: "practice case loader", text: "loadPracticeCase" },
    { label: "active practice state", text: "activePracticeCase" },
    { label: "visible practice case section", text: "练习案例" },
    { label: "paper reading case", text: "读论文练习" },
    { label: "chart reading case", text: "讲图表练习" },
    { label: "experiment design case", text: "查实验设计练习" },
    { label: "discussion logic case", text: "查讨论逻辑练习" },
    { label: "review response case", text: "回审稿意见练习" },
    { label: "terminology consistency case", text: "统一术语练习" },
    { label: "material source boundary", text: "材料来源：练习材料，用于学习证据拆解" },
    { label: "direct local preview cue", text: "可以直接运行本地预览" },
    { label: "method evidence section", text: "方法依据" },
    { label: "source-grounded signal data", text: "sourceGroundedSignals" },
    { label: "semantic search demand", text: "语义检索与报告生成" },
    { label: "multi-step search demand", text: "多步检索与筛选" },
    { label: "reference check demand", text: "参考文献核查" },
    { label: "Elicit source", text: "https://docs.elicit.com/" },
    { label: "Consensus source", text: "https://help.consensus.app/en/articles/9922660-how-to-search-best-practices" },
    { label: "scite source", text: "https://api.scite.ai/docs" },
    { label: "copyable research record output", text: "researchRecordOutput" },
    { label: "research record copy action", text: "copyResearchRecord" },
    { label: "research record copy button", text: "复制研究记录" },
    { label: "research record visible card", text: "可保存研究记录" },
    { label: "research record evidence candidates", text: "二、证据候选" },
    { label: "research record risk flags", text: "四、风险标记" },
    { label: "citation audit data", text: "citationAuditItems" },
    { label: "copyable citation audit output", text: "citationAuditOutput" },
    { label: "citation audit copy action", text: "copyCitationAudit" },
    { label: "citation audit visible card", text: "引用核查" },
    { label: "citation audit copy button", text: "复制引用核查" },
    { label: "source identifier audit", text: "来源标识" },
    { label: "figure locator audit", text: "图表定位" },
    { label: "sample statistics audit", text: "样本统计" },
    { label: "research record citation audit", text: "五、引用核查" },
    { label: "research record next actions", text: "八、下一步动作" },
    { label: "completion standards data", text: "completionStandards" },
    { label: "visible completion standards", text: "本次完成标准" },
    { label: "human confirmation framing", text: "人工确认" },
    { label: "review summary mode", text: "复核摘要" },
    { label: "usage level heading", text: "使用层级" },
    { label: "skill prompt contract", text: "researchAgentSkillPrompt" },
    { label: "copyable research skill prompt", text: "copyResearchAgentSkill" },
    { label: "research skill copy state", text: "copiedResearchSkill" },
    { label: "research protocol visible panel", text: "研究助手协议" },
    { label: "public research skill document link", text: "/skills/research-agent/SKILL.md" },
    { label: "research protocol copy button", text: "复制协议" },
    { label: "research skill responsive panel", text: "research-agent-skill-panel" },
    { label: "research skill markdown frontmatter", text: "name: research-agent" },
    { label: "learner research question draft", text: "researchQuestionDraft" },
    { label: "learner unsupported claim draft", text: "unsupportedClaimDraft" },
    { label: "learner citation verification draft", text: "citationToVerifyDraft" },
    { label: "learner next action draft", text: "nextResearchActionDraft" },
    { label: "learner research review fields", text: "learnerResearchReviewFields" },
    { label: "learner research review score", text: "learnerResearchReviewScore" },
    { label: "visible learner review panel", text: "我的复核记录" },
    { label: "learner review grid", text: "research-review-grid" },
    { label: "API learner review contract", text: "learner_review" },
    { label: "research record learner review section", text: "九、我的复核记录" },
    { label: "visible research start path", text: "本次阅读路径" },
    { label: "research start path data", text: "researchStartPath" },
    { label: "research start path class", text: "research-start-path-strip" },
    { label: "research start path evidence step", text: "抽证据" },
    { label: "research start path citation step", text: "核引用" },
    { label: "research start path record step", text: "留记录" },
    { label: "material gate data", text: "researchMaterialGateCards" },
    { label: "visible material gate", text: "材料闸门" },
    { label: "material gate strip", text: "research-material-gate-strip" },
    { label: "material gate source", text: "来源标识" },
    { label: "material gate method", text: "样本方法" },
    { label: "material gate evidence", text: "结果证据" },
    { label: "material gate boundary", text: "边界语句" },
    { label: "starter template", text: "researchStarterTemplate" },
    { label: "starter cards data", text: "researchMaterialStarterCards" },
    { label: "visible starter panel", text: "先填四句就能开始" },
    { label: "starter button", text: "套用四句起步" },
    { label: "starter grid", text: "research-material-starter-grid" },
    { label: "default visible local preview", text: "useState(true)" },
    { label: "visible local preview result panel", text: "research-live-preview-panel" },
    { label: "visible local preview result title", text: "本地预览结果" },
    { label: "local preview result grid", text: "research-live-preview-grid" },
    { label: "local preview result card", text: "research-live-preview-card" },
    { label: "learner-first top copy action", text: "copiedResearchRecord ? \"已复制\" : \"复制研究记录\"" },
    { label: "citation-first top copy action", text: "copiedCitationAudit ? \"已复制\" : \"复制引用核查\"" },
    { label: "compact route grid", text: "research-prompt-route-grid" },
    { label: "compact route button", text: "research-prompt-route-button" },
    { label: "compact route hidden input", text: "research-prompt-route-input" },
    { label: "compact route hidden output", text: "research-prompt-route-output" },
  ];

  const retiredWorkbenchPatterns = [
    { label: "mentor framing", pattern: /导师/ },
    { label: "implementation roadmap heading", pattern: /落地层级/ },
    { label: "already-landed project copy", pattern: /当前已落地/ },
    { label: "long top explanation panel", pattern: /research-agent-top-panel|这个工作台直接提供/ },
    { label: "visible old agent labels", pattern: /本地 Agent 预览|科研 Agent 任务包|科研 Agent 研究记录|科研 Agent 引用核查记录|让 Agent|Agent 如何|Agent 只能/ },
    { label: "visible old API labels", pattern: /API 输出字段|API 请求 JSON|API 契约|API 接入契约|说明与边界 · 路由、API、Skill/ },
    { label: "visible skill jargon", pattern: /研究助手 Skill|打开 Skill|复制 Skill|进阶设置 · 路由、接入、Skill/ },
  ];

  for (const item of requiredWorkbenchFeatures) {
    expect(`${practiceCasesSource}\n${promptKitSource}`.includes(item.text), `Research Agent workbench is missing ${item.label}: ${item.text}`);
  }

  expect(promptKitSource.includes("#prompt-kit-builder .research-prompt-route-grid") && promptKitSource.includes("grid-template-columns: repeat(2, minmax(0, 1fr)) !important"), "Research Agent mobile route selector must stay as readable two-column task buttons.");
  expect(promptKitSource.includes("#prompt-kit-builder .research-prompt-route-input,") && promptKitSource.includes("#prompt-kit-builder .research-prompt-route-output") && promptKitSource.includes("display: none !important"), "Research Agent mobile route selector must hide long input/output details.");
  expect(promptKitSource.includes('className="research-agent-mode-grid"') && promptKitSource.includes('gridTemplateColumns: "repeat(3, minmax(0, 1fr))"'), "Research Agent mode selector must stay as compact three-column buttons.");
  expect(promptKitSource.includes('className="research-agent-mode-desc"') && promptKitSource.includes('style={{ display: "none"'), "Research Agent mode descriptions must stay hidden visually so the material input appears earlier.");
  expect(promptKitSource.includes('className="research-agent-main-panel"') && promptKitSource.includes('padding: "0.82rem"') && !promptKitSource.includes('className="research-agent-main-panel" style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "1.2rem"'), "Research Agent main panel must stay compact instead of a tall framed card.");
  expect(promptKitSource.includes('const [hasRunPreview, setHasRunPreview] = useState(true)') && promptKitSource.includes('aria-labelledby="research-live-preview-title"') && promptKitSource.includes("根据当前材料实时给出任务路由、证据候选、风险边界和下一步动作"), "Research Agent first screen must show live local preview results instead of waiting behind a run button.");
  expect(promptKitSource.includes("#prompt-kit-builder .research-live-preview-grid") && promptKitSource.includes("grid-template-columns: repeat(2, minmax(0, 1fr)) !important"), "Research Agent live local preview must stay compact on mobile.");
  const researchReviewSource = promptKitSource.slice(promptKitSource.indexOf('className="research-review-grid"'), promptKitSource.indexOf('className="research-material-textarea"'));
  expect(/className="research-material-textarea"[\s\S]{0,260}minHeight: 84/.test(promptKitSource) && !/className="research-material-textarea"[\s\S]{0,260}minHeight: 104/.test(promptKitSource), "Research Agent material textarea must stay compact on desktop instead of a long default frame.");
  expect(promptKitSource.includes("min-height: 84px !important") && !promptKitSource.includes("min-height: 104px !important"), "Research Agent mobile material textarea must not be stretched into a tall default frame.");
  expect(!researchReviewSource.includes("minHeight: 154") && researchReviewSource.includes("minHeight: 54"), "Research Agent learner review fields must not use fixed tall card heights.");
  expect(promptKitSource.includes('className="research-agent-preview-panel"') && promptKitSource.includes('background: hasRunPreview ? "var(--cherry-sage-light)" : "transparent"') && promptKitSource.includes('padding: hasRunPreview ? "0.68rem" : 0') && !promptKitSource.includes("点击运行后，这里会显示材料状态、证据边界和下一步分析顺序。"), "Research Agent local preview must not render an empty default result card before the learner runs it.");
  expect(promptKitSource.includes("#prompt-kit-builder .research-start-path-strip") && promptKitSource.includes('gridTemplateColumns: "repeat(4, minmax(0, 1fr))"') && promptKitSource.includes("grid-template-columns: repeat(2, minmax(0, 1fr)) !important"), "Research Agent visible start path must stay compact across desktop and mobile.");
  expect(promptKitSource.includes("#prompt-kit-builder .research-material-gate-strip") && promptKitSource.includes('gridTemplateColumns: "repeat(4, minmax(0, 1fr))"') && promptKitSource.includes("grid-template-columns: repeat(2, minmax(0, 1fr)) !important"), "Research Agent material gate must stay compact across desktop and mobile.");
  expect(promptKitSource.includes("#prompt-kit-builder .research-material-starter-grid") && promptKitSource.includes("grid-template-columns: repeat(2, minmax(0, 1fr)) !important"), "Research Agent starter cards must stay visible and readable on mobile.");
  for (const retiredResearchSummaryChrome of ["流程、练习与复核 ·", "任务路由建议 ·", "我的复核记录 ·", "生成指令、质控与任务包 ·", "进阶设置 ·"]) {
    expect(!promptKitSource.includes(retiredResearchSummaryChrome), `Research Agent summaries should stay short and not expose status chrome: ${retiredResearchSummaryChrome}.`);
  }
  expect(promptKitSource.includes("{suggestedRoute.title}") && promptKitSource.includes("{routeConfidence}") && promptKitSource.includes("填写完成度 {learnerResearchReviewScore}/4"), "Research Agent expanded panels must keep route and learner-review status after summary chrome is removed.");
  for (const requiredLearnerLabel of ["复制进阶结构", "复制结构", "复制返回模板", "进阶请求结构", "进阶输出结构", "返回模板与验收", "材料不会离开浏览器", "Elicit 文档", "Consensus 搜索文档", "scite 引用核查文档"]) {
    expect(promptKitSource.includes(requiredLearnerLabel), `Research Agent workbench must keep learner-facing advanced-copy label: ${requiredLearnerLabel}`);
  }
  for (const retiredTechnicalLabel of ["复制进阶 JSON", "复制 JSON", "复制契约", "复制返回格式", "进阶请求 JSON", "进阶输出字段", "返回格式与验收", "不调用 API", "advanced JSON contract", "API JSON contract", "Elicit API", "scite API", "Elicit systematic review / API", "scite API reference check"]) {
    expect(!promptKitSource.includes(retiredTechnicalLabel), `Research Agent workbench must not expose technical implementation label: ${retiredTechnicalLabel}`);
  }

  for (const item of retiredWorkbenchPatterns) {
    expect(!item.pattern.test(promptKitSource), `Research Agent workbench contains retired copy: ${item.label}`);
  }

  expect(Array.from(practiceCasesSource.matchAll(/\btask:\s*"/g)).length >= 6, "Research Agent workbench should expose practice cases for all six task routes.");
  for (const task of ["文献精读", "实验设计检查", "图表解读", "论文逻辑检查", "审稿意见回应", "术语一致性检查"]) {
    expect(practiceCasesSource.includes(`task: "${task}"`), `Research Agent practice cases must cover task route: ${task}`);
  }
  expect(!promptKitSource.includes('useState("研究问题：\\n样本/材料：\\n已有结果：\\n我最担心的问题：")'), "Research Agent workbench should not open on an empty field-only starter.");

  for (const text of [
    "name: research-agent",
    "description: Use when a learner wants to turn research material",
    "# Research Reading Assistant",
    "## Role",
    "## Input",
    "## Workflow",
    "## Task Routes",
    "## Output Contract",
    "## Evidence Rules",
    "## Completion Gate",
    "adult learner",
    "Classify the task route from material signals",
    "Run a material gate",
    "source identifier, methods/sample design, result evidence, and boundary statements",
    "evidence_items",
    "missing_fields",
    "risk_flags",
    "citation_check",
    "reviewer_questions",
    "Do not invent DOI",
    "Keep correlation, association, mechanism, causation, and speculation separate",
    "At least one evidence_item",
    "Next actions written as concrete checks",
    "structured handoff template",
  ]) {
    expect(researchSkillSource.includes(text), `Public research agent SKILL.md is missing required content: ${text}`);
  }
  for (const retiredResearchSkillCopy of ["# Research Agent", "research-learning agent", "API JSON contract"]) {
    expect(!researchSkillSource.includes(retiredResearchSkillCopy), `Public research agent SKILL.md must not expose retired technical copy: ${retiredResearchSkillCopy}`);
  }
}

function verifyConceptExplainerAgentContract() {
  const workDetailSource = read("src/app/components/WorkDetailPage.tsx");
  const worksSource = read("src/app/components/Works.tsx");
  const conceptSkillSource = read("public/skills/concept-explainer/SKILL.md");
  const conceptMatch = workDetailSource.match(/function ConceptExplainerContent\(\) \{([\s\S]*?)\nfunction CrisprContent\(\)/);

  expect(Boolean(conceptMatch), "WorkDetailPage must include ConceptExplainerContent before CrisprContent.");

  if (!conceptMatch) return;

  const conceptSource = conceptMatch[1];
  const requiredConceptFeatures = [
    { label: "free concept input state", text: "conceptInput" },
    { label: "fallback concept agent builder", text: "buildConceptAgentExplanation" },
    { label: "source boundary learner input", text: "sourceBoundary" },
    { label: "current stuck point learner input", text: "stuckPoint" },
    { label: "contextual evidence boundary", text: "contextualEvidenceBoundary" },
    { label: "concept input mode presets", text: "conceptInputModes" },
    { label: "concept input mode apply handler", text: "applyConceptInputMode" },
    { label: "concept input mode copy guide", text: "copyConceptModeGuide" },
    { label: "visible concept input mode panel", text: "先选一种输入模式" },
    { label: "freeform concept brief state", text: "rawConceptBrief" },
    { label: "freeform concept brief template", text: "rawConceptBriefTemplate" },
    { label: "freeform concept brief parser", text: "applyRawConceptBrief" },
    { label: "freeform concept brief extractor", text: "extractRawConceptBriefValue" },
    { label: "visible freeform concept brief panel", text: "整段输入也可以开始" },
    { label: "visible freeform concept brief class", text: "concept-freeform-brief-panel" },
    { label: "freeform concept brief paste textarea", text: "concept-freeform-brief-grid" },
    { label: "freeform concept brief helper cards", text: "concept-freeform-brief-card-grid" },
    { label: "freeform concept brief template button", text: "套用四句格式" },
    { label: "freeform concept brief run button", text: "解析并生成" },
    { label: "definition-only input mode", text: "只会背定义" },
    { label: "process confusion input mode", text: "过程顺序混乱" },
    { label: "evidence boundary input mode", text: "证据边界不清" },
    { label: "figure reading input mode", text: "图表看不懂" },
    { label: "concept input mode grid", text: "concept-input-mode-grid" },
    { label: "concept mode guide text", text: "conceptModeGuideText" },
    { label: "concept input mode copy button", text: "复制输入模式" },
    { label: "skill prompt contract", text: "conceptSkillPrompt" },
    { label: "copyable skill prompt", text: "copyConceptSkillPrompt" },
    { label: "visible explainer protocol", text: "解释助手协议" },
    { label: "arbitrary concept copy", text: "输入任意概念" },
    { label: "direct learner agent role", text: "陪我学习" },
    { label: "anti-shortcut boundary", text: "不要替我跳过判断过程" },
    { label: "anti-fabrication boundary", text: "不编造具体事实" },
    { label: "stable output card", text: "生成学习卡" },
    { label: "explanation run panel", text: "解释流程面板" },
    { label: "visual mode chooser", text: "visualMode" },
    { label: "visual structure node data", text: "visualStructureItems" },
    { label: "visible concept visual structure", text: "可视化解释图" },
    { label: "visual structure group class", text: "concept-visual-structure" },
    { label: "visual explanation output", text: "可视化解释" },
    { label: "visual structure copied nodes", text: "visualStructureItems.map((item, index)" },
    { label: "visual node count", text: "个节点" },
    { label: "visual selection card", text: "可视化选择" },
    { label: "explanation pack state", text: "copiedExplanationPack" },
    { label: "explanation pack cards", text: "conceptExplanationPackCards" },
    { label: "explanation pack copy text", text: "conceptExplanationPackText" },
    { label: "explanation pack copy handler", text: "copyConceptExplanationPack" },
    { label: "visible explanation pack", text: "概念解释包" },
    { label: "explanation pack class", text: "concept-explanation-pack" },
    { label: "explanation pack copy button", text: "复制解释包" },
    { label: "compact explanation pack header", text: "concept-pack-header-copy" },
    { label: "compact explanation pack output", text: "concept-pack-output" },
    { label: "explanation pack card one-sentence", text: "一句话解释" },
    { label: "explanation pack visual skeleton", text: "图形骨架" },
    { label: "explanation pack immediate practice", text: "马上练习" },
    { label: "completion standard card", text: "合格标准" },
    { label: "missing input handling", text: "最多问 2 个短问题" },
    { label: "source boundary visible field", text: "资料边界" },
    { label: "current stuck point visible field", text: "当前卡点" },
    { label: "concept scope diagnostic data", text: "conceptScopeHints" },
    { label: "visible concept scope diagnostic", text: "concept-scope-hint-strip" },
    { label: "concept narrowing status", text: "建议收窄" },
    { label: "concept narrowing questions data", text: "conceptNarrowingQuestions" },
    { label: "visible concept narrowing questions", text: "concept-narrowing-question-strip" },
    { label: "concept narrowing label", text: "概念收窄问法" },
    { label: "scope narrowing question", text: "限定范围" },
    { label: "confusion narrowing question", text: "锁定卡点" },
    { label: "output narrowing question", text: "确定产出" },
    { label: "scope output acceptance", text: "输出验收" },
    { label: "source boundary prioritization", text: "Prioritize source boundary and current confusion" },
    { label: "cycle visual option", text: "循环图" },
    { label: "completion gate copy", text: "完成门槛" },
    { label: "source boundary unknown handling", text: "source boundary is unknown" },
    { label: "understanding check data", text: "understandingChecks" },
    { label: "self audit output", text: "selfAuditOutput" },
    { label: "copy understanding audit handler", text: "copyUnderstandingAudit" },
    { label: "visible understanding audit card", text: "理解验收卡" },
    { label: "learner definition draft", text: "definitionDraft" },
    { label: "learner mechanism draft", text: "mechanismDraft" },
    { label: "learner transfer draft", text: "transferDraft" },
    { label: "learner boundary draft", text: "boundaryDraft" },
    { label: "learner answer fields", text: "learnerAuditFields" },
    { label: "learner completion score", text: "learnerAuditScore" },
    { label: "visible learner record panel", text: "我的理解记录" },
    { label: "learner input grid", text: "concept-understanding-input-grid" },
    { label: "self audit filled record", text: "我的填写记录" },
    { label: "copy audit record button", text: "复制自查记录" },
    { label: "pass criteria copy", text: "通过标准" },
    { label: "public skill document link", text: "/skills/concept-explainer/SKILL.md" },
    { label: "full protocol copy button", text: "复制完整协议" },
    { label: "skill markdown frontmatter", text: "name: concept-explainer" },
  ];

  const retiredConceptPatterns = [
    { label: "teacher prompt label", pattern: /教师追问/ },
    { label: "teacher output field", pattern: /teacherMove/ },
    { label: "student output field", pattern: /studentOutput/ },
    { label: "lecture copy", pattern: /教师教案|讲给谁|讲解目标|讲解稿/ },
    { label: "classroom flow heading", pattern: /课堂流程/ },
    { label: "school-level advanced label", pattern: /研究生版/ },
    { label: "visible old agent labels", pattern: /概念解释 Agent|Agent 运行面板|Agent 运行记录|当前：Agent 生成|解释 Agent skill/ },
    { label: "lowercase visible skill label", pattern: /概念解释 skill 协议|概念解释 skill 指令/ },
    { label: "visible skill jargon", pattern: /解释助手 Skill|查看 SKILL\.md|复制完整 Skill|按稳定 skill 流程/ },
  ];

  for (const item of requiredConceptFeatures) {
    expect(conceptSource.includes(item.text), `Concept explainer agent contract is missing ${item.label}: ${item.text}`);
  }

  for (const item of retiredConceptPatterns) {
    expect(!item.pattern.test(conceptSource), `Concept explainer must remain learner-facing and avoid retired copy: ${item.label}`);
  }

  expect(conceptSource.includes("#concept-explainer-tool .concept-pack-card-grid") && conceptSource.includes("grid-template-columns: repeat(3, minmax(0, 1fr)) !important"), "Concept explainer mobile explanation pack must stay as compact three-column cards.");
  expect(conceptSource.includes("const conceptTopRoute") && conceptSource.includes('className="concept-top-route-strip"') && conceptSource.includes("先得到一条解释路径") && conceptSource.includes("visualStructureItems.map((item) => item.title).join(\" -> \")"), "Concept explainer must surface the diagnosis, analogy, visualization, and transfer route before the input form.");
  expect(conceptSource.includes("#concept-explainer-tool .concept-top-route-strip") && conceptSource.includes("grid-template-columns: repeat(2, minmax(0, 1fr)) !important"), "Concept explainer top route must stay compact on mobile.");
  expect(conceptSource.includes('className="concept-main-description"') && conceptSource.includes("overflowWrap: \"anywhere\"") && conceptSource.includes("concept-top-route-body") && conceptSource.includes("wordBreak: \"break-word\""), "Concept explainer top copy must wrap safely on narrow screens.");
  expect(conceptSource.includes("#work-primary-tool") && conceptSource.includes("max-width: 100vw !important") && conceptSource.includes("#concept-explainer-tool .concept-main-input-panel") && conceptSource.includes("overflow-x: hidden !important") && conceptSource.includes("#concept-explainer-tool .concept-top-route-strip,\n            #concept-explainer-tool .concept-quick-start-strip") && conceptSource.includes("grid-template-columns: 1fr !important"), "Concept explainer narrow mobile layout must constrain page width and stack top controls to avoid clipping.");
  expect(conceptSource.includes("#concept-explainer-tool .concept-agent-input-grid {\n              grid-template-columns: 1fr !important") && conceptSource.includes("#concept-explainer-tool .concept-agent-input-grid > *") && conceptSource.includes("width: 100% !important") && conceptSource.includes("box-sizing: border-box !important"), "Concept explainer mobile input fields must switch to one column and avoid horizontal overflow.");
  expect(conceptSource.includes("#concept-explainer-tool .concept-freeform-brief-header,") && conceptSource.includes("#concept-explainer-tool .concept-freeform-brief-grid") && conceptSource.includes("#concept-explainer-tool .concept-freeform-brief-grid textarea") && conceptSource.includes("#concept-explainer-tool .concept-freeform-brief-header button") && conceptSource.includes("width: 100% !important"), "Concept explainer freeform brief parser must stay usable without mobile overflow.");
  expect(conceptSource.includes("#concept-explainer-tool .concept-scope-hint-strip") && conceptSource.includes("concept-scope-hint-card") && conceptSource.includes("grid-template-columns: repeat(3, minmax(0, 1fr)) !important"), "Concept explainer scope diagnostics must stay visible and compact on mobile.");
  expect(conceptSource.includes("#concept-explainer-tool .concept-narrowing-question-strip") && conceptSource.includes("concept-narrowing-question-card") && conceptSource.includes("grid-template-columns: repeat(3, minmax(0, 1fr)) !important"), "Concept explainer narrowing questions must stay visible and compact on mobile.");
  expect(conceptSource.includes('className="concept-main-input-panel"') && conceptSource.includes('padding: "0.78rem"') && !conceptSource.includes("concept-input-support-pack-details"), "Concept explainer must expose the arbitrary concept input form directly instead of hiding it in a collapsed support panel.");
  expect(conceptSource.includes('className="concept-explanation-pack"') && conceptSource.includes('background: "transparent"') && conceptSource.includes('gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))"') && conceptSource.includes("minHeight: 98"), "Concept explainer desktop explanation pack must stay as short result tiles without a long outer frame.");
  expect(conceptSource.includes('className="concept-save-actions concept-responsive-grid"') && conceptSource.includes('background: "transparent"') && conceptSource.includes('boxShadow: "none"') && !conceptSource.includes("保存这次学习产出"), "Concept explainer export actions must stay as a short action strip instead of a repeated long save card.");
  expect(conceptSource.includes("#concept-explainer-tool .concept-pack-header-copy,") && conceptSource.includes("#concept-explainer-tool .concept-pack-output") && conceptSource.includes("display: none !important"), "Concept explainer mobile explanation pack must hide repeated helper/output lines.");
  for (const retiredConceptSummaryChrome of ["输入质量检查 ·", "解释流程面板 ·", "可视化解释图 ·", "个节点</summary>", "我的理解记录 ·"]) {
    expect(!conceptSource.includes(retiredConceptSummaryChrome), `Concept explainer summaries should stay short and not expose status chrome: ${retiredConceptSummaryChrome}.`);
  }
  expect(conceptSource.includes("conceptInputQualityScore") && conceptSource.includes("{visualMode}") && conceptSource.includes("理解记录完成度：{learnerAuditScore}/4 可用"), "Concept explainer expanded panels must keep useful quality, visual-mode, and learner-record feedback.");
  const conceptInputModeSource = conceptSource.slice(conceptSource.indexOf('className="concept-input-mode-grid"'), conceptSource.indexOf('className="concept-agent-input-grid"'));
  const conceptSupportSource = conceptSource.slice(conceptSource.indexOf('className="concept-support-pack-details"'), conceptSource.indexOf('className="concept-full-explanation-details"'));
  const conceptRecordSource = conceptSource.slice(conceptSource.indexOf('className="concept-understanding-record-details"'), conceptSource.indexOf('className="concept-save-actions concept-responsive-grid"'));
  const conceptSelfAuditOutputSource = conceptSource.slice(conceptSource.indexOf("const selfAuditOutput"), conceptSource.indexOf("const lessonOutput"));
  const conceptInputQualitySource = conceptSource.slice(conceptSource.indexOf("const conceptInputQuality"), conceptSource.indexOf("const conceptAgentCards"));
  expect(!conceptInputModeSource.includes("minHeight: 104") && conceptInputModeSource.includes('padding: "0.46rem"'), "Concept explainer input mode preset buttons must not use fixed tall card heights.");
  expect(!conceptSupportSource.includes('boxShadow: "3px 5px') && !conceptSupportSource.includes("borderRadius: 18"), "Concept explainer support folds must stay light instead of thick sticky-note panels.");
  expect(conceptRecordSource.includes("minHeight: 84") && !conceptRecordSource.includes("minHeight: 112") && conceptRecordSource.includes('padding: "0.6rem"'), "Concept explainer learner record inputs must stay compact.");
  expect(conceptInputQualitySource.includes("待填写") && !conceptInputQualitySource.includes("待补充"), "Concept explainer input quality statuses must read as user input state, not unfinished site content.");
  expect(conceptRecordSource.includes("待填写") && !conceptRecordSource.includes("待补充"), "Concept explainer learner record status must read as user input state.");
  expect(conceptSelfAuditOutputSource.includes("待完善") && conceptSelfAuditOutputSource.includes("（待填写）") && !conceptSelfAuditOutputSource.includes("（未填写）") && !conceptSelfAuditOutputSource.includes('field.pass ? "可用" : "待补充"'), "Concept explainer copied self-audit record must use learner-facing input and improvement language.");
  const fullExplanationSource = conceptSource.slice(conceptSource.indexOf('className="concept-full-explanation-details"'), conceptSource.indexOf('className="concept-lesson-output-details"'));
  expect(/className="concept-full-explanation-details"[\s\S]{0,220}borderRadius: 12[\s\S]{0,120}padding: "0\.68rem"[\s\S]{0,160}boxShadow: "0 8px 18px/.test(conceptSource), "Concept explainer full explanation fold must stay visually compact.");
  expect(!conceptSource.includes('borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)"'), "Concept explainer full explanation content must not return to oversized heavy cards.");
  expect(!fullExplanationSource.includes("minHeight: 112") && !fullExplanationSource.includes("minHeight: 126") && !fullExplanationSource.includes("minHeight: 142"), "Concept explainer full explanation cards must avoid fixed tall minimum heights.");
  expect(worksSource.includes("输入任意概念或选择常用概念") && !worksSource.includes("选择样例"), "Concept explainer work card must advertise arbitrary concept input without demo-like sample wording.");
  expect(worksSource.includes('outputs: ["学习卡", "可视化流程", "即时小测"]'), "Concept explainer work card outputs must match the learner-facing agent output.");
  expect(worksSource.includes('path: ["输入概念", "看诊断边界", "生成学习卡"]'), "Concept explainer work card path must describe the learner-facing agent flow.");

  for (const text of [
    "name: concept-explainer",
    "description: Use when a learner wants to understand any concept",
    "## Role",
    "## Input",
    "## Workflow",
    "## Output Format",
    "## Quality Rules",
    "Current confusion",
    "Prioritize source boundary and current confusion",
    "Do not only give a definition",
    "Do not fabricate facts",
    "## Visual Structure Rules",
    "## Visual Mode Selection",
    "If any field is missing, ask at most two short questions",
    "Use three narrowing questions",
    "Scope: Which chapter, figure, task, or phenomenon",
    "Confusion: Which nearby concept, process, or example",
    "Output: Does the learner need a one-sentence explanation",
    "Cycle map",
    "at least 4 labeled nodes",
    "Do not draw a decorative diagram",
    "## Completion Gate",
    "A one-sentence explanation in the learner's own words",
    "A mechanism retelling in 1-4 steps",
    "One transfer example where the concept is applied to a new case",
    "One boundary statement saying what the concept cannot directly prove",
    "If source boundary is unknown, separate general explanation from source-dependent facts",
    "Practice situation",
    "Explanation package",
    "five learner-facing cards",
    "Understanding audit",
    "Add pass criteria",
    "Evidence boundary",
  ]) {
    expect(conceptSkillSource.includes(text), `Public concept explainer SKILL.md is missing required content: ${text}`);
  }
}

function verifyGeneExpressionLearnerContract() {
  const geneSource = read("src/app/components/GeneExpressionTool.tsx");
  const worksSource = read("src/app/components/Works.tsx");
  const requiredGeneFeatures = [
    { label: "process tracking panel", text: "过程追踪" },
    { label: "process focus state", text: "processFocusCards" },
    { label: "mRNA growth end card", text: "mRNA 生长端" },
    { label: "ribosome reading card", text: "核糖体读带" },
    { label: "polypeptide exit card", text: "多肽出口" },
    { label: "3 prime growth-end explanation", text: "3' 生长端贴着 RNA 聚合酶出口" },
    { label: "5 prime free-end explanation", text: "5' 自由端露出后" },
    { label: "bead-chain explanation", text: "氨基酸小圆" },
    { label: "ribosome start fraction", text: "ribosomeStartFraction" },
    { label: "ribosome readable position", text: "readProgress" },
    { label: "readable mRNA guide path", text: "readableMrnaPath" },
    { label: "ribosome cannot outrun polymerase", text: "不能越过 RNA 聚合酶" },
    { label: "mRNA nucleotide bead chain", text: "mrna-nucleotide-bead" },
    { label: "new base pulse at polymerase outlet", text: "mrna-new-base-pulse" },
    { label: "newly added base label", text: "新接入碱基" },
    { label: "coupled process guide overlay", text: "gene-coupled-process-guide" },
    { label: "readable segment guide overlay", text: "gene-readable-segment-guide" },
    { label: "five prime readable callout", text: "先露出，可被读取" },
    { label: "three prime polymerase-following callout", text: "3' 端跟随聚合酶" },
    { label: "ribosome peptide exit port", text: "ribosome-peptide-exit-port" },
    { label: "live peptide bead chain", text: "live-peptide-bead-chain" },
    { label: "peptide chain attached to exit", text: "多肽链贴着出口长出" },
    { label: "canvas legend data", text: "processLegendItems" },
    { label: "visible canvas legend", text: "gene-process-legend" },
    { label: "legend label", text: 'aria-label="画布图例"' },
    { label: "legend readable segment", text: "可读片段" },
    { label: "legend peptide exit", text: "多肽出口" },
    { label: "visible model boundary strip", text: "gene-model-boundary-strip" },
    { label: "visual column wrapper", text: "gene-visual-column" },
    { label: "canvas companion panel", text: "gene-canvas-companion" },
    { label: "canvas companion highlights", text: "canvasCompanionHighlights" },
    { label: "canvas companion title", text: "过程判读" },
    { label: "canvas companion grid", text: "gene-canvas-companion-grid" },
    { label: "polymerase outlet highlight", text: "RNA 聚合酶出口" },
    { label: "readable mRNA highlight", text: "mRNA 可读片段" },
    { label: "prokaryotic model boundary", text: "这个仿真显示原核式耦合表达" },
    { label: "eukaryotic boundary", text: "真核细胞通常先在细胞核内转录加工，再到细胞质翻译" },
    { label: "accessible process focus", text: "当前过程焦点" },
    { label: "process record output", text: "expressionProcessRecord" },
    { label: "copy process record handler", text: "copyExpressionProcessRecord" },
    { label: "visible process record card", text: "表达过程记录" },
    { label: "copy process record button", text: "复制记录" },
    { label: "experiment field data", text: "expressionExperimentFields" },
    { label: "experiment completion score", text: "expressionExperimentScore" },
    { label: "experiment record output", text: "expressionExperimentRecord" },
    { label: "copy experiment record handler", text: "copyExpressionExperimentRecord" },
    { label: "visible experiment record card", text: "变量实验记录" },
    { label: "copy experiment record button", text: "复制实验记录" },
    { label: "experiment variable field", text: "我改变的变量" },
    { label: "experiment observation field", text: "观察到的变化" },
    { label: "experiment explanation field", text: "我的解释" },
    { label: "experiment next check field", text: "下一次要验证" },
    { label: "experiment completion badge", text: "填写完成度" },
    { label: "experiment record layout", text: "gene-experiment-record-grid" },
    { label: "completion check data", text: "expressionCompletionChecks" },
    { label: "visible result check", text: "结果检查" },
    { label: "completion record section", text: "六、完成验收" },
    { label: "quiz pass threshold", text: "至少答对 3 题再复制记录" },
    { label: "transcription completion check", text: "转录启动" },
    { label: "translation product completion check", text: "翻译产物" },
    { label: "stable mobile main grid class", text: "gene-expression-main-grid" },
    { label: "mobile main grid selector", text: "#gene-expression .gene-expression-main-grid" },
    { label: "mobile canvas scales to viewport", text: "width: 100% !important" },
    { label: "compact control aside", text: "gene-control-aside" },
    { label: "compact readout panel", text: "gene-readout-panel" },
    { label: "compact readout list", text: "gene-readout-list" },
    { label: "compact rate list", text: "gene-rate-list" },
    { label: "process meter data", text: "processMeters" },
    { label: "process meter list", text: "gene-process-meter-list" },
    { label: "mRNA exposure meter", text: "mRNA 露出" },
    { label: "ribosome read meter", text: "核糖体读带" },
    { label: "peptide extension meter", text: "多肽延伸" },
    { label: "compact action row", text: "gene-action-row" },
    { label: "compact integrated molecule strip", text: "gene-integrated-strip" },
  ];
  const retiredGenePatterns = [
    { label: "teacher/classroom framing", pattern: /课堂|教师|老师|教案|授课|教学/ },
    { label: "placeholder framing", pattern: /\bdemo\b|设计想法/ },
    { label: "incorrect DNA polymerase label", pattern: /DNA 聚合酶/ },
    { label: "broken hidden-summary grid selector", pattern: /#gene-expression > div:first-child/ },
    { label: "fixed-width mobile canvas", pattern: /width:\s*720px/ },
  ];

  for (const item of requiredGeneFeatures) {
    expect(geneSource.includes(item.text), `Gene expression learner contract is missing ${item.label}: ${item.text}`);
  }

  expect(geneSource.includes('className="gene-readout-panel"') && geneSource.includes('borderRadius: 12') && geneSource.includes('gridTemplateColumns: "repeat(2, minmax(0, 1fr))"'), "Gene expression readout panel must stay as compact two-column metrics instead of a tall readout list.");
  expect(geneSource.includes('className="gene-canvas-card"') && geneSource.includes('borderRadius: 12') && !geneSource.includes('borderRadius: 28') && !geneSource.includes('6px 10px 0px rgba(94,68,42,0.09)'), "Gene expression canvas frame must stay compact instead of a heavy rounded card.");
  expect(geneSource.includes('className="gene-expression-main-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.45fr) minmax(286px, 0.7fr)", gap: "0.68rem", alignItems: "start"') && geneSource.includes('className="gene-visual-column"') && geneSource.includes('alignContent: "start"'), "Gene expression visual column must not stretch the canvas card into a blank left column.");
  expect(geneSource.includes('className="gene-canvas-companion-grid"') && geneSource.includes('gridTemplateColumns: "repeat(4, minmax(0, 1fr))"') && geneSource.includes("#gene-expression .gene-canvas-companion-grid") && geneSource.includes("grid-template-columns: 1fr !important"), "Gene expression canvas companion must fill the area below the canvas and stack on mobile.");
  expect(geneSource.includes("#gene-expression .gene-model-boundary-strip") && geneSource.includes("grid-template-columns: 1fr !important"), "Gene expression visible model boundary must stay compact on mobile.");
  expect(geneSource.includes('className="gene-readout-row"') && geneSource.includes('textOverflow: "ellipsis"') && geneSource.includes('className="gene-rate-list"') && geneSource.includes('marginTop: "0.62rem"'), "Gene expression readout rows and rate bars must stay compact.");
  expect(geneSource.includes('className="gene-compact-details gene-quiz-details"') && !geneSource.includes('borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)"'), "Gene expression quiz must stay as a compact collapsed panel instead of a long default card.");
  for (const requiredShortGeneSummary of [">过程追踪</summary>", ">结果检查</summary>", ">变量实验记录</summary>", ">翻译放大镜</summary>", ">即时小测</summary>", ">操作任务</summary>"]) {
    expect(geneSource.includes(requiredShortGeneSummary), `Gene expression compact panels must use short summaries: ${requiredShortGeneSummary}`);
  }
  for (const retiredGeneSummaryStatus of ["过程追踪 ·", "结果检查 ·", "变量实验记录 ·", "翻译放大镜 ·", "即时小测 ·", "操作任务 ·"]) {
    expect(!geneSource.includes(retiredGeneSummaryStatus), `Gene expression summaries must not expose status chrome: ${retiredGeneSummaryStatus}`);
  }
  expect(geneSource.includes("当前：{activeProcessFocus}") && geneSource.includes("{expressionCompletionChecks.filter((item) => item.done).length}/{expressionCompletionChecks.length}") && geneSource.includes("填写完成度 {expressionExperimentScore}/{expressionExperimentFields.length}") && geneSource.includes("focusedCodon?.rna ?? \"---\"") && geneSource.includes("{quizCorrectCount}/{geneQuizItems.length}") && geneSource.includes("taskStatuses.map((item, index)"), "Gene expression compact summaries must keep current focus, completion counts, codon, quiz, and task status inside expanded content.");
  expect(geneSource.includes("const transcriptBases = codons.flatMap") && geneSource.includes("pathProgress = 0.08 + baseIndex * 0.066") && geneSource.includes("pointOnPolyline(nascentPath, pathProgress)"), "Gene expression mRNA nucleotides must follow the curved nascent mRNA path attached to RNA polymerase.");
  expect(geneSource.includes('className="mrna-new-base-pulse"') && geneSource.includes("growthEnd.x - 18") && geneSource.includes("polymerase.progress > 0.16"), "Gene expression must mark newly added bases at the moving RNA polymerase outlet.");
  expect(geneSource.includes("readableSpan = Math.max(0, readableLimit - ribosomeStartFraction)") && geneSource.includes("readProgress = hasReadableSegment") && geneSource.includes("ribosomeStartFraction + readableSpan * localProgress"), "Gene expression ribosomes must move only along the exposed transcribed mRNA segment behind RNA polymerase.");
  expect(geneSource.includes("const tailLength = 78 + boundedProgress * 335"), "Gene expression nascent mRNA must keep a visible curved trailing segment behind RNA polymerase.");
  expect(!geneSource.includes('d="M8 -8 C18 -15 27 -18 36 -16"') && !geneSource.includes('d="M17 7 C29 12 37 17 43 19"'), "Gene expression ribosome body must not show a separate green chain inside the ribosome; peptide beads should leave through the exit port.");
  expect(geneSource.includes('className="live-peptide-bead-chain"') && geneSource.includes("ribosomePeptideExitPoint") && geneSource.includes("peptideBeadPoint(exit"), "Gene expression peptide product must stay as beads connected from the ribosome exit.");
  expect(!/TF 调低|RNA 聚合酶打开|蛋白链/.test(worksSource) && worksSource.includes("多肽链"), "Gene expression work-card copy must match the drag/drop molecule model and use polypeptide wording.");
  const geneExperimentRecordSource = geneSource.slice(geneSource.indexOf("const expressionExperimentRecord"), geneSource.indexOf("const expressionProcessRecord"));
  expect(geneExperimentRecordSource.includes("待填写") && !geneExperimentRecordSource.includes("未填写"), "Gene expression copied experiment record must use learner input-state wording for empty fields.");

  for (const item of retiredGenePatterns) {
    expect(!item.pattern.test(geneSource), `Gene expression tool must avoid retired or incorrect copy: ${item.label}`);
  }

  expect(geneSource.includes("#gene-expression .gene-readout-list") && geneSource.includes("grid-template-columns: 1fr !important") && geneSource.includes("#gene-expression .gene-readout-row") && geneSource.includes("grid-template-columns: 1fr !important") && geneSource.includes("white-space: normal !important"), "Gene expression mobile readouts must stack labels and values so long codon text is not clipped.");
  expect(geneSource.includes("#gene-expression .gene-action-row") && geneSource.includes("grid-template-columns: repeat(3, minmax(0, 1fr)) !important"), "Gene expression mobile actions must stay as a short three-button row.");
  expect(worksSource.includes('outputs: ["表达读数", "过程记录", "即时小测"]'), "Gene expression work card outputs must include the copyable process record.");
  expect(worksSource.includes('path: ["调节分子", "观察过程", "复制记录"]'), "Gene expression work card path must describe the learner action flow.");
}

function verifyPlantEvolutionLearnerContract() {
  const workDetailSource = read("src/app/components/WorkDetailPage.tsx");
  const worksSource = read("src/app/components/Works.tsx");
  const plantMatch = workDetailSource.match(/function PlantEvolutionContent\(\) \{([\s\S]*?)\nfunction ConceptExplainerContent\(\)/);

  expect(Boolean(plantMatch), "WorkDetailPage must include PlantEvolutionContent before ConceptExplainerContent.");

  if (!plantMatch) return;

  const plantSource = plantMatch[1];
  const requiredPlantFeatures = [
    { label: "learner task field", text: "learnerTask" },
    { label: "self-check lens", text: '{ key: "practice", label: "自测" }' },
    { label: "self-check question label", text: "自测问题" },
    { label: "extension practice label", text: "延伸练习" },
    { label: "copyable learner study card", text: "植物演化学习卡" },
    { label: "stage quest cards", text: "stageQuestCards" },
    { label: "stage quest heading", text: "阶段小关卡" },
    { label: "structure quest", text: "结构定位" },
    { label: "evidence quest", text: "证据判断" },
    { label: "transfer quest", text: "迁移表达" },
    { label: "active quest in study card", text: "6. 当前小关卡" },
    { label: "comparison stage data", text: "comparisonStages" },
    { label: "comparison output", text: "stageComparisonOutput" },
    { label: "copy comparison handler", text: "copyStageComparison" },
    { label: "visible comparison card", text: "阶段比较记录" },
    { label: "copy comparison button", text: "复制比较记录" },
    { label: "comparison section in study card", text: "7. 阶段比较" },
    { label: "evidence type field", text: "evidenceTypes" },
    { label: "claim boundary field", text: "claimBoundary" },
    { label: "evidence audit cards", text: "evidenceAuditCards" },
    { label: "evidence audit output", text: "evidenceAuditOutput" },
    { label: "copy evidence audit handler", text: "copyEvidenceAudit" },
    { label: "visible evidence audit card", text: "证据判读记录" },
    { label: "copy evidence audit button", text: "复制证据判读" },
    { label: "claim boundary visible label", text: "判读边界" },
    { label: "evidence audit section in study card", text: "9. 证据判读" },
    { label: "completion checks data", text: "plantCompletionChecks" },
    { label: "visible stage check", text: "阶段检查" },
    { label: "completion section in study card", text: "10. 完成验收" },
    { label: "completion pass criteria", text: "通过标准：${item.pass}" },
    { label: "completion location task", text: "阶段定位" },
    { label: "completion evidence boundary task", text: "证据边界" },
    { label: "stage relation strip", text: "plant-stage-relation-strip" },
    { label: "stage relation pressure", text: "压力" },
    { label: "stage relation innovation", text: "创新" },
    { label: "stage relation boundary", text: "边界" },
    { label: "stage causal bridge data", text: "plantCausalBridgeCards" },
    { label: "stage causal bridge strip", text: "plant-causal-bridge-strip" },
    { label: "stage causal bridge label", text: "阶段前因后果" },
    { label: "previous limitation label", text: "上一限制" },
    { label: "current solution label", text: "当前解法" },
    { label: "remaining problem label", text: "留下问题" },
    { label: "causal chain in study card", text: "8. 阶段因果链" },
    { label: "compact stage picker grid", text: "plant-stage-picker-grid" },
    { label: "compact stage picker card", text: "plant-stage-picker-card" },
    { label: "mobile active stage summary", text: "plant-mobile-stage-summary" },
    { label: "mobile active stage focus card", text: "plant-mobile-stage-focus-card" },
    { label: "mobile active stage focus icon", text: "renderPlantStageIcon(activeChapterIndex, true)" },
    { label: "mobile active stage evidence state", text: "证据状态：{activeChapter.certainty}" },
  ];

  const retiredPlantPatterns = [
    { label: "teacher task field", pattern: /teacherMove/ },
    { label: "classroom lens key", pattern: /classroom/ },
    { label: "teacher follow-up label", pattern: /教师追问/ },
    { label: "classroom question label", pattern: /课堂提问/ },
  ];

  for (const item of requiredPlantFeatures) {
    expect(plantSource.includes(item.text), `Plant evolution learner contract is missing ${item.label}: ${item.text}`);
  }

  for (const item of retiredPlantPatterns) {
    expect(!item.pattern.test(plantSource), `Plant evolution page must remain learner-facing and avoid retired copy: ${item.label}`);
  }

  expect(plantSource.includes("#plant-evolution-explorer .plant-stage-picker-grid") && plantSource.includes("grid-template-columns: repeat(2, minmax(0, 1fr)) !important"), "Plant evolution mobile stage picker must use two columns to avoid clipped stage cards.");
  expect(plantSource.includes('overflowX: "hidden"') && plantSource.includes("#plant-evolution-explorer .plant-support-pack-panel") && plantSource.includes("box-sizing: border-box !important") && plantSource.includes("min-width: 0 !important"), "Plant evolution mobile layout must keep timeline, picker, details and support records inside the viewport.");
  expect(plantSource.includes("#plant-evolution-explorer .plant-causal-bridge-strip") && plantSource.includes("grid-template-columns: 1fr !important"), "Plant evolution causal bridge must stack on mobile to keep causal text readable.");
  expect(plantSource.includes('gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))"') && plantSource.includes('className="plant-stage-picker-innovation"') && plantSource.includes('className="plant-stage-picker-refs"') && plantSource.includes('style={{ display: "none"') && !plantSource.includes('minHeight: 76'), "Plant evolution desktop stage picker must stay as short timeline buttons without fixed-height cards, long note text, or reference chips.");
  expect(plantSource.includes("#plant-evolution-explorer .plant-stage-picker-card > div:nth-child(3)") && plantSource.includes("display: none !important"), "Plant evolution mobile stage buttons must not expose long innovation text in the picker.");
  expect(plantSource.includes("#plant-evolution-explorer .plant-mobile-stage-summary") && plantSource.includes("display: grid !important") && plantSource.includes("第 {activeChapterIndex + 1}/6 阶段") && plantSource.includes("#plant-evolution-explorer .plant-mobile-stage-focus-card") && plantSource.includes("display: flex !important") && plantSource.includes("height: 238px !important"), "Plant evolution mobile first screen must show active stage context and a focused active-stage visual before the reduced-height illustration.");
  expect(plantSource.includes('className="plant-timeline-figure"') && plantSource.includes('borderRadius: 12') && plantSource.includes('padding: "0.72rem"'), "Plant evolution illustration frame must stay compact instead of a tall sticky-note frame.");
  expect(plantSource.includes('className="plant-stage-detail-card"') && plantSource.includes('padding: "0.82rem"') && !plantSource.includes('className="plant-stage-detail-card" style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem"'), "Plant evolution active stage details must stay as a compact content panel.");
  expect(worksSource.includes("演化时间轴串联关键创新、证据、自测问题、作答提示和延伸练习。"), "Plant evolution work card must describe the learner-facing self-study flow.");
  expect(worksSource.includes('outputs: ["学习卡", "阶段比较", "证据判读"]'), "Plant evolution work card outputs must be learner-facing.");
  expect(worksSource.includes('path: ["选择阶段", "判读证据", "完成练习"]'), "Plant evolution work card path must describe a learner action flow.");
}

function verifyCrisprLearnerScenarios() {
  const workDetailSource = read("src/app/components/WorkDetailPage.tsx");
  const worksSource = read("src/app/components/Works.tsx");
  const crisprMatch = workDetailSource.match(/function CrisprContent\(\) \{([\s\S]*?)\nfunction RichWorkContent\(/);

  expect(Boolean(crisprMatch), "WorkDetailPage must include CrisprContent before RichWorkContent.");

  if (!crisprMatch) return;

  const crisprSource = crisprMatch[1];
  const requiredCrisprFeatures = [
    { label: "scenario state", text: "activeScenarioIndex" },
    { label: "practice scenario list", text: "practiceScenarios" },
    { label: "scenario chooser", text: "chooseCrisprScenario" },
    { label: "visible scenario section", text: "练习场景" },
    { label: "high-match knockout scenario", text: "高匹配敲除" },
    { label: "mismatch comparison scenario", text: "错配比较" },
    { label: "low-match failure scenario", text: "低匹配失败" },
    { label: "report scenario field", text: "练习场景：" },
    { label: "report learning goal field", text: "学习目标：" },
    { label: "report check field", text: "检查重点：" },
    { label: "decision rows", text: "decisionRows" },
    { label: "go/no-go criteria", text: "goNoGoCriteria" },
    { label: "decision card output", text: "decisionCardOutput" },
    { label: "copy decision card handler", text: "copyDecisionCard" },
    { label: "visible decision card", text: "编辑决策卡" },
    { label: "copy decision card button", text: "复制决策卡" },
    { label: "risk audit items", text: "riskAuditItems" },
    { label: "risk audit output", text: "riskAuditOutput" },
    { label: "copy risk audit handler", text: "copyRiskAudit" },
    { label: "visible risk audit card", text: "风险核查记录" },
    { label: "copy risk audit button", text: "复制风险核查" },
    { label: "off-target audit copy", text: "guide 错配与脱靶" },
    { label: "risk audit report section", text: "6. 风险核查" },
    { label: "visible CRISPR start path", text: "CRISPR 判读路径" },
    { label: "CRISPR start path data", text: "crisprStartPath" },
    { label: "CRISPR start path class", text: "crispr-start-path-strip" },
    { label: "CRISPR start path cut step", text: "看剪切" },
    { label: "CRISPR start path risk step", text: "核风险" },
    { label: "visible live decision panel", text: "crispr-live-decision-panel" },
    { label: "visible live decision title", text: "当前判读结果" },
    { label: "live decision grid", text: "crispr-live-decision-grid" },
    { label: "live decision card", text: "crispr-live-decision-card" },
    { label: "canvas result strip", text: "crispr-canvas-result-strip" },
    { label: "canvas result strip label", text: "当前编辑结果摘要" },
    { label: "canvas result strip PAM", text: "PAM 入口" },
    { label: "canvas result strip repair", text: "修复判读" },
    { label: "live go no go copy", text: "不用展开说明，也能先得到本轮 go/no-go、证据读数和风险边界。" },
    { label: "visible live decision copy action", text: 'copiedDecisionCard ? "已复制" : "复制决策卡"' },
    { label: "visible live risk audit copy action", text: 'copiedRiskAudit ? "已复制" : "复制风险核查"' },
    { label: "completion check data", text: "crisprCompletionChecks" },
    { label: "visible result check", text: "结果检查" },
    { label: "completion report section", text: "7. 完成验收" },
    { label: "quiz completion state", text: "小测待完成" },
    { label: "quiz passed state", text: "小测已通过" },
    { label: "completion report copy", text: "不能把模拟产物写成真实结果" },
    { label: "learner decision draft", text: "decisionDraft" },
    { label: "learner evidence draft", text: "evidenceDraft" },
    { label: "learner risk boundary draft", text: "riskBoundaryDraft" },
    { label: "learner next verification draft", text: "nextVerificationDraft" },
    { label: "learner record fields", text: "crisprLearnerRecordFields" },
    { label: "learner record score", text: "crisprLearnerRecordScore" },
    { label: "visible learner record panel", text: "我的判读记录" },
    { label: "learner record grid", text: "crispr-learner-record-grid" },
    { label: "learner record completion copy", text: "完成度：${crisprLearnerRecordScore}/4" },
    { label: "learner record report section", text: "11. 我的判读记录" },
    { label: "compact mobile control aside", text: "crispr-control-aside" },
    { label: "compact flow step notes", text: "crispr-flow-step-note" },
    { label: "compact guide decision", text: "crispr-guide-decision" },
    { label: "compact guide target note", text: "crispr-guide-target-note" },
    { label: "compact guide readouts", text: "crispr-guide-readouts" },
  ];

  for (const item of requiredCrisprFeatures) {
    expect(crisprSource.includes(item.text), `CRISPR simulator learner scenario contract is missing ${item.label}: ${item.text}`);
  }

  expect(Array.from(crisprSource.matchAll(/\bgoal:\s*"/g)).length >= 3, "CRISPR simulator should expose at least three learner scenario goals.");
  expect(crisprSource.includes('className="crispr-flow-panel"') && crisprSource.includes('gridTemplateColumns: "repeat(3, minmax(0, 1fr))"') && crisprSource.includes('minHeight: 42'), "CRISPR desktop flow control must stay as compact three-step buttons.");
  expect(crisprSource.includes('className="crispr-canvas-panel"') && crisprSource.includes('borderRadius: 12') && !crisprSource.includes('borderRadius: 22, overflow: "hidden", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)"'), "CRISPR canvas frame must stay compact instead of a heavy long card.");
  expect(crisprSource.includes('className="crispr-canvas-result-strip"') && crisprSource.includes('gridTemplateColumns: "repeat(4, minmax(0, 1fr))"') && crisprSource.includes("#crispr-simulator .crispr-canvas-result-strip") && crisprSource.includes("grid-template-columns: 1fr !important"), "CRISPR canvas must fill the lower panel area with a responsive edit-result strip instead of blank space.");
  expect(crisprSource.includes("#crispr-simulator .crispr-start-path-strip") && crisprSource.includes('gridTemplateColumns: "repeat(4, minmax(0, 1fr))"') && crisprSource.includes("grid-template-columns: repeat(2, minmax(0, 1fr)) !important"), "CRISPR visible start path must stay compact across desktop and mobile.");
  expect(crisprSource.includes('aria-labelledby="crispr-live-decision-title"') && crisprSource.includes('className="crispr-live-decision-grid"') && crisprSource.includes('gridTemplateColumns: "repeat(4, minmax(0, 1fr))"') && crisprSource.includes("#crispr-simulator .crispr-live-decision-grid") && crisprSource.includes("grid-template-columns: repeat(2, minmax(0, 1fr)) !important"), "CRISPR live decision result must be directly visible and compact across desktop and mobile.");
  expect(crisprSource.includes('<details className="crispr-quality-panel crispr-compact-details"') && crisprSource.includes(">修复结果</summary>") && crisprSource.includes("{effectiveRepair.title}：") && !crisprSource.includes('className="crispr-quality-panel" style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.1rem"'), "CRISPR repair result selector must stay folded and compact with the current result inside the panel, not in the summary.");
  for (const retiredCrisprSummaryStatus of ["练习场景 ·", "结果检查 ·", "我的判读记录 ·", "修复结果 ·", "判读练习 ·"]) {
    expect(!crisprSource.includes(retiredCrisprSummaryStatus), `CRISPR detail summaries must not expose status chrome: ${retiredCrisprSummaryStatus}`);
  }
  expect(crisprSource.includes('当前：${activeScenario.title}') && crisprSource.includes("小测已通过") && crisprSource.includes("小测待完成") && crisprSource.includes("填写完成度 {crisprLearnerRecordScore}/4"), "CRISPR compact summaries must keep active state feedback inside expanded panel content.");
  expect(/className="crispr-intro-sequence-panel"[\s\S]{0,220}borderRadius: 12[\s\S]{0,120}padding: "0\.78rem"[\s\S]{0,160}boxShadow: "0 8px 18px/.test(crisprSource), "CRISPR intro sequence panel must stay compact.");
  expect(/className="crispr-intro-boundary-panel"[\s\S]{0,220}borderRadius: 12[\s\S]{0,120}padding: "0\.78rem"[\s\S]{0,160}boxShadow: "0 8px 18px/.test(crisprSource), "CRISPR intro boundary panel must stay compact.");
  expect(/className="crispr-quiz-list-panel"[\s\S]{0,220}borderRadius: 12[\s\S]{0,120}padding: "0\.78rem"[\s\S]{0,160}boxShadow: "0 8px 18px/.test(crisprSource), "CRISPR quiz list panel must stay compact.");
  expect(/className="crispr-quiz-answer-panel"[\s\S]{0,220}borderRadius: 12[\s\S]{0,120}padding: "0\.78rem"[\s\S]{0,160}boxShadow: "0 8px 18px/.test(crisprSource), "CRISPR quiz answer panel must stay compact.");
  const crisprIntroSource = crisprSource.slice(crisprSource.indexOf('className="crispr-intro-details"'), crisprSource.indexOf("crispr-practice-panel"));
  const crisprQuizSource = crisprSource.slice(crisprSource.indexOf('className="crispr-quiz-details"'), crisprSource.indexOf("crispr-report-details"));
  expect(!crisprIntroSource.includes("minHeight: 118"), "CRISPR intro step cards must not use fixed tall minimum heights.");
  expect(!crisprIntroSource.includes("borderRadius: 22") && !crisprIntroSource.includes('padding: "1.1rem"') && !crisprIntroSource.includes('boxShadow: "4px 7px'), "CRISPR intro panels must not return to heavy cards.");
  expect(!crisprQuizSource.includes("borderRadius: 22") && !crisprQuizSource.includes('padding: "1.1rem"') && !crisprQuizSource.includes('boxShadow: "4px 7px'), "CRISPR quiz panels must not return to heavy cards.");
  const crisprSupportDetailsSource = crisprSource.slice(crisprSource.indexOf('className="crispr-support-pack-details"'), crisprSource.indexOf("</details>\n      </section>"));
  expect(!crisprSupportDetailsSource.includes('boxShadow: "4px 7px') && !crisprSupportDetailsSource.includes("borderRadius: 22") && !crisprSupportDetailsSource.includes("minHeight: 230"), "CRISPR support folds must not use long sticky-note panels.");
  const crisprResultSource = crisprSource.slice(crisprSource.indexOf('className="crispr-result-check-panel"'), crisprSource.indexOf('className="crispr-decision-panel'));
  const crisprDecisionSource = crisprSource.slice(crisprSource.indexOf('className="crispr-decision-panel'), crisprSource.indexOf('className="crispr-risk-panel'));
  const crisprRiskSource = crisprSource.slice(crisprSource.indexOf('className="crispr-risk-panel'), crisprSource.indexOf('className="crispr-learner-panel'));
  const crisprLearnerSource = crisprSource.slice(crisprSource.indexOf('className="crispr-learner-panel'), crisprSource.indexOf('className="crispr-quality-panel'));
  expect(!crisprResultSource.includes("minHeight: 132") && !crisprDecisionSource.includes("minHeight: 126") && !crisprRiskSource.includes("minHeight: 132"), "CRISPR result, decision, and risk cards must not use fixed tall minimum heights.");
  expect(!crisprResultSource.includes("borderRadius: 16") && !crisprDecisionSource.includes("borderRadius: 16") && !crisprRiskSource.includes("borderRadius: 16"), "CRISPR compact learner cards must not return to oversized rounded panels.");
  expect(crisprLearnerSource.includes("minHeight: 84") && !crisprLearnerSource.includes("minHeight: 106"), "CRISPR learner textareas must stay compact.");
  expect(crisprSource.includes('aria-label={`${item.label}：${item.text}`}') && crisprSource.includes('className="crispr-flow-step-note"') && crisprSource.includes('style={{ display: "none"'), "CRISPR flow step explanatory notes must stay hidden visually while remaining available to assistive labels.");
  expect(crisprSource.includes('className="crispr-guide-panel"') && crisprSource.includes('className="crispr-guide-next-action"') && crisprSource.includes('className="crispr-guide-target-note"') && crisprSource.includes('className="crispr-guide-note"'), "CRISPR guide panel must keep stable compact sub-sections.");
  expect(crisprSource.includes('aria-label={`${guide.name}：${guide.note}`}') && crisprSource.includes('className="crispr-guide-target-note" style={{ display: "none"') && crisprSource.includes('className="crispr-guide-note" style={{ display: "none"'), "CRISPR guide panel must hide long target notes visually while preserving them in labels.");
  expect(crisprSource.includes("#crispr-simulator .crispr-flow-step-note,") && crisprSource.includes("#crispr-simulator .crispr-guide-note") && crisprSource.includes("display: none !important"), "CRISPR mobile controls must hide long explanatory notes instead of stacking a tall control column.");
  expect(worksSource.includes("在概念模型里调整 guide RNA、Cas 蛋白和修复结果"), "CRISPR work card must present the tool as a concept model, not a wet-lab action.");
  expect(worksSource.includes("查看 PAM、匹配评分、风险核查和模拟报告。"), "CRISPR work card must describe risk audit output.");
  expect(worksSource.includes('action: "运行模拟"') && !worksSource.includes('action: "运行编辑"'), "CRISPR work card action must describe simulation instead of real editing.");
  expect(worksSource.includes('outputs: ["guide 判定", "风险核查", "模拟报告"]'), "CRISPR work card outputs must stay aligned with simulator report.");
  expect(worksSource.includes('path: ["找 PAM", "判 guide", "核查风险"]'), "CRISPR work card path must describe a learner action flow.");
}

function verifyLearnerFacingArticleCopy() {
  const appSource = read("src/app/App.tsx");
  const staticIndexSource = read("scripts/generate-static-index.mjs");
  const contentRoutesSource = read("scripts/content-routes.mjs");
  const articleDetailSource = read("src/app/components/ArticleDetailPage.tsx");
  const articleLibrarySource = read("src/app/components/ArticleLibraryPage.tsx");
  const notesSource = read("src/app/components/Notes.tsx");
  const researchSource = read("src/app/components/ResearchEssays.tsx");
  const learnerArticleSources = [
    "src/app/App.tsx",
    "src/app/components/ArticleLibraryPage.tsx",
    "src/app/components/ArticleDetailPage.tsx",
    "src/app/components/Footer.tsx",
    "src/app/components/Hero.tsx",
    "src/app/components/Nav.tsx",
    "src/app/components/Notes.tsx",
    "src/app/components/ResearchEssays.tsx",
    "src/app/siteMetadata.ts",
    "scripts/generate-static-index.mjs",
    "scripts/site-metadata.mjs",
  ].map((relativePath) => [relativePath, read(relativePath)]);

  const combinedSource = learnerArticleSources.map(([relativePath, source]) => `\n/* ${relativePath} */\n${source}`).join("\n");
  const requiredLearnerCopy = [
    "用 AI 做学习材料质检",
    "aiMaterialAuditPrompts",
    "aiMaterialAuditPromptText",
    "copyAiMaterialAuditPrompts",
    "AI 质检流程卡",
    "复制质检流程",
    "目标对齐",
    "误解扫描",
    "证据边界",
    "练习有效性",
    "从植物基因组读懂一条证据链",
    "真实科研如何变成你能进入的问题",
    "plant-genome-evidence-chain",
    "science-to-learning-question",
    "学习阶段：当前基础、学科、章节、已学过什么",
    "预习诊断、概念检查或复习巩固",
    "平台速用卡",
    "进入 scifusion.top",
    "selectedPlatformPlanIndex",
    "activePlatformPlan",
    "activePlatformPlanText",
    "选择 SciFusion 使用场景",
    "当前方案：",
    "生成后先查这 3 项",
    "【SciFusion 当前照填方案】",
    "审核清单",
    "少量生成后逐题审核",
    "platformQuestionAuditRubric",
    "platformWrongReasonTags",
    "生成后逐题验收",
    "题目验收量规",
    "错因标签",
    "概念混淆",
    "用途：预习诊断",
    "用途：概念检查",
    "用途：复习巩固",
    "照填配置",
    "平台照填配置",
    "platformPasteConfigText",
    "platformReviewText",
    "copyPlatformPasteConfig",
    "copyPlatformReviewRecord",
    "平台照填文本",
    "复制照填配置",
    "测后复盘表",
    "复制复盘表",
    "测后复盘记录",
    "审核重点",
    "题型：选择题 + 图表题 + 简答题",
    "文章",
    "学习方法、科研证据、AI 创作和科研转译文章",
    "先做这个",
    "读完填写",
    "复制已填写记录",
    "复制学习记录",
  ];
  const retiredLearnerArticlePatterns = [
    { label: "old AI course title", pattern: /AI 可以参与课程开发/ },
    { label: "old plant classroom title", pattern: /从植物基因组到高中生物课堂/ },
    { label: "old classroom route slugs", pattern: /plant-genome-to-classroom|science-to-classroom-question/ },
    { label: "note-and-essay directory copy", pattern: /笔记与科研随笔/ },
    { label: "generic reading navigation copy", pattern: /阅读全文|阅读笔记|回到笔记|最近在想的事|文章目录/ },
    { label: "research essay navigation copy", pattern: /科研随笔|创作笔记/ },
    { label: "learning note positioning", pattern: /学习笔记|研究笔记/ },
    { label: "classroom framing", pattern: /课堂|教师|老师|教案|授课|教学/ },
    { label: "course design framing", pattern: /课程开发|课程设计|课程转化/ },
    { label: "assessment publishing framing", pattern: /审核投放|投放复盘|投放给|发布或导出方式/ },
    { label: "old misspelled SciFusion domain", pattern: new RegExp(`sci${"fuion"}\\.top|Sci${"Fuion"}`) },
    { label: "teacher-style learner profile field", pattern: /学习对象：/ },
    { label: "student-as-third-person framing", pattern: /学生基础|学生任务|学生能|学生作品|学生可以/ },
    { label: "learner-as-third-person framing", pattern: /学习者需要|学习者能|学习者能够|学习者和/ },
  ];

  for (const text of requiredLearnerCopy) {
    expect(combinedSource.includes(text), `Learner-facing article copy should include: ${text}`);
  }

  expect(combinedSource.includes("对 AI 说：${item.prompt}") && !combinedSource.includes("AI 质检提示词包") && !combinedSource.includes("复制质检提示词"), "AI material audit article must present the reusable aid as a learner-facing quality-check workflow, not a prompt pack.");

  for (const [relativePath, source] of learnerArticleSources) {
    for (const item of retiredLearnerArticlePatterns) {
      expect(!item.pattern.test(source), `${relativePath} contains retired teacher/classroom-facing article copy: ${item.label}`);
    }
  }

  expect(articleDetailSource.includes("const articleQuickStart"), "Article detail pages must derive a first learner action.");
  expect(articleDetailSource.includes("const articleEvidenceItems"), "Article detail pages must derive concrete reading completion evidence.");
  expect(articleDetailSource.includes("const articleCompletionChecks"), "Article detail pages must derive completion checks.");
  expect(articleDetailSource.includes("const articleRecordFields"), "Article detail pages must provide learner-filled record fields.");
  expect(articleDetailSource.includes("const filledRecord"), "Article detail pages must merge filled record values into copied learning records.");
  expect(articleDetailSource.includes("const articleRecordQuality"), "Article detail pages must judge learner-filled record quality.");
  expect(articleDetailSource.includes("const articleRecordScore"), "Article detail pages must expose learner record completion scores.");
  expect(articleDetailSource.includes("填写完成度：${articleRecordScore}/4"), "Article learning records must include learner record completion scores.");
  expect(articleDetailSource.includes("填写质量"), "Article learning records must include learner record quality checks.");
  expect(!articleDetailSource.includes("完成验收卡"), "Article detail pages must not reintroduce a second completion card.");
  expect(articleDetailSource.includes("三、我的填写记录"), "Article learning records must include learner-filled notes.");
  expect(articleDetailSource.includes("七、完成验收"), "Article learning records must include completion checks.");
  expect(articleDetailSource.includes("const articlePracticePlan"), "Article detail pages must derive a short execution plan.");
  expect(articleDetailSource.includes("const primaryPracticeLabel") && articleDetailSource.includes("article-above-fold-grid") && articleDetailSource.includes("article-execution-panel") && articleDetailSource.includes("本篇怎么完成") && articleDetailSource.includes("30 分钟节奏"), "Article detail pages must surface the execution path in the first viewport instead of hiding all practice depth below the body.");
  expect(articleDetailSource.includes('<details open className="article-practice-pack-details article-compact-tool-details"'), "Article practice and record tools must be visible by default as a real content surface, not hidden behind a collapsed shell.");
  expect(articleDetailSource.includes('const backHash = "#works";') && articleDetailSource.includes('const backText = "回到内容";'), "Article detail pages must return to the real homepage content directory.");
  for (const retiredArticleBackTarget of ['"#notes"', "回到方法库", "回到证据库"]) {
    expect(!articleDetailSource.includes(retiredArticleBackTarget), `Article detail back navigation should not target retired split article anchors: ${retiredArticleBackTarget}.`);
  }
  for (const retiredArticlePairedWorkCopy of ["pairedWorkSlugsByArticleSlug", "const pairedWorks", "八、读完接着做", "入口：${getWorkToolHref(work.href)}", "work.starter", "work.success", "aria-label={`打开配套模块：${work.title}`", "文章解决方法和证据，配套模块负责把这一步变成可操作产出。", "全部学习模块", "article-paired-work-step", "article-paired-work-check", "minHeight: 166", "完成标准：{work.success}"]) {
    expect(!articleDetailSource.includes(retiredArticlePairedWorkCopy), `Article detail pages should not reintroduce paired module next-action blocks: ${retiredArticlePairedWorkCopy}.`);
  }
  expect(articleDetailSource.includes("const learningRecordText"), "Article detail pages must include a copyable learning record.");
  expect(articleDetailSource.includes("copyLearningRecord"), "Article detail pages must provide a learning record copy action.");
  expect(articleDetailSource.includes("record-question-input"), "Article detail pages must expose a learner question input.");
  expect(articleDetailSource.includes("复制学习记录"), "Article detail pages must expose a learning record copy button.");
  expect(!articleDetailSource.includes("读完后至少留下一个可检查的学习记录"), "Article detail pages must avoid repeated learner-output framing blocks.");
  expect(articleDetailSource.includes("const platformUsePlansText"), "Platform article summaries must include copyable fill-in assessment configurations.");
  expect(articleDetailSource.includes("actionSteps[0]"), "Article quick start must use the first concrete article action.");
  expect(articleDetailSource.includes("checklist[0]"), "Article quick start must expose the first completion check.");
  expect(articleDetailSource.includes("pitfalls[0]"), "Article quick start must expose the first pitfall to avoid.");
  for (const retiredArticleNavCardCopy of ["navArticles", "previousArticle", "nextArticle", "articleIndex", 'aria-label="文章前后导航"', 'aria-label={`${item.label}文章：${item.article.title}`', "article-nav-card", "const itemAction = item.article.actionSteps[0]", "const itemCheck = item.article.checklist[0]", "const itemOutput = item.article.starterTemplate[0]", "article-nav-card-check", "article-nav-card-output"]) {
    expect(!articleDetailSource.includes(retiredArticleNavCardCopy), `Article detail pages should not reintroduce previous/next article footer navigation: ${retiredArticleNavCardCopy}.`);
  }
  for (const retiredArticleFooterChrome of ["IconLeafSmall", "← {backText}", 'marginTop: "1.5rem",\n                color: "var(--cherry-forest)"']) {
    expect(!articleDetailSource.includes(retiredArticleFooterChrome), `Article detail footer should not reintroduce duplicate return links or decoration: ${retiredArticleFooterChrome}.`);
  }
  expect(appSource.includes("teaches: [article.actionSteps[0], article.checklist[0], article.starterTemplate[0]]"), "Runtime article list JSON-LD must include first action, completion check, and learner output.");
  expect(appSource.includes("teaches: [note?.actionSteps[0] ?? essay?.actionSteps[0], note?.checklist[0] ?? essay?.checklist[0], note?.starterTemplate[0] ?? essay?.starterTemplate[0]]"), "Runtime article detail JSON-LD must include first action, completion check, and learner output.");
  expect(appSource.includes("const articleFirstAction = note?.actionSteps[0] ?? essay?.actionSteps[0] ?? null"), "Runtime article metadata must derive the first action step.");
  expect(appSource.includes("const articleFirstCheck = note?.checklist[0] ?? essay?.checklist[0] ?? null"), "Runtime article metadata must derive the first completion check.");
  expect(appSource.includes("const articleActionDescription = (note || essay) && articleFirstAction && articleFirstCheck"), "Runtime article metadata must build an actionable article description.");
  expect(appSource.includes("先做这个：${articleFirstAction}。完成后检查：${articleFirstCheck}"), "Runtime article meta descriptions must include first action and completion check.");
  expect(appSource.includes("const description = buildMetaDescription(baseDescription, workActionDescription ?? articleActionDescription)"), "Runtime article and work metadata must use the actionable meta description builder.");
  expect(contentRoutesSource.includes("firstAction") && contentRoutesSource.includes("firstCheck") && contentRoutesSource.includes("firstOutput"), "Static content routes must extract article first action, completion check, and learner output.");
  expect(staticIndexSource.includes("teaches: [route.firstAction, route.firstCheck, route.firstOutput].filter(Boolean)"), "Static article JSON-LD must include first action, completion check, and learner output.");
  expect(staticIndexSource.includes("完成后检查："), "Static index fallback must expose article completion checks.");
  expect(staticIndexSource.includes("可保存产出："), "Static index fallback must expose learner outputs.");
  expect(articleLibrarySource.includes('background: "transparent"') && articleLibrarySource.includes('border: "none"') && articleLibrarySource.includes('borderLeft: "3px solid rgba(93,140,101,0.5)"') && !articleLibrarySource.includes('boxShadow: "0 8px 18px rgba(94,68,42,0.04)"'), "Reading library entries must stay as compact directory rows instead of thick cards.");
  expect(!articleLibrarySource.includes("article-library-start-strip") && !articleLibrarySource.includes("readingWorkflow") && !articleLibrarySource.includes("先按这条路径打开文章"), "Reading library must not reintroduce a separate start-path block before the articles.");
  expect(!articleLibrarySource.includes('minHeight: "calc(100vh - 50px)"'), "Reading library must not force a full viewport height that pushes the footer below short pages.");
  expect(articleLibrarySource.includes("articleChoiceRoutes") && articleLibrarySource.includes("article-choice-route-strip") && articleLibrarySource.includes("article-choice-route-grid") && articleLibrarySource.includes("现在卡在哪") && articleLibrarySource.includes("选一个问题，进正文完成第一个动作并留下记录。"), "Reading library must expose one compact problem-based route strip.");
  expect(articleLibrarySource.includes("articleLibraryRecordCards") && articleLibrarySource.includes("article-library-record-strip") && articleLibrarySource.includes("读完保存四格记录") && articleLibrarySource.includes("问题句") && articleLibrarySource.includes("证据句") && articleLibrarySource.includes("边界句") && articleLibrarySource.includes("下一步"), "Reading library must include a compact save-after-reading record strip so the page has a concrete learner output.");
  for (const articleChoiceCue of ["科研证据读不顺", "平台不会配置", "AI 输出不放心", "项目没有证据"]) {
    expect(articleLibrarySource.includes(articleChoiceCue), `Reading library choice route is missing cue: ${articleChoiceCue}`);
  }
  expect(articleLibrarySource.includes(".article-choice-route-grid") && articleLibrarySource.includes("grid-template-columns: repeat(2, minmax(0, 1fr)) !important"), "Reading library choice route must stay compact on mobile.");
  expect(articleLibrarySource.includes(".article-library-record-grid") && articleLibrarySource.includes("grid-template-columns: repeat(2, minmax(0, 1fr)) !important"), "Reading library record strip must stay compact on mobile.");
  expect(articleLibrarySource.includes("@media (max-width: 560px)") && articleLibrarySource.includes(".article-choice-route-grid,\n          .article-library-record-grid") && articleLibrarySource.includes("grid-template-columns: 1fr !important") && articleLibrarySource.includes(".article-library-meta") && articleLibrarySource.includes(".article-choice-helper") && articleLibrarySource.includes(".article-group-desc") && articleLibrarySource.includes(".article-record-helper") && articleLibrarySource.includes("display: none !important"), "Reading library narrow mobile layout must switch route and record cards to one column and hide squeezed metadata.");
  expect(articleLibrarySource.includes("检查：${article.firstCheck}") && articleLibrarySource.includes("产出：${article.firstOutput}"), "Reading library entries must preserve first action, completion check, and learner output in accessible labels.");
  expect(articleLibrarySource.includes("article-library-meta") && articleLibrarySource.includes("article-library-first-action") && articleLibrarySource.includes("先做：{article.firstAction}") && articleLibrarySource.includes("每篇都给出先做、检查和产出"), "Reading library visible rows must show one compact first action so entries are immediately useful.");
  expect(!articleLibrarySource.includes("article-library-date") && !articleLibrarySource.includes("article-library-read-time") && !articleLibrarySource.includes("点标题进入正文") && !articleLibrarySource.includes("article.date") && !articleLibrarySource.includes("article.readTime"), "Reading library must not expose date or read-time metadata that makes entries feel like a passive article index.");
  expect(!articleLibrarySource.includes("article-library-action-line") && !articleLibrarySource.includes("article-library-output-line") && !articleLibrarySource.includes("article-library-actions") && !articleLibrarySource.includes("完成后检查：{article.firstCheck}") && !articleLibrarySource.includes("可保存产出：{article.firstOutput}"), "Reading library visible rows must avoid repeated action/output blocks.");
  expect(!existsSync(resolve(root, "src/app/components/HomeLibrary.tsx")), "Home article index component must stay removed; articles are reached by direct routes and generated index metadata.");
  for (const retiredNoteBlock of ["methodChecklistText", "copyMethodChecklist", "note-method-checklist-panel", "noteRouteGuides", "methodRouteGuideText", "copyMethodRouteGuide", "note-route-guide-panel", "note-recommended-start"]) {
    expect(!notesSource.includes(retiredNoteBlock), `Learning method library should not repeat route/checklist panels on the homepage: ${retiredNoteBlock}.`);
  }
  for (const retiredResearchBlock of ["evidenceChecklistText", "copyEvidenceChecklist", "research-evidence-checklist-panel", "evidenceRouteGuides", "evidenceRouteGuideText", "copyEvidenceRouteGuide", "research-route-guide-panel", "research-recommended-start"]) {
    expect(!researchSource.includes(retiredResearchBlock), `Research evidence library should not repeat route/checklist panels on the homepage: ${retiredResearchBlock}.`);
  }
}

function verifyLearnerProductPositioning() {
  const positioningSources = [
    "src/app/siteMetadata.ts",
    "src/app/App.tsx",
    "src/app/components/Footer.tsx",
    "src/app/components/Hero.tsx",
    "src/app/components/Nav.tsx",
    "src/app/components/WorkDetailPage.tsx",
    "src/app/components/Works.tsx",
    "scripts/site-metadata.mjs",
  ].map((relativePath) => [relativePath, read(relativePath)]);

  const combinedSource = positioningSources.map(([relativePath, source]) => `\n/* ${relativePath} */\n${source}`).join("\n");
  const requiredProductCopy = [
    "科学学习与 AI",
    "演化时间轴",
    "植物演化时间轴",
    "CRISPR 概念模拟器",
    '"学习项目"',
    "内容目录",
    "基因表达可视化",
    "概念解释生成器",
    "科研学习工作台",
    "文章",
  ];
  const retiredProductPatterns = [
    { label: "course-heavy home title", pattern: /科学、课程/ },
    { label: "course-card positioning", pattern: /课程卡片|课程材料/ },
    { label: "childlike plant work title", pattern: /植物进化小故事/ },
    { label: "lecture-style CRISPR title", pattern: /CRISPR 交互讲解/ },
    { label: "course category literal", pattern: /category:\s*"课程"/ },
    { label: "course filter literal", pattern: /\["全部",\s*"科学",\s*"课程"/ },
    { label: "generic education positioning", pattern: /science education|AI教育|生命科学教育/ },
    { label: "display-style plant tags", pattern: /科普|插画/ },
    { label: "course resource copy", pattern: /课程资料/ },
  ];

  for (const text of requiredProductCopy) {
    expect(combinedSource.includes(text), `Learner product positioning should include: ${text}`);
  }

  for (const [relativePath, source] of positioningSources) {
    for (const item of retiredProductPatterns) {
      expect(!item.pattern.test(source), `${relativePath} contains retired product positioning copy: ${item.label}`);
    }
  }

  const navSource = read("src/app/components/Nav.tsx");
  const appSource = read("src/app/App.tsx");
  const heroSource = read("src/app/components/Hero.tsx");
  const themeSource = read("src/styles/theme.css");
  expect(appSource.includes('href="/#works"') && appSource.includes('linkText="回到内容目录"') && appSource.includes('navigateClient("/#works")'), "App 404 page must return to the shared content directory.");
  expect(!appSource.includes("回到首页") && !appSource.includes('href="/#top"'), "App 404 page must not send users to a generic home/top target.");
  expect(!heroSource.includes('id="top"') && !themeSource.includes("#top"), "Homepage must not keep a generic top anchor after routing all returns to the content directory.");
  expect(!appSource.includes("<About") && !appSource.includes('from "./components/About"'), "Homepage should not render a separate About section.");
  expect(!existsSync(resolve(root, "src/app/components/About.tsx")), "About component should stay removed so homepage remains a short content directory.");
  expect(navSource.includes('import { navigateClient, shouldUseClientNavigation } from "../navigation"'), "Navigation logo must keep client-side home navigation.");
  expect(navSource.includes('href="/#works"') && navSource.includes('navigateClient("/#works")') && !navSource.includes('href="/#top"') && !navSource.includes('navigateClient("/#top")'), "Navigation logo must return to the content directory instead of a generic top anchor.");
  expect(navSource.includes('className="nav-menu"') && navSource.includes('aria-label="主要内容入口"'), "Navigation should expose a compact top menu for real content destinations.");
  for (const requiredNavEntry of ['label: "主题"', 'label: "模拟"', 'label: "科研"', 'label: "AI"', 'label: "阅读"', 'href: "/works/gene-expression"', 'href: "/works/research-prompt-kit"', 'href: "/works/concept-explainer"', 'href: "/reading"']) {
    expect(navSource.includes(requiredNavEntry), `Navigation compact menu is missing: ${requiredNavEntry}`);
  }
  expect(!navSource.includes('className="nav-links"') && !navSource.includes('className="nav-link"'), "Navigation must not restore the old repeated nav-link system.");
  for (const retiredNavEntry of ['label: "内容"', 'label: "联系"', 'label: "关于"', 'href: "/#contact"', 'href: "/#about"', 'aria-current']) {
    expect(!navSource.includes(retiredNavEntry), `Navigation should not reintroduce repeated homepage entry: ${retiredNavEntry}.`);
  }
  expect(appSource.includes("{isHome ? null : <Footer />}"), "Homepage should not render the footer so the first screen stays short and content-only.");
  for (const retiredNavGuide of ["更多工具", "读证据", "学方法", "看生命过程", "整理科研", "生命过程", "拆概念", "科研 Agent", "getWorkToolHref", "matchHref", "nav-mobile-toggle", "mobile-navigation", "mobile-nav-link", "IconMenu", "IconClose", 'matchHashes: ["#research", "#notes"]', "currentRouteGuideText", "copyCurrentRouteGuide", "nav-route-guide-button", "nav-route-guide-status", "当前位置学习路径", "复制当前位置学习路径", 'import { copyText } from "../clipboard"', 'import { works } from "./Works"', 'import { notes } from "./Notes"', 'import { essays } from "./ResearchEssays"']) {
    expect(!navSource.includes(retiredNavGuide), `Navigation should stay compact and not include retired copy-path guide: ${retiredNavGuide}.`);
  }
}

function verifyFooterContactContract() {
  const footerSource = read("src/app/components/Footer.tsx");
  const appSource = read("src/app/App.tsx");
  const requiredFooterContactFeatures = [
    { label: "contact anchor", text: 'id="contact"' },
    { label: "external link data", text: "externalLinks" },
    { label: "github link", text: "https://github.com/liruirui321" },
    { label: "email mailto", text: "mailto:liruirui321@gmail.com" },
    { label: "compact footer links", text: "footer-links" },
  ];

  for (const item of requiredFooterContactFeatures) {
    expect(footerSource.includes(item.text), `Footer contact flow is missing ${item.label}: ${item.text}`);
  }

  expect(!appSource.includes("<Contact") && !appSource.includes('import { Contact }'), "Homepage must not render a separate contact strip.");
  expect(!existsSync(resolve(root, "src/app/components/Contact.tsx")), "The retired Contact component must be removed instead of kept as dead duplicate UI.");
  for (const retiredContactBlock of ["contact-action-strip", "联系与反馈", "复制邮箱", "打开邮件", "contact-compact-form", "contact-draft-copy-status", "相关页面", "具体内容", "打开邮件草稿", "复制内容", "反馈可处理度", "发送前确认"]) {
    expect(!footerSource.includes(retiredContactBlock), `Footer contact should stay compact and not include retired contact block: ${retiredContactBlock}.`);
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

verifyWorkBlocks();
verifyVisibleLearningModuleCopy();
verifyNoLowQualityVisibleContent();
verifyWorkCardActions();
verifyWorkDetailCardsStayCompact();
verifyArticleCardsStayStructured();
verifyPlatformGuideConfigBuilder();
verifyPlantGenomeEvidenceChainBuilder();
verifyGenomeAssemblyStoryFrameBuilder();
verifyBarcodingEvidenceTableBuilder();
verifyProjectEvidenceTableBuilder();
verifyCreationRunRecordBuilder();
verifyResearchQuestionTranslationBuilder();
verifyAiMaterialAuditTableBuilder();
verifyArticleOutcomeSnapshot();
verifyWorkJsonLdLearningOutcomes();
verifyResearchAgentWorkbenchContract();
verifyConceptExplainerAgentContract();
verifyGeneExpressionLearnerContract();
verifyPlantEvolutionLearnerContract();
verifyCrisprLearnerScenarios();
verifyLearnerFacingArticleCopy();
verifyLearnerProductPositioning();
verifyFooterContactContract();

if (failures.length) {
  console.error("Content integrity verification failed.");
  console.error(failures.map((failure) => `  - ${failure}`).join("\n"));
  process.exit(1);
}

const articleRouteCount = routes.filter((route) => route.type !== "work").length;
console.log(`Content integrity verified: ${workSlugs.size} work routes and ${articleRouteCount} article routes have detail content coverage.`);
