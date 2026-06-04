import { readdirSync, readFileSync } from "node:fs";
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

    for (const fieldName of ["id", "slug", "category", "title", "desc", "task", "href", "updated", "tags", "outputs", "path", "action"]) {
      expect(hasField(block, fieldName), `${label} is missing ${fieldName}.`);
    }

    expect((getField(block, "task") ?? "").length >= 24, `${label} needs a concrete immediate task for direct learner use.`);
    expect(countStringItemsInArray(block, "tags") >= 3, `${label} needs at least 3 tags for scanning and filtering context.`);
    expect(countStringItemsInArray(block, "outputs") >= 3, `${label} needs at least 3 visible outputs.`);
    expect(countStringItemsInArray(block, "path") === 3, `${label} needs exactly 3 learning path steps for homepage and work card entry clarity.`);
  }
}

function verifyVisibleLearningModuleCopy() {
  const visibleShellSources = [
    "src/app/App.tsx",
    "src/app/components/About.tsx",
    "src/app/components/Footer.tsx",
    "src/app/components/Hero.tsx",
    "src/app/components/Nav.tsx",
    "src/app/components/WorkDetailPage.tsx",
    "src/app/components/Works.tsx",
  ].map((relativePath) => [relativePath, read(relativePath)]);

  const requiredCopy = [
    "学习模块",
    "浏览学习模块",
    "打开学习模块",
    "全部学习模块",
    "学习模块前后导航",
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
  const copyActionMatches = Array.from(worksSource.matchAll(/\baction:\s*"复制[^"]*"/g), (match) => match[0]);

  expect(copyActionMatches.length === 0, `Work card entry actions should open or start the tool, not imply direct copy behavior: ${copyActionMatches.join(", ")}`);
  expect(worksSource.includes('title: "科研 Agent 工作台"'), "Research AI work card should be titled 科研 Agent 工作台.");
  expect(!worksSource.includes("科研助手 Prompt Kit"), "Visible work card title must not use the old Prompt Kit naming.");
}

function verifyWorkDetailCardsStayCompact() {
  const source = read("src/app/components/WorkDetailPage.tsx");

  expect(!source.includes("isPlantEvolution"), "Work detail cards must not use plant-specific tall preview sizing.");
  expect(source.includes('gridTemplateColumns: "112px minmax(0, 1fr)"'), "Work detail continue cards should use a uniform compact preview column.");
  expect(source.includes('height: 88'), "Work detail continue card previews should keep a fixed compact height.");
}

function verifyArticleCardsStayStructured() {
  const files = [
    "src/app/components/Notes.tsx",
    "src/app/components/ResearchEssays.tsx",
    "src/app/components/ArticleDetailPage.tsx",
    "src/app/components/EmptyStateCard.tsx",
  ];

  for (const relativePath of files) {
    const source = read(relativePath);
    expect(!source.includes("border: 1.5px dashed"), `${relativePath} must not use dashed illustration frames.`);
    expect(!source.includes("transform: rotate("), `${relativePath} must not use rotated tape or stamp styling.`);
  }
}

function verifyWorkJsonLdLearningOutcomes() {
  const appSource = read("src/app/App.tsx");
  const staticIndexSource = read("scripts/generate-static-index.mjs");
  const heroSource = read("src/app/components/Hero.tsx");
  const workDetailSource = read("src/app/components/WorkDetailPage.tsx");

  expect(appSource.includes("learningResourceType: work.category"), "Runtime work JSON-LD must include learningResourceType.");
  expect(appSource.includes("teaches: [work.task, ...work.path, ...work.outputs]"), "Runtime work JSON-LD must include immediate task, learning path, and output outcomes.");
  expect(staticIndexSource.includes("learningResourceType: route.category"), "Static work JSON-LD generator must include learningResourceType.");
  expect(staticIndexSource.includes("teaches: [route.task, ...route.pathSteps, ...route.outputs].filter(Boolean)"), "Static work JSON-LD generator must include immediate task, learning path, and output outcomes.");
  expect(staticIndexSource.includes("立即任务："), "Static index fallback must expose immediate learner tasks.");
  expect(heroSource.includes("{work.task}"), "Homepage hero work cards must expose immediate learner tasks.");
  expect(workDetailSource.includes("function WorkQuickStart"), "Work detail pages must include a quick-start entry component.");
  expect(workDetailSource.includes("<WorkQuickStart work={work} />"), "Work detail pages must render the quick-start entry before deep content.");
}

function verifyConceptExplainerAgentContract() {
  const workDetailSource = read("src/app/components/WorkDetailPage.tsx");
  const worksSource = read("src/app/components/Works.tsx");
  const conceptMatch = workDetailSource.match(/function ConceptExplainerContent\(\) \{([\s\S]*?)\nfunction CrisprContent\(\)/);

  expect(Boolean(conceptMatch), "WorkDetailPage must include ConceptExplainerContent before CrisprContent.");

  if (!conceptMatch) return;

  const conceptSource = conceptMatch[1];
  const requiredConceptFeatures = [
    { label: "free concept input state", text: "conceptInput" },
    { label: "fallback concept agent builder", text: "buildConceptAgentExplanation" },
    { label: "skill prompt contract", text: "conceptSkillPrompt" },
    { label: "copyable skill prompt", text: "copyConceptSkillPrompt" },
    { label: "visible skill protocol", text: "概念解释 skill 协议" },
    { label: "arbitrary concept copy", text: "输入任意概念" },
    { label: "learner-facing agent role", text: "面向学习者" },
    { label: "anti-shortcut boundary", text: "不要替我跳过判断过程" },
    { label: "anti-fabrication boundary", text: "不编造具体事实" },
    { label: "stable output card", text: "生成学习卡" },
  ];

  const retiredConceptPatterns = [
    { label: "teacher prompt label", pattern: /教师追问/ },
    { label: "teacher output field", pattern: /teacherMove/ },
    { label: "student output field", pattern: /studentOutput/ },
    { label: "lecture copy", pattern: /教师教案|讲给谁|讲解目标|讲解稿/ },
    { label: "classroom flow heading", pattern: /课堂流程/ },
  ];

  for (const item of requiredConceptFeatures) {
    expect(conceptSource.includes(item.text), `Concept explainer agent contract is missing ${item.label}: ${item.text}`);
  }

  for (const item of retiredConceptPatterns) {
    expect(!item.pattern.test(conceptSource), `Concept explainer must remain learner-facing and avoid retired copy: ${item.label}`);
  }

  expect(worksSource.includes("输入任意概念或选择样例"), "Concept explainer work card must advertise arbitrary concept input.");
  expect(worksSource.includes('outputs: ["学习卡", "可视化流程", "即时小测"]'), "Concept explainer work card outputs must match the learner-facing agent output.");
  expect(worksSource.includes('path: ["输入概念", "看诊断边界", "生成学习卡"]'), "Concept explainer work card path must describe the learner-facing agent flow.");
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

  expect(worksSource.includes("演化时间轴串联关键创新、证据、自测问题、作答提示和延伸练习。"), "Plant evolution work card must describe the learner-facing self-study flow.");
  expect(worksSource.includes('outputs: ["学习卡", "自测问题", "参考文献"]'), "Plant evolution work card outputs must be learner-facing.");
  expect(worksSource.includes('path: ["选择阶段", "读证据", "完成练习"]'), "Plant evolution work card path must describe a learner action flow.");
}

function verifyLearnerFacingArticleCopy() {
  const learnerArticleSources = [
    "src/app/App.tsx",
    "src/app/components/About.tsx",
    "src/app/components/ArticleDetailPage.tsx",
    "src/app/components/Contact.tsx",
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
    "从植物基因组读懂一条证据链",
    "真实科研如何变成学习者能进入的问题",
    "预习诊断、概念检查或复习巩固",
    "审核使用",
    "学习资料库",
    "学习方法库",
    "科研证据库",
    "查看证据",
    "学习方法、科研证据、AI 创作和科研转译资料",
  ];
  const retiredLearnerArticlePatterns = [
    { label: "old AI course title", pattern: /AI 可以参与课程开发/ },
    { label: "old plant classroom title", pattern: /从植物基因组到高中生物课堂/ },
    { label: "note-and-essay directory copy", pattern: /笔记与科研随笔/ },
    { label: "generic reading navigation copy", pattern: /阅读全文|阅读笔记|回到笔记|最近在想的事|文章目录/ },
    { label: "research essay navigation copy", pattern: /科研随笔|创作笔记/ },
    { label: "learning note positioning", pattern: /学习笔记|研究笔记/ },
    { label: "classroom framing", pattern: /课堂|教师|老师|教案|授课|教学/ },
    { label: "course design framing", pattern: /课程开发|课程设计|课程转化/ },
    { label: "assessment publishing framing", pattern: /审核投放|投放复盘|投放给|发布或导出方式/ },
    { label: "student-as-third-person framing", pattern: /学生基础|学生任务|学生能|学生作品|学生可以/ },
  ];

  for (const text of requiredLearnerCopy) {
    expect(combinedSource.includes(text), `Learner-facing article copy should include: ${text}`);
  }

  for (const [relativePath, source] of learnerArticleSources) {
    for (const item of retiredLearnerArticlePatterns) {
      expect(!item.pattern.test(source), `${relativePath} contains retired teacher/classroom-facing article copy: ${item.label}`);
    }
  }
}

function verifyLearnerProductPositioning() {
  const positioningSources = [
    "src/app/siteMetadata.ts",
    "src/app/App.tsx",
    "src/app/components/About.tsx",
    "src/app/components/Footer.tsx",
    "src/app/components/Hero.tsx",
    "src/app/components/WorkDetailPage.tsx",
    "src/app/components/Works.tsx",
    "scripts/site-metadata.mjs",
  ].map((relativePath) => [relativePath, read(relativePath)]);

  const combinedSource = positioningSources.map(([relativePath, source]) => `\n/* ${relativePath} */\n${source}`).join("\n");
  const requiredProductCopy = [
    "科学学习与 AI",
    "演化时间轴",
    "植物演化时间轴",
    "CRISPR 编辑模拟器",
    '"学习项目"',
    "科学学习和 AI 工具",
    "science learning lab",
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
verifyWorkJsonLdLearningOutcomes();
verifyConceptExplainerAgentContract();
verifyPlantEvolutionLearnerContract();
verifyLearnerFacingArticleCopy();
verifyLearnerProductPositioning();

if (failures.length) {
  console.error("Content integrity verification failed.");
  console.error(failures.map((failure) => `  - ${failure}`).join("\n"));
  process.exit(1);
}

const articleRouteCount = routes.filter((route) => route.type !== "work").length;
console.log(`Content integrity verified: ${workSlugs.size} work routes and ${articleRouteCount} article routes have detail content coverage.`);
