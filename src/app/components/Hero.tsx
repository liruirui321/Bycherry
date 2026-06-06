import type { MouseEvent } from "react";
import { works } from "./Works";
import { IconBook, IconBranch, IconSparkle } from "./Icons";
import { getWorkToolHref, navigateClient, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";

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
        fontFamily: "'Nunito', sans-serif",
        minHeight: "calc(100vh - 50px)",
        position: "relative",
        overflow: "hidden",
        padding: "1.35rem 1.5rem 1.2rem",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        background: "var(--background)",
        display: "grid",
        alignItems: "center",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 520, height: 360, borderRadius: "50%", background: "rgba(169,201,172,0.28)", right: "-6rem", top: "5.8rem", transform: "rotate(-12deg)" }} />
        <div style={{ position: "absolute", width: 340, height: 220, borderRadius: "50%", background: "rgba(221,185,90,0.18)", left: "-5rem", bottom: "0.8rem" }} />
        <div className="hero-dot-field" style={{ position: "absolute", width: 160, height: 170, right: "3.2rem", bottom: "2.6rem", opacity: 0.38 }} />
      </div>

      <div className="hero-inner" style={{ position: "relative", zIndex: 2, maxWidth: 1320, width: "100%", minWidth: 0, margin: "0 auto", boxSizing: "border-box" }}>
        <div className="hero-layout" style={{ display: "grid", gridTemplateColumns: "minmax(310px, 0.72fr) minmax(0, 1.28fr)", gap: "1.6rem", alignItems: "center" }}>
          <div className="hero-copy-panel" style={{ minWidth: 0, display: "grid", gap: "1.05rem", alignContent: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 9, width: "fit-content", border: "2px dashed var(--cherry-yellow)", borderRadius: 999, padding: "0.42rem 1rem", color: "var(--cherry-warm-brown)", fontSize: "0.86rem", fontWeight: 900, background: "rgba(250,247,241,0.62)" }}>
              <IconSparkle size={15} color="var(--cherry-yellow)" />
              By Cherry
              <IconSparkle size={15} color="var(--cherry-yellow)" />
            </div>
            <h1
              id="hero-heading"
              className="hero-title"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "clamp(3rem, 5.2vw, 5.9rem)",
                fontWeight: 950,
                lineHeight: 0.98,
                color: "var(--cherry-warm-brown)",
                margin: "0",
                letterSpacing: 0,
                overflowWrap: "anywhere",
              }}
            >
              science,
              <br />
              learning
              <br />
              <span style={{ color: "var(--cherry-blue)" }}>& AI</span>
            </h1>
            <p style={{ margin: 0, color: "var(--cherry-warm-mid)", fontSize: "clamp(1.08rem, 2vw, 1.42rem)", lineHeight: 1.65, fontWeight: 850 }}>
              科学模拟、学习工具和笔记入口，打开后直接操作、记录和复盘。
            </p>
            <div className="hero-primary-links" style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
              <a href="#works" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--cherry-forest)", color: "#FAF7F1", borderRadius: 999, padding: "0.86rem 1.24rem", textDecoration: "none", fontWeight: 950, boxShadow: "0 8px 0 rgba(58,92,62,0.16)" }}>
                <IconBranch size={20} color="#FAF7F1" />
                浏览内容目录
              </a>
              <a
                href={readingEntry.href}
                onClick={(event) => openEntry(readingEntry.href, event)}
                onMouseEnter={() => preloadRouteForHref(readingEntry.href)}
                onFocus={() => preloadRouteForHref(readingEntry.href)}
                style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(250,247,241,0.7)", color: "var(--cherry-warm-brown)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.86rem 1.1rem", textDecoration: "none", fontWeight: 950 }}
              >
                <IconBook size={19} color="var(--cherry-yellow)" />
                读读笔记
              </a>
            </div>
          </div>

          <div className="hero-featured-panel" style={{ minWidth: 0, display: "grid", gap: "0.74rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, color: "var(--cherry-warm-brown)", fontSize: "1.12rem", lineHeight: 1.2, fontWeight: 950 }}>精选内容</h2>
              <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.82rem", fontWeight: 950 }}>{works.length} 个内容入口</span>
            </div>
            <nav id="works" className="hero-entry-grid" aria-label="内容目录" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.72rem", minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}>
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
                    gridTemplateColumns: entry.featuredImage ? "minmax(0, 1fr) 112px" : "minmax(0, 1fr)",
                    alignItems: "stretch",
                    gap: "0.68rem",
                    position: "relative",
                    overflow: "hidden",
                    minWidth: 0,
                    maxWidth: "100%",
                    minHeight: 154,
                    boxSizing: "border-box",
                    boxShadow: "0 8px 18px rgba(94,68,42,0.08)",
                  }}
                >
                  <span style={{ minWidth: 0, display: "grid", gap: "0.46rem", alignContent: "start" }}>
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
                    <span className="hero-entry-action" style={{ width: "fit-content", background: "var(--cherry-forest)", color: "#FAF7F1", borderRadius: 999, padding: "0.42rem 0.72rem", fontSize: "0.74rem", lineHeight: 1.1, fontWeight: 950 }}>{entry.action}</span>
                  </span>
                  {entry.featuredImage ? (
                    <img src={entry.featuredImage} alt="" aria-hidden="true" loading="eager" style={{ width: "100%", height: "100%", minHeight: 118, objectFit: "cover", borderRadius: 16, border: "1.5px solid rgba(250,247,241,0.72)", alignSelf: "stretch" }} />
                  ) : null}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <style>{`
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

        .hero-entry-row:hover,
        .hero-entry-row:focus-visible {
          background: rgba(250,247,241,0.42) !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-entry-row {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
