import { useState } from "react";
import { IconMicroscope, IconAI, IconLeaf, IconFlask, IconDNA } from "./Icons";

type Category = "全部" | "科学" | "课程" | "AI工具";

export const works = [
  {
    id: 1, slug: "gene-expression", category: "科学" as Category,
    icon: <IconMicroscope size={36} color="var(--cherry-blue)" />,
    title: "基因表达可视化",
    desc: "调节转录因子、RNA 聚合酶和核糖体，观察 mRNA 与蛋白质产量如何变化。",
    href: "/works/gene-expression",
    tags: ["生物", "可视化", "交互"],
    color: "var(--cherry-blue-light)", border: "var(--cherry-blue)", rotate: "-1.5deg",
  },
  {
    id: 3, slug: "research-prompt-kit", category: "AI工具" as Category,
    icon: <IconAI size={36} color="var(--cherry-blue)" />,
    title: "科研助手 Prompt Kit",
    desc: "可复制的生命科学科研 prompt，用于文献精读、实验设计、图表解读和论文检查。",
    href: "/works/research-prompt-kit",
    tags: ["AI", "Prompt", "科研"],
    color: "var(--cherry-peach-light)", border: "var(--cherry-peach)", rotate: "-0.8deg",
  },
  {
    id: 4, slug: "plant-evolution-stories", category: "课程" as Category,
    icon: <IconLeaf size={36} color="var(--cherry-sage)" />,
    title: "植物进化小故事",
    desc: "用真实文献支撑的时间轴故事，讲述植物从链形绿藻、孢子证据、维管组织、种子到花和果实的演化线索。",
    href: "/works/plant-evolution-stories",
    tags: ["植物学", "科普", "插画"],
    color: "var(--cherry-sage-light)", border: "var(--cherry-sage)", rotate: "1.8deg",
  },
  {
    id: 5, slug: "concept-explainer", category: "AI工具" as Category,
    icon: <IconAI size={36} color="#7B6CC4" />,
    title: "概念解释生成器",
    desc: "选择一个生物学概念，查看小学、高中、研究生三个解释层级。",
    href: "/works/concept-explainer",
    tags: ["AI", "教育", "工具"],
    color: "#EDE9F5", border: "#B5AEDD", rotate: "-1.2deg",
  },
  {
    id: 6, slug: "crispr-interactive", category: "科学" as Category,
    icon: <IconDNA size={36} color1="var(--cherry-red)" color2="var(--cherry-blue)" />,
    title: "CRISPR 交互讲解",
    desc: "操作 guide RNA、Cas 蛋白和修复结果，观察 CRISPR 识别、剪切与修复三步。",
    href: "/works/crispr-interactive",
    tags: ["基因编辑", "互动", "CRISPR"],
    color: "var(--cherry-peach-light)", border: "var(--cherry-red)", rotate: "0.5deg",
  },
];

