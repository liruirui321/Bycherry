import type { MouseEvent } from "react";
import { essays } from "./ResearchEssays";
import { notes } from "./Notes";
import { navigateClient, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";

type LibraryArticle = {
  href: string;
  title: string;
  desc: string;
  label: string;
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
      label: article.label,
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
      label: article.tag,
      firstAction: article.actionSteps[0],
      firstCheck: article.checklist[0],
      firstOutput: article.starterTemplate[0],
    })),
  },
];

const readingWorkflow = [
  {
    label: "选卡点",
    body: "先选当前最想解决的科研阅读、AI 使用或项目整理问题。",
  },
  {
    label: "带着问题读",
    body: "进入正文后只先完成第一个动作，不急着把全文看完。",
  },
  {
    label: "留下记录",
    body: "用页面里的表格或记录区，复制一份能继续复盘的产出。",
  },
];

const articleChoiceRoutes = [
  {
    label: "科研证据读不顺",
    href: "/research/science-to-learning-question",
    cue: "先练问题、证据和边界分开。",
  },
  {
    label: "平台不会配置",
    href: "/research/ai-assessment-quality-control",
    cue: "直接照填 SciFusion 自测字段。",
  },
  {
    label: "AI 输出不放心",
    href: "/notes/ai-learning-material-audit",
    cue: "先做材料质检和边界核查。",
  },
  {
    label: "项目没有证据",
    href: "/notes/pbl-rubric-evidence",
    cue: "把任务、量规和作品证据对齐。",
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
        <div style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gap: "0.58rem" }}>
          <header style={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", alignItems: "center", gap: "0.62rem", borderBottom: "1px solid rgba(94,68,42,0.1)", paddingBottom: "0.46rem" }}>
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
              <p style={{ margin: "0.12rem 0 0", color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.35, fontWeight: 800 }}>
                每篇都给出先做、检查和产出，按当前任务直接进入。
              </p>
            </div>
          </header>

          <section className="article-library-start-strip" aria-labelledby="reading-start-title" style={{ display: "grid", gap: "0.34rem", borderBottom: "1px solid rgba(94,68,42,0.09)", paddingBottom: "0.44rem" }}>
            <h2 id="reading-start-title" style={{ margin: 0, color: "var(--cherry-warm-brown)", fontSize: "0.9rem", lineHeight: 1.2, fontWeight: 920 }}>
              先按这条路径打开文章
            </h2>
            <div role="list" aria-label="阅读库使用路径" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.44rem" }}>
              {readingWorkflow.map((item, index) => (
                <div
                  key={item.label}
                  role="listitem"
                  className="article-library-start-item"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto minmax(0, 1fr)",
                    gap: "0.42rem",
                    alignItems: "start",
                    minWidth: 0,
                    background: "rgba(250,247,241,0.58)",
                    border: "1px solid rgba(94,68,42,0.1)",
                    borderRadius: 8,
                    padding: "0.48rem 0.54rem",
                  }}
                >
                  <span aria-hidden="true" style={{ display: "grid", placeItems: "center", width: 24, height: 24, borderRadius: 999, background: "rgba(93,140,101,0.14)", color: "var(--cherry-forest)", fontSize: "0.68rem", lineHeight: 1, fontWeight: 950 }}>
                    {index + 1}
                  </span>
                  <span style={{ display: "grid", gap: "0.1rem", minWidth: 0 }}>
                    <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.76rem", lineHeight: 1.16, fontWeight: 930 }}>{item.label}</strong>
                    <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.34, fontWeight: 780 }}>{item.body}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="article-choice-route-strip" aria-labelledby="article-choice-title" style={{ display: "grid", gap: "0.34rem", borderBottom: "1px solid rgba(94,68,42,0.09)", paddingBottom: "0.44rem" }}>
            <h2 id="article-choice-title" style={{ margin: 0, color: "var(--cherry-warm-brown)", fontSize: "0.9rem", lineHeight: 1.2, fontWeight: 920 }}>
              按卡点选文章
            </h2>
            <div role="list" aria-label="按卡点选择文章" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.42rem" }}>
              {articleChoiceRoutes.map((item) => (
                <a
                  key={item.href}
                  className="article-choice-route-card"
                  href={item.href}
                  onClick={(event) => openContent(item.href, event)}
                  onMouseEnter={() => preloadRouteForHref(item.href)}
                  onFocus={() => preloadRouteForHref(item.href)}
                  onPointerDown={() => preloadRouteForHref(item.href)}
                  role="listitem"
                  aria-label={`${item.label}：${item.cue}`}
                  style={{
                    color: "var(--cherry-warm-brown)",
                    textDecoration: "none",
                    background: "rgba(250,247,241,0.62)",
                    border: "1px solid rgba(94,68,42,0.1)",
                    borderRadius: 8,
                    padding: "0.5rem 0.56rem",
                    minHeight: 72,
                    display: "grid",
                    gap: "0.18rem",
                    alignContent: "start",
                  }}
                >
                  <strong style={{ color: "var(--cherry-forest)", fontSize: "0.76rem", lineHeight: 1.2, fontWeight: 930 }}>{item.label}</strong>
                  <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.36, fontWeight: 800 }}>{item.cue}</span>
                </a>
              ))}
            </div>
          </section>

          {articleGroups.map((group) => (
            <section key={group.title} aria-labelledby={`reading-${group.title}`} style={{ display: "grid", gap: "0.34rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.72rem", flexWrap: "wrap" }}>
                <h2 id={`reading-${group.title}`} style={{ margin: 0, color: "var(--cherry-forest)", fontSize: "0.92rem", lineHeight: 1.2, fontWeight: 900 }}>
                  {group.title}
                </h2>
                <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.25, fontWeight: 900 }}>{group.desc}</span>
              </div>

              <div className="article-library-list" style={{ display: "grid", gap: "0.22rem" }}>
                {group.articles.map((article) => (
                  <a
                    key={article.href}
                    className="article-library-row"
                    href={article.href}
                    onClick={(event) => openContent(article.href, event)}
                    onMouseEnter={() => preloadRouteForHref(article.href)}
                    onFocus={() => preloadRouteForHref(article.href)}
                    onPointerDown={() => preloadRouteForHref(article.href)}
                    aria-label={`打开${article.title}：${article.desc}。先做：${article.firstAction}。检查：${article.firstCheck}。产出：${article.firstOutput}`}
                    style={{
                      color: "var(--cherry-warm-brown)",
                      textDecoration: "none",
                      background: "transparent",
                      border: "none",
                      borderLeft: "3px solid rgba(93,140,101,0.5)",
                      borderRadius: 0,
                      padding: "0.36rem 0.56rem",
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr) minmax(210px, 0.8fr) auto",
                      gap: "0.52rem",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ display: "grid", gap: "0.12rem", minWidth: 0 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.34rem", flexWrap: "wrap" }}>
                        <strong style={{ fontSize: "0.86rem", lineHeight: 1.25, fontWeight: 900 }}>{article.title}</strong>
                      </span>
                      <span className="article-library-first-action" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.7rem", lineHeight: 1.32, fontWeight: 800, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                        先做：{article.firstAction}
                      </span>
                    </span>
                    <span className="article-library-proof-strip" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.28rem", minWidth: 0 }}>
                      <span style={{ color: "var(--cherry-warm-mid)", background: "rgba(250,247,241,0.62)", border: "1px solid rgba(94,68,42,0.08)", borderRadius: 8, padding: "0.28rem 0.34rem", fontSize: "0.64rem", lineHeight: 1.24, fontWeight: 820, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        检查：{article.firstCheck}
                      </span>
                      <span style={{ color: "var(--cherry-warm-mid)", background: "rgba(250,247,241,0.62)", border: "1px solid rgba(94,68,42,0.08)", borderRadius: 8, padding: "0.28rem 0.34rem", fontSize: "0.64rem", lineHeight: 1.24, fontWeight: 820, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        产出：{article.firstOutput}
                      </span>
                    </span>
                    <span className="article-library-meta" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.2, fontWeight: 900, whiteSpace: "nowrap" }}>
                      {article.label}
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
          transition: color 0.18s ease, background 0.18s ease;
        }

        .article-library-row:hover,
        .article-library-row:focus-visible,
        .article-choice-route-card:hover,
        .article-choice-route-card:focus-visible {
          background: rgba(250,247,241,0.54) !important;
        }

        .article-choice-route-card:focus-visible {
          outline: 3px solid var(--cherry-red);
          outline-offset: 4px;
        }

        @media (max-width: 860px) {
          .article-library-start-strip > div {
            grid-template-columns: 1fr !important;
            gap: 0.3rem !important;
          }

          .article-library-start-item {
            grid-template-columns: auto minmax(0, 1fr) !important;
            padding: 0.42rem !important;
          }

          .article-choice-route-strip > div {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 0.34rem !important;
          }

          .article-choice-route-card {
            min-height: 66px !important;
            padding: 0.42rem !important;
          }

          .article-library-row {
            grid-template-columns: minmax(0, 1fr) auto !important;
            gap: 0.34rem !important;
            padding: 0.24rem 0.42rem !important;
          }

          .article-library-proof-strip {
            display: none !important;
          }

          .article-library-meta {
            font-size: 0.62rem !important;
          }

          .article-library-first-action {
            font-size: 0.66rem !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .article-library-row {
            transition: none !important;
          }

          .article-library-row:hover,
          .article-library-row:focus-visible {
            background: rgba(250,247,241,0.54) !important;
          }
        }
      `}</style>
    </main>
  );
}
