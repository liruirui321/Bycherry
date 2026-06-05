import type { MouseEvent } from "react";
import { works } from "./Works";
import { WorkPreviewIllustration } from "./WorkPreviewIllustration";
import { getWorkToolHref, navigateClient, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";

export function Hero() {
  function openWork(href: string, event: MouseEvent<HTMLAnchorElement>) {
    if (!shouldUseClientNavigation(event)) return;
    event.preventDefault();
    navigateClient(href);
  }

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      style={{
        fontFamily: "'Nunito', sans-serif",
        minHeight: "auto",
        position: "relative",
        overflow: "hidden",
        padding: "0.78rem 1.5rem 0.78rem",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        background:
          "linear-gradient(180deg, rgba(250,247,241,0.98) 0%, rgba(245,241,234,0.95) 100%), linear-gradient(rgba(58,92,62,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(58,92,62,0.05) 1px, transparent 1px)",
        backgroundSize: "auto, 42px 42px, 42px 42px",
      }}
    >
      <div className="hero-inner" style={{ position: "relative", zIndex: 2, maxWidth: 1120, width: "100%", minWidth: 0, margin: "0 auto", boxSizing: "border-box" }}>
        <div className="hero-header-row" style={{ maxWidth: 760, marginBottom: "0.5rem" }}>
          <div style={{ minWidth: 0 }}>
            <h1
              id="hero-heading"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "clamp(1.45rem, 3.2vw, 2.2rem)",
                fontWeight: 800,
                lineHeight: 1.12,
                color: "var(--cherry-warm-brown)",
                margin: "0 0 0.26rem",
                letterSpacing: 0,
                overflowWrap: "anywhere",
              }}
            >
              By Cherry 科学与 AI 学习工作台
            </h1>
            <p
              style={{
                fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
                color: "var(--cherry-warm-mid)",
                lineHeight: 1.5,
                margin: 0,
                fontWeight: 700,
                overflowWrap: "anywhere",
              }}
            >
              模块直接操作，文章保留方法、证据和可复用记录。
            </p>
          </div>
        </div>

        <nav id="works" className="hero-work-grid" aria-label="首屏学习模块目录" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(136px, 1fr))", gap: "0.42rem", minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}>
          {works.map((work) => {
            const toolHref = getWorkToolHref(work.href);
            return (
              <a
                className="hero-work-card"
                key={work.slug}
                href={toolHref}
                aria-label={`打开${work.title}`}
                onClick={(event) => openWork(toolHref, event)}
                onMouseEnter={() => preloadRouteForHref(getWorkToolHref(work.href))}
                onFocus={() => preloadRouteForHref(getWorkToolHref(work.href))}
                onPointerDown={() => preloadRouteForHref(getWorkToolHref(work.href))}
                style={{
                  background: work.color,
                  border: `1.5px solid ${work.border}`,
                  borderRadius: 8,
                  padding: "0.44rem 0.5rem",
                  color: "var(--cherry-warm-brown)",
                  textDecoration: "none",
                  textAlign: "left",
                  minHeight: 62,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "0.32rem",
                  position: "relative",
                  overflow: "hidden",
                  minWidth: 0,
                  maxWidth: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div aria-hidden="true" style={{ position: "absolute", right: -12, bottom: -14, width: 54, height: 40, borderRadius: 8, background: "rgba(250,247,241,0.36)", border: "1px solid rgba(94,68,42,0.08)" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0, position: "relative", zIndex: 1 }}>
                  <span style={{ width: 22, height: 22, display: "inline-flex", alignItems: "center", justifyContent: "center", transform: "scale(0.52)", transformOrigin: "center" }}>{work.icon}</span>
                  <strong style={{ fontSize: "0.8rem", lineHeight: 1.2, minWidth: 0, overflowWrap: "anywhere" }}>{work.title}</strong>
                </div>
                <div className="hero-work-outcome" style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", alignContent: "start", position: "relative", zIndex: 1, paddingRight: 34 }}>
                  <span style={{ background: "rgba(250,247,241,0.7)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 999, padding: "0.08rem 0.4rem", color: "var(--cherry-forest)", fontSize: "0.61rem", fontWeight: 900 }}>
                    {work.category}
                  </span>
                  <span className="hero-work-completion" style={{ background: "var(--cherry-forest)", border: "1px solid var(--cherry-forest)", borderRadius: 999, padding: "0.08rem 0.34rem", color: "#FAF7F1", fontSize: "0.58rem", fontWeight: 900 }}>
                    {work.action}
                  </span>
                </div>
                <div className="hero-work-preview" style={{ position: "absolute", right: 2, bottom: -4, display: "flex", justifyContent: "flex-end", opacity: 0.78, zIndex: 0 }}>
                  <WorkPreviewIllustration slug={work.slug} color={work.border} width={54} height={40} />
                </div>
              </a>
            );
          })}
        </nav>
      </div>

      <style>{`
        @media (max-width: 860px) {
          #top {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            padding-top: 0.58rem !important;
            padding-bottom: 0.62rem !important;
          }

          .hero-inner,
          .hero-header-row {
            width: 100% !important;
            max-width: calc(100vw - 2rem) !important;
            grid-template-columns: 1fr !important;
            overflow-wrap: anywhere;
          }

          .hero-work-grid {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            overflow-x: visible;
            padding-bottom: 0;
            width: calc(100vw - 2rem) !important;
            max-width: calc(100vw - 2rem) !important;
            box-sizing: border-box;
          }

          .hero-work-card {
            width: 100% !important;
            min-width: 0 !important;
            max-width: 100% !important;
            box-sizing: border-box;
            min-height: 52px !important;
          }

          .hero-work-card strong,
          .hero-work-card span {
            overflow-wrap: anywhere;
          }

          .hero-work-preview {
            transform: scale(0.82);
            transform-origin: right bottom;
          }
        }

        .hero-work-card:focus-visible {
          outline: 3px solid var(--cherry-red);
          outline-offset: 4px;
        }

        .hero-work-card {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .hero-work-card:hover,
        .hero-work-card:focus-visible {
          transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(58,92,62,0.12);
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-work-card {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
