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

function ResearchCardIllustration({ slug, color }: { slug: string; color: string }) {
  if (slug === "genome-assembly-story") {
    return (
      <svg width="150" height="88" viewBox="0 0 150 88" fill="none" aria-hidden="true" focusable="false">
        <path d="M14 67 C36 50 58 57 76 44 C99 27 116 39 140 19 V82 H14Z" fill="var(--cherry-sage-light)" opacity="0.78" />
        <path d="M32 71 C55 79 113 78 134 67" stroke="rgba(58,92,62,0.18)" strokeWidth="5" strokeLinecap="round" />
        <path d="M56 68 C52 48 59 30 72 14" stroke="var(--cherry-forest)" strokeWidth="4.6" strokeLinecap="round" />
        <path d="M67 21 C82 7 105 13 111 31 C90 41 76 36 67 21Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth="2" />
        <path d="M52 43 C35 35 23 43 22 61 C38 66 49 58 52 43Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth="2" />
        <path d="M91 59 C100 48 115 49 123 60" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.46" />
        <circle cx="101" cy="35" r="6" fill="var(--cherry-yellow)" opacity="0.86" />
      </svg>
    );
  }

  if (slug === "barcoding-evidence-chain") {
    return (
      <svg width="150" height="88" viewBox="0 0 150 88" fill="none" aria-hidden="true" focusable="false">
        <rect x="20" y="23" width="42" height="48" rx="12" fill="rgba(250,247,241,0.92)" stroke={color} strokeWidth="2.2" />
        <path d="M33 19 H49 M36 19 V12 H46 V19" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M31 42 C39 34 47 50 55 41" stroke="var(--cherry-blue)" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M31 52 C39 60 47 44 55 53" stroke="var(--cherry-red)" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M71 47 H91 M91 47 L86 42 M91 47 L86 52" stroke="var(--cherry-forest)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="98" y="19" width="32" height="54" rx="9" fill="var(--cherry-peach-light)" stroke="var(--cherry-red)" strokeWidth="2" />
        <path d="M106 34 H122 M106 45 H118 M106 56 H124" stroke="var(--cherry-warm-mid)" strokeWidth="2.4" strokeLinecap="round" opacity="0.5" />
        <circle cx="116" cy="17" r="7" fill="var(--cherry-yellow)" opacity="0.84" />
      </svg>
    );
  }

  if (slug === "ai-assessment-quality-control") {
    return (
      <svg width="150" height="88" viewBox="0 0 150 88" fill="none" aria-hidden="true" focusable="false">
        <rect x="20" y="23" width="64" height="44" rx="13" fill="rgba(250,247,241,0.92)" stroke={color} strokeWidth="2.2" />
        <path d="M32 37 H72 M32 49 H62" stroke="var(--cherry-warm-mid)" strokeWidth="3" strokeLinecap="round" opacity="0.42" />
        <path d="M89 28 C101 20 119 26 121 42 C123 60 99 68 88 53 C82 44 83 34 89 28Z" fill="#EDE9F5" stroke={color} strokeWidth="2.2" />
        <circle cx="99" cy="43" r="3.5" fill={color} />
        <circle cx="112" cy="43" r="3.5" fill={color} />
        <path d="M99 53 C104 57 111 57 116 53" stroke="var(--cherry-warm-brown)" strokeWidth="2" strokeLinecap="round" />
        <path d="M109 16 L114 25 L124 28 L115 33 L112 43 L107 34 L97 31 L106 25Z" fill="var(--cherry-yellow)" opacity="0.92" />
      </svg>
    );
  }

  return (
    <svg width="150" height="88" viewBox="0 0 150 88" fill="none" aria-hidden="true" focusable="false">
      <rect x="19" y="22" width="58" height="48" rx="12" fill="rgba(250,247,241,0.92)" stroke={color} strokeWidth="2.2" />
      <path d="M31 36 H64 M31 49 H58" stroke="var(--cherry-warm-mid)" strokeWidth="3" strokeLinecap="round" opacity="0.44" />
      <path d="M84 30 C96 16 119 20 126 39 C106 50 91 45 84 30Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth="2" />
      <path d="M91 59 C101 48 118 52 125 65 C110 73 98 70 91 59Z" fill="var(--cherry-sage-light)" stroke="var(--cherry-forest)" strokeWidth="1.8" />
      <circle cx="111" cy="38" r="7" fill="var(--cherry-red)" opacity="0.82" />
      <path d="M102 18 L107 26 L116 29 L108 34 L106 43 L101 35 L92 32 L100 27Z" fill="var(--cherry-yellow)" />
    </svg>
  );
}

