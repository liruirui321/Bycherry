import { useState } from "react";
import { IconMicroscope, IconNotebook, IconAI, IconLeaf, IconFlask, IconDNA } from "./Icons";

type Category = "全部" | "科学" | "课程" | "AI工具";

export const works = [
  {
    id: 1, slug: "gene-expression", category: "科学" as Category,
    icon: <IconMicroscope size={36} color="var(--cherry-blue)" />,
    title: "基因表达可视化",
    desc: "把 DNA -> mRNA -> 蛋白质的过程做成一页可拖动的小动画，适合高中生预习和课堂演示。",
    outcome: "MVP：3 个交互步骤 + 1 张过程图 + 5 道即时小测",
    status: "可落地小工具",
    href: "#/works/gene-expression",
    tags: ["生物", "可视化", "交互"],
    audience: "高中生、生物教师、科学课程开发者",
    deliverables: ["可拖动互动流程图", "DNA / mRNA / 蛋白质动态展示", "5 道即时小测", "课堂演示版本"],
    roadmap: ["加入自定义 DNA 序列输入", "增加密码子表查询", "加入突变前后对比", "输出教师讲解稿"],
    color: "var(--cherry-blue-light)", border: "var(--cherry-blue)", rotate: "-1.5deg",
  },
  {
    id: 2, slug: "cell-biology-course", category: "课程" as Category,
    icon: <IconNotebook size={36} color="var(--cherry-yellow)" />,
    title: "细胞生物学入门课",
    desc: "用插画、类比和微型测验重做 8 讲细胞生物学入门内容，降低术语门槛但保留科学准确性。",
    outcome: "MVP：8 讲课程卡 + 每讲 1 张插画 + 1 组自测题",
    status: "课程原型",
    href: "#/works/cell-biology-course",
    tags: ["课程设计", "细胞生物", "自学"],
    audience: "高中生、大学新生、想补生物基础的学习者",
    deliverables: ["8 讲课程大纲", "插画式知识卡", "术语小词典", "每讲 5 题自测"],
    roadmap: ["完成第一讲细胞结构", "制作细胞器关系图", "加入学习路径推荐", "整理为可下载讲义"],
    color: "var(--cherry-yellow-light)", border: "var(--cherry-yellow)", rotate: "1.2deg",
  },
  {
    id: 3, slug: "research-prompt-kit", category: "AI工具" as Category,
    icon: <IconAI size={36} color="var(--cherry-blue)" />,
    title: "科研助手 Prompt Kit",
    desc: "为生命科学研究者整理一套可复用 prompt，用于文献拆解、实验设计、图表解读和论文写作检查。",
    outcome: "MVP：20 条 prompt + 使用场景 + 输入输出示例",
    status: "工具包",
    href: "#/works/research-prompt-kit",
    tags: ["AI", "Prompt", "科研"],
    audience: "生命科学研究生、科研助理、文献阅读初学者",
    deliverables: ["20 条可复制 prompt", "文献阅读模板", "实验设计检查清单", "论文写作反馈模板"],
    roadmap: ["按任务分类 prompt", "加入反例和坏案例", "做成网页检索版本", "补充中英文双语模板"],
    color: "var(--cherry-peach-light)", border: "var(--cherry-peach)", rotate: "-0.8deg",
  },
  {
    id: 4, slug: "plant-evolution-stories", category: "课程" as Category,
    icon: <IconLeaf size={36} color="var(--cherry-sage)" />,
    title: "植物进化小故事",
    desc: "用绘本式插画讲述植物从水生到陆生、从孢子到种子的演化线索，适合初中生和科普阅读。",
    outcome: "MVP：6 个故事章节 + 时间轴 + 术语小词典",
    status: "科普连载",
    href: "#/works/plant-evolution-stories",
    tags: ["植物学", "科普", "插画"],
    audience: "初中生、科普读者、自然教育课程参与者",
    deliverables: ["6 个植物演化故事", "一条手绘时间轴", "术语小词典", "课堂讨论问题"],
    roadmap: ["完成苔藓章节", "制作时间轴插画", "加入演化证据卡", "整理成科普长图"],
    color: "var(--cherry-sage-light)", border: "var(--cherry-sage)", rotate: "1.8deg",
  },
  {
    id: 5, slug: "concept-explainer", category: "AI工具" as Category,
    icon: <IconAI size={36} color="#7B6CC4" />,
    title: "概念解释生成器",
    desc: "输入一个生物学概念，生成小学、高中、研究生三个版本的解释，并附带类比、误区和检查题。",
    outcome: "MVP：概念输入框 + 三档解释 + 一键生成小测",
    status: "AI 小工具",
    href: "#/works/concept-explainer",
    tags: ["AI", "教育", "工具"],
    audience: "教师、学习者、课程内容创作者",
    deliverables: ["概念输入框", "三档解释输出", "常见误区提示", "一键生成自测题"],
    roadmap: ["加入解释质量评分", "支持知识点标签", "接入课程标准维度", "导出为课堂讲义"],
    color: "#EDE9F5", border: "#B5AEDD", rotate: "-1.2deg",
  },
  {
    id: 6, slug: "crispr-interactive", category: "科学" as Category,
    icon: <IconDNA size={36} color1="var(--cherry-red)" color2="var(--cherry-blue)" />,
    title: "CRISPR 交互讲解",
    desc: "一个可以亲手模拟“识别、剪切、修复”的基因编辑互动页面，把 CRISPR 从概念变成可操作体验。",
    outcome: "MVP：剪切模拟器 + 三种修复结果 + 风险提示卡",
    status: "互动解释器",
    href: "#/works/crispr-interactive",
    tags: ["基因编辑", "互动", "CRISPR"],
    audience: "高中生、科普读者、生物竞赛入门学习者",
    deliverables: ["识别与剪切模拟器", "三种修复结果卡", "风险提示卡", "术语解释卡"],
    roadmap: ["加入 guide RNA 配对动画", "展示脱靶风险", "加入案例材料", "制作教师演示模式"],
    color: "var(--cherry-peach-light)", border: "var(--cherry-red)", rotate: "0.5deg",
  },
];

function WorkCard({ work }: { work: (typeof works)[0] }) {
  const [hovered, setHovered] = useState(false);
  const href = "href" in work ? work.href : undefined;

  return (
    <div
      role={href ? "link" : undefined}
      tabIndex={href ? 0 : undefined}
      onClick={() => {
        if (href) window.location.hash = href.replace("#", "");
      }}
      onKeyDown={(event) => {
        if (href && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          window.location.hash = href.replace("#", "");
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

      <div
        style={{
          background: "rgba(250,247,241,0.72)",
          border: "1px dashed rgba(94,68,42,0.2)",
          borderRadius: 12,
          padding: "0.6rem 0.75rem",
          marginBottom: "0.9rem",
        }}
      >
        <div style={{ fontSize: "0.72rem", color: "var(--cherry-red)", fontWeight: 800, marginBottom: 3 }}>
          {work.status}
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--cherry-warm-mid)", lineHeight: 1.55 }}>
          {work.outcome}
        </div>
      </div>

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
          onClick={(event) => event.stopPropagation()}
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
              贴在桌面上的小作品计划
            </span>
          </div>
          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "var(--cherry-warm-brown)", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", lineHeight: 1.3 }}>
            可以慢慢落地的作品
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