function WorkCard({ work }: { work: (typeof works)[0] }) {
  const [hovered, setHovered] = useState(false);
  const href = "href" in work ? work.href : undefined;

  function openDetail() {
    if (!href) return;
    window.history.pushState(null, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <div
      role={href ? "link" : undefined}
      tabIndex={href ? 0 : undefined}
      onClick={openDetail}
      onKeyDown={(event) => {
        if (href && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          openDetail();
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: work.color,
        border: `1.5px solid ${work.border}`,
        borderRadius: 20,
        padding: "1.6rem 1.6rem 1.4rem",
        transform: hovered ? "rotate(0deg) translateY(-5px)" : `rotate(${work.rotate})`,
        transition: "transform 0.25s, box-shadow 0.25s",
        boxShadow: hovered ? "5px 12px 0px rgba(94,68,42,0.12)" : "3px 5px 0px rgba(94,68,42,0.08)",
        cursor: href ? "pointer" : "default",
        position: "relative",
      }}
    >
      {/* Push pin */}
      <div style={{ position: "absolute", top: -7, left: "50%", transform: "translateX(-50%)", width: 14, height: 14, borderRadius: "50%", background: "var(--cherry-red)", opacity: 0.65, boxShadow: "0 2px 4px rgba(0,0,0,0.12)" }} />

      <div style={{ marginBottom: "0.8rem" }}>{work.icon}</div>

      <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "var(--cherry-warm-brown)", fontSize: "1.02rem", marginBottom: "0.5rem", lineHeight: 1.3 }}>
        {work.title}
      </h3>

      <p style={{ color: "var(--cherry-warm-mid)", fontSize: "0.84rem", lineHeight: 1.65, marginBottom: "1rem" }}>
        {work.desc}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {work.tags.map((t) => (
          <span key={t} style={{ background: "rgba(250,247,241,0.75)", color: "var(--cherry-warm-mid)", borderRadius: 999, padding: "0.2rem 0.6rem", fontSize: "0.74rem", fontWeight: 600, fontFamily: "'Nunito', sans-serif" }}>
            {t}
          </span>
        ))}
      </div>

      {href ? (
        <a
          href={href}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            openDetail();
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginTop: "1rem",
            background: "rgba(250,247,241,0.82)",
            border: "1.5px solid rgba(58,92,62,0.28)",
            borderRadius: 999,
            padding: "0.42rem 0.85rem",
            color: "var(--cherry-forest)",
            fontWeight: 900,
            fontSize: "0.82rem",
            textDecoration: "none",
          }}
        >
          查看详情 →
        </a>
      ) : null}
    </div>
  );
}

/* Section divider — hand-drawn wavy line */
function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      style={{ position: "absolute", [flip ? "bottom" : "top"]: 0, left: 0, width: "100%", display: "block" }}
      viewBox="0 0 1440 28"
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        d={flip
          ? "M0 14 Q180 28 360 14 Q540 0 720 14 Q900 28 1080 14 Q1260 0 1440 14 L1440 28 L0 28Z"
          : "M0 14 Q180 0 360 14 Q540 28 720 14 Q900 0 1080 14 Q1260 28 1440 14 L1440 0 L0 0Z"
        }
        fill="var(--background)"
      />
    </svg>
  );
}

export function Works() {
  const [activeCategory, setActiveCategory] = useState<Category>("全部");
  const categories: Category[] = ["全部", "科学", "课程", "AI工具"];
  const filtered = activeCategory === "全部" ? works : works.filter((w) => w.category === activeCategory);

  return (
    <section
      id="works"
      style={{
        fontFamily: "'Nunito', sans-serif",
        padding: "5rem 1.5rem",
        background: "var(--muted)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <WaveDivider />

      {/* Scattered leaf deco */}
      <svg style={{ position: "absolute", top: 40, right: 30, opacity: 0.18 }} width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M10 55 Q15 35 50 12 Q50 38 10 55Z" fill="var(--cherry-forest)" />
      </svg>
      <svg style={{ position: "absolute", bottom: 50, left: 20, opacity: 0.15, transform: "scaleX(-1) rotate(20deg)" }} width="50" height="55" viewBox="0 0 60 60" fill="none">
        <path d="M10 55 Q15 35 50 12 Q50 38 10 55Z" fill="var(--cherry-forest)" />
      </svg>

      <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: "1rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: "0.75rem" }}>
            <IconFlask size={20} color="var(--cherry-warm-mid)" />
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: "1rem", color: "var(--cherry-warm-mid)", fontWeight: 600 }}>
              科学、课程和 AI 工具
            </span>
          </div>
          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "var(--cherry-warm-brown)", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", lineHeight: 1.3 }}>
            可打开的作品
          </h2>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? "var(--cherry-forest)" : "var(--card)",
                color: activeCategory === cat ? "#FAF7F1" : "var(--cherry-warm-mid)",
                border: activeCategory === cat ? "1.5px solid var(--cherry-forest)" : "1.5px solid var(--border)",
                borderRadius: 999, padding: "0.45rem 1.25rem",
                cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                fontWeight: 700, fontSize: "0.84rem", transition: "all 0.2s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(278px, 1fr))", gap: "2rem" }}>
          {filtered.map((work) => <WorkCard key={work.id} work={work} />)}
        </div>
      </div>

      <WaveDivider flip />
    </section>
  );
}
