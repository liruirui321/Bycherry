import { IconBook, IconCheck, IconCoffee, IconLeafSmall } from "./Icons";
import { notes } from "./Notes";
import { essays } from "./ResearchEssays";
import { EmptyStateCard } from "./EmptyStateCard";
import { copyText } from "../clipboard";
import { navigateClient, shouldUseClientNavigation } from "../navigation";
import { useState } from "react";

type ArticleKind = "note" | "research";

function ArticleIllustration({ slug, color }: { slug: string; color: string }) {
  const isAi = slug.includes("ai") || slug.includes("workflow") || slug.includes("assessment");
  const isPlant = slug.includes("plant") || slug.includes("genome") || slug.includes("science");

  if (isAi) {
    return (
      <svg width="144" height="108" viewBox="0 0 144 108" fill="none" aria-hidden="true" focusable="false">
        <rect x="18" y="29" width="82" height="52" rx="14" fill="rgba(250,247,241,0.86)" stroke={color} strokeWidth="2.4" />
        <rect x="29" y="40" width="47" height="7" rx="3.5" fill="var(--cherry-blue-light)" />
        <path d="M30 56 H82 M30 66 H72" stroke="var(--cherry-warm-mid)" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
        <path d="M42 82 H94" stroke="var(--cherry-warm-brown)" strokeWidth="4" strokeLinecap="round" opacity="0.18" />
        <path d="M103 24 L108 35 L120 39 L109 45 L105 57 L99 46 L87 42 L98 36Z" fill="var(--cherry-yellow)" stroke="rgba(94,68,42,0.16)" strokeWidth="1.4" />
        <path d="M113 63 C125 56 138 63 136 77 C134 91 113 94 106 81 C102 73 105 67 113 63Z" fill="var(--cherry-peach-light)" stroke="var(--cherry-red)" strokeWidth="2.2" />
        <circle cx="116" cy="76" r="3.4" fill="var(--cherry-red)" />
        <circle cx="127" cy="77" r="3.4" fill="var(--cherry-red)" />
        <path d="M118 85 C123 89 128 88 132 84" stroke="var(--cherry-warm-brown)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (isPlant) {
    return (
      <svg width="144" height="108" viewBox="0 0 144 108" fill="none" aria-hidden="true" focusable="false">
        <path d="M15 88 C34 72 55 76 71 65 C93 50 111 61 132 43 V102 H15Z" fill="var(--cherry-sage-light)" opacity="0.72" />
        <path d="M23 91 C43 98 98 98 125 88" stroke="rgba(58,92,62,0.2)" strokeWidth="5" strokeLinecap="round" />
        <path d="M47 90 C43 65 50 45 65 25" stroke="var(--cherry-forest)" strokeWidth="5" strokeLinecap="round" />
        <path d="M59 34 C75 17 101 22 109 42 C85 53 68 49 59 34Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth="2" />
        <path d="M50 58 C31 49 18 58 16 77 C34 82 46 75 50 58Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth="2" />
        <circle cx="96" cy="39" r="8" fill="var(--cherry-red)" opacity="0.84" />
        <path d="M88 18 C99 10 113 12 121 22" stroke="var(--cherry-yellow)" strokeWidth="6" strokeLinecap="round" opacity="0.75" />
        <path d="M24 31 C35 20 48 20 60 32" stroke="var(--cherry-blue)" strokeWidth="5" strokeLinecap="round" opacity="0.28" />
      </svg>
    );
  }

  return (
    <svg width="144" height="108" viewBox="0 0 144 108" fill="none" aria-hidden="true" focusable="false">
      <rect x="24" y="22" width="74" height="66" rx="16" fill="rgba(250,247,241,0.88)" stroke={color} strokeWidth="2.4" />
      <path d="M38 42 H82 M38 55 H78 M38 68 H70" stroke="var(--cherry-warm-mid)" strokeWidth="3.4" strokeLinecap="round" opacity="0.42" />
      <circle cx="101" cy="34" r="15" fill="var(--cherry-yellow)" opacity="0.78" />
      <path d="M92 70 C105 57 125 61 132 77 C113 89 99 84 92 70Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth="2" />
      <path d="M108 25 L113 33 L122 35 L115 41 L113 50 L108 42 L99 39 L106 34Z" fill="var(--cherry-peach)" />
    </svg>
  );
}

function navigateHome(hash: string) {
  navigateClient(`/${hash}`);
}

function navigateToPath(href: string) {
  navigateClient(href);
}

export function ArticleDetailPage({ kind, slug }: { kind: ArticleKind; slug: string }) {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [copiedActionPack, setCopiedActionPack] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const collection = kind === "note" ? notes : essays;
  const article = collection.find((item) => item.slug === slug);
  const articleIndex = collection.findIndex((item) => item.slug === slug);
  const previousArticle = articleIndex > 0 ? collection[articleIndex - 1] : null;
  const nextArticle = articleIndex >= 0 && articleIndex < collection.length - 1 ? collection[articleIndex + 1] : null;
  const backHash = kind === "note" ? "#notes" : "#research";
  const backText = kind === "note" ? "回到笔记" : "回到科研随笔";
  const navArticles = [
    previousArticle ? { label: "上一篇", arrow: "←", article: previousArticle, align: "left" as const } : null,
    nextArticle ? { label: "下一篇", arrow: "→", article: nextArticle, align: "right" as const } : null,
  ].filter((item): item is { label: string; arrow: string; article: NonNullable<typeof article>; align: "left" | "right" } => Boolean(item));
  const readingPath = article
    ? [
        { label: "进入点", body: article.highlights[0] ?? "先找到这篇文章要解决的问题。" },
        { label: "证据链", body: article.highlights[1] ?? "再看作者如何组织证据和判断边界。" },
        { label: "可迁移方法", body: article.highlights[2] ?? "最后提炼可以复用到自己项目里的方法。" },
      ]
    : [];
  const actionSteps = article && "actionSteps" in article ? article.actionSteps : [];
  const checklist = article && "checklist" in article ? article.checklist : [];
  const starterTemplate = article && "starterTemplate" in article ? article.starterTemplate : [];
  const pitfalls = article && "pitfalls" in article ? article.pitfalls : [];
  const starterTemplateText = starterTemplate.map((item) => `- ${item}`).join("\n");
  const actionPackText = article
    ? `【行动包】${article.title}

一、上手步骤
${actionSteps.map((step, index) => `${index + 1}. ${step}`).join("\n")}

二、检查清单
${checklist.map((item, index) => `${index + 1}. ${item}`).join("\n")}

三、避坑提醒
${pitfalls.map((item, index) => `${index + 1}. ${item}`).join("\n")}

四、可套用模板
${starterTemplateText}`
    : "";
  const summaryText = article
    ? `【阅读摘要】
标题：${article.title}
日期：${article.date}
类型：${"tag" in article ? article.tag : article.label}
阅读时间：约 ${"readTime" in article ? article.readTime : article.readMin} 分钟
${"platformUrl" in article ? `平台入口：${article.platformUrl}\n` : ""}

一、摘要
${article.excerpt ?? article.body}

二、正文要点
${article.paragraphs.map((paragraph, index) => `${index + 1}. ${paragraph}`).join("\n")}

三、上手步骤
${actionSteps.map((step, index) => `${index + 1}. ${step}`).join("\n")}

四、检查清单
${checklist.map((item, index) => `${index + 1}. ${item}`).join("\n")}

五、避坑提醒
${pitfalls.map((item, index) => `${index + 1}. ${item}`).join("\n")}

六、可套用模板
${starterTemplateText}

七、可带走的方法
${article.highlights.map((highlight, index) => `${index + 1}. ${highlight}`).join("\n")}`
    : "";

  async function copyArticleSummary() {
    if (!summaryText) return;
    const copiedToClipboard = await copyText(summaryText);
    if (copiedToClipboard) {
      setCopiedSummary(true);
      setCopiedTemplate(false);
      setCopiedActionPack(false);
      setCopyStatus("阅读摘要已复制到剪贴板。");
      window.setTimeout(() => setCopiedSummary(false), 1400);
      return;
    }

    setCopiedSummary(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyTemplateText() {
    if (!starterTemplateText) return;
    const copiedToClipboard = await copyText(starterTemplateText);
    if (copiedToClipboard) {
      setCopiedTemplate(true);
      setCopiedSummary(false);
      setCopiedActionPack(false);
      setCopyStatus("可套用模板已复制到剪贴板。");
      window.setTimeout(() => setCopiedTemplate(false), 1400);
      return;
    }

    setCopiedTemplate(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyActionPack() {
    if (!actionPackText) return;
    const copiedToClipboard = await copyText(actionPackText);
    if (copiedToClipboard) {
      setCopiedActionPack(true);
      setCopiedSummary(false);
      setCopiedTemplate(false);
      setCopyStatus("行动包已复制到剪贴板。");
      window.setTimeout(() => setCopiedActionPack(false), 1400);
      return;
    }

    setCopiedActionPack(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  if (!article) {
    return (
      <main id="main-content" tabIndex={-1} style={{ minHeight: "58vh", padding: "5rem 1.5rem", display: "grid", placeItems: "center", fontFamily: "'Nunito', sans-serif" }}>
        <EmptyStateCard
          eyebrow={kind === "note" ? "笔记" : "科研随笔"}
          title="没有找到这篇内容"
          body={`这篇内容可能已经移动。可以回到${kind === "note" ? "笔记" : "科研随笔"}目录，继续浏览最近更新。`}
          href={`/${backHash}`}
          linkText={backText}
          onNavigate={(event) => {
            if (!shouldUseClientNavigation(event)) return;
            event.preventDefault();
            navigateHome(backHash);
          }}
        />
      </main>
    );
  }

  return (
    <main id="main-content" tabIndex={-1} style={{ fontFamily: "'Nunito', sans-serif", background: "var(--background)" }}>
      <section style={{ padding: "0.45rem 1.5rem 1.2rem" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <article
            className="article-detail-card"
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 8,
              padding: "0.78rem 1.05rem 1.1rem",
              boxShadow: "0 8px 18px rgba(94,68,42,0.06)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div className="article-illustration-stamp" style={{ background: article.tagBg ?? article.labelBg, borderColor: article.tagColor ?? article.labelColor }}>
              <ArticleIllustration slug={article.slug} color={article.tagColor ?? article.labelColor} />
            </div>

            <div className="article-meta-row" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: "0.38rem", paddingRight: 162 }}>
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
              <span style={{ color: "var(--cherry-warm-mid)", fontWeight: 700 }}>
                {article.date}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--cherry-warm-mid)" }}>
                <IconCoffee size={16} /> 约 {"readTime" in article ? article.readTime : article.readMin} 分钟
              </span>
            </div>

            <h1 style={{ color: "var(--cherry-warm-brown)", fontSize: "clamp(1.18rem, 2.8vw, 1.62rem)", fontWeight: 900, lineHeight: 1.22, marginBottom: "0.42rem", maxWidth: 720 }}>
              {article.title}
            </h1>

            <p style={{ color: "var(--cherry-warm-mid)", fontSize: "0.88rem", lineHeight: 1.65, margin: "0 0 0.65rem", maxWidth: 760 }}>
              {article.excerpt ?? article.body}
            </p>

            {"platformUrl" in article ? (
              <a
                className="article-detail-link"
                href={article.platformUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--cherry-forest)",
                  color: "#FAF7F1",
                  borderRadius: 999,
                  padding: "0.48rem 0.9rem",
                  textDecoration: "none",
                  fontWeight: 900,
                  fontSize: "0.82rem",
                  marginBottom: "0.85rem",
                }}
              >
                打开平台：scifuion.top
              </a>
            ) : null}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.6rem", marginBottom: "0.9rem" }}>
              {readingPath.map((item, index) => (
                <div key={item.label} style={{ background: "var(--muted)", border: "1.5px solid rgba(94,68,42,0.08)", borderRadius: 14, padding: "0.7rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: "0.3rem" }}>
                    <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: "50%", background: article.tagBg ?? article.labelBg, color: article.tagColor ?? article.labelColor, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 900 }}>
                      {index + 1}
                    </span>
                    <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.8rem" }}>{item.label}</strong>
                  </div>
                  <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.55, fontSize: "0.78rem", margin: 0, fontWeight: 800 }}>
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            {actionSteps.length ? (
              <div style={{ background: "var(--cherry-sage-light)", border: "1.5px solid rgba(93,140,101,0.22)", borderRadius: 16, padding: "0.85rem", marginBottom: "0.9rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
                  <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem" }}>上手步骤</div>
                  <button type="button" onClick={copyActionPack} aria-label={`复制${article.title}的行动包`} aria-describedby="article-summary-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.34rem 0.68rem", fontWeight: 900, cursor: "pointer", fontSize: "0.74rem" }}>
                    {copiedActionPack ? "已复制" : "复制行动包"}
                  </button>
                </div>
                <div style={{ display: "grid", gap: "0.55rem" }}>
                  {actionSteps.map((step, index) => (
                    <div key={step} style={{ display: "grid", gridTemplateColumns: "26px minmax(0, 1fr)", gap: 9, alignItems: "start" }}>
                      <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--cherry-forest)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 900 }}>
                        {index + 1}
                      </span>
                      <span style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.62, fontSize: "0.86rem", fontWeight: 800 }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {checklist.length ? (
              <div style={{ background: "var(--muted)", border: "1.5px solid rgba(94,68,42,0.08)", borderRadius: 16, padding: "0.85rem", marginBottom: "0.9rem" }}>
                <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem", marginBottom: "0.65rem" }}>检查清单</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.55rem" }}>
                  {checklist.map((item) => (
                    <div key={item} style={{ display: "grid", gridTemplateColumns: "20px minmax(0, 1fr)", gap: 8, alignItems: "start", background: "var(--card)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.62rem" }}>
                      <IconCheck size={16} color="var(--cherry-forest)" />
                      <span style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.55, fontSize: "0.8rem", fontWeight: 800 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {pitfalls.length ? (
              <div style={{ background: "var(--cherry-peach-light)", border: "1.5px solid rgba(181,80,51,0.18)", borderRadius: 16, padding: "0.85rem", marginBottom: "0.9rem" }}>
                <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem", marginBottom: "0.65rem" }}>避坑提醒</div>
                <div style={{ display: "grid", gap: "0.55rem" }}>
                  {pitfalls.map((item, index) => (
                    <div key={item} style={{ display: "grid", gridTemplateColumns: "24px minmax(0, 1fr)", gap: 9, alignItems: "start", background: "rgba(250,247,241,0.72)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.62rem" }}>
                      <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--cherry-red)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 900 }}>
                        {index + 1}
                      </span>
                      <span style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.55, fontSize: "0.8rem", fontWeight: 800 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {starterTemplate.length ? (
              <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 16, padding: "0.85rem", marginBottom: "0.9rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
                  <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem" }}>可套用模板</div>
                  <button type="button" onClick={copyTemplateText} aria-label={`复制${article.title}的可套用模板`} aria-describedby="article-summary-copy-status" style={{ background: "var(--card)", color: "var(--cherry-forest)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 999, padding: "0.34rem 0.68rem", fontWeight: 900, cursor: "pointer", fontSize: "0.74rem" }}>
                    {copiedTemplate ? "已复制" : "复制模板"}
                  </button>
                </div>
                <code style={{ display: "block", whiteSpace: "pre-wrap", background: "rgba(250,247,241,0.72)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.72rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.78rem", lineHeight: 1.7 }}>
                  {starterTemplateText}
                </code>
              </div>
            ) : null}

            <div style={{ display: "grid", gap: "0.62rem", marginBottom: "0.9rem" }}>
              <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.9rem" }}>正文要点</div>
              {article.paragraphs.map((paragraph, index) => (
                <div key={paragraph} style={{ display: "grid", gridTemplateColumns: "28px minmax(0, 1fr)", gap: 9, alignItems: "start", background: "var(--muted)", border: "1.5px solid rgba(94,68,42,0.08)", borderRadius: 14, padding: "0.72rem" }}>
                  <span aria-hidden="true" style={{ width: 24, height: 24, borderRadius: "50%", background: article.tagBg ?? article.labelBg, color: article.tagColor ?? article.labelColor, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 900 }}>
                    {index + 1}
                  </span>
                  <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.72, fontSize: "0.9rem", margin: 0 }}>
                    {paragraph}
                  </p>
                </div>
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
                  可带走的方法
                </div>
                <button type="button" onClick={copyArticleSummary} aria-label={`复制${article.title}的阅读摘要`} aria-describedby="article-summary-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.4rem 0.76rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
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

            {navArticles.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.8rem", marginTop: "1.2rem" }}>
                {navArticles.map((item) => {
                  const itemType = "tag" in item.article ? item.article.tag : item.article.label;
                  const itemReadTime = "readTime" in item.article ? item.article.readTime : item.article.readMin;
                  const itemColor = "tagColor" in item.article ? item.article.tagColor : item.article.labelColor;
                  const itemBg = "tagBg" in item.article ? item.article.tagBg : item.article.labelBg;

                  return (
                    <a
                      className="article-nav-card"
                      key={item.article.slug}
                      href={item.article.href}
                      aria-label={`${item.label}：${item.article.title}`}
                      onClick={(event) => {
                        if (!shouldUseClientNavigation(event)) return;
                        event.preventDefault();
                        navigateToPath(item.article.href);
                      }}
                      style={{ display: "grid", gap: "0.48rem", justifyItems: item.align === "right" ? "end" : "start", textAlign: item.align, background: "var(--muted)", border: "1.5px solid var(--border)", borderRadius: 16, padding: "0.85rem", color: "var(--cherry-warm-mid)", textDecoration: "none" }}
                    >
                      <span style={{ color: "var(--cherry-forest)", fontWeight: 900 }}>
                        {item.align === "left" ? `${item.arrow} ` : ""}{item.label}{item.align === "right" ? ` ${item.arrow}` : ""}
                      </span>
                      <strong style={{ color: "var(--cherry-warm-brown)", lineHeight: 1.45, fontSize: "0.9rem" }}>{item.article.title}</strong>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: item.align === "right" ? "flex-end" : "flex-start", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ background: itemBg, color: itemColor, borderRadius: 999, padding: "0.13rem 0.5rem", fontSize: "0.68rem", fontWeight: 900 }}>{itemType}</span>
                        <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem" }}>约 {itemReadTime} 分钟</span>
                      </span>
                      <span style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.52, fontSize: "0.76rem" }}>{item.article.highlights[0]}</span>
                    </a>
                  );
                })}
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

          .article-illustration-stamp {
            position: absolute;
            top: 2.7rem;
            right: 1.05rem;
            width: 144px;
            height: 108px;
            border: 1px solid;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 18px rgba(94,68,42,0.07);
            overflow: hidden;
          }

          .article-illustration-stamp svg {
            width: 100%;
            height: 100%;
            display: block;
          }

          @media (min-width: 760px) {
            .article-detail-card {
              padding-right: 10.5rem !important;
            }

            .article-meta-row {
              padding-right: 0 !important;
            }
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
            .article-illustration-stamp {
              transform: none !important;
            }

            .article-nav-card {
              transition: none !important;
              transform: none !important;
            }
          }

          @media (max-width: 759px) {
            .article-illustration-stamp {
              position: relative;
              top: auto;
              right: auto;
              width: min(100%, 178px);
              height: 88px;
              margin: 0 0 0.48rem auto;
            }

            .article-meta-row {
              padding-right: 0 !important;
            }
          }
        `}
      </style>
    </main>
  );
}
