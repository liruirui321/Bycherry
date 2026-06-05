import { useState } from "react";
import { IconMicroscope, IconAI, IconLeaf, IconFlask, IconDNA } from "./Icons";
import { WorkPreviewIllustration } from "./WorkPreviewIllustration";
import { getWorkToolHref, navigateClient, shouldUseClientNavigation } from "../navigation";
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
  const href = "href" in work ? getWorkToolHref(work.href) : undefined;

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
        padding: "0.86rem",
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
        minHeight: 242,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.65rem", marginBottom: "0.42rem" }}>
        <div style={{ transform: "scale(0.72)", transformOrigin: "left top", width: 28, height: 28 }}>{work.icon}</div>
        <span style={{ background: work.color, border: `1px solid ${work.border}`, borderRadius: 999, color: "var(--cherry-forest)", fontSize: "0.66rem", fontWeight: 900, padding: "0.15rem 0.46rem", whiteSpace: "nowrap" }}>
          {work.category}
        </span>
      </div>

      <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "var(--cherry-warm-brown)", fontSize: "1rem", marginBottom: "0.42rem", lineHeight: 1.25 }}>
        {work.title}
      </h3>

      <p style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.42, marginBottom: "0.5rem", maxHeight: 42, overflow: "hidden" }}>
        {work.desc}
      </p>

      <div style={{ height: 58, minHeight: 58, display: "flex", justifyContent: "center", alignItems: "center", background: work.color, border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, marginBottom: "0.5rem", padding: "0.1rem", overflow: "hidden" }}>
        <WorkPreviewIllustration slug={work.slug} color={work.border} width={142} height={76} />
      </div>

      <div className="work-card-first-step" style={{ borderTop: "1px solid rgba(94,68,42,0.12)", borderBottom: "1px solid rgba(94,68,42,0.12)", padding: "0.42rem 0", marginBottom: "0.46rem", display: "grid", gap: "0.18rem" }}>
        <span style={{ color: "var(--cherry-red)", fontSize: "0.67rem", fontWeight: 900 }}>先做这个</span>
        <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.71rem", lineHeight: 1.38, fontWeight: 900, maxHeight: 40, overflow: "hidden" }}>{work.starter}</span>
      </div>

      <div className="work-card-output-strip" style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: "0.46rem" }}>
        {work.outputs.slice(0, 2).map((output) => (
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
          marginTop: "0.58rem",
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
  return (
    <section
      id="works"
      aria-labelledby="works-heading"
      style={{
        fontFamily: "'Nunito', sans-serif",
        padding: "2.4rem 1.5rem",
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

      <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: "0.75rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "1.15rem", textAlign: "center" }}>
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

        <ul aria-label="全部学习模块" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.85rem", listStyle: "none", margin: 0, padding: 0 }}>
          {works.map((work) => (
            <li key={work.id} style={{ display: "grid" }}>
              <WorkCard work={work} />
            </li>
          ))}
        </ul>
      </div>

      <WaveDivider flip />

      <style>
        {`
          #works .work-card:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          @media (prefers-reduced-motion: reduce) {
            #works .work-card {
              transition: none !important;
              transform: none !important;
            }
          }
        `}
      </style>
    </section>
  );
}
