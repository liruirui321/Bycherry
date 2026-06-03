import { useState } from "react";
import { IconMicroscope, IconNotebook, IconAI, IconLeaf, IconFlask, IconDNA } from "./Icons";

type Category = "全部" | "科学" | "课程" | "AI工具";

export const works = [
  {
    id: 1, slug: "gene-expression", category: "科学" as Category,
    icon: <IconMicroscope size={36} color="var(--cherry-blue)" />,
    title: "基因表达可视化",
    desc: "把 DNA -> mRNA -> 蛋白质的过程做成一页可拖动的小动画，适合高中生预习和课堂演示。",
    outcome: "包含：细胞画布、分子控制、蛋白产量读数、即时小测",
    status: "互动学习页",
    href: "/works/gene-expression",
    tags: ["生物", "可视化", "交互"],
    audience: "高中生、生物教师、科学课程开发者",
    deliverables: ["细胞画布：DNA、RNA 聚合酶、mRNA、核糖体、蛋白质产物", "控制台：转录因子、RNA 聚合酶、核糖体三个变量", "产量读数：根据变量实时估算蛋白质数量", "即时小测：检查转录、翻译和密码子的理解"],
    roadmap: ["课堂导入：先把转录因子调低，观察蛋白产量下降", "概念讲解：打开 RNA 聚合酶，观察 mRNA 生成", "巩固练习：增加核糖体，讨论为什么翻译效率提高", "形成评价：完成右侧即时小测"],
    why: "很多学生能背出“转录”和“翻译”，但没有真正看见信息如何一步步从核酸序列变成氨基酸链。这个小工具把抽象流程压缩成一页可操作的动态模型。",
    contentBlocks: [
      { title: "核心学习问题", body: "DNA 为什么不直接变成蛋白质？mRNA 在中间承担什么角色？密码子如何对应氨基酸？" },
      { title: "第一版交互", body: "用固定序列 ATG GAA TTT CCG 演示转录和翻译，学生拖动步骤即可看到 DNA、mRNA、核糖体和蛋白质链的变化。" },
      { title: "课堂使用", body: "适合放在新课导入或课后复习，教师可以边拖动边讲解，也可以让学生完成右侧即时小测。" },
    ],
    color: "var(--cherry-blue-light)", border: "var(--cherry-blue)", rotate: "-1.5deg",
  },
  {
    id: 2, slug: "cell-biology-course", category: "课程" as Category,
    icon: <IconNotebook size={36} color="var(--cherry-yellow)" />,
    title: "细胞生物学入门课",
    desc: "用插画、类比和微型测验重做 8 讲细胞生物学入门内容，降低术语门槛但保留科学准确性。",
    outcome: "包含：8 讲课程路径、每讲目标、核心类比和自测题",
    status: "完整课程页",
    href: "/works/cell-biology-course",
    tags: ["课程设计", "细胞生物", "自学"],
    audience: "高中生、大学新生、想补生物基础的学习者",
    deliverables: ["第 1 讲：细胞像一座会自我维护的微型城市", "第 2 讲：细胞膜如何决定什么能进出", "第 3 讲：细胞核如何保存和调用遗传信息", "第 4 讲：线粒体为什么不只是“发电厂”", "第 5 讲：内质网和高尔基体如何加工与运输", "第 6 讲：细胞骨架如何支撑、移动和组织内部空间", "第 7 讲：细胞分裂如何复制一个相似的自己", "第 8 讲：细胞如何和外界交换信号"],
    roadmap: ["学习顺序：先建立整体图景，再进入细胞器细节", "课堂活动：每讲用一张系统图解释细胞内部协作", "自学方法：看完讲解后先画关系图，再做自测题", "复习方式：用“功能-结构-证据”三列笔记整理概念"],
    why: "细胞生物学入门常常被术语淹没：细胞器、膜系统、能量代谢、信号调控都很重要，但初学者需要先建立“细胞是一个运转系统”的整体图景。",
    contentBlocks: [
      { title: "8 讲草案", body: "细胞是什么、细胞膜、细胞核、线粒体、内膜系统、细胞骨架、细胞分裂、细胞如何协作。" },
      { title: "视觉形式", body: "每讲用一张可爱的工作台式插画承载核心模型，再配一张术语卡和一组小测题。" },
      { title: "学习路径", body: "不追求一次讲完全部细节，而是先让学习者能解释细胞内部各部分如何分工协作。" },
    ],
    color: "var(--cherry-yellow-light)", border: "var(--cherry-yellow)", rotate: "1.2deg",
  },
  {
    id: 3, slug: "research-prompt-kit", category: "AI工具" as Category,
    icon: <IconAI size={36} color="var(--cherry-blue)" />,
    title: "科研助手 Prompt Kit",
    desc: "为生命科学研究者整理一套可复用 prompt，用于文献拆解、实验设计、图表解读和论文写作检查。",
    outcome: "包含：可复制 prompt、使用场景、输入格式和质量检查点",
    status: "可复制工具包",
    href: "/works/research-prompt-kit",
    tags: ["AI", "Prompt", "科研"],
    audience: "生命科学研究生、科研助理、文献阅读初学者",
    deliverables: ["文献精读 prompt：提取研究问题、方法、证据和局限", "实验设计 prompt：检查对照组、重复数、变量和风险", "图表解读 prompt：把图注、坐标、趋势和结论拆开", "论文修改 prompt：检查逻辑跳跃、术语不一致和证据不足"],
    roadmap: ["使用前：先提供论文摘要、图表或实验草案", "使用中：要求 AI 标出“不确定”和“需要人工判断”的地方", "使用后：用检查清单逐条核对，不直接接受输出", "适用边界：不用于编造引用、替代实验判断或生成未经核实的数据"],
    why: "科研场景里真正有用的 prompt 不是万能句子，而是把任务边界、材料输入、判断标准和输出格式说清楚的工作模板。",
    contentBlocks: [
      { title: "Prompt 分类", body: "文献精读、方法复现、实验设计、结果解释、图表检查、论文修改、审稿意见回应。" },
      { title: "示例结构", body: "每条 prompt 都包含使用场景、输入材料、模型任务、输出格式、质量检查点和常见误用。" },
      { title: "质量原则", body: "不让 AI 替代科学判断，而是让它帮助整理证据、暴露漏洞、生成可检查的初稿。" },
    ],
    color: "var(--cherry-peach-light)", border: "var(--cherry-peach)", rotate: "-0.8deg",
  },
  {
    id: 4, slug: "plant-evolution-stories", category: "课程" as Category,
    icon: <IconLeaf size={36} color="var(--cherry-sage)" />,
    title: "植物进化小故事",
    desc: "用绘本式插画讲述植物从水生到陆生、从孢子到种子的演化线索，适合初中生和科普阅读。",
    outcome: "包含：6 个故事章节、演化时间轴、关键词解释",
    status: "科普故事页",
    href: "/works/plant-evolution-stories",
    tags: ["植物学", "科普", "插画"],
    audience: "初中生、科普读者、自然教育课程参与者",
    deliverables: ["第一章：从水里来的祖先", "第二章：苔藓如何在陆地边缘站稳", "第三章：蕨类为什么需要潮湿环境", "第四章：种子如何改变繁殖方式", "第五章：花和果实如何借助动物传播", "第六章：今天的植物仍在适应环境"],
    roadmap: ["阅读方式：按时间轴从早到晚阅读", "观察任务：每章对应一种身边植物观察", "讨论问题：每章用一个“植物解决了什么难题”收束", "课堂产出：学生完成一张植物演化小档案"],
    why: "植物演化不应该只是一串年代和类群名。它可以被讲成一组“植物如何解决生存难题”的故事：保水、支撑、繁殖、运输和适应环境。",
    contentBlocks: [
      { title: "章节设计", body: "从藻类到苔藓、蕨类、裸子植物、被子植物，再回到今天身边可见的植物。" },
      { title: "故事钩子", body: "每章用一个问题开场：没有根怎么活？没有种子怎么繁殖？为什么花改变了植物世界？" },
      { title: "配套素材", body: "时间轴、植物小档案、术语解释、观察任务和适合自然教育课堂的讨论问题。" },
    ],
    color: "var(--cherry-sage-light)", border: "var(--cherry-sage)", rotate: "1.8deg",
  },
  {
    id: 5, slug: "concept-explainer", category: "AI工具" as Category,
    icon: <IconAI size={36} color="#7B6CC4" />,
    title: "概念解释生成器",
    desc: "输入一个生物学概念，生成小学、高中、研究生三个版本的解释，并附带类比、误区和检查题。",
    outcome: "包含：三档解释卡、类比、常见误区和检查题",
    status: "概念学习工具",
    href: "/works/concept-explainer",
    tags: ["AI", "教育", "工具"],
    audience: "教师、学习者、课程内容创作者",
    deliverables: ["小学版：用生活类比解释概念", "高中版：对齐教材术语和因果关系", "研究生版：加入机制、边界和研究语境", "检查题：用一个问题确认是否真正理解"],
    roadmap: ["输入概念：例如转录、端粒、生态位、细胞凋亡", "选择对象：小学、高中或研究生", "检查输出：确认类比没有牺牲科学准确性", "课堂使用：把三档解释用于分层教学"],
    why: "同一个科学概念面对不同学习者时，需要不同粒度的解释。好的解释不只是变短或变简单，而是改变类比、证据和术语密度。",
    contentBlocks: [
      { title: "输入与输出", body: "输入一个概念，例如“转录”“端粒”“生态位”，输出小学、高中、研究生三个版本。" },
      { title: "解释维度", body: "每个版本包含一句话定义、生活类比、关键术语、常见误区和检查理解的小题。" },
      { title: "使用边界", body: "生成内容只做教学草稿，最终仍需要教师检查准确性、学段适配和表达风险。" },
    ],
    color: "#EDE9F5", border: "#B5AEDD", rotate: "-1.2deg",
  },
  {
    id: 6, slug: "crispr-interactive", category: "科学" as Category,
    icon: <IconDNA size={36} color1="var(--cherry-red)" color2="var(--cherry-blue)" />,
    title: "CRISPR 交互讲解",
    desc: "一个可以亲手模拟“识别、剪切、修复”的基因编辑互动页面，把 CRISPR 从概念变成可操作体验。",
    outcome: "包含：识别、剪切、修复三步互动和风险提示",
    status: "互动讲解页",
    href: "/works/crispr-interactive",
    tags: ["基因编辑", "互动", "CRISPR"],
    audience: "高中生、科普读者、生物竞赛入门学习者",
    deliverables: ["识别：guide RNA 与目标序列配对", "剪切：Cas 蛋白在目标位置切开 DNA", "修复：展示删除、替换和未成功修复三种结果", "风险提示：脱靶、伦理和结果不确定性"],
    roadmap: ["先观察：guide RNA 是否能准确匹配", "再操作：触发剪切并查看修复结果", "再讨论：为什么能编辑不等于应该编辑", "最后总结：基因编辑是工具，不是万能答案"],
    why: "CRISPR 经常被讲成“基因剪刀”，但这个比喻容易让人忽略识别、定位、剪切、修复和风险。互动讲解要把每一步拆开。",
    contentBlocks: [
      { title: "交互流程", body: "选择 guide RNA，匹配目标序列，触发剪切，再展示非同源末端连接、同源重组和编辑失败三种结果。" },
      { title: "风险提示", body: "用卡片解释脱靶、嵌合、修复不确定性和伦理边界，避免把基因编辑讲成无风险魔法。" },
      { title: "课堂活动", body: "学生可以比较不同 guide RNA 的匹配效果，并讨论“能编辑”不等于“应该编辑”。" },
    ],
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
