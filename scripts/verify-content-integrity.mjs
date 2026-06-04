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
    "复制路径",
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
  expect(worksSource.includes("moduleChecklistText"), "Works section must provide a copyable learning module checklist.");
  expect(worksSource.includes("copyModuleChecklist"), "Works section must expose a checklist copy action.");
  expect(worksSource.includes("学习模块清单"), "Works section must show the learning module checklist panel.");
  expect(worksSource.includes("复制清单"), "Works section must expose the checklist copy button.");
  expect(worksSource.includes("filteredOutputCount"), "Works section checklist must summarize saved output counts.");
  expect(worksSource.includes("work-module-checklist-status"), "Works section checklist must expose copy status.");
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
  const worksSource = read("src/app/components/Works.tsx");

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
  expect(heroSource.includes("aria-label={`打开${work.title}：先做这个，${work.starter}。完成标准，${work.success}`}"), "Homepage hero work cards must include starter and completion standard in accessible labels.");
  expect(heroSource.includes('aria-label="首屏学习模块目录"'), "Homepage hero must label the first-screen module directory.");
  expect(heroSource.includes('gridTemplateColumns: "repeat(auto-fit, minmax(154px, 1fr))"'), "Homepage hero module cards must stay compact enough to reveal multiple modules in the first screen.");
  expect(heroSource.includes("minHeight: 152"), "Homepage hero module cards must use compact fixed heights.");
  expect(heroSource.includes("scroll-snap-type: x proximity"), "Homepage hero mobile module directory must support horizontal scanning.");
  expect(heroSource.includes("sessionPlans"), "Homepage hero must offer a first-screen 30-minute session plan selector.");
  expect(heroSource.includes("copySessionPlan"), "Homepage hero must provide a copy action for the session plan.");
  expect(heroSource.includes("hero-session-copy-status"), "Homepage hero must expose copy status for the session plan.");
  expect(heroSource.includes("保存产出：${activeSessionPlan.work.outputs.join"), "Homepage hero session plan must include saved outputs.");
  expect(heroSource.includes("完成标准：${activeSessionPlan.work.success}"), "Homepage hero session plan must include completion standards.");
  expect(worksSource.includes("先做这个"), "Homepage work cards must expose a first concrete starter action.");
  expect(worksSource.includes("{work.success}"), "Homepage work cards must expose each work completion standard.");
  expect(worksSource.includes("aria-label={`打开${work.title}：先做这个，${work.starter}。完成标准，${work.success}`}"), "Homepage work cards must include starter and completion standard in accessible labels.");
  expect(workDetailSource.includes("{work.starter}"), "Work detail quick start must expose each work starter action.");
  expect(workDetailSource.includes("{work.success}"), "Work detail quick start must expose each work completion standard.");
  expect(workDetailSource.includes("完成证据"), "Work detail quick start must ask learners to leave completion evidence.");
  expect(workDetailSource.includes("evidenceItems"), "Work detail quick start must derive completion evidence from work outputs, success, and path.");
  expect(workDetailSource.includes("保存 1 份${work.outputs[0]"), "Work detail completion evidence must include a concrete saved output.");
  expect(workDetailSource.includes("const evidenceTemplate"), "Work detail completion evidence must include a copyable reflection template.");
  expect(workDetailSource.includes("copyEvidenceTemplate"), "Work detail completion evidence must provide a copy action.");
  expect(workDetailSource.includes("复制复盘模板"), "Work detail completion evidence copy button must be visible.");
  expect(workDetailSource.includes("复盘证据"), "Work detail completion evidence template must include a reflection evidence title.");
  expect(workDetailSource.includes("aria-label={`继续探索${item.title}：先做这个，${item.starter}。完成标准，${item.success}`}"), "Work detail related cards must include starter and completion standard in accessible labels.");
  expect(workDetailSource.includes("先做这个：{item.work.starter}"), "Work detail previous/next cards must expose each adjacent module starter action.");
  expect(workDetailSource.includes("aria-label={`${item.label}：${item.work.title}。先做这个，${item.work.starter}。完成标准，${item.work.success}`}"), "Work detail previous/next cards must include starter and completion standard in accessible labels.");
  expect(workDetailSource.includes("function WorkQuickStart"), "Work detail pages must include a quick-start entry component.");
  expect(workDetailSource.includes("<WorkQuickStart work={work} />"), "Work detail pages must render the quick-start entry before deep content.");
}

