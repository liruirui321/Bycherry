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
  | "plant-evolution-stories";

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

  if (kind === "plant-evolution-stories") {
    return (
      <span className="hero-mini-visual hero-mini-visual-plant" aria-hidden="true">
        <span className="hero-mini-plant-line" />
        <span className="hero-mini-plant-stage hero-mini-plant-algae" />
        <span className="hero-mini-plant-stage hero-mini-plant-moss" />
        <span className="hero-mini-plant-stage hero-mini-plant-fern" />
        <span className="hero-mini-plant-stage hero-mini-plant-flower" />
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

const heroMobileDescriptions: Record<HeroVisualKind, string> = {
  "gene-expression": "调节分子，观察 mRNA 和多肽链变化。",
  "research-prompt-kit": "整理科研材料，生成证据核查记录。",
  "concept-explainer": "输入概念，生成解释卡和即时小测。",
  "crispr-interactive": "调整 guide RNA，查看匹配和风险。",
  "plant-evolution-stories": "按阶段看关键创新、证据和自测。",
};

export function Hero() {
  const readingHref = "/reading";
  const entries = [
    ...works.map((work) => ({
      key: work.slug,
      kind: work.category,
      title: work.title,
      href: getWorkToolHref(work.href),
      border: work.border,
      color: work.color,
      desc: work.desc,
      icon: work.icon,
      path: work.path,
      outputs: work.outputs,
      visualKind: work.slug as HeroVisualKind,
      mobileDesc: heroMobileDescriptions[work.slug as HeroVisualKind],
    })),
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
        fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        minHeight: "calc(100svh - 50px)",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(2.4rem, 5vh, 3.4rem) clamp(1rem, 3vw, 2.3rem) clamp(2.2rem, 4.8vh, 3.2rem)",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        background: "#F7F5EF",
        display: "grid",
        alignItems: "center",
        alignContent: "center",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div className="hero-technical-grid" />
        <div className="hero-wash hero-wash-sage" />
        <div className="hero-wash hero-wash-yellow" />
        <div className="hero-wash hero-wash-blue" />
        <div className="hero-dot-field hero-dot-left" />
        <div className="hero-dot-field hero-dot-right" />
        <div className="hero-stem hero-stem-left" />
        <div className="hero-stem hero-stem-right" />
        <div className="hero-float-deco hero-float-microscope"><IconMicroscope size={33} color="var(--cherry-blue)" /></div>
        <div className="hero-float-deco hero-float-dna"><IconDNA size={34} color1="var(--cherry-red)" color2="var(--cherry-blue)" /></div>
        <div className="hero-float-deco hero-float-tube"><IconTestTube size={28} color="var(--cherry-peach)" /></div>
        <div className="hero-float-deco hero-float-leaf"><IconLeafSmall size={24} color="var(--cherry-sage)" /></div>
      </div>

      <div className="hero-inner" style={{ position: "relative", top: 0, zIndex: 2, maxWidth: 1480, width: "100%", minWidth: 0, margin: "0 auto", marginTop: "clamp(-6.2rem, -10vh, -4.6rem)", boxSizing: "border-box", display: "grid", gridTemplateColumns: "minmax(420px, 0.48fr) minmax(660px, 0.72fr)", gap: "clamp(2rem, 4vw, 4.2rem)", alignItems: "center" }}>
        <div className="hero-copy-panel" style={{ minWidth: 0, display: "grid", gap: "0.9rem", justifyItems: "start", textAlign: "left", alignContent: "center", paddingTop: "0" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, width: "fit-content", border: "1.5px dashed var(--cherry-yellow)", borderRadius: 999, padding: "0.36rem 1.05rem", color: "var(--cherry-forest)", fontSize: "0.86rem", fontWeight: 850, background: "rgba(250,247,241,0.76)", letterSpacing: 0 }}>
            <IconBranch size={13} color="var(--cherry-forest)" />
            By Cherry · Science Studio
          </div>
          <h1
            id="hero-heading"
            className="hero-title"
            style={{
              fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: "clamp(2.72rem, 4.35vw, 4.88rem)",
              fontWeight: 900,
              lineHeight: 1.04,
              color: "var(--cherry-warm-brown)",
              margin: "0",
              letterSpacing: 0,
              overflowWrap: "anywhere",
            }}
          >
            A tiny studio for
            <br className="hero-title-break" />
            {" "}
            <span style={{ color: "var(--cherry-red)", textDecoration: "underline", textDecorationColor: "var(--cherry-peach)", textDecorationThickness: "0.08em", textUnderlineOffset: "0.12em" }}>science</span>
            ,{" "}
            <span style={{ color: "var(--cherry-sage)" }}>learning</span>
            <br className="hero-title-mobile-break" />
            {" & "}
            <span style={{ color: "var(--cherry-blue)" }}>AI</span>
          </h1>
          <p className="hero-subtitle" style={{ margin: 0, color: "var(--cherry-warm-mid)", fontSize: "clamp(1.05rem, 1.28vw, 1.32rem)", lineHeight: 1.62, fontWeight: 760, maxWidth: 560, overflowWrap: "anywhere", wordBreak: "break-word" }}>
            科学模拟、科研阅读和 AI 学习工具，打开后直接进入内容。
          </p>
          <div className="hero-studio-index" role="group" aria-label="当前站内内容" style={{ display: "grid", gap: "0.45rem", width: "100%", maxWidth: 430, marginTop: "0.08rem" }}>
            {[
              ["科学模拟", "基因表达、CRISPR 概念模拟"],
              ["AI 学习工具", "科研材料整理、概念解释"],
              ["演化项目", "植物演化时间轴与证据卡"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "5.2rem minmax(0, 1fr)", gap: "0.62rem", alignItems: "center", borderTop: "1px solid rgba(94,68,42,0.12)", paddingTop: "0.44rem" }}>
                <span style={{ color: "var(--cherry-forest)", fontSize: "0.72rem", lineHeight: 1.25, fontWeight: 950 }}>{label}</span>
                <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.38, fontWeight: 820 }}>{value}</span>
              </div>
            ))}
          </div>
          <a
            href={readingHref}
            className="hero-reading-link"
            onClick={(event) => openEntry(readingHref, event)}
            onMouseEnter={() => preloadRouteForHref(readingHref)}
            onFocus={() => preloadRouteForHref(readingHref)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(250,247,241,0.72)",
              color: "var(--cherry-warm-brown)",
              border: "1.5px solid var(--border)",
              borderRadius: 999,
              padding: "0.62rem 1rem",
              textDecoration: "none",
              fontWeight: 900,
              fontSize: "0.82rem",
              marginTop: "0.18rem",
            }}
          >
            <IconBook size={15} color="var(--cherry-yellow)" />
            读读笔记
          </a>
        </div>

        <div className="hero-featured-panel" style={{ minWidth: 0, display: "grid", gap: "0.72rem", width: "100%", alignContent: "stretch" }}>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: "0.75rem", minWidth: 0 }}>
            <h2 style={{ margin: 0, color: "var(--cherry-warm-brown)", fontSize: "1.12rem", lineHeight: 1.2, fontWeight: 950, textAlign: "left" }}>精选内容</h2>
            <span className="hero-entry-grid-note" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.2, fontWeight: 880, textAlign: "right" }}>{entries.length} 个内容</span>
          </div>
          <nav id="works" className="hero-entry-grid" aria-label="内容目录" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.72rem", minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}>
            {entries.map((entry, index) => (
              <a
                className="hero-entry-card"
                key={entry.key}
                href={entry.href}
                aria-label={`打开${entry.title}：${entry.desc}`}
                onClick={(event) => openEntry(entry.href, event)}
                onMouseEnter={() => preloadRouteForHref(entry.href)}
                onFocus={() => preloadRouteForHref(entry.href)}
                onPointerDown={() => preloadRouteForHref(entry.href)}
                style={{
                  background: `linear-gradient(135deg, ${entry.color} 0%, rgba(250,247,241,0.84) 72%)`,
                  border: `1.5px solid ${entry.border}`,
                  borderLeft: `0.5rem solid ${entry.border}`,
                  borderRadius: 12,
                  padding: "0.86rem 0.9rem 0.82rem 0.82rem",
                  color: "var(--cherry-warm-brown)",
                  textDecoration: "none",
                  textAlign: "left",
                  display: "grid",
                  gridTemplateColumns: "2.4rem minmax(0, 1fr)",
                  gridTemplateRows: "auto 1fr auto",
                  alignItems: "start",
                  gap: "0.45rem 0.68rem",
                  position: "relative",
                  overflow: "hidden",
                  minWidth: 0,
                  maxWidth: "100%",
                  minHeight: 154,
                  boxSizing: "border-box",
                  boxShadow: "0 12px 24px rgba(94,68,42,0.07)",
                  transform: "none",
                  gridColumn: "span 2",
                  gridRow: index === 0 ? "span 2" : undefined,
                }}
              >
                <span aria-hidden="true" style={{ display: "inline-grid", placeItems: "center", width: 36, height: 36, borderRadius: 10, background: "rgba(250,247,241,0.62)", border: "1px solid rgba(94,68,42,0.08)", flexShrink: 0, gridRow: "1 / span 2" }}>
                  <span style={{ transform: "scale(0.64)", display: "grid", placeItems: "center" }}>{entry.icon}</span>
                </span>
                <span className="hero-entry-text" style={{ minWidth: 0, display: "grid", gap: "0.35rem", alignContent: "start" }}>
                  <span className="hero-entry-title-row" style={{ display: "flex", alignItems: "center", gap: "0.42rem", minWidth: 0 }}>
                    <strong style={{ fontSize: "0.92rem", lineHeight: 1.14, minWidth: 0, overflowWrap: "anywhere", fontWeight: 950 }}>{entry.title}</strong>
                    <span style={{ flexShrink: 0, color: "var(--cherry-forest)", fontSize: "0.62rem", lineHeight: 1, fontWeight: 950, borderRadius: 999, background: "rgba(95,145,115,0.13)", padding: "0.16rem 0.38rem" }}>{entry.kind}</span>
                  </span>
                  <span className="hero-entry-desc" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.42, fontWeight: 820, minWidth: 0, maxWidth: "100%" }}>
                    <span className="hero-entry-desc-full">{entry.desc}</span>
                    <span className="hero-entry-desc-short">{entry.mobileDesc}</span>
                  </span>
                </span>
                <span className="hero-entry-path" style={{ gridColumn: "2 / 3", display: "flex", gap: "0.24rem", flexWrap: "wrap", alignItems: "center", color: "var(--cherry-warm-mid)", fontSize: "0.62rem", lineHeight: 1.2, fontWeight: 900 }}>
                    {entry.path.map((step, stepIndex) => (
                      <span key={`${entry.key}-${step}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.24rem" }}>
                        <span>{step}</span>
                        {stepIndex < entry.path.length - 1 ? <span aria-hidden="true" style={{ opacity: 0.58 }}>→</span> : null}
                      </span>
                    ))}
                </span>
                {index === 0 ? (
                  <span className="hero-entry-focus-line" style={{ gridColumn: "2 / 3", color: "var(--cherry-forest)", fontSize: "0.66rem", lineHeight: 1.25, fontWeight: 950 }}>
                    固定序列 ATG GAA TTT CCG · 看 mRNA 延伸和多肽链生成
                  </span>
                ) : null}
                <span className="hero-entry-side" aria-hidden="true" style={{ gridColumn: "1 / 3", display: "flex", justifyContent: "space-between", gap: "0.68rem", alignItems: "end", minHeight: "3.55rem" }}>
                  {entry.visualKind ? <HeroMiniVisual kind={entry.visualKind} /> : <span style={{ color: "rgba(62,42,26,0.34)", fontSize: "0.74rem", lineHeight: 1, fontWeight: 950 }}>{String(index + 1).padStart(2, "0")}</span>}
                  <span className="hero-entry-output-list" style={{ display: "flex", flexWrap: "wrap", gap: "0.26rem", justifyContent: "flex-end", alignItems: "center", flex: "1 1 auto", minWidth: 0 }}>
                    {entry.outputs.slice(0, 3).map((output) => (
                      <span key={`${entry.key}-${output}`} style={{ borderRadius: 999, background: "rgba(250,247,241,0.78)", border: "1px solid rgba(94,68,42,0.1)", color: "var(--cherry-warm-mid)", padding: "0.14rem 0.42rem", fontSize: "0.58rem", lineHeight: 1.25, fontWeight: 900, whiteSpace: "nowrap" }}>
                        {output}
                      </span>
                    ))}
                  </span>
                  <span style={{ color: "rgba(62,42,26,0.45)", fontSize: "0.9rem", lineHeight: 1, fontWeight: 950 }}>→</span>
                </span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      <style>{`
        .hero-technical-grid {
          position: absolute;
          inset: 0 0 auto 0;
          height: 220px;
          opacity: 0.22;
          background:
            linear-gradient(rgba(58,92,62,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,92,62,0.055) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.72), transparent);
        }

        .hero-wash {
          position: absolute;
          border-radius: 58% 42% 52% 48% / 46% 58% 42% 54%;
          opacity: 0.26;
          filter: blur(1px);
        }

        .hero-wash-sage {
          width: min(32vw, 460px);
          height: 260px;
          right: 4%;
          top: 11%;
          background: var(--cherry-sage-light);
        }

        .hero-wash-yellow {
          width: min(28vw, 390px);
          height: 230px;
          left: 2%;
          bottom: 8%;
          background: var(--cherry-yellow-light);
        }

        .hero-wash-blue {
          width: min(21vw, 300px);
          height: 190px;
          right: 17%;
          bottom: 9%;
          background: var(--cherry-blue-light);
        }

        .hero-dot-field {
          position: absolute;
          width: 128px;
          height: 112px;
          opacity: 0.12;
          background-image: radial-gradient(circle, rgba(94,68,42,0.22) 2px, transparent 2px);
          background-size: 22px 22px;
        }

        .hero-dot-left {
          left: 0.8rem;
          top: 5.8rem;
        }

        .hero-dot-right {
          right: 3rem;
          bottom: 2rem;
          width: 148px;
          height: 120px;
        }

        .hero-stem {
          position: absolute;
          width: 58px;
          height: 86px;
          opacity: 0.42;
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
          width: 2.7rem;
          height: 2.7rem;
          border-radius: 999px;
          background: rgba(250,247,241,0.58);
          border: 1px solid rgba(94,68,42,0.1);
          box-shadow: 0 10px 24px rgba(94,68,42,0.08);
          animation: heroFloatDeco 5.2s ease-in-out infinite;
        }

        .hero-float-microscope {
          left: 19%;
          top: 21%;
        }

        .hero-float-dna {
          left: 14%;
          bottom: 24%;
          animation-delay: -1.2s;
        }

        .hero-float-tube {
          right: 7%;
          bottom: 22%;
          animation-delay: -0.7s;
        }

        .hero-float-leaf {
          right: 24%;
          top: 17%;
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

        .hero-entry-desc-short {
          display: none;
        }

        .hero-title-break {
          display: none;
        }

        .hero-title-mobile-break {
          display: none;
        }

        .hero-entry-card:focus-visible {
          outline: 3px solid var(--cherry-red);
          outline-offset: 4px;
        }

        .hero-entry-card {
          transition: color 0.18s ease, background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
        }

        .hero-entry-card::after {
          content: "";
          position: absolute;
          right: -1.4rem;
          bottom: -1.65rem;
          width: 8.5rem;
          height: 8.5rem;
          border-radius: 999px;
          background: rgba(250,247,241,0.28);
          border: 1px solid rgba(94,68,42,0.06);
          pointer-events: none;
        }

        .hero-entry-card > * {
          position: relative;
          z-index: 1;
        }

        .hero-entry-card:first-child {
          grid-template-rows: auto auto auto !important;
        }

        .hero-entry-card:first-child .hero-entry-side {
          flex-direction: column;
          align-items: stretch;
          justify-content: end;
          min-height: 8.7rem;
        }

        .hero-entry-card:first-child .hero-mini-visual {
          width: 100%;
          height: 6.35rem;
        }

        .hero-entry-card:first-child .hero-mini-visual-gene .hero-mini-dna {
          left: 1.05rem;
          top: 1rem;
          width: 8.2rem;
          gap: 0.45rem;
        }

        .hero-entry-card:first-child .hero-mini-visual-gene .hero-mini-dna span {
          width: 1.42rem;
          height: 1.42rem;
          font-size: 0.58rem;
        }

        .hero-entry-card:first-child .hero-mini-visual-gene .hero-mini-rna {
          left: 1.18rem;
          top: 3.45rem;
          width: 10.6rem;
          height: 1.9rem;
          border-bottom-width: 4px;
        }

        .hero-entry-card:first-child .hero-mini-visual-gene .hero-mini-ribosome {
          right: 2.4rem;
          bottom: 0.84rem;
          width: 2rem;
          height: 1.42rem;
        }

        .hero-entry-card:first-child .hero-mini-visual-gene .hero-mini-chain {
          right: 1.05rem;
          bottom: 1.96rem;
          gap: 0.18rem;
        }

        .hero-entry-card:first-child .hero-mini-visual-gene .hero-mini-chain i {
          width: 0.62rem;
          height: 0.62rem;
        }

        .hero-entry-card:first-child .hero-entry-output-list {
          justify-content: flex-start !important;
        }

        .hero-entry-card:hover,
        .hero-entry-card:focus-visible {
          background: rgba(250,247,241,0.92) !important;
          transform: translateY(-2px) !important;
          box-shadow: 4px 8px 0 rgba(94,68,42,0.08), 0 16px 30px rgba(94,68,42,0.08) !important;
        }

        .hero-mini-visual {
          position: relative;
          display: block;
          width: 10.2rem;
          height: 3.6rem;
          border: 1px solid rgba(94,68,42,0.1);
          border-radius: 11px;
          background:
            linear-gradient(135deg, rgba(250,247,241,0.78), rgba(250,247,241,0.48)),
            radial-gradient(circle at 18% 18%, rgba(255,255,255,0.74), transparent 34%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.55);
          pointer-events: none;
          flex: 0 0 auto;
          z-index: 1;
        }

        .hero-mini-visual-gene .hero-mini-dna {
          position: absolute;
          left: 0.62rem;
          top: 0.64rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.3rem;
          width: 6.4rem;
        }

        .hero-mini-visual-gene .hero-mini-dna span {
          display: grid;
          place-items: center;
          width: 1.16rem;
          height: 1.16rem;
          border-radius: 999px;
          background: rgba(95,145,115,0.18);
          color: var(--cherry-forest);
          font-size: 0.5rem;
          font-weight: 950;
        }

        .hero-mini-visual-gene .hero-mini-rna {
          position: absolute;
          left: 0.92rem;
          top: 2.05rem;
          width: 5.4rem;
          height: 1.28rem;
          border-bottom: 3px solid var(--cherry-blue);
          border-radius: 0 0 80% 70%;
          transform: rotate(-7deg);
        }

        .hero-mini-visual-gene .hero-mini-ribosome {
          position: absolute;
          right: 1.32rem;
          bottom: 0.58rem;
          width: 1.45rem;
          height: 1.04rem;
          border-radius: 999px 999px 0.7rem 0.7rem;
          background: rgba(94,68,42,0.54);
        }

        .hero-mini-visual-gene .hero-mini-chain {
          position: absolute;
          right: 0.52rem;
          bottom: 1.42rem;
          display: flex;
          gap: 0.14rem;
          transform: rotate(-22deg);
        }

        .hero-mini-visual-gene .hero-mini-chain i {
          width: 0.48rem;
          height: 0.48rem;
          border-radius: 999px;
          background: var(--cherry-red);
        }

        .hero-mini-visual-research .hero-mini-paper {
          position: absolute;
          left: 0.7rem;
          top: 0.58rem;
          width: 3.45rem;
          height: 3.12rem;
          border-radius: 0.32rem;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(94,68,42,0.13);
          display: grid;
          gap: 0.12rem;
          align-content: center;
          padding: 0.24rem;
        }

        .hero-mini-visual-research .hero-mini-paper i {
          height: 0.18rem;
          border-radius: 999px;
          background: rgba(94,68,42,0.28);
        }

        .hero-mini-visual-research .hero-mini-checklist {
          position: absolute;
          right: 0.95rem;
          top: 1rem;
          display: grid;
          gap: 0.32rem;
        }

        .hero-mini-visual-research .hero-mini-checklist i {
          width: 3.05rem;
          height: 0.42rem;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--cherry-forest) 0 0.28rem, rgba(94,68,42,0.22) 0.28rem);
        }

        .hero-mini-visual-concept {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.22rem;
        }

        .hero-mini-visual-concept span {
          display: grid;
          place-items: center;
          width: 1.56rem;
          height: 1.56rem;
          border-radius: 999px;
          background: rgba(123,108,196,0.15);
          color: #5F548F;
          font-size: 0.5rem;
          font-weight: 950;
        }

        .hero-mini-visual-concept i {
          width: 0.66rem;
          height: 2px;
          border-radius: 999px;
          background: rgba(94,68,42,0.28);
        }

        .hero-mini-visual-crispr::before {
          content: "";
          position: absolute;
          left: 0.52rem;
          right: 0.52rem;
          top: 1.48rem;
          height: 0.34rem;
          border-radius: 999px;
          background: repeating-linear-gradient(90deg, var(--cherry-blue) 0 0.34rem, rgba(250,247,241,0.85) 0.34rem 0.48rem, var(--cherry-red) 0.48rem 0.82rem);
        }

        .hero-mini-visual-crispr .hero-mini-guide {
          position: absolute;
          left: 0.95rem;
          top: 1.14rem;
          width: 3.02rem;
          height: 0.2rem;
          border-radius: 999px;
          background: var(--cherry-red);
        }

        .hero-mini-visual-crispr .hero-mini-cas {
          position: absolute;
          right: 1.1rem;
          top: 0.92rem;
          width: 1rem;
          height: 1rem;
          border-radius: 45% 55% 50% 50%;
          background: rgba(95,145,115,0.7);
        }

        .hero-mini-visual-crispr .hero-mini-cut {
          position: absolute;
          right: 0.86rem;
          top: 1.05rem;
          width: 0.48rem;
          height: 1.2rem;
          border-left: 2px solid rgba(94,68,42,0.44);
          transform: rotate(26deg);
        }

        .hero-mini-visual-plant .hero-mini-plant-line {
          position: absolute;
          left: 0.82rem;
          right: 0.82rem;
          bottom: 0.9rem;
          height: 0.2rem;
          border-radius: 999px;
          background: rgba(95,145,115,0.28);
        }

        .hero-mini-visual-plant .hero-mini-plant-stage {
          position: absolute;
          bottom: 0.84rem;
          border-radius: 999px;
          background: var(--cherry-sage);
          box-shadow: 0 0 0 2px rgba(250,247,241,0.8);
        }

        .hero-mini-visual-plant .hero-mini-plant-algae {
          left: 0.94rem;
          width: 0.42rem;
          height: 0.42rem;
          background: var(--cherry-blue);
        }

        .hero-mini-visual-plant .hero-mini-plant-moss {
          left: 2.36rem;
          width: 0.54rem;
          height: 0.68rem;
          border-radius: 60% 40% 45% 55%;
        }

        .hero-mini-visual-plant .hero-mini-plant-fern {
          left: 3.9rem;
          width: 0.6rem;
          height: 1.08rem;
          border-radius: 80% 20% 80% 20%;
          transform: rotate(-22deg);
          transform-origin: bottom center;
          background: var(--cherry-forest);
        }

        .hero-mini-visual-plant .hero-mini-plant-flower {
          right: 0.96rem;
          width: 0.68rem;
          height: 0.68rem;
          background: var(--cherry-red);
        }

        .hero-mini-visual-plant .hero-mini-plant-flower::before {
          content: "";
          position: absolute;
          left: 0.3rem;
          bottom: -0.62rem;
          width: 0.1rem;
          height: 0.64rem;
          border-radius: 999px;
          background: var(--cherry-forest);
        }

        @media (max-width: 980px) {
          .hero-shell {
            min-height: auto !important;
            padding: 1rem !important;
            align-items: start !important;
          }

          .hero-inner,
          .hero-featured-panel {
            width: 100% !important;
            max-width: calc(100vw - 2rem) !important;
            overflow-wrap: anywhere;
          }

          .hero-inner {
            grid-template-columns: 1fr !important;
            height: auto !important;
            min-height: auto !important;
            margin: 0 auto !important;
            margin-top: 0 !important;
            top: 0 !important;
            gap: 0.9rem !important;
          }

          .hero-copy-panel {
            max-width: 100% !important;
            gap: 0.72rem !important;
          }

          .hero-title {
            font-size: 2rem !important;
            line-height: 1.04 !important;
          }

          .hero-title-break {
            display: block;
          }

          .hero-entry-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 0.64rem !important;
          }

          .hero-entry-card {
            grid-column: auto !important;
            min-width: 0 !important;
            box-sizing: border-box;
            min-height: 142px !important;
            border-radius: 10px !important;
            transform: none !important;
          }

          .hero-float-deco,
          .hero-stem-right {
            display: none !important;
          }
        }

        @media (max-width: 560px) {
          .hero-shell {
            padding-left: 0.85rem !important;
            padding-right: 0.85rem !important;
          }

          .hero-inner,
          .hero-featured-panel,
          .hero-entry-grid {
            width: 100% !important;
            max-width: 100% !important;
          }

          .hero-entry-grid {
            grid-template-columns: 1fr !important;
            gap: 0.5rem !important;
            justify-items: start !important;
            width: calc(100% - 0.7rem) !important;
            max-width: calc(100% - 0.7rem) !important;
          }

          .hero-title {
            font-size: 1.56rem !important;
            line-height: 1.06 !important;
          }

          .hero-subtitle {
            display: block !important;
            font-size: 0.92rem !important;
            line-height: 1.45 !important;
            max-width: 100% !important;
            width: calc(100vw - 1.7rem) !important;
            white-space: normal !important;
            overflow: visible !important;
            overflow-wrap: anywhere !important;
            line-break: anywhere !important;
            word-break: break-word !important;
          }

          .hero-title-mobile-break {
            display: block;
          }

          .hero-entry-grid-note,
          .hero-studio-index,
          .hero-entry-side,
          .hero-entry-path {
            display: none !important;
          }

          .hero-entry-card {
            grid-column: auto !important;
            grid-template-columns: 2.1rem minmax(0, 1fr) !important;
            grid-template-rows: auto auto !important;
            min-height: 106px !important;
            padding: 0.58rem 0.82rem 0.58rem 0.64rem !important;
            width: 100% !important;
            max-width: 100% !important;
            justify-self: start !important;
            gap: 0.5rem !important;
            overflow: hidden !important;
          }

          .hero-entry-card::after {
            display: none !important;
          }

          .hero-entry-text,
          .hero-entry-title-row {
            min-width: 0 !important;
            max-width: 100% !important;
            overflow: hidden !important;
          }

          .hero-entry-desc {
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            font-size: 0.7rem !important;
            line-height: 1.36 !important;
            max-width: 100% !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: normal !important;
            overflow-wrap: anywhere !important;
            padding-right: 0.12rem !important;
          }

          .hero-entry-desc-full {
            display: none !important;
          }

          .hero-entry-desc-short {
            display: inline !important;
          }

          .hero-entry-card strong {
            min-width: 0 !important;
            overflow: hidden !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 1 !important;
            -webkit-box-orient: vertical !important;
          }

          .hero-entry-card strong + span {
            display: none !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-entry-card,
          .hero-float-deco {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
