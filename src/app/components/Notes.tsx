import { IconBook, IconAI, IconLeaf, IconResearch, IconArrowRight, IconCoffee } from "./Icons";
import { navigateClient, shouldUseClientNavigation } from "../navigation";

export const notes = [
  {
    id: 1,
    slug: "ai-course-development",
    href: "/notes/ai-course-development",
    date: "2026-06-03",
    tag: "AI教育",
    tagColor: "var(--cherry-blue)",
    tagBg: "var(--cherry-blue-light)",
    icon: <IconResearch size={18} color="var(--cherry-blue)" />,
    title: "AI 可以参与课程开发，但不能替代教学判断",
    excerpt: "从课程目标、任务流程到评价量规，AI 能加快材料组织；但真正的学情判断、内容边界和价值取舍，仍然需要人来完成……",
    readTime: "8",
    paragraphs: [
      "AI 很适合参与课程开发中的低风险环节：拆解知识点、整理课堂活动、生成评价量规、把同一内容改写成不同难度版本。这些工作原本会消耗大量时间，而且常常不是教学判断本身。",
      "我会先让 AI 帮我列出课程目标、先修知识、可能误解和任务顺序，再把这些结果当成草稿来审。它提供的是可比较的备选方案，而不是最终方案。",
      "课程真正困难的地方不是生成材料，而是判断材料是否适合学生、是否符合学科逻辑、是否会造成误解，以及它是否真的服务学习目标。这个判断来自教师对学生、学科和课堂情境的理解。",
      "例如同一个“基因表达”主题，AI 可能很快生成转录、翻译、密码子、蛋白质合成等知识点清单，但它未必知道学生此刻卡在“信息如何被传递”还是“结构如何对应功能”。",
      "因此我会把 AI 输出拆成三类：可以直接复用的表达，可以改写后使用的活动，以及必须人工重做的判断。尤其涉及难度、评价和课堂价值取舍时，我不会让模型直接定稿。",
      "所以我更愿意把 AI 放在“第二大脑”和“材料整理器”的位置。它能帮我更快看见可能性，但最后的教学判断必须由人负责。好课程不是一次生成出来的，而是在试讲、观察和修改中逐步成形。",
    ],
    highlights: ["适合 AI 做：整理、变体、检查清单", "必须由人做：学情判断、内容边界、价值取舍", "好课程不是生成出来的，而是迭代出来的"],
    actionSteps: ["先写清楚本节课学生最后要会做什么", "让 AI 生成 3 套任务流程并标出可能误解", "人工删掉超出学情和证据边界的内容", "用一节试讲或小测结果回头修改材料"],
  },
  {
    id: 2,
    slug: "plant-genome-to-classroom",
    href: "/notes/plant-genome-to-classroom",
    date: "2026-05-28",
    tag: "科研转化",
    tagColor: "#4A2D80",
    tagBg: "#EDE9F5",
    icon: <IconAI size={18} color="#4A2D80" />,
    title: "从植物基因组到高中生物课堂",
    excerpt: "真实科研进入课堂时，难点不只是降难度，而是找到学生能进入的问题、证据和任务，让前沿知识变成可参与的探究……",
    readTime: "9",
    paragraphs: [
      "把植物基因组研究放进课堂，不是把论文摘要翻译成更简单的话。学生需要一个能进入的问题，比如“为什么不同植物会有不同适应能力？”或者“同一种性状背后可能有哪些基因线索？”",
      "真实研究里有测序、组装、注释、比较基因组和功能推断，但高中课堂不需要完整复刻流程。更可行的做法，是选取一小段证据链，让学生看见数据如何支持解释。",
      "课程设计要把真实数据转化成证据材料：基因组图谱、性状差异、样本来源、比对结果和研究结论之间需要有清楚的链条。否则学生只会记住“科学家发现了某个基因”，却不知道发现如何发生。",
      "我会把材料分成三层：第一层是现象，例如耐旱、开花时间或果实形态；第二层是证据，例如基因家族扩张、表达差异或序列变异；第三层是解释限制，例如这些数据只能提示关联，不能自动证明因果。",
      "这样的课堂不一定要让学生掌握所有技术名词，但要让他们练习一种科研思维：看见问题，找到证据，判断证据的强弱，再说出还有哪些不确定。",
      "前沿科研的价值不只在知识更新，也在让学生体验科学如何提出问题、组织证据、接受不确定性，并逐步形成解释。把不确定性保留下来，反而会让课堂更接近真实科学。",
    ],
    highlights: ["从生活问题进入", "用真实数据做证据", "保留科研中的不确定性"],
    actionSteps: ["先选一个学生能观察到的植物性状或环境问题", "只截取一段能说明问题的真实数据或图表", "让学生区分现象、证据、解释和限制", "最后用一句话写出这个证据还能缺什么"],
  },
  {
    id: 3,
    slug: "pbl-rubric-evidence",
    href: "/notes/pbl-rubric-evidence",
    date: "2026-05-18",
    tag: "课程设计",
    tagColor: "var(--cherry-forest)",
    tagBg: "var(--cherry-sage-light)",
    icon: <IconBook size={18} color="var(--cherry-forest)" />,
    title: "项目制学习中的任务、量规和作品证据",
    excerpt: "一个项目不是把活动串起来，而是把真实问题、学习目标、任务流程、评价量规和学生作品放在同一条线上……",
    readTime: "9",
    paragraphs: [
      "项目制学习最容易变成“活动很多，但学习不清楚”。我会先问：学生最终要产出什么作品？这个作品能证明他们学到了什么？如果作品不能承载证据，项目就容易变成热闹的活动。",
      "一个好的项目作品不一定复杂，但必须能看出学生的理解。例如调查报告、模型图、实验方案、科普短片或展板，都应该能回答：学生用了哪些资料，怎样组织证据，结论是否合理。",
      "任务流程需要和评价量规一起设计。没有量规，学生不知道什么算好；没有作品证据，教师也很难判断学生是否真正理解。量规不应只在最后评分时出现，而应在任务开始前就变成导航。",
      "我会把量规写成可观察的表现：是否提出清楚问题，是否引用可靠证据，是否解释证据与结论的关系，是否说明局限，是否根据反馈修改作品。这样学生知道自己要改什么。",
      "项目过程中的每一步都应该留下中间证据：问题草稿、资料卡、实验记录、同伴反馈和修订痕迹。这些过程材料能帮助教师判断学习是否发生，也能帮助学生回看自己的思维变化。",
      "一个完整项目应该能从驱动问题走向任务分解、资料收集、证据组织、作品表达和复盘修改。复盘不是收尾，而是让学生意识到作品如何变得更可靠。",
    ],
    highlights: ["作品必须能承载证据", "量规要在任务开始前出现", "复盘不是收尾，而是学习的一部分"],
    actionSteps: ["先确定学生最终作品和它要证明的学习目标", "把量规拆成问题、证据、解释、表达和修改五项", "让学生每一步留下过程证据", "用复盘记录说明作品哪里被修改得更可靠"],
  },
  {
    id: 4,
    slug: "ai-comic-video-workflow",
    href: "/notes/ai-comic-video-workflow",
    date: "2026-05-08",
    tag: "创作工具",
    tagColor: "var(--cherry-red)",
    tagBg: "var(--cherry-peach-light)",
    icon: <IconLeaf size={18} color="var(--cherry-red)" />,
    title: "我的 AI 漫画与视频创作工作流",
    excerpt: "从小说文本到分镜、角色资产、TTS、唇形同步和成片组装，真正困难的不是单点生成，而是让每一步可以复用和质检……",
    readTime: "8",
    paragraphs: [
      "AI 创作工作流的难点不在于生成一张好看的图，而在于角色一致、镜头连续、声音稳定、节奏可控，并且每一步都能回溯。单点效果再惊艳，如果不能复用，就很难进入长期创作。",
      "我会先把小说或脚本拆成场景表：人物、地点、情绪、动作、对白和镜头目的。这样后面的分镜、角色图和音频生成都有明确输入，不会只靠临时灵感。",
      "角色资产是最需要提前锁定的部分。服装、发型、脸型、色彩、常用表情和禁用特征都要记录下来，否则不同镜头之间会出现细微漂移，最后影响观众对角色的识别。",
      "我把流程拆成剧本、分镜、角色资产、场景资产、TTS、唇形同步、音效约束和成片组装，每一步都需要有输入、输出和坏案例记录。坏案例不是失败记录，而是质量控制的一部分。",
      "视频阶段最容易出问题的是节奏。AI 可以生成画面和声音，但镜头长度、停顿、转场和情绪递进仍然需要人工剪辑。否则画面看起来完整，观看体验却会散。",
      "这个过程很像课程开发：不是一次生成成品，而是建立一套可以复用、检查和迭代的生产系统。真正有价值的是流程稳定，而不是某一次生成运气好。",
    ],
    highlights: ["单点生成不等于工作流", "资产锁定比灵感更重要", "坏案例记录是质量控制的核心"],
    actionSteps: ["先把脚本拆成场景表和镜头目的", "锁定角色设定、场景设定和禁用特征", "每一步保存输入、输出和失败原因", "剪辑时优先检查节奏、连续性和声音稳定"],
  },
];

