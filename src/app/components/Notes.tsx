import { IconBook, IconAI, IconLeaf, IconResearch, IconArrowRight, IconCoffee } from "./Icons";

const notes = [
  {
    id: 1,
    date: "2026-06-03",
    tag: "AI教育",
    tagColor: "var(--cherry-blue)",
    tagBg: "var(--cherry-blue-light)",
    icon: <IconResearch size={18} color="var(--cherry-blue)" />,
    title: "AI 可以参与课程开发，但不能替代教学判断",
    excerpt: "从课程目标、任务流程到评价量规，AI 可以加快草稿生成；但真正的学情判断、内容边界和价值取舍，仍然需要人来完成……",
    readTime: "5",
  },
  {
    id: 2,
    date: "2026-05-28",
    tag: "科研转化",
    tagColor: "#4A2D80",
    tagBg: "#EDE9F5",
    icon: <IconAI size={18} color="#4A2D80" />,
    title: "从植物基因组到高中生物课堂",
    excerpt: "真实科研进入课堂时，难点不只是降难度，而是找到学生能进入的问题、证据和任务，让前沿知识变成可参与的探究……",
    readTime: "6",
  },
  {
    id: 3,
    date: "2026-05-18",
    tag: "课程设计",
    tagColor: "var(--cherry-forest)",
    tagBg: "var(--cherry-sage-light)",
    icon: <IconBook size={18} color="var(--cherry-forest)" />,
    title: "项目制学习中的任务、量规和作品证据",
    excerpt: "一个项目不是把活动串起来，而是把真实问题、学习目标、任务流程、评价量规和学生作品放在同一条线上……",
    readTime: "7",
  },
  {
    id: 4,
    date: "2026-05-08",
    tag: "创作工具",
    tagColor: "var(--cherry-red)",
    tagBg: "var(--cherry-peach-light)",
    icon: <IconLeaf size={18} color="var(--cherry-red)" />,
    title: "我的 AI 漫画与视频创作工作流",
    excerpt: "从小说文本到分镜、角色资产、TTS、唇形同步和成片组装，真正困难的不是单点生成，而是让每一步可以复用和质检……",
    readTime: "4",
  },
];

export function Notes() {
  return (
    <section
      id="notes"
      style={{
        fontFamily: "'Nunito', sans-serif",
        padding: "5rem 1.5rem",
        background: "var(--muted)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Wavy dividers */}
      <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", display: "block" }} viewBox="0 0 1440 28" preserveAspectRatio="none" fill="none">
        <path d="M0 14 Q180 0 360 14 Q540 28 720 14 Q900 0 1080 14 Q1260 28 1440 14 L1440 0 L0 0Z" fill="var(--background)" />
      </svg>
      <svg style={{ position: "absolute", bottom: 0, left: 0, width: "100%", display: "block" }} viewBox="0 0 1440 28" preserveAspectRatio="none" fill="none">
        <path d="M0 14 Q180 28 360 14 Q540 0 720 14 Q900 28 1080 14 Q1260 0 1440 14 L1440 28 L0 28Z" fill="var(--background)" />
      </svg>

      {/* Background leaf */}
      <svg style={{ position: "absolute", bottom: 40, right: 20, opacity: 0.1, pointerEvents: "none" }} width="90" height="90" viewBox="0 0 90 90" fill="none">
        <path d="M15 80 Q20 50 75 18 Q75 55 15 80Z" fill="var(--cherry-forest)" />
      </svg>

      <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: "1.5rem", paddingBottom: "1.5rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: "0.75rem" }}>
              <IconBook size={20} color="var(--cherry-warm-mid)" />
              <span style={{ fontFamily: "'Caveat', cursive", fontSize: "1rem", color: "var(--cherry-warm-mid)", fontWeight: 600 }}>手账目录</span>
            </div>
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "var(--cherry-warm-brown)", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", lineHeight: 1.3 }}>
              最近在想的事
            </h2>
          </div>
          <a href="#" style={{ fontFamily: "'Caveat', cursive", color: "var(--cherry-forest)", textDecoration: "none", fontSize: "1rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            看全部笔记 <IconArrowRight size={14} color="var(--cherry-forest)" />
          </a>
        </div>

        {/* Notes grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {notes.map((note) => (
            <article
              key={note.id}
              style={{
                background: "var(--card)",
                border: "1.5px solid var(--border)",
                borderRadius: 16,
                padding: "1.5rem",
                position: "relative",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "4px 8px 0px rgba(94,68,42,0.1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
            >
              {/* Left color bar */}
              <div style={{ position: "absolute", top: 16, left: 0, width: 4, height: "calc(100% - 32px)", background: note.tagColor, borderRadius: "0 2px 2px 0", opacity: 0.65 }} />

              {/* Date + tag */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ fontFamily: "'Caveat', cursive", fontSize: "0.84rem", color: "var(--cherry-warm-mid)" }}>{note.date}</span>
                <span style={{ background: note.tagBg, color: note.tagColor, borderRadius: 999, padding: "0.18rem 0.62rem", fontSize: "0.74rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  {note.icon} {note.tag}
                </span>
              </div>

              <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "var(--cherry-warm-brown)", fontSize: "1rem", lineHeight: 1.4, marginBottom: "0.6rem" }}>
                {note.title}
              </h3>

              <p style={{ color: "var(--cherry-warm-mid)", fontSize: "0.84rem", lineHeight: 1.65, marginBottom: "1rem" }}>
                {note.excerpt}
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.78rem", color: "var(--cherry-warm-mid)", fontFamily: "'Caveat', cursive" }}>
                  <IconCoffee size={16} /> 约 {note.readTime} 分钟
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: "var(--cherry-forest)", fontWeight: 700 }}>
                  阅读 <IconArrowRight size={13} color="var(--cherry-forest)" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
