import { IconMicroscope, IconTestTube, IconDNA, IconLeaf, IconLeafSmall, IconNotebook, IconStar, IconMushroom, IconBranch, IconSparkle, IconSeedling } from "./Icons";
import { works } from "./Works";
import { WorkPreviewIllustration } from "./WorkPreviewIllustration";
import { navigateClient, shouldUseClientNavigation } from "../navigation";

function FloatDeco({ children, style }: { children: React.ReactNode; style: React.CSSProperties }) {
  return (
    <div className="hero-floating-deco" style={{ position: "absolute", animation: "floatDeco 4.5s ease-in-out infinite", ...style }}>
      {children}
    </div>
  );
}

function ForestBlob({ color, style }: { color: string; style: React.CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        borderRadius: "58% 42% 52% 48% / 46% 58% 42% 54%",
        background: color,
        opacity: 0.28,
        filter: "blur(1px)",
        ...style,
      }}
    />
  );
}

/* Fern/plant decorative SVG */
function FernDeco({ style }: { style: React.CSSProperties }) {
  return (
    <svg width="70" height="80" viewBox="0 0 70 80" fill="none" style={{ position: "absolute", ...style }}>
      <path d="M35 78 Q35 50 35 30" stroke="var(--cherry-forest)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M35 55 Q22 45 18 32 Q28 33 35 45" fill="var(--cherry-sage)" opacity="0.55" />
      <path d="M35 45 Q48 35 52 22 Q42 23 35 35" fill="var(--cherry-sage)" opacity="0.45" />
      <path d="M35 65 Q24 58 21 48 Q30 49 35 58" fill="var(--cherry-moss)" opacity="0.4" />
    </svg>
  );
}

/* Scattered dots texture */
function DotTexture({ style }: { style: React.CSSProperties }) {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ position: "absolute", ...style, opacity: 0.18 }}>
      {Array.from({ length: 6 }).map((_, row) =>
        Array.from({ length: 6 }).map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={10 + col * 20}
            cy={10 + row * 20}
            r="2"
            fill="var(--cherry-forest)"
          />
        ))
      )}
    </svg>
  );
}

