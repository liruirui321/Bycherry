import { IconBook, IconCheck, IconCoffee } from "./Icons";
import { notes } from "./Notes";
import { essays } from "./ResearchEssays";
import { works } from "./Works";
import { EmptyStateCard } from "./EmptyStateCard";
import { copyText } from "../clipboard";
import { getWorkToolHref, navigateClient, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";
import { useEffect, useState } from "react";

type ArticleKind = "note" | "research";

function navigateHome(hash: string) {
  navigateClient(`/${hash}`);
}

function navigateToPath(href: string) {
  navigateClient(href);
}

const pairedWorkSlugsByArticleSlug: Record<string, string[]> = {
  "ai-course-development": ["concept-explainer", "research-prompt-kit"],
  "plant-genome-evidence-chain": ["plant-evolution-stories", "research-prompt-kit"],
  "pbl-rubric-evidence": ["concept-explainer", "research-prompt-kit"],
  "ai-comic-video-workflow": ["research-prompt-kit", "concept-explainer"],
  "science-to-learning-question": ["plant-evolution-stories", "research-prompt-kit"],
  "genome-assembly-story": ["plant-evolution-stories", "research-prompt-kit"],
  "barcoding-evidence-chain": ["research-prompt-kit", "plant-evolution-stories"],
  "ai-assessment-quality-control": ["concept-explainer", "gene-expression"],
};

export function ArticleDetailPage({ kind, slug }: { kind: ArticleKind; slug: string }) {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [copiedActionPack, setCopiedActionPack] = useState(false);
  const [copiedLearningRecord, setCopiedLearningRecord] = useState(false);
  const [copiedPlatformConfig, setCopiedPlatformConfig] = useState(false);
  const [copiedPlatformReview, setCopiedPlatformReview] = useState(false);
  const [copiedAiAuditPrompts, setCopiedAiAuditPrompts] = useState(false);
  const [copiedEvidenceChainCard, setCopiedEvidenceChainCard] = useState(false);
  const [copiedBarcodeEvidenceTable, setCopiedBarcodeEvidenceTable] = useState(false);
  const [copiedProjectEvidenceTable, setCopiedProjectEvidenceTable] = useState(false);
  const [copiedCreationRunRecord, setCopiedCreationRunRecord] = useState(false);
  const [copiedResearchQuestionCard, setCopiedResearchQuestionCard] = useState(false);
  const [copiedAiMaterialAuditTable, setCopiedAiMaterialAuditTable] = useState(false);
  const [selectedPlatformPlanIndex, setSelectedPlatformPlanIndex] = useState(0);
  const [platformLearnerLevel, setPlatformLearnerLevel] = useState("生物基础入门，已经学过 DNA 和 RNA 基础");
  const [platformKnowledgeRange, setPlatformKnowledgeRange] = useState("基因表达：DNA、mRNA、蛋白质的信息传递关系");
  const [platformLearningGoal, setPlatformLearningGoal] = useState("我能说明 DNA、mRNA、蛋白质之间的信息传递关系");
  const [platformQuestionCount, setPlatformQuestionCount] = useState("6 题");
  const [platformTimeBudget, setPlatformTimeBudget] = useState("8 分钟");
  const [platformAuditFocus, setPlatformAuditFocus] = useState("重点检查题目是否混淆 RNA 聚合酶、mRNA、核糖体和蛋白质产物。");
  const [evidencePhenomenon, setEvidencePhenomenon] = useState("");
  const [evidenceMaterial, setEvidenceMaterial] = useState("");
  const [evidenceInterpretation, setEvidenceInterpretation] = useState("");
  const [evidenceLimit, setEvidenceLimit] = useState("");
  const [copiedGenomeStoryFrame, setCopiedGenomeStoryFrame] = useState(false);
  const [genomeStoryObject, setGenomeStoryObject] = useState("");
  const [genomeStoryQuestion, setGenomeStoryQuestion] = useState("");
  const [genomeStoryStructure, setGenomeStoryStructure] = useState("");
  const [genomeStoryFunction, setGenomeStoryFunction] = useState("");
  const [genomeStoryComparison, setGenomeStoryComparison] = useState("");
  const [genomeStoryConnection, setGenomeStoryConnection] = useState("");
  const [barcodeSampleRecord, setBarcodeSampleRecord] = useState("");
  const [barcodeLabRecord, setBarcodeLabRecord] = useState("");
  const [barcodeSequenceQuality, setBarcodeSequenceQuality] = useState("");
  const [barcodeBlastEvidence, setBarcodeBlastEvidence] = useState("");
  const [barcodeTreePosition, setBarcodeTreePosition] = useState("");
  const [barcodeConclusionBoundary, setBarcodeConclusionBoundary] = useState("");
  const [projectDrivingQuestion, setProjectDrivingQuestion] = useState("");
  const [projectFinalWork, setProjectFinalWork] = useState("");
  const [projectTaskNode, setProjectTaskNode] = useState("");
  const [projectProcessEvidence, setProjectProcessEvidence] = useState("");
  const [projectRubricCriteria, setProjectRubricCriteria] = useState("");
  const [projectRevisionRecord, setProjectRevisionRecord] = useState("");
  const [creationSceneGoal, setCreationSceneGoal] = useState("");
  const [creationCharacterLock, setCreationCharacterLock] = useState("");
  const [creationShotPlan, setCreationShotPlan] = useState("");
  const [creationAssetPrompt, setCreationAssetPrompt] = useState("");
  const [creationFailureNote, setCreationFailureNote] = useState("");
  const [creationEditCheck, setCreationEditCheck] = useState("");
  const [researchTheme, setResearchTheme] = useState("");
  const [researchEntryExperience, setResearchEntryExperience] = useState("");
  const [researchObservableQuestion, setResearchObservableQuestion] = useState("");
  const [researchEvidenceMaterial, setResearchEvidenceMaterial] = useState("");
  const [researchExplanationTask, setResearchExplanationTask] = useState("");
  const [researchBoundaryNextStep, setResearchBoundaryNextStep] = useState("");
  const [aiAuditLearningGoal, setAiAuditLearningGoal] = useState("");
  const [aiAuditSourceBoundary, setAiAuditSourceBoundary] = useState("");
  const [aiAuditMisconception, setAiAuditMisconception] = useState("");
  const [aiAuditPracticeCheck, setAiAuditPracticeCheck] = useState("");
  const [aiAuditEvidenceBoundary, setAiAuditEvidenceBoundary] = useState("");
  const [aiAuditRevisionAction, setAiAuditRevisionAction] = useState("");
  const [recordQuestion, setRecordQuestion] = useState("");
  const [recordEvidence, setRecordEvidence] = useState("");
  const [recordOutput, setRecordOutput] = useState("");
  const [recordNextStep, setRecordNextStep] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const collection = kind === "note" ? notes : essays;
  const article = collection.find((item) => item.slug === slug);
  const articleIndex = collection.findIndex((item) => item.slug === slug);
  const previousArticle = articleIndex > 0 ? collection[articleIndex - 1] : null;
  const nextArticle = articleIndex >= 0 && articleIndex < collection.length - 1 ? collection[articleIndex + 1] : null;
  const backHash = kind === "note" ? "#notes" : "#research";
  const backText = kind === "note" ? "回到方法库" : "回到证据库";

  useEffect(() => {
    setRecordQuestion("");
    setRecordEvidence("");
    setRecordOutput("");
    setRecordNextStep("");
    setCopiedLearningRecord(false);
    setCopiedEvidenceChainCard(false);
    setEvidencePhenomenon("");
    setEvidenceMaterial("");
    setEvidenceInterpretation("");
    setEvidenceLimit("");
    setCopiedBarcodeEvidenceTable(false);
    setBarcodeSampleRecord("");
    setBarcodeLabRecord("");
    setBarcodeSequenceQuality("");
    setBarcodeBlastEvidence("");
    setBarcodeTreePosition("");
    setBarcodeConclusionBoundary("");
    setCopiedProjectEvidenceTable(false);
    setProjectDrivingQuestion("");
    setProjectFinalWork("");
    setProjectTaskNode("");
    setProjectProcessEvidence("");
    setProjectRubricCriteria("");
    setProjectRevisionRecord("");
    setCopiedCreationRunRecord(false);
    setCreationSceneGoal("");
    setCreationCharacterLock("");
    setCreationShotPlan("");
    setCreationAssetPrompt("");
    setCreationFailureNote("");
    setCreationEditCheck("");
    setCopiedResearchQuestionCard(false);
    setResearchTheme("");
    setResearchEntryExperience("");
    setResearchObservableQuestion("");
    setResearchEvidenceMaterial("");
    setResearchExplanationTask("");
    setResearchBoundaryNextStep("");
    setCopiedAiMaterialAuditTable(false);
    setAiAuditLearningGoal("");
    setAiAuditSourceBoundary("");
    setAiAuditMisconception("");
    setAiAuditPracticeCheck("");
    setAiAuditEvidenceBoundary("");
    setAiAuditRevisionAction("");
    setCopiedGenomeStoryFrame(false);
    setGenomeStoryObject("");
    setGenomeStoryQuestion("");
    setGenomeStoryStructure("");
    setGenomeStoryFunction("");
    setGenomeStoryComparison("");
    setGenomeStoryConnection("");
    setCopyStatus("");
  }, [kind, slug]);
  const navArticles = [
    previousArticle ? { label: "上一篇", arrow: "←", article: previousArticle, align: "left" as const } : null,
    nextArticle ? { label: "下一篇", arrow: "→", article: nextArticle, align: "right" as const } : null,
  ].filter((item): item is { label: string; arrow: string; article: NonNullable<typeof article>; align: "left" | "right" } => Boolean(item));
  const readingPath = article
    ? "platformUrl" in article
      ? [
          { label: "平台入口", body: article.highlights[0] ?? "先打开平台，确认要使用的工具入口。" },
          { label: "填写参数", body: article.highlights[1] ?? "再填写对象、目标、范围和生成要求。" },
          { label: "审核使用", body: article.highlights[2] ?? "最后人工审核题目质量，再作答和复盘。" },
        ]
      : [
          { label: "进入点", body: article.highlights[0] ?? "先找到这篇文章要解决的问题。" },
          { label: "证据链", body: article.highlights[1] ?? "再看作者如何组织证据和判断边界。" },
          { label: "可迁移方法", body: article.highlights[2] ?? "最后提炼可以复用到自己项目里的方法。" },
        ]
    : [];
  const actionSteps = article && "actionSteps" in article ? article.actionSteps : [];
  const checklist = article && "checklist" in article ? article.checklist : [];
  const starterTemplate = article && "starterTemplate" in article ? article.starterTemplate : [];
  const pitfalls = article && "pitfalls" in article ? article.pitfalls : [];
  const articleQuickStart = article
    ? {
        step: actionSteps[0] ?? "先读摘要，圈出这篇内容要解决的一个问题。",
        check: checklist[0] ?? "完成后确认自己能说出一个可检查的结果。",
        pitfall: pitfalls[0] ?? "不要只浏览标题，必须留下一个可复盘的输出。",
      }
    : null;
  const articleEvidenceItems = article
    ? [
        `完成 1 个上手动作：${articleQuickStart?.step ?? actionSteps[0] ?? "先读正文并圈出一个问题"}`,
        `保存 1 份可复用材料：${starterTemplate[0] ?? "学习记录或证据卡"}`,
        `用检查清单核对：${articleQuickStart?.check ?? checklist[0] ?? "确认自己留下了可检查结果"}`,
      ]
    : [];
  const articleOutcomeSnapshot = article
    ? [
        {
          label: "行动包",
          body: actionSteps[0] ?? "先完成一个可观察动作。",
          result: "复制后直接按步骤执行。",
        },
        {
          label: "可保存材料",
          body: starterTemplate[0] ?? "保存一份学习记录或证据卡。",
          result: "读完后能放进自己的笔记继续用。",
        },
        {
          label: "完成检查",
          body: checklist[0] ?? "确认自己留下了可检查结果。",
          result: "能判断这篇内容是否真的被用上。",
        },
      ]
    : [];
  const articleCompletionChecks = article
    ? [
        {
          title: "上手动作",
          body: articleQuickStart?.step ?? actionSteps[0] ?? "先读正文，圈出一个要解决的问题。",
          output: "我已经做了，而不是只看过。",
        },
        {
          title: "可保存产出",
          body: starterTemplate[0] ?? articleEvidenceItems[1] ?? "留下 1 份学习记录或证据卡。",
          output: "我能把这份产出复制到自己的笔记里继续用。",
        },
        {
          title: "完成检查",
          body: articleQuickStart?.check ?? checklist[0] ?? "确认自己留下了可检查结果。",
          output: "我能用一句话说出产出是否合格。",
        },
        {
          title: "边界提醒",
          body: articleQuickStart?.pitfall ?? pitfalls[0] ?? "不要把看过内容误当成已经掌握。",
          output: "我知道这篇内容不能直接推出什么，或下一步还要核查什么。",
        },
      ]
    : [];
  const articlePracticePlan = article
    ? [
        { label: "5 分钟", body: articleQuickStart?.step ?? "先读摘要，圈出一个问题。" },
        { label: "12 分钟", body: actionSteps.slice(1, 4).join("；") || "把正文要点整理成 3 条可执行步骤。" },
        { label: "8 分钟", body: checklist.slice(0, 2).join("；") || "用检查清单确认输出是否合格。" },
        { label: "5 分钟", body: pitfalls[0] ? `复盘避坑：${pitfalls[0]}` : "写下下一步要补的证据或资料。" },
      ]
    : [];
  const articleRecordFields = article
    ? [
        {
          id: "record-question-input",
          label: "我要解决的问题",
          value: recordQuestion,
          setter: setRecordQuestion,
          placeholder: articleQuickStart?.step ?? "这篇内容帮我解决什么卡点？",
          fallback: articleQuickStart?.step ?? "先读正文，圈出一个要解决的问题。",
        },
        {
          id: "record-evidence-input",
          label: "我抓到的证据",
          value: recordEvidence,
          setter: setRecordEvidence,
          placeholder: article.highlights.slice(0, 2).join("；"),
          fallback: article.highlights.slice(0, 2).join("；") || "写下支撑理解的证据、步骤或判断标准。",
        },
        {
          id: "record-output-input",
          label: "我留下的产出",
          value: recordOutput,
          setter: setRecordOutput,
          placeholder: starterTemplate[0] ?? "我保存了哪张卡片、表格、配置或复盘记录？",
          fallback: starterTemplate[0] ?? articleEvidenceItems[1] ?? "保存一份学习记录或证据卡。",
        },
        {
          id: "record-next-step-input",
          label: "下一步要补什么",
          value: recordNextStep,
          setter: setRecordNextStep,
          placeholder: pitfalls[0] ?? checklist[0] ?? "下一步查资料、重做练习还是修改学习卡？",
          fallback: pitfalls[0] ?? checklist[0] ?? "写下下一步要补的证据或资料。",
        },
      ]
    : [];
  const pairedWorks = article
    ? (pairedWorkSlugsByArticleSlug[article.slug] ?? [])
        .map((workSlug) => works.find((work) => work.slug === workSlug))
        .filter((work): work is (typeof works)[number] => Boolean(work))
    : [];
  const filledRecord = {
    question: recordQuestion.trim() || articleRecordFields[0]?.fallback || "",
    evidence: recordEvidence.trim() || articleRecordFields[1]?.fallback || "",
    output: recordOutput.trim() || articleRecordFields[2]?.fallback || "",
    nextStep: recordNextStep.trim() || articleRecordFields[3]?.fallback || "",
  };
  const articleRecordQuality = article
    ? [
        {
          label: "问题",
          pass: recordQuestion.trim().length >= 12,
          help: "写清这篇文章要帮你解决的具体卡点。",
        },
        {
          label: "证据",
          pass: recordEvidence.trim().length >= 18 && /因为|证据|步骤|判断|说明|支持/.test(recordEvidence.trim()),
          help: "写出支撑理解的证据、步骤或判断理由。",
        },
        {
          label: "产出",
          pass: recordOutput.trim().length >= 12,
          help: "写清保存下来的卡片、配置、表格或记录。",
        },
        {
          label: "下一步",
          pass: recordNextStep.trim().length >= 12 && /查|改|补|做|复盘|核查|重读/.test(recordNextStep.trim()),
          help: "写出一个可以继续执行的补充动作。",
        },
      ]
    : [];
  const articleRecordScore = articleRecordQuality.filter((item) => item.pass).length;
  const evidenceChainBuilderEnabled = article?.slug === "plant-genome-evidence-chain";
  const evidenceChainFields = evidenceChainBuilderEnabled
    ? [
        {
          id: "evidence-phenomenon",
          label: "现象",
          value: evidencePhenomenon,
          setValue: setEvidencePhenomenon,
          placeholder: "例如：两种植物在干旱处理后的叶片萎蔫程度不同。",
          pass: evidencePhenomenon.trim().length >= 12,
          help: "写成能观察或比较的现象。",
        },
        {
          id: "evidence-material",
          label: "证据",
          value: evidenceMaterial,
          setValue: setEvidenceMaterial,
          placeholder: "例如：表达图显示某个胁迫响应基因在干旱条件下表达升高。",
          pass: evidenceMaterial.trim().length >= 18 && /图|数据|表达|比较|样本|证据|结果|显示|说明/.test(evidenceMaterial.trim()),
          help: "写出来自图表、数据、样本或比较结果的证据。",
        },
        {
          id: "evidence-interpretation",
          label: "解释",
          value: evidenceInterpretation,
          setValue: setEvidenceInterpretation,
          placeholder: "例如：这些数据提示该基因可能参与干旱响应。",
          pass: evidenceInterpretation.trim().length >= 14 && /提示|可能|支持|说明|解释|参与|关联/.test(evidenceInterpretation.trim()),
          help: "用保守语气写出证据可以支持到哪一步。",
        },
        {
          id: "evidence-limit",
          label: "限制",
          value: evidenceLimit,
          setValue: setEvidenceLimit,
          placeholder: "例如：表达升高不能直接证明因果，还需要敲除、过表达或更多样本验证。",
          pass: evidenceLimit.trim().length >= 18 && /不能|还需要|限制|验证|样本|因果|不确定|不足/.test(evidenceLimit.trim()),
          help: "写出这条证据还不能证明什么。",
        },
      ]
    : [];
  const evidenceChainScore = evidenceChainFields.filter((field) => field.pass).length;
  const evidenceChainFilled = {
    phenomenon: evidencePhenomenon.trim() || "两种植物或两种条件下出现了可观察差异。",
    material: evidenceMaterial.trim() || "一张图表、表达数据、比较结果或样本记录提供了证据线索。",
    interpretation: evidenceInterpretation.trim() || "这条证据可以提示某个基因、性状或环境响应之间存在关联。",
    limit: evidenceLimit.trim() || "这条证据还不能直接证明因果，需要更多样本、功能实验或独立证据验证。",
  };
  const evidenceChainCardText = evidenceChainBuilderEnabled
    ? `【植物基因组证据四格卡】
主题：${article?.title ?? ""}
填写完成度：${evidenceChainScore}/4

一、现象
${evidenceChainFilled.phenomenon}

二、证据
${evidenceChainFilled.material}

三、解释
${evidenceChainFilled.interpretation}

四、限制
${evidenceChainFilled.limit}

自查
1. 现象是否能被观察或比较：${evidenceChainFields[0]?.pass ? "可用" : "待补充"}
2. 证据是否来自图表、数据或样本：${evidenceChainFields[1]?.pass ? "可用" : "待补充"}
3. 解释是否没有超过证据范围：${evidenceChainFields[2]?.pass ? "可用" : "待补充"}
4. 限制是否保留了不确定性：${evidenceChainFields[3]?.pass ? "可用" : "待补充"}`
    : "";
  const genomeStoryBuilderEnabled = article?.slug === "genome-assembly-story";
  const genomeStoryFields = genomeStoryBuilderEnabled
    ? [
        {
          id: "genome-story-object",
          label: "研究对象",
          value: genomeStoryObject,
          setValue: setGenomeStoryObject,
          placeholder: "例如：一种耐旱植物，代表某个特殊生态位或演化分支。",
          pass: genomeStoryObject.trim().length >= 12,
          help: "写清这个物种为什么值得讲。",
        },
        {
          id: "genome-story-question",
          label: "主问题",
          value: genomeStoryQuestion,
          setValue: setGenomeStoryQuestion,
          placeholder: "例如：这些基因组数据能解释它为什么更能适应干旱环境吗？",
          pass: genomeStoryQuestion.trim().length >= 16 && /为什么|如何|能否|解释|帮助|变化|能力/.test(genomeStoryQuestion.trim()),
          help: "写成能被证据逐步回答的问题。",
        },
        {
          id: "genome-story-structure",
          label: "结构证据",
          value: genomeStoryStructure,
          setValue: setGenomeStoryStructure,
          placeholder: "例如：染色体级组装、基因数量、重复序列或组装质量指标。",
          pass: genomeStoryStructure.trim().length >= 16 && /染色体|组装|基因|重复|结构|质量|N50|contig|scaffold/i.test(genomeStoryStructure.trim()),
          help: "写出说明数据是否可靠或结构有什么特点的证据。",
        },
        {
          id: "genome-story-function",
          label: "功能证据",
          value: genomeStoryFunction,
          setValue: setGenomeStoryFunction,
          placeholder: "例如：某个基因家族扩张、表达模式改变或功能注释线索。",
          pass: genomeStoryFunction.trim().length >= 16 && /功能|表达|基因家族|注释|通路|调控|扩张|收缩/.test(genomeStoryFunction.trim()),
          help: "写出功能、表达或注释层面的线索。",
        },
        {
          id: "genome-story-comparison",
          label: "比较证据",
          value: genomeStoryComparison,
          setValue: setGenomeStoryComparison,
          placeholder: "例如：与近缘物种相比，某类基因或结构出现差异。",
          pass: genomeStoryComparison.trim().length >= 16 && /比较|近缘|差异|物种|同源|系统发育|保守|特异/.test(genomeStoryComparison.trim()),
          help: "写出这些线索和谁相比、差异在哪里。",
        },
        {
          id: "genome-story-connection",
          label: "连接句",
          value: genomeStoryConnection,
          setValue: setGenomeStoryConnection,
          placeholder: "例如：结构证据说明数据可靠，功能和比较证据共同提示这个适应性解释值得继续验证。",
          pass: genomeStoryConnection.trim().length >= 22 && /因为|所以|共同|连接|提示|支持|解释|验证/.test(genomeStoryConnection.trim()),
          help: "把三类证据连回主问题，避免只堆图表。",
        },
      ]
    : [];
  const genomeStoryScore = genomeStoryFields.filter((field) => field.pass).length;
  const genomeStoryFilled = {
    object: genomeStoryObject.trim() || "一个具有特殊性状、生态位或演化位置的植物研究对象。",
    question: genomeStoryQuestion.trim() || "这些基因组数据能解释这个物种的某种变化、能力或历史吗？",
    structure: genomeStoryStructure.trim() || "结构证据说明组装质量、染色体结构、基因数量或重复序列特点。",
    function: genomeStoryFunction.trim() || "功能证据提供基因家族、表达模式、通路或注释线索。",
    comparison: genomeStoryComparison.trim() || "比较证据说明它与近缘物种或对照材料之间的差异。",
    connection: genomeStoryConnection.trim() || "结构证据保证数据可用，功能和比较证据共同把材料连接回主问题；结论仍需要保留验证边界。",
  };
  const genomeStoryFrameText = genomeStoryBuilderEnabled
    ? `【基因组科学故事骨架】
主题：${article?.title ?? ""}
填写完成度：${genomeStoryScore}/6

一、研究对象
${genomeStoryFilled.object}

二、主问题
${genomeStoryFilled.question}

三、结构证据
${genomeStoryFilled.structure}

四、功能证据
${genomeStoryFilled.function}

五、比较证据
${genomeStoryFilled.comparison}

六、连接句
${genomeStoryFilled.connection}

自查
1. 研究对象是否有讲述理由：${genomeStoryFields[0]?.pass ? "可用" : "待补充"}
2. 主问题是否能被证据回答：${genomeStoryFields[1]?.pass ? "可用" : "待补充"}
3. 结构证据是否说明数据基础：${genomeStoryFields[2]?.pass ? "可用" : "待补充"}
4. 功能证据是否提供解释线索：${genomeStoryFields[3]?.pass ? "可用" : "待补充"}
5. 比较证据是否说明差异：${genomeStoryFields[4]?.pass ? "可用" : "待补充"}
6. 连接句是否回到主问题：${genomeStoryFields[5]?.pass ? "可用" : "待补充"}`
    : "";
  const barcodeEvidenceBuilderEnabled = article?.slug === "barcoding-evidence-chain";
  const barcodeEvidenceFields = barcodeEvidenceBuilderEnabled
    ? [
        {
          id: "barcode-sample-record",
          label: "样本记录",
          value: barcodeSampleRecord,
          setValue: setBarcodeSampleRecord,
          placeholder: "例如：样本 C01，采自校园池塘边，保留照片、地点、日期和采集人。",
          pass: barcodeSampleRecord.trim().length >= 18 && /样本|编号|照片|地点|采集|日期|来源/.test(barcodeSampleRecord.trim()),
          help: "写清样本编号、来源、照片或采集记录。",
        },
        {
          id: "barcode-lab-record",
          label: "实验质量",
          value: barcodeLabRecord,
          setValue: setBarcodeLabRecord,
          placeholder: "例如：DNA 提取成功，PCR 有单一清晰条带，阴性对照无条带。",
          pass: barcodeLabRecord.trim().length >= 18 && /DNA|PCR|条带|对照|提取|测序|实验|阴性|阳性/i.test(barcodeLabRecord.trim()),
          help: "写出 DNA、PCR、对照或实验记录是否支持继续分析。",
        },
        {
          id: "barcode-sequence-quality",
          label: "序列质量",
          value: barcodeSequenceQuality,
          setValue: setBarcodeSequenceQuality,
          placeholder: "例如：测序峰图前 30 bp 噪音较高，剪切后保留 620 bp 可比对序列。",
          pass: barcodeSequenceQuality.trim().length >= 18 && /序列|峰图|质量|剪切|长度|碱基|测序|bp|read/i.test(barcodeSequenceQuality.trim()),
          help: "写出峰图、长度、剪切或序列质量边界。",
        },
        {
          id: "barcode-blast-evidence",
          label: "BLAST 证据",
          value: barcodeBlastEvidence,
          setValue: setBarcodeBlastEvidence,
          placeholder: "例如：最高匹配为物种 A，相似度 98.6%，覆盖度 96%，候选物种差距 1.8%。",
          pass: barcodeBlastEvidence.trim().length >= 18 && /BLAST|相似度|覆盖度|匹配|候选|数据库|identity|coverage/i.test(barcodeBlastEvidence.trim()),
          help: "同时记录相似度、覆盖度、候选差距或数据库线索。",
        },
        {
          id: "barcode-tree-position",
          label: "树图位置",
          value: barcodeTreePosition,
          setValue: setBarcodeTreePosition,
          placeholder: "例如：样本与候选物种 A 聚在同一分支，但节点支持率只有 61。",
          pass: barcodeTreePosition.trim().length >= 16 && /树|分支|聚类|支持率|系统发育|节点|候选|clade|bootstrap/i.test(barcodeTreePosition.trim()),
          help: "写出样本在系统发育树上和候选物种的关系。",
        },
        {
          id: "barcode-conclusion-boundary",
          label: "结论边界",
          value: barcodeConclusionBoundary,
          setValue: setBarcodeConclusionBoundary,
          placeholder: "例如：目前可写作可能为物种 A；还不能排除近缘物种，需要复核 marker 或补采样。",
          pass: barcodeConclusionBoundary.trim().length >= 20 && /可能|不能|还需要|边界|排除|复核|补采样|验证|不确定/.test(barcodeConclusionBoundary.trim()),
          help: "写清确定、可能或仍需验证，不要把最高匹配直接当最终答案。",
        },
      ]
    : [];
  const barcodeEvidenceScore = barcodeEvidenceFields.filter((field) => field.pass).length;
  const barcodeEvidenceFilled = {
    sample: barcodeSampleRecord.trim() || "样本需要有编号、照片、地点、日期和采集人，避免后续无法回溯。",
    lab: barcodeLabRecord.trim() || "实验记录需要说明 DNA、PCR、对照或测序过程是否支持继续分析。",
    sequence: barcodeSequenceQuality.trim() || "序列质量需要说明峰图、剪切、长度和可比对范围。",
    blast: barcodeBlastEvidence.trim() || "BLAST 证据需要同时看相似度、覆盖度、候选差距和数据库记录。",
    tree: barcodeTreePosition.trim() || "树图位置需要说明样本与候选物种是否聚在可信分支。",
    boundary: barcodeConclusionBoundary.trim() || "结论要写成确定、可能或仍需验证，不能把最高匹配直接当最终答案。",
  };
  const barcodeEvidenceTableText = barcodeEvidenceBuilderEnabled
    ? `【Barcoding 鉴定证据链表】
主题：${article?.title ?? ""}
填写完成度：${barcodeEvidenceScore}/6

一、样本记录
${barcodeEvidenceFilled.sample}

二、实验质量
${barcodeEvidenceFilled.lab}

三、序列质量
${barcodeEvidenceFilled.sequence}

四、BLAST 证据
${barcodeEvidenceFilled.blast}

五、树图位置
${barcodeEvidenceFilled.tree}

六、结论边界
${barcodeEvidenceFilled.boundary}

自查
1. 样本是否可回溯：${barcodeEvidenceFields[0]?.pass ? "可用" : "待补充"}
2. 实验记录是否支持继续分析：${barcodeEvidenceFields[1]?.pass ? "可用" : "待补充"}
3. 序列质量是否说明清楚：${barcodeEvidenceFields[2]?.pass ? "可用" : "待补充"}
4. BLAST 是否同时看相似度、覆盖度和候选差距：${barcodeEvidenceFields[3]?.pass ? "可用" : "待补充"}
5. 树图位置是否能支撑候选判断：${barcodeEvidenceFields[4]?.pass ? "可用" : "待补充"}
6. 结论是否保留确定、可能或仍需验证：${barcodeEvidenceFields[5]?.pass ? "可用" : "待补充"}`
    : "";
  const projectEvidenceBuilderEnabled = article?.slug === "pbl-rubric-evidence";
  const projectEvidenceFields = projectEvidenceBuilderEnabled
    ? [
        {
          id: "project-driving-question",
          label: "驱动问题",
          value: projectDrivingQuestion,
          setValue: setProjectDrivingQuestion,
          placeholder: "例如：城市阳台如何在有限空间里提高可食植物的存活率？",
          pass: projectDrivingQuestion.trim().length >= 16 && /为什么|如何|能否|怎样|解决|提高|判断/.test(projectDrivingQuestion.trim()),
          help: "写成能被作品和证据回答的问题。",
        },
        {
          id: "project-final-work",
          label: "最终作品",
          value: projectFinalWork,
          setValue: setProjectFinalWork,
          placeholder: "例如：一页调查报告 + 一张种植方案图 + 7 天观察记录。",
          pass: projectFinalWork.trim().length >= 14 && /报告|模型|方案|作品|图|记录|视频|展板|卡片/.test(projectFinalWork.trim()),
          help: "写清最后要交付什么可看见的作品。",
        },
        {
          id: "project-task-node",
          label: "任务节点",
          value: projectTaskNode,
          setValue: setProjectTaskNode,
          placeholder: "例如：资料收集、变量设计、观察记录、证据整理、作品修订。",
          pass: projectTaskNode.trim().length >= 18 && /资料|设计|观察|记录|证据|整理|表达|修订|分析/.test(projectTaskNode.trim()),
          help: "把过程拆成 3-5 个可执行节点。",
        },
        {
          id: "project-process-evidence",
          label: "过程证据",
          value: projectProcessEvidence,
          setValue: setProjectProcessEvidence,
          placeholder: "例如：问题草稿、资料卡、原始记录、照片、反馈和修改前后对比。",
          pass: projectProcessEvidence.trim().length >= 18 && /草稿|资料|记录|照片|反馈|证据|数据|对比|修改/.test(projectProcessEvidence.trim()),
          help: "写出每个节点要保存的可回看材料。",
        },
        {
          id: "project-rubric-criteria",
          label: "评价量规",
          value: projectRubricCriteria,
          setValue: setProjectRubricCriteria,
          placeholder: "例如：问题清楚、证据可靠、解释连得上、表达可读、修改有痕迹。",
          pass: projectRubricCriteria.trim().length >= 18 && /问题|证据|解释|表达|修改|可靠|清楚|量规|标准/.test(projectRubricCriteria.trim()),
          help: "写成能观察的标准，不只写抽象形容词。",
        },
        {
          id: "project-revision-record",
          label: "修订记录",
          value: projectRevisionRecord,
          setValue: setProjectRevisionRecord,
          placeholder: "例如：根据反馈把结论从“最适合”改成“在本次记录中更稳定”。",
          pass: projectRevisionRecord.trim().length >= 20 && /根据|反馈|修改|修订|改成|补充|删除|调整|更可靠/.test(projectRevisionRecord.trim()),
          help: "写出一次具体修改如何让作品更可靠。",
        },
      ]
    : [];
  const projectEvidenceScore = projectEvidenceFields.filter((field) => field.pass).length;
  const projectEvidenceFilled = {
    question: projectDrivingQuestion.trim() || "驱动问题需要能被最终作品和过程证据回答。",
    work: projectFinalWork.trim() || "最终作品需要是可展示、可保存、可判断质量的产出。",
    nodes: projectTaskNode.trim() || "任务节点需要把过程拆成资料、设计、记录、整理、表达或修订。",
    evidence: projectProcessEvidence.trim() || "过程证据需要保留草稿、资料卡、原始记录、照片、反馈或修改痕迹。",
    rubric: projectRubricCriteria.trim() || "评价量规需要把问题、证据、解释、表达和修改写成可观察标准。",
    revision: projectRevisionRecord.trim() || "修订记录需要说明根据什么反馈，把什么内容改成了什么。",
  };
  const projectEvidenceTableText = projectEvidenceBuilderEnabled
    ? `【项目证据表】
主题：${article?.title ?? ""}
填写完成度：${projectEvidenceScore}/6

一、驱动问题
${projectEvidenceFilled.question}

二、最终作品
${projectEvidenceFilled.work}

三、任务节点
${projectEvidenceFilled.nodes}

四、过程证据
${projectEvidenceFilled.evidence}

五、评价量规
${projectEvidenceFilled.rubric}

六、修订记录
${projectEvidenceFilled.revision}

自查
1. 驱动问题是否能被作品回答：${projectEvidenceFields[0]?.pass ? "可用" : "待补充"}
2. 最终作品是否可展示、可保存：${projectEvidenceFields[1]?.pass ? "可用" : "待补充"}
3. 任务节点是否可执行：${projectEvidenceFields[2]?.pass ? "可用" : "待补充"}
4. 过程证据是否可回看：${projectEvidenceFields[3]?.pass ? "可用" : "待补充"}
5. 评价量规是否可观察：${projectEvidenceFields[4]?.pass ? "可用" : "待补充"}
6. 修订记录是否说明作品如何变可靠：${projectEvidenceFields[5]?.pass ? "可用" : "待补充"}`
    : "";
  const creationRunBuilderEnabled = article?.slug === "ai-comic-video-workflow";
  const creationRunFields = creationRunBuilderEnabled
    ? [
        {
          id: "creation-scene-goal",
          label: "场景目标",
          value: creationSceneGoal,
          setValue: setCreationSceneGoal,
          placeholder: "例如：20 秒片段里让主角发现信件，情绪从犹豫转为下定决心。",
          pass: creationSceneGoal.trim().length >= 18 && /场景|片段|情绪|动作|目标|表现|对白|主角/.test(creationSceneGoal.trim()),
          help: "写清这一段要表现的情绪、动作或叙事目的。",
        },
        {
          id: "creation-character-lock",
          label: "角色锁定",
          value: creationCharacterLock,
          setValue: setCreationCharacterLock,
          placeholder: "例如：短黑发、深绿色外套、银色耳钉；禁用长发、红衣、夸张表情。",
          pass: creationCharacterLock.trim().length >= 20 && /发|服装|颜色|表情|禁用|特征|角色|外观/.test(creationCharacterLock.trim()),
          help: "写清外观、服装、表情和禁用特征，减少镜头漂移。",
        },
        {
          id: "creation-shot-plan",
          label: "镜头表",
          value: creationShotPlan,
          setValue: setCreationShotPlan,
          placeholder: "例如：1. 中景推近 4 秒；2. 手部特写 3 秒；3. 侧脸停顿 5 秒。",
          pass: creationShotPlan.trim().length >= 20 && /镜头|中景|近景|特写|秒|动作|景别|推近|停顿/.test(creationShotPlan.trim()),
          help: "至少写出 3 个镜头、景别、动作和时长。",
        },
        {
          id: "creation-asset-prompt",
          label: "资产提示",
          value: creationAssetPrompt,
          setValue: setCreationAssetPrompt,
          placeholder: "例如：角色正面参考、房间黄昏光、桌面信件，统一低饱和写实风格。",
          pass: creationAssetPrompt.trim().length >= 20 && /角色|场景|参考|光|风格|资产|提示|一致|背景/.test(creationAssetPrompt.trim()),
          help: "写出生成角色、场景或道具时要复用的提示条件。",
        },
        {
          id: "creation-failure-note",
          label: "失败原因",
          value: creationFailureNote,
          setValue: setCreationFailureNote,
          placeholder: "例如：第 2 镜手指变形；下次限制手部入镜，改用信件边缘特写。",
          pass: creationFailureNote.trim().length >= 20 && /失败|问题|漂移|变形|不一致|下次|限制|修正|原因/.test(creationFailureNote.trim()),
          help: "把坏结果写成下次可复用的限制条件。",
        },
        {
          id: "creation-edit-check",
          label: "剪辑检查",
          value: creationEditCheck,
          setValue: setCreationEditCheck,
          placeholder: "例如：检查镜头衔接、停顿、声音稳定、字幕可读和情绪递进。",
          pass: creationEditCheck.trim().length >= 18 && /剪辑|节奏|声音|字幕|转场|衔接|停顿|情绪|可读/.test(creationEditCheck.trim()),
          help: "写清成片前要检查的节奏、声音、字幕和连续性。",
        },
      ]
    : [];
  const creationRunScore = creationRunFields.filter((field) => field.pass).length;
  const creationRunFilled = {
    scene: creationSceneGoal.trim() || "场景目标需要写清这一段要表现的情绪、动作或叙事目的。",
    character: creationCharacterLock.trim() || "角色锁定需要记录外观、服装、表情和禁用特征。",
    shots: creationShotPlan.trim() || "镜头表需要写出景别、动作、时长和镜头目的。",
    assets: creationAssetPrompt.trim() || "资产提示需要保留角色、场景、道具、光线和风格条件。",
    failure: creationFailureNote.trim() || "失败原因需要转成下次生成时可复用的限制条件。",
    edit: creationEditCheck.trim() || "剪辑检查需要覆盖连续性、节奏、声音、字幕和情绪递进。",
  };
  const creationRunRecordText = creationRunBuilderEnabled
    ? `【AI 创作生成记录表】
主题：${article?.title ?? ""}
填写完成度：${creationRunScore}/6

一、场景目标
${creationRunFilled.scene}

二、角色锁定
${creationRunFilled.character}

三、镜头表
${creationRunFilled.shots}

四、资产提示
${creationRunFilled.assets}

五、失败原因
${creationRunFilled.failure}

六、剪辑检查
${creationRunFilled.edit}

自查
1. 场景目标是否明确：${creationRunFields[0]?.pass ? "可用" : "待补充"}
2. 角色锁定是否能减少漂移：${creationRunFields[1]?.pass ? "可用" : "待补充"}
3. 镜头表是否包含景别、动作和时长：${creationRunFields[2]?.pass ? "可用" : "待补充"}
4. 资产提示是否能复用：${creationRunFields[3]?.pass ? "可用" : "待补充"}
5. 失败原因是否变成限制条件：${creationRunFields[4]?.pass ? "可用" : "待补充"}
6. 剪辑检查是否覆盖成片体验：${creationRunFields[5]?.pass ? "可用" : "待补充"}`
    : "";
  const researchQuestionBuilderEnabled = article?.slug === "science-to-learning-question";
  const researchQuestionFields = researchQuestionBuilderEnabled
    ? [
        {
          id: "research-theme",
          label: "科研主题",
          value: researchTheme,
          setValue: setResearchTheme,
          placeholder: "例如：植物耐旱相关基因组研究，关注适应性状和表达差异。",
          pass: researchTheme.trim().length >= 16 && /研究|基因|植物|主题|性状|机制|数据|材料/.test(researchTheme.trim()),
          help: "先写清真实科研材料讲的对象和方向。",
        },
        {
          id: "research-entry-experience",
          label: "已有经验",
          value: researchEntryExperience,
          setValue: setResearchEntryExperience,
          placeholder: "例如：我见过干旱时叶片萎蔫，也知道植物会调节气孔和根系。",
          pass: researchEntryExperience.trim().length >= 18 && /我|见过|知道|观察|经验|现象|已经|生活|例子/.test(researchEntryExperience.trim()),
          help: "写出可以从自己经验进入的现象或例子。",
        },
        {
          id: "research-observable-question",
          label: "可观察问题",
          value: researchObservableQuestion,
          setValue: setResearchObservableQuestion,
          placeholder: "例如：为什么同样缺水条件下，有些植物仍能保持较高存活率？",
          pass: researchObservableQuestion.trim().length >= 18 && /为什么|如何|能否|差异|观察|比较|变化|条件/.test(researchObservableQuestion.trim()),
          help: "把前沿主题改写成能观察、能比较的问题。",
        },
        {
          id: "research-evidence-material",
          label: "证据材料",
          value: researchEvidenceMaterial,
          setValue: setResearchEvidenceMaterial,
          placeholder: "例如：一张表达热图 + 一段样本处理说明 + 一个候选基因家族比较。",
          pass: researchEvidenceMaterial.trim().length >= 18 && /图|数据|样本|证据|材料|比较|表达|结果|说明/.test(researchEvidenceMaterial.trim()),
          help: "限制在 1-2 份自己能读懂的图表或数据。",
        },
        {
          id: "research-explanation-task",
          label: "解释任务",
          value: researchExplanationTask,
          setValue: setResearchExplanationTask,
          placeholder: "例如：判断表达升高支持什么、不支持什么，并说明是否能推出因果。",
          pass: researchExplanationTask.trim().length >= 20 && /判断|解释|支持|不支持|说明|因果|证据|推断/.test(researchExplanationTask.trim()),
          help: "写成要完成的判断，而不是只复述发现。",
        },
        {
          id: "research-boundary-next-step",
          label: "边界/下一步",
          value: researchBoundaryNextStep,
          setValue: setResearchBoundaryNextStep,
          placeholder: "例如：表达差异不能直接证明功能，还需要敲除、过表达或更多样本验证。",
          pass: researchBoundaryNextStep.trim().length >= 20 && /不能|还需要|边界|验证|下一步|样本|因果|限制|核查/.test(researchBoundaryNextStep.trim()),
          help: "保留证据不能说明的部分和下一步核查。",
        },
      ]
    : [];
  const researchQuestionScore = researchQuestionFields.filter((field) => field.pass).length;
  const researchQuestionFilled = {
    theme: researchTheme.trim() || "科研主题需要写清真实材料的研究对象、数据和方向。",
    experience: researchEntryExperience.trim() || "已有经验需要提供一个可以进入主题的现象、例子或观察。",
    question: researchObservableQuestion.trim() || "可观察问题需要能被比较、观察或证据材料逐步回答。",
    evidence: researchEvidenceMaterial.trim() || "证据材料先限制在 1-2 份可读图表、样本说明或数据结果。",
    task: researchExplanationTask.trim() || "解释任务需要判断证据支持什么、不支持什么，而不是只复述发现。",
    boundary: researchBoundaryNextStep.trim() || "边界/下一步需要写出不能直接推出什么，以及还要补什么证据。",
  };
  const researchQuestionCardText = researchQuestionBuilderEnabled
    ? `【科研问题转译卡】
主题：${article?.title ?? ""}
填写完成度：${researchQuestionScore}/6

一、科研主题
${researchQuestionFilled.theme}

二、已有经验
${researchQuestionFilled.experience}

三、可观察问题
${researchQuestionFilled.question}

四、证据材料
${researchQuestionFilled.evidence}

五、解释任务
${researchQuestionFilled.task}

六、边界/下一步
${researchQuestionFilled.boundary}

自查
1. 科研主题是否清楚：${researchQuestionFields[0]?.pass ? "可用" : "待补充"}
2. 已有经验是否能进入主题：${researchQuestionFields[1]?.pass ? "可用" : "待补充"}
3. 问题是否可观察或可比较：${researchQuestionFields[2]?.pass ? "可用" : "待补充"}
4. 证据材料是否有限且可读：${researchQuestionFields[3]?.pass ? "可用" : "待补充"}
5. 解释任务是否要求判断支持和不支持：${researchQuestionFields[4]?.pass ? "可用" : "待补充"}
6. 边界是否保留下一步验证：${researchQuestionFields[5]?.pass ? "可用" : "待补充"}`
    : "";
  const aiMaterialAuditBuilderEnabled = article?.slug === "ai-course-development";
  const aiMaterialAuditFields = aiMaterialAuditBuilderEnabled
    ? [
        {
          id: "ai-audit-learning-goal",
          label: "学习目标",
          value: aiAuditLearningGoal,
          setValue: setAiAuditLearningGoal,
          placeholder: "例如：我需要能解释转录和翻译的区别，并用图判断 mRNA 和蛋白质产物。",
          pass: aiAuditLearningGoal.trim().length >= 18 && /解释|判断|区分|说明|应用|目标|能|会/.test(aiAuditLearningGoal.trim()),
          help: "写成自己要完成的动作，不只写章节名。",
        },
        {
          id: "ai-audit-source-boundary",
          label: "资料边界",
          value: aiAuditSourceBoundary,
          setValue: setAiAuditSourceBoundary,
          placeholder: "例如：只依据教材第 2 节、个人记录和基因表达工具记录，不使用未核查网页。",
          pass: aiAuditSourceBoundary.trim().length >= 18 && /教材|笔记|论文|资料|网页|视频|边界|来源|工具/.test(aiAuditSourceBoundary.trim()),
          help: "写清 AI 可以依据哪些资料，哪些不能直接采信。",
        },
        {
          id: "ai-audit-misconception",
          label: "常见误解",
          value: aiAuditMisconception,
          setValue: setAiAuditMisconception,
          placeholder: "例如：容易把 RNA 聚合酶和 DNA 聚合酶混淆，把 mRNA 当成蛋白质产物。",
          pass: aiAuditMisconception.trim().length >= 18 && /混淆|误解|容易|错误|不清|概念|区分|当成/.test(aiAuditMisconception.trim()),
          help: "写出这次材料必须暴露或修正的误解。",
        },
        {
          id: "ai-audit-practice-check",
          label: "练习检查",
          value: aiAuditPracticeCheck,
          setValue: setAiAuditPracticeCheck,
          placeholder: "例如：每道题只检查一个核心判断，干扰项来自真实误解，解析说明为什么错。",
          pass: aiAuditPracticeCheck.trim().length >= 20 && /题|练习|干扰项|解析|判断|检查|错因|答案/.test(aiAuditPracticeCheck.trim()),
          help: "写清练习是否能暴露误解，而不是只堆题量。",
        },
        {
          id: "ai-audit-evidence-boundary",
          label: "证据边界",
          value: aiAuditEvidenceBoundary,
          setValue: setAiAuditEvidenceBoundary,
          placeholder: "例如：AI 生成的解释必须回到图、定义或教材句子；实验结论要标为待核查。",
          pass: aiAuditEvidenceBoundary.trim().length >= 20 && /证据|不能|待核查|依据|边界|图|定义|结论|实验/.test(aiAuditEvidenceBoundary.trim()),
          help: "写出哪些内容必须回到资料或证据核查。",
        },
        {
          id: "ai-audit-revision-action",
          label: "复盘动作",
          value: aiAuditRevisionAction,
          setValue: setAiAuditRevisionAction,
          placeholder: "例如：把错题归类为概念混淆或证据判断，再重写学习卡的机制步骤。",
          pass: aiAuditRevisionAction.trim().length >= 20 && /复盘|修改|重写|归类|补充|删除|改|下一步|错题/.test(aiAuditRevisionAction.trim()),
          help: "写出看完 AI 输出后要改哪张卡、哪道题或哪段解释。",
        },
      ]
    : [];
  const aiMaterialAuditScore = aiMaterialAuditFields.filter((field) => field.pass).length;
  const aiMaterialAuditFilled = {
    goal: aiAuditLearningGoal.trim() || "学习目标需要写成自己要完成的解释、判断或应用动作。",
    source: aiAuditSourceBoundary.trim() || "资料边界需要写清 AI 可以依据哪些资料，哪些内容要标为待核查。",
    misconception: aiAuditMisconception.trim() || "常见误解需要写出这次材料必须暴露或修正的混淆点。",
    practice: aiAuditPracticeCheck.trim() || "练习检查需要确认每道题能暴露具体误解，并有清楚解析。",
    evidence: aiAuditEvidenceBoundary.trim() || "证据边界需要说明哪些解释、数据或结论必须回到资料核查。",
    revision: aiAuditRevisionAction.trim() || "复盘动作需要写出下一步要修改、补充或删除的材料。",
  };
  const aiMaterialAuditTableText = aiMaterialAuditBuilderEnabled
    ? `【AI 学习材料质检表】
主题：${article?.title ?? ""}
填写完成度：${aiMaterialAuditScore}/6

一、学习目标
${aiMaterialAuditFilled.goal}

二、资料边界
${aiMaterialAuditFilled.source}

三、常见误解
${aiMaterialAuditFilled.misconception}

四、练习检查
${aiMaterialAuditFilled.practice}

五、证据边界
${aiMaterialAuditFilled.evidence}

六、复盘动作
${aiMaterialAuditFilled.revision}

自查
1. 学习目标是否是可完成动作：${aiMaterialAuditFields[0]?.pass ? "可用" : "待补充"}
2. 资料边界是否清楚：${aiMaterialAuditFields[1]?.pass ? "可用" : "待补充"}
3. 常见误解是否具体：${aiMaterialAuditFields[2]?.pass ? "可用" : "待补充"}
4. 练习是否能暴露误解：${aiMaterialAuditFields[3]?.pass ? "可用" : "待补充"}
5. 证据边界是否保留核查：${aiMaterialAuditFields[4]?.pass ? "可用" : "待补充"}
6. 复盘动作是否能继续执行：${aiMaterialAuditFields[5]?.pass ? "可用" : "待补充"}`
    : "";
  const platformUrl = article && "platformUrl" in article ? article.platformUrl : null;
  const platformUsePlans = platformUrl
    ? [
        {
          title: "预习诊断",
          fields: ["用途：预习诊断", "学习阶段：刚进入新主题", "知识点：只填 1 个章节或 2-3 个核心概念", "题型：选择题 + 判断题", "难度：基础", "题量：3-5 题，预计 5 分钟"],
          audit: ["是否暴露了先修概念缺口", "是否每题只检查一个基础判断", "是否能指导下一步补哪一页学习卡"],
          output: "审核重点：题目要能暴露先修缺口，做完后先看错题类型，再决定要不要补先修概念。",
        },
        {
          title: "概念检查",
          fields: ["用途：概念检查", "学习阶段：刚学完一个概念", "知识点：一个容易混淆的概念对", "题型：辨析题 + 简答题", "难度：中等", "题量：2-4 题，预计 6 分钟"],
          audit: ["干扰项是否来自真实混淆", "解析是否说明错因", "是否能用自己的话改写正确解释"],
          output: "审核重点：干扰项必须来自真实误解，解析要说明为什么错，而不是只给正确答案。",
        },
        {
          title: "复习巩固",
          fields: ["用途：复习巩固", "学习阶段：学完一组相关知识", "知识点：概念 + 过程 + 证据材料", "题型：选择题 + 图表题 + 简答题", "难度：中等到进阶", "题量：6-10 题，预计 10 分钟"],
          audit: ["是否串起概念、过程和证据", "是否包含至少一道迁移题", "错题是否能归类为概念、读题或证据判断问题"],
          output: "审核重点：题目要能串起多个知识点，完成后记录高频错因，并回到学习卡修改。",
        },
      ]
    : [];
  const activePlatformPlan = platformUsePlans[selectedPlatformPlanIndex] ?? platformUsePlans[0];
  const platformCustomConfigItems = activePlatformPlan
    ? [
        `用途：${activePlatformPlan.title}`,
        `学习阶段：${platformLearnerLevel.trim() || "请填写当前学习背景"}`,
        `知识点范围：${platformKnowledgeRange.trim() || "请填写本次只测哪些知识点"}`,
        `测评目标：${platformLearningGoal.trim() || "请写成“我能……”的可观察动作"}`,
        `题量：${platformQuestionCount.trim() || "请填写题量"}`,
        `预计完成时间：${platformTimeBudget.trim() || "请填写预计完成时间"}`,
        `审核重点：${platformAuditFocus.trim() || "请填写本次最容易出错的题目质量风险"}`,
        "生成要求：题干清楚，答案唯一，干扰项来自真实误解，解析说明为什么对、为什么错",
      ]
    : [];
  const platformUsePlansText = platformUsePlans.map((plan) => `${plan.title}\n${plan.fields.map((field) => `- ${field}`).join("\n")}\n- ${plan.output}`).join("\n\n");
  const platformQuestionAuditRubric = platformUrl
    ? [
        { title: "题干", pass: "只问一个核心判断，条件足够，不靠猜题意作答。", fix: "题干同时问多个概念时，拆成两题；缺少条件时补充材料或删题。" },
        { title: "答案", pass: "正确答案唯一，能从题干和知识点范围直接推出。", fix: "如果两个选项都说得通，改题干限定条件，或把题改成开放辨析题。" },
        { title: "干扰项", pass: "来自真实误解，例如混淆对象、方向、条件、因果或适用范围。", fix: "明显错误或无关选项要重写，避免题目只是在考排除法。" },
        { title: "解析", pass: "说明为什么对、为什么错，并指出对应知识点或错因。", fix: "只重复答案的解析不保留，要求补上推理步骤和边界提醒。" },
      ]
    : [];
  const platformWrongReasonTags = platformUrl
    ? ["概念混淆", "过程顺序", "条件遗漏", "读题偏差", "图表证据", "因果外推", "术语不稳", "题目歧义"]
    : [];
  const platformTopicTemplates = platformUrl
    ? [
        {
          title: "基因表达",
          planIndex: 1,
          learnerLevel: "生物基础入门，已经学过 DNA 和 RNA 基础",
          knowledgeRange: "DNA、mRNA、蛋白质的信息传递关系；转录、翻译、密码子",
          learningGoal: "我能区分转录产物和翻译产物，并说明一个密码子如何对应一个氨基酸",
          questionCount: "6 题",
          timeBudget: "8 分钟",
          auditFocus: "重点检查题目是否混淆 RNA 聚合酶、mRNA、核糖体和蛋白质产物。",
        },
        {
          title: "植物演化",
          planIndex: 2,
          learnerLevel: "已经知道藻类、苔藓、蕨类、裸子植物和被子植物的大致顺序",
          knowledgeRange: "淡水绿藻到开花结果的关键创新、证据类型和结论边界",
          learningGoal: "我能按时间顺序解释植物登陆、维管束、种子、花和果实分别解决了什么问题",
          questionCount: "8 题",
          timeBudget: "10 分钟",
          auditFocus: "重点检查题目是否区分化石记录、现生基因组、系统发育和分子钟证据。",
        },
        {
          title: "概念解释",
          planIndex: 1,
          learnerLevel: "刚学完一个概念，但还不能稳定复述机制和边界",
          knowledgeRange: "一个容易混淆的概念；定义、机制、例子、反例和适用范围",
          learningGoal: "我能用一句话解释概念，再用 3 个步骤说明它如何发生或如何判断",
          questionCount: "4 题",
          timeBudget: "6 分钟",
          auditFocus: "重点检查题目是否能暴露误解，而不是只考定义背诵。",
        },
        {
          title: "图表证据",
          planIndex: 2,
          learnerLevel: "能读基础坐标轴，但容易把趋势、相关和因果混在一起",
          knowledgeRange: "图号、坐标轴、单位、分组、显著性标记和图注结论",
          learningGoal: "我能先描述图中的观察事实，再判断它支持什么、不能支持什么",
          questionCount: "5 题",
          timeBudget: "7 分钟",
          auditFocus: "重点检查题目是否要求读图证据，而不是直接跳到机制结论。",
        },
      ]
    : [];
  const platformAuditRubricText = platformQuestionAuditRubric.map((item, index) => `${index + 1}. ${item.title}
通过标准：${item.pass}
不合格处理：${item.fix}`).join("\n\n");
  const activePlatformPlanText = activePlatformPlan
    ? `【SciFusion 当前照填方案】
平台入口：${platformUrl}
当前用途：${activePlatformPlan.title}

我的照填输入
${platformCustomConfigItems.map((field, index) => `${index + 1}. ${field}`).join("\n")}

照填字段
${activePlatformPlan.fields.map((field, index) => `${index + 1}. ${field}`).join("\n")}

审核清单
${activePlatformPlan.audit.map((item, index) => `${index + 1}. ${item}`).join("\n")}

题目验收量规
${platformAuditRubricText}

使用节奏
1. 先把上面字段照填进平台。
2. 少量生成后逐题审核，不合格题直接删掉或重写。
3. 作答后用错因标签记录：${platformWrongReasonTags.join("、")}。
4. 回到学习卡补最高频薄弱点。`
    : "";
  const aiMaterialAuditPrompts = article?.slug === "ai-course-development"
    ? [
        {
          title: "目标对齐",
          prompt: "请检查这份学习材料是否只服务一个明确目标。输出：目标一句话、偏离目标的内容、建议删除或收窄的部分。",
          output: "能判断材料是否在帮我解决当前卡点，而不是堆信息。",
        },
        {
          title: "误解扫描",
          prompt: "请列出这份材料可能造成的 5 个误解。每个误解都要写成“我可能会误以为……，但实际应该区分……”。",
          output: "把看似顺滑的解释拆成可检查的误区。",
        },
        {
          title: "证据边界",
          prompt: "请把材料里的内容分成：可直接相信、需要资料核查、不能由材料推出。不要补充材料中没有的事实。",
          output: "防止 AI 把推测写成结论。",
        },
        {
          title: "练习有效性",
          prompt: "请检查每道练习是否能暴露一个具体误解。输出：练习目标、可观察答案、无法判断理解的题目。",
          output: "留下真正能证明理解的练习。",
        },
      ]
    : [];
  const aiMaterialAuditPromptText = aiMaterialAuditPrompts.length
    ? `【AI 学习材料质检提示词包】
使用方式：把 AI 生成的学习材料粘贴进去，再逐条运行下面 4 个质检任务。

${aiMaterialAuditPrompts.map((item, index) => `${index + 1}. ${item.title}
提示词：${item.prompt}
检查产出：${item.output}`).join("\n\n")}

最终判断
1. 这份材料可以直接使用的部分：
2. 需要重写的部分：
3. 必须回到资料核查的部分：
4. 我下一步要完成的可观察输出：`
    : "";
  const platformPasteConfigText = platformUrl
    ? activePlatformPlanText || `【SciFusion 平台照填配置】
平台入口：${platformUrl}

${platformUsePlansText}

使用规则
1. 先少量生成，不一次生成过多题。
2. 生成后逐题审核题干、答案、干扰项和解析。
3. 删除跑题、歧义、超纲或解析空泛的题。
4. 做完后记录最高频错因，再回到学习卡补薄弱点。

题目验收量规
${platformAuditRubricText}

错因标签
${platformWrongReasonTags.join("、")}`
    : "";
  const platformReviewText = platformUrl
    ? `【SciFusion 测后复盘记录】
平台入口：${platformUrl}
本次用途：${activePlatformPlan?.title ?? ""}
学习阶段：${platformLearnerLevel}
知识点范围：${platformKnowledgeRange}
测评目标：${platformLearningGoal}
题量 / 时间：${platformQuestionCount} / ${platformTimeBudget}
审核重点：${platformAuditFocus}

题目审核
1. 题干是否只问一个核心问题：
2. 正确答案是否唯一：
3. 干扰项是否来自真实误解：
4. 解析是否说明为什么对、为什么错：

作答复盘
1. 我错了哪些题：
2. 高频错因：
3. 错因标签：${platformWrongReasonTags.join(" / ")}
4. 是题目表达问题，还是我没有掌握：
5. 下一步要修改的学习卡或补充资料：

保留结论
这次测评真正证明我已经掌握的是：
仍需要继续核查的是：`
    : "";
  const starterTemplateText = starterTemplate.map((item) => `- ${item}`).join("\n");
  const actionPackText = article
    ? `【行动包】${article.title}

一、上手步骤
${actionSteps.map((step, index) => `${index + 1}. ${step}`).join("\n")}

二、检查清单
${checklist.map((item, index) => `${index + 1}. ${item}`).join("\n")}

三、避坑提醒
${pitfalls.map((item, index) => `${index + 1}. ${item}`).join("\n")}

四、平台照填配置
${platformUsePlansText || "这篇内容不需要平台配置。"}

五、可套用模板
${starterTemplateText}`
    : "";
  const learningRecordText = article
    ? `【学习记录】${article.title}

一、我先做的动作
${articleQuickStart?.step ?? actionSteps[0] ?? "先读正文，圈出一个要解决的问题。"}

二、我留下的产出
${articleEvidenceItems.map((item, index) => `${index + 1}. ${item}`).join("\n")}

三、我的填写记录
填写完成度：${articleRecordScore}/4
1. 我要解决的问题：${filledRecord.question}
2. 我抓到的证据：${filledRecord.evidence}
3. 我留下的产出：${filledRecord.output}
4. 下一步要补什么：${filledRecord.nextStep}

填写质量
${articleRecordQuality.map((item, index) => `${index + 1}. ${item.label}：${item.pass ? "可用" : "待补充"}｜${item.help}`).join("\n")}

四、30 分钟执行节奏
${articlePracticePlan.map((item) => `${item.label}：${item.body}`).join("\n")}

五、我检查到的问题
${checklist.map((item, index) => `${index + 1}. ${item}：`).join("\n")}

六、我需要避开的误区
${pitfalls.map((item, index) => `${index + 1}. ${item}`).join("\n")}

七、完成验收
${articleCompletionChecks.map((item, index) => `${index + 1}. ${item.title}：${item.body}
验收：${item.output}`).join("\n\n")}

八、读完接着做
${pairedWorks.length ? pairedWorks.map((work, index) => `${index + 1}. ${work.title}
入口：${getWorkToolHref(work.href)}
先做这个：${work.starter}
完成标准：${work.success}`).join("\n\n") : "回到学习模块总览，选择一个相关工具继续操作。"}

九、下一步回看
我还需要补充或重做：`
    : "";
  const summaryText = article
    ? `【阅读摘要】
标题：${article.title}
日期：${article.date}
类型：${"tag" in article ? article.tag : article.label}
阅读时间：约 ${"readTime" in article ? article.readTime : article.readMin} 分钟
${"platformUrl" in article ? `平台入口：${article.platformUrl}\n` : ""}

一、摘要
${article.excerpt ?? article.body}

二、正文要点
${article.paragraphs.map((paragraph, index) => `${index + 1}. ${paragraph}`).join("\n")}

三、上手步骤
${actionSteps.map((step, index) => `${index + 1}. ${step}`).join("\n")}

四、检查清单
${checklist.map((item, index) => `${index + 1}. ${item}`).join("\n")}

五、避坑提醒
${pitfalls.map((item, index) => `${index + 1}. ${item}`).join("\n")}

六、平台照填配置
${platformUsePlansText || "这篇内容不需要平台配置。"}

七、可套用模板
${starterTemplateText}

八、可带走的方法
${article.highlights.map((highlight, index) => `${index + 1}. ${highlight}`).join("\n")}`
    : "";

  async function copyArticleSummary() {
    if (!summaryText) return;
    const copiedToClipboard = await copyText(summaryText);
    if (copiedToClipboard) {
      setCopiedSummary(true);
      setCopiedTemplate(false);
      setCopiedActionPack(false);
      setCopiedLearningRecord(false);
      setCopiedPlatformConfig(false);
      setCopiedPlatformReview(false);
      setCopiedAiAuditPrompts(false);
      setCopyStatus("阅读摘要已复制到剪贴板。");
      window.setTimeout(() => setCopiedSummary(false), 1400);
      return;
    }

    setCopiedSummary(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyTemplateText() {
    if (!starterTemplateText) return;
    const copiedToClipboard = await copyText(starterTemplateText);
    if (copiedToClipboard) {
      setCopiedTemplate(true);
      setCopiedSummary(false);
      setCopiedActionPack(false);
      setCopiedLearningRecord(false);
      setCopiedPlatformConfig(false);
      setCopiedPlatformReview(false);
      setCopiedAiAuditPrompts(false);
      setCopyStatus("可套用模板已复制到剪贴板。");
      window.setTimeout(() => setCopiedTemplate(false), 1400);
      return;
    }

    setCopiedTemplate(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyActionPack() {
    if (!actionPackText) return;
    const copiedToClipboard = await copyText(actionPackText);
    if (copiedToClipboard) {
      setCopiedActionPack(true);
      setCopiedSummary(false);
      setCopiedTemplate(false);
      setCopiedLearningRecord(false);
      setCopiedPlatformConfig(false);
      setCopiedPlatformReview(false);
      setCopiedAiAuditPrompts(false);
      setCopyStatus("行动包已复制到剪贴板。");
      window.setTimeout(() => setCopiedActionPack(false), 1400);
      return;
    }

    setCopiedActionPack(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyLearningRecord() {
    if (!learningRecordText) return;
    const copiedToClipboard = await copyText(learningRecordText);
    if (copiedToClipboard) {
      setCopiedLearningRecord(true);
      setCopiedSummary(false);
      setCopiedTemplate(false);
      setCopiedActionPack(false);
      setCopiedPlatformConfig(false);
      setCopiedPlatformReview(false);
      setCopiedAiAuditPrompts(false);
      setCopyStatus("学习记录已复制到剪贴板。");
      window.setTimeout(() => setCopiedLearningRecord(false), 1400);
      return;
    }

    setCopiedLearningRecord(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  function focusArticleStart() {
    const target = document.getElementById(actionSteps.length ? "article-primary-action" : "article-body-points");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    target?.focus({ preventScroll: true });
  }

  function applyPlatformTopicTemplate(template: (typeof platformTopicTemplates)[number]) {
    setSelectedPlatformPlanIndex(template.planIndex);
    setPlatformLearnerLevel(template.learnerLevel);
    setPlatformKnowledgeRange(template.knowledgeRange);
    setPlatformLearningGoal(template.learningGoal);
    setPlatformQuestionCount(template.questionCount);
    setPlatformTimeBudget(template.timeBudget);
    setPlatformAuditFocus(template.auditFocus);
    setCopiedPlatformConfig(false);
    setCopiedPlatformReview(false);
    setCopyStatus(`已载入${template.title}照填包，可以复制到平台。`);
  }

  async function copyEvidenceChainCard() {
    if (!evidenceChainCardText) return;
    const copiedToClipboard = await copyText(evidenceChainCardText);
    if (copiedToClipboard) {
      setCopiedEvidenceChainCard(true);
      setCopiedBarcodeEvidenceTable(false);
      setCopiedProjectEvidenceTable(false);
      setCopiedCreationRunRecord(false);
      setCopiedResearchQuestionCard(false);
      setCopiedAiMaterialAuditTable(false);
      setCopiedSummary(false);
      setCopiedTemplate(false);
      setCopiedActionPack(false);
      setCopiedLearningRecord(false);
      setCopiedPlatformConfig(false);
      setCopiedPlatformReview(false);
      setCopiedAiAuditPrompts(false);
      setCopyStatus("证据四格卡已复制到剪贴板。");
      window.setTimeout(() => setCopiedEvidenceChainCard(false), 1400);
      return;
    }

    setCopiedEvidenceChainCard(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyGenomeStoryFrame() {
    if (!genomeStoryFrameText) return;
    const copiedToClipboard = await copyText(genomeStoryFrameText);
    if (copiedToClipboard) {
      setCopiedGenomeStoryFrame(true);
      setCopiedBarcodeEvidenceTable(false);
      setCopiedProjectEvidenceTable(false);
      setCopiedCreationRunRecord(false);
      setCopiedResearchQuestionCard(false);
      setCopiedAiMaterialAuditTable(false);
      setCopiedEvidenceChainCard(false);
      setCopiedSummary(false);
      setCopiedTemplate(false);
      setCopiedActionPack(false);
      setCopiedLearningRecord(false);
      setCopiedPlatformConfig(false);
      setCopiedPlatformReview(false);
      setCopiedAiAuditPrompts(false);
      setCopyStatus("科学故事骨架已复制到剪贴板。");
      window.setTimeout(() => setCopiedGenomeStoryFrame(false), 1400);
      return;
    }

    setCopiedGenomeStoryFrame(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyBarcodeEvidenceTable() {
    if (!barcodeEvidenceTableText) return;
    const copiedToClipboard = await copyText(barcodeEvidenceTableText);
    if (copiedToClipboard) {
      setCopiedBarcodeEvidenceTable(true);
      setCopiedProjectEvidenceTable(false);
      setCopiedCreationRunRecord(false);
      setCopiedResearchQuestionCard(false);
      setCopiedAiMaterialAuditTable(false);
      setCopiedGenomeStoryFrame(false);
      setCopiedEvidenceChainCard(false);
      setCopiedSummary(false);
      setCopiedTemplate(false);
      setCopiedActionPack(false);
      setCopiedLearningRecord(false);
      setCopiedPlatformConfig(false);
      setCopiedPlatformReview(false);
      setCopiedAiAuditPrompts(false);
      setCopyStatus("鉴定证据链表已复制到剪贴板。");
      window.setTimeout(() => setCopiedBarcodeEvidenceTable(false), 1400);
      return;
    }

    setCopiedBarcodeEvidenceTable(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyProjectEvidenceTable() {
    if (!projectEvidenceTableText) return;
    const copiedToClipboard = await copyText(projectEvidenceTableText);
    if (copiedToClipboard) {
      setCopiedProjectEvidenceTable(true);
      setCopiedBarcodeEvidenceTable(false);
      setCopiedCreationRunRecord(false);
      setCopiedResearchQuestionCard(false);
      setCopiedAiMaterialAuditTable(false);
      setCopiedGenomeStoryFrame(false);
      setCopiedEvidenceChainCard(false);
      setCopiedSummary(false);
      setCopiedTemplate(false);
      setCopiedActionPack(false);
      setCopiedLearningRecord(false);
      setCopiedPlatformConfig(false);
      setCopiedPlatformReview(false);
      setCopiedAiAuditPrompts(false);
      setCopyStatus("项目证据表已复制到剪贴板。");
      window.setTimeout(() => setCopiedProjectEvidenceTable(false), 1400);
      return;
    }

    setCopiedProjectEvidenceTable(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyCreationRunRecord() {
    if (!creationRunRecordText) return;
    const copiedToClipboard = await copyText(creationRunRecordText);
    if (copiedToClipboard) {
      setCopiedCreationRunRecord(true);
      setCopiedProjectEvidenceTable(false);
      setCopiedBarcodeEvidenceTable(false);
      setCopiedResearchQuestionCard(false);
      setCopiedAiMaterialAuditTable(false);
      setCopiedGenomeStoryFrame(false);
      setCopiedEvidenceChainCard(false);
      setCopiedSummary(false);
      setCopiedTemplate(false);
      setCopiedActionPack(false);
      setCopiedLearningRecord(false);
      setCopiedPlatformConfig(false);
      setCopiedPlatformReview(false);
      setCopiedAiAuditPrompts(false);
      setCopyStatus("AI 创作生成记录表已复制到剪贴板。");
      window.setTimeout(() => setCopiedCreationRunRecord(false), 1400);
      return;
    }

    setCopiedCreationRunRecord(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyResearchQuestionCard() {
    if (!researchQuestionCardText) return;
    const copiedToClipboard = await copyText(researchQuestionCardText);
    if (copiedToClipboard) {
      setCopiedResearchQuestionCard(true);
      setCopiedCreationRunRecord(false);
      setCopiedProjectEvidenceTable(false);
      setCopiedBarcodeEvidenceTable(false);
      setCopiedGenomeStoryFrame(false);
      setCopiedEvidenceChainCard(false);
      setCopiedAiMaterialAuditTable(false);
      setCopiedSummary(false);
      setCopiedTemplate(false);
      setCopiedActionPack(false);
      setCopiedLearningRecord(false);
      setCopiedPlatformConfig(false);
      setCopiedPlatformReview(false);
      setCopiedAiAuditPrompts(false);
      setCopyStatus("科研问题转译卡已复制到剪贴板。");
      window.setTimeout(() => setCopiedResearchQuestionCard(false), 1400);
      return;
    }

    setCopiedResearchQuestionCard(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyAiMaterialAuditTable() {
    if (!aiMaterialAuditTableText) return;
    const copiedToClipboard = await copyText(aiMaterialAuditTableText);
    if (copiedToClipboard) {
      setCopiedAiMaterialAuditTable(true);
      setCopiedResearchQuestionCard(false);
      setCopiedCreationRunRecord(false);
      setCopiedProjectEvidenceTable(false);
      setCopiedBarcodeEvidenceTable(false);
      setCopiedGenomeStoryFrame(false);
      setCopiedEvidenceChainCard(false);
      setCopiedSummary(false);
      setCopiedTemplate(false);
      setCopiedActionPack(false);
      setCopiedLearningRecord(false);
      setCopiedPlatformConfig(false);
      setCopiedPlatformReview(false);
      setCopiedAiAuditPrompts(false);
      setCopyStatus("AI 学习材料质检表已复制到剪贴板。");
      window.setTimeout(() => setCopiedAiMaterialAuditTable(false), 1400);
      return;
    }

    setCopiedAiMaterialAuditTable(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyPlatformPasteConfig() {
    if (!platformPasteConfigText) return;
    const copiedToClipboard = await copyText(platformPasteConfigText);
    if (copiedToClipboard) {
      setCopiedPlatformConfig(true);
      setCopiedBarcodeEvidenceTable(false);
      setCopiedProjectEvidenceTable(false);
      setCopiedCreationRunRecord(false);
      setCopiedResearchQuestionCard(false);
      setCopiedAiMaterialAuditTable(false);
      setCopiedPlatformReview(false);
      setCopiedSummary(false);
      setCopiedTemplate(false);
      setCopiedActionPack(false);
      setCopiedLearningRecord(false);
      setCopiedAiAuditPrompts(false);
      setCopyStatus("平台照填配置已复制到剪贴板。");
      window.setTimeout(() => setCopiedPlatformConfig(false), 1400);
      return;
    }

    setCopiedPlatformConfig(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyPlatformReviewRecord() {
    if (!platformReviewText) return;
    const copiedToClipboard = await copyText(platformReviewText);
    if (copiedToClipboard) {
      setCopiedPlatformReview(true);
      setCopiedBarcodeEvidenceTable(false);
      setCopiedProjectEvidenceTable(false);
      setCopiedCreationRunRecord(false);
      setCopiedResearchQuestionCard(false);
      setCopiedAiMaterialAuditTable(false);
      setCopiedPlatformConfig(false);
      setCopiedSummary(false);
      setCopiedTemplate(false);
      setCopiedActionPack(false);
      setCopiedLearningRecord(false);
      setCopiedAiAuditPrompts(false);
      setCopyStatus("测后复盘记录已复制到剪贴板。");
      window.setTimeout(() => setCopiedPlatformReview(false), 1400);
      return;
    }

    setCopiedPlatformReview(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyAiMaterialAuditPrompts() {
    if (!aiMaterialAuditPromptText) return;
    const copiedToClipboard = await copyText(aiMaterialAuditPromptText);
    if (copiedToClipboard) {
      setCopiedAiAuditPrompts(true);
      setCopiedAiMaterialAuditTable(false);
      setCopiedResearchQuestionCard(false);
      setCopiedCreationRunRecord(false);
      setCopiedProjectEvidenceTable(false);
      setCopiedBarcodeEvidenceTable(false);
      setCopiedGenomeStoryFrame(false);
      setCopiedEvidenceChainCard(false);
      setCopiedPlatformReview(false);
      setCopiedPlatformConfig(false);
      setCopiedSummary(false);
      setCopiedTemplate(false);
      setCopiedActionPack(false);
      setCopiedLearningRecord(false);
      setCopyStatus("AI 质检提示词包已复制到剪贴板。");
      window.setTimeout(() => setCopiedAiAuditPrompts(false), 1400);
      return;
    }

    setCopiedAiAuditPrompts(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  if (!article) {
    return (
      <main id="main-content" tabIndex={-1} style={{ minHeight: "58vh", padding: "5rem 1.5rem", display: "grid", placeItems: "center", fontFamily: "'Nunito', sans-serif" }}>
        <EmptyStateCard
          eyebrow={kind === "note" ? "学习方法" : "科研证据"}
          title="没有找到这篇内容"
          body={`这篇内容可能已经移动。可以回到${kind === "note" ? "学习方法库" : "科研证据库"}，继续浏览最近更新。`}
          href={`/${backHash}`}
          linkText={backText}
          onNavigate={(event) => {
            if (!shouldUseClientNavigation(event)) return;
            event.preventDefault();
            navigateHome(backHash);
          }}
        />
      </main>
    );
  }

  return (
    <main id="main-content" tabIndex={-1} style={{ fontFamily: "'Nunito', sans-serif", background: "var(--background)" }}>
      <section style={{ padding: "0.35rem 1.5rem 1rem" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <article
            className="article-detail-card"
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 8,
              padding: "0.68rem 0.92rem 1rem",
              boxShadow: "0 8px 18px rgba(94,68,42,0.06)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div className="article-meta-row" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: "0.3rem" }}>
              <a
                className="article-detail-link article-back-chip"
                href={`/${backHash}`}
                onClick={(event) => {
                  if (!shouldUseClientNavigation(event)) return;
                  event.preventDefault();
                  navigateHome(backHash);
                }}
                aria-label={backText}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                  color: "var(--cherry-forest)",
                  background: "var(--muted)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 999,
                  textDecoration: "none",
                  fontWeight: 900,
                  fontSize: "0.95rem",
                }}
              >
                ←
              </a>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  background: article.tagBg ?? article.labelBg,
                  color: article.tagColor ?? article.labelColor,
                  borderRadius: 999,
                  padding: "0.18rem 0.62rem",
                  fontSize: "0.74rem",
                  fontWeight: 900,
                }}
              >
                {article.icon} {"tag" in article ? article.tag : article.label}
              </span>
              <span style={{ color: "var(--cherry-warm-mid)", fontWeight: 700 }}>
                {article.date}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--cherry-warm-mid)" }}>
                <IconCoffee size={16} /> 约 {"readTime" in article ? article.readTime : article.readMin} 分钟
              </span>
            </div>

            <h1 style={{ color: "var(--cherry-warm-brown)", fontSize: "clamp(1.12rem, 2.5vw, 1.46rem)", fontWeight: 900, lineHeight: 1.18, marginBottom: "0.32rem", maxWidth: 760 }}>
              {article.title}
            </h1>

            <p style={{ color: "var(--cherry-warm-mid)", fontSize: "0.82rem", lineHeight: 1.5, margin: "0 0 0.5rem", maxWidth: 760, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
              {article.excerpt ?? article.body}
            </p>

            {"platformUrl" in article ? (
              <a
                className="article-detail-link"
                href={platformUrl ?? "#"}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--cherry-forest)",
                  color: "#FAF7F1",
                  borderRadius: 999,
                  padding: "0.48rem 0.9rem",
                  textDecoration: "none",
                  fontWeight: 900,
                  fontSize: "0.82rem",
                  marginBottom: "0.6rem",
                }}
              >
                打开平台：scifusion.top
              </a>
            ) : null}

            {articleOutcomeSnapshot.length ? (
              <div className="article-outcome-snapshot article-reading-task-pack" style={{ background: "var(--muted)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.42rem 0.52rem", marginBottom: "0.56rem", display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "0.52rem", alignItems: "center" }}>
                <div style={{ minWidth: 0, display: "grid", gap: "0.18rem" }}>
                  <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.8rem" }}>读完带走</div>
                  <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.34, fontWeight: 800, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                    先读正文，再填写记录和复制材料。
                  </div>
                </div>
                <div className="article-outcome-actions" style={{ display: "inline-flex", gap: "0.38rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <button type="button" className="article-start-action-button" onClick={focusArticleStart} aria-label={`开始执行${article.title}。先做这个，${articleQuickStart?.step ?? actionSteps[0] ?? "阅读正文要点"}`} style={{ background: "var(--cherry-red)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.34rem 0.68rem", fontWeight: 900, cursor: "pointer", fontSize: "0.72rem", whiteSpace: "nowrap" }}>
                    开始执行
                  </button>
                  <button type="button" onClick={copyLearningRecord} aria-label={`复制${article.title}的学习记录`} aria-describedby="article-summary-copy-status" style={{ background: "var(--card)", color: "var(--cherry-forest)", border: "1.5px solid rgba(58,92,62,0.22)", borderRadius: 999, padding: "0.32rem 0.66rem", fontWeight: 900, cursor: "pointer", fontSize: "0.72rem", whiteSpace: "nowrap" }}>
                    {copiedLearningRecord ? "已复制记录" : "复制学习记录"}
                  </button>
                </div>
              </div>
            ) : null}

            <div id="article-body-points" tabIndex={-1} style={{ display: "grid", gap: "0.5rem", marginBottom: "0.78rem" }}>
              <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem" }}>正文要点</div>
              {article.paragraphs.map((paragraph, index) => (
                <div key={paragraph} style={{ display: "grid", gridTemplateColumns: "24px minmax(0, 1fr)", gap: 8, alignItems: "start", background: "var(--muted)", border: "1px solid rgba(94,68,42,0.08)", borderRadius: 8, padding: "0.56rem" }}>
                  <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: "50%", background: article.tagBg ?? article.labelBg, color: article.tagColor ?? article.labelColor, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 900 }}>
                    {index + 1}
                  </span>
                  <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.62, fontSize: "0.86rem", margin: 0 }}>
                    {paragraph}
                  </p>
                </div>
              ))}
            </div>

            {articleQuickStart ? (
              <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 12, padding: "0.72rem", marginBottom: "0.85rem", display: "grid", gap: "0.58rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ color: "var(--cherry-red)", fontWeight: 900, fontSize: "0.72rem" }}>先做这个</span>
                  <span style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.86rem", lineHeight: 1.45 }}>{articleQuickStart.step}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.5rem" }}>
                  <div style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.55rem" }}>
                    <span style={{ display: "block", color: "var(--cherry-forest)", fontSize: "0.68rem", fontWeight: 900, marginBottom: "0.16rem" }}>完成后检查</span>
                    <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.5, fontWeight: 800 }}>{articleQuickStart.check}</span>
                  </div>
                  <div style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.55rem" }}>
                    <span style={{ display: "block", color: "var(--cherry-red)", fontSize: "0.68rem", fontWeight: 900, marginBottom: "0.16rem" }}>先避开</span>
                    <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.5, fontWeight: 800 }}>{articleQuickStart.pitfall}</span>
                  </div>
                </div>
              </div>
            ) : null}

            {evidenceChainBuilderEnabled ? (
              <div className="plant-evidence-chain-builder" style={{ background: "var(--card)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 12, padding: "0.82rem", marginBottom: "0.9rem", display: "grid", gap: "0.7rem", boxShadow: "0 8px 18px rgba(94,68,42,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem" }}>证据四格卡</div>
                    <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.5, marginTop: "0.16rem", fontWeight: 800 }}>
                      把植物基因组材料压缩成现象、证据、解释和限制，避免把相关线索写成因果结论。
                    </div>
                  </div>
                  <span style={{ background: evidenceChainScore === 4 ? "var(--cherry-sage-light)" : "var(--cherry-yellow-light)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 999, padding: "0.26rem 0.62rem", color: evidenceChainScore === 4 ? "var(--cherry-forest)" : "var(--cherry-warm-brown)", fontSize: "0.72rem", fontWeight: 900 }}>
                    完成度 {evidenceChainScore}/4
                  </span>
                </div>
                <div className="plant-evidence-chain-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.62rem" }}>
                  {evidenceChainFields.map((field) => (
                    <label key={field.id} htmlFor={field.id} style={{ display: "grid", gap: "0.34rem", color: "var(--cherry-warm-brown)", fontSize: "0.76rem", fontWeight: 900 }}>
                      {field.label}
                      <textarea
                        id={field.id}
                        value={field.value}
                        placeholder={field.placeholder}
                        rows={3}
                        onChange={(event) => {
                          field.setValue(event.currentTarget.value);
                          setCopiedEvidenceChainCard(false);
                          setCopyStatus("");
                        }}
                        style={{ border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.58rem 0.66rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800, lineHeight: 1.55, resize: "vertical" }}
                      />
                      <span style={{ color: field.pass ? "var(--cherry-forest)" : "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.45, fontWeight: 800 }}>
                        {field.pass ? "可用" : field.help}
                      </span>
                    </label>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "0.7rem", alignItems: "start" }}>
                  <code style={{ display: "block", whiteSpace: "pre-wrap", maxHeight: 220, overflow: "auto", background: "var(--cherry-sage-light)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.66rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.7rem", lineHeight: 1.58 }}>
                    {evidenceChainCardText}
                  </code>
                  <button type="button" onClick={copyEvidenceChainCard} aria-describedby="article-summary-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.42rem 0.76rem", fontWeight: 900, cursor: "pointer", fontSize: "0.76rem", whiteSpace: "nowrap" }}>
                    {copiedEvidenceChainCard ? "已复制" : "复制四格卡"}
                  </button>
                </div>
              </div>
            ) : null}

            {genomeStoryBuilderEnabled ? (
              <div className="genome-story-frame-builder" style={{ background: "var(--card)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 12, padding: "0.82rem", marginBottom: "0.9rem", display: "grid", gap: "0.7rem", boxShadow: "0 8px 18px rgba(94,68,42,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem" }}>科学故事骨架</div>
                    <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.5, marginTop: "0.16rem", fontWeight: 800 }}>
                      把组装、注释和比较图表放回同一个主问题，避免把流程步骤当成故事主线。
                    </div>
                  </div>
                  <span style={{ background: genomeStoryScore === 6 ? "var(--cherry-sage-light)" : "var(--cherry-yellow-light)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 999, padding: "0.26rem 0.62rem", color: genomeStoryScore === 6 ? "var(--cherry-forest)" : "var(--cherry-warm-brown)", fontSize: "0.72rem", fontWeight: 900 }}>
                    完成度 {genomeStoryScore}/6
                  </span>
                </div>
                <div className="genome-story-frame-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.62rem" }}>
                  {genomeStoryFields.map((field) => (
                    <label key={field.id} htmlFor={field.id} style={{ display: "grid", gap: "0.34rem", color: "var(--cherry-warm-brown)", fontSize: "0.76rem", fontWeight: 900 }}>
                      {field.label}
                      <textarea
                        id={field.id}
                        value={field.value}
                        placeholder={field.placeholder}
                        rows={3}
                        onChange={(event) => {
                          field.setValue(event.currentTarget.value);
                          setCopiedGenomeStoryFrame(false);
                          setCopyStatus("");
                        }}
                        style={{ border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.58rem 0.66rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800, lineHeight: 1.55, resize: "vertical" }}
                      />
                      <span style={{ color: field.pass ? "var(--cherry-forest)" : "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.45, fontWeight: 800 }}>
                        {field.pass ? "可用" : field.help}
                      </span>
                    </label>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "0.7rem", alignItems: "start" }}>
                  <code style={{ display: "block", whiteSpace: "pre-wrap", maxHeight: 240, overflow: "auto", background: "var(--cherry-sage-light)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.66rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.7rem", lineHeight: 1.58 }}>
                    {genomeStoryFrameText}
                  </code>
                  <button type="button" onClick={copyGenomeStoryFrame} aria-describedby="article-summary-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.42rem 0.76rem", fontWeight: 900, cursor: "pointer", fontSize: "0.76rem", whiteSpace: "nowrap" }}>
                    {copiedGenomeStoryFrame ? "已复制" : "复制骨架"}
                  </button>
                </div>
              </div>
            ) : null}

            {barcodeEvidenceBuilderEnabled ? (
              <div className="barcode-evidence-table-builder" style={{ background: "var(--card)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 12, padding: "0.82rem", marginBottom: "0.9rem", display: "grid", gap: "0.7rem", boxShadow: "0 8px 18px rgba(94,68,42,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem" }}>鉴定证据链表</div>
                    <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.5, marginTop: "0.16rem", fontWeight: 800 }}>
                      把样本、实验、序列、BLAST、树图和结论边界串起来，避免把最高匹配直接当最终答案。
                    </div>
                  </div>
                  <span style={{ background: barcodeEvidenceScore === 6 ? "var(--cherry-sage-light)" : "var(--cherry-yellow-light)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 999, padding: "0.26rem 0.62rem", color: barcodeEvidenceScore === 6 ? "var(--cherry-forest)" : "var(--cherry-warm-brown)", fontSize: "0.72rem", fontWeight: 900 }}>
                    完成度 {barcodeEvidenceScore}/6
                  </span>
                </div>
                <div className="barcode-evidence-table-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.62rem" }}>
                  {barcodeEvidenceFields.map((field) => (
                    <label key={field.id} htmlFor={field.id} style={{ display: "grid", gap: "0.34rem", color: "var(--cherry-warm-brown)", fontSize: "0.76rem", fontWeight: 900 }}>
                      {field.label}
                      <textarea
                        id={field.id}
                        value={field.value}
                        placeholder={field.placeholder}
                        rows={3}
                        onChange={(event) => {
                          field.setValue(event.currentTarget.value);
                          setCopiedBarcodeEvidenceTable(false);
                          setCopyStatus("");
                        }}
                        style={{ border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.58rem 0.66rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800, lineHeight: 1.55, resize: "vertical" }}
                      />
                      <span style={{ color: field.pass ? "var(--cherry-forest)" : "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.45, fontWeight: 800 }}>
                        {field.pass ? "可用" : field.help}
                      </span>
                    </label>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "0.7rem", alignItems: "start" }}>
                  <code style={{ display: "block", whiteSpace: "pre-wrap", maxHeight: 240, overflow: "auto", background: "var(--cherry-sage-light)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.66rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.7rem", lineHeight: 1.58 }}>
                    {barcodeEvidenceTableText}
                  </code>
                  <button type="button" onClick={copyBarcodeEvidenceTable} aria-describedby="article-summary-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.42rem 0.76rem", fontWeight: 900, cursor: "pointer", fontSize: "0.76rem", whiteSpace: "nowrap" }}>
                    {copiedBarcodeEvidenceTable ? "已复制" : "复制证据链表"}
                  </button>
                </div>
              </div>
            ) : null}

            {projectEvidenceBuilderEnabled ? (
              <div className="project-evidence-table-builder" style={{ background: "var(--card)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 12, padding: "0.82rem", marginBottom: "0.9rem", display: "grid", gap: "0.7rem", boxShadow: "0 8px 18px rgba(94,68,42,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem" }}>项目证据表</div>
                    <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.5, marginTop: "0.16rem", fontWeight: 800 }}>
                      把驱动问题、最终作品、任务节点、过程证据、评价量规和修订记录对齐，避免活动很多但作品不能证明理解。
                    </div>
                  </div>
                  <span style={{ background: projectEvidenceScore === 6 ? "var(--cherry-sage-light)" : "var(--cherry-yellow-light)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 999, padding: "0.26rem 0.62rem", color: projectEvidenceScore === 6 ? "var(--cherry-forest)" : "var(--cherry-warm-brown)", fontSize: "0.72rem", fontWeight: 900 }}>
                    完成度 {projectEvidenceScore}/6
                  </span>
                </div>
                <div className="project-evidence-table-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.62rem" }}>
                  {projectEvidenceFields.map((field) => (
                    <label key={field.id} htmlFor={field.id} style={{ display: "grid", gap: "0.34rem", color: "var(--cherry-warm-brown)", fontSize: "0.76rem", fontWeight: 900 }}>
                      {field.label}
                      <textarea
                        id={field.id}
                        value={field.value}
                        placeholder={field.placeholder}
                        rows={3}
                        onChange={(event) => {
                          field.setValue(event.currentTarget.value);
                          setCopiedProjectEvidenceTable(false);
                          setCopyStatus("");
                        }}
                        style={{ border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.58rem 0.66rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800, lineHeight: 1.55, resize: "vertical" }}
                      />
                      <span style={{ color: field.pass ? "var(--cherry-forest)" : "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.45, fontWeight: 800 }}>
                        {field.pass ? "可用" : field.help}
                      </span>
                    </label>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "0.7rem", alignItems: "start" }}>
                  <code style={{ display: "block", whiteSpace: "pre-wrap", maxHeight: 240, overflow: "auto", background: "var(--cherry-sage-light)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.66rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.7rem", lineHeight: 1.58 }}>
                    {projectEvidenceTableText}
                  </code>
                  <button type="button" onClick={copyProjectEvidenceTable} aria-describedby="article-summary-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.42rem 0.76rem", fontWeight: 900, cursor: "pointer", fontSize: "0.76rem", whiteSpace: "nowrap" }}>
                    {copiedProjectEvidenceTable ? "已复制" : "复制项目证据表"}
                  </button>
                </div>
              </div>
            ) : null}

            {creationRunBuilderEnabled ? (
              <div className="creation-run-record-builder" style={{ background: "var(--card)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 12, padding: "0.82rem", marginBottom: "0.9rem", display: "grid", gap: "0.7rem", boxShadow: "0 8px 18px rgba(94,68,42,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem" }}>AI 创作生成记录表</div>
                    <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.5, marginTop: "0.16rem", fontWeight: 800 }}>
                      把场景、角色、镜头、资产提示、失败原因和剪辑检查留成记录，避免每次生成都重新试错。
                    </div>
                  </div>
                  <span style={{ background: creationRunScore === 6 ? "var(--cherry-sage-light)" : "var(--cherry-yellow-light)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 999, padding: "0.26rem 0.62rem", color: creationRunScore === 6 ? "var(--cherry-forest)" : "var(--cherry-warm-brown)", fontSize: "0.72rem", fontWeight: 900 }}>
                    完成度 {creationRunScore}/6
                  </span>
                </div>
                <div className="creation-run-record-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.62rem" }}>
                  {creationRunFields.map((field) => (
                    <label key={field.id} htmlFor={field.id} style={{ display: "grid", gap: "0.34rem", color: "var(--cherry-warm-brown)", fontSize: "0.76rem", fontWeight: 900 }}>
                      {field.label}
                      <textarea
                        id={field.id}
                        value={field.value}
                        placeholder={field.placeholder}
                        rows={3}
                        onChange={(event) => {
                          field.setValue(event.currentTarget.value);
                          setCopiedCreationRunRecord(false);
                          setCopyStatus("");
                        }}
                        style={{ border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.58rem 0.66rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800, lineHeight: 1.55, resize: "vertical" }}
                      />
                      <span style={{ color: field.pass ? "var(--cherry-forest)" : "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.45, fontWeight: 800 }}>
                        {field.pass ? "可用" : field.help}
                      </span>
                    </label>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "0.7rem", alignItems: "start" }}>
                  <code style={{ display: "block", whiteSpace: "pre-wrap", maxHeight: 240, overflow: "auto", background: "var(--cherry-sage-light)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.66rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.7rem", lineHeight: 1.58 }}>
                    {creationRunRecordText}
                  </code>
                  <button type="button" onClick={copyCreationRunRecord} aria-describedby="article-summary-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.42rem 0.76rem", fontWeight: 900, cursor: "pointer", fontSize: "0.76rem", whiteSpace: "nowrap" }}>
                    {copiedCreationRunRecord ? "已复制" : "复制生成记录"}
                  </button>
                </div>
              </div>
            ) : null}

            {researchQuestionBuilderEnabled ? (
              <div className="research-question-card-builder" style={{ background: "var(--card)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 12, padding: "0.82rem", marginBottom: "0.9rem", display: "grid", gap: "0.7rem", boxShadow: "0 8px 18px rgba(94,68,42,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem" }}>科研问题转译卡</div>
                    <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.5, marginTop: "0.16rem", fontWeight: 800 }}>
                      把前沿主题改写成从已有经验能进入、能观察比较、能用证据判断的问题，避免只复述前沿术语。
                    </div>
                  </div>
                  <span style={{ background: researchQuestionScore === 6 ? "var(--cherry-sage-light)" : "var(--cherry-yellow-light)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 999, padding: "0.26rem 0.62rem", color: researchQuestionScore === 6 ? "var(--cherry-forest)" : "var(--cherry-warm-brown)", fontSize: "0.72rem", fontWeight: 900 }}>
                    完成度 {researchQuestionScore}/6
                  </span>
                </div>
                <div className="research-question-card-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.62rem" }}>
                  {researchQuestionFields.map((field) => (
                    <label key={field.id} htmlFor={field.id} style={{ display: "grid", gap: "0.34rem", color: "var(--cherry-warm-brown)", fontSize: "0.76rem", fontWeight: 900 }}>
                      {field.label}
                      <textarea
                        id={field.id}
                        value={field.value}
                        placeholder={field.placeholder}
                        rows={3}
                        onChange={(event) => {
                          field.setValue(event.currentTarget.value);
                          setCopiedResearchQuestionCard(false);
                          setCopyStatus("");
                        }}
                        style={{ border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.58rem 0.66rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800, lineHeight: 1.55, resize: "vertical" }}
                      />
                      <span style={{ color: field.pass ? "var(--cherry-forest)" : "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.45, fontWeight: 800 }}>
                        {field.pass ? "可用" : field.help}
                      </span>
                    </label>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "0.7rem", alignItems: "start" }}>
                  <code style={{ display: "block", whiteSpace: "pre-wrap", maxHeight: 240, overflow: "auto", background: "var(--cherry-sage-light)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.66rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.7rem", lineHeight: 1.58 }}>
                    {researchQuestionCardText}
                  </code>
                  <button type="button" onClick={copyResearchQuestionCard} aria-describedby="article-summary-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.42rem 0.76rem", fontWeight: 900, cursor: "pointer", fontSize: "0.76rem", whiteSpace: "nowrap" }}>
                    {copiedResearchQuestionCard ? "已复制" : "复制转译卡"}
                  </button>
                </div>
              </div>
            ) : null}

            {aiMaterialAuditBuilderEnabled ? (
              <div className="ai-material-audit-table-builder" style={{ background: "var(--card)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 12, padding: "0.82rem", marginBottom: "0.9rem", display: "grid", gap: "0.7rem", boxShadow: "0 8px 18px rgba(94,68,42,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem" }}>AI 学习材料质检表</div>
                    <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.5, marginTop: "0.16rem", fontWeight: 800 }}>
                      把学习目标、资料边界、误解、练习、证据和复盘动作拆开检查，避免把 AI 输出直接当成理解。
                    </div>
                  </div>
                  <span style={{ background: aiMaterialAuditScore === 6 ? "var(--cherry-sage-light)" : "var(--cherry-yellow-light)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 999, padding: "0.26rem 0.62rem", color: aiMaterialAuditScore === 6 ? "var(--cherry-forest)" : "var(--cherry-warm-brown)", fontSize: "0.72rem", fontWeight: 900 }}>
                    完成度 {aiMaterialAuditScore}/6
                  </span>
                </div>
                <div className="ai-material-audit-table-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.62rem" }}>
                  {aiMaterialAuditFields.map((field) => (
                    <label key={field.id} htmlFor={field.id} style={{ display: "grid", gap: "0.34rem", color: "var(--cherry-warm-brown)", fontSize: "0.76rem", fontWeight: 900 }}>
                      {field.label}
                      <textarea
                        id={field.id}
                        value={field.value}
                        placeholder={field.placeholder}
                        rows={3}
                        onChange={(event) => {
                          field.setValue(event.currentTarget.value);
                          setCopiedAiMaterialAuditTable(false);
                          setCopyStatus("");
                        }}
                        style={{ border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.58rem 0.66rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800, lineHeight: 1.55, resize: "vertical" }}
                      />
                      <span style={{ color: field.pass ? "var(--cherry-forest)" : "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.45, fontWeight: 800 }}>
                        {field.pass ? "可用" : field.help}
                      </span>
                    </label>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "0.7rem", alignItems: "start" }}>
                  <code style={{ display: "block", whiteSpace: "pre-wrap", maxHeight: 240, overflow: "auto", background: "var(--cherry-sage-light)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.66rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.7rem", lineHeight: 1.58 }}>
                    {aiMaterialAuditTableText}
                  </code>
                  <button type="button" onClick={copyAiMaterialAuditTable} aria-describedby="article-summary-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.42rem 0.76rem", fontWeight: 900, cursor: "pointer", fontSize: "0.76rem", whiteSpace: "nowrap" }}>
                    {copiedAiMaterialAuditTable ? "已复制" : "复制质检表"}
                  </button>
                </div>
              </div>
            ) : null}

            {platformUsePlans.length ? (
              <div style={{ background: "var(--muted)", border: "1.5px solid rgba(94,68,42,0.1)", borderRadius: 16, padding: "0.85rem", marginBottom: "0.9rem", display: "grid", gap: "0.68rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem" }}>平台速用卡</div>
                    <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.5, marginTop: "0.18rem", fontWeight: 800 }}>
                      先选一个用途，把字段照填进平台，再用审核重点检查生成结果。
                    </div>
                  </div>
                  <a className="article-detail-link" href={platformUrl ?? "#"} target="_blank" rel="noreferrer" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", borderRadius: 999, padding: "0.36rem 0.72rem", textDecoration: "none", fontWeight: 900, fontSize: "0.74rem" }}>
                    进入 scifusion.top
                  </a>
                </div>
                <div role="group" aria-label="选择 SciFusion 使用场景" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.58rem" }}>
                  {platformUsePlans.map((plan, index) => {
                    const selected = index === selectedPlatformPlanIndex;

                    return (
                    <button key={plan.title} type="button" className="platform-plan-button" aria-pressed={selected} onClick={() => { setSelectedPlatformPlanIndex(index); setCopiedPlatformConfig(false); setCopiedPlatformReview(false); setCopyStatus(""); }} style={{ textAlign: "left", background: selected ? "var(--cherry-yellow-light)" : "var(--card)", border: selected ? "1.5px solid var(--cherry-yellow)" : "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.68rem", display: "grid", gap: "0.48rem", cursor: "pointer", boxShadow: selected ? "3px 5px 0 rgba(94,68,42,0.08)" : "none" }}>
                      <strong style={{ color: "var(--cherry-forest)", fontSize: "0.8rem" }}>{plan.title}</strong>
                      <span style={{ color: "var(--cherry-red)", fontSize: "0.68rem", fontWeight: 900 }}>照填配置</span>
                      <div style={{ display: "grid", gap: "0.3rem" }}>
                        {plan.fields.map((field) => (
                          <span key={field} style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.48, fontWeight: 800 }}>{field}</span>
                        ))}
                      </div>
                      <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.74rem", lineHeight: 1.5, fontWeight: 900 }}>{plan.output}</span>
                    </button>
                    );
                  })}
                </div>
                {platformTopicTemplates.length ? (
                  <div className="platform-topic-template-panel" style={{ background: "var(--card)", border: "1.5px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.75rem", display: "grid", gap: "0.65rem" }}>
                    <div>
                      <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.84rem" }}>常用主题照填包</div>
                      <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.5, marginTop: "0.18rem", fontWeight: 800 }}>
                        选择一个主题，自动填入学习阶段、知识点范围、目标、题量和时间。
                      </div>
                    </div>
                    <div className="platform-topic-template-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.55rem" }}>
                      {platformTopicTemplates.map((template) => (
                        <button key={template.title} type="button" onClick={() => applyPlatformTopicTemplate(template)} aria-describedby="article-summary-copy-status" style={{ textAlign: "left", background: "var(--muted)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.65rem", display: "grid", gap: "0.34rem", cursor: "pointer" }}>
                          <strong style={{ color: "var(--cherry-forest)", fontSize: "0.78rem" }}>{template.title}</strong>
                          <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.72rem", lineHeight: 1.42, fontWeight: 900 }}>{template.learningGoal}</span>
                          <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.7rem", lineHeight: 1.45, fontWeight: 800 }}>{template.auditFocus}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                {activePlatformPlan ? (
                  <div className="platform-active-plan-grid" style={{ background: "var(--card)", border: "1.5px solid rgba(58,92,62,0.18)", borderRadius: 8, padding: "0.75rem", display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(210px, 0.72fr)", gap: "0.75rem" }}>
                    <div>
                      <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.82rem", marginBottom: "0.42rem" }}>当前方案：{activePlatformPlan.title}</div>
                      <div style={{ display: "grid", gap: "0.34rem" }}>
                        {activePlatformPlan.fields.map((field, index) => (
                          <div key={field} style={{ display: "grid", gridTemplateColumns: "22px minmax(0, 1fr)", gap: 8, alignItems: "start" }}>
                            <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--cherry-forest)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.66rem", fontWeight: 900 }}>{index + 1}</span>
                            <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.77rem", lineHeight: 1.52, fontWeight: 800 }}>{field}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ background: "var(--cherry-sage-light)", border: "1px solid rgba(58,92,62,0.16)", borderRadius: 8, padding: "0.62rem" }}>
                      <div style={{ color: "var(--cherry-forest)", fontWeight: 900, fontSize: "0.76rem", marginBottom: "0.38rem" }}>生成后先查这 3 项</div>
                      <div style={{ display: "grid", gap: "0.36rem" }}>
                        {activePlatformPlan.audit.map((item) => (
                          <div key={item} style={{ display: "grid", gridTemplateColumns: "18px minmax(0, 1fr)", gap: 7, alignItems: "start" }}>
                            <IconCheck size={15} color="var(--cherry-forest)" />
                            <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.75rem", lineHeight: 1.5, fontWeight: 800 }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
                {platformQuestionAuditRubric.length ? (
                  <div style={{ background: "var(--card)", border: "1.5px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.75rem", display: "grid", gap: "0.65rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.7rem", alignItems: "center", flexWrap: "wrap" }}>
                      <div>
                        <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.84rem" }}>生成后逐题验收</div>
                        <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.5, marginTop: "0.18rem", fontWeight: 800 }}>
                          题目不是越多越好。每道题先过题干、答案、干扰项和解析四关，再决定保留。
                        </div>
                      </div>
                      <span style={{ background: "var(--cherry-peach-light)", border: "1.5px solid rgba(214,91,74,0.24)", borderRadius: 999, padding: "0.26rem 0.62rem", color: "var(--cherry-red)", fontSize: "0.72rem", fontWeight: 900 }}>
                        4 项量规
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.55rem" }}>
                      {platformQuestionAuditRubric.map((item, index) => (
                        <div key={item.title} style={{ background: index % 2 === 0 ? "var(--cherry-yellow-light)" : "var(--cherry-blue-light)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.62rem", display: "grid", gap: "0.34rem", minHeight: 142 }}>
                          <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--cherry-forest)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.66rem", fontWeight: 900 }}>{index + 1}</span>
                          <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.78rem" }}>{item.title}</strong>
                          <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.5, fontWeight: 800 }}>通过：{item.pass}</span>
                          <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.7rem", lineHeight: 1.48, fontWeight: 900 }}>处理：{item.fix}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: "var(--cherry-sage-light)", border: "1px solid rgba(58,92,62,0.16)", borderRadius: 8, padding: "0.62rem", display: "grid", gap: "0.42rem" }}>
                      <strong style={{ color: "var(--cherry-forest)", fontSize: "0.76rem" }}>错因标签</strong>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.36rem" }}>
                        {platformWrongReasonTags.map((tag) => (
                          <span key={tag} style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 999, padding: "0.18rem 0.52rem", color: "var(--cherry-warm-brown)", fontSize: "0.7rem", fontWeight: 900 }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
                {activePlatformPlan ? (
                  <div className="platform-custom-config-grid" style={{ background: "var(--card)", border: "1.5px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.75rem", display: "grid", gap: "0.65rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.7rem", flexWrap: "wrap" }}>
                      <div>
                        <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.84rem" }}>我的照填配置</div>
                        <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.5, marginTop: "0.18rem", fontWeight: 800 }}>
                          把当前要测的主题写清楚，再复制到平台。目标要写成自己能完成的动作。
                        </div>
                      </div>
                      <span style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 999, padding: "0.26rem 0.62rem", color: "var(--cherry-warm-brown)", fontSize: "0.72rem", fontWeight: 900 }}>
                        {activePlatformPlan.title}
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.58rem" }}>
                      <label style={{ display: "grid", gap: 5, color: "var(--cherry-warm-brown)", fontSize: "0.74rem", fontWeight: 900 }}>
                        学习阶段
                        <input value={platformLearnerLevel} onChange={(event) => { setPlatformLearnerLevel(event.target.value); setCopiedPlatformConfig(false); setCopiedPlatformReview(false); setCopyStatus(""); }} style={{ border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.52rem 0.62rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800 }} />
                      </label>
                      <label style={{ display: "grid", gap: 5, color: "var(--cherry-warm-brown)", fontSize: "0.74rem", fontWeight: 900 }}>
                        题量
                        <input value={platformQuestionCount} onChange={(event) => { setPlatformQuestionCount(event.target.value); setCopiedPlatformConfig(false); setCopiedPlatformReview(false); setCopyStatus(""); }} style={{ border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.52rem 0.62rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800 }} />
                      </label>
                      <label style={{ display: "grid", gap: 5, color: "var(--cherry-warm-brown)", fontSize: "0.74rem", fontWeight: 900 }}>
                        知识点范围
                        <input value={platformKnowledgeRange} onChange={(event) => { setPlatformKnowledgeRange(event.target.value); setCopiedPlatformConfig(false); setCopiedPlatformReview(false); setCopyStatus(""); }} style={{ border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.52rem 0.62rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800 }} />
                      </label>
                      <label style={{ display: "grid", gap: 5, color: "var(--cherry-warm-brown)", fontSize: "0.74rem", fontWeight: 900 }}>
                        预计完成时间
                        <input value={platformTimeBudget} onChange={(event) => { setPlatformTimeBudget(event.target.value); setCopiedPlatformConfig(false); setCopiedPlatformReview(false); setCopyStatus(""); }} style={{ border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.52rem 0.62rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800 }} />
                      </label>
                      <label style={{ display: "grid", gap: 5, color: "var(--cherry-warm-brown)", fontSize: "0.74rem", fontWeight: 900, gridColumn: "1 / -1" }}>
                        测评目标
                        <textarea value={platformLearningGoal} onChange={(event) => { setPlatformLearningGoal(event.target.value); setCopiedPlatformConfig(false); setCopiedPlatformReview(false); setCopyStatus(""); }} rows={2} style={{ border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.52rem 0.62rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800, resize: "vertical" }} />
                      </label>
                      <label style={{ display: "grid", gap: 5, color: "var(--cherry-warm-brown)", fontSize: "0.74rem", fontWeight: 900, gridColumn: "1 / -1" }}>
                        审核重点
                        <textarea value={platformAuditFocus} onChange={(event) => { setPlatformAuditFocus(event.target.value); setCopiedPlatformConfig(false); setCopiedPlatformReview(false); setCopyStatus(""); }} rows={2} style={{ border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.52rem 0.62rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800, resize: "vertical" }} />
                      </label>
                    </div>
                    <div style={{ background: "var(--cherry-blue-light)", border: "1px solid rgba(85,137,179,0.18)", borderRadius: 8, padding: "0.62rem", display: "grid", gap: "0.34rem" }}>
                      <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.76rem" }}>即将复制到平台的字段</strong>
                      {platformCustomConfigItems.map((item) => (
                        <span key={item} style={{ color: "var(--cherry-warm-mid)", fontSize: "0.73rem", lineHeight: 1.46, fontWeight: 800 }}>{item}</span>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.58rem" }}>
                  <div style={{ background: "var(--card)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.68rem", display: "grid", gap: "0.48rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.6rem", flexWrap: "wrap" }}>
                      <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.8rem" }}>平台照填文本</strong>
                      <button type="button" onClick={copyPlatformPasteConfig} aria-describedby="article-summary-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.34rem 0.68rem", fontWeight: 900, cursor: "pointer", fontSize: "0.74rem" }}>
                        {copiedPlatformConfig ? "已复制" : "复制照填配置"}
                      </button>
                    </div>
                    <code style={{ display: "block", whiteSpace: "pre-wrap", maxHeight: 210, overflow: "auto", background: "var(--cherry-yellow-light)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.62rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.72rem", lineHeight: 1.62 }}>
                      {platformPasteConfigText}
                    </code>
                  </div>
                  <div style={{ background: "var(--card)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.68rem", display: "grid", gap: "0.48rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.6rem", flexWrap: "wrap" }}>
                      <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.8rem" }}>测后复盘表</strong>
                      <button type="button" onClick={copyPlatformReviewRecord} aria-describedby="article-summary-copy-status" style={{ background: "var(--cherry-red)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.34rem 0.68rem", fontWeight: 900, cursor: "pointer", fontSize: "0.74rem" }}>
                        {copiedPlatformReview ? "已复制" : "复制复盘表"}
                      </button>
                    </div>
                    <code style={{ display: "block", whiteSpace: "pre-wrap", maxHeight: 210, overflow: "auto", background: "var(--cherry-sage-light)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.62rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.72rem", lineHeight: 1.62 }}>
                      {platformReviewText}
                    </code>
                  </div>
                </div>
              </div>
            ) : null}

            {aiMaterialAuditPrompts.length ? (
              <div style={{ background: "var(--cherry-blue-light)", border: "1.5px solid rgba(85,137,179,0.22)", borderRadius: 16, padding: "0.85rem", marginBottom: "0.9rem", display: "grid", gap: "0.68rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem" }}>AI 质检提示词包</div>
                    <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.5, marginTop: "0.18rem", fontWeight: 800 }}>
                      拿到 AI 生成的学习材料后，先跑这四个检查，再决定保留、重写或回到资料核查。
                    </div>
                  </div>
                  <button type="button" onClick={copyAiMaterialAuditPrompts} aria-describedby="article-summary-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.38rem 0.72rem", fontWeight: 900, cursor: "pointer", fontSize: "0.74rem" }}>
                    {copiedAiAuditPrompts ? "已复制" : "复制质检提示词"}
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.58rem" }}>
                  {aiMaterialAuditPrompts.map((item, index) => (
                    <div key={item.title} style={{ background: "var(--card)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.68rem", display: "grid", gap: "0.42rem" }}>
                      <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--cherry-blue)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 900 }}>
                        {index + 1}
                      </span>
                      <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.8rem" }}>{item.title}</strong>
                      <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.52, fontWeight: 800 }}>{item.prompt}</span>
                      <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.72rem", lineHeight: 1.48, fontWeight: 900 }}>检查产出：{item.output}</span>
                    </div>
                  ))}
                </div>
                <code style={{ display: "block", whiteSpace: "pre-wrap", maxHeight: 220, overflow: "auto", background: "rgba(250,247,241,0.72)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.68rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.72rem", lineHeight: 1.62 }}>
                  {aiMaterialAuditPromptText}
                </code>
              </div>
            ) : null}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.6rem", marginBottom: "0.9rem" }}>
              {readingPath.map((item, index) => (
                <div key={item.label} style={{ background: "var(--muted)", border: "1.5px solid rgba(94,68,42,0.08)", borderRadius: 14, padding: "0.7rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: "0.3rem" }}>
                    <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: "50%", background: article.tagBg ?? article.labelBg, color: article.tagColor ?? article.labelColor, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 900 }}>
                      {index + 1}
                    </span>
                    <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.8rem" }}>{item.label}</strong>
                  </div>
                  <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.55, fontSize: "0.78rem", margin: 0, fontWeight: 800 }}>
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            {pairedWorks.length ? (
              <div className="article-paired-work-panel" style={{ marginBottom: "0.9rem", display: "grid", gap: "0.38rem" }}>
                <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem" }}>配套模块</div>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 0 }}>
                  {pairedWorks.map((work) => {
                    const toolHref = getWorkToolHref(work.href);
                    return (
                    <li key={work.slug}>
                      <a
                        className="article-paired-work-link"
                        href={toolHref}
                        aria-label={`打开配套模块：${work.title}`}
                        onMouseEnter={() => preloadRouteForHref(toolHref)}
                        onFocus={() => preloadRouteForHref(toolHref)}
                        onPointerDown={() => preloadRouteForHref(toolHref)}
                        onClick={(event) => {
                          if (!shouldUseClientNavigation(event)) return;
                          event.preventDefault();
                          navigateToPath(toolHref);
                        }}
                        style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "0.7rem", alignItems: "center", borderTop: "1px solid rgba(94,68,42,0.1)", padding: "0.52rem 0", color: "inherit", textDecoration: "none", minWidth: 0 }}
                      >
                        <span style={{ minWidth: 0, display: "grid", gap: "0.18rem" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, flexWrap: "wrap" }}>
                            <span style={{ color: "var(--cherry-forest)", fontSize: "0.66rem", fontWeight: 900 }}>{work.category}</span>
                            <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.84rem", lineHeight: 1.32, fontWeight: 900, overflowWrap: "anywhere" }}>{work.title}</strong>
                          </span>
                          <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.36, fontWeight: 800, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                            {work.starter}
                          </span>
                        </span>
                        <span style={{ color: "var(--cherry-forest)", fontSize: "0.72rem", fontWeight: 900, whiteSpace: "nowrap" }}>打开 →</span>
                      </a>
                    </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            {actionSteps.length ? (
              <div id="article-primary-action" tabIndex={-1} style={{ background: "var(--cherry-sage-light)", border: "1.5px solid rgba(93,140,101,0.22)", borderRadius: 16, padding: "0.85rem", marginBottom: "0.9rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
                  <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem" }}>上手步骤</div>
                  <button type="button" onClick={copyActionPack} aria-label={`复制${article.title}的行动包`} aria-describedby="article-summary-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.34rem 0.68rem", fontWeight: 900, cursor: "pointer", fontSize: "0.74rem" }}>
                    {copiedActionPack ? "已复制" : "复制行动包"}
                  </button>
                </div>
                <div style={{ display: "grid", gap: "0.55rem" }}>
                  {actionSteps.map((step, index) => (
                    <div key={step} style={{ display: "grid", gridTemplateColumns: "26px minmax(0, 1fr)", gap: 9, alignItems: "start" }}>
                      <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--cherry-forest)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 900 }}>
                        {index + 1}
                      </span>
                      <span style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.62, fontSize: "0.86rem", fontWeight: 800 }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {checklist.length ? (
              <div style={{ background: "var(--muted)", border: "1.5px solid rgba(94,68,42,0.08)", borderRadius: 16, padding: "0.85rem", marginBottom: "0.9rem" }}>
                <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem", marginBottom: "0.65rem" }}>检查清单</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.55rem" }}>
                  {checklist.map((item) => (
                    <div key={item} style={{ display: "grid", gridTemplateColumns: "20px minmax(0, 1fr)", gap: 8, alignItems: "start", background: "var(--card)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.62rem" }}>
                      <IconCheck size={16} color="var(--cherry-forest)" />
                      <span style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.55, fontSize: "0.8rem", fontWeight: 800 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {pitfalls.length ? (
              <div style={{ background: "var(--cherry-peach-light)", border: "1.5px solid rgba(181,80,51,0.18)", borderRadius: 16, padding: "0.85rem", marginBottom: "0.9rem" }}>
                <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem", marginBottom: "0.65rem" }}>避坑提醒</div>
                <div style={{ display: "grid", gap: "0.55rem" }}>
                  {pitfalls.map((item, index) => (
                    <div key={item} style={{ display: "grid", gridTemplateColumns: "24px minmax(0, 1fr)", gap: 9, alignItems: "start", background: "rgba(250,247,241,0.72)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.62rem" }}>
                      <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--cherry-red)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 900 }}>
                        {index + 1}
                      </span>
                      <span style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.55, fontSize: "0.8rem", fontWeight: 800 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {starterTemplate.length ? (
              <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 16, padding: "0.85rem", marginBottom: "0.9rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
                  <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem" }}>可套用模板</div>
                  <button type="button" onClick={copyTemplateText} aria-label={`复制${article.title}的可套用模板`} aria-describedby="article-summary-copy-status" style={{ background: "var(--card)", color: "var(--cherry-forest)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 999, padding: "0.34rem 0.68rem", fontWeight: 900, cursor: "pointer", fontSize: "0.74rem" }}>
                    {copiedTemplate ? "已复制" : "复制模板"}
                  </button>
                </div>
                <code style={{ display: "block", whiteSpace: "pre-wrap", background: "rgba(250,247,241,0.72)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.72rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.78rem", lineHeight: 1.7 }}>
                  {starterTemplateText}
                </code>
              </div>
            ) : null}

            {articleRecordFields.length ? (
              <div style={{ background: "var(--card)", border: "1.5px solid rgba(58,92,62,0.18)", borderRadius: 16, padding: "0.9rem", marginBottom: "0.9rem", display: "grid", gap: "0.68rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem" }}>读完填写</div>
                    <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.5, marginTop: "0.18rem", fontWeight: 800 }}>
                      边读边写 4 句话，复制学习记录时会带上这些内容。
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.46rem", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ background: articleRecordScore === 4 ? "var(--cherry-sage-light)" : "var(--cherry-yellow-light)", border: articleRecordScore === 4 ? "1.5px solid rgba(58,92,62,0.2)" : "1.5px solid var(--cherry-yellow)", borderRadius: 999, padding: "0.28rem 0.62rem", color: articleRecordScore === 4 ? "var(--cherry-forest)" : "var(--cherry-warm-brown)", fontSize: "0.72rem", fontWeight: 900 }}>
                      填写完成度：{articleRecordScore}/4
                    </span>
                    <button type="button" onClick={copyLearningRecord} aria-label={`复制${article.title}的已填写学习记录`} aria-describedby="article-summary-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.4rem 0.76rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                      {copiedLearningRecord ? "已复制" : "复制已填写记录"}
                    </button>
                  </div>
                </div>
                <div className="article-record-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.62rem" }}>
                  {articleRecordFields.map((field, index) => {
                    const quality = articleRecordQuality[index];

                    return (
                    <label key={field.id} htmlFor={field.id} style={{ display: "grid", gap: "0.36rem", color: "var(--cherry-warm-brown)", fontSize: "0.76rem", fontWeight: 900 }}>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                        <span>{field.label}</span>
                        <span style={{ color: quality?.pass ? "var(--cherry-forest)" : "var(--cherry-red)", fontSize: "0.68rem", fontWeight: 900 }}>{quality?.pass ? "可用" : "待补充"}</span>
                      </span>
                      <textarea
                        id={field.id}
                        value={field.value}
                        onChange={(event) => {
                          field.setter(event.target.value);
                          setCopiedLearningRecord(false);
                          setCopyStatus("");
                        }}
                        rows={3}
                        placeholder={field.placeholder}
                        style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.62rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800, lineHeight: 1.55, resize: "vertical", minHeight: 92 }}
                      />
                      {quality ? (
                        <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.42, fontWeight: 800 }}>{quality.help}</span>
                      ) : null}
                    </label>
                    );
                  })}
                </div>
                <div style={{ background: "var(--cherry-sage-light)", border: "1px solid rgba(58,92,62,0.16)", borderRadius: 8, padding: "0.62rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.5rem" }}>
                  {[
                    ["问题", filledRecord.question],
                    ["证据", filledRecord.evidence],
                    ["产出", filledRecord.output],
                    ["下一步", filledRecord.nextStep],
                  ].map(([label, body]) => (
                    <div key={label} style={{ display: "grid", gap: "0.22rem" }}>
                      <span style={{ color: "var(--cherry-forest)", fontSize: "0.7rem", fontWeight: 900 }}>{label}</span>
                      <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.48, fontWeight: 800 }}>{body}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div
              style={{
                background: "var(--cherry-yellow-light)",
                border: "1.5px solid var(--cherry-yellow)",
                borderRadius: 16,
                padding: "0.9rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.55rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900 }}>
                  <IconBook size={18} />
                  可带走的方法
                </div>
                <button type="button" onClick={copyArticleSummary} aria-label={`复制${article.title}的阅读摘要`} aria-describedby="article-summary-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.4rem 0.76rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                  {copiedSummary ? "已复制" : "复制摘要"}
                </button>
              </div>
              <div id="article-summary-copy-status" role="status" aria-live="polite" style={{ minHeight: "1rem", color: "var(--cherry-forest)", fontSize: "0.74rem", fontWeight: 900, marginBottom: "0.42rem" }}>
                {copyStatus}
              </div>
              <div style={{ display: "grid", gap: "0.65rem" }}>
                {article.highlights.map((highlight) => (
                  <div key={highlight} style={{ display: "flex", alignItems: "flex-start", gap: 8, color: "var(--cherry-warm-mid)", lineHeight: 1.58, fontSize: "0.86rem" }}>
                    <IconCheck size={16} color="var(--cherry-forest)" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {articleCompletionChecks.length ? (
              <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 16, padding: "0.9rem", marginTop: "0.9rem" }}>
                <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem", marginBottom: "0.62rem" }}>完成验收卡</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.58rem" }}>
                  {articleCompletionChecks.map((item, index) => (
                    <div key={item.title} style={{ background: "rgba(250,247,241,0.74)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.62rem", display: "grid", gridTemplateColumns: "24px minmax(0, 1fr)", gap: "0.5rem", alignItems: "start" }}>
                      <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: "50%", background: index === 3 ? "var(--cherry-red)" : "var(--cherry-forest)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 900 }}>
                        {index + 1}
                      </span>
                      <span>
                        <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.78rem", marginBottom: "0.24rem" }}>{item.title}</strong>
                        <span style={{ display: "block", color: "var(--cherry-warm-mid)", lineHeight: 1.52, fontSize: "0.76rem", fontWeight: 800, marginBottom: "0.32rem" }}>{item.body}</span>
                        <span style={{ display: "block", color: "var(--cherry-warm-brown)", lineHeight: 1.48, fontSize: "0.72rem", fontWeight: 900 }}>验收：{item.output}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {articleEvidenceItems.length ? (
              <div style={{ background: "var(--cherry-sage-light)", border: "1.5px solid rgba(93,140,101,0.22)", borderRadius: 16, padding: "0.9rem", marginTop: "0.9rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.68rem" }}>
                  <div>
                    <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem" }}>读完产出</div>
                    <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.5, marginTop: "0.18rem", fontWeight: 800 }}>
                      读完后至少留下一个可检查的学习记录，而不是只浏览内容。
                    </div>
                  </div>
                  <button type="button" onClick={copyLearningRecord} aria-label={`复制${article.title}的学习记录`} aria-describedby="article-summary-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.4rem 0.76rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                    {copiedLearningRecord ? "已复制" : "复制学习记录"}
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.58rem", marginBottom: "0.7rem" }}>
                  {articleEvidenceItems.map((item, index) => (
                    <div key={item} style={{ background: "rgba(250,247,241,0.74)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.62rem", display: "grid", gridTemplateColumns: "24px minmax(0, 1fr)", gap: "0.5rem", alignItems: "start" }}>
                      <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--cherry-forest)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 900 }}>
                        {index + 1}
                      </span>
                      <span style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.55, fontSize: "0.8rem", fontWeight: 800 }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.52rem" }}>
                  {articlePracticePlan.map((item) => (
                    <div key={item.label} style={{ background: "var(--card)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.62rem" }}>
                      <strong style={{ display: "block", color: "var(--cherry-forest)", fontSize: "0.76rem", marginBottom: "0.24rem" }}>{item.label}</strong>
                      <span style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.5, fontSize: "0.76rem", fontWeight: 800 }}>{item.body}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {navArticles.length > 0 ? (
              <nav aria-label="文章前后导航" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.55rem", marginTop: "1rem" }}>
                {navArticles.map((item) => {
                  const itemType = "tag" in item.article ? item.article.tag : item.article.label;
                  const itemReadTime = "readTime" in item.article ? item.article.readTime : item.article.readMin;
                  const itemColor = "tagColor" in item.article ? item.article.tagColor : item.article.labelColor;
                  const itemBg = "tagBg" in item.article ? item.article.tagBg : item.article.labelBg;

                  return (
                    <a
                      className="article-nav-card"
                      key={item.article.slug}
                      href={item.article.href}
                      aria-label={`${item.label}文章：${item.article.title}`}
                      onMouseEnter={() => preloadRouteForHref(item.article.href)}
                      onFocus={() => preloadRouteForHref(item.article.href)}
                      onPointerDown={() => preloadRouteForHref(item.article.href)}
                      onClick={(event) => {
                        if (!shouldUseClientNavigation(event)) return;
                        event.preventDefault();
                        navigateToPath(item.article.href);
                      }}
                      style={{ display: "grid", gap: "0.18rem", justifyItems: item.align === "right" ? "end" : "start", textAlign: item.align, background: "transparent", borderTop: "1px solid rgba(94,68,42,0.12)", borderRadius: 0, padding: "0.5rem 0", color: "var(--cherry-warm-mid)", textDecoration: "none" }}
                    >
                      <span style={{ color: "var(--cherry-forest)", fontWeight: 900, fontSize: "0.72rem" }}>
                        {item.align === "left" ? `${item.arrow} ` : ""}{item.label}{item.align === "right" ? ` ${item.arrow}` : ""}
                      </span>
                      <strong style={{ color: "var(--cherry-warm-brown)", lineHeight: 1.35, fontSize: "0.86rem" }}>{item.article.title}</strong>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: item.align === "right" ? "flex-end" : "flex-start", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ background: itemBg, color: itemColor, borderRadius: 999, padding: "0.13rem 0.5rem", fontSize: "0.68rem", fontWeight: 900 }}>{itemType}</span>
                        <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.7rem", fontWeight: 800 }}>约 {itemReadTime} 分钟</span>
                      </span>
                    </a>
                  );
                })}
              </nav>
            ) : null}
          </article>
        </div>
      </section>

      <style>
        {`
          .article-detail-link:focus-visible,
          .article-start-action-button:focus-visible,
          #article-primary-action:focus-visible,
          #article-body-points:focus-visible,
          .article-nav-card:focus-visible,
          .article-outcome-snapshot button:focus-visible,
          .plant-evidence-chain-builder button:focus-visible,
          .plant-evidence-chain-grid textarea:focus-visible,
          .genome-story-frame-builder button:focus-visible,
          .genome-story-frame-grid textarea:focus-visible,
          .barcode-evidence-table-builder button:focus-visible,
          .barcode-evidence-table-grid textarea:focus-visible,
          .project-evidence-table-builder button:focus-visible,
          .project-evidence-table-grid textarea:focus-visible,
          .creation-run-record-builder button:focus-visible,
          .creation-run-record-grid textarea:focus-visible,
          .research-question-card-builder button:focus-visible,
          .research-question-card-grid textarea:focus-visible,
          .ai-material-audit-table-builder button:focus-visible,
          .ai-material-audit-table-grid textarea:focus-visible,
          .article-record-grid textarea:focus-visible,
          .platform-custom-config-grid input:focus-visible,
          .platform-custom-config-grid textarea:focus-visible,
          .platform-plan-button:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          .article-detail-link:hover,
          .article-detail-link:focus-visible {
            color: var(--cherry-red) !important;
          }

          .article-back-chip:hover,
          .article-back-chip:focus-visible {
            background: var(--cherry-yellow-light) !important;
            border-color: var(--cherry-yellow) !important;
          }

          .article-nav-card {
            transition: color 0.18s ease;
          }

          .article-nav-card:hover,
          .article-nav-card:focus-visible {
            color: var(--cherry-red) !important;
          }

          @media (prefers-reduced-motion: reduce) {
            .article-nav-card {
              transition: none !important;
              transform: none !important;
            }
          }

          @media (max-width: 759px) {
            .article-outcome-snapshot {
              grid-template-columns: 1fr !important;
            }

            .article-outcome-actions {
              justify-content: flex-start !important;
            }

            .article-record-grid,
            .plant-evidence-chain-grid,
            .plant-evidence-chain-builder > div:nth-of-type(3),
            .genome-story-frame-grid,
            .genome-story-frame-builder > div:nth-of-type(3),
            .barcode-evidence-table-grid,
            .barcode-evidence-table-builder > div:nth-of-type(3),
            .project-evidence-table-grid,
            .project-evidence-table-builder > div:nth-of-type(3),
            .creation-run-record-grid,
            .creation-run-record-builder > div:nth-of-type(3),
            .research-question-card-grid,
            .research-question-card-builder > div:nth-of-type(3),
            .ai-material-audit-table-grid,
            .ai-material-audit-table-builder > div:nth-of-type(3),
            .platform-active-plan-grid,
            .platform-custom-config-grid > div:nth-of-type(2) {
              grid-template-columns: 1fr !important;
            }

          }
        `}
      </style>
    </main>
  );
}
