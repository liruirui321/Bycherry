import { IconAI, IconBook, IconCherry, IconMicroscope, IconResearch } from "./Icons";
import { notes } from "./Notes";
import { essays } from "./ResearchEssays";
import { works } from "./Works";

function CompactWorkbenchIllustration() {
  return (
    <svg width="100%" height="96" viewBox="0 0 360 96" fill="none" aria-hidden="true" focusable="false">
      <rect x="18" y="18" width="324" height="60" rx="8" fill="var(--cherry-yellow-light)" stroke="rgba(94,68,42,0.12)" strokeWidth="2" />
      <path d="M34 64 C72 46 101 61 136 44 C177 24 216 49 326 32" stroke="var(--cherry-sage)" strokeWidth="8" strokeLinecap="round" opacity="0.55" />
      <rect x="48" y="31" width="58" height="34" rx="8" fill="rgba(250,247,241,0.9)" stroke="var(--cherry-blue)" strokeWidth="2" />
      <path d="M60 43 H91 M60 54 H83" stroke="var(--cherry-warm-mid)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <rect x="132" y="29" width="74" height="38" rx="9" fill="rgba(250,247,241,0.9)" stroke="var(--cherry-forest)" strokeWidth="2" />
      <path d="M146 42 H190 M146 54 H178" stroke="var(--cherry-warm-mid)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <rect x="236" y="31" width="62" height="34" rx="8" fill="rgba(250,247,241,0.9)" stroke="var(--cherry-red)" strokeWidth="2" />
      <path d="M248 44 H285 M248 55 H276" stroke="var(--cherry-warm-mid)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <circle cx="113" cy="29" r="6" fill="var(--cherry-red)" opacity="0.8" />
      <circle cx="220" cy="68" r="6" fill="var(--cherry-blue)" opacity="0.72" />
      <path d="M304 20 L309 29 L319 32 L311 37 L308 47 L303 38 L293 35 L301 29Z" fill="var(--cherry-yellow)" opacity="0.9" />
    </svg>
  );
}

export function About() {
  const reusableOutputCount = works.reduce((count, work) => count + work.outputs.length, 0);
  const stats = [
    { value: String(works.length), label: "学习模块" },
    { value: String(notes.length + essays.length), label: "资料页面" },
    { value: String(reusableOutputCount), label: "可保存产出" },
  ];
  const scopes = [
    { label: "生命科学", icon: <IconMicroscope size={15} color="var(--cherry-blue)" /> },
    { label: "学习流程", icon: <IconBook size={15} color="var(--cherry-warm-brown)" /> },
    { label: "AI 工具", icon: <IconAI size={15} color="var(--cherry-red)" /> },
    { label: "科研证据", icon: <IconResearch size={15} color="var(--cherry-forest)" /> },
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      style={{
        fontFamily: "'Nunito', sans-serif",
        padding: "2.2rem 1.5rem",
        background: "var(--background)",
      }}
    >
      <div
        className="about-compact-band"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.92fr) minmax(260px, 1.08fr)",
          gap: "1rem",
          alignItems: "center",
          border: "1.5px solid rgba(94,68,42,0.1)",
          borderRadius: 8,
          background: "var(--card)",
          padding: "0.95rem 1rem",
          boxShadow: "0 8px 18px rgba(94,68,42,0.05)",
        }}
      >
        <div style={{ display: "grid", gap: "0.62rem", minWidth: 0 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--cherry-forest)", fontSize: "0.78rem", fontWeight: 900 }}>
            <IconCherry size={18} color="var(--cherry-red)" />
            关于这个工作台
          </div>
          <h2 id="about-heading" style={{ margin: 0, color: "var(--cherry-warm-brown)", fontSize: "clamp(1.15rem, 2vw, 1.48rem)", lineHeight: 1.25, fontWeight: 900 }}>
            科学学习与 AI 内容工作台
          </h2>
          <p style={{ margin: 0, color: "var(--cherry-warm-mid)", fontSize: "0.86rem", lineHeight: 1.62, fontWeight: 800 }}>
            By Cherry 把生命科学模拟、科研证据、学习方法和 AI 工具整理成可直接操作的页面。首页负责选择内容，具体步骤、记录和练习都放在子页面里。
          </p>
          <div role="list" aria-label="工作台内容范围" style={{ display: "flex", flexWrap: "wrap", gap: "0.42rem" }}>
            {scopes.map((scope) => (
              <span key={scope.label} role="listitem" style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "var(--muted)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 999, padding: "0.18rem 0.52rem", color: "var(--cherry-warm-brown)", fontSize: "0.72rem", fontWeight: 900 }}>
                {scope.icon}
                {scope.label}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.65rem", minWidth: 0 }}>
          <CompactWorkbenchIllustration />
          <div className="about-compact-stats" role="list" aria-label="工作台规模" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.48rem" }}>
            {stats.map((item) => (
              <div key={item.label} role="listitem" style={{ background: "var(--muted)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.5rem", textAlign: "center", minWidth: 0 }}>
                <div style={{ color: "var(--cherry-red)", fontSize: "1.3rem", lineHeight: 1, fontWeight: 900 }}>{item.value}</div>
                <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.7rem", lineHeight: 1.35, marginTop: "0.18rem", fontWeight: 900 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 760px) {
            #about .about-compact-band {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </section>
  );
}
