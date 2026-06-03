import { useState } from "react";
import { GeneExpressionTool } from "./GeneExpressionTool";
import { IconBook, IconCheck, IconDNA, IconFlask, IconLeafSmall } from "./Icons";
import { works } from "./Works";

type Work = (typeof works)[number];

function navigateHome(hash = "") {
  window.history.pushState(null, "", `/${hash}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1.5px solid var(--border)",
        borderRadius: 18,
        padding: "1.25rem",
      }}
    >
      <h3
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          color: "var(--cherry-warm-brown)",
          fontSize: "1rem",
          fontWeight: 900,
          marginBottom: "0.85rem",
        }}
      >
        <IconCheck size={17} color="var(--cherry-forest)" />
        {title}
      </h3>
      <div style={{ display: "grid", gap: "0.65rem" }}>
        {items.map((item) => (
          <div
            key={item}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              color: "var(--cherry-warm-mid)",
              fontSize: "0.9rem",
              lineHeight: 1.65,
            }}
          >
            <IconLeafSmall size={15} color="var(--cherry-sage)" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 18, padding: "1.2rem", boxShadow: "3px 5px 0px rgba(94,68,42,0.06)" }}>
      <h3 style={{ color: "var(--cherry-warm-brown)", fontSize: "1rem", fontWeight: 900, marginBottom: "0.65rem" }}>{title}</h3>
      <div style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.75, fontSize: "0.9rem" }}>{children}</div>
    </div>
  );
}

function CellBiologyCourseContent() {
  const lessons = [
    ["01", "细胞是一座会自我维护的微型城市", "建立细胞整体观，区分结构、功能和系统协作。"],
    ["02", "细胞膜：边界、门禁和交流窗口", "理解选择透过性、物质运输和膜蛋白。"],
    ["03", "细胞核：遗传信息的档案室", "理解 DNA、基因表达和细胞核的调控角色。"],
    ["04", "线粒体：能量转换与细胞状态", "从 ATP 进入能量代谢、凋亡和活性氧。"],
    ["05", "内质网和高尔基体：加工与物流", "理解蛋白质合成后的修饰、分拣和运输。"],
    ["06", "细胞骨架：支撑、运输和移动", "理解微管、微丝和中间纤维的分工。"],
    ["07", "细胞分裂：复制一个相似的自己", "理解有丝分裂、细胞周期和检查点。"],
    ["08", "细胞通信：从一个细胞到一个组织", "理解信号分子、受体和反馈调控。"],
  ];

  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "0.9rem" }}>
        {lessons.map(([num, title, goal]) => (
          <ContentCard key={num} title={`${num}. ${title}`}>
            {goal}
          </ContentCard>
        ))}
      </div>
      <ContentCard title="课堂自测示例">
        画一张细胞“物流地图”：从核糖体合成蛋白开始，标出内质网、高尔基体、囊泡和细胞膜之间的运输关系，并用一句话解释每个结构的作用。
      </ContentCard>
    </section>
  );
}

function PromptKitContent() {
  const prompts = [
    {
      title: "文献精读",
      text: "请基于我提供的论文摘要和方法部分，按以下结构输出：研究问题、核心假设、样本与数据、关键方法、主要证据、作者结论、局限性、我需要进一步核查的点。不要补充论文中没有出现的信息。",
    },
    {
      title: "实验设计检查",
      text: "请检查这份实验设计是否存在变量混杂、对照不足、重复数不足、统计方法不匹配或安全风险。输出时分为：必须修改、建议修改、可以保留、需要导师确认。",
    },
    {
      title: "图表解读",
      text: "请逐步解释这张图：先说明坐标轴和分组，再描述趋势，最后判断图中证据能支持哪些结论、不能支持哪些结论。请把推测和事实分开。",
    },
    {
      title: "论文逻辑检查",
      text: "请检查下面这段论文讨论是否存在结论过度、证据跳跃、术语不一致或引用不足。请给出逐句修改建议，并说明修改理由。",
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
      {prompts.map((prompt) => (
        <ContentCard key={prompt.title} title={prompt.title}>
          <code style={{ display: "block", whiteSpace: "pre-wrap", color: "var(--cherry-warm-brown)", background: "var(--cherry-yellow-light)", borderRadius: 12, padding: "0.85rem", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.78rem", lineHeight: 1.65 }}>
            {prompt.text}
          </code>
        </ContentCard>
      ))}
    </div>
  );
}

function PlantEvolutionContent() {
  const chapters = [
    ["4.7 亿年前", "从水里来的祖先", "绿藻类祖先已经拥有叶绿素和光合作用能力，但离开水意味着干燥、重力和紫外线。"],
    ["苔藓时代", "先站稳，再长高", "苔藓没有真正的维管束，适合用来理解陆地植物最早如何解决保水和附着问题。"],
    ["蕨类扩张", "运输系统出现", "维管束让植物可以长得更高，但孢子繁殖仍然让它们依赖潮湿环境。"],
    ["种子出现", "把下一代装进保护壳", "种子把胚、营养和保护结构组合在一起，让植物繁殖不再完全依赖水。"],
    ["花和果实", "请动物帮忙传播", "花吸引传粉者，果实帮助种子扩散，植物和动物之间出现更复杂的协作。"],
  ];

  return (
    <div style={{ display: "grid", gap: "0.9rem" }}>
      {chapters.map(([time, title, body]) => (
        <div key={title} style={{ display: "grid", gridTemplateColumns: "120px minmax(0, 1fr)", gap: "1rem", alignItems: "start", background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 18, padding: "1rem" }}>
          <div style={{ fontFamily: "'Caveat', cursive", color: "var(--cherry-red)", fontWeight: 900, fontSize: "1rem" }}>{time}</div>
          <div>
            <h3 style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.35rem" }}>{title}</h3>
            <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.75, fontSize: "0.9rem" }}>{body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ConceptExplainerContent() {
  const [concept, setConcept] = useState("转录");
  const explanations: Record<string, string[]> = {
    转录: ["像把书上的一小段内容抄到便签上。", "细胞以 DNA 的一条链为模板合成 mRNA，RNA 中用 U 替代 T。", "转录涉及启动子识别、RNA 聚合酶延伸、终止以及转录后加工等过程。"],
    端粒: ["像鞋带末端的保护套，保护染色体末端。", "端粒位于染色体末端，随着细胞分裂逐渐缩短。", "端粒长度、端粒酶活性与细胞衰老、肿瘤发生和干细胞状态有关。"],
    生态位: ["像一种生物在自然里的生活位置和工作。", "生态位描述生物如何利用资源、生活在什么环境、和其他生物如何相互作用。", "生态位包含资源维度、空间维度和相互作用维度，可用于解释竞争、共存和群落结构。"],
  };

  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {Object.keys(explanations).map((name) => (
          <button key={name} onClick={() => setConcept(name)} style={{ border: concept === name ? "1.5px solid var(--cherry-forest)" : "1.5px solid var(--border)", background: concept === name ? "var(--cherry-sage-light)" : "var(--card)", borderRadius: 999, padding: "0.45rem 0.9rem", color: "var(--cherry-warm-brown)", fontWeight: 900, cursor: "pointer" }}>
            {name}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        {["小学版", "高中版", "研究生版"].map((level, index) => (
          <ContentCard key={level} title={level}>
            {explanations[concept][index]}
          </ContentCard>
        ))}
      </div>
      <ContentCard title="检查题">
        请用自己的话解释：如果把“{concept}”讲给一个没有学过生物的人，你会保留哪个核心意思，又会删掉哪些术语？
      </ContentCard>
    </section>
  );
}

function CrisprContent() {
  const [cut, setCut] = useState(false);

  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.8rem" }}>
          <IconDNA size={22} /> 目标 DNA
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "0.8rem" }}>
          {"A C T G G A C C T A G G".split(" ").map((base, index) => (
            <span key={`${base}-${index}`} style={{ background: cut && index === 5 ? "var(--cherry-peach-light)" : "var(--cherry-yellow-light)", border: "1.5px solid var(--border)", borderRadius: 10, padding: "0.42rem 0.62rem", color: "var(--cherry-warm-brown)", fontWeight: 900 }}>
              {base}
            </span>
          ))}
        </div>
        <button onClick={() => setCut((value) => !value)} style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.62rem 1rem", fontWeight: 900, cursor: "pointer" }}>
          {cut ? "复原序列" : "触发剪切"}
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1rem" }}>
        <ContentCard title="识别">
          guide RNA 先和目标 DNA 序列配对。配对越准确，Cas 蛋白越容易在正确位置工作。
        </ContentCard>
        <ContentCard title="剪切">
          Cas 蛋白在目标位置切开 DNA。剪切不是终点，后续修复方式决定编辑结果。
        </ContentCard>
        <ContentCard title="修复">
          细胞可能删除一小段、插入新片段，也可能修复失败或产生非预期结果。
        </ContentCard>
      </div>
    </section>
  );
}

function RichWorkContent({ slug }: { slug: string }) {
  if (slug === "cell-biology-course") return <CellBiologyCourseContent />;
  if (slug === "research-prompt-kit") return <PromptKitContent />;
  if (slug === "plant-evolution-stories") return <PlantEvolutionContent />;
  if (slug === "concept-explainer") return <ConceptExplainerContent />;
  if (slug === "crispr-interactive") return <CrisprContent />;
  return null;
}

function WorkHero({ work }: { work: Work }) {
  return (
    <section
      style={{
        padding: "4.5rem 1.5rem 3rem",
        background: "var(--background)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <a
          href="/#works"
          onClick={(event) => {
            event.preventDefault();
            navigateHome("#works");
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--cherry-forest)",
            textDecoration: "none",
            fontWeight: 900,
            fontSize: "0.86rem",
            marginBottom: "1.6rem",
          }}
        >
          ← 回到作品集
        </a>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.6rem",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              background: work.color,
              border: `1.5px solid ${work.border}`,
              borderRadius: 24,
              padding: "2rem",
              boxShadow: "6px 10px 0px rgba(94,68,42,0.1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: -18, right: 26, width: 94, height: 26, background: "rgba(250,247,241,0.58)", borderRadius: 5, transform: "rotate(4deg)" }} />
            <div style={{ marginBottom: "1rem" }}>{work.icon}</div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "rgba(250,247,241,0.72)",
                border: "1px dashed rgba(94,68,42,0.24)",
                borderRadius: 999,
                padding: "0.28rem 0.8rem",
                color: "var(--cherry-red)",
                fontWeight: 900,
                fontSize: "0.78rem",
                marginBottom: "1rem",
              }}
            >
              <IconFlask size={15} color="var(--cherry-red)" />
              {work.status}
            </div>
            <h1
              style={{
                color: "var(--cherry-warm-brown)",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 900,
                lineHeight: 1.18,
                marginBottom: "0.85rem",
              }}
            >
              {work.title}
            </h1>
            <p style={{ color: "var(--cherry-warm-mid)", fontSize: "1rem", lineHeight: 1.85, maxWidth: 680 }}>
              {work.desc}
            </p>
          </div>

          <aside
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 22,
              padding: "1.45rem",
              boxShadow: "4px 7px 0px rgba(94,68,42,0.08)",
            }}
          >
            <div style={{ fontFamily: "'Caveat', cursive", color: "var(--cherry-warm-mid)", fontWeight: 700, fontSize: "1rem", marginBottom: "0.45rem" }}>
              先做成这样
            </div>
            <p style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, lineHeight: 1.6, marginBottom: "1.2rem" }}>
              {work.outcome}
            </p>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <div>
                <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.82rem", marginBottom: 5 }}>
                  目标用户
                </div>
                <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.88rem" }}>
                  {work.audience}
                </p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {work.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "var(--muted)",
                      color: "var(--cherry-warm-mid)",
                      borderRadius: 999,
                      padding: "0.22rem 0.65rem",
                      fontSize: "0.74rem",
                      fontWeight: 800,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export function WorkDetailPage({ slug }: { slug: string }) {
  const work = works.find((item) => item.slug === slug);

  if (!work) {
    return (
      <section style={{ padding: "5rem 1.5rem", maxWidth: 720, margin: "0 auto", fontFamily: "'Nunito', sans-serif" }}>
        <a
          href="/#works"
          onClick={(event) => {
            event.preventDefault();
            navigateHome("#works");
          }}
          style={{ color: "var(--cherry-forest)", fontWeight: 900, textDecoration: "none" }}
        >
          ← 回到作品集
        </a>
        <h1 style={{ color: "var(--cherry-warm-brown)", fontSize: "2rem", marginTop: "1.5rem" }}>没有找到这个小作品</h1>
      </section>
    );
  }

  return (
    <main>
      <WorkHero work={work} />

      <section
        style={{
          padding: "0 1.5rem 5rem",
          maxWidth: 1060,
          margin: "0 auto",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        <div
          style={{
            background: "var(--cherry-yellow-light)",
            border: "1.5px solid var(--cherry-yellow)",
            borderRadius: 18,
            padding: "1.25rem",
            color: "var(--cherry-warm-mid)",
            lineHeight: 1.8,
            marginBottom: "1.2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.35rem" }}>
            <IconBook size={18} />
            为什么做
          </div>
          {work.why}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "1.2rem" }}>
          {work.contentBlocks.map((block) => (
            <div
              key={block.title}
              style={{
                background: "var(--card)",
                border: "1.5px solid var(--border)",
                borderRadius: 18,
                padding: "1.15rem",
                boxShadow: "3px 5px 0px rgba(94,68,42,0.06)",
              }}
            >
              <h3 style={{ color: "var(--cherry-warm-brown)", fontSize: "0.98rem", fontWeight: 900, marginBottom: "0.5rem" }}>
                {block.title}
              </h3>
              <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.75, fontSize: "0.9rem" }}>
                {block.body}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.2rem" }}>
          <DetailList title="页面内容" items={work.deliverables} />
          <DetailList title="使用方式" items={work.roadmap} />
        </div>

        <div style={{ marginTop: "1.2rem" }}>
          <RichWorkContent slug={work.slug} />
        </div>
      </section>

      {work.slug === "gene-expression" ? <GeneExpressionTool /> : null}
    </main>
  );
}
