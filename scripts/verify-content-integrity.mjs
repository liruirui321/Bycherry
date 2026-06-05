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
    "30 分钟学习路径",
    "首屏学习模块总览",
    "可保存产出",
    "复制路径",
    "页尾继续学习入口",
    "footerWorkLinks",
    "footer-work-link",
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
  const copyActionMatches = Array.from(worksSource.matchAll(/\baction:\s*"复制[^"]*"/g), (match) => match[0]);

  expect(copyActionMatches.length === 0, `Work card entry actions should open or start the tool, not imply direct copy behavior: ${copyActionMatches.join(", ")}`);
  expect(worksSource.includes('title: "科研 Agent 工作台"'), "Research AI work card should be titled 科研 Agent 工作台.");
  expect(!worksSource.includes("科研助手 Prompt Kit"), "Visible work card title must not use the old Prompt Kit naming.");
  expect(worksSource.includes("moduleChecklistText"), "Works section must provide a copyable learning module checklist.");
  expect(worksSource.includes("copyModuleChecklist"), "Works section must expose a checklist copy action.");
  expect(worksSource.includes("学习模块清单"), "Works section must show the learning module checklist panel.");
  expect(worksSource.includes("复制清单"), "Works section must expose the checklist copy button.");
  expect(worksSource.includes("filteredOutputCount"), "Works section checklist must summarize saved output counts.");
  expect(worksSource.includes("work-module-checklist-status"), "Works section checklist must expose copy status.");
  expect(worksSource.includes("work-card-first-step"), "Homepage work cards must use compact first-step scan rows.");
  expect(worksSource.includes("work-card-output-strip"), "Homepage work cards must use compact output strips.");
  expect(worksSource.includes("minHeight: 344"), "Homepage work cards must stay compact enough for scanning.");
  expect(worksSource.includes("work-scan-strip"), "Works section must expose a top scan strip before deeper planning panels.");
  expect(worksSource.includes("当前范围速览"), "Works section must name the top scan strip for quick module selection.");
  expect(worksSource.includes("work-scan-link"), "Works section top scan strip must expose direct module links.");
  expect(worksSource.includes("work-scan-first-step") && worksSource.includes("work-scan-output"), "Works section top scan strip must expose first steps and outputs.");
  expect(worksSource.includes("learningPathBundles"), "Works section must connect modules with paired reading paths.");
  expect(worksSource.includes("配套阅读路径"), "Works section must visibly expose paired module and article routes.");
  expect(worksSource.includes("readingPathPlanText"), "Works section paired reading paths must provide a copyable plan.");
  expect(worksSource.includes("copyReadingPathPlan"), "Works section must expose a paired reading path copy action.");
  expect(worksSource.includes("work-reading-path-status"), "Works section paired reading path copy action must expose copy status.");
  expect(worksSource.includes("work-reading-path-copy-button"), "Works section must expose a paired reading path copy button.");
  expect(worksSource.includes("work-reading-path-link"), "Works section paired reading links must be keyboard focusable.");
  expect(worksSource.includes("bundle.article.actionSteps[0]") && worksSource.includes("bundle.article.checklist[0]"), "Works section paired reading links must expose article action and completion checks.");
  expect(worksSource.includes("pairedWorkCount") && worksSource.includes("{pairedWorkCount}/{works.length}"), "Works section paired reading paths must show full module coverage.");
  for (const slug of ["gene-expression", "research-prompt-kit", "plant-evolution-stories", "concept-explainer", "crispr-interactive"]) {
    expect(worksSource.includes(`work.slug === "${slug}"`), `Works paired reading paths must include ${slug}.`);
  }
}

