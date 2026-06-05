import { useState } from "react";
import { IconDNA, IconMicroscope, IconFlask, IconResearch, IconArrowRight, IconLeafSmall, IconStar } from "./Icons";
import { copyText } from "../clipboard";
import { navigateClient, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";

export const essays = [
  {
    id: 1,
    slug: "science-to-learning-question",
    href: "/research/science-to-learning-question",
    icon: <IconDNA size={26} color1="var(--cherry-blue)" color2="var(--cherry-red)" />,
    date: "2026-06-01",
    label: "科研转化",
    labelColor: "var(--cherry-blue)",
    labelBg: "var(--cherry-blue-light)",
    title: "真实科研如何变成你能进入的问题",
    body: "前沿科研不适合被直接当成结论背诵。更有效的做法，是从已有经验出发，把复杂概念拆成可以观察、比较、推理和表达的小任务……",
    readMin: 9,
    tags: ["科学学习", "科研转译", "真实情境"],
    paragraphs: [
      "学习真实科研时，第一步不是删掉难词，而是重建问题。你需要从一个可以理解的现象开始，逐步看到背后的科学结构。问题如果太技术化，人会先被术语挡住；问题如果太生活化，又容易停在经验讨论。",
      "比较好的入口通常是一句可以观察、可以比较、可以追问的话。例如植物基因组研究可以从“为什么同一种环境里有些植物更耐旱”进入，而不是直接讲测序平台、组装算法和注释流程。",
      "进入问题之后，第二步是给自己一组有限证据。证据不需要完整复刻论文，但要足够真实：样本来自哪里，比较对象是谁，图表说明了什么，结论还有哪些条件限制。",
      "第三步是设计自己要完成的解释任务。不要只问“科学家发现了什么”，而要问“这张图支持什么、不支持什么？”“如果还要证明因果，需要补什么实验？”这样才会从记忆走向推理。",
      "转译的关键，是把研究对象、数据证据和解释任务拆成你能操作的层级。每一层都要保留一个清楚的目标：看见现象、读懂证据、形成解释、说出限制。",
      "如果读完之后能用自己的话说出“我根据什么证据得出这个解释，以及这个解释还不能说明什么”，这比记住几个前沿名词更接近科学学习。",
    ],
    highlights: ["从现象到问题", "从数据到证据", "从解释到表达"],
    actionSteps: ["先把科研主题改写成一个可观察问题", "挑选 1-2 张自己能读懂的证据材料", "为每张证据写一句它能回答的子问题", "设计一个判断题：证据支持什么、不支持什么", "用证据和限制各写一句解释", "最后写出还需要什么数据才能把解释推进一步"],
    checklist: ["问题能从已有经验进入", "证据材料数量有限且可读", "任务要求区分支持和不支持", "解释没有超出证据范围", "不确定性被写成下一步验证问题"],
    starterTemplate: ["科研主题：……", "进入问题：我可以观察/比较……", "证据材料：图表或数据说明……", "子问题：这份证据回答……", "解释任务：判断支持什么、不支持什么", "下一步验证：还需要……"],
    pitfalls: ["不要把前沿术语直接当成学习入口", "不要只复述发现而不判断证据", "不要省略结论的限制条件", "不要把一个图表能说明的范围扩大成完整结论", "不要把不确定性写成失败，它是科研解释的一部分"],
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
      "好的科研转化会保留数据的真实感，同时把证据关系整理到你能够跟上的程度。叙事不是美化研究，而是把复杂材料组织成可以被理解和质疑的路径。",
    ],
    highlights: ["技术流程要服务科学问题", "图表必须有证据关系", "叙事不是美化，而是组织理解"],
    actionSteps: ["先写出研究对象为什么值得讲", "把主问题拆成结构、功能和比较三个子问题", "把图表分成结构证据、功能证据和比较证据", "为每张图标注它回答的子问题", "删掉不能服务主问题的流程细节", "用一段话把证据顺序串成可复述的科学故事"],
    checklist: ["研究对象的独特性说清楚了", "每张图都对应一个子问题", "技术流程没有脱离主问题", "结构、功能和比较证据之间有连接句", "删减后的版本仍能说明数据可靠性"],
    starterTemplate: ["研究对象：它特别在……", "主问题：这些数据解释……", "证据分组：结构 / 功能 / 比较", "图表作用：这张图回答……", "连接句：这条证据让主问题更清楚，因为……", "删减原则：不回答主问题的流程先不讲"],
    pitfalls: ["不要把组装流程当成故事主线", "不要展示图表却不说明证据关系", "不要讲完技术细节却没有回到主问题", "不要把所有图表放在同等重要的位置", "不要为了简化而删掉数据质量边界"],
  },
  {
    id: 3,
    slug: "barcoding-evidence-chain",
    href: "/research/barcoding-evidence-chain",
    icon: <IconMicroscope size={26} color="var(--cherry-peach)" />,
    date: "2026-05-12",
    label: "学习项目",
    labelColor: "#7D2A18",
    labelBg: "var(--cherry-peach-light)",
    title: "Barcoding 项目里的证据链设计",
    body: "一个好的物种鉴定项目，不只是把实验做完。更重要的是让样本、记录、序列、比对结果和系统发育树共同构成一条可解释的证据链。",
    readMin: 10,
    tags: ["Barcoding", "PBL", "证据意识"],
    paragraphs: [
      "Barcoding 项目的价值不只是学习 DNA 提取和 BLAST。它真正训练的是如何让样本、实验记录、序列结果和分析结论互相支持。你需要看到，鉴定不是按钮结果，而是一条证据链。",
      "证据链的起点是样本。样本从哪里来，谁采集，是否有照片和位置记录，是否可能混样，都会影响后面的解释。没有样本记录，序列再漂亮也很难说明问题。",
      "第二段证据来自实验过程。DNA 提取是否成功，PCR 条带是否清楚，测序峰图质量如何，这些都不是技术细节，而是判断结果可信度的依据。你应该学会把实验记录写进解释里。",
      "第三段证据来自数据库比对和系统发育分析。BLAST 的相似度、覆盖度、候选物种差异，以及系统发育树上的位置，都需要一起看。单独一个最高匹配结果并不总是足够。",
      "如果只拿到一个“鉴定成功”的结果，却说不清样本是否可靠、序列质量如何、比对结果为什么可信，那么项目还没有完成。完成的标志应该是你能解释自己为什么相信这个鉴定，或者为什么还不能确定。",
      "因此这个项目需要把证据链显性化：每一步都留下记录，每个结论都能回到数据。这样的项目不只是做实验，也是在练习科学证据意识。",
    ],
    highlights: ["样本记录是证据链起点", "序列质量影响解释可信度", "系统发育树是表达，不是装饰"],
    actionSteps: ["先建立样本照片、地点和编号记录", "把 DNA、PCR、测序峰图和比对结果放在同一张表里", "同时查看相似度、覆盖度和候选物种差距", "说明每个结论对应哪条证据", "把不能确定的地方写成待验证问题", "用一段话解释自己为什么相信或暂不相信这个鉴定"],
    checklist: ["样本记录可回溯", "序列质量和比对结果一起判断", "相似度、覆盖度和候选差距都被记录", "鉴定结论能对应到具体证据", "不确定结果被保留为待验证问题"],
    starterTemplate: ["样本记录：编号、照片、地点、采集人", "实验记录：DNA / PCR / 测序质量", "比对证据：相似度、覆盖度、候选物种", "树图位置：样本和候选物种的关系", "结论边界：确定 / 可能 / 仍需验证", "下一步：补采样 / 换 marker / 复核数据库记录"],
    pitfalls: ["不要把 BLAST 最高匹配直接当最终答案", "不要忽略样本记录和测序质量", "不要把系统发育树当成装饰图", "不要只看相似度而忽略覆盖度和候选差距", "不要把数据库误注释风险排除在外"],
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
    title: "SciFusion 智能测评平台使用方法",
    body: "平台链接：https://scifusion.top。打开后先确定自测用途，再输入学习阶段、知识点、题型、难度和题量；生成后逐题审核题干、答案、干扰项和解析。",
    readMin: 8,
    tags: ["SciFusion", "智能测评", "使用指南"],
    platformUrl: "https://scifusion.top",
    paragraphs: [
      "平台链接：https://scifusion.top。这个页面的用法很直接：先把它当作自测题目生产台，再把自己当作最终审核人。平台负责快速生成题目，你负责判断这些题目能不能真的帮助自己查漏补缺。",
      "第一步先定用途。预习诊断只需要 3-5 道题，用来判断自己有没有进入新主题的基础；概念检查适合 1-2 道辨析题，用来发现刚学完的误解；复习巩固可以设置 6-10 道题，把概念、过程和证据串起来。",
      "第二步写清楚测评对象和目标。不要只写“生物必修二”或“基因表达”，而要写成自己能完成的动作，例如“我能区分转录产物和翻译产物”“我能判断密码子与氨基酸的对应关系”。目标越具体，生成结果越容易审核。",
      "第三步填写生成范围：学习阶段、知识点范围、题型、难度、题量和预计完成时间。第一次建议少量生成，先用 5-8 道题跑通流程。题量太大时，审核成本会变高，题目质量也更容易被忽略。",
      "第四步审核题干。每道题只问一个核心问题，条件要足够支撑答案。如果题目涉及图表、实验、案例或数据，要确认自己不需要靠猜测出题意图作答。题干不清楚时，宁可重写，不要直接使用。",
      "第五步审核答案和干扰项。正确答案必须唯一；干扰项要来自真实误解，而不是随便写一个明显错误的选项。例如基因表达主题里，可以把 RNA 聚合酶和 DNA 聚合酶混淆、把 mRNA 和蛋白质产物混淆作为干扰项。",
      "第六步审核解析。合格解析要说明为什么这个答案成立，也要说明其他选项为什么不成立，并指出对应知识点。解析如果只是重复答案，就还不能帮助你纠错。",
      "第七步作答和复盘。做完后不要只看分数，要看错题和错因。错同一类题时，先判断题目表达是否有歧义，再判断是不是自己没有把概念关系讲透。",
      "一个可直接套用的例子：主题写“基因表达”，学习阶段写“生物基础入门，已经学过 DNA 和 RNA 基础”，目标写“我能说明 DNA、mRNA、蛋白质之间的信息传递关系”，题型选选择题和简答题，题量 6 题，难度中等，完成时间 8 分钟。",
    ],
    highlights: ["平台链接：https://scifusion.top", "输入学习阶段、目标、知识点、题型、难度和题量", "生成后先审核，再作答和复盘"],
    actionSteps: ["打开 https://scifusion.top", "选择本次用途：预习诊断、概念检查或复习巩固", "填写学习阶段、学科、章节和当前基础", "写下一个可观察目标：我需要证明自己能做什么", "填写知识点、题型、难度、题量和预计完成时间", "生成题目后逐题审核题干、答案、干扰项和解析", "完成自测并标记错题原因", "记录高频错因，并据此修改学习卡或补充资料"],
    checklist: ["我已经打开平台入口：https://scifusion.top", "测评目标写成自己可完成的具体动作", "每道题只考一个核心问题，条件足够支撑答案", "正确答案唯一，干扰项对应真实误解", "解析说明了为什么对、为什么错、对应哪个知识点", "题量和完成时间符合自学节奏", "测后复盘了高频错因，而不是只看分数"],
    starterTemplate: ["平台入口：https://scifusion.top", "使用场景：预习诊断 / 概念检查 / 复习巩固", "学习阶段：当前基础、学科、章节、已学过什么", "测评目标：我需要证明自己能……", "知识点范围：本次只覆盖……", "题目设置：题型、难度、题量、预计完成时间", "生成要求：题干清楚，答案唯一，干扰项来自真实误解，解析说明原因", "人工审核：删掉跑题、歧义、超纲或解析空泛的题", "作答复盘：最高频错因是什么，下一步改学习卡还是补资料"],
    pitfalls: ["不要把平台当成自动出题后直接相信的黑箱", "不要只写章节名，要写清楚自己需要完成的动作", "不要只检查答案而忽略题干歧义和解析质量", "不要把所有错因都归为粗心", "不要一次生成太多题，先用小题量把流程跑顺"],
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
      aria-label={`打开科研证据：${essay.title}。先做这个，${essay.actionSteps[0]}。完成后检查，${essay.checklist[0]}`}
      onMouseEnter={() => preloadRouteForHref(essay.href)}
      onFocus={() => preloadRouteForHref(essay.href)}
      onPointerDown={() => preloadRouteForHref(essay.href)}
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
        gridTemplateRows: "auto auto auto auto auto auto",
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
          maxHeight: 66,
          transition: "max-height 0.35s ease",
        }}
      >
        <p style={{ color: "var(--cherry-warm-mid)", fontSize: "0.8rem", lineHeight: 1.58, margin: 0 }}>
          {essay.body}
        </p>
      </div>

      <div className="research-card-action-row" style={{ background: "var(--muted)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.58rem 0.65rem", marginTop: "0.82rem" }}>
        <span style={{ display: "block", color: "var(--cherry-red)", fontSize: "0.68rem", fontWeight: 900, marginBottom: "0.16rem" }}>先做这个</span>
        <span style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.78rem", lineHeight: 1.5, fontWeight: 800 }}>{essay.actionSteps[0]}</span>
      </div>

      <div className="research-card-quick-evidence" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "0.54rem", marginTop: "0.72rem" }}>
        <div className="research-card-completion" style={{ display: "grid", gap: "0.18rem", borderLeft: `3px solid ${essay.labelColor}`, paddingLeft: "0.58rem" }}>
          <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.66rem", fontWeight: 900 }}>完成后检查</span>
          <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.72rem", lineHeight: 1.42, fontWeight: 800 }}>{essay.checklist[0]}</span>
        </div>
        <div className="research-card-output" style={{ background: "rgba(250,247,241,0.72)", border: "1px solid rgba(94,68,42,0.14)", borderRadius: 8, padding: "0.46rem 0.55rem", display: "grid", gap: "0.16rem" }}>
          <span style={{ display: "block", color: "var(--cherry-forest)", fontSize: "0.66rem", fontWeight: 900 }}>读完产出</span>
          <span style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.72rem", lineHeight: 1.42, fontWeight: 800 }}>{essay.starterTemplate[0]}</span>
        </div>
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
            查看证据
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
  const [activeLabel, setActiveLabel] = useState("全部");
  const [copiedEvidenceChecklist, setCopiedEvidenceChecklist] = useState(false);
  const [evidenceChecklistStatus, setEvidenceChecklistStatus] = useState("");
  const researchLabels = ["全部", ...Array.from(new Set(essays.map((essay) => essay.label)))];
  const filteredEssays = activeLabel === "全部" ? essays : essays.filter((essay) => essay.label === activeLabel);
  const recommendedEssay = essays.find((essay) => essay.slug === "science-to-learning-question") ?? essays[0];
  const evidenceChecklistText = `【By Cherry 科研证据执行清单】
当前范围：${activeLabel === "全部" ? "全部科研证据" : activeLabel}
文章数量：${filteredEssays.length}

${filteredEssays.map((essay, index) => `${index + 1}. ${essay.title}
入口：${essay.href}
先做这个：${essay.actionSteps[0]}
完成后检查：${essay.checklist[0]}
证据模板：
${essay.starterTemplate.slice(0, 4).map((line) => `- ${line}`).join("\n")}
避坑提醒：${essay.pitfalls[0]}`).join("\n\n")}

使用方式
1. 先选 1 篇科研证据，不要一次执行全部。
2. 做完后复制文章页里的学习记录或行动包。
3. 回到这张清单，记录哪条证据链已经能解释清楚。`;

  async function copyEvidenceChecklist() {
    const copiedToClipboard = await copyText(evidenceChecklistText);
    if (copiedToClipboard) {
      setCopiedEvidenceChecklist(true);
      setEvidenceChecklistStatus("科研证据执行清单已复制到剪贴板。");
      window.setTimeout(() => setCopiedEvidenceChecklist(false), 1400);
      return;
    }
    setCopiedEvidenceChecklist(false);
    setEvidenceChecklistStatus("复制失败，请手动选中文本复制。");
  }

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
            文献、数据和证据边界
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <h2 id="research-heading" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "var(--cherry-warm-brown)", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", lineHeight: 1.3 }}>
            科研证据库
          </h2>
        </div>

        {/* Decorative horizontal rule */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "0.8rem" }}>
          <div style={{ flex: 1, height: 1.5, background: "var(--border)", borderRadius: 1 }} />
          <IconStar size={14} color="var(--cherry-yellow)" />
          <div style={{ flex: 1, height: 1.5, background: "var(--border)", borderRadius: 1 }} />
        </div>
      </div>

      <a
        className="research-recommended-start"
        href={recommendedEssay.href}
        aria-label={`推荐起点：${recommendedEssay.title}。先做这个，${recommendedEssay.actionSteps[0]}。完成后检查，${recommendedEssay.checklist[0]}`}
        onMouseEnter={() => preloadRouteForHref(recommendedEssay.href)}
        onFocus={() => preloadRouteForHref(recommendedEssay.href)}
        onPointerDown={() => preloadRouteForHref(recommendedEssay.href)}
        onClick={(event) => navigateTo(recommendedEssay.href, event)}
        style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "0.75rem", alignItems: "center", background: "var(--card)", border: "1.5px solid rgba(94,68,42,0.12)", borderLeft: `4px solid ${recommendedEssay.labelColor}`, borderRadius: 8, padding: "0.82rem 0.95rem", color: "inherit", textDecoration: "none", boxShadow: "0 8px 18px rgba(94,68,42,0.06)", marginBottom: "1rem" }}
      >
        <span style={{ display: "grid", gap: "0.24rem", minWidth: 0 }}>
          <span style={{ color: "var(--cherry-forest)", fontSize: "0.72rem", fontWeight: 900 }}>推荐起点</span>
          <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.88rem", lineHeight: 1.45, fontWeight: 900 }}>先读真实科研如何变成问题：练习从现象、证据和限制进入科研材料。</span>
        </span>
        <span style={{ background: "var(--cherry-forest)", color: "#FAF7F1", borderRadius: 999, padding: "0.32rem 0.68rem", fontSize: "0.74rem", fontWeight: 900, whiteSpace: "nowrap" }}>查看证据 →</span>
      </a>

      <div role="group" aria-label="按科研证据主题筛选" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "0.75rem" }}>
        {researchLabels.map((label) => (
          <button
            className="research-filter-button"
            key={label}
            type="button"
            onClick={() => {
              setActiveLabel(label);
              setCopiedEvidenceChecklist(false);
              setEvidenceChecklistStatus("");
            }}
            aria-pressed={activeLabel === label}
            style={{
              background: activeLabel === label ? "var(--cherry-forest)" : "var(--card)",
              color: activeLabel === label ? "#FAF7F1" : "var(--cherry-warm-mid)",
              border: activeLabel === label ? "1.5px solid var(--cherry-forest)" : "1.5px solid var(--border)",
              borderRadius: 999,
              padding: "0.42rem 0.9rem",
              cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: "0.78rem",
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div role="status" aria-live="polite" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", fontWeight: 800, marginBottom: "1.2rem" }}>
        当前显示 {filteredEssays.length} 篇{activeLabel === "全部" ? "科研证据" : activeLabel}
      </div>

      <div
        className="research-evidence-checklist-panel"
        style={{
          background: "var(--card)",
          border: "1.5px solid rgba(94,68,42,0.12)",
          borderRadius: 8,
          padding: "0.85rem 0.95rem",
          marginBottom: "1.15rem",
          boxShadow: "0 8px 18px rgba(94,68,42,0.05)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto",
          gap: "0.8rem",
          alignItems: "center",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontSize: "0.9rem", fontWeight: 900, marginBottom: "0.2rem" }}>
            科研证据执行清单
          </div>
          <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.55, fontWeight: 800 }}>
            当前范围包含 {filteredEssays.length} 篇科研证据。复制后会带出先做动作、完成检查、证据模板和避坑提醒。
          </div>
          <div
            id="research-evidence-checklist-status"
            role="status"
            aria-live="polite"
            style={{ minHeight: "1rem", color: "var(--cherry-forest)", fontSize: "0.74rem", fontWeight: 900, marginTop: "0.34rem" }}
          >
            {evidenceChecklistStatus}
          </div>
        </div>
        <button
          type="button"
          className="research-evidence-checklist-button"
          onClick={copyEvidenceChecklist}
          aria-describedby="research-evidence-checklist-status"
          style={{
            background: "var(--cherry-forest)",
            color: "#FAF7F1",
            border: "none",
            borderRadius: 999,
            padding: "0.46rem 0.82rem",
            fontWeight: 900,
            cursor: "pointer",
            fontSize: "0.8rem",
            whiteSpace: "nowrap",
          }}
        >
          {copiedEvidenceChecklist ? "已复制" : "复制清单"}
        </button>
      </div>

      {/* Two-column grid */}
      <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem", listStyle: "none", margin: 0, padding: 0 }}>
        {filteredEssays.map((essay) => (
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

          #research .research-recommended-start:focus-visible,
          #research .research-evidence-checklist-button:focus-visible,
          #research .research-filter-button:focus-visible {
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

          @media (max-width: 640px) {
            #research .research-evidence-checklist-panel {
              grid-template-columns: 1fr !important;
            }

            #research .research-evidence-checklist-button {
              width: 100%;
            }

            #research .research-card-quick-evidence {
              grid-template-columns: 1fr !important;
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
          科研证据和学习项目持续更新
        </span>
        <div style={{ width: 40, height: 1.5, background: "var(--border)" }} />
      </div>
    </section>
  );
}
