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
  const firstArticle = articleLinks[0];

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
        padding: "0.38rem 1.5rem 0.42rem",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        background: "var(--background)",
      }}
    >
      <div className="hero-inner" style={{ position: "relative", zIndex: 2, maxWidth: 960, width: "100%", minWidth: 0, margin: "0 auto", boxSizing: "border-box" }}>
        <div className="hero-header-row" style={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", alignItems: "center", gap: "0.52rem", marginBottom: "0.3rem" }}>
          <div style={{ minWidth: 0, display: "flex", alignItems: "baseline", gap: "0.45rem", flexWrap: "wrap" }}>
            <h1
              id="hero-heading"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "0.9rem",
                fontWeight: 900,
                lineHeight: 1.12,
                color: "var(--cherry-warm-brown)",
                margin: "0",
                letterSpacing: 0,
                overflowWrap: "anywhere",
              }}
            >
              内容目录
            </h1>
            <span className="hero-content-count" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.7rem", fontWeight: 900, lineHeight: 1.2 }}>
              {works.length} 个工具 · {articleLinks.length} 篇阅读
            </span>
          </div>
        </div>

        <nav id="works" className="hero-work-list" aria-label="内容目录" style={{ minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}>
          <div className="hero-directory-strip" role="list" aria-label="当前内容" style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: "0.34rem", minWidth: 0 }}>
            {works.map((work) => {
              const toolHref = getWorkToolHref(work.href);
              return (
                <a
                  className="hero-work-row"
                  key={work.slug}
                  role="listitem"
                  href={toolHref}
                  aria-label={`打开${work.title}：${work.desc}`}
                  onClick={(event) => openContent(toolHref, event)}
                  onMouseEnter={() => preloadRouteForHref(getWorkToolHref(work.href))}
                  onFocus={() => preloadRouteForHref(getWorkToolHref(work.href))}
                  onPointerDown={() => preloadRouteForHref(getWorkToolHref(work.href))}
                  style={{
                    background: "rgba(250,247,241,0.58)",
                    border: `1.5px solid ${work.border}`,
                    borderRadius: 8,
                    padding: "0.34rem 0.42rem",
                    color: "var(--cherry-warm-brown)",
                    textDecoration: "none",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 0,
                    minHeight: 34,
                    boxSizing: "border-box",
                  }}
                >
                  <strong style={{ fontSize: "0.72rem", lineHeight: 1.14, minWidth: 0, overflowWrap: "anywhere" }}>{work.title}</strong>
                </a>
              );
            })}
            <a
              className="hero-reading-library"
              role="listitem"
              href={firstArticle?.href ?? "/"}
              aria-label={`打开阅读库：共 ${articleLinks.length} 篇，从${firstArticle?.title ?? "第一篇"}开始`}
              onClick={(event) => firstArticle ? openContent(firstArticle.href, event) : undefined}
              onMouseEnter={() => firstArticle ? preloadRouteForHref(firstArticle.href) : undefined}
              onFocus={() => firstArticle ? preloadRouteForHref(firstArticle.href) : undefined}
              onPointerDown={() => firstArticle ? preloadRouteForHref(firstArticle.href) : undefined}
              style={{
                background: "var(--cherry-sage-light)",
                border: "1.5px solid var(--cherry-sage)",
                borderRadius: 8,
                padding: "0.34rem 0.42rem",
                color: "var(--cherry-warm-brown)",
                textDecoration: "none",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 0,
                minHeight: 34,
                boxSizing: "border-box",
              }}
            >
              <strong style={{ fontSize: "0.72rem", lineHeight: 1.14, minWidth: 0, overflowWrap: "anywhere" }}>阅读库 · {articleLinks.length} 篇</strong>
            </a>
          </div>
        </nav>
      </div>

      <style>{`
        @media (max-width: 860px) {
          #top {
            padding: 0.36rem 1rem 0.4rem !important;
          }

          .hero-inner,
          .hero-header-row {
            width: 100% !important;
            max-width: calc(100vw - 2rem) !important;
            grid-template-columns: 1fr !important;
            overflow-wrap: anywhere;
          }

            .hero-header-row {
              margin-bottom: 0.28rem !important;
            }

            .hero-directory-strip {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 0.3rem !important;
            }

            .hero-work-row,
            .hero-reading-library {
              min-height: 32px !important;
              padding: 0.3rem 0.36rem !important;
            }
        }

        .hero-work-row:focus-visible,
        .hero-reading-library:focus-visible {
          outline: 3px solid var(--cherry-red);
          outline-offset: 4px;
        }

        .hero-work-row,
        .hero-reading-library {
          transition: color 0.18s ease, background 0.18s ease;
        }

	        .hero-work-row:hover,
	        .hero-work-row:focus-visible,
          .hero-reading-library:hover,
          .hero-reading-library:focus-visible {
		          background: var(--cherry-yellow-light) !important;
	        }

        @media (prefers-reduced-motion: reduce) {
          .hero-work-row,
          .hero-reading-library {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