function navigateTo(href: string, event?: React.MouseEvent<HTMLAnchorElement>) {
  if (event && !shouldUseClientNavigation(event)) return;
  event?.preventDefault();
  navigateClient(href);
}

function NoteCardIllustration({ slug, color }: { slug: string; color: string }) {
  if (slug === "plant-genome-to-classroom") {
    return (
      <svg width="132" height="78" viewBox="0 0 132 78" fill="none" aria-hidden="true" focusable="false">
        <path d="M8 61 C25 47 45 53 61 42 C80 29 97 39 124 21 V74 H8Z" fill="var(--cherry-sage-light)" opacity="0.76" />
        <path d="M22 67 C41 73 93 73 116 64" stroke="rgba(58,92,62,0.18)" strokeWidth="5" strokeLinecap="round" />
        <path d="M48 67 C45 50 50 34 61 18" stroke="var(--cherry-forest)" strokeWidth="4" strokeLinecap="round" />
        <path d="M57 24 C70 12 90 18 95 33 C76 42 64 37 57 24Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth="1.8" />
        <path d="M47 43 C32 35 20 42 19 58 C34 63 43 56 47 43Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth="1.8" />
        <path d="M84 52 C92 42 104 42 112 52" stroke="var(--cherry-blue)" strokeWidth="4" strokeLinecap="round" opacity="0.38" />
        <circle cx="85" cy="32" r="6" fill="var(--cherry-red)" opacity="0.84" />
      </svg>
    );
  }

  if (slug === "pbl-rubric-evidence") {
    return (
      <svg width="132" height="78" viewBox="0 0 132 78" fill="none" aria-hidden="true" focusable="false">
        <rect x="18" y="17" width="56" height="48" rx="10" fill="rgba(250,247,241,0.9)" stroke={color} strokeWidth="2.2" />
        <path d="M30 30 H62 M30 42 H58 M30 54 H51" stroke="var(--cherry-warm-mid)" strokeWidth="3" strokeLinecap="round" opacity="0.42" />
        <circle cx="89" cy="24" r="11" fill="var(--cherry-yellow)" opacity="0.86" />
        <path d="M82 52 L89 59 L106 40" stroke="var(--cherry-forest)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M95 18 L100 25 L108 27 L102 32 L100 40 L95 33 L87 30 L93 25Z" fill="var(--cherry-peach)" opacity="0.9" />
      </svg>
    );
  }

  if (slug === "ai-comic-video-workflow") {
    return (
      <svg width="132" height="78" viewBox="0 0 132 78" fill="none" aria-hidden="true" focusable="false">
        <rect x="16" y="20" width="44" height="36" rx="10" fill="rgba(250,247,241,0.92)" stroke={color} strokeWidth="2.2" />
        <rect x="68" y="16" width="45" height="42" rx="12" fill="var(--cherry-peach-light)" stroke="var(--cherry-red)" strokeWidth="2.2" />
        <circle cx="30" cy="35" r="3" fill="var(--cherry-warm-brown)" />
        <circle cx="45" cy="35" r="3" fill="var(--cherry-warm-brown)" />
        <path d="M31 45 C36 49 42 49 47 45" stroke="var(--cherry-warm-brown)" strokeWidth="2" strokeLinecap="round" />
        <path d="M80 34 H101 M80 44 H96" stroke="var(--cherry-warm-mid)" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
        <path d="M57 38 H70" stroke="var(--cherry-forest)" strokeWidth="3" strokeLinecap="round" />
        <path d="M99 12 L104 20 L113 22 L106 27 L104 36 L99 28 L90 25 L97 20Z" fill="var(--cherry-yellow)" />
      </svg>
    );
  }

  return (
    <svg width="132" height="78" viewBox="0 0 132 78" fill="none" aria-hidden="true" focusable="false">
      <rect x="18" y="18" width="62" height="44" rx="12" fill="rgba(250,247,241,0.9)" stroke={color} strokeWidth="2.2" />
      <path d="M30 32 H66 M30 44 H58" stroke="var(--cherry-warm-mid)" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
      <path d="M91 22 L97 33 L109 37 L98 43 L94 55 L88 44 L76 40 L87 34Z" fill="var(--cherry-yellow)" stroke="rgba(94,68,42,0.14)" strokeWidth="1.2" />
      <path d="M84 59 C94 49 110 53 115 65 C101 72 90 69 84 59Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth="1.8" />
    </svg>
  );
}

