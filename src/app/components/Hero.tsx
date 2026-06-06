import type { MouseEvent } from "react";
import { works } from "./Works";
import { IconBook, IconBranch } from "./Icons";
import { getWorkToolHref, navigateClient, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";

type HeroVisualKind =
  | "gene-expression"
  | "research-prompt-kit"
  | "concept-explainer"
  | "crispr-interactive";

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

  return (
    <span className="hero-mini-visual hero-mini-visual-crispr" aria-hidden="true">
      <span className="hero-mini-guide" />
      <span className="hero-mini-cas" />
      <span className="hero-mini-cut" />
    </span>
  );
}

export function Hero() {
  const entries = works.map((work) => ({
      key: work.slug,
      kind: work.category,
      title: work.title,
      href: getWorkToolHref(work.href),
      action: work.action,
      border: work.border,
      color: work.color,
      desc: work.desc,
      icon: work.icon,
      outputs: work.outputs,
      updated: work.updated,
      featuredImage: work.slug === "plant-evolution-stories" ? "/illustrations/plant-evolution-story.webp" : null,
      visualKind: work.slug === "plant-evolution-stories" ? null : (work.slug as HeroVisualKind),
  }));
  const readingEntry = {
    href: "/reading",
    desc: "科研证据、学习方法和 AI 创作工作流文章。",
  };

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
        padding: "1.05rem 1.5rem 1rem",
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
        <div style={{ position: "absolute", width: "44vw", maxWidth: 620, height: 1, background: "rgba(58,92,62,0.18)", right: "2rem", top: "7.2rem" }} />
        <div style={{ position: "absolute", width: "34vw", maxWidth: 460, height: 1, background: "rgba(122,175,200,0.24)", left: "2rem", bottom: "3.4rem" }} />
        <div className="hero-dot-field" style={{ position: "absolute", width: 148, height: 120, right: "3.2rem", bottom: "2.6rem", opacity: 0.22 }} />
      </div>

      <div className="hero-inner" style={{ position: "relative", zIndex: 2, maxWidth: 1320, width: "100%", minWidth: 0, margin: "0 auto", boxSizing: "border-box" }}>
        <div className="hero-layout" style={{ display: "grid", gridTemplateColumns: "minmax(310px, 0.72fr) minmax(0, 1.28fr)", gap: "1.6rem", alignItems: "center" }}>
          <div className="hero-copy-panel" style={{ minWidth: 0, display: "grid", gap: "1.05rem", alignContent: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 9, width: "fit-content", border: "1.5px solid rgba(58,92,62,0.26)", borderRadius: 999, padding: "0.4rem 0.9rem", color: "var(--cherry-forest)", fontSize: "0.78rem", fontWeight: 850, background: "rgba(250,247,241,0.76)", letterSpacing: 0 }}>
              <IconBranch size={15} color="var(--cherry-forest)" />
              By Cherry · Science Tools
            </div>
            <h1
              id="hero-heading"
              className="hero-title"
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontSize: "clamp(2.7rem, 4.7vw, 4.85rem)",
                fontWeight: 900,
                lineHeight: 1.06,
                color: "var(--cherry-warm-brown)",
                margin: "0",
                letterSpacing: 0,
                overflowWrap: "anywhere",
              }}
            >
              科学学习
              <br />
              <span style={{ color: "var(--cherry-forest)" }}>工作台</span>
            </h1>
            <p style={{ margin: 0, color: "var(--cherry-warm-mid)", fontSize: "clamp(1rem, 1.55vw, 1.2rem)", lineHeight: 1.72, fontWeight: 760, maxWidth: 520 }}>
              科学模拟、AI 学习工具和科研札记集中在首屏。点开就是可操作页面、记录表和复盘产出。
            </p>
            <div className="hero-primary-links" style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
              <a href="#works" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--cherry-forest)", color: "#FAF7F1", borderRadius: 999, padding: "0.8rem 1.12rem", textDecoration: "none", fontWeight: 880, boxShadow: "0 8px 18px rgba(58,92,62,0.16)" }}>
                <IconBranch size={20} color="#FAF7F1" />
                查看内容
              </a>
              <a
                href={readingEntry.href}
                onClick={(event) => openEntry(readingEntry.href, event)}
                onMouseEnter={() => preloadRouteForHref(readingEntry.href)}
                onFocus={() => preloadRouteForHref(readingEntry.href)}
                style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(250,247,241,0.78)", color: "var(--cherry-warm-brown)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.8rem 1rem", textDecoration: "none", fontWeight: 880 }}
              >
                <IconBook size={19} color="var(--cherry-yellow)" />
                科研札记
              </a>
            </div>
          </div>

          <div className="hero-featured-panel" style={{ minWidth: 0, display: "grid", gap: "0.74rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, color: "var(--cherry-warm-brown)", fontSize: "1.12rem", lineHeight: 1.2, fontWeight: 950 }}>精选内容</h2>
              <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.82rem", fontWeight: 950 }}>{works.length} 个内容入口</span>
            </div>
            <nav id="works" className="hero-entry-grid" aria-label="内容目录" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gridAutoRows: "minmax(154px, auto)", gap: "0.72rem", minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}>
              {entries.map((entry) => (
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
                    borderRadius: 20,
                    padding: "0.78rem",
                    color: "var(--cherry-warm-brown)",
                    textDecoration: "none",
                    textAlign: "left",
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr)",
                    alignItems: "stretch",
                    gap: "0.58rem",
                    position: "relative",
                    overflow: "hidden",
                    minWidth: 0,
                    maxWidth: "100%",
                    minHeight: 154,
                    gridRow: entry.featuredImage ? "span 2" : undefined,
                    boxSizing: "border-box",
                    boxShadow: "0 8px 18px rgba(94,68,42,0.08)",
                  }}
                >
                  <span style={{ minWidth: 0, display: "grid", gap: "0.44rem", alignContent: "start" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.48rem", minWidth: 0 }}>
                      <span aria-hidden="true" style={{ display: "inline-grid", placeItems: "center", width: 32, height: 32, borderRadius: 999, background: "rgba(250,247,241,0.64)", flexShrink: 0 }}>
                        {entry.icon}
                      </span>
                      <strong style={{ fontSize: "1rem", lineHeight: 1.18, minWidth: 0, overflowWrap: "anywhere" }}>{entry.title}</strong>
                    </span>
                    <span style={{ display: "flex", gap: "0.44rem", flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 999, padding: "0.2rem 0.46rem", color: "var(--cherry-forest)", fontSize: "0.7rem", fontWeight: 950 }}>{entry.kind}</span>
                      <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.1, fontWeight: 950 }}>{entry.updated}</span>
                    </span>
                    <span className="hero-entry-desc" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.82rem", lineHeight: 1.48, fontWeight: 820 }}>
                      {entry.desc}
                    </span>
                    <span style={{ display: "flex", gap: "0.38rem", flexWrap: "wrap" }}>
                      {entry.outputs.slice(0, 2).map((output) => (
                        <span key={output} style={{ background: "rgba(250,247,241,0.72)", borderRadius: 999, padding: "0.24rem 0.48rem", color: "var(--cherry-warm-brown)", fontSize: "0.7rem", fontWeight: 950 }}>
                          {output}
                        </span>
                      ))}
                    </span>
                    {entry.featuredImage ? (
                      <span className="hero-entry-action" style={{ width: "fit-content", background: "var(--cherry-forest)", color: "#FAF7F1", borderRadius: 999, padding: "0.42rem 0.72rem", fontSize: "0.74rem", lineHeight: 1.1, fontWeight: 950 }}>{entry.action}</span>
                    ) : null}
                  </span>
                  {entry.featuredImage ? (
                    <img src={entry.featuredImage} alt="" aria-hidden="true" loading="eager" style={{ width: "100%", height: 168, objectFit: "cover", borderRadius: 16, border: "1.5px solid rgba(250,247,241,0.72)", alignSelf: "end" }} />
                  ) : entry.visualKind ? (
                    <span className="hero-entry-visual-row" aria-hidden="true">
                      <span className="hero-entry-action" style={{ width: "fit-content", background: "var(--cherry-forest)", color: "#FAF7F1", borderRadius: 999, padding: "0.42rem 0.72rem", fontSize: "0.74rem", lineHeight: 1.1, fontWeight: 950 }}>{entry.action}</span>
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
            gap: 0.7rem !important;
          }

          .hero-title {
            font-size: 2.35rem !important;
            line-height: 1.02 !important;
          }

          .hero-primary-links a {
            padding: 0.64rem 0.82rem !important;
            font-size: 0.82rem !important;
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
            min-height: 138px !important;
            border-radius: 14px !important;
          }

          .hero-entry-row-image img,
          .hero-entry-action {
            display: none !important;
          }

          .hero-entry-row strong,
          .hero-entry-row span {
            overflow-wrap: anywhere;
          }
        }

        .hero-entry-desc {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
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
          transition: color 0.18s ease, background 0.18s ease;
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
          justify-content: space-between;
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

        .hero-entry-row:hover,
        .hero-entry-row:focus-visible {
          background: rgba(250,247,241,0.42) !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-entry-row {
            transition: none !important;
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