function verifyWorkDetailCardsStayCompact() {
  const source = read("src/app/components/WorkDetailPage.tsx");

  expect(!source.includes("isPlantEvolution"), "Work detail cards must not use plant-specific tall preview sizing.");
  expect(source.includes('gridTemplateColumns: "112px minmax(0, 1fr)"'), "Work detail continue cards should use a uniform compact preview column.");
  expect(source.includes('height: 88'), "Work detail continue card previews should keep a fixed compact height.");
  expect(source.includes("conceptInputQuality"), "Concept explainer must judge whether learner inputs are complete enough.");
  expect(source.includes("concept-agent-input-grid"), "Concept explainer context inputs must be visible in the initial agent panel.");
  expect(source.includes("资料边界") && source.includes("当前卡点"), "Concept explainer must collect source boundary and current confusion.");
  expect(source.includes("复制自查记录"), "Concept explainer must expose a copyable understanding audit.");
  expect(source.includes("conceptInputQualityScore"), "Concept explainer must surface input quality before generating outputs.");
  expect(source.includes("taskRouteRecipes"), "Research agent workbench must expose task route recipes.");
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
  expect(source.includes("chapters.map((chapter, index)") && source.includes("plantStageLabels[index]"), "Plant evolution full timeline review must summarize all stages.");
  expect(source.includes("timelineReviewChecks"), "Plant evolution full timeline review must include completion checks.");
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

  const notesSource = read("src/app/components/Notes.tsx");
  const researchSource = read("src/app/components/ResearchEssays.tsx");

  expect(notesSource.includes("note-card-action-row"), "Learning method cards must keep a compact first-action row.");
  expect(notesSource.includes("note-card-quick-evidence"), "Learning method cards must group completion and output into a compact evidence area.");
  expect(notesSource.includes("note-card-excerpt") && notesSource.includes("maxHeight: 74"), "Learning method cards must keep excerpts short enough for scanning.");
  expect(researchSource.includes("research-card-action-row"), "Research evidence cards must keep a compact first-action row.");
  expect(researchSource.includes("research-card-quick-evidence"), "Research evidence cards must group completion and output into a compact evidence area.");
  expect(researchSource.includes("maxHeight: 66"), "Research evidence cards must keep excerpts short enough for scanning.");
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

  expect(articleSource.includes("aiMaterialAuditBuilderEnabled"), "AI material audit article must expose a special audit table builder.");
  expect(articleSource.includes('article?.slug === "ai-course-development"'), "AI material audit table builder must target the AI material audit article.");
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

  expect(articleSource.includes("articleOutcomeSnapshot"), "Article detail pages must derive a read-before-output snapshot.");
  expect(articleSource.includes("读完带走"), "Article detail pages must visibly tell learners what they will take away.");
  expect(articleSource.includes("article-outcome-snapshot"), "Article detail output snapshot must have a stable class for focus and layout checks.");
  expect(articleSource.includes("copyActionPack") && articleSource.includes("copyLearningRecord"), "Article detail output snapshot must expose action pack and learning record copy actions.");
  expect(articleSource.includes("目标是带走可执行材料，而不是只浏览"), "Article detail output snapshot must frame reading as producing reusable material.");
  expect(articleSource.includes("article-start-action-button"), "Article detail output snapshot must expose a direct start action.");
  expect(articleSource.includes("focusArticleStart"), "Article detail direct start action must focus the primary action or body anchor.");
  expect(articleSource.includes('id="article-primary-action"') && articleSource.includes('id="article-body-points"'), "Article detail pages must expose focusable action and body anchors.");
  expect(articleSource.includes("articleReadingTaskPackCards"), "Article detail pages must derive a five-card reading task pack.");
  expect(articleSource.includes("readingTaskPackText"), "Article detail pages must provide a copyable reading task pack.");
  expect(articleSource.includes("copyReadingTaskPack"), "Article detail pages must expose a reading task pack copy action.");
  expect(articleSource.includes("article-reading-task-pack"), "Article detail reading task pack must have a stable class for layout checks.");
  expect(articleSource.includes("阅读任务包"), "Article detail pages must visibly name the reading task pack.");
  expect(articleSource.includes("先做、抓证据、留产出、验收、接着做"), "Article detail reading task pack must show the learner execution sequence.");
  expect(articleSource.includes("复制阅读任务包"), "Article detail reading task pack must expose a visible copy button.");
  expect(articleSource.includes("【阅读任务包】"), "Article copied task pack must include a clear title.");
  expect(articleSource.includes("三、正文抓取顺序"), "Article copied task pack must include the reading path.");
  expect(articleSource.includes("五、读完接着做"), "Article copied task pack must include paired next actions.");
}

