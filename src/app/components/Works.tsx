import { useState } from "react";
import { IconMicroscope, IconAI, IconLeaf, IconFlask, IconDNA } from "./Icons";
import { WorkPreviewIllustration } from "./WorkPreviewIllustration";
import { navigateClient, shouldUseClientNavigation } from "../navigation";

type Category = "全部" | "科学" | "课程" | "AI工具";

export const works = [
  {
    id: 1, slug: "gene-expression", category: "科学" as Category,
    icon: <IconMicroscope size={36} color="var(--cherry-blue)" />,
    title: "基因表达可视化",
    desc: "拖拽 TF、RNA 聚合酶和核糖体，观察 mRNA 端点、核糖体读取、多肽链和 5 道即时小测。",
    href: "/works/gene-expression",
    updated: "2026-06-04",
    tags: ["生物", "可视化", "交互"],
    outputs: ["表达读数", "多肽动画", "即时小测"],
    action: "启动仿真",
    color: "var(--cherry-blue-light)", border: "var(--cherry-blue)", rotate: "-1.5deg",
  },
  {
    id: 3, slug: "research-prompt-kit", category: "AI工具" as Category,
    icon: <IconAI size={36} color="var(--cherry-blue)" />,
    title: "科研助手 Prompt Kit",
    desc: "选择科研任务，套用材料模板或粘贴自己的材料，生成 prompt、任务包和质控清单。",
    href: "/works/research-prompt-kit",
    updated: "2026-06-04",
    tags: ["AI", "Prompt", "科研"],
    outputs: ["材料模板", "任务包", "质控清单"],
    action: "生成 prompt",
    color: "var(--cherry-peach-light)", border: "var(--cherry-peach)", rotate: "-0.8deg",
  },
  {
    id: 4, slug: "plant-evolution-stories", category: "课程" as Category,
    icon: <IconLeaf size={36} color="var(--cherry-sage)" />,
    title: "植物进化小故事",
    desc: "演化时间轴串联关键创新、证据、课堂提问、作答提示和教师追问。",
    href: "/works/plant-evolution-stories",
    updated: "2026-06-04",
    tags: ["植物学", "科普", "插画"],
    outputs: ["学习卡", "讨论引导", "参考文献"],
    action: "探索时间轴",
    color: "var(--cherry-sage-light)", border: "var(--cherry-sage)", rotate: "1.8deg",
  },
  {
    id: 5, slug: "concept-explainer", category: "AI工具" as Category,
    icon: <IconAI size={36} color="#7B6CC4" />,
    title: "概念解释生成器",
    desc: "选择生物学概念和理解层级，生成类比、机制步骤、课堂流程和即时小测。",
    href: "/works/concept-explainer",
    updated: "2026-06-04",
    tags: ["AI", "教育", "工具"],
    outputs: ["讲解稿", "课堂流程", "即时小测"],
    action: "生成讲解稿",
    color: "#EDE9F5", border: "#B5AEDD", rotate: "-1.2deg",
  },
  {
    id: 6, slug: "crispr-interactive", category: "科学" as Category,
    icon: <IconDNA size={36} color1="var(--cherry-red)" color2="var(--cherry-blue)" />,
    title: "CRISPR 交互讲解",
    desc: "操作 guide RNA、Cas 蛋白和修复结果，查看匹配评分、编辑判定和模拟报告。",
    href: "/works/crispr-interactive",
    updated: "2026-06-04",
    tags: ["基因编辑", "互动", "CRISPR"],
    outputs: ["guide 判定", "编辑结果", "模拟报告"],
    action: "运行编辑",
    color: "var(--cherry-peach-light)", border: "var(--cherry-red)", rotate: "0.5deg",
  },
];

