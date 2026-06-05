import { useEffect, useState } from "react";
import { GeneExpressionTool } from "./GeneExpressionTool";
import { IconDNA } from "./Icons";
import { notes } from "./Notes";
import { essays } from "./ResearchEssays";
import { works } from "./Works";
import { WorkPreviewIllustration } from "./WorkPreviewIllustration";
import { EmptyStateCard } from "./EmptyStateCard";
import { copyText } from "../clipboard";
import { navigateClient, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";

type Work = (typeof works)[number];
type PairedArticle = (typeof notes)[number] | (typeof essays)[number];

const articleLibrary: PairedArticle[] = [...notes, ...essays];

const pairedArticleSlugsByWorkSlug: Record<string, string[]> = {
  "gene-expression": ["ai-course-development", "ai-assessment-quality-control"],
  "concept-explainer": ["ai-course-development", "science-to-learning-question"],
  "research-prompt-kit": ["science-to-learning-question", "genome-assembly-story"],
  "plant-evolution-stories": ["plant-genome-evidence-chain", "science-to-learning-question"],
  "crispr-interactive": ["barcoding-evidence-chain", "plant-genome-evidence-chain"],
};

function getPairedArticlesForWork(work: Work) {
  return (pairedArticleSlugsByWorkSlug[work.slug] ?? [])
    .map((articleSlug) => articleLibrary.find((article) => article.slug === articleSlug))
    .filter((article): article is PairedArticle => Boolean(article));
}

function getArticleLabel(article: PairedArticle) {
  return "tag" in article ? article.tag : article.label;
}

function getArticleLabelColor(article: PairedArticle) {
  return "tagColor" in article ? article.tagColor : article.labelColor;
}

function getArticleLabelBg(article: PairedArticle) {
  return "tagBg" in article ? article.tagBg : article.labelBg;
}

function navigateHome(hash = "") {
  navigateClient(`/${hash}`);
}

function ContentCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 18, padding: "1.2rem", boxShadow: "3px 5px 0px rgba(94,68,42,0.06)" }}>
      <h3 style={{ color: "var(--cherry-warm-brown)", fontSize: "1rem", fontWeight: 900, marginBottom: "0.65rem" }}>{title}</h3>
      <div style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.75, fontSize: "0.9rem" }}>{children}</div>
    </div>
  );
}

const promptPracticeCases = [
  {
    title: "读论文练习",
    task: "文献精读",
    material: `材料来源：练习材料，用于学习证据拆解，不当作真实论文引用
论文题目：干旱胁迫下拟南芥根系响应的转录组分析
摘要：研究比较正常供水和干旱处理 24 小时后的拟南芥根系 RNA-seq 数据，目标是寻找可能参与干旱响应的转录因子。
方法关键词：RNA-seq、差异表达分析、GO 富集、qPCR 验证
样本/分组：对照组 n=3，干旱处理组 n=3
已有结果：Figure 2 显示 132 个基因上调、87 个基因下调；一个 NAC 转录因子在干旱组表达升高，qPCR 趋势一致。
我想重点看：这份材料能支持“参与干旱响应”到哪一步，不能直接推出什么因果结论。
我最担心的问题：样本量较小，缺少敲除或过表达验证。`,
  },
  {
    title: "讲图表练习",
    task: "图表解读",
    material: `材料来源：练习材料，用于学习图表解读，不当作真实论文引用
图号：Figure 2
图注：干旱处理 24 小时后，根系中部分胁迫响应基因表达变化。
坐标轴/单位：横轴为基因编号，纵轴为 log2 fold change。
分组：对照组 n=3，干旱处理组 n=3
显著性标记：FDR < 0.05；误差线为标准误。
已有结果：NAC-like gene A 上调，log2FC = 2.1；WRKY-like gene B 上调，log2FC = 1.4。
我想确认：这张图能支持哪些观察事实，哪些机制解释还不能直接成立。`,
  },
  {
    title: "查实验设计练习",
    task: "实验设计检查",
    material: `材料来源：练习材料，用于学习实验设计检查，不当作真实实验方案
实验目的：判断候选 NAC 转录因子是否可能影响植物干旱耐受。
实验对象/材料：拟南芥野生型与候选基因过表达株系。
分组：正常供水对照、干旱处理；每组计划 6 株。
核心变量：基因型与水分处理。
检测指标：存活率、叶片失水率、根长、候选基因表达量。
统计方法：计划使用 t 检验比较两组均值。
我担心的问题：是否需要加入空载体对照、是否需要独立株系、统计方法是否能同时处理基因型和处理因素。`,
  },
];

