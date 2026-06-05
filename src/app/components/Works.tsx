import { useState } from "react";
import { IconMicroscope, IconAI, IconLeaf, IconFlask, IconDNA } from "./Icons";
import { notes } from "./Notes";
import { essays } from "./ResearchEssays";
import { WorkPreviewIllustration } from "./WorkPreviewIllustration";
import { copyText } from "../clipboard";
import { navigateClient, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";

type Category = "全部" | "科学" | "学习项目" | "AI工具";

export const works = [
  {
    id: 1, slug: "gene-expression", category: "科学" as Category,
    icon: <IconMicroscope size={36} color="var(--cherry-blue)" />,
    title: "基因表达可视化",
    desc: "拖拽 TF、RNA 聚合酶和核糖体，观察 mRNA 端点、核糖体读取、多肽链和 5 道即时小测。",
    task: "把 TF 调低再打开 RNA 聚合酶，观察 mRNA 生成变少、核糖体读取减少、蛋白链产量下降。",
    starter: "先把 RNA 聚合酶打开，再拖动时间滑块，看 mRNA 曲线如何带出核糖体和多肽链。",
    success: "能说清 DNA 信息如何转成 mRNA、核糖体如何读密码子，并用读数解释蛋白链为什么变多或变少。",
    href: "/works/gene-expression",
    updated: "2026-06-04",
    tags: ["生物", "可视化", "交互"],
    outputs: ["表达读数", "过程记录", "即时小测"],
    path: ["调节分子", "观察过程", "复制记录"],
    action: "启动仿真",
    color: "var(--cherry-blue-light)", border: "var(--cherry-blue)", rotate: "-1.5deg",
  },
  {
    id: 3, slug: "research-prompt-kit", category: "AI工具" as Category,
    icon: <IconAI size={36} color="var(--cherry-blue)" />,
    title: "科研 Agent 工作台",
    desc: "选择科研任务和工作模式，把材料组织成模型指令、证据边界、引用核查、质控清单和汇报任务包。",
    task: "粘贴一段摘要或图注，运行本地预览，得到任务路由、缺失信息、引用核查和可复制 API JSON。",
    starter: "先载入读论文练习，运行本地预览，看系统如何拆出证据候选和缺失字段。",
    success: "能把一段科研材料整理成任务路由、证据边界、引用核查和下一步核查清单，并知道哪些内容不能让模型直接定论。",
    href: "/works/research-prompt-kit",
    updated: "2026-06-04",
    tags: ["AI", "Agent", "科研"],
    outputs: ["任务路由", "引用核查", "报告框架"],
    path: ["粘贴材料", "核查来源", "复核报告"],
    action: "进入工作台",
    color: "var(--cherry-peach-light)", border: "var(--cherry-peach)", rotate: "-0.8deg",
  },
  {
    id: 4, slug: "plant-evolution-stories", category: "学习项目" as Category,
    icon: <IconLeaf size={36} color="var(--cherry-sage)" />,
    title: "植物演化时间轴",
    desc: "演化时间轴串联关键创新、证据、自测问题、作答提示和延伸练习。",
    task: "选择一个演化阶段，读证据卡，再用自测问题判断这项创新解决了什么生存压力。",
    starter: "先点种子阶段，比较孢子和种子各自解决了什么传播与保护问题。",
    success: "能按时间顺序解释至少三个植物关键创新，并用证据说出它们各自解决的生存压力。",
    href: "/works/plant-evolution-stories",
    updated: "2026-06-04",
    tags: ["植物学", "演化证据", "时间轴"],
    outputs: ["学习卡", "阶段比较", "证据判读"],
    path: ["选择阶段", "判读证据", "完成练习"],
    action: "探索时间轴",
    color: "var(--cherry-sage-light)", border: "var(--cherry-sage)", rotate: "1.8deg",
  },
  {
    id: 5, slug: "concept-explainer", category: "AI工具" as Category,
    icon: <IconAI size={36} color="#7B6CC4" />,
    title: "概念解释生成器",
    desc: "输入任意概念或选择样例，生成自测问题、类比、机制步骤、可视化流程、迁移练习和即时小测。",
    task: "输入一个卡住的概念，先看诊断边界，再生成可复制的学习卡和即时小测。",
    starter: "先输入光合作用或生态位，按诊断、类比、机制、练习四步检查自己是否真懂。",
    success: "能产出一张包含定义、机制、例子、边界和自测题的学习卡，并标出仍需查资料的部分。",
    href: "/works/concept-explainer",
    updated: "2026-06-04",
    tags: ["AI", "学习卡", "工具"],
    outputs: ["学习卡", "可视化流程", "即时小测"],
    path: ["输入概念", "看诊断边界", "生成学习卡"],
    action: "生成学习卡",
    color: "#EDE9F5", border: "#B5AEDD", rotate: "-1.2deg",
  },
  {
    id: 6, slug: "crispr-interactive", category: "科学" as Category,
    icon: <IconDNA size={36} color1="var(--cherry-red)" color2="var(--cherry-blue)" />,
    title: "CRISPR 编辑模拟器",
    desc: "操作 guide RNA、Cas 蛋白和修复结果，查看匹配评分、编辑判定、风险核查和模拟报告。",
    task: "找出 PAM，修改 guide RNA 碱基，比较匹配评分如何影响切割和修复结果。",
    starter: "先选高匹配敲除场景，再切到错配比较，看判定为什么从推荐继续变成谨慎使用。",
    success: "能根据 PAM、guide 匹配评分和修复结果判断一次编辑是否值得继续，并写出风险理由。",
    href: "/works/crispr-interactive",
    updated: "2026-06-04",
    tags: ["基因编辑", "互动", "CRISPR"],
    outputs: ["guide 判定", "风险核查", "模拟报告"],
    path: ["找 PAM", "判 guide", "核查风险"],
    action: "运行编辑",
    color: "var(--cherry-peach-light)", border: "var(--cherry-red)", rotate: "0.5deg",
  },
];

function WorkCard({ work }: { work: (typeof works)[0] }) {
  const [hovered, setHovered] = useState(false);
  const href = "href" in work ? work.href : undefined;

  function openDetail(event?: React.MouseEvent<HTMLAnchorElement>) {
    if (!href) return;
    if (event && !shouldUseClientNavigation(event)) return;
    event?.preventDefault();
    navigateClient(href);
  }

  function previewDetail() {
    setHovered(true);
    preloadRouteForHref(href);
  }

  return (
    <a
      className="work-card"
      href={href}
      aria-label={`打开${work.title}：先做这个，${work.starter}。完成标准，${work.success}`}
      onClick={openDetail}
      onMouseEnter={previewDetail}
      onPointerDown={previewDetail}
      onMouseLeave={() => setHovered(false)}
      onFocus={previewDetail}
      onBlur={() => setHovered(false)}
      style={{
        background: "var(--card)",
        border: "1.5px solid rgba(94,68,42,0.12)",
        borderTop: `4px solid ${work.border}`,
        borderRadius: 8,
        padding: "1.28rem 1.28rem 1.18rem",
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "transform 0.25s, box-shadow 0.25s",
        boxShadow: hovered ? "0 14px 28px rgba(58,92,62,0.12)" : "0 8px 18px rgba(94,68,42,0.06)",
        cursor: href ? "pointer" : "default",
        position: "relative",
        color: "inherit",
        textDecoration: "none",
        display: "grid",
        gridTemplateRows: "auto auto auto auto auto auto",
        alignContent: "start",
        minHeight: 344,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.8rem", marginBottom: "0.5rem" }}>
        <div>{work.icon}</div>
        <span style={{ background: work.color, border: `1px solid ${work.border}`, borderRadius: 999, color: "var(--cherry-forest)", fontSize: "0.66rem", fontWeight: 900, padding: "0.15rem 0.46rem", whiteSpace: "nowrap" }}>
          {work.category}
        </span>
      </div>

      <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "var(--cherry-warm-brown)", fontSize: "1rem", marginBottom: "0.42rem", lineHeight: 1.25 }}>
        {work.title}
      </h3>

      <p style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.44, marginBottom: "0.6rem" }}>
        {work.desc}
      </p>

      <div style={{ height: 104, minHeight: 104, display: "flex", justifyContent: "center", alignItems: "center", background: work.color, border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, marginBottom: "0.68rem", padding: "0.12rem", overflow: "hidden" }}>
        <WorkPreviewIllustration slug={work.slug} color={work.border} width={206} height={112} />
      </div>

      <div className="work-card-first-step" style={{ borderTop: "1px solid rgba(94,68,42,0.12)", borderBottom: "1px solid rgba(94,68,42,0.12)", padding: "0.58rem 0", marginBottom: "0.6rem", display: "grid", gap: "0.22rem" }}>
        <span style={{ color: "var(--cherry-red)", fontSize: "0.67rem", fontWeight: 900 }}>先做这个</span>
        <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.73rem", lineHeight: 1.42, fontWeight: 900 }}>{work.starter}</span>
      </div>

      <div className="work-card-output-strip" style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: "0.58rem" }}>
        {work.outputs.map((output) => (
          <span key={output} style={{ background: "rgba(250,247,241,0.78)", border: "1px solid rgba(94,68,42,0.1)", color: "var(--cherry-forest)", borderRadius: 999, padding: "0.17rem 0.48rem", fontSize: "0.68rem", fontWeight: 900, fontFamily: "'Nunito', sans-serif" }}>
            {output}
          </span>
        ))}
      </div>

      <div role="list" aria-label={`${work.title}学习路径`} style={{ display: "flex", flexWrap: "wrap", gap: 5, color: "var(--cherry-warm-mid)", fontSize: "0.67rem", fontWeight: 900, lineHeight: 1.35 }}>
        {work.path.map((step, index) => (
          <span role="listitem" key={step}>
            {index > 0 ? "→ " : ""}{index + 1}. {step}
          </span>
        ))}
      </div>

      <span
        aria-hidden="true"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          marginTop: "0.78rem",
          background: "rgba(250,247,241,0.82)",
          border: "1.5px solid rgba(58,92,62,0.28)",
          borderRadius: 8,
          padding: "0.38rem 0.78rem",
          color: "var(--cherry-forest)",
          fontWeight: 900,
          fontSize: "0.78rem",
          textDecoration: "none",
        }}
      >
        {work.action} →
      </span>
    </a>
  );
}

