import { useState } from "react";
import { IconBook, IconAI, IconLeaf, IconResearch, IconArrowRight, IconCoffee } from "./Icons";
import { navigateClient, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";

export const notes = [
  {
    id: 1,
    slug: "ai-course-development",
    href: "/notes/ai-course-development",
    date: "2026-06-03",
    tag: "AI学习",
    tagColor: "var(--cherry-blue)",
    tagBg: "var(--cherry-blue-light)",
    icon: <IconResearch size={18} color="var(--cherry-blue)" />,
    title: "用 AI 做学习材料质检，而不是替你学习",
    excerpt: "AI 能帮你拆概念、列误解、生成练习和检查清单；真正要训练的是你自己判断证据、边界和理解漏洞的能力……",
    readTime: "10",
    paragraphs: [
      "AI 最适合帮你处理低风险的材料整理：拆概念、列先修知识、生成对比表、把同一内容改写成不同难度版本。这些工作能节省时间，但不能自动证明你已经理解。",
      "我会先让 AI 帮我列出学习目标、先修知识、可能误解和练习顺序，再把这些结果当成草稿来审。它提供的是可比较的备选方案，而不是最终答案。",
      "学习真正困难的地方不是拿到材料，而是判断材料是否符合学科逻辑、是否会造成误解，以及它是否真的解释了你卡住的问题。这个判断必须回到证据、例子和自己的输出。",
      "例如同一个“基因表达”主题，AI 可能很快生成转录、翻译、密码子、蛋白质合成等知识点清单，但你要判断自己到底卡在“信息如何被传递”还是“结构如何对应功能”。",
      "更可靠的做法，是先给 AI 一个很窄的任务：分别生成“我可能混淆的对象”“可观察证据”“自测问题”“错因解释”。这些结果分开生成，更容易看出哪一部分可靠，哪一部分需要重写。",
      "落到“基因表达”学习，可以这样使用：先让 AI 列出容易混淆的对象，如 DNA 聚合酶、RNA 聚合酶、核糖体、mRNA 和多肽链；再让它把每个误解改写成一道判断题；最后自己用图和文字解释每道题为什么对或错。",
      "如果 AI 给出的练习很多，我会用三个问题删减：这个练习能暴露一个具体误解吗？它是否只服务一个核心目标？完成后能不能留下可检查的答案？三个问题答不上来，就先删掉。",
      "因此我会把 AI 输出拆成三类：可以直接复习的表达，可以改写后使用的练习，以及必须回到教材或资料核查的判断。尤其涉及数据、实验和因果解释时，不要让模型直接定稿。",
      "所以我更愿意把 AI 放在“学习助理”和“材料整理器”的位置。它能帮你更快看见可能性，但最后的理解必须由你自己的解释、练习和复盘证明。",
    ],
    highlights: ["适合 AI 做：整理、变体、检查清单", "必须自己做：证据判断、错因定位、边界核查", "理解不是生成出来的，而是被输出证明的"],
    actionSteps: ["先写清楚这次学习最后要会解释什么", "让 AI 分别生成先修知识、常见误解、自测问题和即时小测", "把每个输出对应到一个可检查答案", "删掉超出资料边界或看不出目标的内容", "用错题和复述结果回头修改学习卡"],
    checklist: ["学习目标能用自己的动作表述", "每个练习都对应一个学习目标", "AI 输出经过资料边界和逻辑检查", "即时小测能暴露真实误解", "复盘记录说明哪里被改懂了"],
    starterTemplate: ["学习目标：我需要能够……", "当前基础：我已经会……，还容易混淆……", "AI 可协助：整理资料 / 生成变体 / 提供检查清单 / 改写小测", "我必须判断：证据、误解风险、内容边界、练习是否有效", "理解证据：我能完成……来证明自己懂了", "复盘证据：错题 / 复述 / 输出修改记录"],
    pitfalls: ["不要把 AI 生成的练习清单直接当学习计划", "不要用看起来丰富的材料掩盖目标不清", "不要让模型替你决定自己是否理解", "不要一次让 AI 生成完整答案，先拆成小任务更容易审核"],
  },
  {
    id: 2,
    slug: "plant-genome-evidence-chain",
    href: "/notes/plant-genome-evidence-chain",
    date: "2026-05-28",
    tag: "科研转化",
    tagColor: "#4A2D80",
    tagBg: "#EDE9F5",
    icon: <IconAI size={18} color="#4A2D80" />,
    title: "从植物基因组读懂一条证据链",
    excerpt: "读前沿科研的难点不只是降难度，而是找到能进入的问题、证据和解释限制，让基因组材料变成可理解的推理过程……",
    readTime: "11",
    paragraphs: [
      "读植物基因组研究，不是把论文摘要翻译成更简单的话。你需要先找到一个能进入的问题，比如“为什么不同植物会有不同适应能力？”或者“同一种性状背后可能有哪些基因线索？”",
      "真实研究里有测序、组装、注释、比较基因组和功能推断，但自学时不需要完整复刻流程。更可行的做法，是选取一小段证据链，看见数据如何支持解释。",
      "学习这类材料时，要把真实数据转化成证据关系：基因组图谱、性状差异、样本来源、比对结果和研究结论之间需要有清楚的链条。否则你只会记住“科学家发现了某个基因”，却不知道发现如何发生。",
      "我会把材料分成三层：第一层是现象，例如耐旱、开花时间或果实形态；第二层是证据，例如基因家族扩张、表达差异或序列变异；第三层是解释限制，例如这些数据只能提示关联，不能自动证明因果。",
      "可以把耐旱性状做成一张证据卡：左侧放两种植物在干旱处理前后的生长状态，右侧放一个简化表达图，显示某个胁迫响应基因在干旱条件下表达升高。你的任务不是记住基因名，而是判断这张图支持什么解释。",
      "适合练习的问题是：“这份证据能不能说明这个基因直接导致耐旱？”很多人会先回答能，但表达升高只能说明它可能参与响应，还需要敲除、过表达或更多样本来验证因果。",
      "如果材料来自论文，我会先删掉大部分方法细节，只保留四类信息：研究对象是谁，比较条件是什么，数据有什么变化，作者的结论有没有限制。这样前沿材料才不会变成术语堆叠。",
      "这样的学习不一定要求你掌握所有技术名词，但要练习一种科研思维：看见问题，找到证据，判断证据的强弱，再说出还有哪些不确定。",
      "前沿科研的价值不只在知识更新，也在让你体验科学如何提出问题、组织证据、接受不确定性，并逐步形成解释。把不确定性保留下来，反而会让学习更接近真实科学。",
    ],
    highlights: ["从生活问题进入", "用真实数据做证据", "保留科研中的不确定性"],
    actionSteps: ["先选一个能观察到的植物性状或环境问题", "只截取一段能说明问题的真实数据或图表", "把材料改写成现象、证据、解释、限制四格", "判断这份证据支持什么、不支持什么", "最后用一句话写出这个证据还缺什么验证"],
    checklist: ["入口问题不是纯术语", "证据材料能被读懂", "任务要求区分相关和因果", "结论和不确定性都被明确写出", "不要求自己复述完整论文流程"],
    starterTemplate: ["进入问题：为什么……会出现差异？", "研究对象：比较的是……和……", "现象材料：我能观察到……", "证据材料：图表/数据说明……", "可以支持的解释：这些证据提示……", "解释限制：这些证据还不能证明……", "下一步验证：还需要……"],
    pitfalls: ["不要从测序技术名词开始讲", "不要把相关性材料讲成因果证明", "不要一次塞进完整论文流程", "不要只讲科学家发现了什么，要判断证据支持到哪一步"],
  },
  {
    id: 3,
    slug: "pbl-rubric-evidence",
    href: "/notes/pbl-rubric-evidence",
    date: "2026-05-18",
    tag: "学习项目",
    tagColor: "var(--cherry-forest)",
    tagBg: "var(--cherry-sage-light)",
    icon: <IconBook size={18} color="var(--cherry-forest)" />,
    title: "项目制学习中的任务、量规和作品证据",
    excerpt: "一个项目不是把活动串起来，而是把真实问题、学习目标、任务流程、评价量规和个人作品放在同一条线上……",
    readTime: "9",
    paragraphs: [
      "项目制学习最容易变成“活动很多，但学习不清楚”。我会先问：最终要产出什么作品？这个作品能证明自己学到了什么？如果作品不能承载证据，项目就容易变成热闹但空泛的活动。",
      "一个好的项目作品不一定复杂，但必须能看出理解。例如调查报告、模型图、实验方案、科学短片或展板，都应该能回答：用了哪些资料，怎样组织证据，结论是否合理。",
      "任务流程需要和评价量规一起设计。没有量规，你不知道什么算好；没有作品证据，也很难判断自己是否真正理解。量规不应只在最后评分时出现，而应在任务开始前就变成导航。",
      "我会把量规写成可观察的表现：是否提出清楚问题，是否引用可靠证据，是否解释证据与结论的关系，是否说明局限，是否根据反馈修改作品。这样你知道自己要改什么。",
      "项目过程中的每一步都应该留下中间证据：问题草稿、资料卡、实验记录、同伴反馈和修订痕迹。这些过程材料能帮助你回看自己的思维变化，而不是只盯着最后成品。",
      "一个完整项目应该能从驱动问题走向任务分解、资料收集、证据组织、作品表达和复盘修改。复盘不是收尾，而是让你意识到作品如何变得更可靠。",
      "如果你不知道从哪里开始，可以先做一张项目证据表：左列写任务节点，中列写要留下的材料，右列写它能证明什么。只要右列写不出来，这个节点就还没有真正服务学习目标。",
      "量规也不必写得很复杂。最小版本可以只有四格：问题是否清楚，证据是否可靠，解释是否连得上，修改是否留下痕迹。先用这四格跑通，再逐步增加表达、合作或技术指标。",
    ],
    highlights: ["作品必须能承载证据", "量规要在任务开始前出现", "复盘不是收尾，而是学习的一部分"],
    actionSteps: ["先确定最终作品和它要证明的学习目标", "把量规拆成问题、证据、解释、表达和修改五项", "为每个任务节点写出要留下的过程证据", "先用小样本试做一页作品，检查量规是否能判断质量", "用复盘记录说明作品哪里被修改得更可靠", "把最终作品和过程证据一起保存，形成可回看的学习档案"],
    checklist: ["最终作品能证明学习目标", "量规在项目开始前已经给出", "过程证据和复盘修改能被追踪", "每个任务节点都有明确的证据产物", "复盘能指出一次具体修改如何提高可靠性"],
    starterTemplate: ["驱动问题：我要解决……", "最终作品：我提交……", "学习目标：这个作品要证明我能……", "评价量规：问题 / 证据 / 解释 / 表达 / 修改", "过程证据：草稿、资料卡、反馈、修订记录", "复盘记录：我根据……把……改成……"],
    pitfalls: ["不要把活动数量当成项目质量", "不要等到最后才公布评价量规", "不要只看最终作品而忽略过程证据", "不要把量规写成抽象形容词，要写成可观察表现", "不要只保存成品，过程材料同样是理解证据"],
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
      "这个过程很像学习项目：不是一次生成成品，而是建立一套可以复用、检查和迭代的生产系统。真正有价值的是流程稳定，而不是某一次生成运气好。",
      "我会把每一次生成都当作一个可复盘实验。提示词、参考图、参数、输出结果和失败原因都要记录，下一次才能知道是角色设定不稳、镜头描述不清，还是模型本身不适合这个任务。",
      "最小可运行版本不需要一开始就做长片。先做 20-30 秒片段，锁定一个角色、一个场景、三到五个镜头，再检查画面连续、声音节奏、字幕可读和情绪是否一致。",
    ],
    highlights: ["单点生成不等于工作流", "资产锁定比灵感更重要", "坏案例记录是质量控制的核心"],
    actionSteps: ["先把脚本拆成场景表和镜头目的", "锁定角色设定、场景设定和禁用特征", "先做 20-30 秒最小片段验证流程", "每一步保存输入、输出和失败原因", "把坏案例整理成下次生成的限制条件", "剪辑时优先检查节奏、连续性、声音稳定和字幕可读性"],
    checklist: ["角色和场景资产有固定设定", "每个生成步骤都有输入输出记录", "最小片段已经验证连续性和节奏", "成片检查了声音、字幕、转场和情绪递进", "失败案例被记录为可复用的约束"],
    starterTemplate: ["场景目标：这一镜头要表现……", "角色锁定：外观、服装、表情、禁用特征", "镜头表：景别、动作、对白、情绪、时长", "生成记录：输入、输出、问题、修正方式", "坏案例：失败原因、下次限制、是否保留参考", "成片检查：节奏、连续性、声音、字幕"],
    pitfalls: ["不要先追求单张图惊艳再补流程", "不要频繁改角色设定", "不要把失败结果删掉而不记录原因", "不要一次做太长内容，先用短片段验证流程", "不要只看画面质量，还要检查声音和剪辑节奏"],
  },
];

