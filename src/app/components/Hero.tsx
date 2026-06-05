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
        padding: "0.72rem 1.5rem 0.72rem",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        background: "var(--background)",
      }}
    >
      <div className="hero-inner" style={{ position: "relative", zIndex: 2, maxWidth: 1060, width: "100%", minWidth: 0, margin: "0 auto", boxSizing: "border-box" }}>
        <div className="hero-header-row" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", alignItems: "end", gap: "1rem", marginBottom: "0.48rem" }}>
          <div style={{ minWidth: 0 }}>
            <h1
              id="hero-heading"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "clamp(1.18rem, 2.5vw, 1.54rem)",
                fontWeight: 800,
                lineHeight: 1.12,
                color: "var(--cherry-warm-brown)",
                margin: "0",
                letterSpacing: 0,
                overflowWrap: "anywhere",
              }}
            >
              By Cherry
            </h1>
          </div>
          <span className="hero-count" style={{ color: "var(--cherry-forest)", fontSize: "0.72rem", fontWeight: 900, whiteSpace: "nowrap" }}>
            {works.length} 个模块
          </span>
        </div>

        <nav id="works" className="hero-work-list" aria-label="内容目录" style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "0.52rem", minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}>
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
                  background: "var(--card)",
                  border: "1px solid rgba(94,68,42,0.12)",
                  borderLeft: `4px solid ${work.border}`,
                  borderRadius: 8,
                  padding: "0.52rem 0.56rem",
                  color: "var(--cherry-warm-brown)",
                  textDecoration: "none",
                  textAlign: "left",
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  alignContent: "start",
                  gap: "0.36rem",
                  position: "relative",
                  overflow: "visible",
                  minWidth: 0,
                  minHeight: 104,
                  maxWidth: "100%",
                  boxSizing: "border-box",
                }}
              >
                <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.42rem", minWidth: 0 }}>
                  <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: 999, background: work.color, border: `1px solid ${work.border}`, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--cherry-warm-brown)", fontSize: "0.66rem", fontWeight: 900, flex: "0 0 auto" }}>
                    {work.id}
                  </span>
                  <span className="hero-work-status" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.64rem", fontWeight: 900, whiteSpace: "nowrap" }}>
                    {homeWorkStatus[work.slug] ?? work.category}
                  </span>
                </span>
                <strong style={{ fontSize: "0.82rem", lineHeight: 1.18, minWidth: 0, overflowWrap: "anywhere" }}>{work.title}</strong>
                <span className="hero-work-tags" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.64rem", lineHeight: 1.22, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {work.tags.slice(0, 2).join(" / ")}
                </span>
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
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 0.46rem !important;
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
            min-height: 88px !important;
            padding: 0.46rem 0.5rem !important;
          }

          .hero-work-status {
            font-size: 0.6rem !important;
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
          background: rgba(250,247,241,0.54) !important;
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
