import type { MouseEvent } from "react";
import { essays } from "./ResearchEssays";
import { notes } from "./Notes";
import { navigateClient, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";

type LibraryArticle = {
  href: string;
  title: string;
  desc: string;
  date: string;
  label: string;
  readTime: string;
  firstAction: string;
  firstCheck: string;
  firstOutput: string;
};

const articleGroups = [
  {
    title: "科研证据",
    desc: "从真实材料进入，练习把问题、证据和边界分开。",
    articles: essays.map((article): LibraryArticle => ({
      href: article.href,
      title: article.title,
      desc: article.body,
      date: article.date,
      label: article.label,
      readTime: article.readMin,
      firstAction: article.actionSteps[0],
      firstCheck: article.checklist[0],
      firstOutput: article.starterTemplate[0],
    })),
  },
  {
    title: "学习方法",
    desc: "把 AI、项目和阅读任务拆成可执行的小步骤。",
    articles: notes.map((article): LibraryArticle => ({
      href: article.href,
      title: article.title,
      desc: article.excerpt,
      date: article.date,
      label: article.tag,
      readTime: article.readTime,
      firstAction: article.actionSteps[0],
      firstCheck: article.checklist[0],
      firstOutput: article.starterTemplate[0],
    })),
  },
];

function openContent(href: string, event: MouseEvent<HTMLAnchorElement>) {
  if (!shouldUseClientNavigation(event)) return;
  event.preventDefault();
  navigateClient(href);
}

export function ArticleLibraryPage() {
  return (
    <main id="main-content" tabIndex={-1} style={{ fontFamily: "'Nunito', sans-serif", background: "var(--background)", minHeight: "calc(100vh - 50px)" }}>
      <section style={{ padding: "0.72rem 1.5rem 1.2rem" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gap: "0.72rem" }}>
          <header style={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", alignItems: "center", gap: "0.62rem", borderBottom: "1px solid rgba(94,68,42,0.1)", paddingBottom: "0.58rem" }}>
            <a
              href="/#works"
              onClick={(event) => openContent("/#works", event)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 26,
                height: 26,
                color: "var(--cherry-forest)",
                textDecoration: "none",
                fontWeight: 900,
                borderRadius: 6,
              }}
              aria-label="回到内容目录"
            >
              ←
            </a>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ color: "var(--cherry-warm-brown)", fontSize: "clamp(1.08rem, 2.2vw, 1.36rem)", lineHeight: 1.16, margin: 0, fontWeight: 900 }}>
                阅读库
              </h1>
              <p style={{ margin: "0.18rem 0 0", color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.45, fontWeight: 800 }}>
                {essays.length + notes.length} 篇内容，按用途进入；每篇都保留行动、检查和可保存产出。
              </p>
            </div>
          </header>

          {articleGroups.map((group) => (
            <section key={group.title} aria-labelledby={`reading-${group.title}`} style={{ display: "grid", gap: "0.48rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.72rem", flexWrap: "wrap" }}>
                <h2 id={`reading-${group.title}`} style={{ margin: 0, color: "var(--cherry-forest)", fontSize: "0.92rem", lineHeight: 1.2, fontWeight: 900 }}>
                  {group.title}
                </h2>
                <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.35, fontWeight: 900 }}>{group.desc}</span>
              </div>

              <div className="article-library-list" style={{ display: "grid", gap: "0.42rem" }}>
                {group.articles.map((article) => (
                  <a
                    key={article.href}
                    className="article-library-row"
                    href={article.href}
                    onClick={(event) => openContent(article.href, event)}
                    onMouseEnter={() => preloadRouteForHref(article.href)}
                    onFocus={() => preloadRouteForHref(article.href)}
                    onPointerDown={() => preloadRouteForHref(article.href)}
                    aria-label={`打开${article.title}：${article.desc}`}
                    style={{
                      color: "var(--cherry-warm-brown)",
                      textDecoration: "none",
                      background: "var(--card)",
                      border: "1.5px solid rgba(94,68,42,0.12)",
                      borderRadius: 8,
                      padding: "0.66rem 0.72rem",
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr) minmax(220px, 0.9fr)",
                      gap: "0.68rem",
                      alignItems: "start",
                      boxShadow: "0 8px 18px rgba(94,68,42,0.04)",
                    }}
                  >
                    <span style={{ display: "grid", gap: "0.24rem", minWidth: 0 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.34rem", flexWrap: "wrap" }}>
                        <strong style={{ fontSize: "0.86rem", lineHeight: 1.25, fontWeight: 900 }}>{article.title}</strong>
                        <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.25, fontWeight: 900 }}>{article.label} · {article.readTime} · {article.date}</span>
                      </span>
                      <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.5, fontWeight: 800, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{article.desc}</span>
                    </span>
                    <span className="article-library-actions" style={{ display: "grid", gap: "0.24rem", color: "var(--cherry-warm-mid)", fontSize: "0.7rem", lineHeight: 1.42, fontWeight: 800 }}>
                      <span><strong style={{ color: "var(--cherry-forest)" }}>先做：</strong>{article.firstAction}</span>
                      <span><strong style={{ color: "var(--cherry-red)" }}>检查：</strong>{article.firstCheck}</span>
                      <span><strong style={{ color: "var(--cherry-warm-brown)" }}>产出：</strong>{article.firstOutput}</span>
                    </span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
      <style>{`
        .article-library-row:focus-visible {
          outline: 3px solid var(--cherry-red);
          outline-offset: 4px;
        }

        .article-library-row {
          transition: transform 0.18s ease, background 0.18s ease;
        }

        .article-library-row:hover,
        .article-library-row:focus-visible {
          background: var(--cherry-yellow-light) !important;
          transform: translateY(-1px);
        }

        @media (max-width: 860px) {
          .article-library-row {
            grid-template-columns: 1fr !important;
            gap: 0.42rem !important;
            padding: 0.62rem !important;
          }

          .article-library-actions {
            display: none !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .article-library-row {
            transition: none !important;
          }

          .article-library-row:hover,
          .article-library-row:focus-visible {
            transform: none !important;
          }
        }
      `}</style>
    </main>
  );
}