function WorkCard({ work }: { work: (typeof works)[0] }) {
  const [hovered, setHovered] = useState(false);
  const href = "href" in work ? work.href : undefined;
  const isPlantEvolution = work.slug === "plant-evolution-stories";

  function openDetail(event?: React.MouseEvent<HTMLAnchorElement>) {
    if (!href) return;
    if (event && !shouldUseClientNavigation(event)) return;
    event?.preventDefault();
    navigateClient(href);
  }

  return (
    <a
      className="work-card"
      href={href}
      aria-label={`打开${work.title}：${work.desc}`}
      onClick={openDetail}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
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
        color: "inherit",
        textDecoration: "none",
        display: "grid",
        gridTemplateRows: isPlantEvolution ? "auto auto auto auto auto auto" : "auto auto 1fr auto auto auto",
        alignContent: "start",
        minHeight: isPlantEvolution ? 560 : 366,
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

      <div style={{ minHeight: isPlantEvolution ? 372 : 92, display: "flex", justifyContent: "center", alignItems: "center", background: isPlantEvolution ? "rgba(250,247,241,0.62)" : "rgba(250,247,241,0.46)", border: "1.5px dashed rgba(94,68,42,0.12)", borderRadius: 16, marginBottom: "0.82rem", padding: isPlantEvolution ? "0.18rem 0.12rem" : 0, overflow: "hidden" }}>
        <WorkPreviewIllustration slug={work.slug} color={work.border} width={isPlantEvolution ? 190 : 132} height={isPlantEvolution ? 372 : 98} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {work.tags.map((t) => (
          <span key={t} style={{ background: "rgba(250,247,241,0.75)", color: "var(--cherry-warm-mid)", borderRadius: 999, padding: "0.2rem 0.6rem", fontSize: "0.74rem", fontWeight: 600, fontFamily: "'Nunito', sans-serif" }}>
            {t}
          </span>
        ))}
      </div>

      <div style={{ display: "grid", gap: 5, marginTop: "0.85rem" }}>
        {work.outputs.map((output) => (
          <span key={output} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--cherry-warm-brown)", fontSize: "0.76rem", fontWeight: 900 }}>
            <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: work.border, flexShrink: 0 }} />
            {output}
          </span>
        ))}
      </div>

      <span
        aria-hidden="true"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          marginTop: "0.95rem",
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
        {work.action} →
      </span>
    </a>
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
      aria-hidden="true"
      focusable="false"
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
      aria-labelledby="works-heading"
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
      <svg style={{ position: "absolute", top: 40, right: 30, opacity: 0.18 }} width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden="true" focusable="false">
        <path d="M10 55 Q15 35 50 12 Q50 38 10 55Z" fill="var(--cherry-forest)" />
      </svg>
      <svg style={{ position: "absolute", bottom: 50, left: 20, opacity: 0.15, transform: "scaleX(-1) rotate(20deg)" }} width="50" height="55" viewBox="0 0 60 60" fill="none" aria-hidden="true" focusable="false">
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
          <h2 id="works-heading" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "var(--cherry-warm-brown)", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", lineHeight: 1.3 }}>
            主题作品
          </h2>
        </div>

        {/* Filter */}
        <div role="group" aria-label="按主题作品类型筛选" style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: "0.85rem" }}>
          {categories.map((cat) => (
            <button
              className="work-filter-button"
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
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
        <div role="status" aria-live="polite" style={{ color: "var(--cherry-warm-mid)", textAlign: "center", fontSize: "0.78rem", fontWeight: 800, marginBottom: "2rem" }}>
          当前显示 {filtered.length} 个{activeCategory === "全部" ? "主题作品" : activeCategory}
        </div>

        {/* Grid */}
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(278px, 1fr))", gap: "2rem", listStyle: "none", margin: 0, padding: 0 }}>
          {filtered.map((work) => (
            <li key={work.id} style={{ display: "grid" }}>
              <WorkCard work={work} />
            </li>
          ))}
        </ul>
      </div>

      <WaveDivider flip />

      <style>
        {`
          #works .work-card:focus-visible,
          #works .work-filter-button:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          @media (prefers-reduced-motion: reduce) {
            #works .work-card,
            #works .work-filter-button {
              transition: none !important;
              transform: none !important;
            }
          }
        `}
      </style>
    </section>
  );
}
