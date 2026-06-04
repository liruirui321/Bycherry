import { IconDNA, IconMicroscope, IconFlask, IconResearch, IconArrowRight, IconLeafSmall, IconStar } from "./Icons";
import { navigateClient, shouldUseClientNavigation } from "../navigation";

export const essays = [
  {
    id: 1,
    slug: "science-to-classroom-question",
    href: "/research/science-to-classroom-question",
    icon: <IconDNA size={26} color1="var(--cherry-blue)" color2="var(--cherry-red)" />,
    date: "2026-06-01",
    label: "科研转化",
    labelColor: "var(--cherry-blue)",
    labelBg: "var(--cherry-blue-light)",
    title: "真实科研如何变成学生能进入的问题",
    body: "前沿科研不适合被直接搬进课堂。更有效的做法，是从学生已有经验出发，把复杂概念拆成可以观察、比较、推理和表达的小任务……",
    readMin: 6,
    tags: ["科学教育", "课程转化", "真实情境"],
    paragraphs: [
      "真实科研进入课堂时，第一步不是删掉难词，而是重建问题。学生需要从一个可以理解的现象开始，逐步看到背后的科学结构。",
      "比如植物基因组研究可以从“为什么同一种环境里有些植物更耐旱”进入，而不是直接讲测序平台、组装算法和注释流程。",
      "课程化的关键，是把研究对象、数据证据和解释任务拆成学生能操作的层级。",
    ],
    highlights: ["从现象到问题", "从数据到证据", "从解释到表达"],
  },
  {
    id: 2,
    slug: "genome-assembly-story",
    href: "/research/genome-assembly-story",
    icon: <IconFlask size={26} color="var(--cherry-sage)" />,
    date: "2026-05-24",
    label: "植物基因组",
    labelColor: "var(--cherry-sage)",
    labelBg: "var(--cherry-sage-light)",
    title: "从基因组组装到一个可讲述的科学故事",
    body: "组装、注释、比较分析和可视化并不是孤立步骤。它们最终需要回答一个问题：这些数据能帮助我们理解植物的什么变化、什么能力和什么历史……",
    readMin: 8,
    tags: ["基因组", "多组学", "科学叙事"],
    paragraphs: [
      "基因组组装常被看成技术流程，但一个可讲述的科研故事需要回答：为什么是这个物种？为什么这些基因值得看？为什么这些变化重要？",
      "从原始 reads 到染色体级组装，再到注释和比较分析，每一步都应该服务同一个科学问题，而不是堆叠图表。",
      "好的科研转化会保留数据的真实感，同时把证据关系整理到学习者能够跟上的程度。",
    ],
    highlights: ["技术流程要服务科学问题", "图表必须有证据关系", "叙事不是美化，而是组织理解"],
  },
  {
    id: 3,
    slug: "barcoding-evidence-chain",
    href: "/research/barcoding-evidence-chain",
    icon: <IconMicroscope size={26} color="var(--cherry-peach)" />,
    date: "2026-05-12",
    label: "项目课程",
    labelColor: "#7D2A18",
    labelBg: "var(--cherry-peach-light)",
    title: "Barcoding 课程里的证据链设计",
    body: "一个好的物种鉴定项目，不只是让学生做完实验。更重要的是让样本、记录、序列、比对结果和系统发育树共同构成一条可解释的证据链。",
    readMin: 7,
    tags: ["Barcoding", "PBL", "证据意识"],
    paragraphs: [
      "Barcoding 课程的价值不只是学习 DNA 提取和 BLAST。它真正训练的是学生如何让样本、实验记录、序列结果和分析结论互相支持。",
      "如果学生只拿到一个“鉴定成功”的结果，却说不清样本是否可靠、序列质量如何、比对结果为什么可信，那么项目还没有完成。",
      "因此课程需要把证据链显性化：每一步都留下记录，每个结论都能回到数据。",
    ],
    highlights: ["样本记录是证据链起点", "序列质量影响解释可信度", "系统发育树是表达，不是装饰"],
  },
  {
    id: 4,
    slug: "ai-assessment-quality-control",
    href: "/research/ai-assessment-quality-control",
    icon: <IconResearch size={26} color="#3C2D6E" />,
    date: "2026-05-01",
    label: "AI工具",
    labelColor: "#3C2D6E",
    labelBg: "#EDE9F5",
    title: "智能测评平台里的生成质量控制",
    body: "AI 出题并不等于把题目交给模型。知识点约束、难度约束、答案校验、人工量规和学生实测反馈，才共同决定生成内容是否真的可用。",
    readMin: 10,
    tags: ["LLM", "智能测评", "质量控制"],
    paragraphs: [
      "AI 智能测评最容易被误解成自动出题。真正关键的是质量控制：题目是否对齐目标、答案是否稳定、难度是否可解释、反馈是否有帮助。",
      "知识图谱可以限制生成范围，量规可以帮助人工审核，自动解题脚本可以发现部分错误，学生实测数据则能暴露真实使用中的问题。",
      "因此平台设计不应追求“全自动”，而应建立生成、校验、审核、反馈和迭代的闭环。",
    ],
    highlights: ["生成不是终点", "质量控制需要多层证据", "自动化必须保留人工审核位置"],
  },
];

function navigateTo(href: string, event?: React.MouseEvent<HTMLAnchorElement>) {
  if (event && !shouldUseClientNavigation(event)) return;
  event?.preventDefault();
  navigateClient(href);
}

