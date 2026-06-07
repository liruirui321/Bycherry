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
    icon: <IconBook size={23} color="var(--cherry-yellow)" />,
    path: ["选主题", "做记录", "留产出"],
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
      icon: work.icon,
      path: work.path,
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
        padding: "clamp(1.1rem, 3.6vh, 2.6rem) clamp(1rem, 3vw, 2.6rem) clamp(1rem, 2.6vh, 1.8rem)",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        background: "#F7F5EF",
        display: "grid",
        alignItems: "start",
        alignContent: "start",
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

      <div className="hero-inner" style={{ position: "relative", zIndex: 2, maxWidth: 1280, width: "100%", minWidth: 0, margin: "0 auto", boxSizing: "border-box", display: "grid", gridTemplateColumns: "minmax(300px, 0.82fr) minmax(520px, 1.18fr)", gap: "clamp(1.1rem, 3vw, 3rem)", alignItems: "center" }}>
        <div className="hero-copy-panel" style={{ minWidth: 0, display: "grid", gap: "1rem", justifyItems: "start", textAlign: "left", alignContent: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, width: "fit-content", border: "1.5px dashed var(--cherry-yellow)", borderRadius: 999, padding: "0.36rem 1rem", color: "var(--cherry-forest)", fontSize: "0.8rem", fontWeight: 850, background: "rgba(250,247,241,0.76)", letterSpacing: 0 }}>
            <IconBranch size={13} color="var(--cherry-forest)" />
            By Cherry · Science Studio
          </div>
          <h1
            id="hero-heading"
            className="hero-title"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: "clamp(2.36rem, 4.5vw, 4.35rem)",
              fontWeight: 920,
              lineHeight: 1.03,
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
          <p style={{ margin: 0, color: "var(--cherry-warm-mid)", fontSize: "clamp(0.95rem, 1.1vw, 1.1rem)", lineHeight: 1.62, fontWeight: 760, maxWidth: 500 }}>
            科学模拟、科研阅读和 AI 学习工具，打开后直接阅读、操作和练习。
          </p>
          <div className="hero-scope-row" role="group" aria-label="内容范围" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {["科学模拟", "科研阅读", "AI 学习", "可保存记录"].map((item) => (
              <span key={item} style={{ border: "1px solid rgba(94,68,42,0.12)", borderRadius: 999, background: "rgba(250,247,241,0.66)", color: "var(--cherry-warm-brown)", padding: "0.28rem 0.62rem", fontSize: "0.72rem", fontWeight: 880 }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-featured-panel" style={{ minWidth: 0, display: "grid", gap: "0.62rem", width: "100%", alignContent: "center" }}>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: "0.75rem", minWidth: 0 }}>
            <h2 style={{ margin: 0, color: "var(--cherry-warm-brown)", fontSize: "1.04rem", lineHeight: 1.2, fontWeight: 950, textAlign: "left" }}>内容目录</h2>
            <span className="hero-entry-grid-note" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.2, fontWeight: 880, textAlign: "right" }}>当前可打开的主题和阅读</span>
          </div>
          <nav id="works" className="hero-entry-list" aria-label="内容目录" style={{ display: "grid", gap: "0.48rem", minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}>
            {entries.map((entry, index) => (
              <a
                className="hero-entry-row"
                key={entry.key}
                href={entry.href}
                aria-label={`打开${entry.title}：${entry.desc}`}
                onClick={(event) => openEntry(entry.href, event)}
                onMouseEnter={() => preloadRouteForHref(entry.href)}
                onFocus={() => preloadRouteForHref(entry.href)}
                onPointerDown={() => preloadRouteForHref(entry.href)}
                style={{
                  background: "rgba(250,247,241,0.7)",
                  border: `1.5px solid ${entry.border}`,
                  borderLeft: `0.42rem solid ${entry.border}`,
                  borderRadius: 10,
                  padding: "0.54rem 0.66rem 0.54rem 0.58rem",
                  color: "var(--cherry-warm-brown)",
                  textDecoration: "none",
                  textAlign: "left",
                  display: "grid",
                  gridTemplateColumns: "2.35rem minmax(0, 1fr) auto",
                  alignItems: "center",
                  gap: "0.68rem",
                  position: "relative",
                  overflow: "hidden",
                  minWidth: 0,
                  maxWidth: "100%",
                  minHeight: 76,
                  boxSizing: "border-box",
                  boxShadow: "0 8px 18px rgba(94,68,42,0.055)",
                  transform: "none",
                }}
              >
                <span aria-hidden="true" style={{ display: "inline-grid", placeItems: "center", width: 37, height: 37, borderRadius: 10, background: entry.color, flexShrink: 0 }}>
                  <span style={{ transform: "scale(0.64)", display: "grid", placeItems: "center" }}>{entry.icon}</span>
                </span>
                <span style={{ minWidth: 0, display: "grid", gap: "0.25rem", alignContent: "center" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.42rem", minWidth: 0 }}>
                    <strong style={{ fontSize: "0.9rem", lineHeight: 1.14, minWidth: 0, overflowWrap: "anywhere", fontWeight: 950 }}>{entry.title}</strong>
                    <span style={{ flexShrink: 0, color: "var(--cherry-forest)", fontSize: "0.62rem", lineHeight: 1, fontWeight: 950, borderRadius: 999, background: "rgba(95,145,115,0.13)", padding: "0.16rem 0.38rem" }}>{entry.kind}</span>
                  </span>
                  <span className="hero-entry-desc" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.36, fontWeight: 800 }}>
                    {entry.desc}
                  </span>
                  <span className="hero-entry-path" style={{ display: "flex", gap: "0.24rem", flexWrap: "wrap", alignItems: "center", color: "var(--cherry-warm-mid)", fontSize: "0.62rem", lineHeight: 1.2, fontWeight: 900 }}>
                    {entry.path.map((step, stepIndex) => (
                      <span key={`${entry.key}-${step}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.24rem" }}>
                        <span>{step}</span>
                        {stepIndex < entry.path.length - 1 ? <span aria-hidden="true" style={{ opacity: 0.58 }}>→</span> : null}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="hero-entry-side" aria-hidden="true" style={{ display: "grid", justifyItems: "end", gap: "0.24rem", alignItems: "center" }}>
                  {entry.visualKind ? <HeroMiniVisual kind={entry.visualKind} /> : <span style={{ color: "rgba(62,42,26,0.34)", fontSize: "0.74rem", lineHeight: 1, fontWeight: 950 }}>{String(index + 1).padStart(2, "0")}</span>}
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
          opacity: 0.42;
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
          width: min(34vw, 500px);
          height: 270px;
          right: 3%;
          top: 8%;
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
          width: min(22vw, 320px);
          height: 205px;
          right: 18%;
          bottom: 10%;
          background: var(--cherry-blue-light);
        }

        .hero-dot-field {
          position: absolute;
          width: 128px;
          height: 112px;
          opacity: 0.14;
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
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        .hero-title-break {
          display: none;
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
          background: rgba(250,247,241,0.92) !important;
          transform: translateY(-2px) !important;
          box-shadow: 4px 8px 0 rgba(94,68,42,0.08), 0 16px 30px rgba(94,68,42,0.08) !important;
        }

        .hero-mini-visual {
          position: relative;
          display: block;
          width: 4.2rem;
          height: 2.25rem;
          border: 1px solid rgba(94,68,42,0.1);
          border-radius: 9px;
          background: rgba(250,247,241,0.56);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.55);
          pointer-events: none;
          flex: 0 0 auto;
        }

        .hero-mini-visual-gene .hero-mini-dna {
          position: absolute;
          left: 0.28rem;
          top: 0.28rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.08rem;
          width: 3.55rem;
        }

        .hero-mini-visual-gene .hero-mini-dna span {
          display: grid;
          place-items: center;
          width: 0.76rem;
          height: 0.76rem;
          border-radius: 999px;
          background: rgba(95,145,115,0.18);
          color: var(--cherry-forest);
          font-size: 0.36rem;
          font-weight: 950;
        }

        .hero-mini-visual-gene .hero-mini-rna {
          position: absolute;
          left: 0.52rem;
          top: 1.12rem;
          width: 2.46rem;
          height: 0.7rem;
          border-bottom: 3px solid var(--cherry-blue);
          border-radius: 0 0 80% 70%;
          transform: rotate(-7deg);
        }

        .hero-mini-visual-gene .hero-mini-ribosome {
          position: absolute;
          right: 0.62rem;
          bottom: 0.38rem;
          width: 0.82rem;
          height: 0.58rem;
          border-radius: 999px 999px 0.7rem 0.7rem;
          background: rgba(94,68,42,0.54);
        }

        .hero-mini-visual-gene .hero-mini-chain {
          position: absolute;
          right: 0.26rem;
          bottom: 0.88rem;
          display: flex;
          gap: 0.08rem;
          transform: rotate(-22deg);
        }

        .hero-mini-visual-gene .hero-mini-chain i {
          width: 0.28rem;
          height: 0.28rem;
          border-radius: 999px;
          background: var(--cherry-red);
        }

        .hero-mini-visual-research .hero-mini-paper {
          position: absolute;
          left: 0.36rem;
          top: 0.28rem;
          width: 1.62rem;
          height: 1.72rem;
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
          right: 0.34rem;
          top: 0.5rem;
          display: grid;
          gap: 0.26rem;
        }

        .hero-mini-visual-research .hero-mini-checklist i {
          width: 1.2rem;
          height: 0.26rem;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--cherry-forest) 0 0.28rem, rgba(94,68,42,0.22) 0.28rem);
        }

        .hero-mini-visual-concept {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.14rem;
        }

        .hero-mini-visual-concept span {
          display: grid;
          place-items: center;
          width: 1rem;
          height: 1rem;
          border-radius: 999px;
          background: rgba(123,108,196,0.15);
          color: #5F548F;
          font-size: 0.36rem;
          font-weight: 950;
        }

        .hero-mini-visual-concept i {
          width: 0.34rem;
          height: 2px;
          border-radius: 999px;
          background: rgba(94,68,42,0.28);
        }

        .hero-mini-visual-crispr::before {
          content: "";
          position: absolute;
          left: 0.36rem;
          right: 0.36rem;
          top: 1.06rem;
          height: 0.27rem;
          border-radius: 999px;
          background: repeating-linear-gradient(90deg, var(--cherry-blue) 0 0.34rem, rgba(250,247,241,0.85) 0.34rem 0.48rem, var(--cherry-red) 0.48rem 0.82rem);
        }

        .hero-mini-visual-crispr .hero-mini-guide {
          position: absolute;
          left: 0.7rem;
          top: 0.78rem;
          width: 2.05rem;
          height: 0.16rem;
          border-radius: 999px;
          background: var(--cherry-red);
        }

        .hero-mini-visual-crispr .hero-mini-cas {
          position: absolute;
          right: 0.8rem;
          top: 0.66rem;
          width: 0.78rem;
          height: 0.78rem;
          border-radius: 45% 55% 50% 50%;
          background: rgba(95,145,115,0.7);
        }

        .hero-mini-visual-crispr .hero-mini-cut {
          position: absolute;
          right: 0.64rem;
          top: 0.78rem;
          width: 0.38rem;
          height: 0.96rem;
          border-left: 2px solid rgba(94,68,42,0.44);
          transform: rotate(26deg);
        }

        .hero-mini-visual-reading .hero-mini-book {
          position: absolute;
          left: 0.4rem;
          top: 0.34rem;
          width: 1.2rem;
          height: 1.48rem;
          border-radius: 0.18rem 0.32rem 0.32rem 0.18rem;
          background: rgba(250,247,241,0.82);
          border: 1px solid rgba(94,68,42,0.14);
          box-shadow: inset 0.22rem 0 0 rgba(213,182,85,0.38);
        }

        .hero-mini-visual-reading .hero-mini-lines {
          position: absolute;
          right: 0.42rem;
          top: 0.54rem;
          display: grid;
          gap: 0.22rem;
          width: 1.76rem;
        }

        .hero-mini-visual-reading .hero-mini-lines i {
          height: 0.22rem;
          border-radius: 999px;
          background: rgba(94,68,42,0.24);
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

          .hero-entry-row {
            min-width: 0 !important;
            box-sizing: border-box;
            min-height: 70px !important;
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
          .hero-entry-list {
            width: calc(100vw - 1.7rem) !important;
            max-width: calc(100vw - 1.7rem) !important;
          }

          .hero-title {
            font-size: 1.56rem !important;
            line-height: 1.06 !important;
          }

          .hero-title-mobile-break {
            display: block;
          }

          .hero-entry-grid-note,
          .hero-scope-row,
          .hero-entry-side,
          .hero-entry-path {
            display: none !important;
          }

          .hero-entry-row {
            grid-template-columns: 2.1rem minmax(0, 1fr) !important;
            min-height: 66px !important;
            padding: 0.48rem 0.56rem !important;
            width: 100% !important;
          }

          .hero-entry-desc {
            -webkit-line-clamp: 1 !important;
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
