import type { MouseEvent } from "react";
import { works } from "./Works";
import { getWorkToolHref, navigateClient, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";

const homeWorkStatus: Record<string, string> = {
  "gene-expression": "仿真",
  "research-prompt-kit": "工作台",
  "plant-evolution-stories": "时间轴",
  "concept-explainer": "生成器",
  "crispr-interactive": "模拟器",
};

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
        padding: "0.54rem 1.5rem 0.56rem",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        background: "var(--background)",
      }}
    >
      <div className="hero-inner" style={{ position: "relative", zIndex: 2, maxWidth: 1060, width: "100%", minWidth: 0, margin: "0 auto", boxSizing: "border-box" }}>
        <div className="hero-header-row" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", alignItems: "center", gap: "0.7rem", marginBottom: "0.24rem" }}>
          <div style={{ minWidth: 0 }}>
            <h1
              id="hero-heading"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "clamp(1.02rem, 2vw, 1.28rem)",
                fontWeight: 800,
                lineHeight: 1.12,
                color: "var(--cherry-warm-brown)",
                margin: "0",
                letterSpacing: 0,
                overflowWrap: "anywhere",
              }}
            >
              By Cherry · 科学学习与 AI
            </h1>
          </div>
          <span className="hero-count" style={{ color: "var(--cherry-forest)", fontSize: "0.68rem", fontWeight: 900, whiteSpace: "nowrap" }}>
            {works.length} 个内容
          </span>
        </div>

        <nav id="works" className="hero-work-list" aria-label="内容目录" style={{ display: "flex", alignItems: "center", gap: "0.28rem", flexWrap: "wrap", minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}>
          {works.map((work) => {
            const toolHref = getWorkToolHref(work.href);
            return (
              <a
                className="hero-work-row"
                key={work.slug}
                href={toolHref}
                aria-label={`打开${work.title}`}
                onClick={(event) => openWork(toolHref, event)}
                onMouseEnter={() => preloadRouteForHref(getWorkToolHref(work.href))}
                onFocus={() => preloadRouteForHref(getWorkToolHref(work.href))}
                onPointerDown={() => preloadRouteForHref(getWorkToolHref(work.href))}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(94,68,42,0.1)",
                  borderTop: `2px solid ${work.border}`,
                  borderRadius: 4,
                  padding: "0.22rem 0.38rem",
                  color: "var(--cherry-warm-brown)",
                  textDecoration: "none",
                  textAlign: "left",
                  display: "inline-flex",
                  alignItems: "baseline",
                  gap: "0.34rem",
                  position: "relative",
                  overflow: "hidden",
                  minWidth: 0,
                  maxWidth: "100%",
                  boxSizing: "border-box",
                }}
              >
                <strong style={{ fontSize: "0.72rem", lineHeight: 1.14, minWidth: 0, overflowWrap: "anywhere" }}>{work.title}</strong>
                <span className="hero-work-status" style={{ color: "var(--cherry-forest)", fontSize: "0.56rem", fontWeight: 900, whiteSpace: "nowrap" }}>{homeWorkStatus[work.slug] ?? work.category}</span>
              </a>
            );
          })}
        </nav>
      </div>

      <style>{`
        @media (max-width: 860px) {
          #top {
            padding: 0.5rem 1rem 0.52rem !important;
          }

          .hero-inner,
          .hero-header-row {
            width: 100% !important;
            max-width: calc(100vw - 2rem) !important;
            grid-template-columns: 1fr !important;
            overflow-wrap: anywhere;
          }

          .hero-count {
            justify-self: start;
          }

	          .hero-work-list {
	            display: flex !important;
	            gap: 0.24rem !important;
	            overflow-x: visible;
	            padding-bottom: 0;
	            width: calc(100vw - 2rem) !important;
	            max-width: calc(100vw - 2rem) !important;
	            box-sizing: border-box;
	          }

	          .hero-work-row {
	            width: 100% !important;
	            min-width: 0 !important;
	            max-width: 100% !important;
	            box-sizing: border-box;
	            gap: 0.28rem !important;
	            padding: 0.2rem 0.34rem !important;
	          }

	          .hero-work-status {
	            font-size: 0.55rem !important;
	          }

          .hero-work-tags {
            display: none !important;
          }

          .hero-work-row strong,
          .hero-work-row span {
            overflow-wrap: anywhere;
          }
        }

        .hero-work-row:focus-visible {
          outline: 3px solid var(--cherry-red);
          outline-offset: 4px;
        }

        .hero-work-row {
          transition: color 0.18s ease, background 0.18s ease;
        }

	        .hero-work-row:hover,
	        .hero-work-row:focus-visible {
	          background: rgba(250,247,241,0.48) !important;
	        }

        @media (prefers-reduced-motion: reduce) {
          .hero-work-row {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