export function Hero() {
  function openWork(href: string, event: React.MouseEvent<HTMLAnchorElement>) {
    if (!shouldUseClientNavigation(event)) return;
    event.preventDefault();
    navigateClient(href);
  }

  return (
    <section
      id="top"
      style={{
        fontFamily: "'Nunito', sans-serif",
        minHeight: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "4.6rem 1.5rem 2.2rem",
      }}
    >
      {/* Forest atmosphere blobs */}
      <ForestBlob color="var(--cherry-sage-light)" style={{ width: 380, height: 300, top: "5%", right: "2%", borderRadius: "50% 50% 45% 55% / 42% 58% 42% 58%" }} />
      <ForestBlob color="var(--cherry-yellow-light)" style={{ width: 300, height: 240, bottom: "8%", left: "0%", borderRadius: "45% 55% 52% 48% / 55% 45% 58% 42%" }} />
      <ForestBlob color="var(--cherry-blue-light)" style={{ width: 220, height: 180, top: "50%", right: "12%", borderRadius: "55% 45% 40% 60% / 40% 60% 48% 52%" }} />
      <ForestBlob color="var(--cherry-peach-light)" style={{ width: 180, height: 150, top: "18%", left: "4%", borderRadius: "50% 50% 55% 45% / 52% 48% 56% 44%" }} />

      {/* Texture dots */}
      <DotTexture style={{ top: "10%", left: "2%" }} />
      <DotTexture style={{ bottom: "12%", right: "5%" }} />

      {/* Fern decorations */}
      <FernDeco style={{ bottom: "0%", left: "2%", transformOrigin: "bottom center" }} />
      <FernDeco style={{ bottom: "0%", right: "3%", transform: "scaleX(-1)", transformOrigin: "bottom right" }} />

      {/* Floating icons */}
      <FloatDeco style={{ top: "14%", right: "18%", animationDelay: "0s" }}>
        <IconStar size={22} color="var(--cherry-yellow)" />
      </FloatDeco>
      <FloatDeco style={{ top: "22%", left: "10%", animationDelay: "0.7s" }}>
        <IconMicroscope size={46} />
      </FloatDeco>
      <FloatDeco style={{ top: "10%", left: "32%", animationDelay: "1.3s" }}>
        <IconSparkle size={16} color="var(--cherry-peach)" />
      </FloatDeco>
      <FloatDeco style={{ bottom: "28%", right: "11%", animationDelay: "0.5s" }}>
        <IconTestTube size={36} />
      </FloatDeco>
      <FloatDeco style={{ bottom: "22%", left: "18%", animationDelay: "1.1s" }}>
        <IconDNA size={42} />
      </FloatDeco>
      <FloatDeco style={{ top: "58%", left: "5%", animationDelay: "0.3s" }}>
        <IconLeaf color="var(--cherry-sage)" size={38} />
      </FloatDeco>
      <FloatDeco style={{ top: "28%", right: "7%", animationDelay: "1.9s" }}>
        <IconLeafSmall color="var(--cherry-moss)" size={30} />
      </FloatDeco>
      <FloatDeco style={{ bottom: "38%", right: "28%", animationDelay: "2.2s" }}>
        <IconNotebook size={34} />
      </FloatDeco>
      <FloatDeco style={{ top: "18%", right: "40%", animationDelay: "0.6s" }}>
        <IconStar size={13} color="var(--cherry-red)" />
      </FloatDeco>
      <FloatDeco style={{ bottom: "42%", left: "28%", animationDelay: "1.7s" }}>
        <IconMushroom size={28} />
      </FloatDeco>
      <FloatDeco style={{ top: "38%", right: "4%", animationDelay: "3s" }}>
        <IconBranch size={44} color="var(--cherry-forest)" />
      </FloatDeco>
      <FloatDeco style={{ top: "6%", left: "52%", animationDelay: "2.5s" }}>
        <IconSeedling size={26} color="var(--cherry-forest)" />
      </FloatDeco>

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "left", maxWidth: 1120, width: "100%" }}>
        <div className="hero-content-grid" style={{ display: "grid", gridTemplateColumns: "minmax(260px, 0.72fr) minmax(0, 1.28fr)", gap: "1.2rem", alignItems: "start" }}>
          <div className="hero-intro">
        {/* Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--cherry-yellow-light)",
            border: "1.5px dashed var(--cherry-yellow)",
            borderRadius: 999,
            padding: "0.35rem 1.1rem",
            marginBottom: "1rem",
          }}
        >
          <IconSparkle size={13} color="var(--cherry-bark)" />
          <span style={{ fontFamily: "'Caveat', cursive", fontSize: "0.98rem", color: "var(--cherry-warm-brown)", fontWeight: 600 }}>
            By Cherry
          </span>
          <IconSparkle size={13} color="var(--cherry-bark)" />
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "clamp(1.85rem, 4.4vw, 3rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            color: "var(--cherry-warm-brown)",
            marginBottom: "0.8rem",
            letterSpacing: 0,
          }}
        >
          A tiny studio for{" "}
          <span style={{ color: "var(--cherry-red)", position: "relative", display: "inline-block" }}>
            science
            <svg style={{ position: "absolute", bottom: -5, left: 0, width: "100%" }} viewBox="0 0 120 8" preserveAspectRatio="none" fill="none">
              <path d="M2 5 Q20 1 40 5 Q60 9 80 5 Q100 1 118 5" stroke="var(--cherry-peach)" strokeWidth="2.8" strokeLinecap="round" />
            </svg>
          </span>
          ,{" "}
          <span style={{ color: "var(--cherry-sage)" }}>learning</span>
          {" & "}
          <span style={{ color: "var(--cherry-blue)" }}>AI</span>
        </h1>

        {/* Subtitle — handwriting style */}
        <p
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
            color: "var(--cherry-warm-mid)",
            lineHeight: 1.65,
            marginBottom: "1.1rem",
            fontWeight: 500,
          }}
        >
          科学模拟、课程卡片和 AI 工具，
          <br />
          打开后就能阅读、操作和学习。
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-start", flexWrap: "wrap" }}>
          <a
            className="hero-cta"
            href="#works"
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
            <IconSeedling size={18} color="#FAF7F1" /> 看看小作品
          </a>
          <a
            className="hero-cta"
            href="#notes"
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
            <IconNotebook size={18} /> 读读笔记
          </a>
        </div>
          </div>

        <div className="hero-work-list" style={{ background: "transparent", border: "none", borderRadius: 0, padding: 0, boxShadow: "none" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.95rem" }}>当前可打开的内容</div>
            <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", fontWeight: 800 }}>{works.length} 个作品入口</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(178px, 1fr))", gap: "0.65rem" }}>
            {works.map((work) => (
              <a
                className="hero-work-card"
                key={work.slug}
                href={work.href}
                onClick={(event) => openWork(work.href, event)}
                style={{
                  background: work.color,
                  border: `1.5px solid ${work.border}`,
                  borderRadius: 16,
                  padding: "0.72rem 0.72rem 0.66rem",
                  color: "var(--cherry-warm-brown)",
                  textDecoration: "none",
                  textAlign: "left",
                  minHeight: 138,
                  display: "grid",
                  gridTemplateRows: "auto 1fr auto auto",
                  gap: "0.42rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", transform: "scale(0.68)", transformOrigin: "center" }}>{work.icon}</span>
                  <strong style={{ fontSize: "0.88rem", lineHeight: 1.35 }}>{work.title}</strong>
                </div>
                <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.45, position: "relative", zIndex: 1 }}>{work.desc}</span>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
                  {work.outputs.map((output) => (
                    <span key={output} style={{ background: "rgba(250,247,241,0.74)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 999, padding: "0.12rem 0.42rem", color: "var(--cherry-warm-brown)", fontSize: "0.64rem", fontWeight: 900 }}>
                      {output}
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", minHeight: 54, marginTop: "-0.15rem", opacity: 0.92 }}>
                  <WorkPreviewIllustration slug={work.slug} color={work.border} />
                </div>
              </a>
            ))}
          </div>
        </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .hero-content-grid {
            grid-template-columns: 1fr !important;
          }

          .hero-work-list {
            order: -1;
          }
        }

        @keyframes floatDeco {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-9px); }
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
          .hero-floating-deco {
            animation: none !important;
          }

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
