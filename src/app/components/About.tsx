import { IconMicroscope, IconBook, IconAI, IconLeaf, IconResearch } from "./Icons";

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
    <svg width="80" height="70" viewBox="0 0 80 70" fill="none">
      <path d="M40 68 Q40 45 40 28" stroke="var(--cherry-forest)" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      <path d="M40 48 Q28 40 24 27 Q35 26 40 38" fill="var(--cherry-sage)" opacity="0.5" />
      <path d="M40 38 Q52 30 56 17 Q45 18 40 30" fill="var(--cherry-sage)" opacity="0.4" />
      <path d="M40 58 Q30 52 27 43 Q37 44 40 52" fill="var(--cherry-moss)" opacity="0.38" />
    </svg>
  );
}

export function About() {
  return (
    <section
      id="about"
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
              padding: "2rem",
              boxShadow: "5px 8px 0px rgba(94,68,42,0.08)",
              position: "relative",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--cherry-peach-light), var(--cherry-yellow-light))",
                border: "3px solid var(--cherry-peach)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              {/* Leaf face illustration */}
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="18" fill="var(--cherry-sage-light)" />
                <path d="M24 10 Q32 16 30 26 Q28 34 20 32 Q12 28 14 20 Q16 12 24 10Z" fill="var(--cherry-sage)" opacity="0.7" />
                <circle cx="20" cy="22" r="2" fill="var(--cherry-warm-brown)" />
                <circle cx="28" cy="22" r="2" fill="var(--cherry-warm-brown)" />
                <path d="M20 28 Q24 31 28 28" stroke="var(--cherry-warm-brown)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>

            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "var(--cherry-warm-brown)", fontSize: "1.5rem", marginBottom: "0.2rem" }}>
              Cherry
            </h2>
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
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              color: "var(--cherry-warm-brown)",
              fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
              lineHeight: 1.3,
              marginBottom: "1.25rem",
            }}
          >
            一个把复杂想法
            <br />整理成<span style={{ color: "var(--cherry-red)" }}>温暖小作品</span>的工作台
          </h2>

          <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.8, marginBottom: "1rem", fontSize: "0.95rem" }}>
            By Cherry 记录一组持续展开的实践：从植物基因组数据到高中生物课堂，从项目制学习课程到 AI 智能测评平台，从科研工作流到多模态内容生产工具。
          </p>
          <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.8, fontSize: "0.95rem" }}>
            这里保存作品、笔记、实验和方法：真实科研如何进入课堂，AI 如何辅助学习与评价，课程如何从问题走向作品。
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "2rem", marginTop: "2rem", flexWrap: "wrap" }}>
            {[
              { num: "4", label: "条实践线索" },
              { num: "3", label: "个交叉领域" },
              { num: "∞", label: "待打开的问题" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: "2rem", fontWeight: 700, color: "var(--cherry-red)", lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--cherry-warm-mid)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
