import { IconMicroscope, IconTestTube, IconDNA, IconLeaf, IconLeafSmall, IconNotebook, IconStar, IconMushroom, IconBranch, IconSparkle, IconArrowDown, IconSeedling } from "./Icons";

function FloatDeco({ children, style }: { children: React.ReactNode; style: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", animation: "floatDeco 4.5s ease-in-out infinite", ...style }}>
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
  return (
    <section
      id="top"
      style={{
        fontFamily: "'Nunito', sans-serif",
        minHeight: "94vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "5rem 1.5rem 4rem",
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
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 660 }}>
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
            marginBottom: "1.8rem",
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
            fontSize: "clamp(2.4rem, 6vw, 3.9rem)",
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
            marginBottom: "2.5rem",
            fontWeight: 500,
          }}
        >
          把科学问题、课程想法和 AI 工具，
          <br />
          慢慢做成可以打开、可以体验的小作品。
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="#works"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "var(--cherry-forest)", color: "#FAF7F1",
              borderRadius: 999, padding: "0.72rem 1.85rem",
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
            href="#notes"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "transparent", color: "var(--cherry-warm-brown)",
              border: "1.5px solid var(--border)", borderRadius: 999,
              padding: "0.72rem 1.85rem",
              textDecoration: "none", fontWeight: 700, fontSize: "0.93rem",
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--cherry-yellow-light)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--cherry-yellow)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
          >
            <IconNotebook size={18} /> 读读笔记
          </a>
        </div>

        {/* Scroll hint */}
        <div
          style={{
            marginTop: "3.5rem",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            opacity: 0.45,
            animation: "floatDeco 2.2s ease-in-out infinite",
          }}
        >
          <span style={{ fontFamily: "'Caveat', cursive", fontSize: "0.82rem", color: "var(--cherry-warm-mid)" }}>往下滚~</span>
          <IconArrowDown size={16} />
        </div>
      </div>

      <style>{`
        @keyframes floatDeco {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-9px); }
        }
      `}</style>
    </section>
  );
}
