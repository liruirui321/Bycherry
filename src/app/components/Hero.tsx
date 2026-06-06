import type { MouseEvent } from "react";
import { works } from "./Works";
import { notes } from "./Notes";
import { essays } from "./ResearchEssays";
import { getWorkToolHref, navigateClient, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";

export function Hero() {
  const articleLinks = [...essays, ...notes].map((article) => ({
    href: article.href,
    title: article.title,
    desc: "body" in article ? article.body : article.excerpt,
  }));

  function openContent(href: string, event: MouseEvent<HTMLAnchorElement>) {
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
              By Cherry · 科学学习与 AI
            </h1>
          </div>
        </div>

        <nav id="works" className="hero-work-list" aria-label="内容目录" style={{ display: "grid", gap: "0.22rem", minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}>
          <div className="hero-directory-group" role="group" aria-label="工具" style={{ display: "flex", alignItems: "center", gap: "0.24rem", flexWrap: "wrap", minWidth: 0 }}>
            <span className="hero-section-label" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.68rem", fontWeight: 900, lineHeight: 1.14 }}>工具</span>
            {works.map((work) => {
              const toolHref = getWorkToolHref(work.href);
              return (
                <a
                  className="hero-work-row"
                  key={work.slug}
                  href={toolHref}
                  aria-label={`打开${work.title}：${work.desc}`}
                  onClick={(event) => openContent(toolHref, event)}
                  onMouseEnter={() => preloadRouteForHref(getWorkToolHref(work.href))}
                  onFocus={() => preloadRouteForHref(getWorkToolHref(work.href))}
                  onPointerDown={() => preloadRouteForHref(getWorkToolHref(work.href))}
                  style={{
                    background: "transparent",
                    border: "none",
                    borderLeft: `3px solid ${work.border}`,
                    borderRadius: 0,
                    padding: "0.16rem 0.32rem",
                    color: "var(--cherry-warm-brown)",
                    textDecoration: "none",
                    textAlign: "left",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.22rem",
                    position: "relative",
                    overflow: "hidden",
                    minWidth: 0,
                    maxWidth: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <strong style={{ fontSize: "0.72rem", lineHeight: 1.14, minWidth: 0, overflowWrap: "anywhere" }}>{work.title}</strong>
                </a>
              );
            })}
          </div>

          <details className="hero-reading-library" style={{ minWidth: 0 }}>
            <summary style={{ display: "inline-flex", alignItems: "center", gap: "0.34rem", cursor: "pointer", color: "var(--cherry-warm-brown)", fontSize: "0.72rem", fontWeight: 900, lineHeight: 1.14, padding: "0.12rem 0.32rem", borderLeft: "3px solid rgba(94,68,42,0.2)" }}>
              阅读库 · {articleLinks.length} 篇
              <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.66rem", fontWeight: 900 }}>科研证据 / 方法文章</span>
            </summary>
            <div className="hero-article-list" style={{ display: "flex", alignItems: "center", gap: "0.22rem", flexWrap: "wrap", minWidth: 0, padding: "0.22rem 0 0 0.32rem" }}>
              {articleLinks.map((article) => (
                <a
                  className="hero-article-row"
                  key={article.href}
                  href={article.href}
                  aria-label={`打开${article.title}：${article.desc}`}
                  onClick={(event) => openContent(article.href, event)}
                  onMouseEnter={() => preloadRouteForHref(article.href)}
                  onFocus={() => preloadRouteForHref(article.href)}
                  onPointerDown={() => preloadRouteForHref(article.href)}
                  style={{
                    background: "transparent",
                    border: "none",
                    borderLeft: "3px solid rgba(94,68,42,0.18)",
                    borderRadius: 0,
                    padding: "0.12rem 0.28rem",
                    color: "var(--cherry-warm-brown)",
                    textDecoration: "none",
                    textAlign: "left",
                    display: "inline-flex",
                    alignItems: "center",
                    minWidth: 0,
                    maxWidth: "min(18rem, 100%)",
                    boxSizing: "border-box",
                  }}
                >
                  <strong style={{ fontSize: "0.68rem", lineHeight: 1.14, minWidth: 0, overflowWrap: "anywhere" }}>{article.title}</strong>
                </a>
              ))}
            </div>
          </details>
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

	          .hero-work-list {
	            display: grid !important;
	            gap: 0.2rem 0.28rem !important;
	            overflow-x: visible;
	            padding-bottom: 0;
	            width: calc(100vw - 2rem) !important;
	            max-width: calc(100vw - 2rem) !important;
	            box-sizing: border-box;
	          }

            .hero-directory-group,
            .hero-article-list {
              gap: 0.18rem 0.26rem !important;
            }

	          .hero-work-row,
            .hero-article-row {
	            flex: 0 1 auto !important;
	            min-width: 0 !important;
	            max-width: calc(50vw - 1.2rem) !important;
	            box-sizing: border-box;
	            gap: 0 !important;
	            padding: 0.14rem 0.26rem !important;
	          }

            .hero-reading-library summary {
              padding: 0.12rem 0.26rem !important;
            }

          .hero-work-tags {
            display: none !important;
          }

          .hero-work-row strong,
          .hero-article-row strong,
          .hero-work-row span {
            overflow-wrap: anywhere;
          }
        }

        .hero-work-row:focus-visible,
        .hero-article-row:focus-visible {
          outline: 3px solid var(--cherry-red);
          outline-offset: 4px;
        }

        .hero-work-row,
        .hero-article-row {
          transition: color 0.18s ease, background 0.18s ease;
        }

	        .hero-work-row:hover,
	        .hero-work-row:focus-visible,
          .hero-article-row:hover,
          .hero-article-row:focus-visible {
		          background: rgba(250,247,241,0.42) !important;
	        }

        @media (prefers-reduced-motion: reduce) {
          .hero-work-row,
          .hero-article-row {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
