import { IconBook, IconCheck, IconCoffee, IconLeafSmall } from "./Icons";
import { notes } from "./Notes";
import { essays } from "./ResearchEssays";
import { copyText } from "../clipboard";
import { navigateClient, shouldUseClientNavigation } from "../navigation";
import { useState } from "react";

type ArticleKind = "note" | "research";

function navigateHome(hash: string) {
  navigateClient(`/${hash}`);
}

function navigateToPath(href: string) {
  navigateClient(href);
}

export function ArticleDetailPage({ kind, slug }: { kind: ArticleKind; slug: string }) {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const collection = kind === "note" ? notes : essays;
  const article = collection.find((item) => item.slug === slug);
  const articleIndex = collection.findIndex((item) => item.slug === slug);
  const previousArticle = articleIndex > 0 ? collection[articleIndex - 1] : null;
  const nextArticle = articleIndex >= 0 && articleIndex < collection.length - 1 ? collection[articleIndex + 1] : null;
  const backHash = kind === "note" ? "#notes" : "#research";
  const backText = kind === "note" ? "回到笔记" : "回到科研随笔";
  const summaryText = article
    ? `【阅读摘要】
标题：${article.title}
日期：${article.date}
类型：${"tag" in article ? article.tag : article.label}
阅读时间：约 ${"readTime" in article ? article.readTime : article.readMin} 分钟

一、摘要
${article.excerpt ?? article.body}

二、正文要点
${article.paragraphs.map((paragraph, index) => `${index + 1}. ${paragraph}`).join("\n")}

三、可以带走的想法
${article.highlights.map((highlight, index) => `${index + 1}. ${highlight}`).join("\n")}`
    : "";

  async function copyArticleSummary() {
    if (!summaryText) return;
    const copiedToClipboard = await copyText(summaryText);
    if (copiedToClipboard) {
      setCopiedSummary(true);
      setCopyStatus("阅读摘要已复制到剪贴板。");
      window.setTimeout(() => setCopiedSummary(false), 1400);
      return;
    }

    setCopiedSummary(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  if (!article) {
    return (
      <main id="main-content" tabIndex={-1} style={{ padding: "5rem 1.5rem", maxWidth: 760, margin: "0 auto", fontFamily: "'Nunito', sans-serif" }}>
        <a
          className="article-detail-link"
          href={`/${backHash}`}
          onClick={(event) => {
            if (!shouldUseClientNavigation(event)) return;
            event.preventDefault();
            navigateHome(backHash);
          }}
          style={{ color: "var(--cherry-forest)", fontWeight: 900, textDecoration: "none" }}
        >
          ← {backText}
        </a>
        <h1 style={{ color: "var(--cherry-warm-brown)", fontSize: "2rem", marginTop: "1.5rem" }}>没有找到这篇内容</h1>
        <style>
          {`
            .article-detail-link:focus-visible {
              outline: 3px solid var(--cherry-red);
              outline-offset: 4px;
            }

            .article-detail-link:hover,
            .article-detail-link:focus-visible {
              color: var(--cherry-red) !important;
            }
          `}
        </style>
      </main>
    );
  }

  return (
    <main id="main-content" tabIndex={-1} style={{ fontFamily: "'Nunito', sans-serif", background: "var(--background)" }}>
      <section style={{ padding: "0.45rem 1.5rem 1.2rem" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <article
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 18,
              padding: "0.78rem 1.05rem 1.1rem",
              boxShadow: "4px 7px 0px rgba(94,68,42,0.07)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: -10, right: 28, width: 68, height: 17, background: article.tagBg ?? article.labelBg, opacity: 0.72, borderRadius: 4, transform: "rotate(4deg)" }} />
            <svg style={{ position: "absolute", right: 14, top: 38, opacity: 0.13 }} width="76" height="64" viewBox="0 0 98 82" fill="none" aria-hidden="true" focusable="false">
              <path d="M16 72 Q24 42 72 13 Q75 50 16 72Z" fill={article.tagColor ?? article.labelColor} />
              <path d="M22 67 Q43 51 68 22" stroke="var(--cherry-warm-brown)" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
              <circle cx="27" cy="31" r="7" fill="var(--cherry-yellow)" opacity="0.8" />
            </svg>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: "0.38rem", paddingRight: 70 }}>
              <a
                className="article-detail-link article-back-chip"
                href={`/${backHash}`}
                onClick={(event) => {
                  if (!shouldUseClientNavigation(event)) return;
                  event.preventDefault();
                  navigateHome(backHash);
                }}
                aria-label={backText}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                  color: "var(--cherry-forest)",
                  background: "var(--muted)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 999,
                  textDecoration: "none",
                  fontWeight: 900,
                  fontSize: "0.95rem",
                }}
              >
                ←
              </a>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  background: article.tagBg ?? article.labelBg,
                  color: article.tagColor ?? article.labelColor,
                  borderRadius: 999,
                  padding: "0.18rem 0.62rem",
                  fontSize: "0.74rem",
                  fontWeight: 900,
                }}
              >
                {article.icon} {"tag" in article ? article.tag : article.label}
              </span>
              <span style={{ fontFamily: "'Caveat', cursive", color: "var(--cherry-warm-mid)", fontWeight: 700 }}>
                {article.date}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "'Caveat', cursive", color: "var(--cherry-warm-mid)" }}>
                <IconCoffee size={16} /> 约 {"readTime" in article ? article.readTime : article.readMin} 分钟
              </span>
            </div>

            <h1 style={{ color: "var(--cherry-warm-brown)", fontSize: "clamp(1.18rem, 2.8vw, 1.62rem)", fontWeight: 900, lineHeight: 1.22, marginBottom: "0.42rem", maxWidth: 720 }}>
              {article.title}
            </h1>

            <p style={{ color: "var(--cherry-warm-mid)", fontSize: "0.88rem", lineHeight: 1.65, margin: "0 0 0.65rem", maxWidth: 760 }}>
              {article.excerpt ?? article.body}
            </p>

            <div style={{ display: "grid", gap: "0.62rem", marginBottom: "0.9rem" }}>
              {article.paragraphs.map((paragraph) => (
                <p key={paragraph} style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.78, fontSize: "0.93rem", margin: 0 }}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div
              style={{
                background: "var(--cherry-yellow-light)",
                border: "1.5px solid var(--cherry-yellow)",
                borderRadius: 16,
                padding: "0.9rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.55rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900 }}>
                  <IconBook size={18} />
                  可以带走的想法
                </div>
                <button type="button" onClick={copyArticleSummary} aria-describedby="article-summary-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.4rem 0.76rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                  {copiedSummary ? "已复制" : "复制摘要"}
                </button>
              </div>
              <div id="article-summary-copy-status" role="status" aria-live="polite" style={{ minHeight: "1rem", color: "var(--cherry-forest)", fontSize: "0.74rem", fontWeight: 900, marginBottom: "0.42rem" }}>
                {copyStatus}
              </div>
              <div style={{ display: "grid", gap: "0.65rem" }}>
                {article.highlights.map((highlight) => (
                  <div key={highlight} style={{ display: "flex", alignItems: "flex-start", gap: 8, color: "var(--cherry-warm-mid)", lineHeight: 1.58, fontSize: "0.86rem" }}>
                    <IconCheck size={16} color="var(--cherry-forest)" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              className="article-detail-link"
              href={`/${backHash}`}
              onClick={(event) => {
                if (!shouldUseClientNavigation(event)) return;
                event.preventDefault();
                navigateHome(backHash);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                marginTop: "1.5rem",
                color: "var(--cherry-forest)",
                fontWeight: 900,
                textDecoration: "none",
              }}
            >
              ← {backText}
            </a>

            {(previousArticle || nextArticle) ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.8rem", marginTop: "1.2rem" }}>
                {previousArticle ? (
                  <a
                    className="article-nav-card"
                    href={previousArticle.href}
                    onClick={(event) => {
                      if (!shouldUseClientNavigation(event)) return;
                      event.preventDefault();
                      navigateToPath(previousArticle.href);
                    }}
                    style={{ display: "grid", gap: "0.35rem", background: "var(--muted)", border: "1.5px solid var(--border)", borderRadius: 16, padding: "0.85rem", color: "var(--cherry-warm-mid)", textDecoration: "none" }}
                  >
                    <span style={{ fontFamily: "'Caveat', cursive", color: "var(--cherry-forest)", fontWeight: 900 }}>← 上一篇</span>
                    <strong style={{ color: "var(--cherry-warm-brown)", lineHeight: 1.45, fontSize: "0.9rem" }}>{previousArticle.title}</strong>
                  </a>
                ) : null}
                {nextArticle ? (
                  <a
                    className="article-nav-card"
                    href={nextArticle.href}
                    onClick={(event) => {
                      if (!shouldUseClientNavigation(event)) return;
                      event.preventDefault();
                      navigateToPath(nextArticle.href);
                    }}
                    style={{ display: "grid", gap: "0.35rem", background: "var(--muted)", border: "1.5px solid var(--border)", borderRadius: 16, padding: "0.85rem", color: "var(--cherry-warm-mid)", textDecoration: "none" }}
                  >
                    <span style={{ fontFamily: "'Caveat', cursive", color: "var(--cherry-forest)", fontWeight: 900 }}>下一篇 →</span>
                    <strong style={{ color: "var(--cherry-warm-brown)", lineHeight: 1.45, fontSize: "0.9rem" }}>{nextArticle.title}</strong>
                  </a>
                ) : null}
              </div>
            ) : null}
          </article>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem", opacity: 0.55 }}>
            <IconLeafSmall size={28} color="var(--cherry-sage)" />
          </div>
        </div>
      </section>

      <style>
        {`
          .article-detail-link:focus-visible,
          .article-nav-card:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          .article-detail-link:hover,
          .article-detail-link:focus-visible {
            color: var(--cherry-red) !important;
          }

          .article-back-chip:hover,
          .article-back-chip:focus-visible {
            background: var(--cherry-yellow-light) !important;
            border-color: var(--cherry-yellow) !important;
          }

          .article-nav-card {
            transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
          }

          .article-nav-card:hover,
          .article-nav-card:focus-visible {
            transform: translateY(-2px);
            border-color: var(--cherry-sage) !important;
            box-shadow: 3px 6px 0 rgba(94,68,42,0.08);
          }

          @media (prefers-reduced-motion: reduce) {
            .article-nav-card {
              transition: none !important;
              transform: none !important;
            }
          }
        `}
      </style>
    </main>
  );
}
