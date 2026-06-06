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
    icon: <IconBook size={36} color="var(--cherry-yellow)" />,
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
        padding: "0.9rem 1.5rem 1rem",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        background: "#F7F5EF",
        display: "grid",
        alignItems: "center",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div className="hero-technical-grid" style={{ position: "absolute", inset: "0 0 auto 0", height: 260, opacity: 0.62 }} />
        <div className="hero-soft-blob hero-soft-blob-sage" />
        <div className="hero-soft-blob hero-soft-blob-yellow" />
        <div className="hero-soft-blob hero-soft-blob-blue" />
        <div className="hero-soft-blob hero-soft-blob-peach" />
        <div style={{ position: "absolute", width: "44vw", maxWidth: 620, height: 1, background: "rgba(58,92,62,0.18)", right: "2rem", top: "6.4rem" }} />
        <div style={{ position: "absolute", width: "34vw", maxWidth: 460, height: 1, background: "rgba(122,175,200,0.24)", left: "2rem", bottom: "2.6rem" }} />
        <div className="hero-dot-field" style={{ position: "absolute", width: 128, height: 112, left: "0.8rem", top: "6.1rem", opacity: 0.16 }} />
        <div className="hero-dot-field" style={{ position: "absolute", width: 148, height: 120, right: "3.2rem", bottom: "2rem", opacity: 0.18 }} />
        <div className="hero-stem hero-stem-left" />
        <div className="hero-stem hero-stem-right" />
        <div className="hero-float-deco hero-float-microscope"><IconMicroscope size={42} color="var(--cherry-blue)" /></div>
        <div className="hero-float-deco hero-float-dna"><IconDNA size={44} color1="var(--cherry-red)" color2="var(--cherry-blue)" /></div>
        <div className="hero-float-deco hero-float-tube"><IconTestTube size={34} color="var(--cherry-peach)" /></div>
        <div className="hero-float-deco hero-float-leaf"><IconLeafSmall size={28} color="var(--cherry-sage)" /></div>
      </div>

      <div className="hero-inner" style={{ position: "relative", zIndex: 2, maxWidth: 1320, width: "100%", minWidth: 0, margin: "0 auto", boxSizing: "border-box" }}>
        <div className="hero-layout" style={{ display: "grid", gridTemplateColumns: "minmax(320px, 0.72fr) minmax(0, 1.28fr)", gap: "1.6rem", alignItems: "center" }}>
          <div className="hero-copy-panel" style={{ minWidth: 0, display: "grid", gap: "1.05rem", alignContent: "center" }}>
            <div style={{ display: "grid", gap: "0.74rem", minWidth: 0 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, width: "fit-content", border: "1.5px solid rgba(58,92,62,0.22)", borderRadius: 999, padding: "0.28rem 0.68rem", color: "var(--cherry-forest)", fontSize: "0.72rem", fontWeight: 850, background: "rgba(250,247,241,0.72)", letterSpacing: 0 }}>
                <IconBranch size={13} color="var(--cherry-forest)" />
                By Cherry · Science Tools
              </div>
            <h1
              id="hero-heading"
              className="hero-title"
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontSize: "clamp(2.8rem, 5.2vw, 5.25rem)",
                fontWeight: 900,
                lineHeight: 1.04,
                color: "var(--cherry-warm-brown)",
                margin: "0",
                letterSpacing: 0,
                overflowWrap: "anywhere",
              }}
            >
              <span style={{ color: "var(--cherry-red)", textDecoration: "underline", textDecorationColor: "var(--cherry-peach)", textDecorationThickness: "0.08em", textUnderlineOffset: "0.12em" }}>Science</span>
              <br />
              learning
              <br />
              <span style={{ color: "var(--cherry-blue)" }}>AI</span>
            </h1>
            <p style={{ margin: 0, color: "var(--cherry-warm-mid)", fontSize: "clamp(1rem, 1.5vw, 1.18rem)", lineHeight: 1.72, fontWeight: 760, maxWidth: 520 }}>
              科学模拟、科研阅读和 AI 学习工具，打开后直接操作、记录和复盘。
            </p>
            <div className="hero-scope-strip" role="list" aria-label="内容范围" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.52rem", maxWidth: 560 }}>
              {[
                { label: "模拟", detail: "看见过程", icon: <IconMicroscope size={19} color="var(--cherry-blue)" /> },
                { label: "科研", detail: "核查证据", icon: <IconTestTube size={18} color="var(--cherry-peach)" /> },
                { label: "AI", detail: "生成卡片", icon: <IconDNA size={19} color1="var(--cherry-red)" color2="var(--cherry-blue)" /> },
              ].map((item) => (
                <span key={item.label} className="hero-scope-item" role="listitem" style={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", alignItems: "center", gap: "0.45rem", minWidth: 0, border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 14, padding: "0.54rem 0.62rem", background: "rgba(250,247,241,0.66)", boxShadow: "0 8px 20px rgba(94,68,42,0.06)" }}>
                  <span aria-hidden="true" style={{ display: "grid", placeItems: "center", width: 30, height: 30, borderRadius: 999, background: "rgba(250,247,241,0.78)" }}>{item.icon}</span>
                  <span style={{ display: "grid", gap: "0.08rem", minWidth: 0 }}>
                    <strong style={{ fontSize: "0.78rem", lineHeight: 1.1, color: "var(--cherry-warm-brown)", fontWeight: 950 }}>{item.label}</strong>
                    <span style={{ fontSize: "0.68rem", lineHeight: 1.2, color: "var(--cherry-warm-mid)", fontWeight: 850 }}>{item.detail}</span>
                  </span>
                </span>
              ))}
            </div>
            </div>
          </div>

          <div className="hero-featured-panel" style={{ minWidth: 0, display: "grid", gap: "0.74rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, color: "var(--cherry-warm-brown)", fontSize: "1.12rem", lineHeight: 1.2, fontWeight: 950 }}>内容目录</h2>
            </div>
            <nav id="works" className="hero-entry-grid" aria-label="内容目录" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gridAutoRows: "minmax(188px, auto)", gap: "0.72rem", minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}>
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
                    borderRadius: 14,
                    padding: "0.74rem",
                    color: "var(--cherry-warm-brown)",
                    textDecoration: "none",
                    textAlign: "left",
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr)",
                    alignItems: "stretch",
                    gap: "0.5rem",
                    position: "relative",
                    overflow: "hidden",
                    minWidth: 0,
                    maxWidth: "100%",
                    minHeight: 188,
                    boxSizing: "border-box",
                    boxShadow: "4px 8px 0 rgba(94,68,42,0.08), 0 14px 28px rgba(94,68,42,0.05)",
                    transform: `rotate(${[-0.55, 0.42, -0.28, 0.36, -0.4, 0.22][index % 6]}deg)`,
                  }}
                >
                  <span aria-hidden="true" style={{ position: "absolute", left: "0.74rem", right: "0.74rem", top: 0, height: 4, borderRadius: "0 0 999px 999px", background: entry.border, opacity: 0.82 }} />
                  <span style={{ minWidth: 0, display: "grid", gap: "0.44rem", alignContent: "start" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.48rem", minWidth: 0 }}>
                      <span aria-hidden="true" style={{ display: "inline-grid", placeItems: "center", width: 32, height: 32, borderRadius: 999, background: "rgba(250,247,241,0.64)", flexShrink: 0 }}>
                        {entry.icon}
                      </span>
                      <strong style={{ fontSize: "0.98rem", lineHeight: 1.18, minWidth: 0, overflowWrap: "anywhere" }}>{entry.title}</strong>
                      <span aria-hidden="true" style={{ marginLeft: "auto", flexShrink: 0, color: "rgba(62,42,26,0.34)", fontSize: "0.64rem", lineHeight: 1, fontWeight: 950, letterSpacing: 0 }}>{String(index + 1).padStart(2, "0")}</span>
                    </span>
                    <span style={{ display: "flex", gap: "0.44rem", flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 999, padding: "0.2rem 0.46rem", color: "var(--cherry-forest)", fontSize: "0.7rem", fontWeight: 950 }}>{entry.kind}</span>
                    </span>
                    <span className="hero-entry-desc" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.8rem", lineHeight: 1.45, fontWeight: 820 }}>
                      {entry.desc}
                    </span>
                    <span className="hero-entry-path" style={{ display: "flex", gap: "0.28rem", flexWrap: "wrap", alignItems: "center", color: "var(--cherry-warm-mid)", fontSize: "0.66rem", lineHeight: 1.2, fontWeight: 900 }}>
                      {entry.path.map((step, index) => (
                        <span key={`${entry.key}-${step}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.28rem" }}>
                          <span>{step}</span>
                          {index < entry.path.length - 1 ? <span aria-hidden="true" style={{ opacity: 0.58 }}>→</span> : null}
                        </span>
                      ))}
                    </span>
                    <span style={{ display: "flex", gap: "0.38rem", flexWrap: "wrap" }}>
                      {entry.outputs.slice(0, 3).map((output) => (
                        <span key={output} style={{ background: "rgba(250,247,241,0.72)", borderRadius: 999, padding: "0.24rem 0.48rem", color: "var(--cherry-warm-brown)", fontSize: "0.7rem", fontWeight: 950 }}>
                          {output}
                        </span>
                      ))}
                    </span>
                  </span>
                  {entry.featuredImage ? (
                    <img src={entry.featuredImage} alt="" aria-hidden="true" loading="eager" style={{ width: "100%", height: 88, objectFit: "cover", borderRadius: 12, border: "1.5px solid rgba(250,247,241,0.72)", alignSelf: "end" }} />
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
          width: min(34vw, 540px);
          height: 300px;
          right: 3%;
          top: 7%;
          background: var(--cherry-sage-light);
        }

        .hero-soft-blob-yellow {
          width: min(28vw, 420px);
          height: 230px;
          left: 2%;
          bottom: 7%;
          background: var(--cherry-yellow-light);
        }

        .hero-soft-blob-blue {
          width: min(24vw, 360px);
          height: 220px;
          right: 14%;
          bottom: 12%;
          background: var(--cherry-blue-light);
        }

        .hero-soft-blob-peach {
          width: min(18vw, 280px);
          height: 180px;
          left: 5%;
          top: 22%;
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
          width: 3.4rem;
          height: 3.4rem;
          border-radius: 999px;
          background: rgba(250,247,241,0.58);
          border: 1px solid rgba(94,68,42,0.1);
          box-shadow: 0 10px 24px rgba(94,68,42,0.08);
          animation: heroFloatDeco 5.2s ease-in-out infinite;
        }

        .hero-float-microscope {
          left: 30%;
          top: 22%;
        }

        .hero-float-dna {
          left: 19%;
          bottom: 19%;
          animation-delay: -1.2s;
        }

        .hero-float-tube {
          right: 8%;
          bottom: 25%;
          animation-delay: -0.7s;
        }

        .hero-float-leaf {
          right: 31%;
          top: 16%;
          animation-delay: -1.8s;
        }

        @keyframes heroFloatDeco {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @media (max-width: 860px) {
          .hero-shell {
            min-height: auto !important;
            padding: 0.8rem 1rem 1rem !important;
          }

          .hero-inner,
          .hero-layout {
            width: 100% !important;
            max-width: calc(100vw - 2rem) !important;
            grid-template-columns: 1fr !important;
            gap: 0.82rem !important;
            overflow-wrap: anywhere;
          }

          .hero-copy-panel {
            grid-template-columns: 1fr !important;
            gap: 0.7rem !important;
            align-items: start !important;
          }

          .hero-title {
            font-size: 2.6rem !important;
            line-height: 1.02 !important;
          }

          .hero-scope-strip {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 0.42rem !important;
          }

          .hero-scope-item {
            padding: 0.42rem !important;
            border-radius: 12px !important;
          }

          .hero-entry-grid {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 0.52rem !important;
            width: calc(100vw - 2rem) !important;
            max-width: calc(100vw - 2rem) !important;
            box-sizing: border-box;
          }

          .hero-entry-row {
            min-width: 0 !important;
            box-sizing: border-box;
            grid-template-columns: minmax(0, 1fr) !important;
            padding: 0.56rem !important;
            min-height: 150px !important;
            border-radius: 14px !important;
            transform: none !important;
          }

          .hero-entry-row-image img {
            display: none !important;
          }

          .hero-entry-row strong,
          .hero-entry-row span {
            overflow-wrap: anywhere;
          }

          .hero-float-deco,
          .hero-stem-right {
            display: none !important;
          }
        }

        .hero-entry-desc {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        @media (max-width: 520px) {
          .hero-entry-desc {
            -webkit-line-clamp: 2 !important;
          }
        }

        .hero-entry-row:focus-visible {
          outline: 3px solid var(--cherry-red);
          outline-offset: 4px;
        }

        .hero-entry-row {
          transition: color 0.18s ease, background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
        }

        .hero-mini-visual {
          position: relative;
          display: block;
          width: 5.3rem;
          height: 3.12rem;
          border: 1px solid rgba(94,68,42,0.1);
          border-radius: 14px;
          background: rgba(250,247,241,0.56);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.55);
          pointer-events: none;
          flex: 0 0 auto;
        }

        .hero-entry-visual-row {
          display: flex;
          justify-content: flex-end;
          align-items: end;
          gap: 0.58rem;
          margin-top: auto;
        }

        .hero-mini-visual-gene .hero-mini-dna {
          position: absolute;
          left: 0.34rem;
          top: 0.36rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.12rem;
          width: 4.55rem;
        }

        .hero-mini-visual-gene .hero-mini-dna span {
          display: grid;
          place-items: center;
          width: 1rem;
          height: 1rem;
          border-radius: 999px;
          background: rgba(95,145,115,0.18);
          color: var(--cherry-forest);
          font-size: 0.42rem;
          font-weight: 950;
        }

        .hero-mini-visual-gene .hero-mini-rna {
          position: absolute;
          left: 0.62rem;
          top: 1.54rem;
          width: 3.1rem;
          height: 0.92rem;
          border-bottom: 3px solid var(--cherry-blue);
          border-radius: 0 0 80% 70%;
          transform: rotate(-7deg);
        }

        .hero-mini-visual-gene .hero-mini-ribosome {
          position: absolute;
          right: 0.84rem;
          bottom: 0.52rem;
          width: 1.04rem;
          height: 0.74rem;
          border-radius: 999px 999px 0.7rem 0.7rem;
          background: rgba(94,68,42,0.54);
        }

        .hero-mini-visual-gene .hero-mini-chain {
          position: absolute;
          right: 0.32rem;
          bottom: 1.18rem;
          display: flex;
          gap: 0.12rem;
          transform: rotate(-22deg);
        }

        .hero-mini-visual-gene .hero-mini-chain i {
          width: 0.36rem;
          height: 0.36rem;
          border-radius: 999px;
          background: var(--cherry-red);
        }

        .hero-mini-visual-research .hero-mini-paper {
          position: absolute;
          left: 0.44rem;
          top: 0.34rem;
          width: 2.1rem;
          height: 2.42rem;
          border-radius: 0.42rem;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(94,68,42,0.13);
          display: grid;
          gap: 0.18rem;
          align-content: center;
          padding: 0.32rem;
        }

        .hero-mini-visual-research .hero-mini-paper i {
          height: 0.22rem;
          border-radius: 999px;
          background: rgba(94,68,42,0.28);
        }

        .hero-mini-visual-research .hero-mini-checklist {
          position: absolute;
          right: 0.42rem;
          top: 0.66rem;
          display: grid;
          gap: 0.36rem;
        }

        .hero-mini-visual-research .hero-mini-checklist i {
          width: 1.58rem;
          height: 0.36rem;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--cherry-forest) 0 0.36rem, rgba(94,68,42,0.22) 0.36rem);
        }

        .hero-mini-visual-concept {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.18rem;
        }

        .hero-mini-visual-concept span {
          display: grid;
          place-items: center;
          width: 1.28rem;
          height: 1.28rem;
          border-radius: 999px;
          background: rgba(123,108,196,0.15);
          color: #5F548F;
          font-size: 0.44rem;
          font-weight: 950;
        }

        .hero-mini-visual-concept i {
          width: 0.48rem;
          height: 2px;
          border-radius: 999px;
          background: rgba(94,68,42,0.28);
        }

        .hero-mini-visual-crispr::before {
          content: "";
          position: absolute;
          left: 0.46rem;
          right: 0.46rem;
          top: 1.5rem;
          height: 0.34rem;
          border-radius: 999px;
          background: repeating-linear-gradient(90deg, var(--cherry-blue) 0 0.42rem, rgba(250,247,241,0.85) 0.42rem 0.58rem, var(--cherry-red) 0.58rem 1rem);
        }

        .hero-mini-visual-crispr .hero-mini-guide {
          position: absolute;
          left: 0.88rem;
          top: 1.04rem;
          width: 2.72rem;
          height: 0.18rem;
          border-radius: 999px;
          background: var(--cherry-red);
        }

        .hero-mini-visual-crispr .hero-mini-cas {
          position: absolute;
          right: 1.02rem;
          top: 0.92rem;
          width: 1rem;
          height: 1rem;
          border-radius: 45% 55% 50% 50%;
          background: rgba(95,145,115,0.7);
        }

        .hero-mini-visual-crispr .hero-mini-cut {
          position: absolute;
          right: 0.86rem;
          top: 1rem;
          width: 0.48rem;
          height: 1.28rem;
          border-left: 2px solid rgba(94,68,42,0.44);
          transform: rotate(26deg);
        }

        .hero-mini-visual-reading .hero-mini-book {
          position: absolute;
          left: 0.5rem;
          top: 0.48rem;
          width: 1.58rem;
          height: 2rem;
          border-radius: 0.22rem 0.42rem 0.42rem 0.22rem;
          background: rgba(250,247,241,0.82);
          border: 1px solid rgba(94,68,42,0.14);
          box-shadow: inset 0.28rem 0 0 rgba(213,182,85,0.38);
        }

        .hero-mini-visual-reading .hero-mini-lines {
          position: absolute;
          right: 0.54rem;
          top: 0.72rem;
          display: grid;
          gap: 0.32rem;
          width: 2.36rem;
        }

        .hero-mini-visual-reading .hero-mini-lines i {
          height: 0.28rem;
          border-radius: 999px;
          background: rgba(94,68,42,0.24);
        }

        .hero-entry-row:hover,
        .hero-entry-row:focus-visible {
          background: rgba(250,247,241,0.42) !important;
          transform: translateY(-2px) rotate(0deg) !important;
          box-shadow: 5px 10px 0 rgba(94,68,42,0.1), 0 18px 34px rgba(94,68,42,0.08) !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-entry-row,
          .hero-float-deco {
            transition: none !important;
            animation: none !important;
          }
        }

        @media (max-width: 860px) {
          .hero-mini-visual {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
