import type { MouseEvent } from "react";
import { IconMicroscope, IconNotebook, IconSeedling } from "./Icons";
import { works } from "./Works";
import { WorkPreviewIllustration } from "./WorkPreviewIllustration";
import { getWorkToolHref, navigateClient, navigateHomeSection, shouldUseClientNavigation } from "../navigation";
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
        padding: "1.35rem 1.5rem 1.15rem",
        width: "100%",
        maxWidth: "100%",
        background:
          "linear-gradient(180deg, rgba(250,247,241,0.98) 0%, rgba(245,241,234,0.95) 100%), linear-gradient(rgba(58,92,62,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(58,92,62,0.05) 1px, transparent 1px)",
        backgroundSize: "auto, 42px 42px, 42px 42px",
      }}
    >
      <div className="hero-inner" style={{ position: "relative", zIndex: 2, maxWidth: 1120, width: "100%", minWidth: 0, margin: "0 auto" }}>
        <div className="hero-header-row" style={{ display: "grid", gridTemplateColumns: "minmax(240px, 0.72fr) minmax(0, 1.28fr)", gap: "1rem", alignItems: "end", marginBottom: "0.9rem" }}>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(250,247,241,0.82)",
                border: "1px solid rgba(58,92,62,0.18)",
                borderRadius: 999,
                padding: "0.32rem 0.82rem",
                marginBottom: "0.72rem",
              }}
            >
              <IconMicroscope size={15} color="var(--cherry-forest)" />
              <span style={{ fontSize: "0.76rem", color: "var(--cherry-warm-mid)", fontWeight: 900, letterSpacing: 0 }}>
                By Cherry · science learning lab
              </span>
            </div>
            <h1
              id="hero-heading"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "clamp(1.58rem, 3.5vw, 2.45rem)",
                fontWeight: 800,
                lineHeight: 1.12,
                color: "var(--cherry-warm-brown)",
                margin: "0 0 0.55rem",
                letterSpacing: 0,
              }}
            >
              By Cherry 科学与 AI 学习工作台
            </h1>
            <p
              style={{
                fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
                color: "var(--cherry-warm-mid)",
                lineHeight: 1.62,
                margin: 0,
                fontWeight: 700,
              }}
            >
              先选一个模块，进入后直接操作。首页只保留目录，完整步骤、记录和练习都放在子页面里。
            </p>
          </div>

          <div className="hero-actions" style={{ display: "flex", gap: "0.62rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
            <a
              className="hero-cta"
              href="#works"
              onClick={(event) => navigateHomeSection("#works", event)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "var(--cherry-forest)", color: "#FAF7F1",
                borderRadius: 999, padding: "0.58rem 1rem",
                textDecoration: "none", fontWeight: 800, fontSize: "0.88rem",
                boxShadow: "3px 5px 0px rgba(58,92,62,0.22)",
              }}
            >
              <IconSeedling size={17} color="#FAF7F1" /> 浏览全部
            </a>
            <a
              className="hero-cta"
              href="#notes"
              onClick={(event) => navigateHomeSection("#notes", event)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(250,247,241,0.82)", color: "var(--cherry-warm-brown)",
                border: "1.5px solid var(--border)", borderRadius: 999,
                padding: "0.56rem 1rem",
                textDecoration: "none", fontWeight: 800, fontSize: "0.88rem",
              }}
            >
              <IconNotebook size={17} /> 方法库
            </a>
          </div>
        </div>

        <nav className="hero-work-grid" aria-label="首屏学习模块目录" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(178px, 1fr))", gap: "0.62rem", minWidth: 0, maxWidth: "100%" }}>
          {works.map((work) => {
            const toolHref = getWorkToolHref(work.href);
            return (
              <a
                className="hero-work-card"
                key={work.slug}
                href={toolHref}
                aria-label={`打开${work.title}：先做这个，${work.starter}。完成标准，${work.success}`}
                onClick={(event) => openWork(toolHref, event)}
                onMouseEnter={() => preloadRouteForHref(getWorkToolHref(work.href))}
                onFocus={() => preloadRouteForHref(getWorkToolHref(work.href))}
                onPointerDown={() => preloadRouteForHref(getWorkToolHref(work.href))}
                style={{
                  background: work.color,
                  border: `1.5px solid ${work.border}`,
                  borderRadius: 8,
                  padding: "0.68rem",
                  color: "var(--cherry-warm-brown)",
                  textDecoration: "none",
                  textAlign: "left",
                  minHeight: 154,
                  display: "grid",
                  gridTemplateRows: "auto auto 1fr auto",
                  gap: "0.34rem",
                  position: "relative",
                  overflow: "hidden",
                  minWidth: 0,
                  maxWidth: "100%",
                }}
              >
                <div aria-hidden="true" style={{ position: "absolute", right: -10, bottom: -8, width: 78, height: 60, borderRadius: 8, background: "rgba(250,247,241,0.42)", border: "1px solid rgba(94,68,42,0.1)" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, position: "relative", zIndex: 1 }}>
                  <span style={{ width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", transform: "scale(0.68)", transformOrigin: "center" }}>{work.icon}</span>
                  <strong style={{ fontSize: "0.9rem", lineHeight: 1.3, minWidth: 0, overflowWrap: "anywhere" }}>{work.title}</strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
                  <span style={{ background: "rgba(250,247,241,0.72)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 999, padding: "0.08rem 0.42rem", color: "var(--cherry-forest)", fontSize: "0.62rem", fontWeight: 900 }}>
                    {work.category}
                  </span>
                  <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.62rem", fontWeight: 900 }}>
                    {work.updated}
                  </span>
                </div>
                <div style={{ background: "rgba(250,247,241,0.76)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.42rem 0.46rem", position: "relative", zIndex: 1, marginRight: 34 }}>
                  <span style={{ display: "block", color: "var(--cherry-forest)", fontSize: "0.6rem", fontWeight: 900, marginBottom: "0.12rem" }}>先做这个</span>
                  <span style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.66rem", lineHeight: 1.34, fontWeight: 800, overflowWrap: "anywhere" }}>{work.starter}</span>
                </div>
                <div className="hero-work-outcome" style={{ display: "flex", alignItems: "center", gap: "0.36rem", flexWrap: "wrap", position: "relative", zIndex: 1, paddingRight: 56 }}>
                  <span style={{ background: "rgba(250,247,241,0.72)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 999, padding: "0.12rem 0.42rem", color: "var(--cherry-forest)", fontSize: "0.62rem", fontWeight: 900 }}>
                    {work.outputs.slice(0, 2).join(" / ")}
                  </span>
                  <span className="hero-work-completion" style={{ background: "var(--cherry-forest)", border: "1px solid var(--cherry-forest)", borderRadius: 999, padding: "0.12rem 0.42rem", color: "#FAF7F1", fontSize: "0.62rem", fontWeight: 900 }}>
                    {work.action}
                  </span>
                </div>
                <div className="hero-work-preview" style={{ position: "absolute", right: 2, bottom: 0, display: "flex", justifyContent: "flex-end", opacity: 0.9, zIndex: 0 }}>
                  <WorkPreviewIllustration slug={work.slug} color={work.border} width={78} height={58} />
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
            padding-top: 1rem !important;
            padding-bottom: 1rem !important;
          }

          .hero-inner,
          .hero-header-row {
            width: 100% !important;
            max-width: calc(100vw - 2rem) !important;
            grid-template-columns: 1fr !important;
          }

          .hero-actions {
            justify-content: flex-start !important;
          }

          .hero-work-grid {
            display: flex !important;
            grid-template-columns: none !important;
            overflow-x: auto;
            overscroll-behavior-x: contain;
            scroll-snap-type: x proximity;
            padding-bottom: 0.25rem;
            width: 100% !important;
            max-width: 100% !important;
          }

          .hero-work-card {
            width: min(76vw, 320px) !important;
            min-width: min(76vw, 320px) !important;
            max-width: min(76vw, 320px) !important;
            scroll-snap-align: start;
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

        .hero-cta:focus-visible,
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