function PromptKitContent() {
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [activeModeIndex, setActiveModeIndex] = useState(0);
  const [material, setMaterial] = useState(promptPracticeCases[0].material);
  const [activePracticeCase, setActivePracticeCase] = useState(promptPracticeCases[0].title);
  const [copied, setCopied] = useState(false);
  const [copiedPack, setCopiedPack] = useState(false);
  const [copiedPreview, setCopiedPreview] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedResponseJson, setCopiedResponseJson] = useState(false);
  const [copiedResearchRecord, setCopiedResearchRecord] = useState(false);
  const [copiedCitationAudit, setCopiedCitationAudit] = useState(false);
  const [copiedResearchSkill, setCopiedResearchSkill] = useState(false);
  const [hasRunPreview, setHasRunPreview] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [researchQuestionDraft, setResearchQuestionDraft] = useState("");
  const [unsupportedClaimDraft, setUnsupportedClaimDraft] = useState("");
  const [citationToVerifyDraft, setCitationToVerifyDraft] = useState("");
  const [nextResearchActionDraft, setNextResearchActionDraft] = useState("");
  const prompts = [
    {
      title: "文献精读",
      input: "论文摘要、方法、结果图或 DOI",
      materialTemplate: "论文题目：\n摘要：\n方法关键词：\n我想重点看：研究问题 / 主要证据 / 局限性\n需要避免：不要把摘要外的信息当成论文结论",
      text: "请基于我提供的论文内容，按以下结构输出：研究问题、核心假设、样本与数据、关键方法、主要证据、作者结论、局限性、我需要进一步核查的点。不要补充论文中没有出现的信息；如果缺少证据，请标注“原文未说明”。",
      checks: ["结论是否只来自原文", "方法和证据是否对应", "局限性是否具体"],
      output: ["研究问题", "主要证据", "局限性", "待核查点"],
    },
    {
      title: "实验设计检查",
      input: "实验目的、分组、样本量、操作步骤、统计方法",
      materialTemplate: "实验目的：\n实验对象/材料：\n分组：对照组 / 处理组\n每组样本量：\n核心变量：\n检测指标：\n统计方法：\n我担心的问题：对照是否足够、重复数是否合理",
      text: "请检查这份实验设计是否存在变量混杂、对照不足、重复数不足、统计方法不匹配或安全风险。输出时分为：必须修改、建议修改、可以保留、需要人工确认。每条意见都说明它会影响哪一种结论。",
      checks: ["阳性/阴性对照是否齐全", "重复数是否支持统计", "变量是否只改变一个核心因素"],
      output: ["必须修改", "建议修改", "可以保留", "人工确认"],
    },
    {
      title: "图表解读",
      input: "图片、图注、实验分组和统计标记",
      materialTemplate: "图号：Figure \n图注：\n坐标轴/单位：\n分组：\n显著性标记：\n我想确认：这张图能支持什么结论，不能支持什么结论",
      text: "请逐步解释这张图：先说明坐标轴、单位和分组，再描述趋势、离散程度和显著性标记，最后判断图中证据能支持哪些结论、不能支持哪些结论。请把观察事实、合理推断和过度推断分开。",
      checks: ["是否读清坐标轴", "是否区分趋势与因果", "是否遗漏对照组"],
      output: ["观察事实", "合理推断", "不能支持", "下一步检查"],
    },
    {
      title: "论文逻辑检查",
      input: "讨论段落、结果摘要、目标期刊风格",
      materialTemplate: "目标期刊/风格：\n结果摘要：\n讨论段落：\n我想检查：结论是否过度、引用是否不足、术语是否一致",
      text: "请检查下面这段论文讨论是否存在结论过度、证据跳跃、术语不一致、引用不足或重复表达。请逐句给出修改建议，并说明修改理由。不要替我新增未经证实的结论。",
      checks: ["每个结论是否有结果支持", "术语是否前后一致", "讨论是否区分结果和推测"],
      output: ["逐句问题", "修改建议", "修改理由", "缺失证据"],
    },
    {
      title: "审稿意见回应",
      input: "审稿意见、原文段落、已完成的补充分析",
      materialTemplate: "审稿人意见：\n原文位置：\n已完成修改/补充分析：\n还不能补做的内容：\n希望语气：克制、礼貌、逐条回应",
      text: "请把审稿意见拆成可回应的任务：需要新增实验、需要补充分析、需要改写解释、需要礼貌澄清。为每条意见生成回应结构：感谢、理解、已修改内容、修改位置、仍需说明的限制。",
      checks: ["回应是否逐条对应", "语气是否克制", "是否标明修改位置"],
      output: ["任务拆解", "回应草稿", "修改位置", "限制说明"],
    },
    {
      title: "术语一致性检查",
      input: "论文全文或章节草稿",
      materialTemplate: "章节/全文：\n重点术语：\n已有缩写表：\n需要统一的写法：中文 / 英文 / 缩写 / 变量名",
      text: "请列出文中同一概念的不同写法、缩写首次出现位置、中文和英文术语是否混用、变量名是否前后一致。输出为三列：术语、发现的问题、建议统一写法。",
      checks: ["缩写是否首次定义", "同义词是否混用", "图表和正文是否一致"],
      output: ["术语", "问题", "统一写法", "出现位置"],
    },
  ];
  const activePrompt = prompts[activePromptIndex];
  const promptModes = [
    {
      title: "保守核查",
      description: "只根据材料判断证据是否足够，优先暴露缺口。",
      instruction: "请保持保守，不要替材料补结论；所有判断都要回到原文、数据、图注或实验设计。",
      outputs: ["证据边界", "缺失信息", "核查优先级"],
    },
    {
      title: "结构改写",
      description: "把已有材料整理成更清晰的论文或汇报结构。",
      instruction: "请优化结构和表达顺序，但不要新增未经材料支持的事实；把改写和新增建议分开。",
      outputs: ["结构调整", "表达改写", "不可新增内容"],
    },
    {
      title: "复核摘要",
      description: "压缩成适合自己复盘或会议讨论的要点、风险和下一步。",
      instruction: "请把输出组织成可复核版本：先给结论边界，再列关键证据、主要风险和需要人工确认的问题。",
      outputs: ["复核摘要", "风险点", "待确认问题"],
    },
  ];
  const activeMode = promptModes[activeModeIndex];
  const materialText = material.trim();
  const materialLines = materialText.split("\n").map((line) => line.trim()).filter(Boolean);
  const apiOutputFields = ["task", "material_summary", "evidence_items", "inference_items", "missing_fields", "risk_flags", "reviewer_questions", "final_report"];
  const taskRouteRules = [
    { title: "文献精读", signals: ["论文题目", "摘要", "DOI", "方法关键词", "abstract", "method"], pattern: /论文题目|摘要|doi|方法关键词|abstract|method|introduction/i },
    { title: "实验设计检查", signals: ["实验目的", "分组", "样本量", "对照", "重复数", "统计方法"], pattern: /实验目的|实验对象|分组|样本量|每组|对照|control|重复|replicate|统计方法|检测指标/i },
    { title: "图表解读", signals: ["图号", "图注", "坐标轴", "单位", "显著性标记"], pattern: /图号|图注|figure|fig\.|坐标轴|单位|显著性标记|误差线|p\s*[<=>]/i },
    { title: "论文逻辑检查", signals: ["讨论段落", "结果摘要", "目标期刊", "引用", "结论过度"], pattern: /讨论段落|结果摘要|目标期刊|引用|结论过度|证据跳跃|discussion|conclusion/i },
    { title: "审稿意见回应", signals: ["审稿人意见", "原文位置", "已完成修改", "补充分析"], pattern: /审稿人意见|审稿|reviewer|原文位置|已完成修改|补充分析|response|revision/i },
    { title: "术语一致性检查", signals: ["重点术语", "缩写表", "统一写法", "变量名"], pattern: /重点术语|术语|缩写表|缩写|统一写法|变量名|abbreviation|terminology/i },
  ];
  const routeScores = taskRouteRules.map((rule) => {
    const matchedSignals = rule.signals.filter((signal) => new RegExp(signal, "i").test(materialText));
    const broadMatch = rule.pattern.test(materialText);
    return {
      ...rule,
      matchedSignals,
      score: matchedSignals.length + (broadMatch ? 1 : 0),
    };
  });
  const suggestedRoute = routeScores.reduce((best, item) => (item.score > best.score ? item : best), routeScores[0]);
  const suggestedPromptIndex = Math.max(0, prompts.findIndex((prompt) => prompt.title === suggestedRoute.title));
  const routeConfidence = suggestedRoute.score >= 4 ? "高" : suggestedRoute.score >= 2 ? "中" : "低";
  const routeMatchedSignals = suggestedRoute.matchedSignals.length ? suggestedRoute.matchedSignals.join("、") : "材料较少，先按当前栏目生成任务框架";
  const evidenceCandidateLines = materialLines
    .filter((line) => /摘要|方法|结果|figure|fig\.|图|分组|样本|对照|统计|显著|审稿|修改|讨论|术语|变量|结论|p\s*[<=>]|n\s*=/i.test(line))
    .slice(0, 3);
  const visibleEvidenceLines = (evidenceCandidateLines.length ? evidenceCandidateLines : materialLines.slice(0, 3)).filter(Boolean);
  const evidenceSummary = visibleEvidenceLines.length ? visibleEvidenceLines.join(" / ") : "当前没有可引用的材料行。";
  const materialChecks = [
    {
      label: "材料量",
      value: materialText.length >= 180 ? "可做初步分析" : "偏少",
      detail: materialText.length >= 180 ? "可以进入结构化核查；仍建议补充原文、图注或方法信息。" : "当前更适合生成任务框架，正式分析前需要补充材料。",
    },
    {
      label: "样本/分组",
      value: /样本|sample|n\s*=|分组|对照|control|重复|replicate/i.test(materialText) ? "已出现" : "待补充",
      detail: /样本|sample|n\s*=|分组|对照|control|重复|replicate/i.test(materialText) ? "材料中已有样本、分组或对照线索。" : "缺少样本量、分组、对照或重复数，结论边界会很弱。",
    },
    {
      label: "结果证据",
      value: /结果|figure|fig\.|图|p\s*[<=>]|显著|统计|差异|fold|表达/i.test(materialText) ? "已出现" : "待补充",
      detail: /结果|figure|fig\.|图|p\s*[<=>]|显著|统计|差异|fold|表达/i.test(materialText) ? "材料中已有结果、图表或统计线索。" : "缺少结果描述、图注或统计标记，不能判断证据强度。",
    },
  ];
  const missingFields = materialChecks.filter((item) => item.value === "待补充" || item.value === "偏少").map((item) => item.label);
  const taskActions: Record<string, string[]> = {
    文献精读: ["先抽取研究问题、核心假设和主要证据。", "把作者结论和材料外推断分开。", "优先标注原文未说明的信息。"],
    实验设计检查: ["先检查变量、对照、重复数和统计方法是否匹配。", "把必须修改项和人工确认项分开。", "说明每个风险会影响哪一种结论。"],
    图表解读: ["先读取坐标轴、单位、分组和统计标记。", "把观察事实、合理推断和不能支持的结论分开。", "标出需要回看图注或方法的点。"],
    论文逻辑检查: ["先逐句找结论和证据的对应关系。", "标出证据跳跃、术语不一致和过度表达。", "给出可替换的克制表述。"],
    审稿意见回应: ["先把审稿意见拆成可执行任务。", "区分已完成修改、需要补充分析和无法补做的限制。", "逐条生成回应结构。"],
    术语一致性检查: ["先列出核心术语、缩写和变量名。", "检查首次定义、图文一致性和同义词混用。", "给出建议统一写法。"],
  };
  const activeTaskActions = taskActions[activePrompt.title] ?? activePrompt.output;
  const reportDrafts: Record<string, string[]> = {
    文献精读: [
      materialText ? "从题目、摘要和方法段落抽取研究问题；没有原文时只保留为待核查项。" : "等待论文题目、摘要或 DOI。",
      `可作为证据候选：${evidenceSummary}`,
      missingFields.length ? `当前局限主要来自 ${missingFields.join("、")} 不足。` : "局限性仍需从作者原文、方法限制和结果覆盖范围中抽取。",
      "优先回查样本量、方法细节、统计标记和作者是否承认局限。",
    ],
    实验设计检查: [
      /对照|control|分组/i.test(materialText) ? "已有对照或分组线索，下一步检查每组是否只改变一个核心变量。" : "需要先补充对照组、处理组和变量设置。",
      /n\s*=|样本|重复|replicate/i.test(materialText) ? "已有样本或重复线索，下一步判断是否支持统计检验。" : "重复数和样本量缺失，不能判断统计可靠性。",
      /统计|p\s*[<=>]|显著/i.test(materialText) ? "已有统计线索，需确认方法是否匹配数据类型。" : "统计方法缺失，建议列为人工确认项。",
      "把会影响核心结论的风险放入必须修改，把表达和记录问题放入建议修改。",
    ],
    图表解读: [
      /图|figure|fig\./i.test(materialText) ? "材料中已有图表线索，先读取图号、坐标轴、单位和分组。" : "需要补充图号、图注、坐标轴和单位。",
      `观察事实只来自图注或结果描述：${evidenceSummary}`,
      "因果关系、机制解释和外推结论先列为不能支持，除非材料明确给出实验设计证据。",
      "下一步回看图注、方法、统计标记和原始分组定义。",
    ],
    论文逻辑检查: [
      "先把讨论段落中的每个结论拆成一句话，并对应到结果摘要。",
      `可先核查的材料行：${evidenceSummary}`,
      "如果结论没有结果支持，改成更克制的推测或移入局限性。",
      "重点检查术语一致、引用位置、结果与讨论边界。",
    ],
    审稿意见回应: [
      /审稿|reviewer|意见/i.test(materialText) ? "已有审稿意见线索，可拆成实验、分析、改写、澄清四类任务。" : "需要粘贴审稿意见原文。",
      "每条回应保留感谢、理解、修改内容、修改位置和限制说明。",
      "不能补做的内容不要硬答，改为解释限制并说明已有证据能覆盖到哪里。",
      "下一步补充原文位置、已完成修改和无法补做的原因。",
    ],
    术语一致性检查: [
      "先列出术语、缩写、变量名和图表标签中的不同写法。",
      `可扫描的材料行：${evidenceSummary}`,
      "缩写首次出现、中文英文混用、变量名前后变化都标为风险。",
      "输出统一写法前，需要用户确认目标期刊或团队约定。",
    ],
  };
  const previewReportRows = activePrompt.output.map((label, index) => ({
    label,
    body: (reportDrafts[activePrompt.title] ?? [])[index] ?? "根据材料生成对应栏目，缺少证据时标注待补充。",
  }));
  const reviewerQuestions = [
    missingFields.length ? `需要先补充 ${missingFields.join("、")} 吗？` : "这些材料行是否就是你希望 Agent 重点引用的证据？",
    activePrompt.checks[0],
    activeMode.outputs.includes("待确认问题") ? "哪些问题需要放到人工复核清单里确认？" : "哪些结论必须保持保守表述？",
  ];
  const citationAuditItems = [
    {
      label: "来源标识",
      status: /doi|pmid|arxiv|期刊|journal|作者|年份|题目/i.test(materialText) ? "已出现" : "待补充",
      evidence: /doi|pmid|arxiv|期刊|journal|作者|年份|题目/i.test(materialText) ? "材料里出现题目、作者、年份、期刊、DOI、PMID 或 arXiv 线索。" : "还缺少可回查来源，不能把模型生成内容当成文献事实。",
      action: "记录 DOI/PMID/arXiv、题目、作者年份或原文链接，至少保留一种可回查标识。",
    },
    {
      label: "图表定位",
      status: /figure|fig\.|图|表|table|图注/i.test(materialText) ? "已出现" : "待补充",
      evidence: /figure|fig\.|图|表|table|图注/i.test(materialText) ? "材料里出现图号、图注、表格或图表线索。" : "还缺少图号、图注或表格定位，图表解读难以回到原文。",
      action: "补充图号、图注、坐标轴、单位、分组和统计标记。",
    },
    {
      label: "样本统计",
      status: /n\s*=|样本|sample|重复|replicate|统计|p\s*[<=>]|显著/i.test(materialText) ? "已出现" : "待补充",
      evidence: /n\s*=|样本|sample|重复|replicate|统计|p\s*[<=>]|显著/i.test(materialText) ? "材料里出现样本量、重复数、统计方法或显著性线索。" : "还缺少样本量、重复数或统计信息，不能判断结果稳健性。",
      action: "补充 n 值、重复类型、统计检验、p 值或误差线说明。",
    },
    {
      label: "结论边界",
      status: /局限|限制|不能|推测|可能|需要验证|correlation|association/i.test(materialText) ? "已出现" : "待补充",
      evidence: /局限|限制|不能|推测|可能|需要验证|correlation|association/i.test(materialText) ? "材料里出现局限、推测、相关或待验证提示。" : "还缺少结论边界，容易把相关、推测或单图结果写成定论。",
      action: "写明哪些结论由材料支持，哪些只是推测，哪些必须回到原文或实验验证。",
    },
  ];
  const citationAuditOutput = `【科研 Agent 引用核查记录】
任务：${activePrompt.title}
工作模式：${activeMode.title}
推荐路由：${suggestedRoute.title}

一、来源核查
${citationAuditItems.map((item, index) => `${index + 1}. ${item.label}：${item.status}
证据状态：${item.evidence}
下一步：${item.action}`).join("\n\n")}

二、当前证据候选
${visibleEvidenceLines.length ? visibleEvidenceLines.map((line, index) => `${index + 1}. ${line}`).join("\n") : "当前没有可引用材料行。"}

三、必须保留的边界
1. 不编造 DOI、参考文献、图号、样本量或统计结果。
2. 没有来源标识时，final_report 只能写成待核查摘要。
3. 每个推断必须连接到 evidence_items 或 missing_fields。
4. 会影响实验、投稿或署名责任的判断必须人工复核。`;
  const researchAgentSkillPrompt = `---
name: research-agent
description: Use when a learner wants to turn research material into a traceable task route, evidence table, missing-field list, risk flags, reviewer questions, and a conservative report without inventing citations or conclusions.
---

# Research Agent

## Role

You are a research-learning agent for an adult learner. Help the learner organize research material into traceable evidence, cautious inferences, missing information, and next actions. Do not act as an automatic paper writer, citation generator, statistician, ethics reviewer, or final decision maker.

## Input

Ask for or infer these fields:

- Task: literature reading, figure interpretation, experimental-design check, paper-logic check, reviewer-response planning, or terminology consistency check.
- Source boundary: DOI, PMID, arXiv, paper title, figure number, table number, draft section, notes, or unknown.
- Material: abstract, methods, figure legend, results paragraph, design notes, reviewer comments, or draft text.
- Learner goal: what the learner wants to understand, check, rewrite, or decide.
- Risk concern: overclaiming, missing control, small sample size, weak statistics, citation mismatch, unclear terminology, or unknown.
- Output format: evidence table, study record, report outline, revision plan, reviewer questions, or API JSON contract.

If the source boundary or material is missing, ask at most two short questions. If the learner continues without answering, label the source boundary as unknown and keep conclusions conservative.

## Workflow

1. Classify the task route from material signals.
2. Summarize the provided material in 2-4 sentences without adding outside facts.
3. Extract evidence_items as direct material lines or paraphrases tied to source locations.
4. Separate observation, inference, missing_fields, and risk_flags.
5. Generate reviewer_questions that the learner must answer before trusting the output.
6. Produce a conservative final_report where every claim links to evidence_items, missing_fields, or risk_flags.
7. Add a citation_check with source identifiers, figure/table positioning, sample/statistics clues, and conclusion boundaries.
8. Finish with next_actions that the learner can actually perform.

## Task Routes

- Literature reading: extract research question, hypothesis, methods, evidence, author conclusion, limitations, and source-dependent checks.
- Figure interpretation: read axes, units, groups, statistics, trend, uncertainty, what the figure supports, and what it cannot support.
- Experimental-design check: inspect variables, controls, replicates, sample size, statistics, confounders, and conclusions affected by each risk.
- Paper-logic check: map each conclusion to result evidence, find overclaiming, missing citations, terminology drift, and safer wording.
- Reviewer response: classify each comment into experiment, analysis, rewrite, clarification, limitation, or impossible-to-complete item.
- Terminology consistency: scan term variants, abbreviation first use, figure/body consistency, variable names, and proposed unified wording.

## Output Contract

Return these fields in a stable structure:

1. task
2. source_boundary
3. material_summary
4. route_reason
5. evidence_items
6. inference_items
7. missing_fields
8. risk_flags
9. citation_check
10. reviewer_questions
11. final_report
12. next_actions

## Evidence Rules

- Every evidence_item must include source_text or source_location.
- Every inference_item must say which evidence_items support it.
- If support is weak, mark the inference as tentative.
- If material is absent, write missing_fields instead of inventing content.
- Do not invent DOI, PMID, reference titles, figure numbers, sample size, p values, species, methods, or author conclusions.
- Keep correlation, association, mechanism, causation, and speculation separate.

## Completion Gate

Before finishing, check that the learner has a usable output:

- At least one evidence_item or a clear statement that no evidence line was provided.
- At least three missing_fields or risk_flags when the material is incomplete.
- At least three reviewer_questions for manual checking.
- A final_report that avoids unsupported claims.
- Next actions written as concrete checks, not vague advice.

If any gate is missing, add it before the final answer.`;
  const boundaryItems = [
    "不保证论文结论正确，只整理材料和证据关系。",
    "不编造引用、DOI、样本量或统计结果；材料没有就标为待补充。",
    "不替代统计分析、伦理审批、临床/高风险决策或最终署名责任。",
    "接入外部模型时也要保留人工确认，最终结论由用户复核后使用。",
  ];
  const agentRequestPayload = {
    version: "research-agent-local-v1",
    task: activePrompt.title,
    suggested_task: suggestedRoute.title,
    route: {
      confidence: routeConfidence,
      score: suggestedRoute.score,
      matched_signals: suggestedRoute.matchedSignals,
      fallback_note: suggestedRoute.matchedSignals.length ? "" : "insufficient material signals",
    },
    mode: {
      name: activeMode.title,
      instruction: activeMode.instruction,
    },
    material: {
      text: materialText,
      line_count: materialLines.length,
      character_count: materialText.length,
      evidence_candidates: visibleEvidenceLines,
      missing_fields: missingFields,
    },
    workflow: activeTaskActions,
    quality_checks: activePrompt.checks,
    output_contract: apiOutputFields,
    report_sections: previewReportRows.map((item) => ({ section: item.label, draft: item.body })),
    reviewer_questions: reviewerQuestions,
    human_boundaries: boundaryItems,
  };
  const acceptanceChecks = [
    {
      label: "证据可追溯",
      passed: visibleEvidenceLines.length > 0,
      detail: visibleEvidenceLines.length > 0 ? "至少有 1 条材料行可作为证据候选。" : "缺少可引用材料行，模型输出应保持为任务框架。",
    },
    {
      label: "缺口显式标注",
      passed: missingFields.length === 0,
      detail: missingFields.length ? `需要在 missing_fields 中保留：${missingFields.join("、")}。` : "当前材料缺口已满足初步分析要求。",
    },
    {
      label: "人工复核保留",
      passed: reviewerQuestions.length >= 3,
      detail: "输出必须包含 reviewer_questions，不能把风险判断自动定稿。",
    },
  ];
  const learnerResearchReviewAnswers = {
    question: researchQuestionDraft.trim(),
    unsupportedClaim: unsupportedClaimDraft.trim(),
    citationToVerify: citationToVerifyDraft.trim(),
    nextAction: nextResearchActionDraft.trim(),
  };
  const learnerResearchReviewFields = [
    {
      id: "research-question-draft",
      label: "我本次要判断",
      prompt: "写成一个可回答的问题，不要只写主题名。",
      value: researchQuestionDraft,
      setter: setResearchQuestionDraft,
      placeholder: activePrompt.title === "图表解读" ? "这张图能支持哪个观察事实，不能支持哪个机制结论？" : "这段材料能支持哪个结论，哪些信息还不够？",
      pass: learnerResearchReviewAnswers.question.length >= 18 && /能|不能|是否|为什么|支持|判断|解释/.test(learnerResearchReviewAnswers.question),
      passText: "问题需要能被证据回答或反驳。",
    },
    {
      id: "unsupported-claim-draft",
      label: "暂不采信的结论",
      prompt: "写出一个当前材料还不能支持的说法。",
      value: unsupportedClaimDraft,
      setter: setUnsupportedClaimDraft,
      placeholder: "当前材料还不能直接证明因果机制、统计稳健性或完整实验结论。",
      pass: learnerResearchReviewAnswers.unsupportedClaim.length >= 18 && /不能|不支持|暂不|缺少|待核查|过度/.test(learnerResearchReviewAnswers.unsupportedClaim),
      passText: "要明确写出暂不采信或证据不足的结论。",
    },
    {
      id: "citation-to-verify-draft",
      label: "优先回查来源",
      prompt: "写出最需要回查的 DOI、图号、方法、样本量或统计标记。",
      value: citationToVerifyDraft,
      setter: setCitationToVerifyDraft,
      placeholder: visibleEvidenceLines[0] ? `先回查：${visibleEvidenceLines[0]}` : "先回查 DOI / 图号 / 样本量 / 统计方法。",
      pass: learnerResearchReviewAnswers.citationToVerify.length >= 12 && /DOI|PMID|图|表|方法|样本|统计|来源|原文|回查|figure|fig/i.test(learnerResearchReviewAnswers.citationToVerify),
      passText: "要落到一个可回查来源或材料字段。",
    },
    {
      id: "next-research-action-draft",
      label: "下一步动作",
      prompt: "写成下一步马上能做的检查、补充或改写动作。",
      value: nextResearchActionDraft,
      setter: setNextResearchActionDraft,
      placeholder: reviewerQuestions[0],
      pass: learnerResearchReviewAnswers.nextAction.length >= 12 && /补充|回查|删除|改写|比较|核对|确认|复核|标注|检查/.test(learnerResearchReviewAnswers.nextAction),
      passText: "下一步要是可执行动作。",
    },
  ];
  const learnerResearchReviewScore = learnerResearchReviewFields.filter((field) => field.pass).length;
  const filledLearnerResearchReview = {
    question: learnerResearchReviewAnswers.question || (activePrompt.title === "图表解读" ? "这张图能支持哪个观察事实，不能支持哪个机制结论？" : "这段材料能支持哪个结论，哪些信息还不够？"),
    unsupportedClaim: learnerResearchReviewAnswers.unsupportedClaim || "当前材料还不能直接证明因果机制、统计稳健性或完整实验结论。",
    citationToVerify: learnerResearchReviewAnswers.citationToVerify || (visibleEvidenceLines[0] ? `先回查：${visibleEvidenceLines[0]}` : "先回查 DOI / 图号 / 样本量 / 统计方法。"),
    nextAction: learnerResearchReviewAnswers.nextAction || reviewerQuestions[0],
  };
  const agentRequestJson = JSON.stringify({
    ...agentRequestPayload,
    learner_review: {
      completion_score: `${learnerResearchReviewScore}/4`,
      question: filledLearnerResearchReview.question,
      unsupported_claim: filledLearnerResearchReview.unsupportedClaim,
      citation_to_verify: filledLearnerResearchReview.citationToVerify,
      next_action: filledLearnerResearchReview.nextAction,
    },
  }, null, 2);
  const agentResponseContract = {
    version: "research-agent-response-v1",
    required_fields: apiOutputFields,
    expected_response: {
      task: activePrompt.title,
      material_summary: "用 2-4 句概括用户提供的材料，不补充材料外事实。",
      evidence_items: visibleEvidenceLines.map((line, index) => ({
        id: `evidence_${index + 1}`,
        source_text: line,
        supports: activePrompt.output[Math.min(index, activePrompt.output.length - 1)] ?? activePrompt.title,
      })),
      inference_items: previewReportRows.map((item) => ({
        section: item.label,
        inference: item.body,
        evidence_required: true,
      })),
      missing_fields: missingFields,
      risk_flags: acceptanceChecks.filter((item) => !item.passed).map((item) => item.label),
      reviewer_questions: reviewerQuestions,
      final_report: previewReportRows.map((item) => `${item.label}：${item.body}`).join("\n"),
    },
    acceptance_checks: acceptanceChecks,
  };
  const agentResponseJson = JSON.stringify(agentResponseContract, null, 2);
  const localPreviewOutput = `【本地 Agent 预览】
任务：${activePrompt.title}
工作模式：${activeMode.title}
材料状态：${materialText ? `${materialLines.length} 行，${materialText.length} 字符` : "未填写材料"}

一、材料核查
${materialChecks.map((item) => `${item.label}：${item.value}。${item.detail}`).join("\n")}

二、任务执行顺序
${activeTaskActions.map((item, index) => `${index + 1}. ${item}`).join("\n")}

三、当前证据边界
${missingFields.length ? `需要补充：${missingFields.join("、")}。` : "材料具备进入模型分析的基本线索，仍需人工确认原文来源。"}

四、任务路由
推荐任务：${suggestedRoute.title}
置信度：${routeConfidence}
命中线索：${routeMatchedSignals}

五、API Agent 输出字段建议
${apiOutputFields.join(", ")}

六、引用核查
${citationAuditItems.map((item, index) => `${index + 1}. ${item.label}：${item.status}。${item.evidence}`).join("\n")}

七、API 请求 JSON
${agentRequestJson}

八、API 返回契约
${agentResponseJson}

九、分析报告草稿
${previewReportRows.map((item) => `${item.label}：${item.body}`).join("\n")}

十、复核问题
${reviewerQuestions.map((item, index) => `${index + 1}. ${item}`).join("\n")}

十一、我的复核记录
完成度：${learnerResearchReviewScore}/4
1. 我本次要判断：${filledLearnerResearchReview.question}
2. 暂不采信的结论：${filledLearnerResearchReview.unsupportedClaim}
3. 优先回查来源：${filledLearnerResearchReview.citationToVerify}
4. 下一步动作：${filledLearnerResearchReview.nextAction}`;
  const researchRecordOutput = `【科研 Agent 研究记录】
任务：${activePrompt.title}
工作模式：${activeMode.title}
材料状态：${materialText ? `${materialLines.length} 行，${materialText.length} 字符` : "未填写材料"}
推荐路由：${suggestedRoute.title}
路由置信度：${routeConfidence}
命中线索：${routeMatchedSignals}

一、材料摘要
${visibleEvidenceLines.length ? visibleEvidenceLines.map((line, index) => `${index + 1}. ${line}`).join("\n") : "当前没有可引用材料行。"}

二、证据候选
${visibleEvidenceLines.length ? visibleEvidenceLines.map((line, index) => `${index + 1}. ${line}`).join("\n") : "需要先补充原文、图注、方法或结果描述。"}

三、缺失字段
${missingFields.length ? missingFields.map((field, index) => `${index + 1}. ${field}`).join("\n") : "当前材料具备初步分析线索，仍需回查原文来源。"}

四、风险标记
${acceptanceChecks.map((item, index) => `${index + 1}. ${item.label}：${item.passed ? "通过" : "待补"}。${item.detail}`).join("\n")}

五、引用核查
${citationAuditItems.map((item, index) => `${index + 1}. ${item.label}：${item.status}。${item.action}`).join("\n")}

六、报告草稿
${previewReportRows.map((item, index) => `${index + 1}. ${item.label}：${item.body}`).join("\n")}

七、人工复核问题
${reviewerQuestions.map((item, index) => `${index + 1}. ${item}`).join("\n")}

八、下一步动作
${activeTaskActions.map((item, index) => `${index + 1}. ${item}`).join("\n")}

九、我的复核记录
完成度：${learnerResearchReviewScore}/4
1. 我本次要判断：${filledLearnerResearchReview.question}
2. 暂不采信的结论：${filledLearnerResearchReview.unsupportedClaim}
3. 优先回查来源：${filledLearnerResearchReview.citationToVerify}
4. 下一步动作：${filledLearnerResearchReview.nextAction}`;
  const marketNeeds = [
    {
      title: "科研新人",
      body: "读完论文却不知道结论从哪来，需要把研究问题、方法、结果和局限拆成可核查条目，而不是得到一段看似完整的总结。",
    },
    {
      title: "实验与投稿",
      body: "实验设计、讨论段落和审稿回复需要先找风险，再决定哪些内容能写、哪些必须回查，避免把 AI 当成自动定稿工具。",
    },
    {
      title: "科研转译",
      body: "你可以把真实材料改写成进入问题、图表解读和可复用的知识卡，同时保留证据边界和不确定性。",
    },
  ];
  const productModules = [
    { title: "任务路由", body: "识别当前材料更适合文献精读、实验设计检查、图表解读、论文逻辑检查、审稿回应还是术语一致性检查。" },
    { title: "证据表", body: "把原文证据、合理推断、缺失信息和风险提醒拆开，要求每个结论都能回到材料行。" },
    { title: "质控闸门", body: "在生成报告前先检查样本、分组、结果证据、统计和人工复核问题，材料不足时不输出强结论。" },
    { title: "报告框架", body: "生成可复制的复核摘要、论文修改建议、图表解读报告、审稿回复结构或术语统一表。" },
    { title: "API 契约", body: "定义请求 JSON、返回字段和验收条件，后续接模型时仍保持可追踪、可复核、可拒绝。" },
  ];
  const marketSignals = [
    {
      title: "文献综述工具正在做流程化",
      body: "检索、筛选、数据抽取和报告生成是主流科研 AI 工具的核心方向，所以这个工作台优先把任务拆成可执行流程。",
    },
    {
      title: "证据表比长总结更可靠",
      body: "整理科研材料时，真正要保留的是材料来源、证据字段、缺失信息和引用边界，而不是一段无法回查的流畅总结。",
    },
    {
      title: "引用和参考文献需要单独核查",
      body: "AI 写作容易出现引用错配或凭空引用，因此外部模型返回也要保留 citation_check 和 reviewer_questions，而不是直接输出终稿。",
    },
    {
      title: "多步 Agent 适合做研究助理，不适合替代作者",
      body: "任务规划、阅读、分析和报告可以自动化一部分，但研究判断、实验伦理、统计解释和最终署名仍必须由人负责。",
    },
  ];
  const useCaseBlueprints = [
    {
      title: "读论文",
      input: "粘贴摘要、方法和结果图注",
      agent: "抽取研究问题、核心证据、作者结论和原文未说明的内容",
      output: "一张可复核的精读卡和待核查清单",
    },
    {
      title: "改实验设计",
      input: "粘贴分组、样本量、变量和统计方法",
      agent: "检查对照、重复数、变量混杂和统计方法匹配",
      output: "必须修改、建议修改、可以保留、人工确认四栏",
    },
    {
      title: "讲图表",
      input: "粘贴图号、图注、坐标轴、分组和显著性标记",
      agent: "区分观察事实、合理推断和不能支持的结论",
      output: "可用于自学复述或汇报的图表解读稿",
    },
    {
      title: "回审稿",
      input: "粘贴审稿意见、原文位置和已完成修改",
      agent: "把意见拆成补实验、补分析、改写解释和礼貌澄清",
      output: "逐条回应结构、修改位置和限制说明",
    },
  ];
  const completionStandards = [
    "至少得到 1 条可回到材料行的证据候选。",
    "缺失字段必须出现在 missing_fields 或研究记录里。",
    "报告草稿中的每个推断都要能连接到 evidence_items、risk_flags 或 reviewer_questions。",
    "复制研究记录前，先完成一次引用核查。",
  ];
  const roadmapItems = [
    {
      title: "本页可直接完成",
      body: "任务选择、材料模板、模式切换、路由建议、本地预览、任务包复制和 API JSON 契约。",
    },
    {
      title: "API 接入契约",
      body: "复制 API JSON 后可以接入外部模型，返回字段必须包含 evidence_items、missing_fields、risk_flags 和 final_report。",
    },
    {
      title: "引用核查清单",
      body: "对 DOI、参考文献、图表编号和材料来源单独核查，把模型生成内容与真实文献记录分开验证。",
    },
  ];
  const sourceGroundedSignals = [
    {
      title: "语义检索与报告生成",
      source: "Elicit API",
      body: "公开 API 文档把论文语义检索、临床试验检索和自动报告作为核心能力，说明科研 Agent 需要可编排的 search/report 接口。",
      href: "https://docs.elicit.com/",
    },
    {
      title: "多步检索与筛选",
      source: "Consensus Research Agent",
      body: "Consensus 的 Pro/Deep 模式强调多步搜索、过滤、跨论文阅读和带引用回答，因此本工具把任务路由、过滤信号和证据字段前置。",
      href: "https://help.consensus.app/en/articles/9922660-how-to-search-best-practices",
    },
    {
      title: "参考文献核查",
      source: "scite API",
      body: "scite API 提供引用数据、citation tallies 和 reference check，说明科研工作流不能只生成总结，还要保留引用核查和风险标记。",
      href: "https://api.scite.ai/docs",
    },
  ];
  const productReferences = [
    { title: "Elicit systematic review / API", href: "https://docs.elicit.com/" },
    { title: "Consensus search best practices", href: "https://help.consensus.app/en/articles/9922660-how-to-search-best-practices" },
    { title: "scite API reference check", href: "https://api.scite.ai/docs" },
  ];
  const agentCards = [
    {
      title: "当前版本",
      body: "能直接使用：本地生成模型指令、任务包、证据边界、验收清单和 API 契约；材料只在浏览器里编辑，不上传，也不调用 API。",
    },
    {
      title: "API 接入方式",
      body: "复制 API JSON 交给外部模型执行，返回内容必须按契约拆成证据、推断、风险、待核查点和汇报摘要。",
    },
    {
      title: "不做什么",
      body: "不替你判断论文一定正确，不编造引用，不代替统计分析、伦理审批或最终署名责任。",
    },
  ];
  const workflowSteps = [
    { label: "材料", body: activePrompt.input, color: "var(--cherry-blue-light)" },
    { label: "模式", body: activeMode.title, color: "var(--cherry-yellow-light)" },
    { label: "质控", body: `${activePrompt.checks.length} 项检查`, color: "var(--cherry-sage-light)" },
    { label: "任务包", body: `${activePrompt.output.length} 个栏目`, color: "var(--cherry-peach-light)" },
  ];
  const finalPrompt = `${activePrompt.text}

【我的材料】
${material.trim() || "请在这里粘贴材料。"}

【工作模式】
${activeMode.title}：${activeMode.instruction}

【输出格式】
请使用清晰小标题，并包含：${[...activePrompt.output, ...activeMode.outputs].join("、")}。

【质量要求】
${activePrompt.checks.map((check, index) => `${index + 1}. ${check}`).join("\n")}`;
  const taskPackOutput = `【科研 Agent 任务包】
任务类型：${activePrompt.title}
适用材料：${activePrompt.input}
工作模式：${activeMode.title}

一、要交给模型的指令
${finalPrompt}

二、输出验收清单
${activePrompt.checks.map((check, index) => `${index + 1}. ${check}`).join("\n")}

三、需要得到的栏目
${[...activePrompt.output, ...activeMode.outputs].map((item, index) => `${index + 1}. ${item}`).join("\n")}

四、人工复核提醒
1. 结论必须能回到原文、数据或实验设计。
2. 如果模型补充了材料中没有的信息，需要标出并回查来源。
3. 对会影响实验、投稿或伦理判断的内容，保留人工最终决定。

五、本地预览
${localPreviewOutput}`;

  async function copyPrompt() {
    const copiedToClipboard = await copyText(finalPrompt);
    if (copiedToClipboard) {
      setCopied(true);
      setCopiedPack(false);
      setCopiedPreview(false);
      setCopiedJson(false);
      setCopiedResponseJson(false);
      setCopiedResearchRecord(false);
      setCopiedCitationAudit(false);
      setCopiedResearchSkill(false);
      setCopyStatus("模型指令已复制到剪贴板。");
      window.setTimeout(() => setCopied(false), 1400);
      return;
    }

    setCopied(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyTaskPack() {
    const copiedToClipboard = await copyText(taskPackOutput);
    if (copiedToClipboard) {
      setCopiedPack(true);
      setCopied(false);
      setCopiedPreview(false);
      setCopiedJson(false);
      setCopiedResponseJson(false);
      setCopiedResearchRecord(false);
      setCopiedCitationAudit(false);
      setCopiedResearchSkill(false);
      setCopyStatus("任务包已复制到剪贴板。");
      window.setTimeout(() => setCopiedPack(false), 1400);
      return;
    }

    setCopiedPack(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyLocalPreview() {
    const copiedToClipboard = await copyText(localPreviewOutput);
    if (copiedToClipboard) {
      setCopiedPreview(true);
      setCopied(false);
      setCopiedPack(false);
      setCopiedJson(false);
      setCopiedResponseJson(false);
      setCopiedResearchRecord(false);
      setCopiedCitationAudit(false);
      setCopiedResearchSkill(false);
      setCopyStatus("本地预览已复制到剪贴板。");
      window.setTimeout(() => setCopiedPreview(false), 1400);
      return;
    }

    setCopiedPreview(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyAgentJson() {
    const copiedToClipboard = await copyText(agentRequestJson);
    if (copiedToClipboard) {
      setCopiedJson(true);
      setCopied(false);
      setCopiedPack(false);
      setCopiedPreview(false);
      setCopiedResponseJson(false);
      setCopiedResearchRecord(false);
      setCopiedCitationAudit(false);
      setCopiedResearchSkill(false);
      setCopyStatus("API 请求 JSON 已复制到剪贴板。");
      window.setTimeout(() => setCopiedJson(false), 1400);
      return;
    }

    setCopiedJson(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyResponseJson() {
    const copiedToClipboard = await copyText(agentResponseJson);
    if (copiedToClipboard) {
      setCopiedResponseJson(true);
      setCopied(false);
      setCopiedPack(false);
      setCopiedPreview(false);
      setCopiedJson(false);
      setCopiedResearchRecord(false);
      setCopiedCitationAudit(false);
      setCopiedResearchSkill(false);
      setCopyStatus("API 返回契约已复制到剪贴板。");
      window.setTimeout(() => setCopiedResponseJson(false), 1400);
      return;
    }

    setCopiedResponseJson(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyResearchRecord() {
    const copiedToClipboard = await copyText(researchRecordOutput);
    if (copiedToClipboard) {
      setCopiedResearchRecord(true);
      setCopied(false);
      setCopiedPack(false);
      setCopiedPreview(false);
      setCopiedJson(false);
      setCopiedResponseJson(false);
      setCopiedCitationAudit(false);
      setCopiedResearchSkill(false);
      setCopyStatus("研究记录已复制到剪贴板。");
      window.setTimeout(() => setCopiedResearchRecord(false), 1400);
      return;
    }

    setCopiedResearchRecord(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyCitationAudit() {
    const copiedToClipboard = await copyText(citationAuditOutput);
    if (copiedToClipboard) {
      setCopiedCitationAudit(true);
      setCopied(false);
      setCopiedPack(false);
      setCopiedPreview(false);
      setCopiedJson(false);
      setCopiedResponseJson(false);
      setCopiedResearchRecord(false);
      setCopiedResearchSkill(false);
      setCopyStatus("引用核查记录已复制到剪贴板。");
      window.setTimeout(() => setCopiedCitationAudit(false), 1400);
      return;
    }

    setCopiedCitationAudit(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  function clearResearchCopyStatus() {
    setCopied(false);
    setCopiedPack(false);
    setCopiedPreview(false);
    setCopiedJson(false);
    setCopiedResponseJson(false);
    setCopiedResearchRecord(false);
    setCopiedCitationAudit(false);
    setCopiedResearchSkill(false);
    setCopyStatus("");
  }

  function updateMaterial(value: string) {
    setMaterial(value);
    setActivePracticeCase("");
    setCopied(false);
    setCopiedPack(false);
    setCopiedPreview(false);
    setCopiedJson(false);
    setCopiedResponseJson(false);
    setCopiedResearchRecord(false);
    setCopiedCitationAudit(false);
    setCopiedResearchSkill(false);
    setHasRunPreview(false);
    setCopyStatus("");
  }

  function loadPracticeCase(caseItem: (typeof promptPracticeCases)[number]) {
    const nextPromptIndex = prompts.findIndex((prompt) => prompt.title === caseItem.task);
    if (nextPromptIndex >= 0) setActivePromptIndex(nextPromptIndex);
    setMaterial(caseItem.material);
    setActivePracticeCase(caseItem.title);
    setCopied(false);
    setCopiedPack(false);
    setCopiedPreview(false);
    setCopiedJson(false);
    setCopiedResponseJson(false);
    setCopiedResearchRecord(false);
    setCopiedCitationAudit(false);
    setCopiedResearchSkill(false);
    setResearchQuestionDraft("");
    setUnsupportedClaimDraft("");
    setCitationToVerifyDraft("");
    setNextResearchActionDraft("");
    setHasRunPreview(false);
    setCopyStatus(`已载入${caseItem.title}，可以直接运行本地预览。`);
  }

  function fillMaterialTemplate() {
    updateMaterial(activePrompt.materialTemplate);
  }

  function clearMaterial() {
    updateMaterial("");
  }

  function applySuggestedTask() {
    setActivePromptIndex(suggestedPromptIndex);
    setCopied(false);
    setCopiedPack(false);
    setCopiedPreview(false);
    setCopiedJson(false);
    setCopiedResponseJson(false);
    setCopiedResearchRecord(false);
    setCopiedCitationAudit(false);
    setCopiedResearchSkill(false);
    setResearchQuestionDraft("");
    setUnsupportedClaimDraft("");
    setCitationToVerifyDraft("");
    setNextResearchActionDraft("");
    setHasRunPreview(false);
    setCopyStatus(`已切换到推荐任务：${suggestedRoute.title}。`);
  }

  async function copyResearchAgentSkill() {
    const copiedToClipboard = await copyText(researchAgentSkillPrompt);
    if (copiedToClipboard) {
      setCopiedResearchSkill(true);
      setCopied(false);
      setCopiedPack(false);
      setCopiedPreview(false);
      setCopiedJson(false);
      setCopiedResponseJson(false);
      setCopiedResearchRecord(false);
      setCopiedCitationAudit(false);
      setCopyStatus("科研 Agent skill 已复制到剪贴板。");
      window.setTimeout(() => setCopiedResearchSkill(false), 1400);
      return;
    }

    setCopiedResearchSkill(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  return (
    <section id="prompt-kit-builder" style={{ display: "grid", gap: "1rem" }}>
      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "1rem", boxShadow: "0 8px 18px rgba(94,68,42,0.06)", display: "grid", gap: "0.8rem" }}>
        <div>
          <div style={{ color: "var(--cherry-forest)", fontWeight: 900, fontSize: "0.78rem", marginBottom: "0.3rem" }}>科研 Agent 工作台</div>
          <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.88rem", margin: 0 }}>
            这个工作台直接提供科研任务编排：选择任务、材料和工作模式后，页面会生成结构化指令、证据边界、质控清单、报告框架和 API JSON 契约。当前可用于本地整理材料，也可把复制的任务包交给外部模型执行。
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.65rem" }}>
          {agentCards.map((card) => (
            <div key={card.title} style={{ background: "var(--muted)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.7rem" }}>
              <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.8rem", marginBottom: "0.28rem" }}>{card.title}</strong>
              <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.55, fontWeight: 800 }}>{card.body}</span>
            </div>
          ))}
        </div>
        <div className="research-agent-skill-panel" style={{ background: "var(--muted)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.78rem", display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto", gap: "0.65rem", alignItems: "center" }}>
          <div>
            <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.84rem", marginBottom: "0.24rem" }}>科研 Agent skill</strong>
            <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.55, fontWeight: 800 }}>把任务路由、证据表、缺失字段、风险标记、引用核查和复核问题固定成一套可复用协议。</span>
          </div>
          <a href="/skills/research-agent/SKILL.md" className="research-agent-skill-link" style={{ background: "var(--card)", color: "var(--cherry-forest)", border: "1.5px solid rgba(58,92,62,0.24)", borderRadius: 999, padding: "0.48rem 0.82rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem", textDecoration: "none", whiteSpace: "nowrap" }}>
            打开 Skill
          </a>
          <button type="button" onClick={copyResearchAgentSkill} aria-describedby="prompt-copy-status" style={{ background: "var(--card)", color: "var(--cherry-forest)", border: "1.5px solid rgba(58,92,62,0.24)", borderRadius: 999, padding: "0.48rem 0.82rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem", whiteSpace: "nowrap" }}>
            {copiedResearchSkill ? "已复制" : "复制 Skill"}
          </button>
        </div>
        <div style={{ background: "var(--cherry-sage-light)", border: "1px solid rgba(93,140,101,0.2)", borderRadius: 8, padding: "0.78rem", display: "grid", gap: "0.65rem" }}>
          <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.84rem" }}>能直接完成什么</strong>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.58rem" }}>
            {useCaseBlueprints.map((item) => (
              <div key={item.title} style={{ background: "rgba(250,247,241,0.72)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.65rem" }}>
                <strong style={{ display: "block", color: "var(--cherry-forest)", fontSize: "0.78rem", marginBottom: "0.34rem" }}>{item.title}</strong>
                <div style={{ display: "grid", gap: "0.32rem", color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.48, fontWeight: 800 }}>
                  <span><strong style={{ color: "var(--cherry-warm-brown)" }}>输入：</strong>{item.input}</span>
                  <span><strong style={{ color: "var(--cherry-warm-brown)" }}>处理：</strong>{item.agent}</span>
                  <span><strong style={{ color: "var(--cherry-warm-brown)" }}>产出：</strong>{item.output}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 8, padding: "0.78rem", display: "grid", gap: "0.58rem" }}>
          <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.84rem" }}>本次完成标准</strong>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.52rem" }}>
            {completionStandards.map((item, index) => (
              <div key={item} style={{ background: "rgba(250,247,241,0.72)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.62rem", display: "grid", gridTemplateColumns: "24px minmax(0, 1fr)", gap: "0.45rem", alignItems: "start" }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--cherry-red)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 900 }}>{index + 1}</span>
                <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.52, fontWeight: 800 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem" }}>
          <div style={{ background: "var(--muted)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.78rem", display: "grid", gap: "0.55rem" }}>
            <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.82rem" }}>常见卡点</strong>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {marketNeeds.map((item) => (
                <div key={item.title} style={{ display: "grid", gridTemplateColumns: "72px minmax(0, 1fr)", gap: "0.55rem", alignItems: "start" }}>
                  <span style={{ color: "var(--cherry-forest)", fontWeight: 900, fontSize: "0.74rem" }}>{item.title}</span>
                  <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.55, fontWeight: 800 }}>{item.body}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "var(--muted)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.78rem", display: "grid", gap: "0.55rem" }}>
            <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.82rem" }}>能力边界</strong>
            <div style={{ display: "grid", gap: "0.42rem" }}>
              {boundaryItems.map((item, index) => (
                <div key={item} style={{ display: "grid", gridTemplateColumns: "22px minmax(0, 1fr)", gap: "0.46rem", alignItems: "start" }}>
                  <span style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--cherry-forest)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 900 }}>{index + 1}</span>
                  <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.55, fontWeight: 800 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.6rem" }}>
          {productModules.map((item) => (
            <div key={item.title} style={{ background: "rgba(250,247,241,0.72)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.68rem" }}>
              <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.78rem", marginBottom: "0.24rem" }}>{item.title}</strong>
              <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.5, fontWeight: 800 }}>{item.body}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "var(--muted)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.78rem", display: "grid", gap: "0.62rem" }}>
          <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.82rem" }}>使用原则</strong>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.58rem" }}>
            {marketSignals.map((item) => (
              <div key={item.title} style={{ background: "rgba(250,247,241,0.72)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.65rem" }}>
                <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.76rem", marginBottom: "0.28rem" }}>{item.title}</strong>
                <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.5, fontWeight: 800 }}>{item.body}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(220px, 0.75fr)", gap: "0.75rem" }}>
          <div style={{ background: "var(--muted)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.78rem", display: "grid", gap: "0.55rem" }}>
            <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.82rem" }}>使用层级</strong>
            <div style={{ display: "grid", gap: "0.48rem" }}>
              {roadmapItems.map((item, index) => (
                <div key={item.title} style={{ display: "grid", gridTemplateColumns: "24px minmax(0, 1fr)", gap: "0.48rem", alignItems: "start" }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: index === 0 ? "var(--cherry-forest)" : "var(--card)", color: index === 0 ? "#FAF7F1" : "var(--cherry-forest)", border: index === 0 ? "none" : "1px solid rgba(58,92,62,0.24)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 900 }}>{index + 1}</span>
                  <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.55, fontWeight: 800 }}>
                    <strong style={{ color: "var(--cherry-warm-brown)" }}>{item.title}：</strong>{item.body}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "var(--muted)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.78rem", display: "grid", gap: "0.55rem", alignContent: "start" }}>
            <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.82rem" }}>延伸查证</strong>
            {productReferences.map((item) => (
              <a key={item.href} href={item.href} target="_blank" rel="noreferrer" style={{ color: "var(--cherry-forest)", fontSize: "0.74rem", lineHeight: 1.45, fontWeight: 900, textDecoration: "none" }}>
                {item.title} →
              </a>
            ))}
          </div>
        </div>
        <div style={{ background: "var(--muted)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.78rem", display: "grid", gap: "0.62rem" }}>
          <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.82rem" }}>方法依据</strong>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.58rem" }}>
            {sourceGroundedSignals.map((item) => (
              <a key={item.href} href={item.href} target="_blank" rel="noreferrer" style={{ background: "rgba(250,247,241,0.72)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.65rem", textDecoration: "none" }}>
                <span style={{ display: "block", color: "var(--cherry-forest)", fontSize: "0.68rem", fontWeight: 900, marginBottom: "0.22rem" }}>{item.source}</span>
                <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.76rem", marginBottom: "0.28rem" }}>{item.title}</strong>
                <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.5, fontWeight: 800 }}>{item.body}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="prompt-builder-layout" style={{ display: "grid", gridTemplateColumns: "minmax(230px, 0.78fr) minmax(0, 1.3fr)", gap: "1rem", alignItems: "start" }}>
        <aside style={{ display: "grid", gap: "0.7rem" }}>
          {prompts.map((prompt, index) => {
            const active = activePromptIndex === index;
            return (
              <button key={prompt.title} type="button" aria-pressed={active} onClick={() => { setActivePromptIndex(index); setCopied(false); setCopiedPack(false); setCopiedPreview(false); setCopiedJson(false); setCopiedResponseJson(false); setCopiedResearchRecord(false); setCopiedCitationAudit(false); setHasRunPreview(false); setCopyStatus(""); }} style={{ textAlign: "left", background: active ? "var(--cherry-sage-light)" : "var(--card)", border: active ? "1.5px solid var(--cherry-forest)" : "1.5px solid var(--border)", borderRadius: 18, padding: "0.9rem", boxShadow: active ? "3px 5px 0px rgba(58,92,62,0.14)" : "3px 5px 0px rgba(94,68,42,0.05)", cursor: "pointer" }}>
                <div style={{ color: active ? "var(--cherry-forest)" : "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.35rem" }}>{prompt.title}</div>
                <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.55, marginBottom: "0.55rem" }}>{prompt.input}</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {prompt.output.slice(0, 2).map((item) => (
                    <span key={item} style={{ background: "rgba(250,247,241,0.78)", border: "1.5px solid rgba(94,68,42,0.1)", borderRadius: 999, padding: "0.16rem 0.48rem", color: "var(--cherry-forest)", fontSize: "0.68rem", fontWeight: 900 }}>
                      {item}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </aside>

        <div style={{ display: "grid", gap: "1rem" }}>
          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "1.2rem", boxShadow: "0 8px 18px rgba(94,68,42,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.8rem" }}>
              <div>
                <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "1.05rem" }}>{activePrompt.title}</div>
                <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.82rem", marginTop: "0.25rem" }}>输入材料：{activePrompt.input}</div>
              </div>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                <button type="button" onClick={copyPrompt} aria-describedby="prompt-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.55rem 0.95rem", fontWeight: 900, cursor: "pointer" }}>
                  {copied ? "已复制" : "复制模型指令"}
                </button>
                <button type="button" onClick={copyTaskPack} aria-describedby="prompt-copy-status" style={{ background: "var(--cherry-yellow-light)", color: "var(--cherry-warm-brown)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 999, padding: "0.55rem 0.95rem", fontWeight: 900, cursor: "pointer" }}>
                  {copiedPack ? "已复制" : "复制任务包"}
                </button>
                <button type="button" onClick={copyAgentJson} aria-describedby="prompt-copy-status" style={{ background: "var(--card)", color: "var(--cherry-forest)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.55rem 0.95rem", fontWeight: 900, cursor: "pointer" }}>
                  {copiedJson ? "已复制" : "复制 API JSON"}
                </button>
                <button type="button" onClick={copyResponseJson} aria-describedby="prompt-copy-status" style={{ background: "var(--card)", color: "var(--cherry-forest)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.55rem 0.95rem", fontWeight: 900, cursor: "pointer" }}>
                  {copiedResponseJson ? "已复制" : "复制返回契约"}
                </button>
              </div>
            </div>
            <div id="prompt-copy-status" role="status" aria-live="polite" style={{ minHeight: "1.2rem", color: "var(--cherry-forest)", fontSize: "0.78rem", fontWeight: 900, marginBottom: "0.65rem" }}>
              {copyStatus}
            </div>

            <div style={{ display: "grid", gap: "0.55rem", marginBottom: "0.9rem" }}>
              <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.82rem" }}>工作模式</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(154px, 1fr))", gap: "0.55rem" }}>
                {promptModes.map((mode, index) => {
                  const active = activeModeIndex === index;
                  return (
                    <button key={mode.title} type="button" aria-pressed={active} onClick={() => { setActiveModeIndex(index); setCopied(false); setCopiedPack(false); setCopiedPreview(false); setCopiedJson(false); setCopiedResponseJson(false); setCopiedResearchRecord(false); setCopiedCitationAudit(false); setHasRunPreview(false); setCopyStatus(""); }} style={{ textAlign: "left", background: active ? "var(--cherry-sage-light)" : "var(--muted)", border: active ? "1.5px solid var(--cherry-forest)" : "1.5px solid var(--border)", borderRadius: 14, padding: "0.68rem", cursor: "pointer" }}>
                      <strong style={{ display: "block", color: active ? "var(--cherry-forest)" : "var(--cherry-warm-brown)", fontSize: "0.8rem", marginBottom: "0.24rem" }}>{mode.title}</strong>
                      <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.48, fontWeight: 800 }}>{mode.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="prompt-workflow-grid" role="group" aria-label="科研 Agent 任务流程" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.62rem", marginBottom: "0.9rem" }}>
              {workflowSteps.map((item, index) => (
                <div key={item.label} style={{ background: item.color, border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 16, padding: "0.72rem", minHeight: 104, position: "relative", overflow: "hidden" }}>
                  <svg width="72" height="58" viewBox="0 0 72 58" fill="none" aria-hidden="true" focusable="false" style={{ position: "absolute", right: -8, bottom: -8, opacity: 0.72 }}>
                    {index === 0 ? (
                      <>
                        <rect x="14" y="8" width="34" height="44" rx="8" fill="rgba(250,247,241,0.9)" stroke="rgba(94,68,42,0.18)" strokeWidth="1.8" />
                        <path d="M22 20 H42 M22 30 H39 M22 40 H34" stroke="var(--cherry-blue)" strokeWidth="3" strokeLinecap="round" opacity="0.72" />
                        <circle cx="52" cy="17" r="7" fill="var(--cherry-yellow)" />
                      </>
                    ) : index === 1 ? (
                      <>
                        <path d="M15 39 C24 12 47 8 58 25 C46 44 29 48 15 39Z" fill="rgba(250,247,241,0.86)" stroke="rgba(94,68,42,0.16)" strokeWidth="1.8" />
                        <path d="M24 36 C35 29 43 22 53 17" stroke="var(--cherry-warm-brown)" strokeWidth="2.5" strokeLinecap="round" opacity="0.42" />
                        <circle cx="25" cy="35" r="4" fill="var(--cherry-red)" />
                        <circle cx="39" cy="27" r="4" fill="var(--cherry-sage)" />
                      </>
                    ) : index === 2 ? (
                      <>
                        <rect x="13" y="13" width="46" height="36" rx="12" fill="rgba(250,247,241,0.88)" stroke="rgba(94,68,42,0.16)" strokeWidth="1.8" />
                        <path d="M24 30 L31 37 L47 21" stroke="var(--cherry-forest)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="55" cy="40" r="5" fill="var(--cherry-yellow)" />
                      </>
                    ) : (
                      <>
                        <rect x="17" y="10" width="38" height="42" rx="9" fill="rgba(250,247,241,0.9)" stroke="rgba(94,68,42,0.16)" strokeWidth="1.8" />
                        <path d="M26 23 H46 M26 32 H43 M26 41 H39" stroke="var(--cherry-red)" strokeWidth="2.8" strokeLinecap="round" opacity="0.72" />
                        <path d="M50 16 L54 22 L61 23 L56 28 L57 35 L50 31 L44 35 L45 28 L40 23 L47 22Z" fill="var(--cherry-yellow)" />
                      </>
                    )}
                  </svg>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--cherry-forest)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 900, marginBottom: "0.5rem", position: "relative", zIndex: 1 }}>{index + 1}</div>
                  <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.82rem", marginBottom: "0.25rem", position: "relative", zIndex: 1 }}>{item.label}</div>
                  <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.7rem", lineHeight: 1.45, fontWeight: 800, position: "relative", zIndex: 1, paddingRight: 26 }}>{item.body}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--muted)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.78rem", marginBottom: "0.9rem", display: "grid", gap: "0.62rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.7rem", alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.86rem" }}>练习案例</div>
                  <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.5, marginTop: "0.18rem" }}>
                    先载入一份完整材料，观察 Agent 如何判断任务、证据边界和返回字段。
                  </div>
                </div>
                <span style={{ color: "var(--cherry-forest)", fontSize: "0.72rem", fontWeight: 900 }}>
                  {activePracticeCase ? `当前：${activePracticeCase}` : "当前：自定义材料"}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.48rem" }}>
                {promptPracticeCases.map((caseItem) => {
                  const active = activePracticeCase === caseItem.title;
                  return (
                    <button key={caseItem.title} type="button" aria-pressed={active} onClick={() => loadPracticeCase(caseItem)} style={{ textAlign: "left", background: active ? "var(--cherry-sage-light)" : "var(--card)", color: active ? "var(--cherry-forest)" : "var(--cherry-warm-brown)", border: active ? "1.5px solid var(--cherry-forest)" : "1.5px solid var(--border)", borderRadius: 14, padding: "0.62rem", fontWeight: 900, cursor: "pointer", fontSize: "0.76rem" }}>
                      {caseItem.title}
                    </button>
                  );
                })}
              </div>
            </div>

            <textarea
              value={material}
              onChange={(event) => updateMaterial(event.target.value)}
              style={{ width: "100%", minHeight: 154, resize: "vertical", border: "1.5px solid var(--border)", borderRadius: 16, padding: "0.9rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontSize: "0.9rem", lineHeight: 1.6, boxSizing: "border-box", marginBottom: "0.9rem" }}
              aria-label="科研材料输入框"
            />

            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: "0.9rem" }}>
              <button type="button" onClick={fillMaterialTemplate} style={{ background: "var(--cherry-sage-light)", color: "var(--cherry-forest)", border: "1.5px solid rgba(93,140,101,0.28)", borderRadius: 999, padding: "0.42rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                套用材料模板
              </button>
              <button type="button" onClick={clearMaterial} style={{ background: "var(--muted)", color: "var(--cherry-warm-brown)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.42rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                清空材料
              </button>
            </div>

            <div style={{ background: "var(--muted)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.85rem", marginBottom: "0.9rem", display: "grid", gap: "0.6rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.86rem" }}>任务路由建议</div>
                  <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.5, marginTop: "0.18rem" }}>
                    根据当前材料命中的科研信号，推荐先进入最匹配的处理流程。
                  </div>
                </div>
                <button type="button" onClick={applySuggestedTask} disabled={suggestedPromptIndex === activePromptIndex} style={{ background: suggestedPromptIndex === activePromptIndex ? "var(--card)" : "var(--cherry-forest)", color: suggestedPromptIndex === activePromptIndex ? "var(--cherry-warm-mid)" : "#FAF7F1", border: suggestedPromptIndex === activePromptIndex ? "1.5px solid var(--border)" : "none", borderRadius: 999, padding: "0.42rem 0.78rem", fontWeight: 900, cursor: suggestedPromptIndex === activePromptIndex ? "default" : "pointer", fontSize: "0.78rem" }}>
                  {suggestedPromptIndex === activePromptIndex ? "已在推荐任务" : "切换到推荐任务"}
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.5rem" }}>
                <div style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.62rem" }}>
                  <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.76rem", marginBottom: "0.2rem" }}>推荐任务</strong>
                  <span style={{ display: "block", color: "var(--cherry-forest)", fontSize: "0.78rem", lineHeight: 1.5, fontWeight: 900 }}>{suggestedRoute.title}</span>
                </div>
                <div style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.62rem" }}>
                  <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.76rem", marginBottom: "0.2rem" }}>路由置信度</strong>
                  <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.5, fontWeight: 800 }}>{routeConfidence}，命中 {suggestedRoute.score} 个信号</span>
                </div>
                <div style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.62rem" }}>
                  <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.76rem", marginBottom: "0.2rem" }}>命中线索</strong>
                  <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.5, fontWeight: 800 }}>{routeMatchedSignals}</span>
                </div>
              </div>
            </div>

            <div style={{ background: "var(--cherry-sage-light)", border: "1.5px solid rgba(93,140,101,0.28)", borderRadius: 8, padding: "0.85rem", marginBottom: "0.9rem", display: "grid", gap: "0.72rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.86rem" }}>我的复核记录</div>
                  <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.5, marginTop: "0.18rem", fontWeight: 800 }}>
                    先写下自己要判断的问题、暂不采信的结论、优先回查来源和下一步动作；复制研究记录时会一起带走。
                  </div>
                </div>
                <span role="status" aria-live="polite" style={{ background: learnerResearchReviewScore === 4 ? "var(--cherry-forest)" : "var(--card)", border: "1.5px solid rgba(94,68,42,0.14)", borderRadius: 999, padding: "0.28rem 0.68rem", color: learnerResearchReviewScore === 4 ? "#FAF7F1" : "var(--cherry-warm-brown)", fontSize: "0.72rem", fontWeight: 900 }}>
                  填写完成度 {learnerResearchReviewScore}/4
                </span>
              </div>
              <div className="research-review-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.62rem" }}>
                {learnerResearchReviewFields.map((field) => (
                  <label key={field.id} htmlFor={field.id} style={{ background: "rgba(250,247,241,0.76)", border: `1px solid ${field.pass ? "rgba(93,140,101,0.28)" : "rgba(94,68,42,0.12)"}`, borderRadius: 8, padding: "0.66rem", display: "grid", gap: "0.42rem", alignContent: "start", minHeight: 206 }}>
                    <span style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", alignItems: "start" }}>
                      <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.78rem" }}>{field.label}</strong>
                      <span style={{ color: field.pass ? "var(--cherry-forest)" : "var(--cherry-red)", fontSize: "0.66rem", fontWeight: 900, whiteSpace: "nowrap" }}>
                        {field.pass ? "可写入" : "待补"}
                      </span>
                    </span>
                    <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.7rem", lineHeight: 1.45, fontWeight: 800 }}>{field.prompt}</span>
                    <textarea
                      id={field.id}
                      value={field.value}
                      onChange={(event) => {
                        field.setter(event.currentTarget.value);
                        clearResearchCopyStatus();
                      }}
                      rows={4}
                      placeholder={field.placeholder}
                      style={{ width: "100%", minHeight: 88, resize: "vertical", border: "1.5px solid rgba(94,68,42,0.16)", borderRadius: 8, padding: "0.58rem", background: "#FAF7F1", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontSize: "0.76rem", lineHeight: 1.52, fontWeight: 800, boxSizing: "border-box" }}
                    />
                    <span style={{ color: field.pass ? "var(--cherry-forest)" : "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.42, fontWeight: 900 }}>
                      {field.pass ? "会进入 API JSON 和研究记录。" : field.passText}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ background: hasRunPreview ? "var(--cherry-sage-light)" : "var(--muted)", border: hasRunPreview ? "1.5px solid rgba(93,140,101,0.32)" : "1.5px solid var(--border)", borderRadius: 8, padding: "0.85rem", marginBottom: "0.9rem", display: "grid", gap: "0.68rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.86rem" }}>本地 Agent 预览</div>
                  <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.5, marginTop: "0.18rem" }}>
                    不调用 API，只根据当前材料做任务路由和证据边界预判。
                  </div>
                </div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => setHasRunPreview(true)} style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.42rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                    运行本地预览
                  </button>
                  <button type="button" onClick={copyLocalPreview} style={{ background: "var(--card)", color: "var(--cherry-forest)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.42rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                    {copiedPreview ? "已复制" : "复制预览"}
                  </button>
                  <button type="button" onClick={copyAgentJson} style={{ background: "var(--card)", color: "var(--cherry-forest)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.42rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                    {copiedJson ? "已复制" : "复制 JSON"}
                  </button>
                  <button type="button" onClick={copyResponseJson} style={{ background: "var(--card)", color: "var(--cherry-forest)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.42rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                    {copiedResponseJson ? "已复制" : "复制契约"}
                  </button>
                  <button type="button" onClick={copyResearchRecord} style={{ background: "var(--cherry-yellow-light)", color: "var(--cherry-warm-brown)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 999, padding: "0.42rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                    {copiedResearchRecord ? "已复制" : "复制研究记录"}
                  </button>
                  <button type="button" onClick={copyCitationAudit} style={{ background: "var(--cherry-peach-light)", color: "var(--cherry-red)", border: "1.5px solid rgba(214,91,74,0.28)", borderRadius: 999, padding: "0.42rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                    {copiedCitationAudit ? "已复制" : "复制引用核查"}
                  </button>
                </div>
              </div>
              {hasRunPreview ? (
                <div style={{ display: "grid", gap: "0.62rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.55rem" }}>
                    {materialChecks.map((item) => (
                      <div key={item.label} style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.62rem" }}>
                        <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.76rem", marginBottom: "0.2rem" }}>{item.label} · {item.value}</strong>
                        <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.5, fontWeight: 800 }}>{item.detail}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.55rem" }}>
                    <div style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.66rem" }}>
                      <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.78rem", marginBottom: "0.42rem" }}>执行顺序</strong>
                      <div style={{ display: "grid", gap: "0.36rem" }}>
                        {activeTaskActions.map((item, index) => (
                          <div key={item} style={{ display: "grid", gridTemplateColumns: "20px minmax(0, 1fr)", gap: "0.42rem", color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.45, fontWeight: 800 }}>
                            <span style={{ color: "var(--cherry-forest)", fontWeight: 900 }}>{index + 1}</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.66rem" }}>
                      <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.78rem", marginBottom: "0.42rem" }}>证据边界</strong>
                      <p style={{ margin: 0, color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.55, fontWeight: 800 }}>
                        {missingFields.length ? `当前还缺少 ${missingFields.join("、")}，Agent 只能给出任务框架，不能直接生成强结论。` : "材料已具备进入模型分析的基本线索，但输出仍需要逐条回查原文、图表和实验设计。"}
                      </p>
                    </div>
                  </div>
                  <div style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.66rem", display: "grid", gap: "0.55rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.6rem", flexWrap: "wrap" }}>
                      <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.78rem" }}>引用核查</strong>
                      <button type="button" onClick={copyCitationAudit} style={{ background: "var(--cherry-red)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.36rem 0.68rem", fontWeight: 900, cursor: "pointer", fontSize: "0.74rem" }}>
                        {copiedCitationAudit ? "已复制" : "复制引用核查"}
                      </button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.48rem" }}>
                      {citationAuditItems.map((item) => (
                        <div key={item.label} style={{ background: "var(--card)", border: "1px solid rgba(94,68,42,0.12)", borderRadius: 8, padding: "0.58rem" }}>
                          <strong style={{ display: "block", color: item.status === "已出现" ? "var(--cherry-forest)" : "var(--cherry-red)", fontSize: "0.72rem", marginBottom: "0.24rem" }}>{item.status} · {item.label}</strong>
                          <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.7rem", lineHeight: 1.5, fontWeight: 800, marginBottom: "0.28rem" }}>{item.evidence}</span>
                          <span style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.68rem", lineHeight: 1.45, fontWeight: 900 }}>下一步：{item.action}</span>
                        </div>
                      ))}
                    </div>
                    <code style={{ display: "block", whiteSpace: "pre-wrap", background: "var(--card)", border: "1px solid rgba(94,68,42,0.12)", borderRadius: 8, padding: "0.6rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.66rem", lineHeight: 1.5, maxHeight: 220, overflow: "auto" }}>
                      {citationAuditOutput}
                    </code>
                  </div>
                  <div style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.66rem" }}>
                    <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.78rem", marginBottom: "0.42rem" }}>API 输出字段</strong>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.36rem" }}>
                      {apiOutputFields.map((field) => (
                        <span key={field} style={{ background: "var(--card)", border: "1px solid rgba(94,68,42,0.12)", borderRadius: 999, padding: "0.16rem 0.44rem", color: "var(--cherry-forest)", fontSize: "0.66rem", fontWeight: 900 }}>
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.66rem" }}>
                    <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.78rem", marginBottom: "0.42rem" }}>API 请求 JSON</strong>
                    <code style={{ display: "block", whiteSpace: "pre-wrap", background: "var(--card)", border: "1px solid rgba(94,68,42,0.12)", borderRadius: 8, padding: "0.6rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.66rem", lineHeight: 1.5, maxHeight: 220, overflow: "auto" }}>
                      {agentRequestJson}
                    </code>
                  </div>
                  <div style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.66rem", display: "grid", gap: "0.55rem" }}>
                    <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.78rem" }}>API 返回契约与验收</strong>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.48rem" }}>
                      {acceptanceChecks.map((item) => (
                        <div key={item.label} style={{ background: "var(--card)", border: "1px solid rgba(94,68,42,0.12)", borderRadius: 8, padding: "0.58rem" }}>
                          <strong style={{ display: "block", color: item.passed ? "var(--cherry-forest)" : "var(--cherry-red)", fontSize: "0.72rem", marginBottom: "0.24rem" }}>{item.passed ? "通过" : "待补"} · {item.label}</strong>
                          <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.7rem", lineHeight: 1.5, fontWeight: 800 }}>{item.detail}</span>
                        </div>
                      ))}
                    </div>
                    <code style={{ display: "block", whiteSpace: "pre-wrap", background: "var(--card)", border: "1px solid rgba(94,68,42,0.12)", borderRadius: 8, padding: "0.6rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.66rem", lineHeight: 1.5, maxHeight: 220, overflow: "auto" }}>
                      {agentResponseJson}
                    </code>
                  </div>
                  <div style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.66rem", display: "grid", gap: "0.55rem" }}>
                    <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.78rem" }}>分析报告草稿</strong>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.5rem" }}>
                      {previewReportRows.map((item) => (
                        <div key={item.label} style={{ background: "var(--card)", border: "1px solid rgba(94,68,42,0.12)", borderRadius: 8, padding: "0.58rem" }}>
                          <strong style={{ display: "block", color: "var(--cherry-forest)", fontSize: "0.72rem", marginBottom: "0.24rem" }}>{item.label}</strong>
                          <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.7rem", lineHeight: 1.5, fontWeight: 800 }}>{item.body}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.66rem" }}>
                    <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.78rem", marginBottom: "0.42rem" }}>人工复核问题</strong>
                    <div style={{ display: "grid", gap: "0.34rem" }}>
                      {reviewerQuestions.map((question, index) => (
                        <div key={question} style={{ display: "grid", gridTemplateColumns: "20px minmax(0, 1fr)", gap: "0.42rem", color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.45, fontWeight: 800 }}>
                          <span style={{ color: "var(--cherry-forest)", fontWeight: 900 }}>{index + 1}</span>
                          <span>{question}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.66rem", display: "grid", gap: "0.55rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.6rem", flexWrap: "wrap" }}>
                      <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.78rem" }}>可保存研究记录</strong>
                      <button type="button" onClick={copyResearchRecord} style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.36rem 0.68rem", fontWeight: 900, cursor: "pointer", fontSize: "0.74rem" }}>
                        {copiedResearchRecord ? "已复制" : "复制研究记录"}
                      </button>
                    </div>
                    <code style={{ display: "block", whiteSpace: "pre-wrap", background: "var(--card)", border: "1px solid rgba(94,68,42,0.12)", borderRadius: 8, padding: "0.6rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.66rem", lineHeight: 1.5, maxHeight: 220, overflow: "auto" }}>
                      {researchRecordOutput}
                    </code>
                  </div>
                </div>
              ) : (
                <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.6 }}>
                  点击运行后，这里会显示材料状态、证据边界和下一步分析顺序。
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.7rem", marginBottom: "0.9rem" }}>
              {[...activePrompt.output, ...activeMode.outputs].map((item, index) => (
                <div key={item} style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 14, padding: "0.65rem", color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.78rem" }}>
                  {index + 1}. {item}
                </div>
              ))}
            </div>

            <code style={{ display: "block", whiteSpace: "pre-wrap", color: "var(--cherry-warm-brown)", background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 16, padding: "0.9rem", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.78rem", lineHeight: 1.65 }}>
              {finalPrompt}
            </code>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.8rem" }}>
            <ContentCard title="质控清单">
              <div style={{ display: "grid", gap: "0.45rem" }}>
                {activePrompt.checks.map((check, index) => (
                  <div key={check} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--cherry-forest)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 900, flexShrink: 0 }}>{index + 1}</span>
                    <span>{check}</span>
                  </div>
                ))}
              </div>
            </ContentCard>
            <ContentCard title="使用提醒">
              先放入原文、图注或实验设计，再把生成的 prompt 发给 AI。涉及论文结论时，要求模型标出“原文未说明”，可以减少凭空补充。
            </ContentCard>
          </div>

          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "1.2rem", boxShadow: "0 8px 18px rgba(94,68,42,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.75rem" }}>
              <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900 }}>可复制任务包</div>
              <button type="button" onClick={copyTaskPack} aria-describedby="prompt-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.44rem 0.82rem", fontWeight: 900, cursor: "pointer", fontSize: "0.8rem" }}>
                {copiedPack ? "已复制" : "复制任务包"}
              </button>
            </div>
            <code style={{ display: "block", whiteSpace: "pre-wrap", background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 16, padding: "0.9rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.78rem", lineHeight: 1.65, maxHeight: 260, overflow: "auto" }}>
              {taskPackOutput}
            </code>
          </div>
        </div>
      </div>

      <style>
        {`
          #prompt-kit-builder button:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          #prompt-kit-builder textarea:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 3px;
          }

          #prompt-kit-builder button {
            transition: transform 0.18s ease, box-shadow 0.18s ease;
          }

          #prompt-kit-builder button:hover,
          #prompt-kit-builder button:focus-visible {
            transform: translateY(-2px);
          }

          @media (max-width: 880px) {
            #prompt-kit-builder .prompt-builder-layout {
              grid-template-columns: 1fr !important;
            }

            #prompt-kit-builder .research-agent-skill-panel {
              grid-template-columns: 1fr !important;
            }

            #prompt-kit-builder .research-review-grid {
              grid-template-columns: 1fr !important;
            }

            #prompt-kit-builder .prompt-workflow-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }

          @media (max-width: 520px) {
            #prompt-kit-builder .prompt-workflow-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            #prompt-kit-builder button {
              transition: none !important;
              transform: none !important;
            }
          }
        `}
      </style>
    </section>
  );
}

function PlantEvolutionContent() {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activePlantLens, setActivePlantLens] = useState("story");
  const [activePlantTaskIndex, setActivePlantTaskIndex] = useState(0);
  const [activePlantQuestIndex, setActivePlantQuestIndex] = useState(0);
  const [copiedStudyCard, setCopiedStudyCard] = useState(false);
  const [copiedStageComparison, setCopiedStageComparison] = useState(false);
  const [copiedEvidenceAudit, setCopiedEvidenceAudit] = useState(false);
  const [studyCardStatus, setStudyCardStatus] = useState("");
  const chapters = [
    {
      time: "约 5.1-4.7 亿年前",
      title: "登陆前：淡水绿藻已经在练习“陆地技能”",
      story: "植物的登陆不是某一天突然发生的。链形植物绿藻中已经出现了一些适应浅水、间歇干燥和强光环境的基因工具，例如植物型光敏色素、激素相关通路、纤维素合成和环境胁迫响应。",
      evidence: "基因组比较显示，早分化链形植物绿藻携带多类与陆地适应相关的基因；分子钟研究也提示陆地植物起源可能早于大型化石记录。",
      challenge: "间歇干燥、强光和浅水环境让祖先类群先获得一部分陆地适应工具。",
      innovation: "环境感知、细胞壁和胁迫响应基因工具箱。",
      prompt: "为什么植物登陆前，淡水浅水环境可能是重要训练场？",
      answerHint: "浅水环境会周期性暴露在强光、干燥和温度波动中，祖先类群可以先演化出一部分应对陆地压力的基因工具。",
      learnerTask: "把“环境压力”对应到“需要的结构或基因功能”：抗干燥、抗紫外线、细胞壁支撑各写一句。",
      certainty: "基因组证据强",
      evidenceTypes: ["基因组比较", "分子钟推断"],
      claimBoundary: "可以说明祖先类群已具备部分陆地适应工具，但不能直接证明某个具体登陆地点或完整登陆过程。",
      refs: ["Wang 2019", "Morris 2018"],
    },
    {
      time: "约 4.75 亿年前",
      title: "最早的脚印：岩石里留下了孢子",
      story: "最早能可靠指向陆地植物的证据，不是一棵完整植物，而是显微镜下的小孢子。它们有抗分解的孢粉素外壁，能在岩石中保存很久。",
      evidence: "Wellman 等在《Nature》报道，中奥陶世约 4.75 亿年前的微体化石为早期陆地植物提供证据，也解释了为什么孢子记录早于完整植物化石。",
      challenge: "陆地环境会让生殖细胞暴露在干燥和紫外线下。",
      innovation: "带孢粉素外壁的孢子，提高保存和传播能力。",
      prompt: "为什么孢子化石可能早于完整植物体化石？",
      answerHint: "孢粉素外壁更抗分解，也更容易在沉积物中保存；小型早期植物体本身不一定容易形成完整化石。",
      learnerTask: "区分“最早化石记录”和“真实起源时间”：写出为什么化石保存会筛选证据。",
      certainty: "化石证据强",
      evidenceTypes: ["微体化石", "孢子形态"],
      claimBoundary: "可以支持早期陆地植物已经留下孢子记录，但不能把它等同于最早完整植物体化石。",
      refs: ["Wellman 2003", "Kenrick 1997"],
    },
    {
      time: "志留纪-早泥盆世",
      title: "小身体，大转折：早期陆地植物开始长出轴和孢子囊",
      story: "早期陆地植物体型很小，但已经开始把身体分成能直立的轴、产生孢子的结构，以及帮助贴附地面的组织。它们没有今天树木那样复杂，却改变了陆地生态系统的底层结构。",
      evidence: "Kenrick 与 Crane 的综述把 4.8-3.6 亿年前视为早期陆地植物起源和分化的关键窗口；Morris 等整合化石与分子钟，重建了早期陆地植物演化时间尺度。",
      challenge: "离开水体后，植物需要把身体抬起来，同时把孢子送到更容易扩散的位置。",
      innovation: "直立轴、孢子囊和更清晰的孢子体结构。",
      prompt: "早期植物还很小，为什么直立结构仍然重要？",
      answerHint: "直立结构能把孢子抬离地表，增加扩散机会，也让植物开始在空间上争夺光照。",
      learnerTask: "画出贴地结构和直立结构，比较孢子释放高度、光照获取和身体支撑需求。",
      certainty: "化石与系统发育共同支持",
      evidenceTypes: ["形态化石", "系统发育", "分子钟整合"],
      claimBoundary: "可以重建早期陆地植物逐步分化的大致窗口，但不同支系的精确先后仍需要结合更多材料。",
      refs: ["Kenrick 1997", "Morris 2018"],
    },
    {
      time: "泥盆纪",
      title: "运输系统：植物终于可以长高",
      story: "维管组织让水分和养分能在植物体内长距离运输。植物不再只是贴着地面生活，而是逐渐向上竞争光照，陆地开始出现更复杂的植被结构。",
      evidence: "早期维管植物和多孢子囊植物的化石记录显示，陆地植物在志留纪到泥盆纪期间逐步获得更复杂的孢子体结构和运输能力。",
      challenge: "要长高就必须解决水分运输、机械支撑和远距离资源分配。",
      innovation: "维管组织和更复杂的分枝结构。",
      prompt: "维管组织为什么会改变陆地生态系统的高度结构？",
      answerHint: "维管组织让水分和养分能长距离运输，并配合支撑结构让植物长高，陆地植被从低矮覆盖转向分层结构。",
      learnerTask: "把维管组织看成运输管线：写出没有运输系统时，植物高度会被哪些因素限制。",
      certainty: "形态化石证据强",
      evidenceTypes: ["形态化石", "结构比较"],
      claimBoundary: "可以说明运输和支撑结构与长高能力相关，但不能把维管组织单独当成所有生态复杂化的唯一原因。",
      refs: ["Kenrick 1997", "Nature Plants 2018"],
    },
    {
      time: "晚泥盆世",
      title: "种子：把下一代装进保护包",
      story: "种子的出现改变了繁殖方式。胚、营养和保护结构被组织在一起，植物可以更好地等待合适环境，也更容易向干燥或不稳定的陆地环境扩展。",
      evidence: "早期种子化石来自晚泥盆世到早石炭世记录；《Nature》关于早期种子的研究显示，原始种子结构为理解种子习性起源提供了关键材料。",
      challenge: "干燥陆地上，下一代需要保护、营养和等待合适时机的能力。",
      innovation: "胚、营养组织和保护结构整合成种子习性。",
      prompt: "种子为什么比裸露孢子更适合不稳定环境？",
      answerHint: "种子把胚、营养和保护结构放在一起，可以等待合适条件再萌发，比裸露孢子更能应对干燥和季节波动。",
      learnerTask: "比较“孢子像轻量传播单元”和“种子像带补给的保护包”，各写一个优势和一个代价。",
      certainty: "早期种子化石支持",
      evidenceTypes: ["种子化石", "结构重建"],
      claimBoundary: "可以说明种子习性的关键结构已经出现，但早期种子生态功能还需要结合保存状态和环境证据判断。",
      refs: ["Pettitt 1981", "Prestianni 2017"],
    },
    {
      time: "白垩纪",
      title: "花和果实：把动物也写进植物故事",
      story: "被子植物用花、果实和封闭胚珠重组了繁殖方式。传粉者、食草动物和种子传播者都卷入这套系统，陆地生态网络变得更加密集。",
      evidence: "被子植物在早白垩世快速多样化的化石记录较清楚，但其更早起源仍有争议；相关综述提醒我们区分“可靠化石证据”和“分子钟推测”。",
      challenge: "繁殖不只要产生后代，还要提高传粉和传播效率。",
      innovation: "花、果实、封闭胚珠以及和动物互动的繁殖系统。",
      prompt: "花和果实为什么会让动物进入植物演化叙事？",
      answerHint: "花可以吸引或利用传粉者，果实可以帮助种子传播；植物繁殖效率开始和动物行为紧密相连。",
      learnerTask: "举一个传粉或种子传播例子，说明植物结构和动物行为如何共同塑造生态关系。",
      certainty: "早白垩世化石清楚，更早起源仍有争议",
      evidenceTypes: ["花粉与花化石", "系统发育", "分子钟推断"],
      claimBoundary: "可以确认早白垩世被子植物快速多样化较清楚，但更早起源时间不能只靠单一证据定论。",
      refs: ["Friis 1994", "Herendeen 2017"],
    },
  ];
  const activeChapter = chapters[activeChapterIndex];
  const shortTimes = ["5.1-4.7亿年", "4.75亿年", "志留-泥盆", "泥盆纪", "晚泥盆", "白垩纪"];
  const plantTimelinePoints = [
    { x: 252, y: 668 },
    { x: 236, y: 552 },
    { x: 266, y: 436 },
    { x: 236, y: 320 },
    { x: 266, y: 204 },
    { x: 252, y: 88 },
  ];
  const plantStageLabels = ["浅水绿藻", "孢子外壁", "直立小轴", "维管分枝", "种子保护包", "花和果实"];

  const references = [
    {
      key: "Wang 2019",
      title: "Wang et al. Genomes of early-diverging streptophyte algae shed light on plant terrestrialization. Nature Plants.",
      url: "https://www.nature.com/articles/s41477-019-0560-3",
    },
    {
      key: "Wellman 2003",
      title: "Wellman, Osterloff & Mohiuddin. Fragments of the earliest land plants. Nature.",
      url: "https://www.nature.com/articles/nature01884",
    },
    {
      key: "Morris 2018",
      title: "Morris et al. The timescale of early land plant evolution. PNAS.",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5877938/",
    },
    {
      key: "Kenrick 1997",
      title: "Kenrick & Crane. The origin and early evolution of plants on land. Nature.",
      url: "https://www.nature.com/articles/37918",
    },
    {
      key: "Nature Plants 2018",
      title: "Sporophytes of polysporangiate land plants from the early Silurian period may have been photosynthetically autonomous. Nature Plants.",
      url: "https://www.nature.com/articles/s41477-018-0140-y",
    },
    {
      key: "Pettitt 1981",
      title: "Pettitt & Beck. The earliest seeds. Nature.",
      url: "https://www.nature.com/articles/293462a0",
    },
    {
      key: "Prestianni 2017",
      title: "Further study of Late Devonian seed plant Cosmosperma polyloba. BMC Ecology and Evolution.",
      url: "https://link.springer.com/article/10.1186/s12862-017-0992-1",
    },
    {
      key: "Friis 1994",
      title: "Crane, Friis & Pedersen. The origin and early diversification of angiosperms. Nature.",
      url: "https://www.nature.com/articles/374027a0",
    },
    {
      key: "Herendeen 2017",
      title: "Herendeen et al. Palaeobotanical redux: revisiting the age of the angiosperms. Nature Plants.",
      url: "https://www.nature.com/articles/nplants201715",
    },
  ];
  const activeReferences = references.filter((reference) => activeChapter.refs.includes(reference.key));
  const plantLenses = [
    { key: "story", label: "故事" },
    { key: "evidence", label: "证据" },
    { key: "practice", label: "自测" },
    { key: "extend", label: "延伸" },
  ];
  const extensionTasks = [
    {
      title: "结构定位",
      body: `在时间轴图里找到和“${activeChapter.innovation}”对应的结构或过程，再用一句话说明它解决了哪个生存限制。`,
    },
    {
      title: "证据判断",
      body: `判断这一阶段更依赖化石、基因组、分子钟还是系统发育证据，并指出“${activeChapter.certainty}”为什么还需要这样表述。`,
    },
    {
      title: "比较追问",
      body: `把这一阶段和上一个阶段比较：新出现的能力是什么，代价可能是什么，为什么它会改变后续演化空间？`,
    },
  ];
  const activeExtensionTask = extensionTasks[activePlantTaskIndex] ?? extensionTasks[0];
  const stageQuestCards = [
    {
      title: "结构定位",
      badge: "看图",
      task: `在竖向图鉴中找到“${plantStageLabels[activeChapterIndex]}”，圈出它和“${activeChapter.innovation}”有关的结构。`,
      output: "产出：画 1 个结构箭头，并写出它解决的生存限制。",
      check: `检查：这句话必须同时包含“${activeChapter.challenge}”和“${activeChapter.innovation}”。`,
    },
    {
      title: "证据判断",
      badge: "读证据",
      task: `回到证据页签，判断这一阶段主要依赖哪类证据：化石、基因组、系统发育、分子钟或组合证据。`,
      output: `产出：写下“我相信到哪一步”，并保留证据状态：${activeChapter.certainty}。`,
      check: "检查：不要把可靠化石记录、真实起源时间和分子钟推测混成同一句结论。",
    },
    {
      title: "迁移表达",
      badge: "写解释",
      task: activeChapter.learnerTask,
      output: "产出：用 3 句话解释问题、创新、证据边界。",
      check: `检查：最后一句要回答自测问题：${activeChapter.prompt}`,
    },
  ];
  const activeStageQuest = stageQuestCards[activePlantQuestIndex] ?? stageQuestCards[0];
  const comparisonStages = [
    activeChapterIndex > 0 ? { label: "上一阶段", chapter: chapters[activeChapterIndex - 1] } : null,
    { label: "当前阶段", chapter: activeChapter },
    activeChapterIndex < chapters.length - 1 ? { label: "下一阶段", chapter: chapters[activeChapterIndex + 1] } : null,
  ].filter((item): item is { label: string; chapter: typeof activeChapter } => Boolean(item));
  const evidenceAuditCards = [
    {
      title: "证据来源",
      body: activeChapter.evidenceTypes.join(" / "),
      check: "先判断证据来自岩石记录、现生基因组、系统发育还是分子钟，不把它们混成同一种证据。",
    },
    {
      title: "可以相信到哪一步",
      body: activeChapter.certainty,
      check: "把可靠程度写进结论里，例如“化石记录支持”或“分子钟提示”，不要省略证据状态。",
    },
    {
      title: "不能直接推出什么",
      body: activeChapter.claimBoundary,
      check: "最后保留一个限制条件，避免把证据能支持的范围扩大成完整故事。",
    },
  ];
  const plantCompletionChecks = [
    {
      title: "阶段定位",
      task: `指出“${activeChapter.title}”处在时间轴的哪一段，并说出它前后各连接了什么变化。`,
      pass: "回答里同时出现时间、上一阶段或下一阶段、当前阶段关键词。",
    },
    {
      title: "生存压力",
      task: `用一句话解释这一阶段面对的限制：${activeChapter.challenge}`,
      pass: "句子不是复述标题，而是说明环境压力或繁殖、运输、保护等限制。",
    },
    {
      title: "关键创新",
      task: `把“${activeChapter.innovation}”和它解决的问题连成因果句。`,
      pass: "因果句能写成“因为有了……所以……”，并能回到当前阶段。",
    },
    {
      title: "证据边界",
      task: `说明当前证据能支持到哪一步，并保留限制：${activeChapter.claimBoundary}`,
      pass: "没有把化石、基因组、分子钟或系统发育证据说成同一种证据，也没有过度推出。",
    },
  ];
  const evidenceAuditOutput = `【植物演化证据判读记录】
阶段：${activeChapter.title}
时间：${activeChapter.time}

一、证据来源
${activeChapter.evidenceTypes.map((item, index) => `${index + 1}. ${item}`).join("\n")}

二、当前证据状态
${activeChapter.certainty}

三、证据原文摘要
${activeChapter.evidence}

四、可以写出的结论
这项创新说明：${activeChapter.innovation}
它主要解决：${activeChapter.challenge}

五、不能直接推出
${activeChapter.claimBoundary}

六、我的判读句
我会把这个阶段表述为：
我还需要避免的过度推断是：`;
  const stageComparisonOutput = `【植物演化阶段比较记录】
当前阶段：${activeChapter.title}
时间：${activeChapter.time}

一、阶段对照
${comparisonStages.map((item, index) => `${index + 1}. ${item.label}：${item.chapter.title}
时间：${item.chapter.time}
生存问题：${item.chapter.challenge}
关键创新：${item.chapter.innovation}
证据状态：${item.chapter.certainty}`).join("\n\n")}

二、我需要写出的比较结论
1. 上一阶段解决了什么问题：
2. 当前阶段新增了什么能力：
3. 新能力带来的代价或新限制：
4. 下一阶段为什么会接着发生：

三、证据边界
${activeChapter.evidence}`;
  const studyCardOutput = `【植物演化学习卡】
阶段：${activeChapter.title}
时间：${activeChapter.time}

1. 发生了什么
${activeChapter.story}

2. 当时的生存问题
${activeChapter.challenge}

3. 关键创新
${activeChapter.innovation}

4. 证据状态
${activeChapter.certainty}
${activeChapter.evidence}

5. 自测问题
${activeChapter.prompt}
作答提示：${activeChapter.answerHint}
延伸练习：${activeChapter.learnerTask}

6. 当前小关卡
${activeStageQuest.title}
${activeStageQuest.task}
${activeStageQuest.output}
${activeStageQuest.check}

7. 阶段比较
${comparisonStages.map((item, index) => `${index + 1}. ${item.label}：${item.chapter.time}｜${item.chapter.innovation}｜证据状态：${item.chapter.certainty}`).join("\n")}

8. 证据判读
证据来源：${activeChapter.evidenceTypes.join(" / ")}
结论边界：${activeChapter.claimBoundary}

9. 完成验收
${plantCompletionChecks.map((item, index) => `${index + 1}. ${item.title}
任务：${item.task}
通过标准：${item.pass}`).join("\n\n")}

10. 参考文献
${activeReferences.map((reference) => `[${reference.key}] ${reference.title}`).join("\n")}`;

  async function copyStudyCard() {
    const copiedToClipboard = await copyText(studyCardOutput);
    if (copiedToClipboard) {
      setCopiedStudyCard(true);
      setCopiedStageComparison(false);
      setCopiedEvidenceAudit(false);
      setStudyCardStatus("学习卡已复制到剪贴板。");
      window.setTimeout(() => setCopiedStudyCard(false), 1400);
      return;
    }

    setCopiedStudyCard(false);
    setStudyCardStatus("复制失败，请手动选中文本复制。");
  }

  async function copyStageComparison() {
    const copiedToClipboard = await copyText(stageComparisonOutput);
    if (copiedToClipboard) {
      setCopiedStageComparison(true);
      setCopiedStudyCard(false);
      setCopiedEvidenceAudit(false);
      setStudyCardStatus("阶段比较记录已复制到剪贴板。");
      window.setTimeout(() => setCopiedStageComparison(false), 1400);
      return;
    }

    setCopiedStageComparison(false);
    setStudyCardStatus("复制失败，请手动选中文本复制。");
  }

  async function copyEvidenceAudit() {
    const copiedToClipboard = await copyText(evidenceAuditOutput);
    if (copiedToClipboard) {
      setCopiedEvidenceAudit(true);
      setCopiedStageComparison(false);
      setCopiedStudyCard(false);
      setStudyCardStatus("证据判读记录已复制到剪贴板。");
      window.setTimeout(() => setCopiedEvidenceAudit(false), 1400);
      return;
    }

    setCopiedEvidenceAudit(false);
    setStudyCardStatus("复制失败，请手动选中文本复制。");
  }

  function choosePlantChapter(index: number) {
    setActiveChapterIndex(index);
    setActivePlantLens("story");
    setActivePlantTaskIndex(0);
    setActivePlantQuestIndex(0);
    setCopiedStudyCard(false);
    setCopiedStageComparison(false);
    setCopiedEvidenceAudit(false);
    setStudyCardStatus("");
  }

  function renderPlantStageIcon(index: number, visible: boolean) {
    const opacity = visible ? 1 : 0.25;

    if (index === 0) {
      return (
        <g opacity={opacity}>
          <path d="M-34 18 C-22 3 -8 7 0 18 C10 2 28 6 36 20" fill="none" stroke="var(--cherry-sage)" strokeWidth={5} strokeLinecap="round" />
          <circle cx={-22} cy={10} r={10} fill="var(--cherry-blue-light)" stroke="var(--cherry-sage)" strokeWidth={2.2} />
          <circle cx={2} cy={14} r={13} fill="var(--cherry-sage-light)" stroke="var(--cherry-sage)" strokeWidth={2.2} />
          <circle cx={25} cy={9} r={8} fill="rgba(132,184,204,0.52)" stroke="var(--cherry-sage)" strokeWidth={2} />
          <path d="M-2 12 C6 7 12 9 18 14" stroke="var(--cherry-forest)" strokeWidth={2.2} strokeLinecap="round" opacity={0.45} />
        </g>
      );
    }

    if (index === 1) {
      return (
        <g opacity={opacity}>
          {[[-28, 6], [-14, -10], [2, -4], [18, -12], [30, 4], [-1, 18]].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={8} fill="var(--cherry-yellow)" stroke="var(--cherry-warm-brown)" strokeWidth={1.4} opacity={0.9} />
          ))}
          <path d="M-34 23 C-13 30 14 31 36 22" stroke="var(--cherry-forest)" strokeWidth={3} strokeLinecap="round" opacity={0.32} />
          <path d="M-22 5 L-16 10 M-2 -4 L5 1 M21 -12 L28 -7" stroke="var(--cherry-warm-brown)" strokeWidth={1.8} strokeLinecap="round" opacity={0.42} />
        </g>
      );
    }

    if (index === 2) {
      return (
        <g opacity={opacity}>
          <path d="M-4 34 C-4 16 -2 1 6 -18" fill="none" stroke="var(--cherry-forest)" strokeWidth={6} strokeLinecap="round" />
          <path d="M5 -7 C18 -18 33 -15 39 0" fill="none" stroke="var(--cherry-forest)" strokeWidth={4} strokeLinecap="round" />
          <ellipse cx={40} cy={3} rx={9} ry={12} fill="var(--cherry-yellow)" stroke="var(--cherry-warm-brown)" strokeWidth={1.7} />
          <path d="M-26 31 C-10 23 8 24 27 31" stroke="var(--cherry-sage)" strokeWidth={4} strokeLinecap="round" />
        </g>
      );
    }

    if (index === 3) {
      return (
        <g opacity={opacity}>
          <path d="M0 36 C0 12 5 -9 15 -31" fill="none" stroke="var(--cherry-forest)" strokeWidth={8} strokeLinecap="round" />
          <path d="M8 -1 C28 -14 43 -7 48 11 M7 9 C-18 4 -30 13 -36 29 M14 -17 C0 -27 -13 -25 -24 -12" fill="none" stroke="var(--cherry-forest)" strokeWidth={4.3} strokeLinecap="round" />
          <path d="M18 -30 Q31 -48 49 -36 Q40 -21 18 -30Z M-36 28 Q-52 15 -43 -2 Q-26 6 -36 28Z M49 11 Q62 1 74 14 Q59 25 49 11Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth={1.8} />
          <path d="M-7 30 H17" stroke="var(--cherry-yellow)" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
        </g>
      );
    }

    if (index === 4) {
      return (
        <g opacity={opacity}>
          <ellipse cx={2} cy={2} rx={23} ry={30} fill="var(--cherry-yellow)" stroke="var(--cherry-warm-brown)" strokeWidth={2.5} />
          <path d="M2 -19 C14 -35 32 -34 39 -20 C29 -8 14 -7 2 -19Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth={2} />
          <path d="M2 -20 C8 -10 8 8 1 21" stroke="rgba(94,68,42,0.34)" strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={-4} cy={5} r={5} fill="rgba(250,247,241,0.6)" />
        </g>
      );
    }

    return (
      <g opacity={opacity}>
        {[[-18, 2], [0, -16], [18, 2], [0, 20]].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={15} fill="var(--cherry-peach)" stroke="rgba(94,68,42,0.12)" strokeWidth={2} />
        ))}
        <circle cx={0} cy={2} r={12} fill="var(--cherry-yellow)" stroke="var(--cherry-warm-brown)" strokeWidth={2} />
        <circle cx={34} cy={24} r={13} fill="var(--cherry-red)" opacity={0.86} />
        <path d="M27 13 C34 2 47 2 54 12 C47 21 35 23 27 13Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth={1.8} />
      </g>
    );
  }

  return (
    <div id="plant-evolution-explorer" style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(280px, 0.8fr)", gap: "1rem", alignItems: "start" }}>
        <div style={{ display: "grid", gap: "0.85rem", alignContent: "start" }}>
          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)", overflow: "hidden" }}>
            <svg viewBox="0 0 520 760" role="img" aria-label="植物从淡水绿藻到被子植物的竖向演化证据时间轴" style={{ width: "100%", display: "block", borderRadius: 18 }}>
              <defs>
                <linearGradient id="plant-evolution-bg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#FFF8EA" />
                  <stop offset="0.45" stopColor="#EDF3DF" />
                  <stop offset="0.78" stopColor="#DCECD8" />
                  <stop offset="1" stopColor="#D9C9AA" />
                </linearGradient>
                <linearGradient id="plant-water" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#84B8CC" stopOpacity="0.1" />
                  <stop offset="0.5" stopColor="#84B8CC" stopOpacity="0.32" />
                  <stop offset="1" stopColor="#84B8CC" stopOpacity="0.08" />
                </linearGradient>
                <filter id="plant-soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#5E442A" floodOpacity="0.13" />
                </filter>
                <clipPath id="plant-generated-art-clip">
                  <rect x={24} y={24} width={468} height={712} rx={94} />
                </clipPath>
              </defs>
              <rect x={0} y={0} width={520} height={760} fill="url(#plant-evolution-bg)" />
              <rect x={24} y={24} width={468} height={712} rx={94} fill="rgba(250,247,241,0.26)" stroke="rgba(93,140,101,0.28)" strokeWidth={2.5} strokeDasharray="8 8" />
              <image href="/illustrations/plant-evolution-story.webp" x={24} y={24} width={468} height={712} preserveAspectRatio="xMidYMid slice" clipPath="url(#plant-generated-art-clip)" opacity={0.54} />
              <rect x={24} y={24} width={468} height={712} rx={94} fill="rgba(255,248,234,0.24)" />
              <circle cx={420} cy={82} r={34} fill="var(--cherry-yellow)" opacity={0.62} />
              <circle cx={420} cy={82} r={55} fill="var(--cherry-yellow)" opacity={0.12} />
              {[54, 82, 454, 482].map((x, index) => (
                <path key={x} d={`M${x} ${188 + index * 62} C${x - 12} ${165 + index * 62} ${x - 5} ${145 + index * 62} ${x + 18} ${132 + index * 62} M${x + 17} ${132 + index * 62} C${x + 39} ${149 + index * 62} ${x + 29} ${177 + index * 62} ${x} ${188 + index * 62}`} fill="rgba(169,201,172,0.2)" stroke="rgba(58,92,62,0.22)" strokeWidth={2.4} strokeLinecap="round" />
              ))}
              <path d="M94 103 C127 80 166 86 188 113 C151 127 118 124 94 103Z M340 137 C371 114 413 119 439 148 C400 161 365 158 340 137Z" fill="#FAF7F1" opacity={0.62} />
              <path d="M72 190 C122 164 171 177 212 202 C263 231 317 219 367 185 C401 162 438 158 472 177" fill="none" stroke="rgba(132,184,204,0.24)" strokeWidth={12} strokeLinecap="round" />
              <path d="M59 244 C113 214 164 232 214 254 C266 277 320 262 370 229 C410 203 448 204 481 225" fill="none" stroke="rgba(132,184,204,0.14)" strokeWidth={18} strokeLinecap="round" />
              <path d="M48 393 C96 360 150 372 202 403 C267 443 319 410 370 371 C409 341 451 346 484 367" fill="none" stroke="rgba(238,199,103,0.16)" strokeWidth={20} strokeLinecap="round" />
              <path d="M54 585 C113 553 159 600 222 558 C296 507 348 553 469 492" fill="none" stroke="rgba(93,140,101,0.18)" strokeWidth={44} strokeLinecap="round" />
              <path d="M52 624 C116 584 186 626 247 588 C323 543 393 563 474 512 V736 H52Z" fill="rgba(169,201,172,0.2)" />
              <path d="M52 654 C130 697 230 655 305 688 C372 717 431 690 474 648 V736 H52Z" fill="url(#plant-water)" />
              <path d="M52 704 C96 686 138 700 177 690 C221 680 260 653 307 672 C358 692 409 678 474 638 V736 H52Z" fill="rgba(216,199,168,0.58)" />
              <path d="M52 692 C103 667 157 682 213 664 C291 640 349 661 462 620" fill="none" stroke="rgba(58,92,62,0.17)" strokeWidth={26} strokeLinecap="round" />
              <path d="M91 713 C130 725 173 714 209 719 M333 724 C369 708 421 725 456 711" fill="none" stroke="rgba(94,68,42,0.16)" strokeWidth={5} strokeLinecap="round" />
              {[78, 104, 132, 378, 414, 442].map((x, index) => (
                <g key={x} opacity={0.46 + (index % 2) * 0.16}>
                  <path d={`M${x} 632 C${x - 8} 608 ${x - 15} 591 ${x - 7} 568`} stroke="var(--cherry-forest)" strokeWidth={3.5} strokeLinecap="round" />
                  <path d={`M${x - 8} 604 Q${x - 27} 591 ${x - 36} 612 M${x - 5} 583 Q${x + 10} 569 ${x + 25} 586 M${x - 4} 618 Q${x + 13} 607 ${x + 25} 621`} stroke="var(--cherry-sage)" strokeWidth={3.2} strokeLinecap="round" fill="none" />
                </g>
              ))}
              <g opacity={0.72}>
                <path d="M79 688 C98 671 126 671 147 688 C128 699 101 700 79 688Z" fill="rgba(132,184,204,0.28)" stroke="rgba(58,92,62,0.22)" strokeWidth={2} />
                {[92, 112, 133].map((x, index) => (
                  <circle key={x} cx={x} cy={684 + index * 3} r={9 - index * 1.5} fill={index === 1 ? "var(--cherry-sage-light)" : "var(--cherry-blue-light)"} stroke="var(--cherry-sage)" strokeWidth={1.8} />
                ))}
                {[348, 369, 392, 419].map((x, index) => (
                  <circle key={x} cx={x} cy={704 + (index % 2) * 8} r={6} fill="var(--cherry-yellow)" stroke="rgba(94,68,42,0.2)" strokeWidth={1.5} />
                ))}
                <path d="M287 716 C302 699 327 699 343 715" stroke="var(--cherry-forest)" strokeWidth={4} strokeLinecap="round" />
                <path d="M315 712 C312 691 321 675 335 663 M331 678 C348 666 366 672 372 689 M323 696 C303 689 287 697 280 713" stroke="var(--cherry-forest)" strokeWidth={3.5} strokeLinecap="round" fill="none" />
              </g>
              <g opacity={0.76}>
                {[76, 128, 408, 454].map((x, index) => (
                  <g key={x}>
                    <path d={`M${x} ${532 + index * 15} C${x - 9} ${510 + index * 15} ${x - 3} ${489 + index * 15} ${x + 15} ${475 + index * 15}`} stroke="var(--cherry-forest)" strokeWidth={3.2} strokeLinecap="round" fill="none" />
                    <path d={`M${x + 12} ${482 + index * 15} C${x + 28} ${466 + index * 15} ${x + 48} ${472 + index * 15} ${x + 55} ${491 + index * 15} C${x + 36} ${502 + index * 15} ${x + 19} ${499 + index * 15} ${x + 12} ${482 + index * 15}Z`} fill={index % 2 ? "var(--cherry-sage-light)" : "var(--cherry-sage)"} stroke="var(--cherry-forest)" strokeWidth={1.7} />
                  </g>
                ))}
                {[68, 452, 104, 418].map((x, index) => (
                  <circle key={x} cx={x} cy={612 + (index % 2) * 28} r={5 + index} fill={index % 2 ? "var(--cherry-peach)" : "var(--cherry-yellow)"} opacity={0.7} />
                ))}
              </g>
              {[96, 152, 398, 446].map((x) => (
                <path key={x} d={`M${x} 134 C${x + 16} 122 ${x + 34} 123 ${x + 48} 137`} fill="none" stroke="rgba(132,184,204,0.3)" strokeWidth={9} strokeLinecap="round" />
              ))}
              <g opacity={0.72}>
                <path d="M388 256 C388 221 397 190 415 160" stroke="var(--cherry-forest)" strokeWidth={7} strokeLinecap="round" fill="none" />
                <path d="M408 172 C428 150 459 158 468 185 C441 197 420 192 408 172Z M395 215 C367 197 342 212 336 239 C362 248 383 239 395 215Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth={2} />
                <circle cx={431} cy={150} r={10} fill="var(--cherry-red)" opacity={0.86} />
                <circle cx={453} cy={174} r={8} fill="var(--cherry-peach)" opacity={0.86} />
              </g>
              <g opacity={0.66}>
                <ellipse cx={111} cy={314} rx={19} ry={28} fill="var(--cherry-yellow)" stroke="var(--cherry-warm-brown)" strokeWidth={2.4} />
                <path d="M111 292 C124 274 145 276 153 294 C139 309 123 309 111 292Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth={2} />
              </g>
              <path d="M252 668 C192 607 312 552 252 494 C190 435 312 374 252 318 C192 257 312 201 252 88" fill="none" stroke="var(--cherry-forest)" strokeWidth={10} strokeLinecap="round" opacity={0.16} />
              <path d="M252 668 C192 607 312 552 252 494 C190 435 312 374 252 318 C192 257 312 201 252 88" fill="none" stroke="var(--cherry-sage)" strokeWidth={4.8} strokeLinecap="round" />
              <text x={54} y={64} fill="var(--cherry-forest)" fontSize={18} fontWeight={900}>植物演化图鉴</text>
              <text x={54} y={86} fill="var(--cherry-warm-mid)" fontSize={11} fontWeight={800}>从水边工具箱，到花和果实</text>
              {chapters.map((chapter, index) => {
                const point = plantTimelinePoints[index];
                const active = activeChapterIndex === index;
                const leftSide = index % 2 === 0;
                const branchX = leftSide ? -108 : 108;
                const labelX = leftSide ? -178 : 50;
                return (
                  <g
                    key={chapter.title}
                    transform={`translate(${point.x} ${point.y})`}
                    role="button"
                    tabIndex={0}
                    aria-label={`查看${chapter.title}`}
                    aria-pressed={active}
                    onClick={() => choosePlantChapter(index)}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      choosePlantChapter(index);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <path d={`M0 0 C${branchX * 0.25} -22 ${branchX * 0.58} -24 ${branchX} -42`} fill="none" stroke={index <= activeChapterIndex ? "var(--cherry-forest)" : "rgba(93,140,101,0.28)"} strokeWidth={3.2} strokeLinecap="round" />
                    <g transform={`translate(${branchX} -34)`} filter={active ? "url(#plant-soft-shadow)" : undefined}>
                      {renderPlantStageIcon(index, index <= activeChapterIndex)}
                    </g>
                    {active ? <circle r={32} fill="none" stroke="rgba(214,91,74,0.24)" strokeWidth={7} /> : null}
                    <circle r={active ? 23 : 17} fill={active ? "var(--cherry-yellow)" : "var(--cherry-sage-light)"} stroke={active ? "var(--cherry-red)" : "var(--cherry-forest)"} strokeWidth={active ? 3 : 2} />
                    <text y={5} textAnchor="middle" fill="var(--cherry-warm-brown)" fontSize={12} fontWeight={900}>{index + 1}</text>
                    <g transform={`translate(${labelX} -48)`}>
                      <rect width={148} height={54} rx={16} fill={active ? "rgba(250,247,241,0.92)" : "rgba(250,247,241,0.72)"} stroke={active ? "var(--cherry-red)" : "rgba(94,68,42,0.12)"} strokeWidth={active ? 2 : 1.2} />
                      <text x={14} y={21} fill="var(--cherry-red)" fontSize={10} fontWeight={900}>{shortTimes[index]}</text>
                      <text x={14} y={39} fill="var(--cherry-warm-brown)" fontSize={11} fontWeight={900}>{plantStageLabels[index]}</text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.72rem" }}>
            {chapters.map((chapter, index) => {
              const active = activeChapterIndex === index;
              return (
                <button key={chapter.title} type="button" aria-pressed={active} onClick={() => choosePlantChapter(index)} style={{ textAlign: "left", background: active ? "var(--cherry-sage-light)" : "var(--card)", border: active ? "1.5px solid var(--cherry-forest)" : "1.5px solid var(--border)", borderRadius: 18, padding: "0.78rem", boxShadow: active ? "3px 5px 0px rgba(58,92,62,0.14)" : "3px 5px 0px rgba(94,68,42,0.05)", cursor: "pointer", display: "grid", gap: "0.55rem", alignContent: "start" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "54px minmax(0, 1fr)", gap: "0.62rem", alignItems: "center" }}>
                    <span aria-hidden="true" style={{ width: 54, height: 54, borderRadius: 18, background: active ? "rgba(250,247,241,0.78)" : "rgba(250,247,241,0.58)", border: active ? "1.5px solid rgba(58,92,62,0.28)" : "1.5px dashed rgba(94,68,42,0.13)", display: "grid", placeItems: "center", overflow: "hidden" }}>
                      <svg viewBox="-58 -54 116 104" width="52" height="50" fill="none" focusable="false">
                        {renderPlantStageIcon(index, true)}
                      </svg>
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: "block", color: active ? "var(--cherry-forest)" : "var(--cherry-red)", fontSize: "0.92rem", fontWeight: 900, lineHeight: 1.18 }}>{chapter.time}</span>
                      <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.68rem", fontWeight: 900, marginTop: "0.16rem" }}>{plantStageLabels[index]}</span>
                    </span>
                  </div>
                  <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.82rem", lineHeight: 1.42, marginBottom: "0.45rem" }}>{chapter.title}</div>
                  <div style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.5, fontSize: "0.74rem", marginBottom: "0.5rem" }}>{chapter.innovation}</div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {chapter.refs.map((ref) => (
                      <span key={ref} style={{ background: "rgba(250,247,241,0.78)", border: "1.5px solid rgba(94,68,42,0.1)", borderRadius: 999, padding: "0.15rem 0.45rem", color: "var(--cherry-forest)", fontWeight: 900, fontSize: "0.65rem" }}>
                        {ref}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
            <div style={{ color: "var(--cherry-red)", fontWeight: 900, fontSize: "1.05rem", marginBottom: "0.45rem" }}>{activeChapter.time}</div>
            <h3 style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, lineHeight: 1.35, marginBottom: "0.7rem" }}>{activeChapter.title}</h3>
            <div role="tablist" aria-label="植物演化内容层级" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.42rem", marginBottom: "0.85rem" }}>
              {plantLenses.map((lens) => {
                const active = activePlantLens === lens.key;
                return (
                  <button key={lens.key} type="button" role="tab" aria-selected={active} onClick={() => setActivePlantLens(lens.key)} style={{ background: active ? "var(--cherry-forest)" : "var(--muted)", color: active ? "#FAF7F1" : "var(--cherry-warm-mid)", border: active ? "1.5px solid var(--cherry-forest)" : "1.5px solid var(--border)", borderRadius: 999, padding: "0.42rem 0.34rem", fontSize: "0.76rem", fontWeight: 900, cursor: "pointer" }}>
                    {lens.label}
                  </button>
                );
              })}
            </div>

            {activePlantLens === "story" ? (
              <div role="tabpanel" style={{ display: "grid", gap: "0.62rem" }}>
                <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.7, fontSize: "0.88rem" }}>{activeChapter.story}</p>
                <div style={{ display: "grid", gap: "0.5rem" }}>
                  {[
                    ["生存问题", activeChapter.challenge],
                    ["关键创新", activeChapter.innovation],
                  ].map(([label, body]) => (
                    <div key={label} style={{ background: "var(--muted)", borderRadius: 14, padding: "0.68rem", color: "var(--cherry-warm-mid)", lineHeight: 1.55, fontSize: "0.82rem" }}>
                      <strong style={{ color: "var(--cherry-warm-brown)" }}>{label}：</strong>{body}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {activePlantLens === "evidence" ? (
              <div role="tabpanel" style={{ display: "grid", gap: "0.62rem" }}>
                <div style={{ background: "var(--muted)", borderRadius: 14, padding: "0.72rem", color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.84rem" }}>
                  <strong style={{ color: "var(--cherry-warm-brown)" }}>证据状态：</strong>{activeChapter.certainty}
                </div>
                <div role="group" style={{ display: "flex", gap: 6, flexWrap: "wrap" }} aria-label="当前阶段证据类型">
                  {activeChapter.evidenceTypes.map((type) => (
                    <span key={type} style={{ background: "var(--cherry-sage-light)", border: "1px solid rgba(58,92,62,0.14)", borderRadius: 999, padding: "0.22rem 0.52rem", color: "var(--cherry-forest)", fontSize: "0.7rem", fontWeight: 900 }}>
                      {type}
                    </span>
                  ))}
                </div>
                <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.7, fontSize: "0.86rem" }}>{activeChapter.evidence}</p>
                <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 14, padding: "0.72rem", color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.82rem" }}>
                  <strong style={{ color: "var(--cherry-warm-brown)" }}>判读边界：</strong>{activeChapter.claimBoundary}
                </div>
                <div style={{ display: "grid", gap: "0.45rem" }}>
                  {activeReferences.map((reference) => (
                    <a key={reference.key} href={reference.url} target="_blank" rel="noreferrer" aria-label={`${reference.title}，新窗口打开`} style={{ color: "var(--cherry-forest)", textDecoration: "none", lineHeight: 1.45, fontSize: "0.78rem", fontWeight: 900 }}>
                      [{reference.key}] {reference.title} <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            {activePlantLens === "practice" ? (
              <div role="tabpanel" style={{ display: "grid", gap: "0.62rem" }}>
                <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 14, padding: "0.72rem", color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.84rem" }}>
                  <strong style={{ color: "var(--cherry-warm-brown)" }}>自测问题：</strong>{activeChapter.prompt}
                </div>
                <div style={{ background: "var(--muted)", borderRadius: 14, padding: "0.72rem", color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.84rem" }}>
                  <strong style={{ color: "var(--cherry-warm-brown)" }}>作答提示：</strong>{activeChapter.answerHint}
                </div>
                <div style={{ background: "rgba(169,201,172,0.18)", border: "1.5px solid rgba(93,140,101,0.18)", borderRadius: 14, padding: "0.72rem", color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.84rem" }}>
                  <strong style={{ color: "var(--cherry-warm-brown)" }}>延伸练习：</strong>{activeChapter.learnerTask}
                </div>
              </div>
            ) : null}

            {activePlantLens === "extend" ? (
              <div role="tabpanel" style={{ display: "grid", gap: "0.72rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(86px, 1fr))", gap: "0.42rem" }}>
                  {extensionTasks.map((task, index) => {
                    const active = activePlantTaskIndex === index;
                    return (
                      <button key={task.title} type="button" aria-pressed={active} onClick={() => setActivePlantTaskIndex(index)} style={{ background: active ? "rgba(214,91,74,0.13)" : "var(--muted)", color: active ? "var(--cherry-red)" : "var(--cherry-warm-mid)", border: active ? "1.5px solid rgba(214,91,74,0.38)" : "1.5px solid var(--border)", borderRadius: 14, padding: "0.54rem 0.5rem", fontSize: "0.75rem", fontWeight: 900, cursor: "pointer" }}>
                        {task.title}
                      </button>
                    );
                  })}
                </div>
                <div style={{ background: "var(--muted)", borderRadius: 14, padding: "0.78rem", color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.84rem" }}>
                  <strong style={{ color: "var(--cherry-warm-brown)" }}>{activeExtensionTask.title}：</strong>{activeExtensionTask.body}
                </div>
                <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 14, padding: "0.72rem", display: "grid", gap: "0.58rem" }}>
                  <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.84rem" }}>阶段小关卡</strong>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(92px, 1fr))", gap: "0.42rem" }}>
                    {stageQuestCards.map((quest, index) => {
                      const active = activePlantQuestIndex === index;
                      return (
                        <button key={quest.title} type="button" aria-pressed={active} onClick={() => setActivePlantQuestIndex(index)} style={{ background: active ? "var(--cherry-forest)" : "rgba(250,247,241,0.74)", color: active ? "#FAF7F1" : "var(--cherry-warm-brown)", border: active ? "1.5px solid var(--cherry-forest)" : "1.5px solid rgba(94,68,42,0.12)", borderRadius: 14, padding: "0.52rem 0.48rem", cursor: "pointer", display: "grid", gap: "0.16rem", justifyItems: "start" }}>
                          <span style={{ fontSize: "0.64rem", fontWeight: 900 }}>{quest.badge}</span>
                          <span style={{ fontSize: "0.74rem", fontWeight: 900 }}>{quest.title}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ background: "rgba(250,247,241,0.78)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 12, padding: "0.68rem", display: "grid", gap: "0.42rem" }}>
                    <strong style={{ color: "var(--cherry-forest)", fontSize: "0.8rem" }}>{activeStageQuest.title}</strong>
                    {[activeStageQuest.task, activeStageQuest.output, activeStageQuest.check].map((line, index) => (
                      <div key={line} style={{ display: "grid", gridTemplateColumns: "22px minmax(0, 1fr)", gap: "0.42rem", color: "var(--cherry-warm-mid)", lineHeight: 1.55, fontSize: "0.78rem", fontWeight: 800 }}>
                        <span aria-hidden="true" style={{ width: 18, height: 18, borderRadius: "50%", background: index === 0 ? "var(--cherry-forest)" : index === 1 ? "var(--cherry-yellow)" : "var(--cherry-red)", color: index === 1 ? "var(--cherry-warm-brown)" : "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 900 }}>
                          {index + 1}
                        </span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)", display: "grid", gap: "0.65rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
              <div>
                <strong style={{ display: "block", color: "var(--cherry-warm-brown)", marginBottom: "0.18rem" }}>阶段比较记录</strong>
                <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.5, fontWeight: 800 }}>比较相邻阶段的生存问题、关键创新和证据状态。</span>
              </div>
              <button type="button" onClick={copyStageComparison} aria-describedby="plant-study-card-status" style={{ background: "var(--cherry-red)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.44rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                {copiedStageComparison ? "已复制" : "复制比较记录"}
              </button>
            </div>
            <div style={{ display: "grid", gap: "0.52rem" }}>
              {comparisonStages.map((item, index) => (
                <div key={`${item.label}-${item.chapter.title}`} style={{ background: item.label === "当前阶段" ? "var(--cherry-yellow-light)" : "var(--muted)", border: item.label === "当前阶段" ? "1.5px solid var(--cherry-yellow)" : "1px solid rgba(94,68,42,0.1)", borderRadius: 14, padding: "0.66rem", display: "grid", gap: "0.38rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "0.55rem", alignItems: "start", flexWrap: "wrap" }}>
                    <strong style={{ color: item.label === "当前阶段" ? "var(--cherry-red)" : "var(--cherry-forest)", fontSize: "0.78rem" }}>{item.label}</strong>
                    <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.68rem", fontWeight: 900 }}>{item.chapter.time}</span>
                  </div>
                  <div style={{ color: "var(--cherry-warm-brown)", fontSize: "0.78rem", lineHeight: 1.42, fontWeight: 900 }}>{item.chapter.title}</div>
                  <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.52, fontWeight: 800 }}>
                    <strong style={{ color: "var(--cherry-warm-brown)" }}>创新：</strong>{item.chapter.innovation}
                  </div>
                  <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.52, fontWeight: 800 }}>
                    <strong style={{ color: "var(--cherry-warm-brown)" }}>证据：</strong>{item.chapter.certainty}
                  </div>
                  {index < comparisonStages.length - 1 ? (
                    <div style={{ color: "var(--cherry-red)", fontSize: "0.68rem", fontWeight: 900 }}>下一步比较：新能力解决了什么限制，又带来什么新问题？</div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)", display: "grid", gap: "0.65rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
              <div>
                <strong style={{ display: "block", color: "var(--cherry-warm-brown)", marginBottom: "0.18rem" }}>证据判读记录</strong>
                <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.5, fontWeight: 800 }}>先判断证据来源，再写清楚结论边界。</span>
              </div>
              <button type="button" onClick={copyEvidenceAudit} aria-describedby="plant-study-card-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.44rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                {copiedEvidenceAudit ? "已复制" : "复制证据判读"}
              </button>
            </div>
            <div style={{ display: "grid", gap: "0.52rem" }}>
              {evidenceAuditCards.map((item, index) => (
                <div key={item.title} style={{ background: index === 1 ? "var(--cherry-yellow-light)" : "var(--muted)", border: index === 1 ? "1.5px solid var(--cherry-yellow)" : "1px solid rgba(94,68,42,0.1)", borderRadius: 14, padding: "0.66rem", display: "grid", gap: "0.34rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: "50%", background: index === 2 ? "var(--cherry-red)" : "var(--cherry-forest)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.66rem", fontWeight: 900 }}>{index + 1}</span>
                    <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.78rem" }}>{item.title}</strong>
                  </div>
                  <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.52, fontWeight: 900 }}>{item.body}</span>
                  <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.52, fontWeight: 800 }}>{item.check}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 22, padding: "1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.06)", display: "grid", gap: "0.65rem" }}>
            <div>
              <strong style={{ display: "block", color: "var(--cherry-warm-brown)", marginBottom: "0.18rem" }}>阶段完成验收</strong>
              <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.5, fontWeight: 800 }}>完成当前阶段前，至少留下定位、压力、创新和证据边界四条可检查回答。</span>
            </div>
            <div style={{ display: "grid", gap: "0.52rem" }}>
              {plantCompletionChecks.map((item, index) => (
                <div key={item.title} style={{ background: "rgba(250,247,241,0.78)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 14, padding: "0.66rem", display: "grid", gridTemplateColumns: "22px minmax(0, 1fr)", gap: "0.5rem", alignItems: "start" }}>
                  <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: "50%", background: index === 3 ? "var(--cherry-red)" : "var(--cherry-forest)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.66rem", fontWeight: 900 }}>{index + 1}</span>
                  <span>
                    <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.78rem", marginBottom: "0.24rem" }}>{item.title}</strong>
                    <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.52, fontWeight: 800, marginBottom: "0.32rem" }}>{item.task}</span>
                    <span style={{ display: "block", color: "var(--cherry-forest)", fontSize: "0.7rem", lineHeight: 1.48, fontWeight: 900 }}>通过标准：{item.pass}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              <strong style={{ color: "var(--cherry-warm-brown)" }}>本阶段学习卡</strong>
              <button type="button" onClick={copyStudyCard} aria-describedby="plant-study-card-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.44rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                {copiedStudyCard ? "已复制" : "复制学习卡"}
              </button>
            </div>
            <div id="plant-study-card-status" role="status" aria-live="polite" style={{ minHeight: "1.05rem", color: "var(--cherry-forest)", fontSize: "0.76rem", fontWeight: 900, marginBottom: "0.55rem" }}>
              {studyCardStatus}
            </div>
            <code style={{ display: "block", whiteSpace: "pre-wrap", background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 14, padding: "0.75rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.72rem", lineHeight: 1.55, maxHeight: 180, overflow: "auto" }}>
              {studyCardOutput}
            </code>
          </div>
        </aside>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 18, padding: "1rem" }}>
        <h3 style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.8rem" }}>证据与参考文献</h3>
        <div style={{ background: "var(--muted)", borderRadius: 14, padding: "0.8rem", color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.86rem", marginBottom: "0.8rem" }}>
          <strong style={{ color: "var(--cherry-warm-brown)" }}>当前阶段证据：</strong>{activeChapter.evidence}
        </div>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {references.map((reference) => (
            <a key={reference.key} href={reference.url} target="_blank" rel="noreferrer" aria-label={`${reference.title}，新窗口打开`} style={{ color: "var(--cherry-forest)", textDecoration: "none", lineHeight: 1.6, fontSize: "0.86rem", fontWeight: 800 }}>
              [{reference.key}] {reference.title} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>

      <style>
        {`
          #plant-evolution-explorer button:focus-visible,
          #plant-evolution-explorer a:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          #plant-evolution-explorer button {
            transition: transform 0.18s ease, box-shadow 0.18s ease;
          }

          #plant-evolution-explorer button:hover,
          #plant-evolution-explorer button:focus-visible {
            transform: translateY(-2px);
          }

          @media (max-width: 880px) {
            #plant-evolution-explorer > div:first-child {
              grid-template-columns: 1fr !important;
            }
          }

          #plant-evolution-explorer svg [role="button"]:focus-visible circle {
            stroke: var(--cherry-red);
            stroke-width: 4;
          }

          @media (prefers-reduced-motion: reduce) {
            #plant-evolution-explorer button {
              transition: none !important;
              transform: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}

function ConceptExplainerContent() {
  const [concept, setConcept] = useState("转录");
  const [conceptInput, setConceptInput] = useState("转录");
  const [levelIndex, setLevelIndex] = useState(1);
  const [quizChoice, setQuizChoice] = useState<string | null>(null);
  const [audience, setAudience] = useState("成人自学者");
  const [lessonGoal, setLessonGoal] = useState("把概念学清楚，并能用例子判断自己是否真正理解");
  const [sourceBoundary, setSourceBoundary] = useState("未提供具体资料；先按通用教材解释，涉及数据、实验或结论时标为待核查");
  const [stuckPoint, setStuckPoint] = useState("我容易把定义、机制和例子混在一起");
  const [applicationContext, setApplicationContext] = useState("用这个概念解释一道题、一个图或一个真实现象");
  const [copiedLesson, setCopiedLesson] = useState(false);
  const [copiedSkill, setCopiedSkill] = useState(false);
  const [copiedAudit, setCopiedAudit] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [definitionDraft, setDefinitionDraft] = useState("");
  const [mechanismDraft, setMechanismDraft] = useState("");
  const [transferDraft, setTransferDraft] = useState("");
  const [boundaryDraft, setBoundaryDraft] = useState("");
  type ConceptExplanation = {
    color: string;
    analogy: string;
    prerequisite: string[];
    diagnostic: string;
    evidenceBoundary: string;
    transferTask: string;
    workedExample: { title: string; situation: string; guideQuestion: string; learnerOutput: string };
    levels: Array<{ title: string; body: string }>;
    terms: string[];
    mechanism: string[];
    compare: string;
    pitfall: string;
    quiz: { question: string; options: string[]; answer: string; explain: string };
  };

  useEffect(() => {
    setDefinitionDraft("");
    setMechanismDraft("");
    setTransferDraft("");
    setBoundaryDraft("");
  }, [concept]);

  const explanations: Record<string, ConceptExplanation> = {
    转录: {
      color: "var(--cherry-blue)",
      analogy: "把完整说明书中的一段信息转写成可读取的工作稿。原始 DNA 保留在原处，RNA 负责把信息带到下一步加工流程。",
      prerequisite: ["DNA 有模板链和编码链的方向关系", "RNA 使用 U 而不是 T", "基因表达不是一步完成的过程"],
      diagnostic: "先自测：mRNA 是从哪里来的，它和 DNA 的哪一条链互补？如果你会说“DNA 变成 RNA”，说明模板合成和拷贝关系还没有建立。",
      evidenceBoundary: "这个页面用固定序列说明模板合成和信息转写，不展开剪接、启动子调控强弱、不同物种转录机器差异。",
      transferTask: "给出编码链 5'-ATG GAA-3'，请你写出 mRNA 5'-AUG GAA-3'，再说明为什么不是 TAC CTT。",
      workedExample: {
        title: "编码链到 mRNA",
        situation: "给出编码链 5'-ATG GAA TTT-3' 和模板链 3'-TAC CTT AAA-5'，先判断哪条链被 RNA 聚合酶读取。",
        guideQuestion: "mRNA 为什么和编码链看起来相似，却不是 DNA 本身？",
        learnerOutput: "你能写出 5'-AUG GAA UUU-3'，并用一句话解释：mRNA 携带这段基因信息，后续被核糖体按密码子读取。",
      },
      levels: [
        { title: "入门版", body: "DNA 像一份完整说明书，转录就是把其中一段基因信息抄写成 RNA 工作稿。" },
        { title: "基础版", body: "细胞以 DNA 的一条链为模板合成 mRNA，RNA 中用 U 替代 T，mRNA 会把遗传信息带到核糖体。" },
        { title: "进阶版", body: "转录包含启动子识别、转录因子调控、RNA 聚合酶延伸、终止，以及真核细胞中的剪接和转录后加工。" },
      ],
      terms: ["DNA 模板链", "RNA 聚合酶", "mRNA", "启动子"],
      mechanism: ["转录因子帮助定位启动子", "RNA 聚合酶结合 DNA", "按模板链合成 mRNA", "mRNA 离开 DNA，进入后续加工或翻译"],
      compare: "转录负责“写出 RNA”；翻译负责“读 RNA 做蛋白质”。",
      pitfall: "转录不是把 DNA 变成 RNA；DNA 仍然保留，RNA 是按模板新合成出来的拷贝。",
      quiz: {
        question: "DNA 编码链片段 ATG 对应的 mRNA 密码子通常写作什么？",
        options: ["AUG", "TAC", "UAC"],
        answer: "AUG",
        explain: "mRNA 与编码链方向和信息相同，但 RNA 用 U 替代 T。",
      },
    },
    端粒: {
      color: "var(--cherry-red)",
      analogy: "像鞋带末端的保护套，保护染色体末端不被磨坏、也不容易和别的断端混淆。",
      prerequisite: ["染色体是线性 DNA 和蛋白质组成的结构", "DNA 复制有方向性", "细胞分裂会复制染色体"],
      diagnostic: "先自测：为什么染色体末端也需要被识别和保护？如果你只回答“端粒让人不变老”，说明概念被过度生活化了。",
      evidenceBoundary: "这个页面解释端粒的末端保护和复制末端问题，不把端粒长度直接等同于个体寿命或所有衰老原因。",
      transferTask: "比较“端粒缩短”“细胞衰老”“个体衰老”三句话，标出哪一句可以直接推出，哪一句需要更多证据。",
      workedExample: {
        title: "从细胞分裂看端粒",
        situation: "观察三次细胞分裂后的端粒长度示意图：末端重复序列逐渐减少，而编码区暂时没有被直接删除。",
        guideQuestion: "端粒缩短能不能直接推出一个人变老？你需要把细胞层面的证据和个体层面的现象分开。",
        learnerOutput: "你能写出：端粒缩短可能触发细胞损伤反应或衰老，但个体衰老还受组织、免疫、代谢和环境等多因素影响。",
      },
      levels: [
        { title: "入门版", body: "端粒位于染色体末端，帮助细胞区分真正的末端和需要修复的 DNA 断裂。" },
        { title: "基础版", body: "端粒位于染色体末端，随着细胞分裂逐渐缩短，能减少染色体末端被误认为断裂的风险。" },
        { title: "进阶版", body: "端粒长度、端粒酶活性与复制潜能、细胞衰老、肿瘤发生和干细胞状态有关。" },
      ],
      terms: ["染色体末端", "端粒酶", "复制末端问题", "细胞衰老"],
      mechanism: ["DNA 复制不能完整复制最末端", "端粒重复序列先被消耗", "端粒过短会触发损伤反应", "端粒酶可在部分细胞中延长端粒"],
      compare: "端粒是染色体末端结构；端粒酶是维护端粒长度的酶。",
      pitfall: "端粒缩短不是所有衰老现象的唯一原因，它只是细胞衰老机制中的一部分。",
      quiz: {
        question: "下面哪类细胞更可能依赖端粒维护？",
        options: ["频繁分裂的细胞", "成熟红细胞", "角质层死细胞"],
        answer: "频繁分裂的细胞",
        explain: "分裂越频繁，染色体末端复制问题越明显，因此更依赖端粒维护机制。",
      },
    },
    生态位: {
      color: "var(--cherry-sage)",
      analogy: "不只是住址，更像一份生活档案：住在哪里、吃什么、什么时候活动、和谁竞争。",
      prerequisite: ["物种会利用环境资源", "不同物种之间可能竞争或共生", "栖息地只描述生活地点的一部分"],
      diagnostic: "先自测：两种动物住在同一片森林，它们的生态位一定相同吗？如果你回答“相同”，说明还没有区分栖息地和资源利用方式。",
      evidenceBoundary: "这个页面用资源、空间和相互作用解释生态位，不涉及完整的生态位数学模型或复杂群落网络建模。",
      transferTask: "给出两种鸟的取食高度、食物类型和活动时间，请你判断哪些维度说明生态位分化。",
      workedExample: {
        title: "同一森林里的两种鸟",
        situation: "材料给出甲鸟在树冠取食昆虫、白天活动；乙鸟在灌木层取食果实、傍晚活动。两者都生活在同一片森林。",
        guideQuestion: "如果只看住址，它们相同；如果看资源和活动方式，它们哪里不同？",
        learnerOutput: "你能指出：两种鸟栖息地重叠，但取食高度、食物类型和活动时间不同，因此生态位并不完全相同。",
      },
      levels: [
        { title: "入门版", body: "生态位描述一个物种如何利用资源、占据环境并与其他生物发生关系。" },
        { title: "基础版", body: "生态位描述生物如何利用资源、生活在什么环境、和其他生物如何相互作用。" },
        { title: "进阶版", body: "生态位包含资源维度、空间维度和相互作用维度，可用于解释竞争、共存、适应辐射和群落结构。" },
      ],
      terms: ["资源利用", "竞争", "共存", "群落"],
      mechanism: ["环境提供资源和限制", "物种选择可利用的资源范围", "相似物种发生竞争", "资源分化可帮助物种共存"],
      compare: "栖息地偏向“住在哪里”；生态位还包含“怎么生活”。",
      pitfall: "生态位不等于栖息地。栖息地偏向“住在哪里”，生态位还包含“吃什么、怎样生存、和谁互动”。",
      quiz: {
        question: "两种鸟生活在同一片森林，但取食高度不同，这说明什么？",
        options: ["生态位可以不同", "一定是同一物种", "不存在竞争"],
        answer: "生态位可以不同",
        explain: "同一栖息地内也可能通过资源或空间分化形成不同生态位。",
      },
    },
    凋亡: {
      color: "var(--cherry-peach)",
      analogy: "像细胞按下自我清理按钮，把自己有序拆开，再交给身体清理。",
      prerequisite: ["细胞死亡有不同方式", "组织需要清除异常或不再需要的细胞", "炎症反应和细胞破裂有关"],
      diagnostic: "先自测：凋亡和坏死都是细胞死亡，为什么教材要分开讲？如果你只说“一个好一个坏”，说明还没有抓住过程和后果差异。",
      evidenceBoundary: "这个页面强调程序性死亡和有序清除，不展开所有细胞死亡类型，也不把 caspase 通路等同于全部凋亡调控。",
      transferTask: "给出细胞收缩、膜破裂、DNA 片段化、炎症反应四个现象，请你判断哪些更支持凋亡，哪些更支持坏死。",
      workedExample: {
        title: "发育中清除多余细胞",
        situation: "观察胚胎发育中手指间蹼状组织逐渐消失的图示，再看细胞收缩、DNA 片段化、被吞噬清除等现象。",
        guideQuestion: "为什么这不是细胞随机破裂？请用过程有序、周围炎症少、碎片被清除三个证据来判断。",
        learnerOutput: "你能判断这些现象更支持凋亡，并说明凋亡让组织在发育中重塑，同时减少对周围细胞的干扰。",
      },
      levels: [
        { title: "入门版", body: "凋亡是细胞按程序结束自身生命，并把对周围组织的影响控制在较小范围内。" },
        { title: "基础版", body: "凋亡是一种程序性细胞死亡，细胞会收缩、DNA 断裂，并被免疫细胞清除，通常不引发明显炎症。" },
        { title: "进阶版", body: "凋亡通过内源性线粒体通路或外源性死亡受体通路激活 caspase 级联反应，在发育、免疫和肿瘤抑制中很关键。" },
      ],
      terms: ["程序性细胞死亡", "caspase", "线粒体通路", "死亡受体"],
      mechanism: ["细胞收到内部或外部死亡信号", "caspase 级联被激活", "细胞结构被有序拆解", "碎片被吞噬清除"],
      compare: "凋亡更有序、炎症较少；坏死常伴随细胞破裂和炎症。",
      pitfall: "凋亡不是细胞坏死。坏死常伴随细胞破裂和炎症，凋亡更有序。",
      quiz: {
        question: "凋亡和坏死最核心的区别之一是什么？",
        options: ["凋亡更有序", "凋亡一定会感染", "坏死没有细胞死亡"],
        answer: "凋亡更有序",
        explain: "凋亡是程序性死亡，坏死常伴随细胞破裂和炎症反应。",
      },
    },
  };
  function buildConceptAgentExplanation(name: string): ConceptExplanation {
    const displayName = name.trim() || "待学习概念";

    return {
      color: "var(--cherry-blue)",
      analogy: `${displayName} 可以先当作一个“待拆解的科学模型”：不要急着背定义，先看它解决什么问题、由哪些组成部分构成、会在哪些条件下发生变化。`,
      prerequisite: ["先确认这个概念属于哪个学科或章节", "先找 2-3 个教材关键词", "先区分定义、机制、例子和适用边界"],
      diagnostic: `先自测：你能不能不用背诵定义，用自己的话说出“${displayName} 解释了什么现象”？如果只能复述名词，说明还需要补充例子和机制。`,
      evidenceBoundary: `这是基于稳定解释流程生成的学习卡，不会替你编造 ${displayName} 的专属事实；涉及具体数据、公式、物种、疾病或实验结论时，需要回到教材、论文或学习资料核查。`,
      transferTask: `找一个你见过的 ${displayName} 例子，按“现象是什么、概念如何解释、还有什么不能解释”三句话写下来。`,
      workedExample: {
        title: `${displayName} 三步拆解`,
        situation: `把 ${displayName} 写在中心，左边列“我已经知道的例子”，右边列“我还说不清的机制或条件”。`,
        guideQuestion: `如果别人问你“${displayName} 为什么重要”，你能否说出一个现象、一个关键机制和一个使用边界？`,
        learnerOutput: `你产出一张三栏学习卡：定义一句话、机制三步骤、容易混淆的一点。资料不足的地方标为“待核查”，不要强行定论。`,
      },
      levels: [
        { title: "入门版", body: `${displayName} 是一个需要先用例子进入的概念。先问它描述什么现象，再用一句话写出最核心的关系。` },
        { title: "基础版", body: `学习 ${displayName} 时，把它拆成定义、参与对象、过程步骤、结果和限制条件。每一项都要能配一个例子。` },
        { title: "进阶版", body: `进一步学习 ${displayName} 时，需要区分概念模型、证据来源、适用范围、例外情况和不同文献中的定义差异。` },
      ],
      terms: [displayName, "定义", "机制", "例子", "边界"],
      mechanism: ["先定位这个概念解释的现象", "再找参与对象或关键变量", "再整理过程或因果关系", "最后写出适用条件和不能推出的结论"],
      compare: `${displayName} 的定义、例子和机制不是同一件事。定义负责说明它是什么，例子帮助你看见它，机制解释它如何发生。`,
      pitfall: `不要只背 ${displayName} 的一句定义。只会背定义，遇到新情境时仍然无法判断它是否适用。`,
      quiz: {
        question: `学习 ${displayName} 时，最能检查理解的一步是什么？`,
        options: ["把定义、机制、例子和边界分开", "只背一个最短定义", "跳过例子直接记答案"],
        answer: "把定义、机制、例子和边界分开",
        explain: "真正理解一个概念，需要能解释它适用在哪些情境，也能说出不能直接推出什么。",
      },
    };
  }

  const active = explanations[concept] ?? buildConceptAgentExplanation(concept);
  const sourceBoundaryText = sourceBoundary.trim() || "未提供具体资料；先按通用解释生成，具体事实待核查";
  const stuckPointText = stuckPoint.trim() || "暂未填写卡点；先用诊断问题定位";
  const applicationContextText = applicationContext.trim() || "暂未填写应用情境；先用通用迁移练习检查";
  const contextualEvidenceBoundary = `${active.evidenceBoundary} 当前资料边界：${sourceBoundaryText}`;
  const conceptInputQuality = [
    {
      label: "概念",
      status: conceptInput.trim().length >= 2 ? "已填写" : "待补充",
      detail: conceptInput.trim().length >= 2 ? conceptInput.trim() : "至少写出一个具体名词或短语。",
    },
    {
      label: "当前水平",
      status: audience.trim().length >= 2 ? "已填写" : "待补充",
      detail: audience.trim().length >= 2 ? audience.trim() : "写出你现在的学习背景或章节位置。",
    },
    {
      label: "资料边界",
      status: sourceBoundary.trim().length >= 12 ? "可用" : "偏少",
      detail: sourceBoundary.trim().length >= 12 ? sourceBoundaryText : "写清来自教材、笔记、论文、视频，或暂时未知。",
    },
    {
      label: "当前卡点",
      status: stuckPoint.trim().length >= 10 ? "可用" : "偏少",
      detail: stuckPoint.trim().length >= 10 ? stuckPointText : "写出你哪里说不清、容易混淆或不会应用。",
    },
    {
      label: "应用情境",
      status: applicationContext.trim().length >= 8 ? "可用" : "偏少",
      detail: applicationContext.trim().length >= 8 ? applicationContextText : "写出要用在哪道题、哪张图、哪段材料或哪个现象里。",
    },
  ];
  const conceptInputQualityScore = conceptInputQuality.filter((item) => item.status === "已填写" || item.status === "可用").length;
  const selectedLevel = active.levels[Math.min(levelIndex, active.levels.length - 1)];
  const quizAnswered = quizChoice !== null;
  const presetConcepts = Object.keys(explanations);
  const isPresetConcept = Boolean(explanations[concept]);
  const conceptFlow = [
    { label: "概念", value: concept },
    { label: "诊断", value: active.diagnostic.split("。")[0] },
    { label: "机制", value: `${active.mechanism.length} 步` },
    { label: "迁移", value: active.transferTask.split("，")[0] },
  ];
  const lessonFlow = [
    {
      title: "1 分钟进入",
      body: `先写下“我听到${concept}会想到什么”，再用类比切入：${active.analogy}`,
    },
    {
      title: "3 分钟学清",
      body: `${selectedLevel.title}只保留一个主线：${selectedLevel.body}`,
    },
    {
      title: "2 分钟辨析",
      body: `${active.compare} 常见误区提醒：${active.pitfall}`,
    },
    {
      title: "1 分钟检查",
      body: `用即时小测收束：${active.quiz.question}`,
    },
  ];
  const conceptSkillSteps = [
    "先锁定概念、学习阶段、资料边界、当前卡点和应用情境。",
    "如果缺少来源、卡点或应用情境，最多问 2 个短问题；若继续生成，就把假设写明。",
    "再生成一个诊断问题，暴露我可能卡住的地方。",
    "再给出一个低门槛类比，但明确类比不能推出什么。",
    "再选择一种可视化解释：流程图、对照表、三栏概念图、因果链或循环图。",
    "再拆成 4 个以内的机制步骤，避免堆术语。",
    "再给出一个情境练习，让我产出一句解释或一张小表。",
    "最后生成即时小测、证据边界和完成门槛，提醒哪些内容需要查教材或资料。",
  ];
  const visualMode = /循环|周期|轮回|代谢/.test(concept)
    ? "循环图"
    : /比较|差异|分类|类型|区别/.test(concept)
      ? "对照表"
      : /转录|翻译|表达|凋亡|光合|呼吸|反应|过程|合成|分解/.test(concept)
        ? "流程箭头图"
        : /原因|影响|调控|效应|机制/.test(concept)
          ? "因果链"
          : "三栏概念图";
  const visualStructureItems = visualMode === "循环图"
    ? [
        { title: "起始状态", body: active.mechanism[0] ?? `${concept} 从一个可观察状态开始。`, tone: "var(--cherry-yellow-light)" },
        { title: "关键变化", body: active.mechanism[1] ?? "找出推动变化的变量或条件。", tone: "var(--cherry-blue-light)" },
        { title: "反馈回路", body: active.mechanism[2] ?? "观察结果如何影响下一轮变化。", tone: "var(--cherry-sage-light)" },
        { title: "边界条件", body: contextualEvidenceBoundary, tone: "var(--cherry-peach-light)" },
      ]
    : visualMode === "对照表"
      ? [
          { title: "它是什么", body: selectedLevel.body, tone: "var(--cherry-yellow-light)" },
          { title: "常混概念", body: active.compare, tone: "var(--cherry-blue-light)" },
          { title: "判断证据", body: active.workedExample.guideQuestion, tone: "var(--cherry-sage-light)" },
          { title: "不能推出", body: active.pitfall, tone: "var(--cherry-peach-light)" },
        ]
      : visualMode === "因果链"
        ? [
            { title: "触发条件", body: active.mechanism[0] ?? `${concept} 先由某个条件或变量启动。`, tone: "var(--cherry-yellow-light)" },
            { title: "中间机制", body: active.mechanism[1] ?? "中间过程需要拆成可检查的关系。", tone: "var(--cherry-blue-light)" },
            { title: "可见结果", body: active.mechanism[2] ?? "结果必须能回到现象或例子。", tone: "var(--cherry-sage-light)" },
            { title: "证据边界", body: contextualEvidenceBoundary, tone: "var(--cherry-peach-light)" },
          ]
        : visualMode === "流程箭头图"
          ? [
              { title: "步骤 1", body: active.mechanism[0] ?? `${concept} 先发生第一步变化。`, tone: "var(--cherry-yellow-light)" },
              { title: "步骤 2", body: active.mechanism[1] ?? "第二步连接对象、条件或变量。", tone: "var(--cherry-blue-light)" },
              { title: "步骤 3", body: active.mechanism[2] ?? "第三步解释中间产物或关系。", tone: "var(--cherry-sage-light)" },
              { title: "步骤 4", body: active.mechanism[3] ?? "最后写清结果和边界。", tone: "var(--cherry-peach-light)" },
            ]
          : [
              { title: "定义", body: selectedLevel.body, tone: "var(--cherry-yellow-light)" },
              { title: "例子", body: active.workedExample.situation, tone: "var(--cherry-blue-light)" },
              { title: "机制", body: active.mechanism.slice(0, 2).join("；"), tone: "var(--cherry-sage-light)" },
              { title: "边界", body: contextualEvidenceBoundary, tone: "var(--cherry-peach-light)" },
            ];
  const conceptAgentCards = [
    {
      title: "输入完整度",
      body: `${conceptInputQualityScore}/5 项可用。${conceptInputQualityScore < 5 ? "缺少的信息会被标成待核查，不会强行定论。" : "可以生成更贴近当前卡点和应用情境的解释与练习。"}`,
    },
    {
      title: "资料边界",
      body: `本次只在这个范围内定论：${sourceBoundaryText}`,
    },
    {
      title: "当前卡点",
      body: `解释优先解决这个卡点：${stuckPointText}`,
    },
    {
      title: "应用情境",
      body: `最后要能用在这里：${applicationContextText}`,
    },
    {
      title: "收窄范围",
      body: isPresetConcept ? "当前概念已有高质量卡片，可以直接从诊断问题进入。" : `如果“${concept}”太宽，先限定到一个章节、现象或应用场景，再生成学习卡。`,
    },
    {
      title: "可视化选择",
      body: `本次优先用${visualMode}：把概念、关键变量、变化过程和边界放在同一张图里看。`,
    },
    {
      title: "输出顺序",
      body: "固定按诊断、类比、机制、例子、迁移、小测、证据边界输出，避免只给一段定义。",
    },
    {
      title: "合格标准",
      body: `你能用“${concept}”解释“${applicationContextText}”，并说出它不能直接推出什么。`,
    },
  ];
  const understandingChecks = [
    {
      title: "一句话定义",
      prompt: `不用背原文，用自己的话写出“${concept}解释了什么”。`,
      pass: "句子里同时出现对象、关系或变化，不只是重复名词。",
    },
    {
      title: "机制复述",
      prompt: `按 1-4 步复述${concept}如何发生或如何起作用。`,
      pass: "每一步都能接上前一步，没有突然跳到结论。",
    },
    {
      title: "例子迁移",
      prompt: `把${concept}用到“${applicationContextText}”，判断它是否适用。`,
      pass: "能说出适用理由，也能指出至少一个不确定点。",
    },
    {
      title: "边界提醒",
      prompt: `写出一个不能由${concept}直接推出的结论。`,
      pass: "没有把类比、经验判断或单个例子当成通用事实。",
    },
  ];
  const learnerAuditAnswers = {
    definition: definitionDraft.trim(),
    mechanism: mechanismDraft.trim(),
    transfer: transferDraft.trim(),
    boundary: boundaryDraft.trim(),
  };
  const learnerAuditFields = [
    {
      id: "concept-definition-draft",
      title: "一句话定义",
      prompt: `用自己的话写出${concept}解释了什么，不要只复制上面的定义。`,
      value: definitionDraft,
      setter: setDefinitionDraft,
      placeholder: `我理解的${concept}是……它解释了……`,
      pass: learnerAuditAnswers.definition.length >= 18,
      passText: "至少写清对象和关系。",
    },
    {
      id: "concept-mechanism-draft",
      title: "机制复述",
      prompt: `按 1-4 步写出${concept}如何发生或如何起作用。`,
      value: mechanismDraft,
      setter: setMechanismDraft,
      placeholder: active.mechanism.map((item, index) => `${index + 1}. ${item}`).join("\n"),
      pass: learnerAuditAnswers.mechanism.length >= 28 && /1|一|①|第一|2|二|②|第二/.test(learnerAuditAnswers.mechanism),
      passText: "至少有两个连续步骤。",
    },
    {
      id: "concept-transfer-draft",
      title: "新例子判断",
      prompt: `把${concept}应用到一个新例子，并说明为什么适用或不适用。`,
      value: transferDraft,
      setter: setTransferDraft,
      placeholder: `新例子：……\n判断：这个例子适合 / 不适合用${concept}解释，因为……`,
      pass: learnerAuditAnswers.transfer.length >= 28 && /因为|理由|证据|所以/.test(learnerAuditAnswers.transfer),
      passText: "需要写出判断理由。",
    },
    {
      id: "concept-boundary-draft",
      title: "边界提醒",
      prompt: `写出一个不能由${concept}直接推出的结论。`,
      value: boundaryDraft,
      setter: setBoundaryDraft,
      placeholder: `${concept}不能直接证明……还需要查……`,
      pass: learnerAuditAnswers.boundary.length >= 18 && /不能|不代表|还需要|待核查|边界/.test(learnerAuditAnswers.boundary),
      passText: "需要保留不能推出或待核查的信息。",
    },
  ];
  const learnerAuditScore = learnerAuditFields.filter((field) => field.pass).length;
  const selfAuditOutput = `【概念理解自查记录】
概念：${concept}
学习阶段：${audience}
学习目标：${lessonGoal}
资料边界：${sourceBoundaryText}
当前卡点：${stuckPointText}
应用情境：${applicationContextText}

验收维度
${understandingChecks.map((item, index) => `${index + 1}. ${item.title}
任务：${item.prompt}
通过标准：${item.pass}`).join("\n\n")}

我的最小产出
1. 一句话定义：${learnerAuditAnswers.definition || "（未填写）"}
2. 机制步骤：${learnerAuditAnswers.mechanism || "（未填写）"}
3. 新例子判断：${learnerAuditAnswers.transfer || "（未填写）"}
4. 不能直接推出：${learnerAuditAnswers.boundary || "（未填写）"}

我的填写记录
完成度：${learnerAuditScore}/4
${learnerAuditFields.map((field, index) => `${index + 1}. ${field.title}：${field.pass ? "可用" : "待补充"}｜${field.passText}`).join("\n")}

证据边界
${contextualEvidenceBoundary}`;
  const lessonOutput = `【概念】${concept}
【学习阶段】${audience}
【学习目标】${lessonGoal}
【资料边界】${sourceBoundaryText}
【当前卡点】${stuckPointText}
【应用情境】${applicationContextText}

一、Agent 运行记录
${conceptAgentCards.map((item, index) => `${index + 1}. ${item.title}：${item.body}`).join("\n")}

二、先修知识
${active.prerequisite.map((item, index) => `${index + 1}. ${item}`).join("\n")}

三、诊断问题
${active.diagnostic}

四、先用类比进入
${active.analogy}

五、${selectedLevel.title}解释
${selectedLevel.body}

六、可视化解释
${visualMode}
${visualStructureItems.map((item, index) => `${index + 1}. ${item.title}：${item.body}`).join("\n")}

七、机制步骤
${active.mechanism.map((item, index) => `${index + 1}. ${item}`).join("\n")}

八、关键词
${active.terms.join("、")}

九、辨析
${active.compare}

十、常见误区
${active.pitfall}

十一、练习情境
${active.workedExample.title}
情境：${active.workedExample.situation}
引导问题：${active.workedExample.guideQuestion}
学习产出：${active.workedExample.learnerOutput}

十二、证据边界
${contextualEvidenceBoundary}

十三、迁移任务
${active.transferTask}

十四、理解验收
${understandingChecks.map((item, index) => `${index + 1}. ${item.title}：${item.prompt}｜通过标准：${item.pass}`).join("\n")}

十五、学习流程
${lessonFlow.map((item) => `${item.title}：${item.body}`).join("\n")}

十六、即时小测
问题：${active.quiz.question}
选项：${active.quiz.options.join(" / ")}
答案：${active.quiz.answer}
解释：${active.quiz.explain}`;
  const conceptSkillPrompt = `---
name: concept-explainer
description: Use when a learner wants to understand any concept through diagnosis, analogy, mechanism steps, visual structure, transfer practice, and a quick check without skipping the reasoning process.
---

# Concept Explainer

## Role

You are a concept explainer for an adult learner. You are here 陪我学习 one concept at a time. Do not only give a definition, 不要替我跳过判断过程.

## Current Run Input

- Concept: ${concept}
- Learning stage: ${audience}
- Learning goal: ${lessonGoal}
- Source boundary: ${sourceBoundaryText}
- Current confusion: ${stuckPointText}
- Application context: ${applicationContextText}

## Input

Ask for or infer these fields:

- Concept: the exact concept to learn.
- Learning stage: the learner's current level or context.
- Learning goal: what the learner wants to be able to explain, judge, or apply.
- Source boundary: textbook, notes, paper, article, or unknown.
- Current confusion: the learner's stuck point, misconception, or example that does not make sense yet.
- Application context: the question, figure, material, phenomenon, or real use case where the concept must be applied.

If the concept is too broad, narrow it to one chapter, phenomenon, problem type, or use case before explaining.

If any field is missing, ask at most two short questions. Prioritize source boundary and current confusion, then capture application context. If the learner wants to continue without answering, make the smallest safe assumption, label it as "assumption", and keep the source boundary as "unknown".

## Workflow

${conceptSkillSteps.map((item, index) => `${index + 1}. ${item}`).join("\n")}

## Visual Mode Selection

- Use a flow diagram for processes, sequences, synthesis, decomposition, or transformations.
- Use a comparison table for differences, categories, similar terms, or common confusions.
- Use a causal chain for regulation, effects, mechanisms, causes, or consequences.
- Use a cycle map for loops, cycles, feedback, rhythms, or repeated states.
- Use a three-column concept map when the concept is broad and needs definition, example, mechanism, and boundary.

## Output Format

1. Prerequisites: 3 points the learner should confirm first.
2. Diagnostic question: 1 question that checks real understanding.
3. Analogy: 1 analogy plus its limitation.
4. Layered explanation: beginner, basic, and advanced versions.
5. Visual explanation: name the chosen structure and list its nodes.
   Current visual structure nodes: ${visualStructureItems.map((item) => `${item.title}=${item.body}`).join(" | ")}
6. Mechanism steps: at most 4 steps, one sentence each.
7. Key terms: 4-6 terms.
8. Distinction: one concept it is often confused with.
9. Common pitfall: one likely wrong understanding.
10. Practice situation: context, guide question, and expected learner output.
11. Transfer task: a new example where the learner must apply the concept.
12. Understanding audit: 4 observable checks covering definition, mechanism, transfer, and boundary.
13. Quick check: one multiple-choice question with answer and explanation.
14. Evidence boundary: what needs to be checked in source material and what is only a general explanation.

## Completion Gate

Before finishing, make sure the answer gives the learner a minimum usable output:

- A one-sentence explanation in the learner's own words.
- A mechanism retelling in 1-4 steps.
- One transfer example where the concept is applied to a new case, preferably close to the stated application context.
- One boundary statement saying what the concept cannot directly prove.

If any of these are missing, add them before the final answer.

## Quality Rules

- Speak directly to the learner with "you".
- Keep the structure stable so the result can become a study card.
- Mark uncertain or source-dependent content as "to verify".
- 不编造具体事实、数据、物种、疾病、公式或研究结论。
- If source boundary is unknown, separate general explanation from source-dependent facts.
- Separate definition, example, mechanism, evidence, and boundary.
- Add pass criteria so the learner can judge whether the output is usable.
- Make the final task observable: the learner should know what to write, draw, compare, or check.`;

  function chooseConcept(name: string) {
    setConcept(name);
    setConceptInput(name);
    setQuizChoice(null);
    setCopiedLesson(false);
    setCopiedSkill(false);
    setCopiedAudit(false);
    setCopyStatus("");
  }

  function runConceptAgent() {
    const nextConcept = conceptInput.trim() || "待学习概念";
    setConcept(nextConcept);
    setQuizChoice(null);
    setCopiedLesson(false);
    setCopiedSkill(false);
    setCopiedAudit(false);
    setCopyStatus(explanations[nextConcept] ? "已载入预设高质量解释。" : "已按解释 Agent skill 生成学习卡。");
  }

  async function copyLessonOutput() {
    const copiedToClipboard = await copyText(lessonOutput);
    if (copiedToClipboard) {
      setCopiedLesson(true);
      setCopiedSkill(false);
      setCopiedAudit(false);
      setCopyStatus("学习卡已复制到剪贴板。");
      window.setTimeout(() => setCopiedLesson(false), 1400);
      return;
    }

    setCopiedLesson(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyConceptSkillPrompt() {
    const copiedToClipboard = await copyText(conceptSkillPrompt);
    if (copiedToClipboard) {
      setCopiedSkill(true);
      setCopiedLesson(false);
      setCopiedAudit(false);
      setCopyStatus("概念解释 skill 指令已复制到剪贴板。");
      window.setTimeout(() => setCopiedSkill(false), 1400);
      return;
    }

    setCopiedSkill(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyUnderstandingAudit() {
    const copiedToClipboard = await copyText(selfAuditOutput);
    if (copiedToClipboard) {
      setCopiedAudit(true);
      setCopiedLesson(false);
      setCopiedSkill(false);
      setCopyStatus("理解自查记录已复制到剪贴板。");
      window.setTimeout(() => setCopiedAudit(false), 1400);
      return;
    }

    setCopiedAudit(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  return (
    <section id="concept-explainer-tool" style={{ display: "grid", gap: "1rem" }}>
      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 18, padding: "0.95rem", boxShadow: "3px 5px 0px rgba(94,68,42,0.06)", display: "grid", gap: "0.75rem" }}>
        <div>
          <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.28rem" }}>概念解释 Agent</div>
          <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.8rem", lineHeight: 1.58, fontWeight: 800 }}>
            输入任意概念，按稳定 skill 流程生成学习卡：先自测，再看类比、机制步骤、常见误区、可视化流程、迁移练习和即时小测。
          </div>
        </div>
        <div className="concept-agent-input-grid" style={{ display: "grid", gridTemplateColumns: "minmax(180px, 0.72fr) minmax(180px, 0.72fr) minmax(0, 1.1fr)", gap: "0.65rem", alignItems: "end" }}>
          <label style={{ display: "grid", gap: 5, color: "var(--cherry-warm-brown)", fontSize: "0.78rem", fontWeight: 900 }}>
            输入概念
            <input value={conceptInput} onChange={(event) => { setConceptInput(event.target.value); setCopiedAudit(false); setCopyStatus(""); }} onKeyDown={(event) => { if (event.key === "Enter") runConceptAgent(); }} placeholder="例如：光合作用、细胞周期、孟德尔遗传" style={{ border: "1.5px solid var(--border)", borderRadius: 12, padding: "0.58rem 0.72rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800 }} />
          </label>
          <label style={{ display: "grid", gap: 5, color: "var(--cherry-warm-brown)", fontSize: "0.78rem", fontWeight: 900 }}>
            当前水平
            <input value={audience} onChange={(event) => { setAudience(event.target.value); setCopiedLesson(false); setCopiedAudit(false); setCopiedSkill(false); setCopyStatus(""); }} placeholder="例如：本科入门 / 论文初读 / 复习" style={{ border: "1.5px solid var(--border)", borderRadius: 12, padding: "0.58rem 0.72rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800 }} />
          </label>
          <label style={{ display: "grid", gap: 5, color: "var(--cherry-warm-brown)", fontSize: "0.78rem", fontWeight: 900 }}>
            学习目标
            <input value={lessonGoal} onChange={(event) => { setLessonGoal(event.target.value); setCopiedLesson(false); setCopiedAudit(false); setCopiedSkill(false); setCopyStatus(""); }} placeholder="例如：能用例子判断是否适用" style={{ border: "1.5px solid var(--border)", borderRadius: 12, padding: "0.58rem 0.72rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800 }} />
          </label>
          <label style={{ display: "grid", gap: 5, color: "var(--cherry-warm-brown)", fontSize: "0.78rem", fontWeight: 900 }}>
            资料边界
            <textarea value={sourceBoundary} onChange={(event) => { setSourceBoundary(event.target.value); setCopiedLesson(false); setCopiedAudit(false); setCopiedSkill(false); setCopyStatus(""); }} rows={3} placeholder="教材章节、笔记、论文、视频，或暂时未知" style={{ border: "1.5px solid var(--border)", borderRadius: 12, padding: "0.58rem 0.72rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800, resize: "vertical" }} />
          </label>
          <label style={{ display: "grid", gap: 5, color: "var(--cherry-warm-brown)", fontSize: "0.78rem", fontWeight: 900 }}>
            当前卡点
            <textarea value={stuckPoint} onChange={(event) => { setStuckPoint(event.target.value); setCopiedLesson(false); setCopiedAudit(false); setCopiedSkill(false); setCopyStatus(""); }} rows={3} placeholder="例如：会背定义，但不会判断例子是否成立" style={{ border: "1.5px solid var(--border)", borderRadius: 12, padding: "0.58rem 0.72rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800, resize: "vertical" }} />
          </label>
          <label style={{ display: "grid", gap: 5, color: "var(--cherry-warm-brown)", fontSize: "0.78rem", fontWeight: 900 }}>
            应用情境
            <textarea value={applicationContext} onChange={(event) => { setApplicationContext(event.target.value); setCopiedLesson(false); setCopiedAudit(false); setCopiedSkill(false); setCopyStatus(""); }} rows={3} placeholder="例如：解释一道题、一张图、一个实验现象或一段材料" style={{ border: "1.5px solid var(--border)", borderRadius: 12, padding: "0.58rem 0.72rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800, resize: "vertical" }} />
          </label>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.42rem" }}>
            {["自测", "类比", "机制", "练习"].map((item, index) => (
              <span key={item} style={{ background: index === 0 ? "var(--cherry-yellow-light)" : index === 1 ? "var(--cherry-blue-light)" : index === 2 ? "var(--cherry-sage-light)" : "var(--cherry-peach-light)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.42rem 0.36rem", color: "var(--cherry-warm-brown)", fontSize: "0.7rem", fontWeight: 900, textAlign: "center" }}>
                {index + 1}. {item}
              </span>
            ))}
            </div>
            <button type="button" onClick={runConceptAgent} aria-describedby="concept-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.62rem 0.95rem", fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap" }}>
              生成学习卡
            </button>
          </div>
        </div>
        <div className="concept-input-quality-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "0.55rem" }}>
          {conceptInputQuality.map((item) => (
            <div key={item.label} style={{ background: item.status === "已填写" || item.status === "可用" ? "var(--cherry-sage-light)" : "var(--cherry-yellow-light)", border: "1.5px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.58rem", minHeight: 92 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.45rem", alignItems: "center", marginBottom: "0.3rem" }}>
                <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.72rem" }}>{item.label}</strong>
                <span style={{ color: item.status === "已填写" || item.status === "可用" ? "var(--cherry-forest)" : "var(--cherry-red)", fontSize: "0.66rem", fontWeight: 900 }}>{item.status}</span>
              </div>
              <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.7rem", lineHeight: 1.42, fontWeight: 800 }}>{item.detail}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 18, padding: "0.95rem", boxShadow: "3px 5px 0px rgba(94,68,42,0.06)", display: "grid", gap: "0.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900 }}>Agent 运行面板</div>
            <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.55, marginTop: "0.2rem", fontWeight: 800 }}>
              每次输入概念后，先看它如何锁定资料边界、当前卡点、图形结构和合格标准。
            </div>
          </div>
          <span style={{ background: "var(--cherry-blue-light)", border: "1.5px solid rgba(85,137,179,0.2)", borderRadius: 999, padding: "0.28rem 0.68rem", color: "var(--cherry-warm-brown)", fontSize: "0.72rem", fontWeight: 900 }}>
            {visualMode}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.58rem" }}>
          {conceptAgentCards.map((item, index) => (
            <div key={item.title} style={{ background: index === 1 ? "var(--cherry-blue-light)" : index === 3 ? "var(--cherry-sage-light)" : "var(--muted)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 12, padding: "0.72rem", minHeight: 122 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: active.color, color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.66rem", fontWeight: 900, marginBottom: "0.46rem" }}>{index + 1}</span>
              <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.78rem", marginBottom: "0.3rem" }}>{item.title}</strong>
              <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.55, fontWeight: 800 }}>{item.body}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 18, padding: "0.95rem", boxShadow: "3px 5px 0px rgba(94,68,42,0.06)", display: "grid", gap: "0.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900 }}>可视化解释图</div>
            <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.55, marginTop: "0.2rem", fontWeight: 800 }}>
              先把概念画成 {visualMode}，再读文字解释。每个节点都对应一条可复述的判断。
            </div>
          </div>
          <span style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 999, padding: "0.28rem 0.68rem", color: "var(--cherry-warm-brown)", fontSize: "0.72rem", fontWeight: 900 }}>
            {visualStructureItems.length} 个节点
          </span>
        </div>
        <div className="concept-visual-structure" role="group" aria-label={`${concept} 的${visualMode}可视化解释`} style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.65rem", alignItems: "stretch" }}>
          {visualStructureItems.map((item, index) => (
            <div key={`${item.title}-${index}`} style={{ background: item.tone, border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 16, padding: "0.76rem", minHeight: 142, position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" style={{ position: "absolute", right: 10, top: 10, width: 42, height: 42, borderRadius: "50%", background: "rgba(250,247,241,0.64)", border: `2px solid ${active.color}`, opacity: 0.68 }} />
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: active.color, color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 900, marginBottom: "0.48rem", position: "relative", zIndex: 1 }}>{index + 1}</div>
              <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.8rem", marginBottom: "0.34rem", position: "relative", zIndex: 1 }}>{item.title}</strong>
              <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.55, fontWeight: 800, position: "relative", zIndex: 1 }}>{item.body}</span>
              {index < visualStructureItems.length - 1 ? (
                <span className="concept-visual-connector" aria-hidden="true" style={{ position: "absolute", right: -14, top: "50%", width: 28, height: 28, borderRadius: "50%", background: active.color, color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 900, transform: "translateY(-50%)", zIndex: 2 }}>
                  {visualMode === "对照表" ? "=" : visualMode === "循环图" && index === visualStructureItems.length - 2 ? "↺" : ">"}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 18, padding: "0.95rem", boxShadow: "3px 5px 0px rgba(94,68,42,0.06)", display: "grid", gap: "0.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900 }}>理解验收卡</div>
            <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.55, marginTop: "0.2rem", fontWeight: 800 }}>
              用四个可观察产出检查自己是否真的掌握，而不是只看过解释。
            </div>
          </div>
          <button type="button" onClick={copyUnderstandingAudit} aria-describedby="concept-copy-status" style={{ background: "var(--cherry-red)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.5rem 0.86rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
            {copiedAudit ? "已复制" : "复制自查记录"}
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.58rem" }}>
          {understandingChecks.map((item, index) => (
            <div key={item.title} style={{ background: index % 2 === 0 ? "var(--cherry-yellow-light)" : "var(--cherry-blue-light)", border: "1.5px solid rgba(94,68,42,0.1)", borderRadius: 14, padding: "0.72rem", minHeight: 142 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: active.color, color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.66rem", fontWeight: 900, marginBottom: "0.46rem" }}>{index + 1}</span>
              <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.8rem", marginBottom: "0.34rem" }}>{item.title}</strong>
              <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.55, fontWeight: 800, marginBottom: "0.42rem" }}>{item.prompt}</span>
              <span style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.72rem", lineHeight: 1.48, fontWeight: 900 }}>通过标准：{item.pass}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 18, padding: "0.95rem", boxShadow: "3px 5px 0px rgba(94,68,42,0.06)", display: "grid", gap: "0.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900 }}>我的理解记录</div>
            <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.55, marginTop: "0.2rem", fontWeight: 800 }}>
              解释看完后直接写 4 个最小产出。复制自查记录时，会一起带走你的填写内容。
            </div>
          </div>
          <span style={{ background: learnerAuditScore === 4 ? "var(--cherry-sage-light)" : "var(--cherry-yellow-light)", border: learnerAuditScore === 4 ? "1.5px solid rgba(93,140,101,0.26)" : "1.5px solid var(--cherry-yellow)", borderRadius: 999, padding: "0.3rem 0.68rem", color: learnerAuditScore === 4 ? "var(--cherry-forest)" : "var(--cherry-warm-brown)", fontSize: "0.74rem", fontWeight: 900 }}>
            理解记录完成度：{learnerAuditScore}/4 可用
          </span>
        </div>
        <div className="concept-understanding-input-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.68rem" }}>
          {learnerAuditFields.map((field, index) => (
            <label key={field.id} htmlFor={field.id} style={{ background: field.pass ? "var(--cherry-sage-light)" : index % 2 === 0 ? "var(--cherry-yellow-light)" : "var(--cherry-blue-light)", border: field.pass ? "1.5px solid rgba(93,140,101,0.24)" : "1.5px solid rgba(94,68,42,0.1)", borderRadius: 14, padding: "0.72rem", display: "grid", gap: "0.48rem", alignContent: "start" }}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.6rem" }}>
                <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.8rem" }}>{field.title}</strong>
                <span style={{ color: field.pass ? "var(--cherry-forest)" : "var(--cherry-red)", fontSize: "0.68rem", fontWeight: 900 }}>{field.pass ? "可用" : "待补充"}</span>
              </span>
              <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.48, fontWeight: 800 }}>{field.prompt}</span>
              <textarea
                id={field.id}
                value={field.value}
                onChange={(event) => {
                  field.setter(event.target.value);
                  setCopiedAudit(false);
                  setCopyStatus("");
                }}
                rows={4}
                placeholder={field.placeholder}
                style={{ width: "100%", boxSizing: "border-box", minHeight: 112, border: "1.5px solid rgba(94,68,42,0.14)", borderRadius: 12, background: "rgba(250,247,241,0.72)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontSize: "0.76rem", lineHeight: 1.55, fontWeight: 800, padding: "0.6rem", resize: "vertical" }}
              />
              <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.68rem", lineHeight: 1.42, fontWeight: 900 }}>通过标准：{field.passText}</span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", fontWeight: 900 }}>高质量样例</span>
        {presetConcepts.map((name) => (
          <button key={name} type="button" aria-pressed={concept === name} onClick={() => chooseConcept(name)} style={{ border: concept === name ? `1.5px solid ${active.color}` : "1.5px solid var(--border)", background: concept === name ? "var(--cherry-yellow-light)" : "var(--card)", borderRadius: 999, padding: "0.45rem 0.9rem", color: "var(--cherry-warm-brown)", fontWeight: 900, cursor: "pointer" }}>
            {name}
          </button>
        ))}
        {!isPresetConcept ? (
          <span style={{ background: "var(--cherry-blue-light)", border: "1.5px solid rgba(85,137,179,0.2)", borderRadius: 999, padding: "0.26rem 0.62rem", color: "var(--cherry-warm-brown)", fontSize: "0.72rem", fontWeight: 900 }}>
            当前：Agent 生成
          </span>
        ) : null}
      </div>

      <div className="concept-responsive-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto", gap: "0.75rem", alignItems: "center", background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 18, padding: "0.95rem", boxShadow: "3px 5px 0px rgba(94,68,42,0.06)" }}>
        <div>
          <div style={{ color: "var(--cherry-warm-brown)", fontSize: "0.86rem", fontWeight: 900, marginBottom: "0.24rem" }}>保存这次学习产出</div>
          <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.55, fontWeight: 800 }}>
            学习卡会带上概念、当前水平、目标、资料边界、卡点、应用情境、可视化节点、练习和验收标准。
          </div>
        </div>
        <button type="button" onClick={copyLessonOutput} aria-describedby="concept-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.62rem 0.95rem", fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap" }}>
          {copiedLesson ? "已复制" : "复制学习卡"}
        </button>
        <button type="button" onClick={copyUnderstandingAudit} aria-describedby="concept-copy-status" style={{ background: "var(--cherry-red)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.62rem 0.95rem", fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap" }}>
          {copiedAudit ? "已复制" : "复制自查记录"}
        </button>
        <div id="concept-copy-status" role="status" aria-live="polite" style={{ gridColumn: "1 / -1", minHeight: "1.1rem", color: "var(--cherry-forest)", fontSize: "0.78rem", fontWeight: 900 }}>
          {copyStatus}
        </div>
      </div>

      <div style={{ background: "var(--cherry-sage-light)", border: "1.5px solid rgba(93,140,101,0.22)", borderRadius: 18, padding: "0.95rem", boxShadow: "3px 5px 0px rgba(94,68,42,0.04)", display: "grid", gap: "0.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900 }}>概念解释 skill 协议</div>
            <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.55, marginTop: "0.22rem", fontWeight: 800 }}>
              这套协议已落成公开 SKILL.md：先诊断，再类比，再机制，再练习，最后补小测和证据边界。
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
            <a href="/skills/concept-explainer/SKILL.md" className="work-detail-link" style={{ background: "var(--card)", color: "var(--cherry-forest)", border: "1.5px solid rgba(58,92,62,0.24)", borderRadius: 999, padding: "0.48rem 0.82rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem", textDecoration: "none" }}>
              查看 SKILL.md
            </a>
            <button type="button" onClick={copyConceptSkillPrompt} aria-describedby="concept-copy-status" style={{ background: "var(--card)", color: "var(--cherry-forest)", border: "1.5px solid rgba(58,92,62,0.24)", borderRadius: 999, padding: "0.48rem 0.82rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
              {copiedSkill ? "已复制" : "复制完整 Skill"}
            </button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.55rem" }}>
          {conceptSkillSteps.map((item, index) => (
            <div key={item} style={{ background: "rgba(250,247,241,0.72)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.62rem", display: "grid", gridTemplateColumns: "24px minmax(0, 1fr)", gap: "0.48rem", alignItems: "start" }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--cherry-forest)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 900 }}>{index + 1}</span>
              <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.55, fontWeight: 800 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="concept-responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem" }}>
        <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 18, padding: "0.9rem", boxShadow: "3px 5px 0px rgba(94,68,42,0.06)" }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.86rem", marginBottom: "0.62rem" }}>先修知识</div>
          <div style={{ display: "grid", gap: "0.46rem" }}>
            {active.prerequisite.map((item, index) => (
              <div key={item} style={{ display: "grid", gridTemplateColumns: "22px minmax(0, 1fr)", gap: "0.46rem", alignItems: "start", color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.52, fontWeight: 800 }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", background: active.color, color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 900 }}>{index + 1}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 18, padding: "0.9rem", boxShadow: "3px 5px 0px rgba(94,68,42,0.04)" }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.86rem", marginBottom: "0.48rem" }}>诊断问题</div>
          <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.8rem", lineHeight: 1.62, fontWeight: 800 }}>{active.diagnostic}</div>
        </div>
        <div style={{ background: "var(--cherry-sage-light)", border: "1.5px solid rgba(93,140,101,0.22)", borderRadius: 18, padding: "0.9rem", boxShadow: "3px 5px 0px rgba(94,68,42,0.04)" }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.86rem", marginBottom: "0.48rem" }}>证据边界</div>
          <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.8rem", lineHeight: 1.62, fontWeight: 800 }}>{contextualEvidenceBoundary}</div>
        </div>
      </div>

      <div className="concept-responsive-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(280px, 0.78fr)", gap: "1rem", alignItems: "stretch" }}>
        <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="concept-flow-map" role="group" aria-label="概念学习卡生成流程" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.55rem", marginBottom: "1rem" }}>
              {conceptFlow.map((item, index) => (
                <div key={item.label} style={{ minHeight: 96, borderRadius: 16, border: "1.5px solid rgba(94,68,42,0.12)", background: index === 0 ? "var(--cherry-yellow-light)" : index === 1 ? "var(--cherry-blue-light)" : index === 2 ? "var(--cherry-sage-light)" : "var(--cherry-peach-light)", padding: "0.68rem", position: "relative", overflow: "hidden" }}>
                  <svg width="72" height="58" viewBox="0 0 72 58" fill="none" aria-hidden="true" focusable="false" style={{ position: "absolute", right: -10, bottom: -8, opacity: 0.76 }}>
                    {index === 0 ? (
                      <>
                        <circle cx="29" cy="27" r="18" fill="rgba(250,247,241,0.86)" stroke={active.color} strokeWidth="2.6" />
                        <path d="M22 27 H38 M30 19 V35" stroke={active.color} strokeWidth="3.2" strokeLinecap="round" />
                        <circle cx="50" cy="18" r="6" fill="var(--cherry-yellow)" />
                      </>
                    ) : index === 1 ? (
                      <>
                        <path d="M17 41 C24 15 47 9 58 27 C46 45 29 49 17 41Z" fill="rgba(250,247,241,0.86)" stroke="rgba(94,68,42,0.16)" strokeWidth="1.8" />
                        <path d="M26 37 C36 30 43 23 53 18" stroke="var(--cherry-warm-brown)" strokeWidth="2.4" strokeLinecap="round" opacity="0.42" />
                        <circle cx="25" cy="37" r="4.2" fill="var(--cherry-red)" />
                        <circle cx="39" cy="28" r="4.2" fill="var(--cherry-sage)" />
                      </>
                    ) : index === 2 ? (
                      <>
                        {[16, 32, 48].map((x, dotIndex) => (
                          <g key={x}>
                            <circle cx={x} cy={22 + dotIndex * 8} r="7.5" fill="rgba(250,247,241,0.9)" stroke="var(--cherry-forest)" strokeWidth="1.8" />
                            {dotIndex < 2 ? <path d={`M${x + 7} ${25 + dotIndex * 8} C${x + 14} ${30 + dotIndex * 8} ${x + 17} ${32 + dotIndex * 8} ${x + 24} ${33 + dotIndex * 8}`} stroke="var(--cherry-forest)" strokeWidth="2.2" strokeLinecap="round" /> : null}
                          </g>
                        ))}
                      </>
                    ) : (
                      <>
                        <rect x="14" y="13" width="45" height="36" rx="12" fill="rgba(250,247,241,0.9)" stroke="rgba(94,68,42,0.16)" strokeWidth="1.8" />
                        <path d="M24 31 L32 39 L49 21" stroke="var(--cherry-forest)" strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="56" cy="39" r="5" fill="var(--cherry-yellow)" />
                      </>
                    )}
                  </svg>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: active.color, color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 900, marginBottom: "0.45rem", position: "relative", zIndex: 1 }}>{index + 1}</div>
                  <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.8rem", marginBottom: "0.22rem", position: "relative", zIndex: 1 }}>{item.label}</div>
                  <div style={{ color: "var(--cherry-warm-mid)", fontWeight: 800, fontSize: "0.68rem", lineHeight: 1.42, position: "relative", zIndex: 1, paddingRight: 26 }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "0.9rem" }}>
              {active.levels.map((level, index) => (
                <button key={level.title} type="button" aria-pressed={levelIndex === index} onClick={() => setLevelIndex(index)} style={{ background: levelIndex === index ? active.color : "var(--muted)", color: levelIndex === index ? "#FAF7F1" : "var(--cherry-warm-brown)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.42rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.8rem" }}>
                  {level.title}
                </button>
              ))}
            </div>
            <h2 style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "1.35rem", marginBottom: "0.65rem" }}>{concept}</h2>
            <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 16, padding: "0.85rem", color: "var(--cherry-warm-mid)", lineHeight: 1.7, marginBottom: "0.9rem" }}>
              <strong style={{ color: "var(--cherry-warm-brown)" }}>类比：</strong>{active.analogy}
            </div>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.45rem" }}>{selectedLevel.title}</div>
            <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.78, fontSize: "0.95rem", marginBottom: "1rem" }}>{selectedLevel.body}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {active.terms.map((term) => (
                <span key={term} style={{ background: "rgba(250,247,241,0.8)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 999, padding: "0.25rem 0.62rem", color: "var(--cherry-warm-brown)", fontWeight: 800, fontSize: "0.76rem" }}>
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.8rem" }}>即时小测</div>
          <div style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.9rem", marginBottom: "0.8rem" }}>{active.quiz.question}</div>
          <div style={{ display: "grid", gap: 7 }}>
            {active.quiz.options.map((option) => {
              const correct = option === active.quiz.answer;
              const selected = quizChoice === option;
              return (
                <button key={option} type="button" aria-pressed={selected} onClick={() => setQuizChoice(option)} style={{ textAlign: "left", background: selected ? (correct ? "var(--cherry-sage-light)" : "var(--cherry-peach-light)") : "var(--muted)", border: selected ? `1.5px solid ${correct ? "var(--cherry-forest)" : "var(--cherry-red)"}` : "1.5px solid var(--border)", borderRadius: 14, padding: "0.58rem 0.72rem", color: "var(--cherry-warm-brown)", fontWeight: 900, cursor: "pointer" }}>
                  {option}
                </button>
              );
            })}
          </div>
          {quizAnswered ? (
            <div role="status" aria-live="polite" style={{ marginTop: "0.85rem", background: quizChoice === active.quiz.answer ? "var(--cherry-sage-light)" : "var(--cherry-yellow-light)", borderRadius: 14, padding: "0.72rem", color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.84rem" }}>
              <strong style={{ color: "var(--cherry-warm-brown)" }}>{quizChoice === active.quiz.answer ? "答对了：" : "再看一遍："}</strong>{active.quiz.explain}
            </div>
          ) : null}
        </div>
      </div>

      <div className="concept-responsive-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(240px, 0.72fr)", gap: "1rem" }}>
        <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.9rem" }}>机制步骤</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
            {active.mechanism.map((item, index) => (
              <div key={item} style={{ background: index === levelIndex ? "var(--cherry-yellow-light)" : "var(--muted)", border: index === levelIndex ? `1.5px solid ${active.color}` : "1.5px solid rgba(94,68,42,0.1)", borderRadius: 16, padding: "0.78rem", minHeight: 112 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: active.color, color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 900, marginBottom: "0.55rem" }}>{index + 1}</div>
                <div style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.58, fontSize: "0.84rem", fontWeight: 800 }}>{item}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gap: "1rem" }}>
          <ContentCard title="辨析">
            {active.compare}
          </ContentCard>
          <ContentCard title="常见误区">
            {active.pitfall}
          </ContentCard>
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.85rem" }}>
          <div>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900 }}>练习情境</div>
            <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.55, marginTop: "0.2rem", fontWeight: 800 }}>{active.workedExample.title}</div>
          </div>
          <span style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 999, padding: "0.24rem 0.62rem", color: "var(--cherry-warm-brown)", fontSize: "0.72rem", fontWeight: 900 }}>
            可直接练习
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.75rem" }}>
          {[
            { title: "情境材料", body: active.workedExample.situation, bg: "var(--cherry-blue-light)" },
            { title: "引导问题", body: active.workedExample.guideQuestion, bg: "var(--cherry-sage-light)" },
            { title: "你的产出", body: active.workedExample.learnerOutput, bg: "var(--cherry-peach-light)" },
          ].map((item, index) => (
            <div key={item.title} style={{ background: item.bg, border: "1.5px solid rgba(94,68,42,0.1)", borderRadius: 16, padding: "0.86rem", minHeight: 142 }}>
              <span style={{ width: 24, height: 24, borderRadius: "50%", background: active.color, color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 900, marginBottom: "0.52rem" }}>
                {index + 1}
              </span>
              <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.82rem", marginBottom: "0.34rem" }}>{item.title}</strong>
              <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.8rem", lineHeight: 1.62, fontWeight: 800 }}>{item.body}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
        <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.75rem" }}>迁移任务</div>
        <div style={{ background: "var(--cherry-blue-light)", border: "1.5px solid rgba(85,137,179,0.22)", borderRadius: 16, padding: "0.86rem", color: "var(--cherry-warm-mid)", lineHeight: 1.68, fontSize: "0.86rem", fontWeight: 800 }}>
          {active.transferTask}
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
        <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.9rem" }}>学习流程</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
          {lessonFlow.map((item, index) => (
            <div key={item.title} style={{ background: index === 1 ? "var(--cherry-yellow-light)" : "var(--muted)", border: index === 1 ? `1.5px solid ${active.color}` : "1.5px solid rgba(94,68,42,0.1)", borderRadius: 16, padding: "0.82rem", minHeight: 126 }}>
              <div style={{ color: active.color, fontWeight: 900, marginBottom: "0.45rem", fontSize: "0.82rem" }}>{item.title}</div>
              <div style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.62, fontSize: "0.82rem", fontWeight: 800 }}>{item.body}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900 }}>可复制学习卡</div>
          <button type="button" onClick={copyLessonOutput} aria-describedby="concept-copy-status" style={{ background: "var(--cherry-yellow-light)", color: "var(--cherry-warm-brown)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 999, padding: "0.42rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
            {copiedLesson ? "已复制" : "复制"}
          </button>
        </div>
        <code style={{ display: "block", whiteSpace: "pre-wrap", background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 16, padding: "0.95rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.78rem", lineHeight: 1.68 }}>
          {lessonOutput}
        </code>
      </div>

      <style>
        {`
          #concept-explainer-tool button:focus-visible,
          #concept-explainer-tool input:focus-visible,
          #concept-explainer-tool textarea:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          #concept-explainer-tool button {
            transition: transform 0.18s ease, box-shadow 0.18s ease;
          }

          #concept-explainer-tool button:hover,
          #concept-explainer-tool button:focus-visible {
            transform: translateY(-2px);
          }

          @media (max-width: 860px) {
            #concept-explainer-tool .concept-agent-input-grid,
            #concept-explainer-tool .concept-understanding-input-grid,
            #concept-explainer-tool .concept-responsive-grid {
              grid-template-columns: 1fr !important;
            }

            #concept-explainer-tool .concept-input-quality-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }

            #concept-explainer-tool .concept-flow-map {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }

            #concept-explainer-tool .concept-visual-structure {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }

          @media (max-width: 520px) {
            #concept-explainer-tool .concept-input-quality-grid,
            #concept-explainer-tool .concept-flow-map {
              grid-template-columns: 1fr !important;
            }

            #concept-explainer-tool .concept-visual-structure {
              grid-template-columns: 1fr !important;
            }

            #concept-explainer-tool .concept-visual-connector {
              display: none !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            #concept-explainer-tool button {
              transition: none !important;
              transform: none !important;
            }
          }
        `}
      </style>
    </section>
  );
}

function CrisprContent() {
  const [guideIndex, setGuideIndex] = useState(0);
  const [step, setStep] = useState<"scan" | "bind" | "cut" | "repair">("scan");
  const [repair, setRepair] = useState<"indel" | "replace" | "failed">("indel");
  const [activeScenarioIndex, setActiveScenarioIndex] = useState<number | null>(0);
  const [copiedDecisionCard, setCopiedDecisionCard] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedRiskAudit, setCopiedRiskAudit] = useState(false);
  const [reportStatus, setReportStatus] = useState("");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizChoice, setQuizChoice] = useState<string | null>(null);
  const [decisionDraft, setDecisionDraft] = useState("");
  const [evidenceDraft, setEvidenceDraft] = useState("");
  const [riskBoundaryDraft, setRiskBoundaryDraft] = useState("");
  const [nextVerificationDraft, setNextVerificationDraft] = useState("");
  const target = "T A C G A T T A C C G T A G G".split(" ");
  const rnaComplement: Record<string, string> = { A: "U", T: "A", C: "G", G: "C" };
  const targetStart = 4;
  const targetLength = 8;
  const pamStart = 12;
  const guides = [
    { name: "向导 A", sequence: "U A A U G G C A", start: targetStart, score: 96, note: "目标区互补，旁边有 AGG PAM，Cas9 能稳定定位。" },
    { name: "向导 B", sequence: "U A A C G G C A", start: targetStart, score: 68, note: "目标区有 1 个错配，Cas9 仍可能结合，但剪切效率下降。" },
    { name: "向导 C", sequence: "G C A U U A C G", start: 1, score: 32, note: "目标弱匹配且离 PAM 较远，Cas9 很难在预期位点剪切。" },
  ];
  const interpretationSteps = [
    { title: "先找 PAM", body: "没有合适 PAM，Cas9 不会进入可靠的邻近序列检查。" },
    { title: "再看 guide 配对", body: "guide RNA 与目标 DNA 越互补，定位和剪切越稳定；错配会降低可信度。" },
    { title: "再判剪切位点", body: "剪切不是任意发生，而是在 PAM 附近的特定位点附近讨论。" },
    { title: "最后看修复", body: "CRISPR 的表型结果常常来自细胞如何修复切口，而不只是 Cas9 是否切开。" },
  ];
  const boundaryItems = [
    "这是概念模拟，不是实验操作流程；页面不提供真实实验参数、递送方案或临床建议。",
    "匹配评分只用于学习判读，真实 guide 设计还需要全基因组脱靶搜索、PAM 类型、细胞类型和实验验证。",
    "模板替换需要额外修复模板和实验条件，不能因为页面选择了替换就认为真实细胞一定按模板修复。",
  ];
  const qualityChecks = [
    "PAM 是否在目标附近",
    "guide 与目标互补关系是否清楚",
    "错配位置是否会影响剪切可信度",
    "修复结果是否区分插入/删除、模板替换和未编辑",
    "是否保留脱靶和实验验证边界",
  ];
  const stages = [
    { key: "scan", label: "找 PAM", text: "Cas9 先扫到 NGG 这类 PAM，才会检查旁边的 DNA 序列。" },
    { key: "bind", label: "配对", text: "向导 RNA 和目标 DNA 形成互补配对，错配会降低稳定性。" },
    { key: "cut", label: "剪切", text: "匹配足够时，Cas9 在 PAM 上游附近切开两条 DNA 链。" },
    { key: "repair", label: "修复", text: "细胞修复切口，结果可能是插入/删除、模板替换或未编辑。" },
  ] as const;
  const practiceScenarios = [
    {
      title: "高匹配敲除",
      guideIndex: 0,
      step: "repair" as const,
      repair: "indel" as const,
      goal: "判断高匹配 guide 为什么可以进入剪切和插入/删除结果讨论。",
      check: "报告里应同时说明 PAM、匹配评分、剪切位点和阅读框风险。",
    },
    {
      title: "错配比较",
      guideIndex: 1,
      step: "bind" as const,
      repair: "indel" as const,
      goal: "比较 1 个错配如何降低结合稳定性，但不一定完全阻断剪切。",
      check: "先在图中找到红色虚线，再解释为什么判定是谨慎使用。",
    },
    {
      title: "低匹配失败",
      guideIndex: 2,
      step: "repair" as const,
      repair: "failed" as const,
      goal: "判断低匹配 guide 为什么应按未成功编辑处理。",
      check: "报告里应保留不执行剪切、匹配不足和需要换 guide 的建议。",
    },
  ];
  const quizItems = [
    {
      question: "Cas9 在这张图里为什么先看 PAM？",
      options: ["PAM 是 Cas9 继续检查邻近序列的入口", "PAM 会直接变成 guide RNA", "PAM 是最终修复产物"],
      answer: "PAM 是 Cas9 继续检查邻近序列的入口",
      explain: "SpCas9 通常先识别 NGG 这类 PAM，再检查旁边 DNA 是否能和 guide RNA 配对。",
    },
    {
      question: "guide 区域出现红色虚线时，最合理的解释是什么？",
      options: ["该位置存在错配，结合稳定性下降", "DNA 已经被完全删除", "PAM 被复制了一次"],
      answer: "该位置存在错配，结合稳定性下降",
      explain: "虚线标出 guide RNA 和目标 DNA 不互补的位置；错配越多，定位和剪切越不可靠。",
    },
    {
      question: "选择匹配评分很低的向导 RNA 时，页面为什么按未成功编辑处理？",
      options: ["Cas9 很难稳定定位到预期位点", "细胞一定会产生模板替换", "低分 guide 会自动修复 DNA"],
      answer: "Cas9 很难稳定定位到预期位点",
      explain: "低匹配评分表示 guide 与目标关系弱，Cas9 不应直接进入可靠剪切和修复结果讨论。",
    },
  ];
  const activeGuide = guides[guideIndex];
  const activeQuiz = quizItems[quizIndex];
  const activeScenario = activeScenarioIndex === null ? null : practiceScenarios[activeScenarioIndex];
  const guideRange = Array.from({ length: targetLength }).map((_, index) => activeGuide.start + index);
  const guideBases = activeGuide.sequence.split(" ");
  const expectedGuideBases = guideRange.map((index) => rnaComplement[target[index]] ?? "?");
  const computedMismatches = guideBases
    .map((base, index) => (base !== expectedGuideBases[index] ? index : -1))
    .filter((index) => index >= 0);
  const cutIndex = Math.min(target.length - 1, activeGuide.start + 5);
  const pamSequence = target.slice(pamStart).join("");
  const cutDistanceFromPam = pamStart - cutIndex;
  const stepIndex = stages.findIndex((item) => item.key === step);
  const canCut = activeGuide.score >= 60 && stepIndex >= 2;
  const repairActive = step === "repair";
  const repairResults = {
    indel: {
      title: "小片段插入/删除",
      sequence: target.map((base, index) => (index === cutIndex ? "Δ" : base)),
      result: "阅读框可能改变，目标蛋白容易失活。",
      color: "var(--cherry-red)",
    },
    replace: {
      title: "模板引导替换",
      sequence: target.map((base, index) => (index === cutIndex ? "G" : base)),
      result: "如果提供修复模板，细胞可能把指定碱基写入目标位置。",
      color: "var(--cherry-blue)",
    },
    failed: {
      title: "未成功编辑",
      sequence: target,
      result: "细胞完成原样修复，或者 Cas 蛋白没有稳定切开目标位点。",
      color: "var(--cherry-sage)",
    },
  };
  const activeRepair = repairResults[repair];
  const effectiveRepair = activeGuide.score < 60 ? repairResults.failed : activeRepair;
  const guideDecision = activeGuide.score >= 80
    ? {
        level: "推荐继续",
        risk: "定位稳定，适合进入剪切和修复结果讨论。",
        nextAction: "下一步可以比较插入/删除和模板替换两种修复产物。",
        color: "var(--cherry-forest)",
        bg: "var(--cherry-sage-light)",
      }
    : activeGuide.score >= 60
      ? {
          level: "谨慎使用",
          risk: "存在错配或效率下降风险，剪切可能发生但不够理想。",
          nextAction: "先找出错配位置，再比较换用向导 A 后结果如何变化。",
          color: "var(--cherry-yellow)",
          bg: "var(--cherry-yellow-light)",
        }
      : {
          level: "不建议执行",
          risk: "guide 匹配不足或离 PAM 关系不理想，本轮按未成功编辑处理。",
          nextAction: "回到向导 RNA 区域，选择更接近目标互补序列且靠近 PAM 的 guide。",
          color: "var(--cherry-red)",
          bg: "var(--cherry-peach-light)",
        };
  const baseX = (index: number) => 72 + index * 44;
  const casX = canCut ? baseX(cutIndex) : stepIndex >= 1 ? baseX(activeGuide.start + 3) : baseX(pamStart + 1);
  const reportResult = activeGuide.score < 60 ? "guide 匹配不足，Cas9 不稳定定位，本轮按未成功编辑处理。" : activeRepair.result;
  const decisionRows = [
    {
      label: "PAM 入口",
      value: pamSequence === "AGG" ? "通过" : "待确认",
      detail: `目标邻近序列显示 PAM：${pamSequence}。SpCas9 需要先识别 NGG 入口，才继续检查旁边 DNA。`,
    },
    {
      label: "guide 匹配",
      value: activeGuide.score >= 80 ? "高匹配" : activeGuide.score >= 60 ? "有错配" : "低匹配",
      detail: `${activeGuide.name} 匹配评分 ${activeGuide.score}%，错配数 ${computedMismatches.length} 个。错配越多，定位越不稳定。`,
    },
    {
      label: "剪切可信度",
      value: activeGuide.score >= 60 ? "可讨论剪切" : "不进入剪切",
      detail: activeGuide.score >= 60 ? `可讨论第 ${cutIndex + 1} 个碱基附近剪切，位置在 PAM 上游 ${cutDistanceFromPam} nt。` : "guide 匹配不足，本轮不把剪切当作可靠事件。",
    },
    {
      label: "修复边界",
      value: effectiveRepair.title,
      detail: reportResult,
    },
  ];
  const goNoGoCriteria = [
    activeGuide.score >= 80
      ? "继续：可比较插入/删除和模板替换两类产物。"
      : activeGuide.score >= 60
        ? "谨慎：先定位错配，再比较更高匹配 guide。"
        : "停止：先更换 guide，不直接讨论编辑产物。",
    "结论必须同时说明 PAM、guide 匹配、剪切位点和修复边界。",
    "真实研究前仍需脱靶搜索、递送条件、细胞类型和实验验证。",
  ];
  const riskAuditItems = [
    {
      label: "PAM 与邻近序列",
      status: pamSequence === "AGG" ? "入口成立" : "入口待核查",
      detail: `当前 PAM 为 ${pamSequence}，只说明 Cas9 有进入邻近序列检查的条件，不等于一定完成编辑。`,
    },
    {
      label: "guide 错配与脱靶",
      status: computedMismatches.length === 0 ? "本段无错配" : `${computedMismatches.length} 个错配`,
      detail: computedMismatches.length === 0
        ? "当前目标片段内互补关系清楚，但真实判断仍需要全基因组相似位点搜索。"
        : `错配位置：${computedMismatches.map((index) => index + 1).join("、")}。错配会降低目标位点可信度，也提醒你检查相似序列脱靶风险。`,
    },
    {
      label: "剪切可信度",
      status: activeGuide.score >= 60 ? "可进入剪切讨论" : "不进入剪切讨论",
      detail: activeGuide.score >= 60 ? `可讨论 PAM 上游 ${cutDistanceFromPam} nt 附近剪切，但仍要把评分 ${activeGuide.score}% 写进结论。` : "匹配不足时不应继续解释修复产物，应先更换 guide。",
    },
    {
      label: "修复不确定性",
      status: effectiveRepair.title,
      detail: "插入/删除、模板替换和未编辑都是判读结果，不是承诺；真实结果需要测序或其他实验验证。",
    },
  ];
  const crisprCompletionChecks = [
    {
      title: "判定一句话",
      body: `写出本轮总判定：${guideDecision.level}。句子里必须同时出现 PAM、guide 匹配和修复边界。`,
      status: activeGuide.score >= 60 ? "可写判定" : "先换 guide",
    },
    {
      title: "证据四要素",
      body: `PAM=${pamSequence}；匹配评分=${activeGuide.score}%；错配数=${computedMismatches.length}；修复结果=${effectiveRepair.title}。`,
      status: computedMismatches.length === 0 ? "证据清楚" : "保留错配",
    },
    {
      title: "风险边界",
      body: "报告里必须保留脱靶搜索、真实实验验证和修复不确定性，不能把模拟产物写成真实结果。",
      status: "必须保留",
    },
    {
      title: "小测自查",
      body: quizChoice === null ? "完成 1 道即时小测，再复制报告。" : quizChoice === activeQuiz.answer ? "当前小测判断正确，可以继续复制报告。" : "当前小测判断错误，先回到判读顺序复核。",
      status: quizChoice === activeQuiz.answer ? "已通过" : "待完成",
    },
  ];
  const crisprLearnerAnswers = {
    decision: decisionDraft.trim(),
    evidence: evidenceDraft.trim(),
    riskBoundary: riskBoundaryDraft.trim(),
    nextVerification: nextVerificationDraft.trim(),
  };
  const crisprLearnerRecordFields = [
    {
      id: "crispr-decision-draft",
      label: "我的总判定",
      prompt: "写成一句完整结论，必须同时出现判定和至少一个依据。",
      value: decisionDraft,
      setter: setDecisionDraft,
      placeholder: `${guideDecision.level}：因为 PAM=${pamSequence}，${activeGuide.name} 匹配评分 ${activeGuide.score}%，本轮按 ${effectiveRepair.title} 判读。`,
      pass: crisprLearnerAnswers.decision.length >= 18 && /PAM|guide|匹配|修复|风险|剪切/.test(crisprLearnerAnswers.decision),
      passText: "结论需要同时写出判定和依据。",
    },
    {
      id: "crispr-evidence-draft",
      label: "我引用的证据",
      prompt: "至少写出 PAM、匹配评分、错配或修复结果中的两项。",
      value: evidenceDraft,
      setter: setEvidenceDraft,
      placeholder: `PAM=${pamSequence}；匹配评分=${activeGuide.score}%；错配数=${computedMismatches.length}；修复结果=${effectiveRepair.title}。`,
      pass: crisprLearnerAnswers.evidence.length >= 20
        && [pamSequence, `${activeGuide.score}`, `${computedMismatches.length}`, effectiveRepair.title].filter((text) => crisprLearnerAnswers.evidence.includes(text)).length >= 2,
      passText: "证据里至少要落下两个可核查读数。",
    },
    {
      id: "crispr-risk-boundary-draft",
      label: "不能直接推出",
      prompt: "写出这次模拟不能证明的真实研究结论。",
      value: riskBoundaryDraft,
      setter: setRiskBoundaryDraft,
      placeholder: "这不能直接证明真实编辑可靠，还需要脱靶搜索、递送条件和测序验证。",
      pass: crisprLearnerAnswers.riskBoundary.length >= 18 && /不能|不可|需要|脱靶|验证|真实/.test(crisprLearnerAnswers.riskBoundary),
      passText: "边界需要明确写出不能推出什么，或还要验证什么。",
    },
    {
      id: "crispr-next-verification-draft",
      label: "下一步核查",
      prompt: "写出下一步要查、要比较或要重做的动作。",
      value: nextVerificationDraft,
      setter: setNextVerificationDraft,
      placeholder: guideDecision.nextAction,
      pass: crisprLearnerAnswers.nextVerification.length >= 12 && /查|比较|更换|复核|验证|搜索|测序/.test(crisprLearnerAnswers.nextVerification),
      passText: "下一步要写成一个可执行动作。",
    },
  ];
  const crisprLearnerRecordScore = crisprLearnerRecordFields.filter((item) => item.pass).length;
  const crisprFilledLearnerRecord = {
    decision: crisprLearnerAnswers.decision || `${guideDecision.level}：因为 PAM=${pamSequence}，${activeGuide.name} 匹配评分 ${activeGuide.score}%，本轮按 ${effectiveRepair.title} 判读。`,
    evidence: crisprLearnerAnswers.evidence || `PAM=${pamSequence}；匹配评分=${activeGuide.score}%；错配数=${computedMismatches.length}；修复结果=${effectiveRepair.title}。`,
    riskBoundary: crisprLearnerAnswers.riskBoundary || "这不能直接证明真实编辑可靠，还需要脱靶搜索、递送条件和测序验证。",
    nextVerification: crisprLearnerAnswers.nextVerification || guideDecision.nextAction,
  };
  const decisionCardOutput = `【CRISPR 编辑决策卡】
练习场景：${activeScenario ? activeScenario.title : "自定义判读"}
目标：${activeScenario ? activeScenario.goal : "自行组合 guide、流程步骤和修复结果，完成一次编辑判读。"}
总判定：${guideDecision.level}
风险说明：${guideDecision.risk}
下一步：${guideDecision.nextAction}

判定矩阵
${decisionRows.map((item, index) => `${index + 1}. ${item.label}：${item.value}｜${item.detail}`).join("\n")}

Go / No-Go
${goNoGoCriteria.map((item, index) => `${index + 1}. ${item}`).join("\n")}

我的判读记录
完成度：${crisprLearnerRecordScore}/4
1. 我的总判定：${crisprFilledLearnerRecord.decision}
2. 我引用的证据：${crisprFilledLearnerRecord.evidence}
3. 不能直接推出：${crisprFilledLearnerRecord.riskBoundary}
4. 下一步核查：${crisprFilledLearnerRecord.nextVerification}`;
  const riskAuditOutput = `【CRISPR 风险核查记录】
练习场景：${activeScenario ? activeScenario.title : "自定义判读"}
当前 guide：${activeGuide.name}
总判定：${guideDecision.level}

一、风险核查
${riskAuditItems.map((item, index) => `${index + 1}. ${item.label}：${item.status}
${item.detail}`).join("\n\n")}

二、我需要保留的边界
${boundaryItems.map((item, index) => `${index + 1}. ${item}`).join("\n")}

三、下一步
${guideDecision.nextAction}

四、我的判读记录
完成度：${crisprLearnerRecordScore}/4
1. 我的总判定：${crisprFilledLearnerRecord.decision}
2. 我引用的证据：${crisprFilledLearnerRecord.evidence}
3. 不能直接推出：${crisprFilledLearnerRecord.riskBoundary}
4. 下一步核查：${crisprFilledLearnerRecord.nextVerification}`;
  const crisprReport = `【CRISPR 模拟报告】
练习场景：${activeScenario ? activeScenario.title : "自定义判读"}
学习目标：${activeScenario ? activeScenario.goal : "自行组合 guide、流程步骤和修复结果，完成一次编辑判读。"}
检查重点：${activeScenario ? activeScenario.check : "先说明 PAM，再说明 guide 匹配、剪切判断和修复边界。"}

目标 DNA：${target.join(" ")}
PAM：${pamSequence}

0. 编辑判定
${guideDecision.level}
风险说明：${guideDecision.risk}
建议动作：${guideDecision.nextAction}

1. 向导 RNA
名称：${activeGuide.name}
序列：${activeGuide.sequence}
目标互补序列：${expectedGuideBases.join(" ")}
匹配评分：${activeGuide.score}%
错配数：${computedMismatches.length} 个
说明：${activeGuide.note}

2. 当前步骤
${stages[stepIndex].label}：${stages[stepIndex].text}

3. 剪切判断
${activeGuide.score >= 60 ? `可剪切；位点为第 ${cutIndex + 1} 个碱基，PAM 上游 ${cutDistanceFromPam} nt。` : "不执行剪切；guide 匹配不足。"}

4. 修复结果
${effectiveRepair.title}
产物序列：${effectiveRepair.sequence.join(" ")}
结果解释：${reportResult}

5. 编辑决策卡
${decisionRows.map((item, index) => `${index + 1}. ${item.label}：${item.value}｜${item.detail}`).join("\n")}
${goNoGoCriteria.map((item, index) => `Go/No-Go ${index + 1}：${item}`).join("\n")}

6. 风险核查
${riskAuditItems.map((item, index) => `${index + 1}. ${item.label}：${item.status}｜${item.detail}`).join("\n")}

7. 完成验收
${crisprCompletionChecks.map((item, index) => `${index + 1}. ${item.title}：${item.status}｜${item.body}`).join("\n")}

8. 判读顺序
${interpretationSteps.map((item, index) => `${index + 1}. ${item.title}：${item.body}`).join("\n")}

9. 质控检查
${qualityChecks.map((item, index) => `${index + 1}. ${item}`).join("\n")}

10. 边界说明
${boundaryItems.map((item, index) => `${index + 1}. ${item}`).join("\n")}

11. 我的判读记录
完成度：${crisprLearnerRecordScore}/4
我的总判定：${crisprFilledLearnerRecord.decision}
我引用的证据：${crisprFilledLearnerRecord.evidence}
不能直接推出：${crisprFilledLearnerRecord.riskBoundary}
下一步核查：${crisprFilledLearnerRecord.nextVerification}`;

  useEffect(() => {
    setDecisionDraft("");
    setEvidenceDraft("");
    setRiskBoundaryDraft("");
    setNextVerificationDraft("");
  }, [guideIndex, step, repair, activeScenarioIndex]);

  function clearCrisprCopyStatus() {
    setCopiedDecisionCard(false);
    setCopiedReport(false);
    setCopiedRiskAudit(false);
    setReportStatus("");
  }

  function chooseCrisprScenario(index: number) {
    const scenario = practiceScenarios[index];
    setActiveScenarioIndex(index);
    setGuideIndex(scenario.guideIndex);
    setStep(scenario.step);
    setRepair(scenario.repair);
    clearCrisprCopyStatus();
  }

  function chooseCrisprQuiz(index: number) {
    setQuizIndex(index);
    setQuizChoice(null);
    clearCrisprCopyStatus();
  }

  function answerCrisprQuiz(option: string) {
    setQuizChoice(option);
    clearCrisprCopyStatus();
  }

  function chooseCrisprStep(nextStep: typeof step) {
    setActiveScenarioIndex(null);
    setStep(nextStep);
    clearCrisprCopyStatus();
  }

  function chooseCrisprGuide(index: number) {
    setActiveScenarioIndex(null);
    setGuideIndex(index);
    clearCrisprCopyStatus();
  }

  function chooseCrisprRepair(nextRepair: typeof repair) {
    setActiveScenarioIndex(null);
    setRepair(nextRepair);
    setStep("repair");
    clearCrisprCopyStatus();
  }

  async function copyCrisprReport() {
    const copiedToClipboard = await copyText(crisprReport);
    if (copiedToClipboard) {
      setCopiedReport(true);
      setCopiedDecisionCard(false);
      setCopiedRiskAudit(false);
      setReportStatus("模拟报告已复制到剪贴板。");
      window.setTimeout(() => setCopiedReport(false), 1400);
      return;
    }

    setCopiedReport(false);
    setReportStatus("复制失败，请手动选中文本复制。");
  }

  async function copyDecisionCard() {
    const copiedToClipboard = await copyText(decisionCardOutput);
    if (copiedToClipboard) {
      setCopiedDecisionCard(true);
      setCopiedReport(false);
      setCopiedRiskAudit(false);
      setReportStatus("编辑决策卡已复制到剪贴板。");
      window.setTimeout(() => setCopiedDecisionCard(false), 1400);
      return;
    }

    setCopiedDecisionCard(false);
    setReportStatus("复制失败，请手动选中文本复制。");
  }

  async function copyRiskAudit() {
    const copiedToClipboard = await copyText(riskAuditOutput);
    if (copiedToClipboard) {
      setCopiedRiskAudit(true);
      setCopiedDecisionCard(false);
      setCopiedReport(false);
      setReportStatus("风险核查记录已复制到剪贴板。");
      window.setTimeout(() => setCopiedRiskAudit(false), 1400);
      return;
    }

    setCopiedRiskAudit(false);
    setReportStatus("复制失败，请手动选中文本复制。");
  }

  return (
    <section id="crispr-simulator" style={{ display: "grid", gap: "1rem" }}>
      <div className="crispr-intro-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.15fr) minmax(260px, 0.85fr)", gap: "1rem" }}>
        <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.72rem" }}>判读顺序</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.65rem" }}>
            {interpretationSteps.map((item, index) => (
              <div key={item.title} style={{ background: index === stepIndex ? "var(--cherry-yellow-light)" : "var(--muted)", border: index === stepIndex ? "1.5px solid var(--cherry-yellow)" : "1.5px solid rgba(94,68,42,0.1)", borderRadius: 16, padding: "0.72rem", minHeight: 118 }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--cherry-forest)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 900, marginBottom: "0.45rem" }}>{index + 1}</span>
                <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.8rem", marginBottom: "0.26rem" }}>{item.title}</strong>
                <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.5, fontWeight: 800 }}>{item.body}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "var(--cherry-peach-light)", border: "1.5px solid rgba(214,91,74,0.2)", borderRadius: 22, padding: "1.1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.06)" }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.72rem" }}>实验边界</div>
          <div style={{ display: "grid", gap: "0.52rem" }}>
            {boundaryItems.map((item, index) => (
              <div key={item} style={{ display: "grid", gridTemplateColumns: "22px minmax(0, 1fr)", gap: "0.46rem", alignItems: "start", color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.55, fontWeight: 800 }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--cherry-red)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 900 }}>{index + 1}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)", display: "grid", gap: "0.72rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.24rem" }}>练习场景</div>
            <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.5, fontWeight: 800 }}>
              先选一个判读任务，页面会自动切到对应 guide、步骤和修复结果。
            </div>
          </div>
          <span style={{ color: "var(--cherry-forest)", fontSize: "0.74rem", fontWeight: 900 }}>
            {activeScenario ? `当前：${activeScenario.title}` : "当前：自定义判读"}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.62rem" }}>
          {practiceScenarios.map((scenario, index) => {
            const active = activeScenarioIndex === index;
            return (
              <button key={scenario.title} type="button" aria-pressed={active} onClick={() => chooseCrisprScenario(index)} style={{ textAlign: "left", background: active ? "var(--cherry-sage-light)" : "var(--muted)", border: active ? "1.5px solid var(--cherry-forest)" : "1.5px solid var(--border)", borderRadius: 16, padding: "0.72rem", cursor: "pointer", display: "grid", gap: "0.36rem" }}>
                <strong style={{ color: active ? "var(--cherry-forest)" : "var(--cherry-warm-brown)", fontSize: "0.8rem" }}>{scenario.title}</strong>
                <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.5, fontWeight: 800 }}>{scenario.goal}</span>
                <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.7rem", lineHeight: 1.48, fontWeight: 900 }}>{scenario.check}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 22, padding: "1.1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.06)", display: "grid", gap: "0.82rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.24rem" }}>完成验收卡</div>
            <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.5, fontWeight: 800 }}>
              复制报告前，先确认本轮判定、证据、风险边界和小测状态都能说清楚。
            </div>
          </div>
          <span style={{ background: quizChoice === activeQuiz.answer ? "var(--cherry-sage-light)" : "var(--card)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 999, padding: "0.26rem 0.62rem", color: quizChoice === activeQuiz.answer ? "var(--cherry-forest)" : "var(--cherry-red)", fontSize: "0.72rem", fontWeight: 900 }}>
            {quizChoice === activeQuiz.answer ? "小测已通过" : "小测待完成"}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.62rem" }}>
          {crisprCompletionChecks.map((item, index) => (
            <div key={item.title} style={{ background: "rgba(250,247,241,0.72)", border: "1px solid rgba(94,68,42,0.12)", borderRadius: 16, padding: "0.72rem", minHeight: 132, display: "grid", gap: "0.42rem", alignContent: "start" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.55rem", alignItems: "start" }}>
                <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.8rem" }}>{item.title}</strong>
                <span style={{ color: index === 2 ? "var(--cherry-red)" : "var(--cherry-forest)", fontSize: "0.68rem", fontWeight: 900, whiteSpace: "nowrap" }}>{item.status}</span>
              </div>
              <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.58, fontWeight: 800 }}>{item.body}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="crispr-main-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.45fr) minmax(286px, 0.72fr)", gap: "1rem", alignItems: "stretch" }}>
        <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, overflow: "hidden", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
          <svg viewBox="0 0 760 430" role="img" aria-label="CRISPR Cas9 识别、剪切和修复示意图" style={{ width: "100%", display: "block", background: "linear-gradient(180deg, #FFF8EA 0%, #F2E9DB 100%)" }}>
            <rect x={24} y={26} width={708} height={382} rx={90} fill="rgba(169,201,172,0.18)" stroke="rgba(93,140,101,0.28)" strokeWidth={2.5} strokeDasharray="8 8" />
            <text x={42} y={60} fill="var(--cherry-forest)" fontSize={18} fontWeight={900}>
              Cas9 编辑实验台
            </text>
            <g transform="translate(42 74)">
              <rect width={148} height={26} rx={999} fill="rgba(250,247,241,0.78)" stroke="rgba(94,68,42,0.14)" strokeWidth={1.4} />
              <text x={74} y={18} textAnchor="middle" fill="var(--cherry-warm-mid)" fontSize={11} fontWeight={900}>
                SpCas9 / NGG PAM
              </text>
            </g>
            <line x1={60} y1={166} x2={704} y2={166} stroke="url(#crisprStrandA)" strokeWidth={10} strokeLinecap="round" />
            <line x1={60} y1={206} x2={704} y2={206} stroke="url(#crisprStrandB)" strokeWidth={10} strokeLinecap="round" opacity={0.82} />
            <defs>
              <linearGradient id="crisprStrandA" x1="0" x2="1">
                <stop offset="0%" stopColor="var(--cherry-blue)" />
                <stop offset="46%" stopColor="var(--cherry-sage)" />
                <stop offset="100%" stopColor="var(--cherry-red)" />
              </linearGradient>
              <linearGradient id="crisprStrandB" x1="0" x2="1">
                <stop offset="0%" stopColor="var(--cherry-red)" />
                <stop offset="46%" stopColor="var(--cherry-yellow)" />
                <stop offset="100%" stopColor="var(--cherry-blue)" />
              </linearGradient>
            </defs>

            {target.map((base, index) => {
              const inGuide = guideRange.includes(index);
              const inPam = index >= pamStart;
              const mismatch = computedMismatches.includes(index - activeGuide.start);
              return (
                <g key={`${base}-${index}`} transform={`translate(${baseX(index)} 0)`}>
                  <rect x={-15} y={126} width={30} height={30} rx={9} fill={inPam ? "var(--cherry-peach-light)" : inGuide ? "var(--cherry-yellow-light)" : "rgba(250,247,241,0.8)"} stroke={mismatch ? "var(--cherry-red)" : "rgba(94,68,42,0.16)"} strokeWidth={mismatch ? 2.3 : 1.4} />
                  <text x={0} y={146} textAnchor="middle" fill="var(--cherry-warm-brown)" fontSize={13} fontWeight={900}>{base}</text>
                  <line x1={0} y1={160} x2={0} y2={211} stroke="rgba(94,68,42,0.2)" strokeWidth={1.4} />
                </g>
              );
            })}

            <rect x={baseX(pamStart) - 20} y={222} width={122} height={28} rx={999} fill="var(--cherry-peach-light)" stroke="var(--cherry-red)" strokeWidth={1.8} opacity={stepIndex >= 0 ? 1 : 0.4} />
            <text x={baseX(pamStart) + 41} y={241} textAnchor="middle" fill="var(--cherry-warm-brown)" fontSize={12} fontWeight={900}>
              PAM: AGG
            </text>

            <g transform={`translate(${casX} 106)`} style={{ transition: "transform 0.28s ease" }}>
              <path d="M-56 8 C-60 -28 -20 -44 18 -36 C54 -28 66 8 42 34 C20 58 -44 48 -56 8Z" fill={canCut ? "var(--cherry-peach-light)" : "var(--cherry-blue-light)"} stroke={canCut ? "var(--cherry-red)" : "var(--cherry-blue)"} strokeWidth={3} />
              <text x={0} y={10} textAnchor="middle" fill="var(--cherry-warm-brown)" fontSize={15} fontWeight={900}>Cas9</text>
            </g>

            <g opacity={stepIndex >= 1 ? 1 : 0.22}>
              <path d={`M${baseX(activeGuide.start)} 94 C${baseX(activeGuide.start + 2)} 76 ${baseX(activeGuide.start + 5)} 78 ${baseX(activeGuide.start + 7)} 94`} fill="none" stroke="var(--cherry-red)" strokeWidth={7} strokeLinecap="round" />
              {guideBases.map((_, index) => {
                const mismatch = computedMismatches.includes(index);
                const x = baseX(activeGuide.start + index);
                return (
                  <line
                    key={`pairing-${index}`}
                    x1={x}
                    y1={86}
                    x2={x}
                    y2={126}
                    stroke={mismatch ? "var(--cherry-red)" : "var(--cherry-forest)"}
                    strokeWidth={mismatch ? 2.4 : 3.2}
                    strokeLinecap="round"
                    strokeDasharray={mismatch ? "4 5" : undefined}
                    opacity={mismatch ? 0.9 : 0.62}
                  />
                );
              })}
              {guideBases.map((base, index) => (
                <g key={`${base}-${index}`} transform={`translate(${baseX(activeGuide.start + index)} 70)`}>
                  <circle r={14} fill={computedMismatches.includes(index) ? "var(--cherry-peach-light)" : "var(--cherry-red)"} stroke="rgba(94,68,42,0.14)" strokeWidth={1.4} />
                  <text y={4} textAnchor="middle" fill={computedMismatches.includes(index) ? "var(--cherry-warm-brown)" : "#FAF7F1"} fontSize={11} fontWeight={900}>{base}</text>
                </g>
              ))}
            </g>

            {canCut ? (
              <g transform={`translate(${baseX(cutIndex)} 184)`}>
                <path d="M-22 -28 L22 28 M22 -28 L-22 28" stroke="var(--cherry-red)" strokeWidth={4} strokeLinecap="round" />
                <circle r={30} fill="none" stroke="var(--cherry-red)" strokeWidth={2} strokeDasharray="5 5" />
                <text x={0} y={52} textAnchor="middle" fill="var(--cherry-red)" fontSize={12} fontWeight={900}>剪切</text>
                <text x={0} y={68} textAnchor="middle" fill="var(--cherry-warm-mid)" fontSize={10} fontWeight={800}>PAM 上游 {cutDistanceFromPam} nt</text>
              </g>
            ) : null}

            <g transform="translate(72 310)" opacity={repairActive ? 1 : 0.35}>
              <text x={0} y={-18} fill="var(--cherry-warm-brown)" fontSize={14} fontWeight={900}>修复产物</text>
              {effectiveRepair.sequence.map((base, index) => (
                <g key={`${base}-${index}`} transform={`translate(${index * 38} 0)`}>
                  <rect x={-14} y={-14} width={28} height={28} rx={8} fill={index === cutIndex ? "var(--cherry-yellow-light)" : "rgba(250,247,241,0.86)"} stroke={index === cutIndex ? effectiveRepair.color : "rgba(94,68,42,0.14)"} strokeWidth={index === cutIndex ? 2.4 : 1.4} />
                  <text y={5} textAnchor="middle" fill="var(--cherry-warm-brown)" fontSize={12} fontWeight={900}>{base}</text>
                </g>
              ))}
            </g>
          </svg>
        </div>

        <aside style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.75rem" }}>流程控制</div>
            <div style={{ display: "grid", gap: 7 }}>
              {stages.map((item, index) => (
                <button key={item.key} type="button" aria-pressed={step === item.key} onClick={() => chooseCrisprStep(item.key)} style={{ display: "grid", gridTemplateColumns: "26px 1fr", gap: 8, alignItems: "start", textAlign: "left", background: step === item.key ? "var(--cherry-sage-light)" : "var(--muted)", border: step === item.key ? "1.5px solid var(--cherry-forest)" : "1.5px solid var(--border)", borderRadius: 14, padding: "0.62rem", cursor: "pointer" }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: stepIndex >= index ? "var(--cherry-forest)" : "rgba(250,247,241,0.9)", color: stepIndex >= index ? "#FAF7F1" : "var(--cherry-warm-mid)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 900 }}>{index + 1}</span>
                  <span>
                    <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.82rem" }}>{item.label}</strong>
                    <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.55 }}>{item.text}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.75rem" }}>向导 RNA</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: "0.75rem" }}>
              {guides.map((guide, index) => (
                <button key={guide.name} type="button" aria-pressed={guideIndex === index} onClick={() => chooseCrisprGuide(index)} style={{ background: guideIndex === index ? "var(--cherry-forest)" : "var(--muted)", color: guideIndex === index ? "#FAF7F1" : "var(--cherry-warm-brown)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.4rem 0.74rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                  {guide.name}
                </button>
              ))}
            </div>
            <code style={{ display: "block", background: "var(--cherry-yellow-light)", borderRadius: 12, padding: "0.65rem", color: "var(--cherry-warm-brown)", fontSize: "0.78rem", fontWeight: 900, whiteSpace: "pre-wrap", marginBottom: "0.7rem" }}>{activeGuide.sequence}</code>
            <div style={{ height: 10, borderRadius: 999, background: "var(--muted)", overflow: "hidden", marginBottom: "0.55rem" }}>
              <div style={{ width: `${activeGuide.score}%`, height: "100%", background: activeGuide.score > 80 ? "var(--cherry-sage)" : activeGuide.score > 50 ? "var(--cherry-yellow)" : "var(--cherry-red)", transition: "width 0.25s ease" }} />
            </div>
            <div style={{ color: "var(--cherry-red)", fontSize: "1.35rem", fontWeight: 900, marginBottom: "0.45rem" }}>{activeGuide.score}%</div>
            <div role="status" aria-live="polite" style={{ background: guideDecision.bg, border: `1.5px solid ${guideDecision.color}`, borderRadius: 14, padding: "0.68rem", color: "var(--cherry-warm-mid)", lineHeight: 1.58, fontSize: "0.8rem", fontWeight: 800, marginBottom: "0.75rem" }}>
              <strong style={{ display: "block", color: guideDecision.color, marginBottom: "0.28rem" }}>{guideDecision.level}</strong>
              {guideDecision.risk}
              <div style={{ marginTop: "0.42rem", color: "var(--cherry-warm-brown)" }}>{guideDecision.nextAction}</div>
            </div>
            <div style={{ background: "rgba(250,247,241,0.74)", border: "1.5px solid rgba(94,68,42,0.1)", borderRadius: 12, padding: "0.6rem", color: "var(--cherry-warm-mid)", fontSize: "0.76rem", fontWeight: 800, marginBottom: "0.75rem" }}>
              目标互补序列：<strong style={{ color: "var(--cherry-warm-brown)" }}>{expectedGuideBases.join(" ")}</strong>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: "0.45rem", color: "var(--cherry-warm-mid)", fontSize: "0.7rem" }}>
                <span><strong style={{ color: "var(--cherry-forest)" }}>实线</strong> 互补</span>
                <span><strong style={{ color: "var(--cherry-red)" }}>虚线</strong> 错配</span>
              </div>
            </div>
            <div style={{ display: "grid", gap: 6, marginBottom: "0.75rem" }}>
              {[
                ["PAM", pamSequence],
                ["剪切位点", activeGuide.score >= 60 ? `第 ${cutIndex + 1} 个碱基，PAM 上游 ${cutDistanceFromPam} nt` : "匹配不足，不执行剪切"],
                ["错配数", `${computedMismatches.length} 个`],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 10, color: "var(--cherry-warm-mid)", fontSize: "0.78rem", fontWeight: 800 }}>
                  <span>{label}</span>
                  <span style={{ color: "var(--cherry-warm-brown)", textAlign: "right", fontWeight: 900 }}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.82rem" }}>{activeGuide.note}</div>
          </div>
        </aside>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)", display: "grid", gap: "0.9rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.24rem" }}>编辑决策卡</div>
            <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.5, fontWeight: 800 }}>
              把当前选择压缩成一次可保存的 go/no-go 判定。
            </div>
          </div>
          <button type="button" onClick={copyDecisionCard} aria-describedby="crispr-report-status" style={{ background: "var(--cherry-red)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.46rem 0.82rem", fontWeight: 900, cursor: "pointer", fontSize: "0.8rem" }}>
            {copiedDecisionCard ? "已复制" : "复制决策卡"}
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.62rem" }}>
          {decisionRows.map((item, index) => (
            <div key={item.label} style={{ background: index === 0 ? "var(--cherry-sage-light)" : "var(--muted)", border: index === 0 ? "1.5px solid var(--cherry-forest)" : "1.5px solid rgba(94,68,42,0.1)", borderRadius: 16, padding: "0.72rem", minHeight: 126 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.55rem", alignItems: "start", marginBottom: "0.42rem" }}>
                <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.8rem" }}>{item.label}</strong>
                <span style={{ color: index === 0 ? "var(--cherry-forest)" : guideDecision.color, fontSize: "0.72rem", fontWeight: 900, whiteSpace: "nowrap" }}>{item.value}</span>
              </div>
              <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.6, fontWeight: 800 }}>{item.detail}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 16, padding: "0.82rem", display: "grid", gap: "0.48rem" }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.82rem" }}>下一步判定</div>
          {goNoGoCriteria.map((item, index) => (
            <div key={item} style={{ display: "grid", gridTemplateColumns: "24px minmax(0, 1fr)", gap: "0.5rem", alignItems: "start", color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.55, fontWeight: 800 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: index === 0 ? guideDecision.color : "var(--cherry-warm-brown)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 900 }}>{index + 1}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)", display: "grid", gap: "0.9rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.24rem" }}>风险核查记录</div>
            <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.5, fontWeight: 800 }}>
              把 PAM、错配、剪切和修复边界逐项拆开，避免把“能切”直接写成“编辑可靠”。
            </div>
          </div>
          <button type="button" onClick={copyRiskAudit} aria-describedby="crispr-report-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.46rem 0.82rem", fontWeight: 900, cursor: "pointer", fontSize: "0.8rem" }}>
            {copiedRiskAudit ? "已复制" : "复制风险核查"}
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.62rem" }}>
          {riskAuditItems.map((item, index) => (
            <div key={item.label} style={{ background: index === 1 ? "var(--cherry-peach-light)" : "var(--muted)", border: index === 1 ? "1.5px solid rgba(214,91,74,0.26)" : "1.5px solid rgba(94,68,42,0.1)", borderRadius: 16, padding: "0.72rem", display: "grid", gap: "0.42rem", minHeight: 132 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.55rem", flexWrap: "wrap" }}>
                <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.8rem" }}>{item.label}</strong>
                <span style={{ color: index === 1 ? "var(--cherry-red)" : "var(--cherry-forest)", fontSize: "0.7rem", fontWeight: 900 }}>{item.status}</span>
              </div>
              <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.58, fontWeight: 800 }}>{item.detail}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--cherry-sage-light)", border: "1.5px solid rgba(93,140,101,0.28)", borderRadius: 22, padding: "1.1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)", display: "grid", gap: "0.9rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.24rem" }}>我的判读记录</div>
            <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.5, fontWeight: 800 }}>
              先操作模型，再把自己的结论、证据、边界和下一步核查写下来；复制报告时会一起带走。
            </div>
          </div>
          <span role="status" aria-live="polite" style={{ background: crisprLearnerRecordScore === 4 ? "var(--cherry-forest)" : "var(--card)", border: "1.5px solid rgba(94,68,42,0.14)", borderRadius: 999, padding: "0.3rem 0.72rem", color: crisprLearnerRecordScore === 4 ? "#FAF7F1" : "var(--cherry-warm-brown)", fontSize: "0.74rem", fontWeight: 900 }}>
            填写完成度 {crisprLearnerRecordScore}/4
          </span>
        </div>
        <div className="crispr-learner-record-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "0.72rem" }}>
          {crisprLearnerRecordFields.map((field) => (
            <label key={field.id} htmlFor={field.id} style={{ background: "rgba(250,247,241,0.78)", border: `1.5px solid ${field.pass ? "rgba(93,140,101,0.34)" : "rgba(94,68,42,0.12)"}`, borderRadius: 16, padding: "0.78rem", display: "grid", gap: "0.48rem", alignContent: "start", minHeight: 230 }}>
              <span style={{ display: "flex", justifyContent: "space-between", gap: "0.58rem", alignItems: "start" }}>
                <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.82rem" }}>{field.label}</strong>
                <span style={{ color: field.pass ? "var(--cherry-forest)" : "var(--cherry-red)", fontSize: "0.68rem", fontWeight: 900, whiteSpace: "nowrap" }}>
                  {field.pass ? "已成句" : "待补全"}
                </span>
              </span>
              <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.5, fontWeight: 800 }}>{field.prompt}</span>
              <textarea
                id={field.id}
                value={field.value}
                onChange={(event) => {
                  field.setter(event.currentTarget.value);
                  clearCrisprCopyStatus();
                }}
                rows={5}
                placeholder={field.placeholder}
                style={{ width: "100%", minHeight: 106, resize: "vertical", border: "1.5px solid rgba(94,68,42,0.16)", borderRadius: 12, padding: "0.62rem", background: "#FAF7F1", color: "var(--cherry-warm-brown)", fontFamily: "inherit", fontSize: "0.8rem", fontWeight: 800, lineHeight: 1.55 }}
              />
              <span style={{ color: field.pass ? "var(--cherry-forest)" : "var(--cherry-warm-mid)", fontSize: "0.7rem", lineHeight: 1.45, fontWeight: 900 }}>
                {field.pass ? "会写入复制内容。" : field.passText}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.85rem" }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900 }}>修复结果</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {([
              ["indel", "插入/删除"],
              ["replace", "模板替换"],
              ["failed", "未成功编辑"],
            ] as const).map(([key, label]) => (
              <button key={key} type="button" aria-pressed={repair === key} onClick={() => chooseCrisprRepair(key)} style={{ background: repair === key ? "var(--cherry-forest)" : "var(--muted)", color: repair === key ? "#FAF7F1" : "var(--cherry-warm-brown)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.42rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.8rem" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div role="status" aria-live="polite" style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.7, fontSize: "0.9rem" }}>
          <strong style={{ color: effectiveRepair.color }}>{effectiveRepair.title}：</strong>
          {reportResult}
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
        <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.75rem" }}>质控检查</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.6rem" }}>
          {qualityChecks.map((item, index) => (
            <div key={item} style={{ display: "grid", gridTemplateColumns: "22px minmax(0, 1fr)", gap: "0.46rem", alignItems: "start", background: "var(--muted)", border: "1.5px solid rgba(94,68,42,0.1)", borderRadius: 14, padding: "0.62rem", color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.52, fontWeight: 800 }}>
              <span style={{ color: "var(--cherry-forest)", fontWeight: 900 }}>{index + 1}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="crispr-quiz-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.72fr) minmax(0, 1fr)", gap: "1rem", alignItems: "stretch" }}>
        <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.75rem" }}>判读练习</div>
          <div style={{ display: "grid", gap: 7 }}>
            {quizItems.map((item, index) => (
              <button key={item.question} type="button" aria-pressed={quizIndex === index} onClick={() => chooseCrisprQuiz(index)} style={{ display: "grid", gridTemplateColumns: "26px 1fr", gap: 8, alignItems: "center", textAlign: "left", background: quizIndex === index ? "var(--cherry-yellow-light)" : "var(--muted)", border: quizIndex === index ? "1.5px solid var(--cherry-yellow)" : "1.5px solid var(--border)", borderRadius: 14, padding: "0.62rem", cursor: "pointer" }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: quizIndex === index ? "var(--cherry-yellow)" : "rgba(250,247,241,0.9)", color: "var(--cherry-warm-brown)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 900 }}>{index + 1}</span>
                <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.8rem", fontWeight: 900, lineHeight: 1.42 }}>{item.question}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 22, padding: "1.1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)", display: "grid", gap: "0.75rem", alignContent: "start" }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, lineHeight: 1.45 }}>{activeQuiz.question}</div>
          <div style={{ display: "grid", gap: 7 }}>
            {activeQuiz.options.map((option) => {
              const selected = quizChoice === option;
              const answered = quizChoice !== null;
              const correct = option === activeQuiz.answer;
              return (
                <button key={option} type="button" aria-pressed={selected} onClick={() => answerCrisprQuiz(option)} style={{ textAlign: "left", background: selected ? (correct ? "var(--cherry-sage-light)" : "var(--cherry-peach-light)") : "rgba(250,247,241,0.76)", border: selected ? `1.5px solid ${correct ? "var(--cherry-forest)" : "var(--cherry-red)"}` : "1.5px solid rgba(94,68,42,0.12)", borderRadius: 14, padding: "0.68rem 0.75rem", color: "var(--cherry-warm-brown)", fontWeight: 900, cursor: "pointer", lineHeight: 1.45 }}>
                  {option}
                  {answered && correct ? <span style={{ color: "var(--cherry-forest)", marginLeft: 8 }}>✓</span> : null}
                </button>
              );
            })}
          </div>
          <div role="status" aria-live="polite" style={{ minHeight: "3.4rem", background: quizChoice ? "rgba(250,247,241,0.72)" : "rgba(250,247,241,0.42)", border: "1.5px solid rgba(94,68,42,0.1)", borderRadius: 14, padding: "0.72rem", color: "var(--cherry-warm-mid)", fontSize: "0.84rem", lineHeight: 1.65 }}>
            {quizChoice ? (
              <>
                <strong style={{ color: quizChoice === activeQuiz.answer ? "var(--cherry-forest)" : "var(--cherry-red)" }}>
                  {quizChoice === activeQuiz.answer ? "判断正确：" : "再看一眼："}
                </strong>
                {activeQuiz.explain}
              </>
            ) : "选择一个答案后，这里会给出判读理由。"}
          </div>
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900 }}>模拟报告</div>
          <button type="button" onClick={copyCrisprReport} aria-describedby="crispr-report-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.46rem 0.82rem", fontWeight: 900, cursor: "pointer", fontSize: "0.8rem" }}>
            {copiedReport ? "已复制" : "复制报告"}
          </button>
        </div>
        <div id="crispr-report-status" role="status" aria-live="polite" style={{ minHeight: "1.05rem", color: "var(--cherry-forest)", fontSize: "0.76rem", fontWeight: 900, marginBottom: "0.55rem" }}>
          {reportStatus}
        </div>
        <code style={{ display: "block", whiteSpace: "pre-wrap", background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 16, padding: "0.9rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.78rem", lineHeight: 1.65 }}>
          {crisprReport}
        </code>
      </div>

      <style>
        {`
          #crispr-simulator button:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          #crispr-simulator textarea:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 3px;
          }

          #crispr-simulator button {
            transition: transform 0.18s ease, box-shadow 0.18s ease;
          }

          #crispr-simulator button:hover,
          #crispr-simulator button:focus-visible {
            transform: translateY(-2px);
          }

          @media (max-width: 880px) {
            #crispr-simulator .crispr-intro-grid,
            #crispr-simulator .crispr-main-grid {
              grid-template-columns: 1fr !important;
            }

            #crispr-simulator .crispr-quiz-grid {
              grid-template-columns: 1fr !important;
            }

            #crispr-simulator .crispr-learner-record-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            #crispr-simulator button {
              transition: none !important;
              transform: none !important;
            }
          }
        `}
      </style>
    </section>
  );
}

function RichWorkContent({ slug }: { slug: string }) {
  if (slug === "research-prompt-kit") return <PromptKitContent />;
  if (slug === "plant-evolution-stories") return <PlantEvolutionContent />;
  if (slug === "concept-explainer") return <ConceptExplainerContent />;
  if (slug === "crispr-interactive") return <CrisprContent />;
  return null;
}

const richWorkSlugs = ["research-prompt-kit", "plant-evolution-stories", "concept-explainer", "crispr-interactive"];

function hasRichWorkContent(slug: string) {
  return richWorkSlugs.includes(slug);
}

function WorkHero({ work, compact = false }: { work: Work; compact?: boolean }) {
  return (
    <section
      style={{
        padding: compact ? "0.48rem 1.5rem" : "1.15rem 1.5rem 0.75rem",
        background: "var(--background)",
        fontFamily: "'Nunito', sans-serif",
        borderBottom: "1px solid rgba(94,68,42,0.1)",
      }}
    >
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        {!compact ? (
          <a
            className="work-detail-back-link"
            href="/#works"
            onClick={(event) => {
              if (!shouldUseClientNavigation(event)) return;
              event.preventDefault();
              navigateHome("#works");
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "var(--cherry-forest)",
              textDecoration: "none",
              fontWeight: 900,
              fontSize: "0.86rem",
              marginBottom: "0.65rem",
            }}
          >
            ← 回到学习模块
          </a>
        ) : null}

        <div
          className="work-detail-hero-row"
          style={{
            display: "grid",
            gridTemplateColumns: compact ? "auto auto minmax(0, 1fr)" : "auto minmax(0, 1fr)",
            alignItems: "center",
            gap: compact ? "0.58rem" : "0.75rem",
          }}
        >
          {compact ? (
            <a
              className="work-detail-back-link"
              href="/#works"
              onClick={(event) => {
                if (!shouldUseClientNavigation(event)) return;
                event.preventDefault();
                navigateHome("#works");
              }}
              aria-label="回到学习模块"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                color: "var(--cherry-forest)",
                background: "var(--card)",
                border: "1.5px solid var(--border)",
                borderRadius: 999,
                textDecoration: "none",
                fontWeight: 900,
                fontSize: "1rem",
              }}
            >
              ←
            </a>
          ) : null}
          <div
            style={{
              width: compact ? 34 : 50,
              height: compact ? 34 : 50,
              borderRadius: compact ? 11 : 16,
              background: work.color,
              border: `1.5px solid ${work.border}`,
              display: "grid",
              placeItems: "center",
              boxShadow: "3px 5px 0px rgba(94,68,42,0.08)",
            }}
          >
            <div style={{ transform: "scale(0.72)" }}>{work.icon}</div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: compact ? 8 : 10, flexWrap: "wrap", marginBottom: compact ? 0 : "0.2rem" }}>
              <h1
                style={{
                  color: "var(--cherry-warm-brown)",
                  fontSize: compact ? "clamp(1rem, 2.2vw, 1.22rem)" : "clamp(1.35rem, 3vw, 1.85rem)",
                  fontWeight: 900,
                  lineHeight: 1.18,
                  margin: 0,
                }}
              >
                {work.title}
              </h1>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                <span
                  style={{
                    background: work.color,
                    color: "var(--cherry-forest)",
                    border: `1px solid ${work.border}`,
                    borderRadius: 999,
                    padding: compact ? "0.11rem 0.48rem" : "0.16rem 0.55rem",
                    fontSize: compact ? "0.66rem" : "0.7rem",
                    fontWeight: 900,
                  }}
                >
                  {work.category}
                </span>
                {work.tags.slice(0, compact ? 2 : work.tags.length).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "rgba(250,247,241,0.78)",
                      color: "var(--cherry-warm-mid)",
                      border: "1px solid rgba(94,68,42,0.1)",
                      borderRadius: 999,
                      padding: compact ? "0.11rem 0.48rem" : "0.16rem 0.55rem",
                      fontSize: compact ? "0.66rem" : "0.7rem",
                      fontWeight: 900,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {compact ? null : (
              <p style={{ color: "var(--cherry-warm-mid)", fontSize: "0.85rem", lineHeight: 1.5, maxWidth: 780, margin: 0 }}>
                {work.desc}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkQuickStart({ work }: { work: Work }) {
  const [copiedEvidence, setCopiedEvidence] = useState(false);
  const [evidenceCopyStatus, setEvidenceCopyStatus] = useState("");
  const [savedOutput, setSavedOutput] = useState("");
  const [observedChange, setObservedChange] = useState("");
  const [completionProof, setCompletionProof] = useState("");
  const [nextQuestion, setNextQuestion] = useState("");

  useEffect(() => {
    setCopiedEvidence(false);
    setEvidenceCopyStatus("");
    setSavedOutput("");
    setObservedChange("");
    setCompletionProof("");
    setNextQuestion("");
  }, [work.slug]);

  const evidenceItems = [
    `保存 1 份${work.outputs[0] ?? "学习产出"}`,
    `用自己的话写下：${work.success}`,
    `标记下一步要回看的环节：${work.path[work.path.length - 1] ?? work.path[0]}`,
  ];
  const reflectionChecks = [
    `我已经完成路径 1：${work.path[0] ?? "进入模块"}`,
    `我已经保存至少 1 项产出：${work.outputs.join(" / ")}`,
    `我能用自己的话说明完成标准：${work.success}`,
    "我写下了一个还没有弄清楚的问题，方便下次继续查。",
  ];
  const evidenceFieldItems = [
    {
      id: "work-saved-output",
      label: "我保存了什么",
      value: savedOutput,
      setter: setSavedOutput,
      placeholder: work.outputs.join(" / "),
      fallback: work.outputs[0] ?? "学习产出",
    },
    {
      id: "work-observed-change",
      label: "我观察到什么变化",
      value: observedChange,
      setter: setObservedChange,
      placeholder: work.starter,
      fallback: work.starter,
    },
    {
      id: "work-completion-proof",
      label: "我如何证明完成",
      value: completionProof,
      setter: setCompletionProof,
      placeholder: work.success,
      fallback: work.success,
    },
    {
      id: "work-next-question",
      label: "下一步问题",
      value: nextQuestion,
      setter: setNextQuestion,
      placeholder: `回看：${work.path[work.path.length - 1] ?? work.path[0]}`,
      fallback: `回看：${work.path[work.path.length - 1] ?? work.path[0]}`,
    },
  ];
  const filledEvidence = {
    savedOutput: savedOutput.trim() || evidenceFieldItems[0].fallback,
    observedChange: observedChange.trim() || evidenceFieldItems[1].fallback,
    completionProof: completionProof.trim() || evidenceFieldItems[2].fallback,
    nextQuestion: nextQuestion.trim() || evidenceFieldItems[3].fallback,
  };
  const evidenceTemplate = `【${work.title}复盘证据】
立即任务：${work.task}
先做这个：${work.starter}
完成标准：${work.success}

一、我保存的产出
${work.outputs.map((output, index) => `${index + 1}. ${output}：`).join("\n")}

二、我完成的路径
${work.path.map((step, index) => `${index + 1}. ${step}：`).join("\n")}

三、我的填写记录
1. 我保存了什么：${filledEvidence.savedOutput}
2. 我观察到什么变化：${filledEvidence.observedChange}
3. 我如何证明完成：${filledEvidence.completionProof}
4. 下一步问题：${filledEvidence.nextQuestion}

四、我的解释
我能说明：

五、复盘检查
${reflectionChecks.map((item, index) => `${index + 1}. ${item}：□ / 证据：`).join("\n")}

六、下一步问题
我还没有弄清楚：
我需要回看的资料或页面：`;

  async function copyEvidenceTemplate() {
    const copiedToClipboard = await copyText(evidenceTemplate);

    if (copiedToClipboard) {
      setCopiedEvidence(true);
      setEvidenceCopyStatus("复盘模板已复制到剪贴板。");
      window.setTimeout(() => setCopiedEvidence(false), 1400);
      return;
    }

    setCopiedEvidence(false);
    setEvidenceCopyStatus("复制失败，请手动选中文本复制。");
  }

  function focusPrimaryTool() {
    const target = document.getElementById("work-primary-tool");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    target?.focus({ preventScroll: true });
  }

  return (
    <section
      aria-labelledby="work-quick-start-heading"
      style={{
        padding: "0.85rem 1.5rem 1rem",
        background: "var(--background)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <div
        className="work-quick-start"
        style={{
          maxWidth: 1060,
          margin: "0 auto",
          background: "var(--card)",
          border: "1.5px solid rgba(94,68,42,0.12)",
          borderTop: `4px solid ${work.border}`,
          borderRadius: 8,
          padding: "0.85rem",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(220px, 0.9fr)",
          gap: "0.85rem",
          alignItems: "stretch",
          boxShadow: "0 8px 18px rgba(94,68,42,0.06)",
        }}
      >
        <div style={{ display: "grid", gap: "0.42rem", alignContent: "start" }}>
          <div id="work-quick-start-heading" style={{ color: "var(--cherry-forest)", fontSize: "0.72rem", fontWeight: 900 }}>立即任务</div>
          <p style={{ margin: 0, color: "var(--cherry-warm-brown)", fontSize: "0.92rem", lineHeight: 1.55, fontWeight: 900 }}>
            {work.task}
          </p>
          <button
            type="button"
            className="work-start-tool-link"
            aria-label={`开始操作${work.title}。先做这个，${work.starter}`}
            onClick={focusPrimaryTool}
            style={{
              justifySelf: "start",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--cherry-forest)",
              color: "#FAF7F1",
              border: "none",
              borderRadius: 999,
              padding: "0.42rem 0.82rem",
              cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
              fontSize: "0.76rem",
              fontWeight: 900,
            }}
          >
            开始操作 →
          </button>
        </div>
        <div className="work-quick-start-meta" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.55rem" }}>
          <div style={{ background: "var(--cherry-yellow-light)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.58rem", display: "grid", gap: "0.34rem" }}>
            <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.7rem", fontWeight: 900 }}>先做这个</span>
            <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.7rem", lineHeight: 1.35, fontWeight: 900 }}>
              {work.starter}
            </span>
          </div>
          <div style={{ background: work.color, border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.58rem", display: "grid", gap: "0.34rem" }}>
            <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.7rem", fontWeight: 900 }}>三步进入</span>
            <div role="list" aria-label={`${work.title}三步进入路径`} style={{ display: "grid", gap: "0.25rem" }}>
              {work.path.map((step, index) => (
                <span key={step} role="listitem" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.7rem", lineHeight: 1.35, fontWeight: 900 }}>
                  {index + 1}. {step}
                </span>
              ))}
            </div>
          </div>
          <div style={{ background: "var(--cherry-peach-light)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.58rem", display: "grid", gap: "0.34rem" }}>
            <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.7rem", fontWeight: 900 }}>做到这样算完成</span>
            <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.7rem", lineHeight: 1.35, fontWeight: 900 }}>
              {work.success}
            </span>
          </div>
          <div style={{ background: "var(--muted)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.58rem", display: "grid", gap: "0.34rem" }}>
            <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.7rem", fontWeight: 900 }}>你会得到</span>
            <div role="list" aria-label={`${work.title}学习产出`} style={{ display: "flex", flexWrap: "wrap", gap: "0.28rem" }}>
              {work.outputs.map((output) => (
                <span key={output} role="listitem" style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 999, padding: "0.13rem 0.42rem", color: "var(--cherry-forest)", fontSize: "0.66rem", fontWeight: 900 }}>
                  {output}
                </span>
              ))}
            </div>
          </div>
          <div style={{ background: "var(--cherry-sage-light)", border: "1px solid rgba(93,140,101,0.18)", borderRadius: 8, padding: "0.58rem", display: "grid", gap: "0.34rem", gridColumn: "1 / -1" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.7rem", fontWeight: 900 }}>完成证据</span>
              <button
                type="button"
                className="work-evidence-copy-button"
                onClick={copyEvidenceTemplate}
                aria-describedby="work-evidence-copy-status"
                style={{
                  border: "1px solid rgba(93,140,101,0.28)",
                  borderRadius: 999,
                  background: "var(--background)",
                  color: "var(--cherry-forest)",
                  cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "0.66rem",
                  fontWeight: 900,
                  padding: "0.22rem 0.58rem",
                  transition: "transform 0.18s ease, box-shadow 0.18s ease",
                }}
              >
                {copiedEvidence ? "已复制" : "复制复盘模板"}
              </button>
            </div>
            <div role="list" aria-label={`${work.title}完成后需要留下的学习证据`} style={{ display: "grid", gap: "0.26rem" }}>
              {evidenceItems.map((item, index) => (
                <span key={item} role="listitem" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.7rem", lineHeight: 1.4, fontWeight: 900 }}>
                  {index + 1}. {item}
                </span>
              ))}
            </div>
            <div className="work-evidence-field-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.42rem" }}>
              {evidenceFieldItems.map((field) => (
                <label key={field.id} htmlFor={field.id} style={{ display: "grid", gap: "0.26rem", color: "var(--cherry-warm-brown)", fontSize: "0.68rem", fontWeight: 900 }}>
                  {field.label}
                  <textarea
                    id={field.id}
                    value={field.value}
                    onChange={(event) => {
                      field.setter(event.target.value);
                      setCopiedEvidence(false);
                      setEvidenceCopyStatus("");
                    }}
                    rows={2}
                    placeholder={field.placeholder}
                    style={{ width: "100%", minHeight: 58, boxSizing: "border-box", border: "1px solid rgba(94,68,42,0.14)", borderRadius: 8, background: "rgba(250,247,241,0.72)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontSize: "0.72rem", lineHeight: 1.45, fontWeight: 800, padding: "0.46rem", resize: "vertical" }}
                  />
                </label>
              ))}
            </div>
            <div style={{ background: "rgba(250,247,241,0.6)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.48rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.38rem" }}>
              {[
                ["保存", filledEvidence.savedOutput],
                ["观察", filledEvidence.observedChange],
                ["证明", filledEvidence.completionProof],
                ["下一步", filledEvidence.nextQuestion],
              ].map(([label, body]) => (
                <span key={label} style={{ display: "grid", gap: "0.12rem" }}>
                  <span style={{ color: "var(--cherry-forest)", fontSize: "0.66rem", fontWeight: 900 }}>{label}</span>
                  <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.36, fontWeight: 900 }}>{body}</span>
                </span>
              ))}
            </div>
            <div style={{ background: "rgba(250,247,241,0.6)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.48rem", display: "grid", gap: "0.24rem" }}>
              <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.68rem", fontWeight: 900 }}>复盘检查</span>
              <div role="list" aria-label={`${work.title}复盘检查清单`} style={{ display: "grid", gap: "0.22rem" }}>
                {reflectionChecks.slice(0, 3).map((item, index) => (
                  <span key={item} role="listitem" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.38, fontWeight: 900 }}>
                    {index + 1}. {item}
                  </span>
                ))}
              </div>
            </div>
            <div
              id="work-evidence-copy-status"
              role="status"
              aria-live="polite"
              style={{ minHeight: "1rem", color: "var(--cherry-forest)", fontSize: "0.68rem", fontWeight: 900 }}
            >
              {evidenceCopyStatus}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkPairedReading({ work }: { work: Work }) {
  const pairedArticles = getPairedArticlesForWork(work);

  if (pairedArticles.length === 0) return null;

  function openArticle(href: string, event: React.MouseEvent<HTMLAnchorElement>) {
    if (!shouldUseClientNavigation(event)) return;
    event.preventDefault();
    navigateClient(href);
  }

  return (
    <section aria-labelledby="work-paired-reading-heading" style={{ padding: "0 1.5rem 1.15rem", fontFamily: "'Nunito', sans-serif", background: "var(--background)" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gap: "0.72rem" }}>
        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap" }}>
          <div style={{ display: "grid", gap: "0.18rem" }}>
            <h2 id="work-paired-reading-heading" style={{ margin: 0, color: "var(--cherry-warm-brown)", fontSize: "1rem", lineHeight: 1.25, fontWeight: 900 }}>做完接着读</h2>
            <p style={{ margin: 0, color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.48, fontWeight: 800 }}>
              先完成本页操作，再用配套文章把概念、证据和复盘方法补完整。
            </p>
          </div>
          <a
            className="work-detail-link"
            href="/#notes"
            onClick={(event) => {
              if (!shouldUseClientNavigation(event)) return;
              event.preventDefault();
              navigateHome("#notes");
            }}
            style={{ color: "var(--cherry-forest)", textDecoration: "none", fontWeight: 900, fontSize: "0.78rem" }}
          >
            全部学习资料 →
          </a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.72rem" }}>
          {pairedArticles.map((article) => (
            <a
              key={article.slug}
              className="work-paired-reading-link"
              href={article.href}
              aria-label={`打开配套阅读：${article.title}。先做这个，${article.actionSteps[0]}。完成后检查，${article.checklist[0]}`}
              onClick={(event) => openArticle(article.href, event)}
              onMouseEnter={() => preloadRouteForHref(article.href)}
              onFocus={() => preloadRouteForHref(article.href)}
              onPointerDown={() => preloadRouteForHref(article.href)}
              style={{
                display: "grid",
                gap: "0.55rem",
                alignContent: "start",
                background: "var(--card)",
                border: "1.5px solid rgba(94,68,42,0.12)",
                borderTop: `4px solid ${getArticleLabelColor(article)}`,
                borderRadius: 8,
                padding: "0.82rem",
                minHeight: 204,
                color: "inherit",
                textDecoration: "none",
                boxShadow: "0 8px 18px rgba(94,68,42,0.06)",
                minWidth: 0,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", minWidth: 0 }}>
                <span style={{ background: getArticleLabelBg(article), color: getArticleLabelColor(article), border: "1px solid rgba(94,68,42,0.1)", borderRadius: 999, padding: "0.14rem 0.5rem", fontSize: "0.66rem", fontWeight: 900 }}>
                  {getArticleLabel(article)}
                </span>
                <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.66rem", fontWeight: 900 }}>
                  {"readTime" in article ? `${article.readTime} 分钟` : `${article.readMin} 分钟`}
                </span>
              </span>
              <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.94rem", lineHeight: 1.35, fontWeight: 900, overflowWrap: "anywhere" }}>{article.title}</strong>
              <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.52, fontWeight: 800, overflowWrap: "anywhere" }}>
                {"excerpt" in article ? article.excerpt : article.body}
              </span>
              <span style={{ display: "grid", gap: "0.32rem", marginTop: "auto" }}>
                <span style={{ background: "var(--cherry-yellow-light)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.45rem 0.5rem", color: "var(--cherry-warm-brown)", fontSize: "0.7rem", lineHeight: 1.42, fontWeight: 900 }}>
                  先做这个：{article.actionSteps[0]}
                </span>
                <span style={{ display: "grid", gap: "0.2rem", gridTemplateColumns: "minmax(0, 1fr)", background: "var(--muted)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.45rem 0.5rem" }}>
                  <span style={{ color: "var(--cherry-forest)", fontSize: "0.66rem", lineHeight: 1.35, fontWeight: 900 }}>完成后检查：{article.checklist[0]}</span>
                  <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.66rem", lineHeight: 1.35, fontWeight: 900 }}>读完产出：{article.starterTemplate[0]}</span>
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkContinueLinks({ work }: { work: Work }) {
  const relatedWorks = [
    ...works.filter((item) => item.slug !== work.slug && item.category === work.category),
    ...works.filter((item) => item.slug !== work.slug && item.category !== work.category),
  ].slice(0, 2);

  if (relatedWorks.length === 0) return null;

  function openWork(href: string, event: React.MouseEvent<HTMLAnchorElement>) {
    if (!shouldUseClientNavigation(event)) return;
    event.preventDefault();
    navigateClient(href);
  }

  return (
    <section style={{ padding: "0 1.5rem 5rem", fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gap: "0.9rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <h2 style={{ color: "var(--cherry-warm-brown)", fontSize: "1.08rem", fontWeight: 900, margin: 0 }}>继续探索</h2>
          <a
            className="work-detail-link"
            href="/#works"
            onClick={(event) => {
              if (!shouldUseClientNavigation(event)) return;
              event.preventDefault();
              navigateHome("#works");
            }}
            style={{ color: "var(--cherry-forest)", textDecoration: "none", fontWeight: 900, fontSize: "0.84rem" }}
          >
            全部学习模块 →
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.85rem" }}>
          {relatedWorks.map((item) => (
              <a
                className="work-next-card"
                key={item.slug}
                href={item.href}
                aria-label={`继续探索${item.title}：先做这个，${item.starter}。完成标准，${item.success}`}
                onClick={(event) => openWork(item.href, event)}
                onMouseEnter={() => preloadRouteForHref(item.href)}
                onFocus={() => preloadRouteForHref(item.href)}
                onPointerDown={() => preloadRouteForHref(item.href)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "112px minmax(0, 1fr)",
                  gap: "0.82rem",
                  alignItems: "center",
                  background: "var(--card)",
                  border: "1.5px solid rgba(94,68,42,0.12)",
                  borderTop: `4px solid ${item.border}`,
                  borderRadius: 8,
                  padding: "0.82rem",
                  color: "inherit",
                  textDecoration: "none",
                  boxShadow: "0 8px 18px rgba(94,68,42,0.06)",
                  minWidth: 0,
                }}
              >
                <span aria-hidden="true" style={{ height: 88, borderRadius: 8, background: item.color, border: "1px solid rgba(94,68,42,0.1)", display: "grid", placeItems: "center", overflow: "hidden" }}>
                  <WorkPreviewIllustration slug={item.slug} color={item.border} width={112} height={88} />
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 10, background: "rgba(250,247,241,0.64)", marginBottom: "0.42rem" }}>
                    <span style={{ transform: "scale(0.54)", display: "inline-flex" }}>{item.icon}</span>
                  </span>
                  <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.92rem", lineHeight: 1.35, marginBottom: "0.34rem" }}>{item.title}</strong>
                  <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.5, marginBottom: "0.5rem" }}>{item.desc}</span>
                  <span style={{ display: "block", background: "var(--muted)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.45rem 0.52rem", color: "var(--cherry-warm-brown)", fontSize: "0.72rem", lineHeight: 1.45, fontWeight: 900, marginBottom: "0.5rem" }}>
                    <span style={{ display: "block", color: "var(--cherry-red)", fontSize: "0.64rem", marginBottom: "0.12rem" }}>先做这个</span>
                    {item.starter}
                  </span>
                  <span style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {item.outputs.map((output) => (
                      <span key={output} style={{ background: "rgba(250,247,241,0.74)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 999, padding: "0.13rem 0.46rem", color: "var(--cherry-warm-brown)", fontSize: "0.66rem", fontWeight: 900 }}>
                        {output}
                      </span>
                    ))}
                  </span>
                </span>
              </a>
            ))}
        </div>
      </div>
    </section>
  );
}

function WorkSequenceLinks({ work }: { work: Work }) {
  const currentIndex = works.findIndex((item) => item.slug === work.slug);
  const previousWork = currentIndex > 0 ? works[currentIndex - 1] : null;
  const nextWork = currentIndex >= 0 && currentIndex < works.length - 1 ? works[currentIndex + 1] : null;

  if (!previousWork && !nextWork) return null;

  function openWork(href: string, event: React.MouseEvent<HTMLAnchorElement>) {
    if (!shouldUseClientNavigation(event)) return;
    event.preventDefault();
    navigateClient(href);
  }

  const navItems = [
    previousWork ? { label: "上一个学习模块", direction: "←", work: previousWork, align: "left" as const } : null,
    nextWork ? { label: "下一个学习模块", direction: "→", work: nextWork, align: "right" as const } : null,
  ].filter((item): item is { label: string; direction: string; work: Work; align: "left" | "right" } => Boolean(item));

  return (
    <section style={{ padding: "0 1.5rem 1rem", fontFamily: "'Nunito', sans-serif" }}>
      <nav aria-label="学习模块前后导航" style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.85rem" }}>
        {navItems.map((item) => (
          <a
            className="work-sequence-card"
            key={item.work.slug}
            href={item.work.href}
            aria-label={`${item.label}：${item.work.title}。先做这个，${item.work.starter}。完成标准，${item.work.success}`}
            onClick={(event) => openWork(item.work.href, event)}
            onMouseEnter={() => preloadRouteForHref(item.work.href)}
            onFocus={() => preloadRouteForHref(item.work.href)}
            onPointerDown={() => preloadRouteForHref(item.work.href)}
            style={{
              display: "grid",
              gap: "0.45rem",
              justifyItems: item.align === "right" ? "end" : "start",
              textAlign: item.align,
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 18,
              padding: "0.95rem",
              color: "inherit",
              textDecoration: "none",
              boxShadow: "3px 5px 0px rgba(94,68,42,0.06)",
              minWidth: 0,
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--cherry-forest)", fontWeight: 900, fontSize: "1rem" }}>
              {item.align === "left" ? item.direction : null}
              {item.label}
              {item.align === "right" ? item.direction : null}
            </span>
            <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.95rem", lineHeight: 1.38, overflowWrap: "anywhere" }}>{item.work.title}</strong>
            <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.5, overflowWrap: "anywhere" }}>{item.work.desc}</span>
            <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.74rem", lineHeight: 1.45, fontWeight: 900, overflowWrap: "anywhere" }}>
              先做这个：{item.work.starter}
            </span>
          </a>
        ))}
      </nav>
    </section>
  );
}

export function WorkDetailPage({ slug }: { slug: string }) {
  const work = works.find((item) => item.slug === slug);

  if (!work) {
    return (
      <section id="main-content" tabIndex={-1} style={{ minHeight: "58vh", padding: "5rem 1.5rem", display: "grid", placeItems: "center", fontFamily: "'Nunito', sans-serif" }}>
        <EmptyStateCard
          eyebrow="学习模块"
          title="没有找到这个学习模块"
          body="这个学习模块地址可能已经移动。可以回到学习模块区，继续浏览科学模拟、学习项目和 AI 工具。"
          href="/#works"
          linkText="回到学习模块"
          onNavigate={(event) => {
            if (!shouldUseClientNavigation(event)) return;
            event.preventDefault();
            navigateHome("#works");
          }}
        />
      </section>
    );
  }

  return (
    <main id="main-content" tabIndex={-1}>
      <WorkHero work={work} compact />
      <WorkQuickStart work={work} />
      <WorkPairedReading work={work} />

      <section
        id="work-primary-tool"
        tabIndex={-1}
        style={{
          padding: work.slug === "gene-expression" ? 0 : "0 1.5rem 5rem",
          maxWidth: work.slug === "gene-expression" ? "none" : 1060,
          margin: "0 auto",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {work.slug === "gene-expression" ? <GeneExpressionTool /> : hasRichWorkContent(work.slug) ? <RichWorkContent slug={work.slug} /> : null}
      </section>
      <WorkSequenceLinks work={work} />
      <WorkContinueLinks work={work} />
      <style>
        {`
          .work-detail-back-link:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          .work-detail-back-link:hover,
          .work-detail-back-link:focus-visible {
            color: var(--cherry-red) !important;
          }

          .work-detail-link:focus-visible,
          .work-start-tool-link:focus-visible,
          .work-paired-reading-link:focus-visible,
          #work-primary-tool:focus-visible,
          .work-sequence-card:focus-visible,
          .work-next-card:focus-visible,
          .work-evidence-copy-button:focus-visible,
          .work-evidence-field-grid textarea:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          .work-sequence-card,
          .work-paired-reading-link,
          .work-next-card,
          .work-evidence-copy-button {
            transition: transform 0.18s ease, box-shadow 0.18s ease;
          }

          @media (max-width: 760px) {
            .work-quick-start {
              grid-template-columns: 1fr !important;
            }

            .work-quick-start-meta {
              grid-template-columns: 1fr !important;
            }

            .work-evidence-field-grid {
              grid-template-columns: 1fr !important;
            }
          }

          .work-sequence-card:hover,
          .work-sequence-card:focus-visible,
          .work-paired-reading-link:hover,
          .work-paired-reading-link:focus-visible,
          .work-next-card:hover,
          .work-next-card:focus-visible,
          .work-evidence-copy-button:hover,
          .work-evidence-copy-button:focus-visible {
            transform: translateY(-2px);
            box-shadow: 4px 8px 0 rgba(94,68,42,0.1) !important;
          }

          @media (prefers-reduced-motion: reduce) {
            .work-sequence-card,
            .work-paired-reading-link,
            .work-next-card,
            .work-evidence-copy-button {
              transition: none !important;
              transform: none !important;
            }
          }

          @media (max-width: 560px) {
            .work-next-card {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </main>
  );
}