export function Notes() {
  return (
    <section
      id="notes"
      aria-labelledby="notes-heading"
      style={{
        fontFamily: "'Nunito', sans-serif",
        padding: "5rem 1.5rem",
        background: "var(--muted)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Wavy dividers */}
      <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", display: "block" }} viewBox="0 0 1440 28" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
        <path d="M0 14 Q180 0 360 14 Q540 28 720 14 Q900 0 1080 14 Q1260 28 1440 14 L1440 0 L0 0Z" fill="var(--background)" />
      </svg>
      <svg style={{ position: "absolute", bottom: 0, left: 0, width: "100%", display: "block" }} viewBox="0 0 1440 28" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
        <path d="M0 14 Q180 28 360 14 Q540 0 720 14 Q900 28 1080 14 Q1260 0 1440 14 L1440 28 L0 28Z" fill="var(--background)" />
      </svg>

      {/* Background leaf */}
      <svg style={{ position: "absolute", bottom: 40, right: 20, opacity: 0.1, pointerEvents: "none" }} width="90" height="90" viewBox="0 0 90 90" fill="none" aria-hidden="true" focusable="false">
        <path d="M15 80 Q20 50 75 18 Q75 55 15 80Z" fill="var(--cherry-forest)" />
      </svg>

      <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: "1.5rem", paddingBottom: "1.5rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: "0.75rem" }}>
              <IconBook size={20} color="var(--cherry-warm-mid)" />
              <span style={{ fontSize: "1rem", color: "var(--cherry-warm-mid)", fontWeight: 600 }}>文章目录</span>
            </div>
            <h2 id="notes-heading" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "var(--cherry-warm-brown)", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", lineHeight: 1.3 }}>
              最近在想的事
            </h2>
          </div>
        </div>

        {/* Notes grid */}
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem", listStyle: "none", margin: 0, padding: 0 }}>
          {notes.map((note) => (
            <li key={note.id} style={{ display: "grid" }}>
              <a
                className="note-card"
                href={note.href}
                aria-label={`阅读笔记：${note.title}`}
                onClick={(event) => navigateTo(note.href, event)}
                style={{
                  background: "var(--card)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 8,
                  padding: "1.25rem",
                  position: "relative",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                  color: "inherit",
                  display: "grid",
                  gridTemplateRows: "auto auto auto auto 1fr auto",
                  height: "100%",
                  textDecoration: "none",
                }}
              >
                {/* Left color bar */}
                <div style={{ position: "absolute", top: 16, left: 0, width: 4, height: "calc(100% - 32px)", background: note.tagColor, borderRadius: "0 2px 2px 0", opacity: 0.65 }} />

                {/* Date + tag */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.84rem", color: "var(--cherry-warm-mid)" }}>{note.date}</span>
                  <span style={{ background: note.tagBg, color: note.tagColor, borderRadius: 999, padding: "0.18rem 0.62rem", fontSize: "0.74rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    {note.icon} {note.tag}
                  </span>
                </div>

                <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "var(--cherry-warm-brown)", fontSize: "1rem", lineHeight: 1.4, marginBottom: "0.6rem" }}>
                  {note.title}
                </h3>

                <div className="note-card-illustration" style={{ background: note.tagBg, borderColor: note.tagColor }}>
                  <NoteCardIllustration slug={note.slug} color={note.tagColor} />
                </div>

                <p style={{ color: "var(--cherry-warm-mid)", fontSize: "0.84rem", lineHeight: 1.65, marginBottom: "1rem" }}>
                  {note.excerpt}
                </p>

                <div style={{ display: "grid", alignContent: "start", gap: 6, marginBottom: "1rem" }}>
                  {note.highlights.slice(0, 2).map((highlight) => (
                    <span key={highlight} style={{ display: "grid", gridTemplateColumns: "12px minmax(0, 1fr)", alignItems: "start", gap: 7, color: "var(--cherry-warm-brown)", fontSize: "0.76rem", fontWeight: 800, lineHeight: 1.48 }}>
                      <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: note.tagColor, marginTop: "0.38rem", opacity: 0.78 }} />
                      {highlight}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", alignSelf: "end", gap: "0.7rem", flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.78rem", color: "var(--cherry-warm-mid)" }}>
                    <IconCoffee size={16} /> 约 {note.readTime} 分钟
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: "var(--cherry-forest)", fontWeight: 700 }}>
                    阅读全文 <IconArrowRight size={13} color="var(--cherry-forest)" />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <style>
        {`
          #notes .note-card:hover,
          #notes .note-card:focus-visible {
            transform: translateY(-3px);
            box-shadow: 0 10px 22px rgba(94,68,42,0.09);
          }

          #notes .note-card:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          #notes .note-card-illustration {
            min-height: 82px;
            border: 1px solid;
            border-radius: 8px;
            margin: 0 0 0.9rem;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            box-shadow: inset 0 0 0 999px rgba(250,247,241,0.32);
          }

          #notes .note-card-illustration svg {
            width: min(100%, 150px);
            height: 86px;
            display: block;
          }

          @media (prefers-reduced-motion: reduce) {
            #notes .note-card {
              transition: none !important;
              transform: none !important;
            }
          }
        `}
      </style>
    </section>
  );
}
