import { IconMicroscope, IconBook, IconAI, IconLeaf, IconResearch } from "./Icons";
import { notes } from "./Notes";
import { essays } from "./ResearchEssays";
import { works } from "./Works";
import { navigateHomeSection } from "../navigation";

const tags = [
  { label: "生命科学", icon: <IconMicroscope size={15} color="#1a5680" />, bg: "var(--cherry-blue-light)", color: "#1a5680" },
  { label: "教育设计", icon: <IconBook size={15} color="#5A3E00" />, bg: "var(--cherry-yellow-light)", color: "#5A3E00" },
  { label: "AI 工具", icon: <IconAI size={15} color="#7D2A18" />, bg: "var(--cherry-peach-light)", color: "#7D2A18" },
  { label: "课程开发", icon: <IconLeaf size={15} color="#1E4D22" />, bg: "var(--cherry-sage-light)", color: "#1E4D22" },
  { label: "科学传播", icon: <IconResearch size={15} color="#3C2D6E" />, bg: "#E8E3F5", color: "#3C2D6E" },
];

/* Inline leaf cluster for decoration */
function LeafCluster() {
  return (
    <svg width="80" height="70" viewBox="0 0 80 70" fill="none" aria-hidden="true" focusable="false">
      <path d="M40 68 Q40 45 40 28" stroke="var(--cherry-forest)" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      <path d="M40 48 Q28 40 24 27 Q35 26 40 38" fill="var(--cherry-sage)" opacity="0.5" />
      <path d="M40 38 Q52 30 56 17 Q45 18 40 30" fill="var(--cherry-sage)" opacity="0.4" />
      <path d="M40 58 Q30 52 27 43 Q37 44 40 52" fill="var(--cherry-moss)" opacity="0.38" />
    </svg>
  );
}

function WorkbenchIllustration() {
  return (
    <svg width="100%" height="170" viewBox="0 0 320 170" fill="none" aria-hidden="true" focusable="false">
      <rect x="18" y="20" width="284" height="130" rx="28" fill="var(--cherry-yellow-light)" stroke="rgba(94,68,42,0.12)" strokeWidth="2" />
      <path d="M26 118 C69 92 103 116 137 94 C178 67 216 95 292 58 V150 H26Z" fill="var(--cherry-sage-light)" opacity="0.62" />
      <path d="M38 139 C80 150 225 148 278 131" stroke="rgba(94,68,42,0.16)" strokeWidth="7" strokeLinecap="round" />

      <rect x="54" y="62" width="86" height="66" rx="13" fill="rgba(250,247,241,0.9)" stroke="var(--cherry-blue)" strokeWidth="2.4" />
      <rect x="66" y="76" width="48" height="7" rx="3.5" fill="var(--cherry-blue-light)" />
      <path d="M67 94 H125 M67 108 H111" stroke="var(--cherry-warm-mid)" strokeWidth="3" strokeLinecap="round" opacity="0.48" />
      <path d="M77 128 H132" stroke="var(--cherry-warm-brown)" strokeWidth="4" strokeLinecap="round" opacity="0.16" />

      <g transform="translate(143 46)">
        <path d="M12 71 C12 44 18 23 32 4" stroke="var(--cherry-forest)" strokeWidth="6" strokeLinecap="round" />
        <path d="M26 16 C42 1 65 8 70 28 C49 38 34 33 26 16Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth="2" />
        <path d="M19 43 C2 34 -11 42 -13 60 C5 66 16 59 19 43Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth="2" />
        <circle cx="58" cy="28" r="7" fill="var(--cherry-red)" opacity="0.86" />
        <circle cx="70" cy="41" r="6" fill="var(--cherry-peach)" opacity="0.9" />
      </g>

      <g transform="translate(214 61)">
        <rect x="0" y="16" width="62" height="50" rx="15" fill="rgba(250,247,241,0.9)" stroke="var(--cherry-red)" strokeWidth="2.3" />
        <path d="M18 14 L23 4 H39 L44 14" stroke="var(--cherry-red)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="21" cy="39" r="3.8" fill="var(--cherry-warm-brown)" />
        <circle cx="41" cy="39" r="3.8" fill="var(--cherry-warm-brown)" />
        <path d="M23 51 C30 56 37 56 44 51" stroke="var(--cherry-warm-brown)" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M51 8 L56 17 L66 20 L57 25 L54 35 L49 26 L39 23 L48 18Z" fill="var(--cherry-yellow)" stroke="rgba(94,68,42,0.14)" strokeWidth="1.2" />
      </g>

      <path d="M68 44 C79 34 92 34 103 45" stroke="var(--cherry-blue)" strokeWidth="5" strokeLinecap="round" opacity="0.38" />
      <path d="M231 39 C244 29 260 31 270 44" stroke="var(--cherry-peach)" strokeWidth="6" strokeLinecap="round" opacity="0.46" />
      <circle cx="44" cy="43" r="8" fill="var(--cherry-yellow)" opacity="0.72" />
      <circle cx="286" cy="104" r="7" fill="var(--cherry-blue-light)" stroke="var(--cherry-blue)" strokeWidth="1.5" />
    </svg>
  );
}