function navigateTo(href: string, event?: React.MouseEvent<HTMLAnchorElement>) {
  if (event && !shouldUseClientNavigation(event)) return;
  event?.preventDefault();
  navigateClient(href);
}

function NoteCardIllustration({ slug, color }: { slug: string; color: string }) {
  if (slug === "plant-genome-evidence-chain") {
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
  const [activeTag, setActiveTag] = useState("全部");
  const noteTags = ["全部", ...Array.from(new Set(notes.map((note) => note.tag)))];
  const filteredNotes = activeTag === "全部" ? notes : notes.filter((note) => note.tag === activeTag);
  const recommendedNote = notes.find((note) => note.slug === "ai-course-development") ?? notes[0];

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
              <span style={{ fontSize: "1rem", color: "var(--cherry-warm-mid)", fontWeight: 600 }}>可复用的学习流程</span>
            </div>
            <h2 id="notes-heading" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "var(--cherry-warm-brown)", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", lineHeight: 1.3 }}>
              学习方法库
            </h2>
          </div>
        </div>

        <a
          className="note-recommended-start"
          href={recommendedNote.href}
          aria-label={`推荐起点：${recommendedNote.title}`}
          onMouseEnter={() => preloadRouteForHref(recommendedNote.href)}
          onFocus={() => preloadRouteForHref(recommendedNote.href)}
          onPointerDown={() => preloadRouteForHref(recommendedNote.href)}
          onClick={(event) => navigateTo(recommendedNote.href, event)}
          style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "0.75rem", alignItems: "center", background: "var(--card)", border: "1.5px solid rgba(94,68,42,0.12)", borderLeft: `4px solid ${recommendedNote.tagColor}`, borderRadius: 8, padding: "0.82rem 0.95rem", color: "inherit", textDecoration: "none", boxShadow: "0 8px 18px rgba(94,68,42,0.06)", marginBottom: "1rem" }}
        >
          <span style={{ display: "grid", gap: "0.24rem", minWidth: 0 }}>
            <span style={{ color: "var(--cherry-forest)", fontSize: "0.72rem", fontWeight: 900 }}>推荐起点</span>
            <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.88rem", lineHeight: 1.45, fontWeight: 900 }}>先读 AI 学习材料质检：学会把 AI 输出拆成目标、误解、证据和复盘。</span>
          </span>
          <span style={{ background: "var(--cherry-forest)", color: "#FAF7F1", borderRadius: 999, padding: "0.32rem 0.68rem", fontSize: "0.74rem", fontWeight: 900, whiteSpace: "nowrap" }}>打开方法 →</span>
        </a>

        <div role="group" aria-label="按学习方法主题筛选" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "0.75rem" }}>
          {noteTags.map((tag) => (
            <button
              className="note-filter-button"
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              aria-pressed={activeTag === tag}
              style={{
                background: activeTag === tag ? "var(--cherry-forest)" : "var(--card)",
                color: activeTag === tag ? "#FAF7F1" : "var(--cherry-warm-mid)",
                border: activeTag === tag ? "1.5px solid var(--cherry-forest)" : "1.5px solid var(--border)",
                borderRadius: 999,
                padding: "0.42rem 0.9rem",
                cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 800,
                fontSize: "0.78rem",
              }}
            >
              {tag}
            </button>
          ))}
        </div>
        <div role="status" aria-live="polite" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", fontWeight: 800, marginBottom: "1.2rem" }}>
          当前显示 {filteredNotes.length} 篇{activeTag === "全部" ? "学习方法" : activeTag}
        </div>

        {/* Notes grid */}
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem", listStyle: "none", margin: 0, padding: 0 }}>
          {filteredNotes.map((note) => (
            <li key={note.id} style={{ display: "grid" }}>
              <a
                className="note-card"
                href={note.href}
                aria-label={`打开学习方法：${note.title}`}
                onClick={(event) => navigateTo(note.href, event)}
                onMouseEnter={() => preloadRouteForHref(note.href)}
                onFocus={() => preloadRouteForHref(note.href)}
                onPointerDown={() => preloadRouteForHref(note.href)}
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

                <div style={{ background: "var(--muted)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.58rem 0.65rem", marginBottom: "1rem" }}>
                  <span style={{ display: "block", color: "var(--cherry-red)", fontSize: "0.68rem", fontWeight: 900, marginBottom: "0.16rem" }}>先做这个</span>
                  <span style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.78rem", lineHeight: 1.5, fontWeight: 800 }}>{note.actionSteps[0]}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", alignSelf: "end", gap: "0.7rem", flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.78rem", color: "var(--cherry-warm-mid)" }}>
                    <IconCoffee size={16} /> 约 {note.readTime} 分钟
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: "var(--cherry-forest)", fontWeight: 700 }}>
                    打开方法 <IconArrowRight size={13} color="var(--cherry-forest)" />
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

          #notes .note-recommended-start:focus-visible,
          #notes .note-filter-button:focus-visible {
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
