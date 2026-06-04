import { IconMicroscope, IconNotebook, IconSeedling } from "./Icons";
import { works } from "./Works";
import { WorkPreviewIllustration } from "./WorkPreviewIllustration";
import { navigateClient, navigateHomeSection, shouldUseClientNavigation } from "../navigation";

export function Hero() {
  function openWork(href: string, event: React.MouseEvent<HTMLAnchorElement>) {
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "1.75rem 1.5rem 1.45rem",
        width: "100%",
        maxWidth: "100%",
        background:
          "linear-gradient(180deg, rgba(250,247,241,0.98) 0%, rgba(245,241,234,0.95) 100%), linear-gradient(rgba(58,92,62,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(58,92,62,0.05) 1px, transparent 1px)",
        backgroundSize: "auto, 42px 42px, 42px 42px",
      }}
    >
      {/* Main content */}
      <div className="hero-inner" style={{ position: "relative", zIndex: 2, textAlign: "left", maxWidth: 1120, width: "100%", minWidth: 0 }}>
        <div className="hero-content-grid" style={{ display: "grid", gridTemplateColumns: "minmax(260px, 0.72fr) minmax(0, 1.28fr)", gap: "1.2rem", alignItems: "start", minWidth: 0, maxWidth: "100%" }}>
          <div className="hero-intro" style={{ minWidth: 0 }}>
        {/* Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(250,247,241,0.82)",
            border: "1px solid rgba(58,92,62,0.18)",
            borderRadius: 999,
            padding: "0.34rem 0.86rem",
            marginBottom: "0.85rem",
          }}
        >
          <IconMicroscope size={15} color="var(--cherry-forest)" />
          <span style={{ fontSize: "0.78rem", color: "var(--cherry-warm-mid)", fontWeight: 900, letterSpacing: 0 }}>
            By Cherry · science education lab
          </span>
        </div>

        {/* Headline */}
        <h1
          id="hero-heading"
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "clamp(1.72rem, 3.9vw, 2.75rem)",
            fontWeight: 800,
            lineHeight: 1.14,
            color: "var(--cherry-warm-brown)",
            marginBottom: "0.72rem",
            letterSpacing: 0,
          }}
        >
          By Cherry 科学与 AI 学习工作台
        </h1>

        <p
          style={{
            fontSize: "clamp(0.96rem, 1.8vw, 1.08rem)",
            color: "var(--cherry-warm-mid)",
            lineHeight: 1.72,
            marginBottom: "1rem",
            fontWeight: 700,
          }}
        >
          整理可直接打开的科学模拟、演化时间轴和 AI 工具。首页先给内容入口，详情页承载真实交互、资料和参考证据。
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-start", flexWrap: "wrap" }}>
          <a
            className="hero-cta"
            href="#works"
            onClick={(event) => navigateHomeSection("#works", event)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "var(--cherry-forest)", color: "#FAF7F1",
              borderRadius: 999, padding: "0.62rem 1.25rem",
              textDecoration: "none", fontWeight: 700, fontSize: "0.93rem",
              boxShadow: "3px 5px 0px rgba(58,92,62,0.25)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "3px 8px 0px rgba(58,92,62,0.25)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "3px 5px 0px rgba(58,92,62,0.25)"; }}
          >
              <IconSeedling size={18} color="#FAF7F1" /> 浏览主题作品
          </a>
          <a
            className="hero-cta"
            href="#notes"
            onClick={(event) => navigateHomeSection("#notes", event)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "transparent", color: "var(--cherry-warm-brown)",
              border: "1.5px solid var(--border)", borderRadius: 999,
              padding: "0.62rem 1.25rem",
              textDecoration: "none", fontWeight: 700, fontSize: "0.93rem",
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--cherry-yellow-light)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--cherry-yellow)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
          >
            <IconNotebook size={18} /> 阅读笔记
          </a>
        </div>
          </div>

        <div className="hero-work-list" style={{ background: "transparent", border: "none", borderRadius: 0, padding: 0, boxShadow: "none", minWidth: 0, maxWidth: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.95rem" }}>精选内容</div>
            <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", fontWeight: 800 }}>{works.length} 个主题作品</div>
          </div>
          <div className="hero-work-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(178px, 1fr))", gap: "0.65rem", minWidth: 0, maxWidth: "100%" }}>
            {works.map((work) => (
                <a
                  className="hero-work-card"
                  key={work.slug}
                  href={work.href}
                  onClick={(event) => openWork(work.href, event)}
                  style={{
                    background: work.color,
                    border: `1.5px solid ${work.border}`,
                    borderRadius: 10,
                    padding: "0.68rem 0.72rem 0.66rem",
                    color: "var(--cherry-warm-brown)",
                    textDecoration: "none",
                    textAlign: "left",
                    minHeight: 138,
                    display: "grid",
                    gridTemplateRows: "auto auto 1fr auto",
                    gap: "0.34rem",
                    position: "relative",
                    overflow: "hidden",
                    minWidth: 0,
                    maxWidth: "100%",
                  }}
                >
                  <div aria-hidden="true" style={{ position: "absolute", right: -10, bottom: -10, width: 106, height: 82, borderRadius: 10, background: "rgba(250,247,241,0.42)", border: "1px solid rgba(94,68,42,0.1)" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, position: "relative", zIndex: 1 }}>
                    <span style={{ width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", transform: "scale(0.68)", transformOrigin: "center" }}>{work.icon}</span>
                    <strong style={{ fontSize: "0.88rem", lineHeight: 1.35, minWidth: 0, overflowWrap: "anywhere" }}>{work.title}</strong>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
                    <span style={{ background: "rgba(250,247,241,0.72)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 999, padding: "0.08rem 0.42rem", color: "var(--cherry-forest)", fontSize: "0.62rem", fontWeight: 900 }}>
                      {work.category}
                    </span>
                    <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.62rem", fontWeight: 900 }}>
                      {work.updated}
                    </span>
                  </div>
                  <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.4, position: "relative", zIndex: 1, display: "block", minWidth: 0, overflowWrap: "anywhere", wordBreak: "break-word", paddingRight: 54 }}>{work.desc}</span>
                  <div role="list" aria-label={`${work.title}学习路径`} style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center", paddingRight: 76, position: "relative", zIndex: 1 }}>
                    {work.path.map((step, index) => (
                      <span role="listitem" key={step} style={{ background: "rgba(250,247,241,0.74)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 999, padding: "0.12rem 0.42rem", color: "var(--cherry-warm-brown)", fontSize: "0.62rem", fontWeight: 900 }}>
                        {index + 1}. {step}
                      </span>
                    ))}
                    <span style={{ background: "var(--cherry-forest)", border: "1px solid var(--cherry-forest)", borderRadius: 999, padding: "0.12rem 0.42rem", color: "#FAF7F1", fontSize: "0.64rem", fontWeight: 900 }}>
                      {work.action}
                    </span>
                  </div>
                  <div className="hero-work-preview" style={{ position: "absolute", right: 2, bottom: 0, display: "flex", justifyContent: "flex-end", opacity: 0.9, zIndex: 0 }}>
                    <WorkPreviewIllustration slug={work.slug} color={work.border} width={108} height={82} />
                  </div>
                </a>
            ))}
          </div>
        </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          #top {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            padding-top: 1rem !important;
            padding-bottom: 1.15rem !important;
          }

          .hero-inner,
          .hero-content-grid {
            width: 100% !important;
            max-width: calc(100vw - 2rem) !important;
            grid-template-columns: 1fr !important;
          }

          .hero-work-list {
            order: -1;
          }

          .hero-work-grid {
            grid-template-columns: 1fr !important;
            width: 100% !important;
            max-width: 100% !important;
          }

          .hero-work-card {
            width: calc(100vw - 3rem) !important;
            max-width: calc(100vw - 3rem) !important;
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
          box-shadow: 3px 6px 0 rgba(94,68,42,0.1);
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-cta,
          .hero-work-card {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