function verifyWorkJsonLdLearningOutcomes() {
  const appSource = read("src/app/App.tsx");
  const staticIndexSource = read("scripts/generate-static-index.mjs");
  const heroSource = read("src/app/components/Hero.tsx");
  const workDetailSource = read("src/app/components/WorkDetailPage.tsx");
  const worksSource = read("src/app/components/Works.tsx");
  const footerSource = read("src/app/components/Footer.tsx");

  expect(appSource.includes("learningResourceType: work.category"), "Runtime work JSON-LD must include learningResourceType.");
  expect(appSource.includes("teaches: [work.task, work.starter, work.success, ...work.path, ...work.outputs]"), "Runtime work JSON-LD must include immediate task, starter action, completion standard, learning path, and output outcomes.");
  expect(appSource.includes("const metaDescriptionMaxLength = 180"), "Runtime meta descriptions must have a readable length cap.");
  expect(appSource.includes("function buildMetaDescription"), "Runtime page metadata must use a shared meta description builder.");
  expect(appSource.includes("const workActionDescription = work ? `先做这个：${work.starter}。完成标准：${work.success}` : null"), "Runtime work meta descriptions must include starter and completion standard.");
  expect(staticIndexSource.includes("learningResourceType: route.category"), "Static work JSON-LD generator must include learningResourceType.");
  expect(staticIndexSource.includes("teaches: [route.task, route.starter, route.success, ...route.pathSteps, ...route.outputs].filter(Boolean)"), "Static work JSON-LD generator must include immediate task, starter action, completion standard, learning path, and output outcomes.");
  expect(staticIndexSource.includes("立即任务："), "Static index fallback must expose immediate learner tasks.");
  expect(staticIndexSource.includes("先做这个："), "Static index fallback must expose first concrete starter actions.");
  expect(staticIndexSource.includes("完成标准："), "Static index fallback must expose concrete completion standards.");
  expect(heroSource.includes("{work.task}"), "Homepage hero work cards must expose immediate learner tasks.");
  expect(heroSource.includes("{work.starter}"), "Homepage hero work cards must expose first concrete starter actions.");
  expect(heroSource.includes("{work.success}"), "Homepage hero work cards must expose concrete completion standards.");
  expect(heroSource.includes("hero-work-outcome") && heroSource.includes('{work.outputs.slice(0, 2).join(" / ")}'), "Homepage hero work cards must visibly expose saved outputs.");
  expect(heroSource.includes("hero-work-completion") && heroSource.includes("{work.success}"), "Homepage hero work cards must visibly expose completion standards.");
  expect(heroSource.includes("aria-label={`打开${work.title}：先做这个，${work.starter}。完成标准，${work.success}`}"), "Homepage hero work cards must include starter and completion standard in accessible labels.");
  expect(heroSource.includes('aria-label="首屏学习模块目录"'), "Homepage hero must label the first-screen module directory.");
  expect(heroSource.includes("heroModuleStats"), "Homepage hero must summarize module stats before the first-screen directory.");
  expect(heroSource.includes("heroOutputCount"), "Homepage hero must calculate saved output counts for first-screen scanning.");
  expect(heroSource.includes("heroPathStepCount"), "Homepage hero must calculate action step counts for first-screen scanning.");
  expect(heroSource.includes('aria-label="首屏模块总览"'), "Homepage hero must expose the first-screen module summary to assistive tech.");
  expect(heroSource.includes("首屏模块总览"), "Homepage copied session plan must include the first-screen module summary.");
  expect(heroSource.includes("可保存产出"), "Homepage hero must show saved-output coverage before opening a module.");
  expect(heroSource.includes('gridTemplateColumns: "repeat(auto-fit, minmax(154px, 1fr))"'), "Homepage hero module cards must stay compact enough to reveal multiple modules in the first screen.");
  expect(heroSource.includes("minHeight: 152"), "Homepage hero module cards must use compact fixed heights.");
  expect(heroSource.includes("scroll-snap-type: x proximity"), "Homepage hero mobile module directory must support horizontal scanning.");
  expect(heroSource.includes("sessionPlans"), "Homepage hero must offer a first-screen 30-minute session plan selector.");
  expect(heroSource.includes("copySessionPlan"), "Homepage hero must provide a copy action for the session plan.");
  expect(heroSource.includes("hero-session-copy-status"), "Homepage hero must expose copy status for the session plan.");
  expect(heroSource.includes("保存产出：${activeSessionPlan.work.outputs.join"), "Homepage hero session plan must include saved outputs.");
  expect(heroSource.includes("完成标准：${activeSessionPlan.work.success}"), "Homepage hero session plan must include completion standards.");
  expect(heroSource.includes("回到模块页填写复盘证据"), "Homepage hero copied session plan must point learners back to the work evidence fields.");
  expect(heroSource.includes("hero-session-action-link"), "Homepage hero session plan must expose direct module and paired-reading links.");
  expect(heroSource.includes("进入模块：{activeSessionPlan.work.title}"), "Homepage hero session plan must include a visible direct module link.");
  expect(heroSource.includes("配套阅读：{activeSessionPlan.article.title}"), "Homepage hero session plan must include a visible paired-reading link.");
  expect(heroSource.includes('import { notes } from "./Notes"') && heroSource.includes('import { essays } from "./ResearchEssays"'), "Homepage hero session plans must connect modules to paired reading libraries.");
  for (const slug of ["gene-expression", "concept-explainer", "research-prompt-kit", "plant-evolution-stories", "crispr-interactive"]) {
    expect(heroSource.includes(`work.slug === "${slug}"`), `Homepage 30-minute session plans must include ${slug}.`);
  }
  expect(heroSource.includes("配套阅读：${activeSessionPlan.article.title}"), "Homepage hero session plan must include a paired reading title.");
  expect(heroSource.includes("阅读入口：${activeSessionPlan.article.href}"), "Homepage hero copied session plan must include paired reading route.");
  expect(heroSource.includes("完成检查：${activeSessionPlan.article.checklist[0]}"), "Homepage hero copied session plan must include paired reading completion check.");
  expect(heroSource.includes("materialRoutes"), "Homepage hero must expose material-based route choices.");
  expect(heroSource.includes("按手头材料选模块"), "Homepage hero must visibly let learners choose by the material they have.");
  expect(heroSource.includes("按手头材料选择"), "Homepage copied session plan must include material-based route choices.");
  expect(heroSource.includes("hero-material-route-grid"), "Homepage material route choices must have a stable grid class.");
  expect(heroSource.includes("hero-material-route-link"), "Homepage material route choices must expose direct links.");
  expect(heroSource.includes('aria-label="按手头材料选择学习模块"'), "Homepage material route choices must be labeled for assistive tech.");
  expect(heroSource.includes("带走：{route.output}"), "Homepage material route choices must show saved outputs.");
  expect(heroSource.includes("配套阅读进入模块"), "Homepage hero visible session copy must mention paired reading.");
  expect(worksSource.includes("先做这个"), "Homepage work cards must expose a first concrete starter action.");
  expect(worksSource.includes("{work.success}"), "Homepage work cards must expose each work completion standard.");
  expect(worksSource.includes("aria-label={`打开${work.title}：先做这个，${work.starter}。完成标准，${work.success}`}"), "Homepage work cards must include starter and completion standard in accessible labels.");
  expect(workDetailSource.includes("{work.starter}"), "Work detail quick start must expose each work starter action.");
  expect(workDetailSource.includes("{work.success}"), "Work detail quick start must expose each work completion standard.");
  expect(workDetailSource.includes("workFirstRunCards"), "Work detail quick start must build a first-run route card set.");
  expect(workDetailSource.includes("workFirstRunPlanText"), "Work detail first-run cards must provide copyable route text.");
  expect(workDetailSource.includes("copyFirstRunPlan"), "Work detail first-run cards must provide a copy action.");
  expect(workDetailSource.includes("第一次运行卡"), "Work detail quick start must visibly expose a first-run card.");
  expect(workDetailSource.includes("5 分钟") && workDetailSource.includes("15 分钟") && workDetailSource.includes("30 分钟"), "Work detail first-run cards must provide timed entry points.");
  expect(workDetailSource.includes("work-first-run-panel") && workDetailSource.includes("work-first-run-grid"), "Work detail first-run cards must use stable panel and grid classes.");
  expect(workDetailSource.includes('aria-label={`${work.title}第一次运行路线`}'), "Work detail first-run route must be labeled for assistive tech.");
  expect(workDetailSource.includes("work.outputs.join(\" / \")"), "Work detail first-run cards must derive saved outputs from each module.");
  expect(workDetailSource.includes("保存 ${work.outputs.join(\" / \")}，再写下：${work.success}"), "Work detail first-run cards must connect outputs to completion standards.");
  expect(workDetailSource.includes("work.path.map((step, index)"), "Work detail first-run copy text must include each module path.");
  expect(workDetailSource.includes("完成证据"), "Work detail quick start must ask learners to leave completion evidence.");
  expect(workDetailSource.includes("evidenceItems"), "Work detail quick start must derive completion evidence from work outputs, success, and path.");
  expect(workDetailSource.includes("evidenceFieldItems"), "Work detail quick start must provide learner-filled evidence fields.");
  expect(workDetailSource.includes("filledEvidence"), "Work detail reflection template must merge learner-filled evidence.");
  expect(workDetailSource.includes("work-saved-output"), "Work detail quick start must expose a saved output input.");
  expect(workDetailSource.includes("reflectionChecks"), "Work detail quick start must derive concrete reflection checks.");
  expect(workDetailSource.includes("保存 1 份${work.outputs[0]"), "Work detail completion evidence must include a concrete saved output.");
  expect(workDetailSource.includes("const evidenceTemplate"), "Work detail completion evidence must include a copyable reflection template.");
  expect(workDetailSource.includes("copyEvidenceTemplate"), "Work detail completion evidence must provide a copy action.");
  expect(workDetailSource.includes("复制复盘模板"), "Work detail completion evidence copy button must be visible.");
  expect(workDetailSource.includes("work-start-tool-link"), "Work detail quick start must expose a direct start link into the primary tool.");
  expect(workDetailSource.includes("focusPrimaryTool"), "Work detail start action must focus the primary tool anchor.");
  expect(workDetailSource.includes('id="work-primary-tool"') && workDetailSource.includes("tabIndex={-1}"), "Work detail primary tool anchor must be focusable.");
  expect(workDetailSource.includes("复盘证据"), "Work detail completion evidence template must include a reflection evidence title.");
  expect(workDetailSource.includes("三、我的填写记录"), "Work detail completion evidence template must include learner-filled notes.");
  expect(workDetailSource.includes("五、复盘检查"), "Work detail completion evidence template must include reflection checks.");
  expect(workDetailSource.includes("六、下一步问题"), "Work detail completion evidence template must include a next-question field.");
  expect(workDetailSource.includes("pairedArticleSlugsByWorkSlug"), "Work detail pages must map each module to paired article reading.");
  expect(workDetailSource.includes("function WorkPairedReading"), "Work detail pages must include a paired-reading component.");
  expect(workDetailSource.includes("<WorkPairedReading work={work} />"), "Work detail pages must render paired reading after the quick-start entry.");
  expect(workDetailSource.includes("做完接着读"), "Work detail paired reading must use learner-facing next-reading framing.");
  expect(workDetailSource.includes("work-paired-reading-link"), "Work detail paired reading must expose direct article links.");
  expect(workDetailSource.includes("article.actionSteps[0]") && workDetailSource.includes("article.checklist[0]") && workDetailSource.includes("article.starterTemplate[0]"), "Work detail paired reading must expose first action, completion check, and saved output template.");
  expect(workDetailSource.includes("aria-label={`打开配套阅读：${article.title}。先做这个，${article.actionSteps[0]}。完成后检查，${article.checklist[0]}`"), "Work detail paired reading links must include action and completion check in accessible labels.");
  for (const slug of ["gene-expression", "concept-explainer", "research-prompt-kit", "plant-evolution-stories", "crispr-interactive"]) {
    expect(workDetailSource.includes(`"${slug}"`), `Work detail paired reading must include ${slug}.`);
  }
  expect(workDetailSource.includes("aria-label={`继续探索${item.title}：先做这个，${item.starter}。完成标准，${item.success}`}"), "Work detail related cards must include starter and completion standard in accessible labels.");
  expect(workDetailSource.includes("先做这个：{item.work.starter}"), "Work detail previous/next cards must expose each adjacent module starter action.");
  expect(workDetailSource.includes("aria-label={`${item.label}：${item.work.title}。先做这个，${item.work.starter}。完成标准，${item.work.success}`}"), "Work detail previous/next cards must include starter and completion standard in accessible labels.");
  expect(workDetailSource.includes("function WorkQuickStart"), "Work detail pages must include a quick-start entry component.");
  expect(workDetailSource.includes("<WorkQuickStart work={work} />"), "Work detail pages must render the quick-start entry before deep content.");
  expect(footerSource.includes('"plant-evolution-stories"') && footerSource.includes('"crispr-interactive"'), "Footer continue-learning links must cover all learning modules, not only the first three.");
  expect(footerSource.includes("footer-work-step") && footerSource.includes("footer-work-output"), "Footer continue-learning links must stay compact with first step and saved output rows.");
  expect(!footerSource.includes("完成：{work.success}"), "Footer continue-learning links must not repeat long completion standards visibly.");
  expect(footerSource.includes("完成标准，${work.success}"), "Footer continue-learning accessible labels must include completion standards.");
  expect(footerSource.includes("maxWidth: 960"), "Footer continue-learning grid must have enough width for all five module links.");
  expect(footerSource.includes("footerNextPlanText"), "Footer must provide a copyable continue-learning plan.");
  expect(footerSource.includes("copyFooterNextPlan"), "Footer must expose a copy action for the continue-learning plan.");
  expect(footerSource.includes("页尾继续学习清单"), "Footer must visibly name the continue-learning plan.");
  expect(footerSource.includes("footer-next-plan-panel"), "Footer continue-learning plan must have a stable panel class.");
  expect(footerSource.includes("footer-plan-copy-status"), "Footer continue-learning copy action must expose copy status.");
  expect(footerSource.includes("复制清单"), "Footer continue-learning plan must expose a visible copy button.");
  expect(footerSource.includes("结束前复制模块页的记录、报告或复盘模板"), "Footer copied plan must direct learners to save evidence before stopping.");
}