export function About() {
  const reusableOutputs = works.reduce((count, work) => count + work.outputs.length, 0);
  const stats = [
    { num: String(works.length), label: "个主题作品" },
    { num: String(notes.length + essays.length), label: "篇笔记和随笔" },
    { num: String(reusableOutputs), label: "类可复用产物" },
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      style={{
        fontFamily: "'Nunito', sans-serif",
        padding: "5rem 1.5rem",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "3rem",
          alignItems: "center",
        }}
      >
        {/* Card side */}
        <div style={{ position: "relative" }}>
          {/* Washi tape */}
          <div style={{ position: "absolute", top: -14, left: "28%", width: 76, height: 20, background: "var(--cherry-yellow)", opacity: 0.65, borderRadius: 4, transform: "rotate(-3deg)", zIndex: 2 }} />
          <div style={{ position: "absolute", top: -8, right: "22%", width: 50, height: 14, background: "var(--cherry-sage-light)", opacity: 0.7, borderRadius: 3, transform: "rotate(4deg)", zIndex: 2 }} />

          <div
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 22,
              padding: "1.25rem 1.35rem 1.45rem",
              boxShadow: "5px 8px 0px rgba(94,68,42,0.08)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ margin: "-0.3rem -0.4rem 0.75rem" }}>
              <WorkbenchIllustration />
            </div>

            <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "var(--cherry-warm-brown)", fontSize: "1.5rem", marginBottom: "0.2rem" }}>
              Cherry
            </h3>
            <p style={{ fontFamily: "'Caveat', cursive", color: "var(--cherry-warm-mid)", fontSize: "1rem", marginBottom: "1.25rem" }}>
              生物 × 教育 × AI 创作者
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {tags.map((t) => (
                <span
                  key={t.label}
                  style={{
                    background: t.bg, color: t.color,
                    borderRadius: 999, padding: "0.25rem 0.72rem",
                    fontSize: "0.78rem", fontWeight: 600,
                    display: "inline-flex", alignItems: "center", gap: 5,
                  }}
                >
                  {t.icon} {t.label}
                </span>
              ))}
            </div>

            {/* Leaf decoration corner */}
            <div style={{ position: "absolute", bottom: 12, right: 12, opacity: 0.4 }}>
              <LeafCluster />
            </div>
          </div>
        </div>

        {/* Text side */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: "1rem" }}>
            <div style={{ width: 28, height: 4, background: "var(--cherry-sage)", borderRadius: 2 }} />
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: "1rem", color: "var(--cherry-sage)", fontWeight: 600 }}>关于这个工作台</span>
          </div>

          <h2
            id="about-heading"
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              color: "var(--cherry-warm-brown)",
              fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
              lineHeight: 1.3,
              marginBottom: "1.25rem",
            }}
          >
            科学、课程与 AI
            <br /><span style={{ color: "var(--cherry-red)" }}>内容工作台</span>
          </h2>

          <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.8, marginBottom: "1rem", fontSize: "0.95rem" }}>
            By Cherry 收集科学可视化、生命科学课程、科研工作流和 AI 学习工具。
          </p>
          <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.8, fontSize: "0.95rem" }}>
            每个页面都尽量保留可阅读、可操作、可复用的内容：模拟器、时间轴、课程卡片、prompt 和研究笔记。
          </p>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.35rem" }}>
            <a href="#works" onClick={(event) => navigateHomeSection("#works", event)} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--cherry-forest)", color: "#FAF7F1", borderRadius: 999, padding: "0.58rem 1rem", textDecoration: "none", fontWeight: 900, fontSize: "0.86rem", boxShadow: "3px 5px 0px rgba(58,92,62,0.2)" }}>
              打开主题作品
            </a>
            <a href="#contact" onClick={(event) => navigateHomeSection("#contact", event)} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--card)", color: "var(--cherry-forest)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.58rem 1rem", textDecoration: "none", fontWeight: 900, fontSize: "0.86rem" }}>
              联系 Cherry
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "2rem", marginTop: "2rem", flexWrap: "wrap" }}>
            {stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: "2rem", fontWeight: 700, color: "var(--cherry-red)", lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--cherry-warm-mid)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>
        {`
          #about a:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }
        `}
      </style>
    </section>
  );
}
