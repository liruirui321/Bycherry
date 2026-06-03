import { useState } from "react";
import { GeneExpressionTool } from "./GeneExpressionTool";
import { IconDNA } from "./Icons";
import { works } from "./Works";

type Work = (typeof works)[number];

function navigateHome(hash = "") {
  window.history.pushState(null, "", `/${hash}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function ContentCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 18, padding: "1.2rem", boxShadow: "3px 5px 0px rgba(94,68,42,0.06)" }}>
      <h3 style={{ color: "var(--cherry-warm-brown)", fontSize: "1rem", fontWeight: 900, marginBottom: "0.65rem" }}>{title}</h3>
      <div style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.75, fontSize: "0.9rem" }}>{children}</div>
    </div>
  );
}

function PromptKitContent() {
  const prompts = [
    {
      title: "文献精读",
      input: "论文摘要、方法、结果图或 DOI",
      text: "请基于我提供的论文内容，按以下结构输出：研究问题、核心假设、样本与数据、关键方法、主要证据、作者结论、局限性、我需要进一步核查的点。不要补充论文中没有出现的信息；如果缺少证据，请标注“原文未说明”。",
      checks: ["结论是否只来自原文", "方法和证据是否对应", "局限性是否具体"],
    },
    {
      title: "实验设计检查",
      input: "实验目的、分组、样本量、操作步骤、统计方法",
      text: "请检查这份实验设计是否存在变量混杂、对照不足、重复数不足、统计方法不匹配或安全风险。输出时分为：必须修改、建议修改、可以保留、需要导师确认。每条意见都说明它会影响哪一种结论。",
      checks: ["阳性/阴性对照是否齐全", "重复数是否支持统计", "变量是否只改变一个核心因素"],
    },
    {
      title: "图表解读",
      input: "图片、图注、实验分组和统计标记",
      text: "请逐步解释这张图：先说明坐标轴、单位和分组，再描述趋势、离散程度和显著性标记，最后判断图中证据能支持哪些结论、不能支持哪些结论。请把观察事实、合理推断和过度推断分开。",
      checks: ["是否读清坐标轴", "是否区分趋势与因果", "是否遗漏对照组"],
    },
    {
      title: "论文逻辑检查",
      input: "讨论段落、结果摘要、目标期刊风格",
      text: "请检查下面这段论文讨论是否存在结论过度、证据跳跃、术语不一致、引用不足或重复表达。请逐句给出修改建议，并说明修改理由。不要替我新增未经证实的结论。",
      checks: ["每个结论是否有结果支持", "术语是否前后一致", "讨论是否区分结果和推测"],
    },
    {
      title: "审稿意见回应",
      input: "审稿意见、原文段落、已完成的补充分析",
      text: "请把审稿意见拆成可回应的任务：需要新增实验、需要补充分析、需要改写解释、需要礼貌澄清。为每条意见生成回应结构：感谢、理解、已修改内容、修改位置、仍需说明的限制。",
      checks: ["回应是否逐条对应", "语气是否克制", "是否标明修改位置"],
    },
    {
      title: "术语一致性检查",
      input: "论文全文或章节草稿",
      text: "请列出文中同一概念的不同写法、缩写首次出现位置、中文和英文术语是否混用、变量名是否前后一致。输出为三列：术语、发现的问题、建议统一写法。",
      checks: ["缩写是否首次定义", "同义词是否混用", "图表和正文是否一致"],
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
      {prompts.map((prompt) => (
        <ContentCard key={prompt.title} title={prompt.title}>
          <div style={{ display: "grid", gap: "0.7rem" }}>
            <div style={{ background: "var(--muted)", borderRadius: 12, padding: "0.65rem", color: "var(--cherry-warm-mid)", fontSize: "0.82rem" }}>
              <strong style={{ color: "var(--cherry-warm-brown)" }}>输入材料：</strong>{prompt.input}
            </div>
            <code style={{ display: "block", whiteSpace: "pre-wrap", color: "var(--cherry-warm-brown)", background: "var(--cherry-yellow-light)", borderRadius: 12, padding: "0.85rem", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.78rem", lineHeight: 1.65 }}>
              {prompt.text}
            </code>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {prompt.checks.map((check) => (
                <span key={check} style={{ background: "rgba(250,247,241,0.76)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 999, padding: "0.2rem 0.55rem", color: "var(--cherry-forest)", fontSize: "0.72rem", fontWeight: 800 }}>
                  {check}
                </span>
              ))}
            </div>
          </div>
        </ContentCard>
      ))}
    </div>
  );
}

function PlantEvolutionContent() {
  const chapters = [
    {
      time: "约 5.1-4.7 亿年前",
      title: "登陆前：淡水绿藻已经在练习“陆地技能”",
      story: "植物的登陆不是某一天突然发生的。链形植物绿藻中已经出现了一些适应浅水、间歇干燥和强光环境的基因工具，例如植物型光敏色素、激素相关通路、纤维素合成和环境胁迫响应。",
      evidence: "基因组比较显示，早分化链形植物绿藻携带多类与陆地适应相关的基因；分子钟研究也提示陆地植物起源可能早于大型化石记录。",
      refs: ["Wang 2019", "Morris 2018"],
    },
    {
      time: "约 4.75 亿年前",
      title: "最早的脚印：岩石里留下了孢子",
      story: "最早能可靠指向陆地植物的证据，不是一棵完整植物，而是显微镜下的小孢子。它们有抗分解的孢粉素外壁，能在岩石中保存很久。",
      evidence: "Wellman 等在《Nature》报道，中奥陶世约 4.75 亿年前的微体化石为早期陆地植物提供证据，也解释了为什么孢子记录早于完整植物化石。",
      refs: ["Wellman 2003", "Kenrick 1997"],
    },
    {
      time: "志留纪-早泥盆世",
      title: "小身体，大转折：早期陆地植物开始长出轴和孢子囊",
      story: "早期陆地植物体型很小，但已经开始把身体分成能直立的轴、产生孢子的结构，以及帮助贴附地面的组织。它们没有今天树木那样复杂，却改变了陆地生态系统的底层结构。",
      evidence: "Kenrick 与 Crane 的综述把 4.8-3.6 亿年前视为早期陆地植物起源和分化的关键窗口；Morris 等整合化石与分子钟，重建了早期陆地植物演化时间尺度。",
      refs: ["Kenrick 1997", "Morris 2018"],
    },
    {
      time: "泥盆纪",
      title: "运输系统：植物终于可以长高",
      story: "维管组织让水分和养分能在植物体内长距离运输。植物不再只是贴着地面生活，而是逐渐向上竞争光照，陆地开始出现更复杂的植被结构。",
      evidence: "早期维管植物和多孢子囊植物的化石记录显示，陆地植物在志留纪到泥盆纪期间逐步获得更复杂的孢子体结构和运输能力。",
      refs: ["Kenrick 1997", "Nature Plants 2018"],
    },
    {
      time: "晚泥盆世",
      title: "种子：把下一代装进保护包",
      story: "种子的出现改变了繁殖方式。胚、营养和保护结构被组织在一起，植物可以更好地等待合适环境，也更容易向干燥或不稳定的陆地环境扩展。",
      evidence: "早期种子化石来自晚泥盆世到早石炭世记录；《Nature》关于早期种子的研究显示，原始种子结构为理解种子习性起源提供了关键材料。",
      refs: ["Pettitt 1981", "Prestianni 2017"],
    },
    {
      time: "白垩纪",
      title: "花和果实：把动物也写进植物故事",
      story: "被子植物用花、果实和封闭胚珠重组了繁殖方式。传粉者、食草动物和种子传播者都卷入这套系统，陆地生态网络变得更加密集。",
      evidence: "被子植物在早白垩世快速多样化的化石记录较清楚，但其更早起源仍有争议；相关综述提醒我们区分“可靠化石证据”和“分子钟推测”。",
      refs: ["Friis 1994", "Herendeen 2017"],
    },
  ];

  const references = [
    {
      key: "Wang 2019",
      title: "Wang et al. Genomes of early-diverging streptophyte algae shed light on plant terrestrialization. Nature Plants.",
      url: "https://www.nature.com/articles/s41477-019-0560-3",
    },
    {
      key: "Wellman 2003",
      title: "Wellman, Osterloff & Mohiuddin. Fragments of the earliest land plants. Nature.",
      url: "https://www.nature.com/articles/nature01884",
    },
    {
      key: "Morris 2018",
      title: "Morris et al. The timescale of early land plant evolution. PNAS.",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5877938/",
    },
    {
      key: "Kenrick 1997",
      title: "Kenrick & Crane. The origin and early evolution of plants on land. Nature.",
      url: "https://www.nature.com/articles/37918",
    },
    {
      key: "Nature Plants 2018",
      title: "Sporophytes of polysporangiate land plants from the early Silurian period may have been photosynthetically autonomous. Nature Plants.",
      url: "https://www.nature.com/articles/s41477-018-0140-y",
    },
    {
      key: "Pettitt 1981",
      title: "Pettitt & Beck. The earliest seeds. Nature.",
      url: "https://www.nature.com/articles/293462a0",
    },
    {
      key: "Prestianni 2017",
      title: "Further study of Late Devonian seed plant Cosmosperma polyloba. BMC Ecology and Evolution.",
      url: "https://link.springer.com/article/10.1186/s12862-017-0992-1",
    },
    {
      key: "Friis 1994",
      title: "Crane, Friis & Pedersen. The origin and early diversification of angiosperms. Nature.",
      url: "https://www.nature.com/articles/374027a0",
    },
    {
      key: "Herendeen 2017",
      title: "Herendeen et al. Palaeobotanical redux: revisiting the age of the angiosperms. Nature Plants.",
      url: "https://www.nature.com/articles/nplants201715",
    },
  ];

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 18, padding: "1rem", color: "var(--cherry-warm-mid)", lineHeight: 1.75 }}>
        从淡水绿藻到被子植物，植物演化围绕几个关键问题展开：如何离开水体、如何运输水分、如何长高、如何保护胚和种子、如何借助动物完成繁殖。
      </div>

      {chapters.map((chapter) => (
        <div key={chapter.title} style={{ display: "grid", gridTemplateColumns: "130px minmax(0, 1fr)", gap: "1rem", alignItems: "start", background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 18, padding: "1rem", boxShadow: "3px 5px 0px rgba(94,68,42,0.06)" }}>
          <div style={{ fontFamily: "'Caveat', cursive", color: "var(--cherry-red)", fontWeight: 900, fontSize: "1rem" }}>{chapter.time}</div>
          <div>
            <h3 style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.45rem" }}>{chapter.title}</h3>
            <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.78, fontSize: "0.9rem", marginBottom: "0.65rem" }}>{chapter.story}</p>
            <div style={{ background: "var(--muted)", borderRadius: 14, padding: "0.75rem", color: "var(--cherry-warm-mid)", fontSize: "0.84rem", lineHeight: 1.65, marginBottom: "0.65rem" }}>
              <strong style={{ color: "var(--cherry-warm-brown)" }}>证据：</strong>{chapter.evidence}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {chapter.refs.map((ref) => (
                <span key={ref} style={{ background: "rgba(250,247,241,0.78)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.22rem 0.62rem", color: "var(--cherry-forest)", fontWeight: 900, fontSize: "0.74rem" }}>
                  {ref}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 18, padding: "1rem" }}>
        <h3 style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.8rem" }}>参考文献</h3>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {references.map((reference) => (
            <a key={reference.key} href={reference.url} target="_blank" rel="noreferrer" style={{ color: "var(--cherry-forest)", textDecoration: "none", lineHeight: 1.6, fontSize: "0.86rem", fontWeight: 800 }}>
              [{reference.key}] {reference.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConceptExplainerContent() {
  const [concept, setConcept] = useState("转录");
  const explanations: Record<string, { levels: string[]; terms: string[]; pitfall: string; check: string }> = {
    转录: {
      levels: ["像把书上的一小段内容抄到便签上，便签可以被拿到别处继续使用。", "细胞以 DNA 的一条链为模板合成 mRNA，RNA 中用 U 替代 T，mRNA 会把遗传信息带到核糖体。", "转录涉及启动子识别、转录因子调控、RNA 聚合酶延伸、终止以及真核细胞中的剪接和转录后加工。"],
      terms: ["DNA 模板链", "RNA 聚合酶", "mRNA", "启动子"],
      pitfall: "转录不是把 DNA 变成 RNA；DNA 仍然保留，RNA 是按模板新合成出来的拷贝。",
      check: "如果 DNA 片段是 ATG，mRNA 中对应片段通常写作 AUG。",
    },
    端粒: {
      levels: ["像鞋带末端的保护套，保护染色体末端不被磨坏。", "端粒位于染色体末端，随着细胞分裂逐渐缩短，能减少染色体末端被误认为断裂的风险。", "端粒长度、端粒酶活性与细胞衰老、肿瘤发生和干细胞状态有关；端粒维护机制会影响复制潜能。"],
      terms: ["染色体末端", "端粒酶", "复制末端问题", "细胞衰老"],
      pitfall: "端粒缩短不是所有衰老现象的唯一原因，它只是细胞衰老机制中的一部分。",
      check: "频繁分裂的细胞更依赖端粒维护，肿瘤细胞常见端粒酶重新激活。",
    },
    生态位: {
      levels: ["像一种生物在自然里的生活位置和工作。", "生态位描述生物如何利用资源、生活在什么环境、和其他生物如何相互作用。", "生态位包含资源维度、空间维度和相互作用维度，可用于解释竞争、共存、适应辐射和群落结构。"],
      terms: ["资源利用", "竞争", "共存", "群落"],
      pitfall: "生态位不等于栖息地。栖息地偏向“住在哪里”，生态位还包含“吃什么、怎样生存、和谁互动”。",
      check: "两种鸟住在同一片森林，但取食高度和食物不同，它们的生态位可以不同。",
    },
    凋亡: {
      levels: ["像细胞按下自我清理按钮，把自己有序拆开。", "凋亡是一种程序性细胞死亡，细胞会收缩、DNA 断裂，并被免疫细胞清除，通常不引发明显炎症。", "凋亡通过内源性线粒体通路或外源性死亡受体通路激活 caspase 级联反应，在发育、免疫和肿瘤抑制中很关键。"],
      terms: ["程序性细胞死亡", "caspase", "线粒体通路", "死亡受体"],
      pitfall: "凋亡不是细胞坏死。坏死常伴随细胞破裂和炎症，凋亡更有序。",
      check: "胚胎手指分开、免疫细胞清除异常细胞，都和凋亡有关。",
    },
  };
  const active = explanations[concept];

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
            {active.levels[index]}
          </ContentCard>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
        <ContentCard title="关键术语">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {active.terms.map((term) => (
              <span key={term} style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 999, padding: "0.25rem 0.62rem", color: "var(--cherry-warm-brown)", fontWeight: 800, fontSize: "0.76rem" }}>
                {term}
              </span>
            ))}
          </div>
        </ContentCard>
        <ContentCard title="常见误区">
          {active.pitfall}
        </ContentCard>
        <ContentCard title="检查题">
          {active.check}
        </ContentCard>
      </div>
    </section>
  );
}

function CrisprContent() {
  const [guideIndex, setGuideIndex] = useState(0);
  const [repair, setRepair] = useState<"indel" | "replace" | "failed">("indel");
  const target = "A C T G G A C C T A G G".split(" ");
  const guides = [
    { name: "guide A", sequence: "C U G G A", start: 3, score: 100, note: "完全匹配目标片段，Cas 蛋白能稳定定位。" },
    { name: "guide B", sequence: "C U A G A", start: 3, score: 60, note: "中间有错配，定位效率下降，脱靶风险上升。" },
    { name: "guide C", sequence: "G A U C C", start: 7, score: 35, note: "匹配弱，Cas 蛋白很难在预期位置工作。" },
  ];
  const activeGuide = guides[guideIndex];
  const cutIndex = activeGuide.start + 2;
  const repairResults = {
    indel: {
      title: "小片段插入/删除",
      sequence: target.map((base, index) => (index === cutIndex ? "Δ" : base)),
      result: "阅读框可能改变，目标蛋白容易失活。",
    },
    replace: {
      title: "模板引导替换",
      sequence: target.map((base, index) => (index === cutIndex ? "T" : base)),
      result: "如果提供修复模板，细胞可能把指定碱基写入目标位置。",
    },
    failed: {
      title: "未成功编辑",
      sequence: target,
      result: "细胞完成原样修复，或者 Cas 蛋白没有稳定切开目标位点。",
    },
  };
  const activeRepair = repairResults[repair];

  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(270px, 0.75fr)", gap: "1rem", alignItems: "stretch" }}>
        <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.8rem" }}>
            <IconDNA size={22} /> 目标 DNA
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1rem" }}>
            {target.map((base, index) => (
              <span key={`${base}-${index}`} style={{ background: index === cutIndex ? "var(--cherry-peach-light)" : index >= activeGuide.start && index < activeGuide.start + 5 ? "var(--cherry-yellow-light)" : "var(--muted)", border: index === cutIndex ? "2px solid var(--cherry-red)" : "1.5px solid var(--border)", borderRadius: 10, padding: "0.45rem 0.64rem", color: "var(--cherry-warm-brown)", fontWeight: 900 }}>
                {base}
              </span>
            ))}
          </div>
          <div style={{ display: "grid", gap: "0.65rem", marginBottom: "1rem" }}>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900 }}>guide RNA</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {guides.map((guide, index) => (
                <button key={guide.name} onClick={() => setGuideIndex(index)} style={{ background: guideIndex === index ? "var(--cherry-forest)" : "var(--muted)", color: guideIndex === index ? "#FAF7F1" : "var(--cherry-warm-brown)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.45rem 0.8rem", fontWeight: 900, cursor: "pointer" }}>
                  {guide.name}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "120px minmax(0, 1fr)", gap: "0.8rem", alignItems: "center", background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 16, padding: "0.85rem", color: "var(--cherry-warm-mid)", lineHeight: 1.65 }}>
            <strong style={{ color: "var(--cherry-warm-brown)" }}>{activeGuide.sequence}</strong>
            <span>{activeGuide.note}</span>
          </div>
        </div>

        <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.8rem" }}>匹配读数</div>
          <div style={{ height: 14, borderRadius: 999, background: "var(--muted)", overflow: "hidden", marginBottom: "0.6rem" }}>
            <div style={{ width: `${activeGuide.score}%`, height: "100%", background: activeGuide.score > 80 ? "var(--cherry-sage)" : activeGuide.score > 50 ? "var(--cherry-yellow)" : "var(--cherry-red)", transition: "width 0.25s ease" }} />
          </div>
          <div style={{ color: "var(--cherry-red)", fontSize: "1.6rem", fontWeight: 900, marginBottom: "0.8rem" }}>{activeGuide.score}%</div>
          <div style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.88rem" }}>
            剪切位置：第 {cutIndex + 1} 个碱基附近。匹配越高，Cas 蛋白越容易在目标位置形成稳定复合体。
          </div>
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem" }}>
        <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.8rem" }}>修复结果</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1rem" }}>
          {([
            ["indel", "插入/删除"],
            ["replace", "模板替换"],
            ["failed", "未成功编辑"],
          ] as const).map(([key, label]) => (
            <button key={key} onClick={() => setRepair(key)} style={{ background: repair === key ? "var(--cherry-forest)" : "var(--muted)", color: repair === key ? "#FAF7F1" : "var(--cherry-warm-brown)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.45rem 0.8rem", fontWeight: 900, cursor: "pointer" }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "0.8rem" }}>
          {activeRepair.sequence.map((base, index) => (
            <span key={`${base}-${index}`} style={{ background: index === cutIndex ? "var(--cherry-peach-light)" : "var(--cherry-yellow-light)", border: index === cutIndex ? "2px solid var(--cherry-red)" : "1.5px solid var(--border)", borderRadius: 10, padding: "0.42rem 0.62rem", color: "var(--cherry-warm-brown)", fontWeight: 900 }}>
              {base}
            </span>
          ))}
        </div>
        <div style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.7 }}>
          <strong style={{ color: "var(--cherry-warm-brown)" }}>{activeRepair.title}：</strong>{activeRepair.result}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1rem" }}>
        {[
          ["识别", "guide RNA 和目标 DNA 序列互补配对。错配越多，稳定结合越困难。"],
          ["剪切", "Cas 蛋白在 guide RNA 指定的位置附近切开 DNA 双链。"],
          ["修复", "细胞修复切口时，可能造成插入/删除，也可能按模板完成精确替换。"],
        ].map(([title, body]) => (
          <ContentCard key={title} title={title}>
            {body}
          </ContentCard>
        ))}
      </div>
    </section>
  );
}

function RichWorkContent({ slug }: { slug: string }) {
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
          <p style={{ color: "var(--cherry-warm-mid)", fontSize: "1rem", lineHeight: 1.85, maxWidth: 760, marginBottom: "1rem" }}>
            {work.desc}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {work.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  background: "rgba(250,247,241,0.72)",
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
          padding: work.slug === "gene-expression" ? "0" : "0 1.5rem 5rem",
          maxWidth: 1060,
          margin: "0 auto",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        <RichWorkContent slug={work.slug} />
      </section>
      {work.slug === "gene-expression" ? <GeneExpressionTool /> : null}
    </main>
  );
}
