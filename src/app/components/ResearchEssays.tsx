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
    readMin: 9,
    tags: ["科学教育", "课程转化", "真实情境"],
    paragraphs: [
      "真实科研进入课堂时，第一步不是删掉难词，而是重建问题。学生需要从一个可以理解的现象开始，逐步看到背后的科学结构。问题如果太技术化，学生会先被术语挡住；问题如果太生活化，又容易停在经验讨论。",
      "比较好的入口通常是一句可以观察、可以比较、可以追问的话。例如植物基因组研究可以从“为什么同一种环境里有些植物更耐旱”进入，而不是直接讲测序平台、组装算法和注释流程。",
      "进入问题之后，第二步是给学生一组有限证据。证据不需要完整复刻论文，但要足够真实：样本来自哪里，比较对象是谁，图表说明了什么，结论还有哪些条件限制。",
      "第三步是设计学生要完成的解释任务。不要只问“科学家发现了什么”，而要问“这张图支持什么、不支持什么？”“如果还要证明因果，需要补什么实验？”这样学生才会从记忆走向推理。",
      "课程化的关键，是把研究对象、数据证据和解释任务拆成学生能操作的层级。每一层都要保留一个清楚的目标：看见现象、读懂证据、形成解释、说出限制。",
      "如果一节课结束后，学生能用自己的话说出“我根据什么证据得出这个解释，以及这个解释还不能说明什么”，这比记住几个前沿名词更接近科学学习。",
    ],
    highlights: ["从现象到问题", "从数据到证据", "从解释到表达"],
    actionSteps: ["先把科研主题改写成一个可观察问题", "挑选 1-2 张学生能读懂的证据材料", "设计一个判断题：证据支持什么、不支持什么", "让学生用证据和限制各写一句解释"],
    checklist: ["问题能从学生经验进入", "证据材料数量有限且可读", "学生任务要求区分支持和不支持"],
    starterTemplate: ["科研主题：……", "课堂问题：学生可以观察/比较……", "证据材料：图表或数据说明……", "学生任务：判断支持什么、不支持什么"],
    pitfalls: ["不要把前沿术语直接搬进课堂", "不要让学生只复述发现而不判断证据", "不要省略结论的限制条件"],
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
    readMin: 10,
    tags: ["基因组", "多组学", "科学叙事"],
    paragraphs: [
      "基因组组装常被看成技术流程，但一个可讲述的科研故事需要回答：为什么是这个物种？为什么这些基因值得看？为什么这些变化重要？如果这些问题没有回答，图表再多也只是流程展示。",
      "一个更清楚的起点，是先确定研究对象的独特性。它可能有特殊性状、特殊生态位、重要经济价值，或者代表某个演化分支。这个起点决定后面哪些数据值得被放大。",
      "从原始 reads 到染色体级组装，再到注释和比较分析，每一步都应该服务同一个科学问题，而不是堆叠图表。组装质量说明数据是否可靠，注释说明有哪些功能线索，比较分析说明这些线索是否有差异。",
      "讲述时可以把证据拆成三类：结构证据，例如染色体数、基因数量和重复序列；功能证据，例如基因家族和表达模式；比较证据，例如与近缘物种的差异。这三类证据合在一起，才可能支撑一个科学解释。",
      "常见误区是把每张图都讲一遍，却没有解释图和图之间的关系。更好的做法是每出现一张图，就问它回答了哪个子问题，它让主问题更清楚了，还是只是提供背景信息。",
      "好的科研转化会保留数据的真实感，同时把证据关系整理到学习者能够跟上的程度。叙事不是美化研究，而是把复杂材料组织成可以被理解和质疑的路径。",
    ],
    highlights: ["技术流程要服务科学问题", "图表必须有证据关系", "叙事不是美化，而是组织理解"],
    actionSteps: ["先写出研究对象为什么值得讲", "把图表分成结构证据、功能证据和比较证据", "为每张图标注它回答的子问题", "删掉不能服务主问题的流程细节"],
    checklist: ["研究对象的独特性说清楚了", "每张图都对应一个子问题", "技术流程没有脱离主问题"],
    starterTemplate: ["研究对象：它特别在……", "主问题：这些数据解释……", "证据分组：结构 / 功能 / 比较", "删减原则：不回答主问题的流程先不讲"],
    pitfalls: ["不要把组装流程当成故事主线", "不要展示图表却不说明证据关系", "不要讲完技术细节却没有回到主问题"],
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
    readMin: 10,
    tags: ["Barcoding", "PBL", "证据意识"],
    paragraphs: [
      "Barcoding 课程的价值不只是学习 DNA 提取和 BLAST。它真正训练的是学生如何让样本、实验记录、序列结果和分析结论互相支持。学生需要看到，鉴定不是按钮结果，而是一条证据链。",
      "证据链的起点是样本。样本从哪里来，谁采集，是否有照片和位置记录，是否可能混样，都会影响后面的解释。没有样本记录，序列再漂亮也很难说明问题。",
      "第二段证据来自实验过程。DNA 提取是否成功，PCR 条带是否清楚，测序峰图质量如何，这些都不是技术细节，而是判断结果可信度的依据。学生应该学会把实验记录写进解释里。",
      "第三段证据来自数据库比对和系统发育分析。BLAST 的相似度、覆盖度、候选物种差异，以及系统发育树上的位置，都需要一起看。单独一个最高匹配结果并不总是足够。",
      "如果学生只拿到一个“鉴定成功”的结果，却说不清样本是否可靠、序列质量如何、比对结果为什么可信，那么项目还没有完成。完成的标志应该是学生能解释自己为什么相信这个鉴定，或者为什么还不能确定。",
      "因此课程需要把证据链显性化：每一步都留下记录，每个结论都能回到数据。这样的项目不只是做实验，也是在练习科学证据意识。",
    ],
    highlights: ["样本记录是证据链起点", "序列质量影响解释可信度", "系统发育树是表达，不是装饰"],
    actionSteps: ["先建立样本照片、地点和编号记录", "把实验记录、测序质量和比对结果放在同一张表里", "要求学生说明每个结论对应哪条证据", "把不能确定的地方写成待验证问题"],
    checklist: ["样本记录可回溯", "序列质量和比对结果一起判断", "鉴定结论能对应到具体证据"],
    starterTemplate: ["样本记录：编号、照片、地点、采集人", "实验记录：DNA / PCR / 测序质量", "比对证据：相似度、覆盖度、候选物种", "结论边界：确定 / 可能 / 仍需验证"],
    pitfalls: ["不要把 BLAST 最高匹配直接当最终答案", "不要忽略样本记录和测序质量", "不要把系统发育树当成装饰图"],
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
    title: "SciFuion 智能测评平台使用方法",
    body: "平台入口是 scifuion.top。打开平台后，先按教学目标设定测评范围，再生成题目、人工审核解析，最后用学生错因回头调整教学和题目。",
    readMin: 10,
    tags: ["SciFuion", "智能测评", "使用指南"],
    platformUrl: "https://scifuion.top",
    paragraphs: [
      "平台入口是 https://scifuion.top。打开后先不要急着生成整套试卷，先确定这次测评要解决什么问题：课前想诊断基础概念，课中想检查误解，还是课后想做复习巩固。场景不同，题型、难度和题量都不一样。",
      "第一步是填写测评目标。建议写成“学生需要证明自己能做什么”，例如“能区分转录和翻译的场所、产物和作用”，而不是只写“基因表达”。目标越具体，平台生成的题目越容易被你审核。",
      "第二步是设定生成范围。把知识点、适用对象、题型、难度、题量写清楚：知识点控制内容边界，适用对象控制语言难度，题型决定课堂使用方式，题量决定学生完成时间。",
      "第三步是生成后逐题审核。先看题干是否清楚，是否有歧义，是否超出课程范围；再看选项或答案是否合理，干扰项最好对应真实误解，而不是一眼就能排除的错误说法。",
      "第四步是审核解析。合格的解析不能只重复答案，它应该说明正确答案为什么成立，错误选项为什么不成立，并指出题目对应的知识点。解析写得好，学生才知道自己错在哪里。",
      "第五步是把题目放进课堂流程。课前可以用 3-5 道基础诊断题；课中可以用 1-2 道概念辨析题；课后可以用综合解释题。不要把同一组题直接套到所有场景。",
      "最后一步是看学生错因。若很多学生错在同一处，要判断是题目表达不清、干扰项设计太绕，还是教学中这个概念没有讲透。平台生成的是初稿，真正有价值的是用测评结果反向改题、改讲解、改活动。",
    ],
    highlights: ["入口：scifuion.top", "先设定测评场景和目标", "用学生错因反向修改题目和教学"],
    actionSteps: ["打开 https://scifuion.top", "选择本次测评场景：课前诊断、课中检查或课后复习", "填写知识点、适用对象、题型、难度和题量", "生成后逐题检查题干、答案、解析和干扰项", "根据学生错因修改题目或回头补讲概念"],
    checklist: ["平台入口已经给到学生或教师", "测评目标能说明学生需要证明什么", "题干、答案、解析和干扰项都经过人工检查", "学生错因被用于修改题目或教学"],
    starterTemplate: ["平台入口：https://scifuion.top", "测评场景：课前诊断 / 课中检查 / 课后复习", "测评目标：学生需要证明自己能……", "生成设置：知识点、适用对象、题型、难度、题量", "人工审核：题干、答案、解析、干扰项", "反馈迭代：学生错因对应到题目修改或补讲"],
    pitfalls: ["不要不设目标就直接生成整套题", "不要只看答案正确而忽略解析质量", "不要把学生错因当成单纯粗心"],
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
