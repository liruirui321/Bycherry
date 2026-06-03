import { IconArrowRight, IconBook, IconCheck, IconCoffee, IconLeafSmall } from "./Icons";
import { notes } from "./Notes";
import { essays } from "./ResearchEssays";

type ArticleKind = "note" | "research";

function navigateHome(hash: string) {
  window.history.pushState(null, "", `/${hash}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function navigateToPath(href: string) {
  window.history.pushState(null, "", href);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function ArticleDetailPage({ kind, slug }: { kind: ArticleKind; slug: string }) {
  const collection = kind === "note" ? notes : essays;
  const article = collection.find((item) => item.slug === slug);
  const articleIndex = collection.findIndex((item) => item.slug === slug);
  const previousArticle = articleIndex > 0 ? collection[articleIndex - 1] : null;
  const nextArticle = articleIndex >= 0 && articleIndex < collection.length - 1 ? collection[articleIndex + 1] : null;
  const backHash = kind === "note" ? "#notes" : "#research";
  const backText = kind === "note" ? "回到笔记" : "回到科研随笔";

  if (!article) {
    return (
      <main id="main-content" tabIndex={-1} style={{ padding: "5rem 1.5rem", maxWidth: 760, margin: "0 auto", fontFamily: "'Nunito', sans-serif" }}>
        <a
          href={`/${backHash}`}
          onClick={(event) => {
            event.preventDefault();
            navigateHome(backHash);
          }}
          style={{ color: "var(--cherry-forest)", fontWeight: 900, textDecoration: "none" }}
        >
          ← {backText}
        </a>
        <h1 style={{ color: "var(--cherry-warm-brown)", fontSize: "2rem", marginTop: "1.5rem" }}>没有找到这篇内容</h1>
      </main>
    );
  }

  return (
    <main id="main-content" tabIndex={-1} style={{ fontFamily: "'Nunito', sans-serif", background: "var(--background)" }}>
      <section style={{ padding: "3.9rem 1.5rem 1.4rem" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <a
            href={`/${backHash}`}
            onClick={(event) => {
              event.preventDefault();
              navigateHome(backHash);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--cherry-forest)", textDecoration: "none", fontWeight: 900, fontSize: "0.82rem", marginBottom: "0.8rem" }}
          >
            ← {backText}
          </a>

          <article
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 20,
              padding: "1.25rem",
              boxShadow: "6px 10px 0px rgba(94,68,42,0.08)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: -12, right: 34, width: 78, height: 20, background: article.tagBg ?? article.labelBg, opacity: 0.75, borderRadius: 4, transform: "rotate(4deg)" }} />
            <svg style={{ position: "absolute", right: 18, top: 50, opacity: 0.16 }} width="98" height="82" viewBox="0 0 98 82" fill="none">
              <path d="M16 72 Q24 42 72 13 Q75 50 16 72Z" fill={article.tagColor ?? article.labelColor} />
              <path d="M22 67 Q43 51 68 22" stroke="var(--cherry-warm-brown)" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
              <circle cx="27" cy="31" r="7" fill="var(--cherry-yellow)" opacity="0.8" />
            </svg>

            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: "0.65rem", paddingRight: 84 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  background: article.tagBg ?? article.labelBg,
                  color: article.tagColor ?? article.labelColor,
                  borderRadius: 999,
                  padding: "0.22rem 0.7rem",
                  fontSize: "0.78rem",
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

            <h1 style={{ color: "var(--cherry-warm-brown)", fontSize: "clamp(1.45rem, 4vw, 2.15rem)", fontWeight: 900, lineHeight: 1.2, marginBottom: "0.65rem", maxWidth: 680 }}>
              {article.title}
            </h1>

            <p style={{ color: "var(--cherry-warm-mid)", fontSize: "0.92rem", lineHeight: 1.75, marginBottom: "0.9rem", maxWidth: 720 }}>
              {article.excerpt ?? article.body}
            </p>

            <div style={{ display: "grid", gap: "0.85rem", marginBottom: "1.1rem" }}>
              {article.paragraphs.map((paragraph) => (
                <p key={paragraph} style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.9, fontSize: "0.96rem" }}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div
              style={{
                background: "var(--cherry-yellow-light)",
                border: "1.5px solid var(--cherry-yellow)",
                borderRadius: 18,
                padding: "1.15rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.75rem" }}>
                <IconBook size={18} />
                可以带走的想法
              </div>
              <div style={{ display: "grid", gap: "0.65rem" }}>
                {article.highlights.map((highlight) => (
                  <div key={highlight} style={{ display: "flex", alignItems: "flex-start", gap: 8, color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.9rem" }}>
                    <IconCheck size={16} color="var(--cherry-forest)" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={`/${backHash}`}
              onClick={(event) => {
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
              {backText} <IconArrowRight size={14} color="var(--cherry-forest)" />
            </a>

            {(previousArticle || nextArticle) ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.8rem", marginTop: "1.2rem" }}>
                {previousArticle ? (
                  <a
                    href={previousArticle.href}
                    onClick={(event) => {
                      event.preventDefault();
                      navigateToPath(previousArticle.href);
                    }}
                    style={{ display: "grid", gap: "0.35rem", background: "var(--muted)", border: "1.5px solid var(--border)", borderRadius: 16, padding: "0.85rem", color: "var(--cherry-warm-mid)", textDecoration: "none" }}
                  >
                    <span style={{ fontFamily: "'Caveat', cursive", color: "var(--cherry-forest)", fontWeight: 900 }}>上一篇</span>
                    <strong style={{ color: "var(--cherry-warm-brown)", lineHeight: 1.45, fontSize: "0.9rem" }}>{previousArticle.title}</strong>
                  </a>
                ) : null}
                {nextArticle ? (
                  <a
                    href={nextArticle.href}
                    onClick={(event) => {
                      event.preventDefault();
                      navigateToPath(nextArticle.href);
                    }}
                    style={{ display: "grid", gap: "0.35rem", background: "var(--muted)", border: "1.5px solid var(--border)", borderRadius: 16, padding: "0.85rem", color: "var(--cherry-warm-mid)", textDecoration: "none" }}
                  >
                    <span style={{ fontFamily: "'Caveat', cursive", color: "var(--cherry-forest)", fontWeight: 900 }}>下一篇</span>
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
    </main>
  );
}
