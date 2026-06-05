import { useState } from "react";
import { IconMicroscope, IconNotebook, IconSeedling } from "./Icons";
import { works } from "./Works";
import { notes } from "./Notes";
import { essays } from "./ResearchEssays";
import { WorkPreviewIllustration } from "./WorkPreviewIllustration";
import { copyText } from "../clipboard";
import { navigateClient, navigateHomeSection, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";

export function Hero() {
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(0);
  const [copiedSessionPlan, setCopiedSessionPlan] = useState(false);
  const [sessionPlanStatus, setSessionPlanStatus] = useState("");
  const goalRoutes = [
    { label: "看懂一个生命过程", href: "/works/gene-expression", workTitle: "基因表达可视化" },
    { label: "拆清一个卡住概念", href: "/works/concept-explainer", workTitle: "概念解释生成器" },
    { label: "整理一段科研材料", href: "/works/research-prompt-kit", workTitle: "科研 Agent 工作台" },
    { label: "梳理植物演化证据", href: "/works/plant-evolution-stories", workTitle: "植物演化时间轴" },
    { label: "判断一次编辑风险", href: "/works/crispr-interactive", workTitle: "CRISPR 编辑模拟器" },
  ];
  const sessionPlans = [
    {
      label: "生命过程",
      work: works.find((work) => work.slug === "gene-expression"),
      article: notes.find((note) => note.slug === "ai-course-development"),
    },
    {
      label: "卡住概念",
      work: works.find((work) => work.slug === "concept-explainer"),
      article: essays.find((essay) => essay.slug === "ai-assessment-quality-control"),
    },
    {
      label: "科研材料",
      work: works.find((work) => work.slug === "research-prompt-kit"),
      article: essays.find((essay) => essay.slug === "science-to-learning-question"),
    },
    {
      label: "植物演化",
      work: works.find((work) => work.slug === "plant-evolution-stories"),
      article: notes.find((note) => note.slug === "plant-genome-evidence-chain"),
    },
    {
      label: "DNA 证据",
      work: works.find((work) => work.slug === "crispr-interactive"),
      article: essays.find((essay) => essay.slug === "barcoding-evidence-chain"),
    },
  ].filter((item): item is { label: string; work: (typeof works)[number]; article: (typeof notes)[number] | (typeof essays)[number] } => Boolean(item.work && item.article));
  const activeSessionPlan = sessionPlans[selectedSessionIndex] ?? sessionPlans[0];
  const activeSessionSteps = activeSessionPlan
    ? [
        { time: "5 分钟", body: activeSessionPlan.work.starter },
        { time: "15 分钟", body: activeSessionPlan.work.task },
        { time: "5 分钟", body: `保存产出：${activeSessionPlan.work.outputs.join(" / ")}。完成标准：${activeSessionPlan.work.success}` },
        { time: "5 分钟", body: `配套阅读：${activeSessionPlan.article.title}。先做这个：${activeSessionPlan.article.actionSteps[0]}` },
      ]
    : [];
  const heroOutputCount = works.reduce((count, work) => count + work.outputs.length, 0);
  const heroPathStepCount = works.reduce((count, work) => count + work.path.length, 0);
  const heroModuleStats = [
    { label: "学习模块", value: `${works.length} 个`, body: "打开卡片就能进入真实内容。" },
    { label: "可保存产出", value: `${heroOutputCount} 项`, body: "记录、报告和学习卡都能带走。" },
    { label: "执行步骤", value: `${heroPathStepCount} 步`, body: "每个入口都有操作顺序。" },
    { label: "完成标准", value: "全覆盖", body: "先看做到什么程度再开始。" },
  ];
  const heroModuleStatsText = heroModuleStats.map((item) => `${item.label}：${item.value}。${item.body}`).join("\n");
  const sessionPlanText = activeSessionPlan
    ? `【By Cherry 30 分钟学习路径】
目标：${activeSessionPlan.label}
模块：${activeSessionPlan.work.title}
入口：${activeSessionPlan.work.href}
配套阅读：${activeSessionPlan.article.title}
阅读入口：${activeSessionPlan.article.href}

首屏模块总览
${heroModuleStatsText}

1. 5 分钟启动
${activeSessionPlan.work.starter}

2. 15 分钟操作
${activeSessionPlan.work.task}

3. 5 分钟收束
保存产出：${activeSessionPlan.work.outputs.join(" / ")}
完成标准：${activeSessionPlan.work.success}

4. 5 分钟配套阅读
${activeSessionPlan.article.actionSteps[0]}
完成检查：${activeSessionPlan.article.checklist[0]}

完成后
回到模块页填写复盘证据：保存了什么、观察到什么变化、如何证明完成、下一步问题。

模块学习路径
${activeSessionPlan.work.path.map((step, index) => `${index + 1}. ${step}`).join("\n")}`
    : "";

  function openWork(href: string, event: React.MouseEvent<HTMLAnchorElement>) {
    if (!shouldUseClientNavigation(event)) return;
    event.preventDefault();
    navigateClient(href);
  }

  async function copySessionPlan() {
    if (!sessionPlanText) return;
    const copiedToClipboard = await copyText(sessionPlanText);
    if (copiedToClipboard) {
      setCopiedSessionPlan(true);
      setSessionPlanStatus("30 分钟学习路径已复制到剪贴板。");
      window.setTimeout(() => setCopiedSessionPlan(false), 1400);
      return;
    }

    setCopiedSessionPlan(false);
    setSessionPlanStatus("复制失败，请手动选中文本复制。");
  }

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      style={{
        fontFamily: "'Nunito', sans-serif",
        minHeight: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "1.75rem 1.5rem 1.45rem",
        width: "100%",
        maxWidth: "100%",
        background:
          "linear-gradient(180deg, rgba(250,247,241,0.98) 0%, rgba(245,241,234,0.95) 100%), linear-gradient(rgba(58,92,62,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(58,92,62,0.05) 1px, transparent 1px)",
        backgroundSize: "auto, 42px 42px, 42px 42px",
      }}
    >
      {/* Main content */}
      <div className="hero-inner" style={{ position: "relative", zIndex: 2, textAlign: "left", maxWidth: 1120, width: "100%", minWidth: 0 }}>
        <div className="hero-content-grid" style={{ display: "grid", gridTemplateColumns: "minmax(260px, 0.72fr) minmax(0, 1.28fr)", gap: "1.2rem", alignItems: "start", minWidth: 0, maxWidth: "100%" }}>
          <div className="hero-intro" style={{ minWidth: 0 }}>
        {/* Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(250,247,241,0.82)",
            border: "1px solid rgba(58,92,62,0.18)",
            borderRadius: 999,
            padding: "0.34rem 0.86rem",
            marginBottom: "0.85rem",
          }}
        >
          <IconMicroscope size={15} color="var(--cherry-forest)" />
          <span style={{ fontSize: "0.78rem", color: "var(--cherry-warm-mid)", fontWeight: 900, letterSpacing: 0 }}>
            By Cherry · science learning lab
          </span>
        </div>

        {/* Headline */}
        <h1
          id="hero-heading"
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "clamp(1.72rem, 3.9vw, 2.75rem)",
            fontWeight: 800,
            lineHeight: 1.14,
            color: "var(--cherry-warm-brown)",
            marginBottom: "0.72rem",
            letterSpacing: 0,
          }}
        >
          By Cherry 科学与 AI 学习工作台
        </h1>

        <p
          style={{
            fontSize: "clamp(0.96rem, 1.8vw, 1.08rem)",
            color: "var(--cherry-warm-mid)",
            lineHeight: 1.72,
            marginBottom: "1rem",
            fontWeight: 700,
          }}
        >
          先选一个要解决的问题，再进入对应模块操作。每个入口都标出任务、产出和完成标准，方便你直接开始。
        </p>

        <div style={{ display: "grid", gap: "0.5rem", marginBottom: "1rem" }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontSize: "0.78rem", fontWeight: 900 }}>按目标选入口</div>
          <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
            {goalRoutes.map((route) => (
              <a
                key={route.href}
                className="hero-goal-link"
                href={route.href}
                aria-label={`${route.label}：打开${route.workTitle}`}
                onClick={(event) => openWork(route.href, event)}
                onMouseEnter={() => preloadRouteForHref(route.href)}
                onFocus={() => preloadRouteForHref(route.href)}
                onPointerDown={() => preloadRouteForHref(route.href)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(250,247,241,0.82)",
                  border: "1.5px solid rgba(94,68,42,0.12)",
                  borderRadius: 999,
                  padding: "0.36rem 0.68rem",
                  color: "var(--cherry-warm-brown)",
                  textDecoration: "none",
                  fontSize: "0.76rem",
                  fontWeight: 900,
                  lineHeight: 1.25,
                }}
              >
                <span>{route.label}</span>
                <span aria-hidden="true" style={{ color: "var(--cherry-forest)" }}>→</span>
              </a>
            ))}
          </div>
        </div>

        {activeSessionPlan ? (
          <div style={{ background: "rgba(250,247,241,0.82)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 10, padding: "0.72rem", marginBottom: "1rem", display: "grid", gap: "0.55rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.7rem", flexWrap: "wrap" }}>
              <div>
                <div style={{ color: "var(--cherry-warm-brown)", fontSize: "0.82rem", fontWeight: 900 }}>30 分钟学习路径</div>
                <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.45, fontWeight: 800 }}>选一个目标，直接带着任务、产出、完成标准和配套阅读进入模块。</div>
              </div>
              <button className="hero-session-button" type="button" onClick={copySessionPlan} aria-describedby="hero-session-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.36rem 0.68rem", fontWeight: 900, cursor: "pointer", fontSize: "0.74rem" }}>
                {copiedSessionPlan ? "已复制" : "复制路径"}
              </button>
            </div>
            <div role="group" aria-label="选择 30 分钟学习路径目标" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {sessionPlans.map((plan, index) => {
                const selected = index === selectedSessionIndex;
                return (
                  <button className="hero-session-button" key={plan.label} type="button" aria-pressed={selected} onClick={() => { setSelectedSessionIndex(index); setCopiedSessionPlan(false); setSessionPlanStatus(""); }} style={{ background: selected ? "var(--cherry-yellow-light)" : "var(--muted)", color: selected ? "var(--cherry-warm-brown)" : "var(--cherry-warm-mid)", border: selected ? "1.5px solid var(--cherry-yellow)" : "1.5px solid var(--border)", borderRadius: 999, padding: "0.28rem 0.58rem", fontSize: "0.7rem", fontWeight: 900, cursor: "pointer" }}>
                    {plan.label}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.48rem" }}>
              <a
                className="hero-session-action-link"
                href={activeSessionPlan.work.href}
                aria-label={`进入当前学习模块：${activeSessionPlan.work.title}。先做这个，${activeSessionPlan.work.starter}`}
                onClick={(event) => openWork(activeSessionPlan.work.href, event)}
                onMouseEnter={() => preloadRouteForHref(activeSessionPlan.work.href)}
                onFocus={() => preloadRouteForHref(activeSessionPlan.work.href)}
                onPointerDown={() => preloadRouteForHref(activeSessionPlan.work.href)}
                style={{ background: "var(--cherry-forest)", color: "#FAF7F1", borderRadius: 8, padding: "0.48rem 0.58rem", textDecoration: "none", fontSize: "0.74rem", lineHeight: 1.42, fontWeight: 900 }}
              >
                进入模块：{activeSessionPlan.work.title}
              </a>
              <a
                className="hero-session-action-link"
                href={activeSessionPlan.article.href}
                aria-label={`打开配套阅读：${activeSessionPlan.article.title}。先做这个，${activeSessionPlan.article.actionSteps[0]}。完成后检查，${activeSessionPlan.article.checklist[0]}`}
                onClick={(event) => openWork(activeSessionPlan.article.href, event)}
                onMouseEnter={() => preloadRouteForHref(activeSessionPlan.article.href)}
                onFocus={() => preloadRouteForHref(activeSessionPlan.article.href)}
                onPointerDown={() => preloadRouteForHref(activeSessionPlan.article.href)}
                style={{ background: "var(--card)", color: "var(--cherry-forest)", border: "1.5px solid rgba(58,92,62,0.2)", borderRadius: 8, padding: "0.46rem 0.56rem", textDecoration: "none", fontSize: "0.74rem", lineHeight: 1.42, fontWeight: 900 }}
              >
                配套阅读：{activeSessionPlan.article.title}
              </a>
            </div>
            <div style={{ display: "grid", gap: "0.42rem" }}>
              {activeSessionSteps.map((item) => (
                <div key={item.time} style={{ display: "grid", gridTemplateColumns: "58px minmax(0, 1fr)", gap: "0.48rem", alignItems: "start", background: "rgba(250,247,241,0.7)", border: "1px solid rgba(94,68,42,0.09)", borderRadius: 8, padding: "0.46rem" }}>
                  <span style={{ color: "var(--cherry-red)", fontSize: "0.68rem", fontWeight: 900 }}>{item.time}</span>
                  <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.74rem", lineHeight: 1.48, fontWeight: 800 }}>{item.body}</span>
                </div>
              ))}
            </div>
            <div id="hero-session-copy-status" role="status" aria-live="polite" style={{ minHeight: "0.9rem", color: "var(--cherry-forest)", fontSize: "0.7rem", fontWeight: 900 }}>
              {sessionPlanStatus}
            </div>
          </div>
        ) : null}

        {/* CTAs */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-start", flexWrap: "wrap" }}>
          <a
            className="hero-cta"
            href="#works"
            onClick={(event) => navigateHomeSection("#works", event)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "var(--cherry-forest)", color: "#FAF7F1",
              borderRadius: 999, padding: "0.62rem 1.25rem",
              textDecoration: "none", fontWeight: 700, fontSize: "0.93rem",
              boxShadow: "3px 5px 0px rgba(58,92,62,0.25)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "3px 8px 0px rgba(58,92,62,0.25)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "3px 5px 0px rgba(58,92,62,0.25)"; }}
          >
              <IconSeedling size={18} color="#FAF7F1" /> 浏览学习模块
          </a>
          <a
            className="hero-cta"
            href="#notes"
            onClick={(event) => navigateHomeSection("#notes", event)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "transparent", color: "var(--cherry-warm-brown)",
              border: "1.5px solid var(--border)", borderRadius: 999,
              padding: "0.62rem 1.25rem",
              textDecoration: "none", fontWeight: 700, fontSize: "0.93rem",
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--cherry-yellow-light)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--cherry-yellow)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
          >
            <IconNotebook size={18} /> 打开方法库
          </a>
        </div>
          </div>

        <div className="hero-work-list" style={{ background: "transparent", border: "none", borderRadius: 0, padding: 0, boxShadow: "none", minWidth: 0, maxWidth: "100%" }}>
          <div style={{ display: "grid", gap: "0.62rem", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.95rem" }}>首屏学习模块总览</div>
              <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", fontWeight: 800 }}>{works.length} 个学习模块</div>
            </div>
            <div role="list" aria-label="首屏模块总览" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(118px, 1fr))", gap: "0.45rem" }}>
              {heroModuleStats.map((item) => (
                <div key={item.label} role="listitem" style={{ background: "rgba(250,247,241,0.84)", border: "1px solid rgba(94,68,42,0.12)", borderRadius: 9, padding: "0.5rem 0.56rem", minHeight: 74 }}>
                  <div style={{ color: "var(--cherry-forest)", fontSize: "0.66rem", fontWeight: 900, marginBottom: "0.12rem" }}>{item.label}</div>
                  <div style={{ color: "var(--cherry-warm-brown)", fontSize: "1rem", fontWeight: 900, lineHeight: 1.1 }}>{item.value}</div>
                  <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.64rem", lineHeight: 1.38, fontWeight: 800, marginTop: "0.16rem" }}>{item.body}</div>
                </div>
              ))}
            </div>
          </div>
          <nav className="hero-work-grid" aria-label="首屏学习模块目录" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(154px, 1fr))", gap: "0.55rem", minWidth: 0, maxWidth: "100%" }}>
            {works.map((work) => (
                <a
                  className="hero-work-card"
                  key={work.slug}
                  href={work.href}
                  aria-label={`打开${work.title}：先做这个，${work.starter}。完成标准，${work.success}`}
                  onClick={(event) => openWork(work.href, event)}
                  onMouseEnter={() => preloadRouteForHref(work.href)}
                  onFocus={() => preloadRouteForHref(work.href)}
                  onPointerDown={() => preloadRouteForHref(work.href)}
                  style={{
                    background: work.color,
                    border: `1.5px solid ${work.border}`,
                    borderRadius: 10,
                    padding: "0.62rem",
                    color: "var(--cherry-warm-brown)",
                    textDecoration: "none",
                    textAlign: "left",
                    minHeight: 152,
                    display: "grid",
                    gridTemplateRows: "auto auto 1fr auto auto",
                    gap: "0.32rem",
                    position: "relative",
                    overflow: "hidden",
                    minWidth: 0,
                    maxWidth: "100%",
                  }}
                >
                  <div aria-hidden="true" style={{ position: "absolute", right: -8, bottom: -8, width: 74, height: 58, borderRadius: 10, background: "rgba(250,247,241,0.42)", border: "1px solid rgba(94,68,42,0.1)" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, position: "relative", zIndex: 1 }}>
                    <span style={{ width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", transform: "scale(0.68)", transformOrigin: "center" }}>{work.icon}</span>
                    <strong style={{ fontSize: "0.88rem", lineHeight: 1.35, minWidth: 0, overflowWrap: "anywhere" }}>{work.title}</strong>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
                    <span style={{ background: "rgba(250,247,241,0.72)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 999, padding: "0.08rem 0.42rem", color: "var(--cherry-forest)", fontSize: "0.62rem", fontWeight: 900 }}>
                      {work.category}
                    </span>
                    <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.62rem", fontWeight: 900 }}>
                      {work.updated}
                    </span>
                  </div>
                  <div style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.4rem 0.45rem", position: "relative", zIndex: 1, marginRight: 34 }}>
                    <span style={{ display: "block", color: "var(--cherry-forest)", fontSize: "0.6rem", fontWeight: 900, marginBottom: "0.12rem" }}>立即任务</span>
                    <span style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.65rem", lineHeight: 1.34, fontWeight: 800, overflowWrap: "anywhere" }}>{work.task}</span>
                  </div>
                  <div className="hero-work-outcome" style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.78fr) minmax(0, 1.22fr)", gap: "0.36rem", position: "relative", zIndex: 1, marginRight: 30 }}>
                    <span style={{ background: "rgba(250,247,241,0.72)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.3rem 0.38rem", minWidth: 0 }}>
                      <span style={{ display: "block", color: "var(--cherry-forest)", fontSize: "0.58rem", fontWeight: 900, marginBottom: "0.08rem" }}>产出</span>
                      <span style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.6rem", lineHeight: 1.28, fontWeight: 900, overflowWrap: "anywhere" }}>{work.outputs.slice(0, 2).join(" / ")}</span>
                    </span>
                    <span className="hero-work-completion" style={{ background: "rgba(250,247,241,0.72)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.3rem 0.38rem", minWidth: 0 }}>
                      <span style={{ display: "block", color: "var(--cherry-red)", fontSize: "0.58rem", fontWeight: 900, marginBottom: "0.08rem" }}>完成</span>
                      <span style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.6rem", lineHeight: 1.28, fontWeight: 900, overflowWrap: "anywhere" }}>{work.success}</span>
                    </span>
                  </div>
                  <div role="list" aria-label={`${work.title}学习路径`} style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center", paddingRight: 54, position: "relative", zIndex: 1 }}>
                    {work.path.map((step, index) => (
                      <span role="listitem" key={step} style={{ background: "rgba(250,247,241,0.74)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 999, padding: "0.12rem 0.36rem", color: "var(--cherry-warm-brown)", fontSize: "0.6rem", fontWeight: 900 }}>
                        {index + 1}. {step}
                      </span>
                    ))}
                    <span style={{ background: "var(--cherry-forest)", border: "1px solid var(--cherry-forest)", borderRadius: 999, padding: "0.12rem 0.38rem", color: "#FAF7F1", fontSize: "0.62rem", fontWeight: 900 }}>
                      {work.action}
                    </span>
                  </div>
                  <div className="hero-work-preview" style={{ position: "absolute", right: 2, bottom: 0, display: "flex", justifyContent: "flex-end", opacity: 0.9, zIndex: 0 }}>
                    <WorkPreviewIllustration slug={work.slug} color={work.border} width={78} height={58} />
                  </div>
                </a>
            ))}
          </nav>
        </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          #top {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            padding-top: 1rem !important;
            padding-bottom: 1.15rem !important;
          }

          .hero-inner,
          .hero-content-grid {
            width: 100% !important;
            max-width: calc(100vw - 2rem) !important;
            grid-template-columns: 1fr !important;
          }

          .hero-work-list {
            order: -1;
          }

          .hero-work-grid {
            display: flex !important;
            grid-template-columns: none !important;
            overflow-x: auto;
            overscroll-behavior-x: contain;
            scroll-snap-type: x proximity;
            padding-bottom: 0.25rem;
            width: 100% !important;
            max-width: 100% !important;
          }

          .hero-work-card {
            width: min(76vw, 320px) !important;
            min-width: min(76vw, 320px) !important;
            max-width: min(76vw, 320px) !important;
            scroll-snap-align: start;
          }

          .hero-work-card strong,
          .hero-work-card span {
            overflow-wrap: anywhere;
          }

          .hero-work-preview {
            transform: scale(0.82);
            transform-origin: right bottom;
          }

          .hero-session-action-link {
            grid-column: 1 / -1;
          }

        }

        .hero-cta:focus-visible,
        .hero-goal-link:focus-visible,
        .hero-session-action-link:focus-visible,
        .hero-session-button:focus-visible,
        .hero-work-card:focus-visible {
          outline: 3px solid var(--cherry-red);
          outline-offset: 4px;
        }

        .hero-goal-link {
          transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
        }

        .hero-goal-link:hover,
        .hero-goal-link:focus-visible {
          transform: translateY(-2px);
          background: var(--cherry-yellow-light);
          border-color: var(--cherry-yellow);
        }

        .hero-session-action-link {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .hero-session-action-link:hover,
        .hero-session-action-link:focus-visible {
          transform: translateY(-2px);
          box-shadow: 3px 6px 0 rgba(94,68,42,0.1);
        }

        .hero-work-card {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .hero-work-card:hover,
        .hero-work-card:focus-visible {
          transform: translateY(-2px);
          box-shadow: 3px 6px 0 rgba(94,68,42,0.1);
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-cta,
          .hero-goal-link,
          .hero-session-action-link,
          .hero-session-button,
          .hero-work-card {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
