import type { MouseEvent } from "react";
import { works } from "./Works";
import { getWorkToolHref, navigateClient, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";

const homeWorkSummary: Record<string, string> = {
  "gene-expression": "调节转录与翻译，观察 mRNA、核糖体和多肽链变化。",
  "research-prompt-kit": "把论文材料整理成任务路由、证据边界和可复制指令。",
  "plant-evolution-stories": "按时间轴查看植物关键创新、证据和自测。",
  "concept-explainer": "输入概念，生成解释、流程图、类比和小测。",
  "crispr-interactive": "修改 guide RNA，判断 PAM、匹配评分和编辑风险。",
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

        <nav id="works" className="hero-work-grid" aria-label="首屏学习模块目录" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(218px, 1fr))", gap: "0.46rem", minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}>
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
                  background: "rgba(250,247,241,0.84)",
                  border: "1.5px solid rgba(94,68,42,0.12)",
                  borderLeft: `4px solid ${work.border}`,
                  borderRadius: 8,
                  padding: "0.52rem 0.58rem",
                  color: "var(--cherry-warm-brown)",
                  textDecoration: "none",
                  textAlign: "left",
                  minHeight: 58,
                  display: "grid",
                  gridTemplateColumns: "auto minmax(0, 1fr) auto",
                  alignItems: "center",
                  gap: "0.52rem",
                  position: "relative",
                  overflow: "hidden",
                  minWidth: 0,
                  maxWidth: "100%",
                  boxSizing: "border-box",
                }}
              >
                <span aria-hidden="true" style={{ width: 24, height: 24, borderRadius: 999, background: work.color, border: `1px solid ${work.border}`, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--cherry-warm-brown)", fontSize: "0.7rem", fontWeight: 900 }}>
                  {work.id}
                </span>
                <div style={{ display: "grid", gap: "0.14rem", minWidth: 0, position: "relative", zIndex: 1 }}>
                  <strong style={{ fontSize: "0.84rem", lineHeight: 1.16, minWidth: 0, overflowWrap: "anywhere" }}>{work.title}</strong>
                  <span className="hero-work-summary" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.32, fontWeight: 800, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                    {homeWorkSummary[work.slug] ?? work.desc}
                  </span>
                </div>
                <span className="hero-work-open" style={{ color: "var(--cherry-forest)", border: "1px solid rgba(58,92,62,0.18)", borderRadius: 999, padding: "0.14rem 0.42rem", fontSize: "0.66rem", fontWeight: 900, whiteSpace: "nowrap" }}>
                  打开
                </span>
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
            grid-template-columns: 1fr !important;
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
            min-height: 54px !important;
          }

          .hero-work-card strong,
          .hero-work-card span {
            overflow-wrap: anywhere;
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
