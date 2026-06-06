import type { MouseEvent } from "react";
import { works } from "./Works";
import { IconBook, IconBranch, IconDNA, IconLeafSmall, IconMicroscope, IconTestTube } from "./Icons";
import { getWorkToolHref, navigateClient, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";

type HeroVisualKind =
  | "gene-expression"
  | "research-prompt-kit"
  | "concept-explainer"
  | "crispr-interactive"
  | "reading-library";

function HeroMiniVisual({ kind }: { kind: HeroVisualKind }) {
  if (kind === "gene-expression") {
    return (
      <span className="hero-mini-visual hero-mini-visual-gene" aria-hidden="true">
        <span className="hero-mini-dna">
          {["A", "T", "G", "C"].map((base, index) => (
            <span key={`${base}-${index}`}>{base}</span>
          ))}
        </span>
        <span className="hero-mini-rna" />
        <span className="hero-mini-ribosome" />
        <span className="hero-mini-chain">
          {[0, 1, 2, 3].map((dot) => (
            <i key={dot} />
          ))}
        </span>
      </span>
    );
  }

  if (kind === "research-prompt-kit") {
    return (
      <span className="hero-mini-visual hero-mini-visual-research" aria-hidden="true">
        <span className="hero-mini-paper">
          <i />
          <i />
          <i />
        </span>
        <span className="hero-mini-checklist">
          <i />
          <i />
          <i />
        </span>
      </span>
    );
  }

  if (kind === "concept-explainer") {
    return (
      <span className="hero-mini-visual hero-mini-visual-concept" aria-hidden="true">
        <span>定义</span>
        <i />
        <span>机制</span>
        <i />
        <span>迁移</span>
      </span>
    );
  }

  if (kind === "reading-library") {
    return (
      <span className="hero-mini-visual hero-mini-visual-reading" aria-hidden="true">
        <span className="hero-mini-book" />
        <span className="hero-mini-lines">
          <i />
          <i />
          <i />
        </span>
      </span>
    );
  }

  return (
    <span className="hero-mini-visual hero-mini-visual-crispr" aria-hidden="true">
      <span className="hero-mini-guide" />
      <span className="hero-mini-cas" />
      <span className="hero-mini-cut" />
    </span>
  );
}

export function Hero() {
  const readingEntry = {
    key: "reading",
    kind: "阅读",
    title: "阅读库",
    href: "/reading",
    border: "var(--cherry-yellow)",
    color: "var(--cherry-yellow-light)",
    desc: "科研证据、学习方法和 AI 创作工作流文章。",
    task: "按卡点选择文章，读完后留下行动清单、检查项和可复用模板。",
    icon: <IconBook size={30} color="var(--cherry-yellow)" />,
    outputs: ["行动清单", "检查项", "可套用模板"],
    path: ["选主题", "做记录", "留产出"],
    featuredImage: null,
    visualKind: "reading-library" as HeroVisualKind,
  };
  const entries = [
    ...works.map((work) => ({
      key: work.slug,
      kind: work.category,
      title: work.title,
      href: getWorkToolHref(work.href),
      border: work.border,
      color: work.color,
      desc: work.desc,
      task: work.task,
      icon: work.icon,
      outputs: work.outputs,
      path: work.path,
      featuredImage: work.slug === "plant-evolution-stories" ? "/illustrations/plant-evolution-story.webp" : null,
      visualKind: work.slug === "plant-evolution-stories" ? null : (work.slug as HeroVisualKind),
    })),
    readingEntry,
  ];
  function openEntry(href: string, event: MouseEvent<HTMLAnchorElement>) {
    if (!shouldUseClientNavigation(event)) return;
    event.preventDefault();
    navigateClient(href);
  }

  return (
    <section
      className="hero-shell"
      aria-labelledby="hero-heading"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        minHeight: "calc(100vh - 50px)",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(1.55rem, 3.2vh, 2.35rem) clamp(1rem, 3.4vw, 3rem) 1.25rem",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        background: "#F7F5EF",
        display: "grid",
        alignItems: "start",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div className="hero-technical-grid" style={{ position: "absolute", inset: "0 0 auto 0", height: 260, opacity: 0.54 }} />
        <div className="hero-soft-blob hero-soft-blob-sage" />
        <div className="hero-soft-blob hero-soft-blob-yellow" />
        <div className="hero-soft-blob hero-soft-blob-blue" />
        <div className="hero-soft-blob hero-soft-blob-peach" />
        <div className="hero-dot-field" style={{ position: "absolute", width: 128, height: 112, left: "0.8rem", top: "6.1rem", opacity: 0.16 }} />
        <div className="hero-dot-field" style={{ position: "absolute", width: 148, height: 120, right: "3.2rem", bottom: "2rem", opacity: 0.18 }} />
        <div className="hero-stem hero-stem-left" />
        <div className="hero-stem hero-stem-right" />
        <div className="hero-float-deco hero-float-microscope"><IconMicroscope size={42} color="var(--cherry-blue)" /></div>
        <div className="hero-float-deco hero-float-dna"><IconDNA size={44} color1="var(--cherry-red)" color2="var(--cherry-blue)" /></div>
        <div className="hero-float-deco hero-float-tube"><IconTestTube size={34} color="var(--cherry-peach)" /></div>
        <div className="hero-float-deco hero-float-leaf"><IconLeafSmall size={28} color="var(--cherry-sage)" /></div>
      </div>

      <div className="hero-inner" style={{ position: "relative", zIndex: 2, maxWidth: 2060, width: "100%", minWidth: 0, margin: "0 auto", boxSizing: "border-box", display: "grid", gap: "0.88rem", alignContent: "start" }}>
        <div className="hero-heading-strip" style={{ display: "grid", gridTemplateColumns: "minmax(330px, 0.78fr) minmax(420px, 1fr)", gap: "1rem", alignItems: "end", minWidth: 0 }}>
          <div className="hero-copy-panel" style={{ minWidth: 0, display: "grid", gap: "0.58rem", justifyItems: "start", textAlign: "left", alignContent: "start", maxWidth: 660 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, width: "fit-content", border: "1.5px dashed var(--cherry-yellow)", borderRadius: 999, padding: "0.32rem 0.92rem", color: "var(--cherry-forest)", fontSize: "0.76rem", fontWeight: 850, background: "rgba(250,247,241,0.72)", letterSpacing: 0 }}>
              <IconBranch size={13} color="var(--cherry-forest)" />
              By Cherry · Science Studio
            </div>
            <h1
              id="hero-heading"
              className="hero-title"
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontSize: "clamp(2rem, 3.2vw, 3.55rem)",
                fontWeight: 900,
                lineHeight: 1.02,
                color: "var(--cherry-warm-brown)",
                margin: "0",
                letterSpacing: 0,
                overflowWrap: "anywhere",
              }}
            >
              A tiny studio for
              <br className="hero-title-break" />
              <span style={{ color: "var(--cherry-red)", textDecoration: "underline", textDecorationColor: "var(--cherry-peach)", textDecorationThickness: "0.08em", textUnderlineOffset: "0.12em" }}>science</span>
              ,{" "}
              <span style={{ color: "var(--cherry-sage)" }}>learning</span>
              <br className="hero-title-mobile-break" />
              {" & "}
              <span style={{ color: "var(--cherry-blue)" }}>AI</span>
            </h1>
            <p style={{ margin: 0, color: "var(--cherry-warm-mid)", fontSize: "clamp(0.88rem, 0.96vw, 1.02rem)", lineHeight: 1.54, fontWeight: 760, maxWidth: 360 }}>
              科学模拟、科研阅读和 AI 学习工具，打开后直接进入可操作内容。
            </p>
          </div>

          <div className="hero-summary-panel" style={{ minWidth: 0, border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 14, background: "rgba(250,247,241,0.72)", padding: "0.78rem 0.86rem", boxShadow: "0 12px 28px rgba(94,68,42,0.06)", display: "grid", gap: "0.36rem" }}>
            <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.92rem", lineHeight: 1.2, fontWeight: 950 }}>按一个学习任务开始。</strong>
            <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.5, fontWeight: 780 }}>
              看分子过程、读科研证据、生成学习卡、核查概念边界，入口都直接进入可操作内容。
            </span>
          </div>
        </div>

        <div className="hero-featured-panel" style={{ minWidth: 0, display: "grid", gap: "0.62rem", width: "100%", alignContent: "start" }}>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: "0.75rem", minWidth: 0 }}>
            <h2 style={{ margin: 0, color: "var(--cherry-warm-brown)", fontSize: "1.02rem", lineHeight: 1.2, fontWeight: 950, textAlign: "left" }}>精选内容</h2>
            <span className="hero-entry-grid-note" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.2, fontWeight: 880, textAlign: "right" }}>直接打开工具和文章</span>
          </div>
          <nav id="works" className="hero-entry-grid" aria-label="内容目录" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gridAutoRows: "minmax(224px, 1fr)", gap: "0.72rem", minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}>
            {entries.map((entry, index) => (
              <a
                className={`hero-entry-row ${entry.featuredImage ? "hero-entry-row-image" : ""}`}
                key={entry.key}
                href={entry.href}
                aria-label={`打开${entry.title}：${entry.desc}`}
                onClick={(event) => openEntry(entry.href, event)}
                onMouseEnter={() => preloadRouteForHref(entry.href)}
                onFocus={() => preloadRouteForHref(entry.href)}
                onPointerDown={() => preloadRouteForHref(entry.href)}
                style={{
                  background: entry.color,
                  border: `2px solid ${entry.border}`,
                  borderRadius: 12,
                  padding: entry.featuredImage ? "0.88rem 6.3rem 0.82rem 0.92rem" : "0.88rem 0.92rem 0.82rem",
                  color: "var(--cherry-warm-brown)",
                  textDecoration: "none",
                  textAlign: "left",
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr)",
                  alignItems: "stretch",
                  gap: "0.42rem",
                  position: "relative",
                  overflow: "hidden",
                  minWidth: 0,
                  maxWidth: "100%",
                  minHeight: 224,
                  boxSizing: "border-box",
                  boxShadow: "0 12px 24px rgba(94,68,42,0.08)",
                  transform: "none",
                }}
              >
                <span aria-hidden="true" style={{ position: "absolute", left: "0.72rem", right: "0.72rem", top: 0, height: 3, borderRadius: "0 0 999px 999px", background: entry.border, opacity: 0.82 }} />
                <span style={{ minWidth: 0, display: "grid", gap: "0.38rem", alignContent: "start" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
                    <span aria-hidden="true" style={{ display: "inline-grid", placeItems: "center", width: 30, height: 30, borderRadius: 999, background: "rgba(250,247,241,0.64)", flexShrink: 0 }}>
                      {entry.icon}
                    </span>
                    <strong style={{ fontSize: "0.98rem", lineHeight: 1.15, minWidth: 0, overflowWrap: "anywhere", fontWeight: 950 }}>{entry.title}</strong>
                    <span aria-hidden="true" style={{ marginLeft: "auto", flexShrink: 0, color: "rgba(62,42,26,0.34)", fontSize: "0.62rem", lineHeight: 1, fontWeight: 950, letterSpacing: 0 }}>{String(index + 1).padStart(2, "0")}</span>
                  </span>
                  <span className="hero-entry-desc" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.42, fontWeight: 820 }}>
                    {entry.desc}
                  </span>
                  <span className="hero-entry-task" style={{ color: "var(--cherry-warm-brown)", fontSize: "0.72rem", lineHeight: 1.48, fontWeight: 820, background: "rgba(250,247,241,0.46)", border: "1px solid rgba(94,68,42,0.08)", borderRadius: 8, padding: "0.42rem 0.5rem" }}>
                    {entry.task}
                  </span>
                  <span className="hero-entry-path" style={{ display: "flex", gap: "0.24rem", flexWrap: "wrap", alignItems: "center", color: "var(--cherry-warm-mid)", fontSize: "0.65rem", lineHeight: 1.2, fontWeight: 900 }}>
                    {entry.path.map((step, index) => (
                      <span key={`${entry.key}-${step}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.24rem" }}>
                        <span>{step}</span>
                        {index < entry.path.length - 1 ? <span aria-hidden="true" style={{ opacity: 0.58 }}>→</span> : null}
                      </span>
                    ))}
                  </span>
                  <span className="hero-entry-output-row" style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                    {entry.outputs.slice(0, 3).map((output) => (
                      <span key={output} style={{ background: "rgba(250,247,241,0.72)", borderRadius: 999, padding: "0.18rem 0.42rem", color: "var(--cherry-warm-brown)", fontSize: "0.64rem", fontWeight: 950 }}>
                        {output}
                      </span>
                    ))}
                  </span>
                </span>
                {entry.featuredImage ? (
                  <img src={entry.featuredImage} alt="" aria-hidden="true" loading="eager" style={{ position: "absolute", right: "0.62rem", bottom: "0.62rem", width: 86, height: 72, objectFit: "cover", borderRadius: 10, border: "1.5px solid rgba(250,247,241,0.72)" }} />
                ) : entry.visualKind ? (
                  <span className="hero-entry-visual-row" aria-hidden="true">
                    <HeroMiniVisual kind={entry.visualKind} />
                  </span>
                ) : null}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <style>{`
        .hero-technical-grid {
          background:
            linear-gradient(rgba(58,92,62,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,92,62,0.07) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.72), transparent);
        }

        .hero-dot-field {
          background-image: radial-gradient(circle, rgba(94,68,42,0.22) 2px, transparent 2px);
          background-size: 22px 22px;
        }

        .hero-soft-blob {
          position: absolute;
          border-radius: 58% 42% 52% 48% / 46% 58% 42% 54%;
          filter: blur(1px);
          opacity: 0.34;
        }

        .hero-soft-blob-sage {
          width: min(32vw, 520px);
          height: 285px;
          right: 4%;
          top: 7%;
          background: var(--cherry-sage-light);
        }

        .hero-soft-blob-yellow {
          width: min(26vw, 390px);
          height: 220px;
          left: 2%;
          bottom: 7%;
          background: var(--cherry-yellow-light);
        }

        .hero-soft-blob-blue {
          width: min(22vw, 330px);
          height: 210px;
          right: 15%;
          bottom: 10%;
          background: var(--cherry-blue-light);
        }

        .hero-soft-blob-peach {
          width: min(18vw, 270px);
          height: 170px;
          left: 6%;
          top: 21%;
          background: var(--cherry-peach-light);
        }

        .hero-stem {
          position: absolute;
          width: 58px;
          height: 86px;
          opacity: 0.44;
        }

        .hero-stem::before {
          content: "";
          position: absolute;
          left: 28px;
          bottom: 0;
          width: 2px;
          height: 76px;
          border-radius: 999px;
          background: var(--cherry-forest);
        }

        .hero-stem::after {
          content: "";
          position: absolute;
          left: 8px;
          top: 24px;
          width: 28px;
          height: 38px;
          border-radius: 80% 20% 70% 30%;
          background: var(--cherry-sage);
          transform: rotate(-24deg);
        }

        .hero-stem-left {
          left: 2rem;
          bottom: 0;
        }

        .hero-stem-right {
          right: 1.8rem;
          bottom: 0.3rem;
          transform: scaleX(-1);
        }

        .hero-float-deco {
          position: absolute;
          display: grid;
          place-items: center;
          width: 3.25rem;
          height: 3.25rem;
          border-radius: 999px;
          background: rgba(250,247,241,0.58);
          border: 1px solid rgba(94,68,42,0.1);
          box-shadow: 0 10px 24px rgba(94,68,42,0.08);
          animation: heroFloatDeco 5.2s ease-in-out infinite;
        }

        .hero-float-microscope {
          left: 19%;
          top: 22%;
        }

        .hero-float-dna {
          left: 14%;
          bottom: 23%;
          animation-delay: -1.2s;
        }

        .hero-float-tube {
          right: 8%;
          bottom: 25%;
          animation-delay: -0.7s;
        }

        .hero-float-leaf {
          right: 24%;
          top: 18%;
          animation-delay: -1.8s;
        }

        @keyframes heroFloatDeco {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .hero-entry-desc {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .hero-entry-task {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .hero-title-mobile-break {
          display: none;
        }

        .hero-entry-row:focus-visible {
          outline: 3px solid var(--cherry-red);
          outline-offset: 4px;
        }

        .hero-entry-row {
          transition: color 0.18s ease, background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
        }

        .hero-entry-row:hover,
        .hero-entry-row:focus-visible {
          background: rgba(250,247,241,0.42) !important;
          transform: translateY(-2px) rotate(0deg) !important;
          box-shadow: 5px 10px 0 rgba(94,68,42,0.1), 0 18px 34px rgba(94,68,42,0.08) !important;
        }

        .hero-mini-visual {
          position: relative;
          display: block;
          width: 4.7rem;
          height: 2.6rem;
          border: 1px solid rgba(94,68,42,0.1);
          border-radius: 12px;
          background: rgba(250,247,241,0.56);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.55);
          pointer-events: none;
          flex: 0 0 auto;
        }

        .hero-entry-visual-row {
          position: absolute;
          right: 0.54rem;
          bottom: 0.48rem;
          display: flex;
          justify-content: flex-end;
          align-items: end;
          pointer-events: none;
        }

        .hero-mini-visual-gene .hero-mini-dna {
          position: absolute;
          left: 0.3rem;
          top: 0.32rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.1rem;
          width: 4rem;
        }

        .hero-mini-visual-gene .hero-mini-dna span {
          display: grid;
          place-items: center;
          width: 0.88rem;
          height: 0.88rem;
          border-radius: 999px;
          background: rgba(95,145,115,0.18);
          color: var(--cherry-forest);
          font-size: 0.4rem;
          font-weight: 950;
        }

        .hero-mini-visual-gene .hero-mini-rna {
          position: absolute;
          left: 0.56rem;
          top: 1.3rem;
          width: 2.8rem;
          height: 0.82rem;
          border-bottom: 3px solid var(--cherry-blue);
          border-radius: 0 0 80% 70%;
          transform: rotate(-7deg);
        }

        .hero-mini-visual-gene .hero-mini-ribosome {
          position: absolute;
          right: 0.72rem;
          bottom: 0.44rem;
          width: 0.92rem;
          height: 0.66rem;
          border-radius: 999px 999px 0.7rem 0.7rem;
          background: rgba(94,68,42,0.54);
        }

        .hero-mini-visual-gene .hero-mini-chain {
          position: absolute;
          right: 0.3rem;
          bottom: 1.02rem;
          display: flex;
          gap: 0.1rem;
          transform: rotate(-22deg);
        }

        .hero-mini-visual-gene .hero-mini-chain i {
          width: 0.32rem;
          height: 0.32rem;
          border-radius: 999px;
          background: var(--cherry-red);
        }

        .hero-mini-visual-research .hero-mini-paper {
          position: absolute;
          left: 0.4rem;
          top: 0.32rem;
          width: 1.86rem;
          height: 2rem;
          border-radius: 0.36rem;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(94,68,42,0.13);
          display: grid;
          gap: 0.14rem;
          align-content: center;
          padding: 0.28rem;
        }

        .hero-mini-visual-research .hero-mini-paper i {
          height: 0.2rem;
          border-radius: 999px;
          background: rgba(94,68,42,0.28);
        }

        .hero-mini-visual-research .hero-mini-checklist {
          position: absolute;
          right: 0.38rem;
          top: 0.58rem;
          display: grid;
          gap: 0.3rem;
        }

        .hero-mini-visual-research .hero-mini-checklist i {
          width: 1.38rem;
          height: 0.3rem;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--cherry-forest) 0 0.32rem, rgba(94,68,42,0.22) 0.32rem);
        }

        .hero-mini-visual-concept {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.16rem;
        }

        .hero-mini-visual-concept span {
          display: grid;
          place-items: center;
          width: 1.12rem;
          height: 1.12rem;
          border-radius: 999px;
          background: rgba(123,108,196,0.15);
          color: #5F548F;
          font-size: 0.4rem;
          font-weight: 950;
        }

        .hero-mini-visual-concept i {
          width: 0.42rem;
          height: 2px;
          border-radius: 999px;
          background: rgba(94,68,42,0.28);
        }

        .hero-mini-visual-crispr::before {
          content: "";
          position: absolute;
          left: 0.4rem;
          right: 0.4rem;
          top: 1.24rem;
          height: 0.3rem;
          border-radius: 999px;
          background: repeating-linear-gradient(90deg, var(--cherry-blue) 0 0.38rem, rgba(250,247,241,0.85) 0.38rem 0.52rem, var(--cherry-red) 0.52rem 0.9rem);
        }

        .hero-mini-visual-crispr .hero-mini-guide {
          position: absolute;
          left: 0.78rem;
          top: 0.9rem;
          width: 2.36rem;
          height: 0.18rem;
          border-radius: 999px;
          background: var(--cherry-red);
        }

        .hero-mini-visual-crispr .hero-mini-cas {
          position: absolute;
          right: 0.9rem;
          top: 0.78rem;
          width: 0.9rem;
          height: 0.9rem;
          border-radius: 45% 55% 50% 50%;
          background: rgba(95,145,115,0.7);
        }

        .hero-mini-visual-crispr .hero-mini-cut {
          position: absolute;
          right: 0.74rem;
          top: 0.88rem;
          width: 0.42rem;
          height: 1.1rem;
          border-left: 2px solid rgba(94,68,42,0.44);
          transform: rotate(26deg);
        }

        .hero-mini-visual-reading .hero-mini-book {
          position: absolute;
          left: 0.44rem;
          top: 0.4rem;
          width: 1.34rem;
          height: 1.72rem;
          border-radius: 0.2rem 0.36rem 0.36rem 0.2rem;
          background: rgba(250,247,241,0.82);
          border: 1px solid rgba(94,68,42,0.14);
          box-shadow: inset 0.24rem 0 0 rgba(213,182,85,0.38);
        }

        .hero-mini-visual-reading .hero-mini-lines {
          position: absolute;
          right: 0.48rem;
          top: 0.62rem;
          display: grid;
          gap: 0.26rem;
          width: 2.04rem;
        }

        .hero-mini-visual-reading .hero-mini-lines i {
          height: 0.24rem;
          border-radius: 999px;
          background: rgba(94,68,42,0.24);
        }

        @media (max-width: 980px) {
          .hero-shell {
            min-height: auto !important;
            padding: 1.25rem 1rem 1rem !important;
          }

          .hero-inner,
          .hero-heading-strip {
            width: 100% !important;
            max-width: calc(100vw - 2rem) !important;
            overflow-wrap: anywhere;
          }

          .hero-inner {
            min-height: auto !important;
          }

          .hero-heading-strip {
            grid-template-columns: 1fr !important;
            gap: 0.9rem !important;
          }

          .hero-copy-panel {
            max-width: 100% !important;
          }

          .hero-title {
            font-size: 2.02rem !important;
            line-height: 1.04 !important;
          }

          .hero-entry-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            grid-auto-rows: minmax(142px, auto) !important;
            gap: 0.52rem !important;
            width: calc(100vw - 2rem) !important;
            max-width: calc(100vw - 2rem) !important;
            box-sizing: border-box;
          }

          .hero-entry-row {
            min-width: 0 !important;
            box-sizing: border-box;
            padding: 0.56rem !important;
            min-height: 142px !important;
            border-radius: 12px !important;
            transform: none !important;
          }

          .hero-entry-row-image {
            padding-right: 0.56rem !important;
          }

          .hero-entry-row-image img,
          .hero-mini-visual,
          .hero-float-deco,
          .hero-stem-right {
            display: none !important;
          }

          .hero-entry-row strong,
          .hero-entry-row span {
            overflow-wrap: anywhere;
          }
        }

        @media (max-width: 560px) {
          .hero-shell {
            padding-left: 0.85rem !important;
            padding-right: 0.85rem !important;
          }

          .hero-inner,
          .hero-heading-strip,
          .hero-featured-panel,
          .hero-summary-panel,
          .hero-entry-grid {
            width: calc(100vw - 3rem) !important;
            max-width: calc(100vw - 3rem) !important;
          }

          .hero-title {
            font-size: 1.58rem !important;
            line-height: 1.06 !important;
          }

          .hero-title-mobile-break {
            display: block;
          }

          .hero-entry-grid {
            grid-template-columns: 1fr !important;
            justify-items: stretch !important;
          }

          .hero-summary-panel,
          .hero-entry-row {
            max-width: 20rem !important;
          }

          .hero-entry-row {
            justify-self: start !important;
          }

          .hero-entry-grid-note {
            display: none !important;
          }

          .hero-entry-desc {
            -webkit-line-clamp: 2 !important;
          }

          .hero-entry-output-row {
            display: none !important;
          }

          .hero-entry-task {
            display: none !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-entry-row,
          .hero-float-deco {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
