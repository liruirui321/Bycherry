import type { MouseEvent } from "react";
import { works } from "./Works";
import { getWorkToolHref, navigateClient, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";

export function Hero() {
  const entries = [
    ...works.map((work) => ({
      key: work.slug,
      kind: work.category,
      title: work.title,
      href: getWorkToolHref(work.href),
      action: work.action,
      border: work.border,
      desc: work.desc,
    })),
    {
      key: "reading",
      kind: "文章",
      title: "阅读库",
      href: "/reading",
      action: "打开目录",
      border: "var(--cherry-warm-mid)",
      desc: "科研证据、学习方法和 AI 创作工作流文章。",
    },
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
        <div className="hero-header-row" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", alignItems: "center", gap: "0.7rem", marginBottom: "0.2rem" }}>
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
              By Cherry
            </h1>
            <p style={{ margin: "0.18rem 0 0", color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.35, fontWeight: 800 }}>
              科学互动工具、AI 学习工作台和方法文章。
            </p>
          </div>
        </div>

        <nav id="works" className="hero-entry-grid" aria-label="内容目录" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "1px", minWidth: 0, maxWidth: "100%", boxSizing: "border-box", borderTop: "1px solid rgba(94,68,42,0.14)", borderBottom: "1px solid rgba(94,68,42,0.14)" }}>
          {entries.map((entry) => (
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
                background: "transparent",
                border: "none",
                borderLeft: `3px solid ${entry.border}`,
                borderBottom: "1px solid rgba(94,68,42,0.08)",
                borderRadius: 0,
                padding: "0.42rem 0.5rem",
                color: "var(--cherry-warm-brown)",
                textDecoration: "none",
                textAlign: "left",
                display: "grid",
                gridTemplateColumns: "3.4rem minmax(0, 1fr) auto",
                alignItems: "center",
                gap: "0.42rem",
                position: "relative",
                overflow: "hidden",
                minWidth: 0,
                maxWidth: "100%",
                minHeight: 38,
                boxSizing: "border-box",
              }}
            >
              <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.66rem", lineHeight: 1.1, fontWeight: 900 }}>{entry.kind}</span>
              <strong style={{ fontSize: "0.78rem", lineHeight: 1.12, minWidth: 0, overflowWrap: "anywhere" }}>{entry.title}</strong>
              <span className="hero-entry-action" style={{ color: "var(--cherry-forest)", fontSize: "0.66rem", lineHeight: 1.1, fontWeight: 900, whiteSpace: "nowrap" }}>{entry.action}</span>
            </a>
          ))}
        </nav>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .hero-shell {
            padding: 0.5rem 1rem 0.52rem !important;
          }

          .hero-inner,
          .hero-header-row {
            width: 100% !important;
            max-width: calc(100vw - 2rem) !important;
            grid-template-columns: 1fr !important;
            overflow-wrap: anywhere;
          }

          .hero-entry-grid {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 0 !important;
            width: calc(100vw - 2rem) !important;
            max-width: calc(100vw - 2rem) !important;
            box-sizing: border-box;
          }

          .hero-entry-row {
            min-width: 0 !important;
            box-sizing: border-box;
            grid-template-columns: 2.8rem minmax(0, 1fr) !important;
            padding: 0.38rem 0.42rem !important;
          }

          .hero-entry-action {
            display: none !important;
          }

          .hero-entry-row strong,
          .hero-entry-row span {
            overflow-wrap: anywhere;
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