function verifyResearchAgentWorkbenchContract() {
  const workDetailSource = read("src/app/components/WorkDetailPage.tsx");
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
    { label: "material source boundary", text: "材料来源：练习材料，用于学习证据拆解" },
    { label: "direct local preview cue", text: "可以直接运行本地预览" },
    { label: "source-grounded demand section", text: "需求依据" },
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
  ];

  for (const item of requiredWorkbenchFeatures) {
    expect(`${practiceCasesSource}\n${promptKitSource}`.includes(item.text), `Research Agent workbench is missing ${item.label}: ${item.text}`);
  }

  expect(Array.from(practiceCasesSource.matchAll(/\btask:\s*"/g)).length >= 3, "Research Agent workbench should expose at least three practice cases tied to tasks.");
  expect(!promptKitSource.includes('useState("研究问题：\\n样本/材料：\\n已有结果：\\n我最担心的问题：")'), "Research Agent workbench should not open on an empty field-only starter.");
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
    { label: "visual explanation output", text: "可视化解释" },
    { label: "visual selection card", text: "可视化选择" },
    { label: "completion standard card", text: "合格标准" },
    { label: "understanding check data", text: "understandingChecks" },
    { label: "self audit output", text: "selfAuditOutput" },
    { label: "copy understanding audit handler", text: "copyUnderstandingAudit" },
    { label: "visible understanding audit card", text: "理解验收卡" },
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
    "Do not only give a definition",
    "Do not fabricate facts",
    "Practice situation",
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
    { label: "accessible process focus", text: "当前过程焦点" },
    { label: "process record output", text: "expressionProcessRecord" },
    { label: "copy process record handler", text: "copyExpressionProcessRecord" },
    { label: "visible process record card", text: "表达过程记录" },
    { label: "copy process record button", text: "复制记录" },
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
    "学习阶段：年级、学科、章节、当前基础",
    "预习诊断、概念检查或复习巩固",
    "平台速用卡",
    "进入 scifuion.top",
    "selectedPlatformPlanIndex",
    "activePlatformPlan",
    "activePlatformPlanText",
    "选择 SciFuion 使用场景",
    "当前方案：",
    "生成后先查这 3 项",
    "【SciFuion 当前照填方案】",
    "审核清单",
    "少量生成后逐题审核",
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
    "查看证据",
    "学习方法、科研证据、AI 创作和科研转译资料",
    "先做这个",
    "完成后检查",
    "先避开",
    "读完产出",
    "复制学习记录",
    "30 分钟执行节奏",
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
  expect(articleDetailSource.includes("const articlePracticePlan"), "Article detail pages must derive a short execution plan.");
  expect(articleDetailSource.includes("const learningRecordText"), "Article detail pages must include a copyable learning record.");
  expect(articleDetailSource.includes("copyLearningRecord"), "Article detail pages must provide a learning record copy action.");
  expect(articleDetailSource.includes("复制学习记录"), "Article detail pages must expose a learning record copy button.");
  expect(articleDetailSource.includes("读完后至少留下一个可检查的学习记录"), "Article detail pages must frame article completion as a learner output.");
  expect(articleDetailSource.includes("const platformUsePlansText"), "Platform article summaries must include copyable fill-in assessment configurations.");
  expect(articleDetailSource.includes("actionSteps[0]"), "Article quick start must use the first concrete article action.");
  expect(articleDetailSource.includes("checklist[0]"), "Article quick start must expose the first completion check.");
  expect(articleDetailSource.includes("pitfalls[0]"), "Article quick start must expose the first pitfall to avoid.");
  expect(articleDetailSource.includes("const itemAction = item.article.actionSteps[0]"), "Article previous/next cards must derive the adjacent article first action.");
  expect(articleDetailSource.includes("const itemCheck = item.article.checklist[0]"), "Article previous/next cards must derive the adjacent article completion check.");
  expect(articleDetailSource.includes("aria-label={`${item.label}：${item.article.title}。先做这个，${itemAction}。完成后检查，${itemCheck}`}"), "Article previous/next cards must include first action and completion check in accessible labels.");
  expect(appSource.includes("teaches: [article.actionSteps[0], article.checklist[0]]"), "Runtime article list JSON-LD must include first action and completion check.");
  expect(appSource.includes("teaches: [note?.actionSteps[0] ?? essay?.actionSteps[0], note?.checklist[0] ?? essay?.checklist[0]]"), "Runtime article detail JSON-LD must include first action and completion check.");
  expect(appSource.includes("const articleFirstAction = note?.actionSteps[0] ?? essay?.actionSteps[0] ?? null"), "Runtime article metadata must derive the first action step.");
  expect(appSource.includes("const articleFirstCheck = note?.checklist[0] ?? essay?.checklist[0] ?? null"), "Runtime article metadata must derive the first completion check.");
  expect(appSource.includes("const articleActionDescription = (note || essay) && articleFirstAction && articleFirstCheck"), "Runtime article metadata must build an actionable article description.");
  expect(appSource.includes("先做这个：${articleFirstAction}。完成后检查：${articleFirstCheck}"), "Runtime article meta descriptions must include first action and completion check.");
  expect(appSource.includes("const description = buildMetaDescription(baseDescription, workActionDescription ?? articleActionDescription)"), "Runtime article and work metadata must use the actionable meta description builder.");
  expect(contentRoutesSource.includes("firstAction") && contentRoutesSource.includes("firstCheck"), "Static content routes must extract article first action and completion check.");
  expect(staticIndexSource.includes("teaches: [route.firstAction, route.firstCheck].filter(Boolean)"), "Static article JSON-LD must include first action and completion check.");
  expect(staticIndexSource.includes("完成后检查："), "Static index fallback must expose article completion checks.");
  expect(notesSource.includes("note.actionSteps[0]"), "Learning method cards must expose each article's first action step.");
  expect(researchSource.includes("essay.actionSteps[0]"), "Research evidence cards must expose each article's first action step.");
  expect(notesSource.includes("aria-label={`打开学习方法：${note.title}。先做这个，${note.actionSteps[0]}。完成后检查，${note.checklist[0]}`}"), "Learning method cards must include first action and completion check in accessible labels.");
  expect(notesSource.includes("methodChecklistText"), "Learning method library must provide a copyable method execution checklist.");
  expect(notesSource.includes("copyMethodChecklist"), "Learning method library must expose a method checklist copy action.");
  expect(notesSource.includes("note-method-checklist-status"), "Learning method library must expose method checklist copy status.");
  expect(notesSource.includes("note.starterTemplate.slice(0, 4)"), "Learning method checklist must include reusable starter templates.");
  expect(notesSource.includes("note.pitfalls[0]"), "Learning method checklist must include first pitfall reminders.");
  expect(researchSource.includes("aria-label={`打开科研证据：${essay.title}。先做这个，${essay.actionSteps[0]}。完成后检查，${essay.checklist[0]}`}"), "Research evidence cards must include first action and completion check in accessible labels.");
  expect(researchSource.includes("evidenceChecklistText"), "Research evidence library must provide a copyable evidence execution checklist.");
  expect(researchSource.includes("copyEvidenceChecklist"), "Research evidence library must expose an evidence checklist copy action.");
  expect(researchSource.includes("research-evidence-checklist-status"), "Research evidence library must expose evidence checklist copy status.");
  expect(researchSource.includes("essay.starterTemplate.slice(0, 4)"), "Research evidence checklist must include evidence starter templates.");
  expect(researchSource.includes("essay.pitfalls[0]"), "Research evidence checklist must include first pitfall reminders.");
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
    "先从基因表达可视化开始",
    "按目标选入口",
    "看懂一个生命过程",
    "拆清一个卡住概念",
    "整理一段科研材料",
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
verifyResearchAgentWorkbenchContract();
verifyConceptExplainerAgentContract();
verifyGeneExpressionLearnerContract();
verifyPlantEvolutionLearnerContract();
verifyCrisprLearnerScenarios();
verifyLearnerFacingArticleCopy();
verifyLearnerProductPositioning();

if (failures.length) {
  console.error("Content integrity verification failed.");
  console.error(failures.map((failure) => `  - ${failure}`).join("\n"));
  process.exit(1);
}

const articleRouteCount = routes.filter((route) => route.type !== "work").length;
console.log(`Content integrity verified: ${workSlugs.size} work routes and ${articleRouteCount} article routes have detail content coverage.`);