function verifyResearchAgentWorkbenchContract() {
  const workDetailSource = read("src/app/components/WorkDetailPage.tsx");
  const researchSkillSource = read("public/skills/research-agent/SKILL.md");
  const promptKitMatch = workDetailSource.match(/const promptPracticeCases = \[([\s\S]*?)\nfunction PromptKitContent\(\) \{([\s\S]*?)\nfunction PlantEvolutionContent\(\)/);

  expect(Boolean(promptKitMatch), "WorkDetailPage must define promptPracticeCases before PromptKitContent and before PlantEvolutionContent.");

  if (!promptKitMatch) return;

  const practiceCasesSource = promptKitMatch[1];
  const promptKitSource = promptKitMatch[2];
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
    { label: "Elicit API source", text: "https://docs.elicit.com/" },
    { label: "Consensus source", text: "https://help.consensus.app/en/articles/9922660-how-to-search-best-practices" },
    { label: "scite API source", text: "https://api.scite.ai/docs" },
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
    { label: "research skill visible panel", text: "科研 Agent skill" },
    { label: "public research skill document link", text: "/skills/research-agent/SKILL.md" },
    { label: "research skill copy button", text: "复制 Skill" },
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
  ];

  const retiredWorkbenchPatterns = [
    { label: "mentor framing", pattern: /导师/ },
    { label: "implementation roadmap heading", pattern: /落地层级/ },
    { label: "already-landed project copy", pattern: /当前已落地/ },
  ];

  for (const item of requiredWorkbenchFeatures) {
    expect(`${practiceCasesSource}\n${promptKitSource}`.includes(item.text), `Research Agent workbench is missing ${item.label}: ${item.text}`);
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
    "## Role",
    "## Input",
    "## Workflow",
    "## Task Routes",
    "## Output Contract",
    "## Evidence Rules",
    "## Completion Gate",
    "adult learner",
    "Classify the task route from material signals",
    "evidence_items",
    "missing_fields",
    "risk_flags",
    "citation_check",
    "reviewer_questions",
    "Do not invent DOI",
    "Keep correlation, association, mechanism, causation, and speculation separate",
    "At least one evidence_item",
    "Next actions written as concrete checks",
  ]) {
    expect(researchSkillSource.includes(text), `Public research agent SKILL.md is missing required content: ${text}`);
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
    { label: "definition-only input mode", text: "只会背定义" },
    { label: "process confusion input mode", text: "过程顺序混乱" },
    { label: "evidence boundary input mode", text: "证据边界不清" },
    { label: "figure reading input mode", text: "图表看不懂" },
    { label: "concept input mode grid", text: "concept-input-mode-grid" },
    { label: "concept mode guide text", text: "conceptModeGuideText" },
    { label: "concept input mode copy button", text: "复制输入模式" },
    { label: "skill prompt contract", text: "conceptSkillPrompt" },
    { label: "copyable skill prompt", text: "copyConceptSkillPrompt" },
    { label: "visible skill protocol", text: "概念解释 skill 协议" },
    { label: "arbitrary concept copy", text: "输入任意概念" },
    { label: "direct learner agent role", text: "陪我学习" },
    { label: "anti-shortcut boundary", text: "不要替我跳过判断过程" },
    { label: "anti-fabrication boundary", text: "不编造具体事实" },
    { label: "stable output card", text: "生成学习卡" },
    { label: "agent run panel", text: "Agent 运行面板" },
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
    { label: "explanation pack card one-sentence", text: "一句话解释" },
    { label: "explanation pack visual skeleton", text: "图形骨架" },
    { label: "explanation pack immediate practice", text: "马上练习" },
    { label: "completion standard card", text: "合格标准" },
    { label: "missing input handling", text: "最多问 2 个短问题" },
    { label: "source boundary visible field", text: "资料边界" },
    { label: "current stuck point visible field", text: "当前卡点" },
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
    { label: "full skill copy button", text: "复制完整 Skill" },
    { label: "skill markdown frontmatter", text: "name: concept-explainer" },
  ];

  const retiredConceptPatterns = [
    { label: "teacher prompt label", pattern: /教师追问/ },
    { label: "teacher output field", pattern: /teacherMove/ },
    { label: "student output field", pattern: /studentOutput/ },
    { label: "lecture copy", pattern: /教师教案|讲给谁|讲解目标|讲解稿/ },
    { label: "classroom flow heading", pattern: /课堂流程/ },
    { label: "school-level advanced label", pattern: /研究生版/ },
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
    { label: "readable mRNA guide", text: "绿色虚线：核糖体当前可读取的已转录片段" },
    { label: "ribosome cannot outrun polymerase", text: "不能越过 RNA 聚合酶" },
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
    { label: "visible completion card", text: "完成验收卡" },
    { label: "completion record section", text: "六、完成验收" },
    { label: "quiz pass threshold", text: "至少答对 3 题再复制记录" },
    { label: "transcription completion check", text: "转录启动" },
    { label: "translation product completion check", text: "翻译产物" },
  ];
  const retiredGenePatterns = [
    { label: "teacher/classroom framing", pattern: /课堂|教师|老师|教案|授课|教学/ },
    { label: "placeholder framing", pattern: /\bdemo\b|设计想法/ },
    { label: "incorrect DNA polymerase label", pattern: /DNA 聚合酶/ },
  ];

  for (const item of requiredGeneFeatures) {
    expect(geneSource.includes(item.text), `Gene expression learner contract is missing ${item.label}: ${item.text}`);
  }

  for (const item of retiredGenePatterns) {
    expect(!item.pattern.test(geneSource), `Gene expression tool must avoid retired or incorrect copy: ${item.label}`);
  }

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
    { label: "evidence audit section in study card", text: "8. 证据判读" },
    { label: "completion checks data", text: "plantCompletionChecks" },
    { label: "visible completion card", text: "阶段完成验收" },
    { label: "completion section in study card", text: "9. 完成验收" },
    { label: "completion pass criteria", text: "通过标准：${item.pass}" },
    { label: "completion location task", text: "阶段定位" },
    { label: "completion evidence boundary task", text: "证据边界" },
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
    { label: "completion check data", text: "crisprCompletionChecks" },
    { label: "visible completion card", text: "完成验收卡" },
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
  ];

  for (const item of requiredCrisprFeatures) {
    expect(crisprSource.includes(item.text), `CRISPR simulator learner scenario contract is missing ${item.label}: ${item.text}`);
  }

  expect(Array.from(crisprSource.matchAll(/\bgoal:\s*"/g)).length >= 3, "CRISPR simulator should expose at least three learner scenario goals.");
  expect(worksSource.includes("查看匹配评分、编辑判定、风险核查和模拟报告。"), "CRISPR work card must describe risk audit output.");
  expect(worksSource.includes('outputs: ["guide 判定", "风险核查", "模拟报告"]'), "CRISPR work card outputs must stay aligned with simulator report.");
  expect(worksSource.includes('path: ["找 PAM", "判 guide", "核查风险"]'), "CRISPR work card path must describe a learner action flow.");
}

function verifyLearnerFacingArticleCopy() {
  const appSource = read("src/app/App.tsx");
  const staticIndexSource = read("scripts/generate-static-index.mjs");
  const contentRoutesSource = read("scripts/content-routes.mjs");
  const articleDetailSource = read("src/app/components/ArticleDetailPage.tsx");
  const notesSource = read("src/app/components/Notes.tsx");
  const researchSource = read("src/app/components/ResearchEssays.tsx");
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
    "aiMaterialAuditPrompts",
    "aiMaterialAuditPromptText",
    "copyAiMaterialAuditPrompts",
    "AI 质检提示词包",
    "复制质检提示词",
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
    "审核使用",
    "学习资料库",
    "学习方法库",
    "科研证据库",
    "推荐起点",
    "先读 AI 学习材料质检",
    "先读真实科研如何变成问题",
    "按学习方法主题筛选",
    "按科研证据主题筛选",
    "当前显示",
    "方法执行清单",
    "科研证据执行清单",
    "按当前卡点选择",
    "按手头材料选择",
    "复制路径",
    "查看证据",
    "学习方法、科研证据、AI 创作和科研转译资料",
    "先做这个",
    "完成后检查",
    "先避开",
    "读完产出",
    "读完填写",
    "复制已填写记录",
    "复制学习记录",
    "30 分钟执行节奏",
    "读完接着做",
    "pairedWorkSlugsByArticleSlug",
    "article-paired-work-panel",
    "article-paired-work-link",
    "article-paired-work-step",
    "article-paired-work-check",
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
  expect(articleDetailSource.includes("完成验收卡"), "Article detail pages must expose a completion card.");
  expect(articleDetailSource.includes("三、我的填写记录"), "Article learning records must include learner-filled notes.");
  expect(articleDetailSource.includes("七、完成验收"), "Article learning records must include completion checks.");
  expect(articleDetailSource.includes("验收：${item.output}"), "Article completion cards must show observable pass criteria.");
  expect(articleDetailSource.includes("const articlePracticePlan"), "Article detail pages must derive a short execution plan.");
  expect(articleDetailSource.includes("const pairedWorks"), "Article detail pages must derive paired work modules for next-step action.");
  expect(articleDetailSource.includes("八、读完接着做"), "Article learning records must include paired module next actions.");
  expect(articleDetailSource.includes("work.starter") && articleDetailSource.includes("work.success"), "Article paired module cards must expose starter actions and completion standards.");
  expect(articleDetailSource.includes("aria-label={`打开配套模块：${work.title}。先做这个，${work.starter}。完成标准，${work.success}`}"), "Article paired module links must include starter and completion standard in accessible labels.");
  expect(articleDetailSource.includes("const learningRecordText"), "Article detail pages must include a copyable learning record.");
  expect(articleDetailSource.includes("copyLearningRecord"), "Article detail pages must provide a learning record copy action.");
  expect(articleDetailSource.includes("record-question-input"), "Article detail pages must expose a learner question input.");
  expect(articleDetailSource.includes("复制学习记录"), "Article detail pages must expose a learning record copy button.");
  expect(articleDetailSource.includes("读完后至少留下一个可检查的学习记录"), "Article detail pages must frame article completion as a learner output.");
  expect(articleDetailSource.includes("const platformUsePlansText"), "Platform article summaries must include copyable fill-in assessment configurations.");
  expect(articleDetailSource.includes("actionSteps[0]"), "Article quick start must use the first concrete article action.");
  expect(articleDetailSource.includes("checklist[0]"), "Article quick start must expose the first completion check.");
  expect(articleDetailSource.includes("pitfalls[0]"), "Article quick start must expose the first pitfall to avoid.");
  expect(articleDetailSource.includes("const itemAction = item.article.actionSteps[0]"), "Article previous/next cards must derive the adjacent article first action.");
  expect(articleDetailSource.includes("const itemCheck = item.article.checklist[0]"), "Article previous/next cards must derive the adjacent article completion check.");
  expect(articleDetailSource.includes("const itemOutput = item.article.starterTemplate[0]"), "Article previous/next cards must derive the adjacent article saved output.");
  expect(articleDetailSource.includes("aria-label={`${item.label}：${item.article.title}。先做这个，${itemAction}。完成后检查，${itemCheck}`}"), "Article previous/next cards must include first action and completion check in accessible labels.");
  expect(articleDetailSource.includes("article-nav-card-check") && articleDetailSource.includes("{itemCheck}"), "Article previous/next cards must visibly expose adjacent article completion checks.");
  expect(articleDetailSource.includes("article-nav-card-output") && articleDetailSource.includes("{itemOutput}"), "Article previous/next cards must visibly expose adjacent article saved outputs.");
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
  expect(notesSource.includes("note.actionSteps[0]"), "Learning method cards must expose each article's first action step.");
  expect(notesSource.includes("note-card-completion") && notesSource.includes("{note.checklist[0]}"), "Learning method cards must visibly expose each article's first completion check.");
  expect(notesSource.includes("note-card-output") && notesSource.includes("{note.starterTemplate[0]}"), "Learning method cards must visibly expose each article's first learner output.");
  expect(researchSource.includes("essay.actionSteps[0]"), "Research evidence cards must expose each article's first action step.");
  expect(researchSource.includes("research-card-completion") && researchSource.includes("{essay.checklist[0]}"), "Research evidence cards must visibly expose each article's first completion check.");
  expect(researchSource.includes("research-card-output") && researchSource.includes("{essay.starterTemplate[0]}"), "Research evidence cards must visibly expose each article's first learner output.");
  expect(notesSource.includes("aria-label={`打开学习方法：${note.title}。先做这个，${note.actionSteps[0]}。完成后检查，${note.checklist[0]}`}"), "Learning method cards must include first action and completion check in accessible labels.");
  expect(notesSource.includes("methodChecklistText"), "Learning method library must provide a copyable method execution checklist.");
  expect(notesSource.includes("copyMethodChecklist"), "Learning method library must expose a method checklist copy action.");
  expect(notesSource.includes("note-method-checklist-status"), "Learning method library must expose method checklist copy status.");
  expect(notesSource.includes("note.starterTemplate.slice(0, 4)"), "Learning method checklist must include reusable starter templates.");
  expect(notesSource.includes("note.pitfalls[0]"), "Learning method checklist must include first pitfall reminders.");
  expect(notesSource.includes("noteRouteGuides"), "Learning method library must provide route guides for learner starting points.");
  expect(notesSource.includes("methodRouteGuideText"), "Learning method route guides must be copyable.");
  expect(notesSource.includes("copyMethodRouteGuide"), "Learning method library must expose a route guide copy action.");
  expect(notesSource.includes("note-route-guide-status"), "Learning method library must expose route guide copy status.");
  expect(notesSource.includes("按当前卡点选择"), "Learning method library must frame choices around the learner's current blocker.");
  expect(notesSource.includes("guide.output"), "Learning method route guide cards must expose saved learner outputs.");
  expect(researchSource.includes("aria-label={`打开科研证据：${essay.title}。先做这个，${essay.actionSteps[0]}。完成后检查，${essay.checklist[0]}`}"), "Research evidence cards must include first action and completion check in accessible labels.");
  expect(researchSource.includes("evidenceChecklistText"), "Research evidence library must provide a copyable evidence execution checklist.");
  expect(researchSource.includes("copyEvidenceChecklist"), "Research evidence library must expose an evidence checklist copy action.");
  expect(researchSource.includes("research-evidence-checklist-status"), "Research evidence library must expose evidence checklist copy status.");
  expect(researchSource.includes("essay.starterTemplate.slice(0, 4)"), "Research evidence checklist must include evidence starter templates.");
  expect(researchSource.includes("essay.pitfalls[0]"), "Research evidence checklist must include first pitfall reminders.");
  expect(researchSource.includes("evidenceRouteGuides"), "Research evidence library must provide route guides for learner materials.");
  expect(researchSource.includes("evidenceRouteGuideText"), "Research evidence route guides must be copyable.");
  expect(researchSource.includes("copyEvidenceRouteGuide"), "Research evidence library must expose a route guide copy action.");
  expect(researchSource.includes("research-route-guide-status"), "Research evidence library must expose route guide copy status.");
  expect(researchSource.includes("按手头材料选择"), "Research evidence library must frame choices around the learner's available material.");
  expect(researchSource.includes("guide.output"), "Research evidence route guide cards must expose saved learner outputs.");
}

function verifyLearnerProductPositioning() {
  const positioningSources = [
    "src/app/siteMetadata.ts",
    "src/app/App.tsx",
    "src/app/components/About.tsx",
    "src/app/components/Footer.tsx",
    "src/app/components/Hero.tsx",
    "src/app/components/Nav.tsx",
    "src/app/components/WorkDetailPage.tsx",
    "src/app/components/Works.tsx",
    "scripts/site-metadata.mjs",
  ].map((relativePath) => [relativePath, read(relativePath)]);

  const combinedSource = positioningSources.map(([relativePath, source]) => `\n/* ${relativePath} */\n${source}`).join("\n");
  const aboutSource = read("src/app/components/About.tsx");
  const requiredProductCopy = [
    "科学学习与 AI",
    "演化时间轴",
    "植物演化时间轴",
    "CRISPR 编辑模拟器",
    '"学习项目"',
    "科学学习和 AI 工具",
    "science learning lab",
    "先从基因表达可视化开始",
    "按目标选入口",
    "看懂一个生命过程",
    "拆清一个卡住概念",
    "整理一段科研材料",
    "看生命过程",
    "拆概念",
    "整理科研",
    "更多工具",
    "读证据",
    "学方法",
    "怎么开始",
    "工作台闭环",
    "about-workbench-loop-step",
    "选入口",
    "先操作",
    "存产出",
    "定下一步",
    "about-use-card",
    "完成检查",
    "产出：{item.work.outputs[0]}",
    "完成：{item.work.success}",
    "aboutStartGuideText",
    "copyAboutStartGuide",
    "about-start-guide-panel",
    "about-start-guide-status",
    "工作台开始清单",
    "复制开始清单",
    "先选一个入口，不同时展开多个方向",
    "三、结束前保存证据",
    "currentRouteGuideText",
    "copyCurrentRouteGuide",
    "nav-route-guide-button",
    "nav-route-guide-status",
    "当前位置学习路径",
    "复制当前位置学习路径",
    "打开一个模块，完成页面里的首步任务，并保存一份产出",
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

  for (const slug of ["gene-expression", "concept-explainer", "research-prompt-kit", "plant-evolution-stories", "crispr-interactive"]) {
    expect(aboutSource.includes(`findWork("${slug}")`), `About start guide must include ${slug}.`);
  }
  expect(aboutSource.includes('import { navigateClient, navigateHomeSection, shouldUseClientNavigation } from "../navigation"'), "About start guide cards must use client-side navigation.");
  expect(aboutSource.includes('import { preloadRouteForHref } from "../routePrefetch"'), "About start guide cards must preload work detail routes.");
  expect(aboutSource.includes("onPointerDown={() => preloadRouteForHref(item.work.href)}"), "About start guide cards must preload routes on pointer down.");
  expect(aboutSource.includes("navigateClient(item.work.href)"), "About start guide cards must navigate without a full page reload.");
  expect(aboutSource.includes("完成标准，${item.work.success}"), "About start guide accessible labels must include completion standards.");
  const navSource = read("src/app/components/Nav.tsx");
  expect(navSource.includes('import { works } from "./Works"') && navSource.includes('import { notes } from "./Notes"') && navSource.includes('import { essays } from "./ResearchEssays"'), "Navigation route guide must derive current work and article context.");
  expect(navSource.includes('import { copyText } from "../clipboard"'), "Navigation route guide must use the shared clipboard helper.");
  expect(navSource.includes("currentWork") && navSource.includes("currentArticle"), "Navigation route guide must detect work and article pages.");
  expect(navSource.includes("currentHomeSection"), "Navigation route guide must handle homepage sections.");
  expect(navSource.includes("role=\"status\"") && navSource.includes("aria-live=\"polite\""), "Navigation route guide must expose copy status accessibly.");
}

function verifyContactFeedbackContract() {
  const contactSource = read("src/app/components/Contact.tsx");
  const requiredContactFeatures = [
    { label: "feedback type state", text: "feedbackType" },
    { label: "related page state", text: "relatedPage" },
    { label: "stuck point state", text: "stuckPoint" },
    { label: "tried action state", text: "triedAction" },
    { label: "expected outcome state", text: "expectedOutcome" },
    { label: "feedback type field", text: "反馈类型" },
    { label: "related page field", text: "相关页面" },
    { label: "current stuck point field", text: "当前卡点" },
    { label: "tried action field", text: "已经尝试" },
    { label: "expected outcome field", text: "希望得到" },
    { label: "structured draft body", text: "反馈类型：${feedbackType}" },
    { label: "structured draft page", text: "相关页面：${trimmedRelatedPage" },
    { label: "structured draft stuck point", text: "当前卡点：${trimmedStuckPoint" },
    { label: "structured draft tried action", text: "已经尝试：${trimmedTriedAction" },
    { label: "structured draft expected outcome", text: "希望得到：${trimmedExpectedOutcome" },
    { label: "structured draft status", text: "结构化邮件草稿已准备好" },
    { label: "page preset data", text: "contactPagePresets" },
    { label: "page preset group", text: "选择常见反馈页面" },
    { label: "page preset class", text: "contact-page-presets" },
    { label: "feedback quality data", text: "feedbackQualityItems" },
    { label: "feedback quality score", text: "feedbackQualityScore" },
    { label: "copyable feedback checklist", text: "feedbackChecklistText" },
    { label: "feedback checklist copy handler", text: "copyFeedbackChecklist" },
    { label: "feedback quality panel", text: "contact-feedback-quality-panel" },
    { label: "feedback quality visible heading", text: "反馈可处理度" },
    { label: "feedback checklist copy button", text: "复制核查单" },
    { label: "feedback checklist copied title", text: "【By Cherry 反馈核查单】" },
    { label: "feedback checklist completion score", text: "可处理度：${feedbackQualityScore}/5" },
    { label: "feedback before-send checks", text: "发送前确认" },
  ];

  for (const item of requiredContactFeatures) {
    expect(contactSource.includes(item.text), `Contact feedback flow is missing ${item.label}: ${item.text}`);
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
verifyContactFeedbackContract();

if (failures.length) {
  console.error("Content integrity verification failed.");
  console.error(failures.map((failure) => `  - ${failure}`).join("\n"));
  process.exit(1);
}

const articleRouteCount = routes.filter((route) => route.type !== "work").length;
console.log(`Content integrity verified: ${workSlugs.size} work routes and ${articleRouteCount} article routes have detail content coverage.`);