function EssayCard({ essay }: {
  essay: (typeof essays)[0];
}) {
  return (
    <a
      className="research-essay-card"
      href={essay.href}
      aria-label={`阅读科研随笔：${essay.title}`}
      style={{
        background: "var(--card)",
        border: "1.5px solid var(--border)",
        borderRadius: 8,
        padding: "1.25rem",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        color: "inherit",
        display: "grid",
        gridTemplateRows: "auto auto auto 1fr auto auto",
        height: "100%",
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
          borderRadius: "8px 8px 0 0",
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
            <span style={{ fontSize: "0.82rem", color: "var(--cherry-warm-mid)" }}>
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

      <div className="research-essay-illustration" style={{ background: essay.labelBg, borderColor: essay.labelColor }}>
        <ResearchCardIllustration slug={essay.slug} color={essay.labelColor} />
      </div>

      {/* Body excerpt — always shown partially, expanded on click */}
      <div
        className="research-essay-excerpt"
        style={{
          overflow: "hidden",
          maxHeight: 76,
          transition: "max-height 0.35s ease",
        }}
      >
        <p style={{ color: "var(--cherry-warm-mid)", fontSize: "0.85rem", lineHeight: 1.7 }}>
          {essay.body}
        </p>
      </div>

      <div style={{ display: "grid", alignContent: "start", gap: 6, marginTop: "0.85rem" }}>
        {essay.highlights.slice(0, 2).map((highlight) => (
          <span key={highlight} style={{ display: "grid", gridTemplateColumns: "12px minmax(0, 1fr)", alignItems: "start", gap: 7, color: "var(--cherry-warm-brown)", fontSize: "0.76rem", fontWeight: 800, lineHeight: 1.48 }}>
            <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: essay.labelColor, marginTop: "0.38rem", opacity: 0.78 }} />
            {highlight}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", alignSelf: "end", marginTop: "1rem", flexWrap: "wrap", gap: 8 }}>
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
          <span style={{ fontSize: "0.82rem", color: "var(--cherry-warm-mid)" }}>
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
          <span style={{ fontSize: "1rem", color: "var(--cherry-warm-mid)", fontWeight: 600 }}>
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
      <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem", listStyle: "none", margin: 0, padding: 0 }}>
        {essays.map((essay) => (
          <li key={essay.id} style={{ display: "grid" }}>
            <EssayCard essay={essay} />
          </li>
        ))}
      </ul>

      <style>
        {`
          #research .research-essay-card:hover,
          #research .research-essay-card:focus-visible {
            transform: translateY(-3px);
            box-shadow: 0 10px 22px rgba(94,68,42,0.09);
          }

          #research .research-essay-card:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          #research .research-essay-illustration {
            min-height: 90px;
            border: 1px solid;
            border-radius: 8px;
            margin: 0.85rem 0 0.9rem;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            box-shadow: inset 0 0 0 999px rgba(250,247,241,0.32);
          }

          #research .research-essay-illustration svg {
            width: min(100%, 168px);
            height: 94px;
            display: block;
          }

          #research .research-essay-card:hover .research-essay-arrow,
          #research .research-essay-card:focus-visible .research-essay-arrow {
            transform: translateX(3px);
          }

          @media (prefers-reduced-motion: reduce) {
            #research .research-essay-card,
            #research .research-essay-excerpt,
            #research .research-essay-illustration,
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
        <span style={{ fontSize: "0.88rem", color: "var(--cherry-warm-mid)" }}>
          科研转译和课程设计持续更新
        </span>
        <div style={{ width: 40, height: 1.5, background: "var(--border)" }} />
      </div>
    </section>
  );
}