/* Section divider — hand-drawn wavy line */
function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      style={{ position: "absolute", [flip ? "bottom" : "top"]: 0, left: 0, width: "100%", display: "block" }}
      viewBox="0 0 1440 28"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={flip
          ? "M0 14 Q180 28 360 14 Q540 0 720 14 Q900 28 1080 14 Q1260 0 1440 14 L1440 28 L0 28Z"
          : "M0 14 Q180 0 360 14 Q540 28 720 14 Q900 0 1080 14 Q1260 28 1440 14 L1440 0 L0 0Z"
        }
        fill="var(--background)"
      />
    </svg>
  );
}

export function Works() {
  const [activeCategory, setActiveCategory] = useState<Category>("全部");
  const [copiedModuleChecklist, setCopiedModuleChecklist] = useState(false);
  const [copiedReadingPathPlan, setCopiedReadingPathPlan] = useState(false);
  const [moduleChecklistStatus, setModuleChecklistStatus] = useState("");
  const [readingPathStatus, setReadingPathStatus] = useState("");
  const categories: Category[] = ["全部", "科学", "学习项目", "AI工具"];
  const filtered = activeCategory === "全部" ? works : works.filter((w) => w.category === activeCategory);
  const recommendedWork = works.find((work) => work.slug === "gene-expression") ?? works[0];
  const filteredOutputCount = filtered.reduce((count, work) => count + work.outputs.length, 0);
  const learningPathBundles = [
    {
      goal: "看懂生命过程",
      work: works.find((work) => work.slug === "gene-expression"),
      article: notes.find((note) => note.slug === "ai-course-development"),
      note: "先操作仿真，再用 AI 质检法检查自己是否把分子、过程和证据讲清楚。",
    },
    {
      goal: "拆清科研证据",
      work: works.find((work) => work.slug === "research-prompt-kit"),
      article: essays.find((essay) => essay.slug === "science-to-learning-question"),
      note: "先读证据入口，再把材料放进 Agent 工作台拆任务、来源和风险。",
    },
    {
      goal: "整理植物材料",
      work: works.find((work) => work.slug === "plant-evolution-stories"),
      article: notes.find((note) => note.slug === "plant-genome-evidence-chain"),
      note: "先沿时间轴定位创新，再用证据链方法判断材料支持到哪一步。",
    },
    {
      goal: "解释卡住概念",
      work: works.find((work) => work.slug === "concept-explainer"),
      article: essays.find((essay) => essay.slug === "ai-assessment-quality-control"),
      note: "先用概念解释器生成学习卡，再用测评平台配置器做小测和错因复盘。",
    },
    {
      goal: "判断 DNA 证据",
      work: works.find((work) => work.slug === "crispr-interactive"),
      article: essays.find((essay) => essay.slug === "barcoding-evidence-chain"),
      note: "先在 CRISPR 模拟器里判 guide 和风险，再读 Barcoding 证据链训练证据追溯。",
    },
  ].filter((bundle): bundle is {
    goal: string;
    work: (typeof works)[number];
    article: (typeof notes)[number] | (typeof essays)[number];
    note: string;
  } => Boolean(bundle.work && bundle.article));
  const pairedWorkCount = new Set(learningPathBundles.map((bundle) => bundle.work.slug)).size;
  const moduleChecklistText = `【By Cherry 学习模块清单】
当前范围：${activeCategory === "全部" ? "全部学习模块" : activeCategory}
模块数量：${filtered.length}
可保存产出：${filteredOutputCount} 项

${filtered.map((work, index) => `${index + 1}. ${work.title}
入口：${work.href}
立即任务：${work.task}
先做这个：${work.starter}
学习路径：${work.path.join(" → ")}
可保存产出：${work.outputs.join(" / ")}
完成标准：${work.success}`).join("\n\n")}

使用方式
1. 先选 1 个模块，不要同时打开全部。
2. 完成后复制模块页里的记录或报告。
3. 回到这张清单，勾掉已经保存产出的模块。`;
  const readingPathPlanText = `【By Cherry 配套阅读路径】
覆盖模块：${pairedWorkCount}/${works.length}

${learningPathBundles.map((bundle, index) => `${index + 1}. ${bundle.goal}
为什么这样走：${bundle.note}
先操作模块：${bundle.work.title}
模块入口：${bundle.work.href}
立即任务：${bundle.work.task}
可保存产出：${bundle.work.outputs.join(" / ")}
完成标准：${bundle.work.success}
再读配套文章：${bundle.article.title}
文章入口：${bundle.article.href}
阅读上手动作：${bundle.article.actionSteps[0]}
阅读完成检查：${bundle.article.checklist[0]}
最后留下：${bundle.article.starterTemplate[0]}`).join("\n\n")}

使用方式
1. 先选其中 1 条路径，不要同时开多个方向。
2. 先完成模块里的可保存产出，再读文章补方法或证据。
3. 结束时复制模块复盘模板或文章学习记录，留下可回看的证据。`;

  async function copyModuleChecklist() {
    const copiedToClipboard = await copyText(moduleChecklistText);
    if (copiedToClipboard) {
      setCopiedModuleChecklist(true);
      setModuleChecklistStatus("学习模块清单已复制到剪贴板。");
      window.setTimeout(() => setCopiedModuleChecklist(false), 1400);
      return;
    }

    setCopiedModuleChecklist(false);
    setModuleChecklistStatus("复制失败，请手动选中文本复制。");
  }

  async function copyReadingPathPlan() {
    const copiedToClipboard = await copyText(readingPathPlanText);
    if (copiedToClipboard) {
      setCopiedReadingPathPlan(true);
      setReadingPathStatus("配套阅读路径已复制到剪贴板。");
      window.setTimeout(() => setCopiedReadingPathPlan(false), 1400);
      return;
    }

    setCopiedReadingPathPlan(false);
    setReadingPathStatus("复制失败，请手动选中文本复制。");
  }

  return (
    <section
      id="works"
      aria-labelledby="works-heading"
      style={{
        fontFamily: "'Nunito', sans-serif",
        padding: "4rem 1.5rem",
        background: "var(--muted)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <WaveDivider />

      {/* Scattered leaf deco */}
      <svg style={{ position: "absolute", top: 40, right: 30, opacity: 0.18 }} width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden="true" focusable="false">
        <path d="M10 55 Q15 35 50 12 Q50 38 10 55Z" fill="var(--cherry-forest)" />
      </svg>
      <svg style={{ position: "absolute", bottom: 50, left: 20, opacity: 0.15, transform: "scaleX(-1) rotate(20deg)" }} width="50" height="55" viewBox="0 0 60 60" fill="none" aria-hidden="true" focusable="false">
        <path d="M10 55 Q15 35 50 12 Q50 38 10 55Z" fill="var(--cherry-forest)" />
      </svg>

      <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: "1rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: "0.75rem" }}>
            <IconFlask size={20} color="var(--cherry-warm-mid)" />
            <span style={{ fontSize: "1rem", color: "var(--cherry-warm-mid)", fontWeight: 600 }}>
              科学学习和 AI 工具
            </span>
          </div>
          <h2 id="works-heading" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "var(--cherry-warm-brown)", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", lineHeight: 1.3 }}>
            学习模块
          </h2>
        </div>

        <a
          className="work-recommended-start"
          href={recommendedWork.href}
          aria-label={`推荐起点：${recommendedWork.title}。先做这个，${recommendedWork.starter}。完成标准，${recommendedWork.success}`}
          onMouseEnter={() => preloadRouteForHref(recommendedWork.href)}
          onFocus={() => preloadRouteForHref(recommendedWork.href)}
          onPointerDown={() => preloadRouteForHref(recommendedWork.href)}
          onClick={(event) => {
            if (!shouldUseClientNavigation(event)) return;
            event.preventDefault();
            navigateClient(recommendedWork.href);
          }}
          style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "0.75rem", alignItems: "center", background: "var(--card)", border: "1.5px solid rgba(94,68,42,0.12)", borderLeft: `4px solid ${recommendedWork.border}`, borderRadius: 8, padding: "0.82rem 0.95rem", color: "inherit", textDecoration: "none", boxShadow: "0 8px 18px rgba(94,68,42,0.06)", marginBottom: "1rem" }}
        >
          <span style={{ display: "grid", gap: "0.24rem", minWidth: 0 }}>
            <span style={{ color: "var(--cherry-forest)", fontSize: "0.72rem", fontWeight: 900 }}>推荐起点</span>
            <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.88rem", lineHeight: 1.45, fontWeight: 900 }}>先从基因表达可视化开始：拖动分子，看见 DNA 信息如何变成蛋白链。</span>
          </span>
          <span style={{ background: "var(--cherry-forest)", color: "#FAF7F1", borderRadius: 999, padding: "0.32rem 0.68rem", fontSize: "0.74rem", fontWeight: 900, whiteSpace: "nowrap" }}>启动仿真 →</span>
        </a>

        {/* Filter */}
        <div role="group" aria-label="按学习模块类型筛选" style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: "0.85rem" }}>
          {categories.map((cat) => (
              <button
              className="work-filter-button"
              key={cat}
              type="button"
              onClick={() => { setActiveCategory(cat); setCopiedModuleChecklist(false); setModuleChecklistStatus(""); }}
              aria-pressed={activeCategory === cat}
              style={{
                background: activeCategory === cat ? "var(--cherry-forest)" : "var(--card)",
                color: activeCategory === cat ? "#FAF7F1" : "var(--cherry-warm-mid)",
                border: activeCategory === cat ? "1.5px solid var(--cherry-forest)" : "1.5px solid var(--border)",
                borderRadius: 999, padding: "0.45rem 1.25rem",
                cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                fontWeight: 700, fontSize: "0.84rem", transition: "all 0.2s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div role="status" aria-live="polite" style={{ color: "var(--cherry-warm-mid)", textAlign: "center", fontSize: "0.78rem", fontWeight: 800, marginBottom: "1.4rem" }}>
          当前显示 {filtered.length} 个{activeCategory === "全部" ? "学习模块" : activeCategory}
        </div>

        <div className="work-scan-strip" style={{ background: "var(--card)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 8, padding: "0.85rem 0.95rem", marginBottom: "1rem", boxShadow: "0 8px 18px rgba(94,68,42,0.05)", display: "grid", gap: "0.68rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ color: "var(--cherry-warm-brown)", fontSize: "0.9rem", fontWeight: 900 }}>当前范围速览</div>
              <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.5, marginTop: "0.16rem", fontWeight: 800 }}>
                不先读说明，直接从下面选一个模块进入；每个入口都带首步和可保存产出。
              </div>
            </div>
            <span style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 999, padding: "0.24rem 0.62rem", color: "var(--cherry-warm-brown)", fontSize: "0.72rem", fontWeight: 900 }}>
              {filtered.length} 个入口
            </span>
          </div>
          <div className="work-scan-strip-grid" role="list" aria-label="当前筛选下的学习模块速览" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.55rem" }}>
            {filtered.map((work) => (
              <a
                key={work.slug}
                role="listitem"
                className="work-scan-link"
                href={work.href}
                aria-label={`打开${work.title}。先做这个，${work.starter}。可保存产出，${work.outputs.join("、")}`}
                onMouseEnter={() => preloadRouteForHref(work.href)}
                onFocus={() => preloadRouteForHref(work.href)}
                onPointerDown={() => preloadRouteForHref(work.href)}
                onClick={(event) => {
                  if (!shouldUseClientNavigation(event)) return;
                  event.preventDefault();
                  navigateClient(work.href);
                }}
                style={{ background: work.color, border: `1.5px solid ${work.border}`, borderRadius: 8, padding: "0.62rem", color: "inherit", textDecoration: "none", display: "grid", gap: "0.36rem", minHeight: 118 }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
                  <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(250,247,241,0.7)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transform: "scale(0.72)", transformOrigin: "center" }}>
                    {work.icon}
                  </span>
                  <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.8rem", lineHeight: 1.35, fontWeight: 900, overflowWrap: "anywhere" }}>{work.title}</strong>
                </span>
                <span className="work-scan-first-step" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.45, fontWeight: 800 }}>{work.starter}</span>
                <span className="work-scan-output" style={{ color: "var(--cherry-forest)", fontSize: "0.68rem", lineHeight: 1.35, fontWeight: 900 }}>
                  产出：{work.outputs.slice(0, 2).join(" / ")}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="work-module-checklist-panel" style={{ background: "var(--card)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 8, padding: "0.85rem 0.95rem", marginBottom: "1.1rem", boxShadow: "0 8px 18px rgba(94,68,42,0.05)", display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "0.8rem", alignItems: "center" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "var(--cherry-warm-brown)", fontSize: "0.9rem", fontWeight: 900, marginBottom: "0.2rem" }}>学习模块清单</div>
            <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.55, fontWeight: 800 }}>
              当前范围包含 {filtered.length} 个模块、{filteredOutputCount} 项可保存产出。复制后可以当作本次学习待办。
            </div>
            <div id="work-module-checklist-status" role="status" aria-live="polite" style={{ minHeight: "1rem", color: "var(--cherry-forest)", fontSize: "0.74rem", fontWeight: 900, marginTop: "0.34rem" }}>
              {moduleChecklistStatus}
            </div>
          </div>
          <button type="button" className="work-module-checklist-button" onClick={copyModuleChecklist} aria-describedby="work-module-checklist-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.46rem 0.82rem", fontWeight: 900, cursor: "pointer", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
            {copiedModuleChecklist ? "已复制" : "复制清单"}
          </button>
        </div>

        <div className="work-reading-path-panel" style={{ background: "var(--card)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 8, padding: "0.95rem", marginBottom: "1.15rem", boxShadow: "0 8px 18px rgba(94,68,42,0.05)", display: "grid", gap: "0.72rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "0.8rem", alignItems: "center" }}>
            <div>
              <div style={{ color: "var(--cherry-warm-brown)", fontSize: "0.92rem", fontWeight: 900, marginBottom: "0.18rem" }}>配套阅读路径</div>
              <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.55, fontWeight: 800 }}>
                不确定先做工具还是先读文章时，可以按下面的组合走：{pairedWorkCount}/{works.length} 个模块都配好了一篇方法或证据文章。
              </div>
              <div id="work-reading-path-status" role="status" aria-live="polite" style={{ minHeight: "1rem", color: "var(--cherry-forest)", fontSize: "0.74rem", fontWeight: 900, marginTop: "0.34rem" }}>
                {readingPathStatus}
              </div>
            </div>
            <button type="button" className="work-reading-path-copy-button" onClick={copyReadingPathPlan} aria-describedby="work-reading-path-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.46rem 0.82rem", fontWeight: 900, cursor: "pointer", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
              {copiedReadingPathPlan ? "已复制" : "复制路径"}
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "0.72rem" }}>
            {learningPathBundles.map((bundle) => (
              <div key={bundle.goal} style={{ background: bundle.work.color, border: `1.5px solid ${bundle.work.border}`, borderRadius: 8, padding: "0.78rem", display: "grid", gap: "0.52rem" }}>
                <div style={{ color: "var(--cherry-forest)", fontSize: "0.68rem", fontWeight: 900 }}>{bundle.goal}</div>
                <div style={{ color: "var(--cherry-warm-brown)", fontSize: "0.8rem", lineHeight: 1.45, fontWeight: 900 }}>{bundle.note}</div>
                <div style={{ display: "grid", gap: "0.36rem" }}>
                  <a
                    className="work-reading-path-link"
                    href={bundle.work.href}
                    aria-label={`打开模块：${bundle.work.title}。先做这个，${bundle.work.starter}`}
                    onMouseEnter={() => preloadRouteForHref(bundle.work.href)}
                    onFocus={() => preloadRouteForHref(bundle.work.href)}
                    onPointerDown={() => preloadRouteForHref(bundle.work.href)}
                    onClick={(event) => {
                      if (!shouldUseClientNavigation(event)) return;
                      event.preventDefault();
                      navigateClient(bundle.work.href);
                    }}
                    style={{ background: "rgba(250,247,241,0.78)", border: "1px solid rgba(94,68,42,0.12)", borderRadius: 8, padding: "0.5rem 0.58rem", color: "var(--cherry-warm-brown)", textDecoration: "none", fontSize: "0.74rem", lineHeight: 1.42, fontWeight: 900 }}
                  >
                    1. 操作模块：{bundle.work.title}
                  </a>
                  <a
                    className="work-reading-path-link"
                    href={bundle.article.href}
                    aria-label={`打开配套文章：${bundle.article.title}。先做这个，${bundle.article.actionSteps[0]}。完成后检查，${bundle.article.checklist[0]}`}
                    onMouseEnter={() => preloadRouteForHref(bundle.article.href)}
                    onFocus={() => preloadRouteForHref(bundle.article.href)}
                    onPointerDown={() => preloadRouteForHref(bundle.article.href)}
                    onClick={(event) => {
                      if (!shouldUseClientNavigation(event)) return;
                      event.preventDefault();
                      navigateClient(bundle.article.href);
                    }}
                    style={{ background: "rgba(250,247,241,0.78)", border: "1px solid rgba(94,68,42,0.12)", borderRadius: 8, padding: "0.5rem 0.58rem", color: "var(--cherry-warm-brown)", textDecoration: "none", fontSize: "0.74rem", lineHeight: 1.42, fontWeight: 900 }}
                  >
                    2. 配套阅读：{bundle.article.title}
                  </a>
                </div>
                <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.7rem", lineHeight: 1.45, fontWeight: 900 }}>
                  完成检查：{bundle.article.checklist[0]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem", listStyle: "none", margin: 0, padding: 0 }}>
          {filtered.map((work) => (
            <li key={work.id} style={{ display: "grid" }}>
              <WorkCard work={work} />
            </li>
          ))}
        </ul>
      </div>

      <WaveDivider flip />

      <style>
        {`
          #works .work-card:focus-visible,
          #works .work-recommended-start:focus-visible,
          #works .work-scan-link:focus-visible,
          #works .work-reading-path-link:focus-visible,
          #works .work-reading-path-copy-button:focus-visible,
          #works .work-module-checklist-button:focus-visible,
          #works .work-filter-button:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          @media (prefers-reduced-motion: reduce) {
            #works .work-card,
            #works .work-module-checklist-button,
            #works .work-filter-button {
              transition: none !important;
              transform: none !important;
            }
          }

          @media (max-width: 640px) {
            #works .work-module-checklist-panel {
              grid-template-columns: 1fr !important;
            }

            #works .work-reading-path-panel > div:first-child {
              grid-template-columns: 1fr !important;
            }

            #works .work-reading-path-copy-button,
            #works .work-module-checklist-button {
              width: 100%;
            }

            #works .work-scan-strip-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </section>
  );
}