function EssayCard({ essay }: {
  essay: (typeof essays)[0];
}) {
  return (
    <a
      className="research-essay-card"
      href={essay.href}
      style={{
        background: "var(--card)",
        border: "1.5px solid var(--border)",
        borderRadius: 18,
        padding: "1.5rem",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        color: "inherit",
        display: "block",
        textDecoration: "none",
      }}
      onClick={(event) => navigateTo(essay.href, event)}
    >
      {/* Forest accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 3,
          background: `linear-gradient(90deg, ${essay.labelColor}, transparent)`,
          opacity: 0.6,
          borderRadius: "18px 18px 0 0",
        }}
      />

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
        {/* Icon block */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: essay.labelBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {essay.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Meta */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.45rem", flexWrap: "wrap" }}>
            <span
              style={{
                background: essay.labelBg,
                color: essay.labelColor,
                borderRadius: 999,
                padding: "0.18rem 0.65rem",
                fontSize: "0.74rem",
                fontWeight: 700,
              }}
            >
              {essay.label}
            </span>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: "0.82rem", color: "var(--cherry-warm-mid)" }}>
              {essay.date}
            </span>
          </div>

          <h3
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              color: "var(--cherry-warm-brown)",
              fontSize: "1rem",
              lineHeight: 1.4,
              marginBottom: "0.55rem",
            }}
          >
            {essay.title}
          </h3>
        </div>
      </div>

      {/* Body excerpt — always shown partially, expanded on click */}
      <div
        className="research-essay-excerpt"
        style={{
          marginTop: "0.9rem",
          overflow: "hidden",
          maxHeight: 76,
          transition: "max-height 0.35s ease",
        }}
      >
        <p style={{ color: "var(--cherry-warm-mid)", fontSize: "0.85rem", lineHeight: 1.7 }}>
          {essay.body}
        </p>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {essay.tags.map((t) => (
            <span
              key={t}
              style={{
                background: "var(--muted)",
                color: "var(--cherry-warm-mid)",
                borderRadius: 999,
                padding: "0.18rem 0.55rem",
                fontSize: "0.73rem",
                fontWeight: 600,
              }}
            >
              {t}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "'Caveat', cursive", fontSize: "0.82rem", color: "var(--cherry-warm-mid)" }}>
            约 {essay.readMin} 分钟
          </span>
          <div
            className="research-essay-arrow"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "var(--cherry-forest)",
              fontWeight: 700,
              fontSize: "0.8rem",
            }}
          >
            阅读全文
            <div style={{ transition: "transform 0.25s" }}>
              <IconArrowRight size={14} color="var(--cherry-forest)" />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

export function ResearchEssays() {
  return (
    <section
      id="research"
      aria-labelledby="research-heading"
      style={{
        fontFamily: "'Nunito', sans-serif",
        padding: "5rem 1.5rem",
        maxWidth: 1100,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Corner fern deco */}
      <svg style={{ position: "absolute", top: 30, right: 0, opacity: 0.12, pointerEvents: "none" }} width="100" height="110" viewBox="0 0 100 110" fill="none" aria-hidden="true" focusable="false">
        <path d="M90 108 Q90 70 90 40" stroke="var(--cherry-forest)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M90 72 Q68 58 62 38 Q80 37 90 56" fill="var(--cherry-forest)" />
        <path d="M90 56 Q112 42 118 22 Q100 23 90 42" fill="var(--cherry-forest)" />
        <path d="M90 88 Q72 76 66 62 Q82 63 90 76" fill="var(--cherry-forest)" opacity="0.6" />
      </svg>

      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: "0.75rem" }}>
          <IconLeafSmall size={18} color="var(--cherry-warm-mid)" />
          <span style={{ fontFamily: "'Caveat', cursive", fontSize: "1rem", color: "var(--cherry-warm-mid)", fontWeight: 600 }}>
            在实验室和文献里想到的事
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <h2 id="research-heading" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "var(--cherry-warm-brown)", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", lineHeight: 1.3 }}>
            科研随笔
          </h2>
        </div>

        {/* Decorative horizontal rule */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "0.8rem" }}>
          <div style={{ flex: 1, height: 1.5, background: "var(--border)", borderRadius: 1 }} />
          <IconStar size={14} color="var(--cherry-yellow)" />
          <div style={{ flex: 1, height: 1.5, background: "var(--border)", borderRadius: 1 }} />
        </div>
      </div>

      {/* Two-column grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {essays.map((essay) => (
          <EssayCard
            key={essay.id}
            essay={essay}
          />
        ))}
      </div>

      <style>
        {`
          #research .research-essay-card:hover,
          #research .research-essay-card:focus-visible {
            transform: translateY(-3px);
            box-shadow: 4px 8px 0px rgba(94,68,42,0.1);
          }

          #research .research-essay-card:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          #research .research-essay-card:hover .research-essay-arrow,
          #research .research-essay-card:focus-visible .research-essay-arrow {
            transform: translateX(3px);
          }

          @media (prefers-reduced-motion: reduce) {
            #research .research-essay-card,
            #research .research-essay-excerpt,
            #research .research-essay-arrow {
              transition: none !important;
              transform: none !important;
            }
          }
        `}
      </style>

      {/* Bottom note */}
      <div
        style={{
          marginTop: "2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <div style={{ width: 40, height: 1.5, background: "var(--border)" }} />
        <span style={{ fontFamily: "'Caveat', cursive", fontSize: "0.88rem", color: "var(--cherry-warm-mid)" }}>
          点击卡片进入完整随笔
        </span>
        <div style={{ width: 40, height: 1.5, background: "var(--border)" }} />
      </div>
    </section>
  );
}
