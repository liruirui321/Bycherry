import { useState } from "react";
import { GeneExpressionTool } from "./GeneExpressionTool";
import { IconDNA } from "./Icons";
import { works } from "./Works";
import { WorkPreviewIllustration } from "./WorkPreviewIllustration";
import { copyText } from "../clipboard";
import { navigateClient, shouldUseClientNavigation } from "../navigation";

type Work = (typeof works)[number];

function navigateHome(hash = "") {
  navigateClient(`/${hash}`);
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
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [material, setMaterial] = useState("研究问题：\n样本/材料：\n已有结果：\n我最担心的问题：");
  const [copied, setCopied] = useState(false);
  const [copiedPack, setCopiedPack] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const prompts = [
    {
      title: "文献精读",
      input: "论文摘要、方法、结果图或 DOI",
      materialTemplate: "论文题目：\n摘要：\n方法关键词：\n我想重点看：研究问题 / 主要证据 / 局限性\n需要避免：不要把摘要外的信息当成论文结论",
      text: "请基于我提供的论文内容，按以下结构输出：研究问题、核心假设、样本与数据、关键方法、主要证据、作者结论、局限性、我需要进一步核查的点。不要补充论文中没有出现的信息；如果缺少证据，请标注“原文未说明”。",
      checks: ["结论是否只来自原文", "方法和证据是否对应", "局限性是否具体"],
      output: ["研究问题", "主要证据", "局限性", "待核查点"],
    },
    {
      title: "实验设计检查",
      input: "实验目的、分组、样本量、操作步骤、统计方法",
      materialTemplate: "实验目的：\n实验对象/材料：\n分组：对照组 / 处理组\n每组样本量：\n核心变量：\n检测指标：\n统计方法：\n我担心的问题：对照是否足够、重复数是否合理",
      text: "请检查这份实验设计是否存在变量混杂、对照不足、重复数不足、统计方法不匹配或安全风险。输出时分为：必须修改、建议修改、可以保留、需要导师确认。每条意见都说明它会影响哪一种结论。",
      checks: ["阳性/阴性对照是否齐全", "重复数是否支持统计", "变量是否只改变一个核心因素"],
      output: ["必须修改", "建议修改", "可以保留", "导师确认"],
    },
    {
      title: "图表解读",
      input: "图片、图注、实验分组和统计标记",
      materialTemplate: "图号：Figure \n图注：\n坐标轴/单位：\n分组：\n显著性标记：\n我想确认：这张图能支持什么结论，不能支持什么结论",
      text: "请逐步解释这张图：先说明坐标轴、单位和分组，再描述趋势、离散程度和显著性标记，最后判断图中证据能支持哪些结论、不能支持哪些结论。请把观察事实、合理推断和过度推断分开。",
      checks: ["是否读清坐标轴", "是否区分趋势与因果", "是否遗漏对照组"],
      output: ["观察事实", "合理推断", "不能支持", "下一步检查"],
    },
    {
      title: "论文逻辑检查",
      input: "讨论段落、结果摘要、目标期刊风格",
      materialTemplate: "目标期刊/风格：\n结果摘要：\n讨论段落：\n我想检查：结论是否过度、引用是否不足、术语是否一致",
      text: "请检查下面这段论文讨论是否存在结论过度、证据跳跃、术语不一致、引用不足或重复表达。请逐句给出修改建议，并说明修改理由。不要替我新增未经证实的结论。",
      checks: ["每个结论是否有结果支持", "术语是否前后一致", "讨论是否区分结果和推测"],
      output: ["逐句问题", "修改建议", "修改理由", "缺失证据"],
    },
    {
      title: "审稿意见回应",
      input: "审稿意见、原文段落、已完成的补充分析",
      materialTemplate: "审稿人意见：\n原文位置：\n已完成修改/补充分析：\n还不能补做的内容：\n希望语气：克制、礼貌、逐条回应",
      text: "请把审稿意见拆成可回应的任务：需要新增实验、需要补充分析、需要改写解释、需要礼貌澄清。为每条意见生成回应结构：感谢、理解、已修改内容、修改位置、仍需说明的限制。",
      checks: ["回应是否逐条对应", "语气是否克制", "是否标明修改位置"],
      output: ["任务拆解", "回应草稿", "修改位置", "限制说明"],
    },
    {
      title: "术语一致性检查",
      input: "论文全文或章节草稿",
      materialTemplate: "章节/全文：\n重点术语：\n已有缩写表：\n需要统一的写法：中文 / 英文 / 缩写 / 变量名",
      text: "请列出文中同一概念的不同写法、缩写首次出现位置、中文和英文术语是否混用、变量名是否前后一致。输出为三列：术语、发现的问题、建议统一写法。",
      checks: ["缩写是否首次定义", "同义词是否混用", "图表和正文是否一致"],
      output: ["术语", "问题", "统一写法", "出现位置"],
    },
  ];
  const activePrompt = prompts[activePromptIndex];
  const finalPrompt = `${activePrompt.text}

【我的材料】
${material.trim() || "请在这里粘贴材料。"}

【输出格式】
请使用清晰小标题，并包含：${activePrompt.output.join("、")}。

【质量要求】
${activePrompt.checks.map((check, index) => `${index + 1}. ${check}`).join("\n")}`;
  const taskPackOutput = `【科研 AI 任务包】
任务类型：${activePrompt.title}
适用材料：${activePrompt.input}

一、要交给 AI 的 prompt
${finalPrompt}

二、输出验收清单
${activePrompt.checks.map((check, index) => `${index + 1}. ${check}`).join("\n")}

三、需要得到的栏目
${activePrompt.output.map((item, index) => `${index + 1}. ${item}`).join("\n")}

四、人工复核提醒
1. 结论必须能回到原文、数据或实验设计。
2. 如果模型补充了材料中没有的信息，需要标出并回查来源。
3. 对会影响实验、投稿或伦理判断的内容，保留人工最终决定。`;

  async function copyPrompt() {
    const copiedToClipboard = await copyText(finalPrompt);
    if (copiedToClipboard) {
      setCopied(true);
      setCopiedPack(false);
      setCopyStatus("Prompt 已复制到剪贴板。");
      window.setTimeout(() => setCopied(false), 1400);
      return;
    }

    setCopied(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  async function copyTaskPack() {
    const copiedToClipboard = await copyText(taskPackOutput);
    if (copiedToClipboard) {
      setCopiedPack(true);
      setCopied(false);
      setCopyStatus("任务包已复制到剪贴板。");
      window.setTimeout(() => setCopiedPack(false), 1400);
      return;
    }

    setCopiedPack(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  function updateMaterial(value: string) {
    setMaterial(value);
    setCopied(false);
    setCopiedPack(false);
    setCopyStatus("");
  }

  function fillMaterialTemplate() {
    updateMaterial(activePrompt.materialTemplate);
  }

  function clearMaterial() {
    updateMaterial("");
  }

  return (
    <section id="prompt-kit-builder" style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(230px, 0.78fr) minmax(0, 1.3fr)", gap: "1rem", alignItems: "start" }}>
        <aside style={{ display: "grid", gap: "0.7rem" }}>
          {prompts.map((prompt, index) => {
            const active = activePromptIndex === index;
            return (
              <button key={prompt.title} type="button" aria-pressed={active} onClick={() => { setActivePromptIndex(index); setCopied(false); setCopiedPack(false); setCopyStatus(""); }} style={{ textAlign: "left", background: active ? "var(--cherry-sage-light)" : "var(--card)", border: active ? "1.5px solid var(--cherry-forest)" : "1.5px solid var(--border)", borderRadius: 18, padding: "0.9rem", boxShadow: active ? "3px 5px 0px rgba(58,92,62,0.14)" : "3px 5px 0px rgba(94,68,42,0.05)", cursor: "pointer" }}>
                <div style={{ color: active ? "var(--cherry-forest)" : "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.35rem" }}>{prompt.title}</div>
                <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.55, marginBottom: "0.55rem" }}>{prompt.input}</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {prompt.output.slice(0, 2).map((item) => (
                    <span key={item} style={{ background: "rgba(250,247,241,0.78)", border: "1.5px solid rgba(94,68,42,0.1)", borderRadius: 999, padding: "0.16rem 0.48rem", color: "var(--cherry-forest)", fontSize: "0.68rem", fontWeight: 900 }}>
                      {item}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </aside>

        <div style={{ display: "grid", gap: "1rem" }}>
          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.8rem" }}>
              <div>
                <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "1.05rem" }}>{activePrompt.title}</div>
                <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.82rem", marginTop: "0.25rem" }}>输入材料：{activePrompt.input}</div>
              </div>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                <button type="button" onClick={copyPrompt} aria-describedby="prompt-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.55rem 0.95rem", fontWeight: 900, cursor: "pointer" }}>
                  {copied ? "已复制" : "复制 prompt"}
                </button>
                <button type="button" onClick={copyTaskPack} aria-describedby="prompt-copy-status" style={{ background: "var(--cherry-yellow-light)", color: "var(--cherry-warm-brown)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 999, padding: "0.55rem 0.95rem", fontWeight: 900, cursor: "pointer" }}>
                  {copiedPack ? "已复制" : "复制任务包"}
                </button>
              </div>
            </div>
            <div id="prompt-copy-status" role="status" aria-live="polite" style={{ minHeight: "1.2rem", color: "var(--cherry-forest)", fontSize: "0.78rem", fontWeight: 900, marginBottom: "0.65rem" }}>
              {copyStatus}
            </div>

            <textarea
              value={material}
              onChange={(event) => updateMaterial(event.target.value)}
              style={{ width: "100%", minHeight: 154, resize: "vertical", border: "1.5px solid var(--border)", borderRadius: 16, padding: "0.9rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontSize: "0.9rem", lineHeight: 1.6, boxSizing: "border-box", marginBottom: "0.9rem" }}
              aria-label="科研材料输入框"
            />

            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: "0.9rem" }}>
              <button type="button" onClick={fillMaterialTemplate} style={{ background: "var(--cherry-sage-light)", color: "var(--cherry-forest)", border: "1.5px solid rgba(93,140,101,0.28)", borderRadius: 999, padding: "0.42rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                套用材料模板
              </button>
              <button type="button" onClick={clearMaterial} style={{ background: "var(--muted)", color: "var(--cherry-warm-brown)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.42rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                清空材料
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.7rem", marginBottom: "0.9rem" }}>
              {activePrompt.output.map((item, index) => (
                <div key={item} style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 14, padding: "0.65rem", color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.78rem" }}>
                  {index + 1}. {item}
                </div>
              ))}
            </div>

            <code style={{ display: "block", whiteSpace: "pre-wrap", color: "var(--cherry-warm-brown)", background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 16, padding: "0.9rem", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.78rem", lineHeight: 1.65 }}>
              {finalPrompt}
            </code>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.8rem" }}>
            <ContentCard title="质控清单">
              <div style={{ display: "grid", gap: "0.45rem" }}>
                {activePrompt.checks.map((check, index) => (
                  <div key={check} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--cherry-forest)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 900, flexShrink: 0 }}>{index + 1}</span>
                    <span>{check}</span>
                  </div>
                ))}
              </div>
            </ContentCard>
            <ContentCard title="使用提醒">
              先放入原文、图注或实验设计，再把生成的 prompt 发给 AI。涉及论文结论时，要求模型标出“原文未说明”，可以减少凭空补充。
            </ContentCard>
          </div>

          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.75rem" }}>
              <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900 }}>可复制任务包</div>
              <button type="button" onClick={copyTaskPack} aria-describedby="prompt-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.44rem 0.82rem", fontWeight: 900, cursor: "pointer", fontSize: "0.8rem" }}>
                {copiedPack ? "已复制" : "复制任务包"}
              </button>
            </div>
            <code style={{ display: "block", whiteSpace: "pre-wrap", background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 16, padding: "0.9rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.78rem", lineHeight: 1.65, maxHeight: 260, overflow: "auto" }}>
              {taskPackOutput}
            </code>
          </div>
        </div>
      </div>

      <style>
        {`
          #prompt-kit-builder button:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          #prompt-kit-builder button {
            transition: transform 0.18s ease, box-shadow 0.18s ease;
          }

          #prompt-kit-builder button:hover,
          #prompt-kit-builder button:focus-visible {
            transform: translateY(-2px);
          }

          @media (max-width: 880px) {
            #prompt-kit-builder > div:first-child {
              grid-template-columns: 1fr !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            #prompt-kit-builder button {
              transition: none !important;
              transform: none !important;
            }
          }
        `}
      </style>
    </section>
  );
}

function PlantEvolutionContent() {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [copiedStudyCard, setCopiedStudyCard] = useState(false);
  const [studyCardStatus, setStudyCardStatus] = useState("");
  const chapters = [
    {
      time: "约 5.1-4.7 亿年前",
      title: "登陆前：淡水绿藻已经在练习“陆地技能”",
      story: "植物的登陆不是某一天突然发生的。链形植物绿藻中已经出现了一些适应浅水、间歇干燥和强光环境的基因工具，例如植物型光敏色素、激素相关通路、纤维素合成和环境胁迫响应。",
      evidence: "基因组比较显示，早分化链形植物绿藻携带多类与陆地适应相关的基因；分子钟研究也提示陆地植物起源可能早于大型化石记录。",
      challenge: "间歇干燥、强光和浅水环境让祖先类群先获得一部分陆地适应工具。",
      innovation: "环境感知、细胞壁和胁迫响应基因工具箱。",
      prompt: "为什么植物登陆前，淡水浅水环境可能是重要训练场？",
      answerHint: "浅水环境会周期性暴露在强光、干燥和温度波动中，祖先类群可以先演化出一部分应对陆地压力的基因工具。",
      teacherMove: "让学生把“环境压力”对应到“需要的结构或基因功能”，例如抗干燥、抗紫外线、细胞壁支撑。",
      certainty: "基因组证据强",
      refs: ["Wang 2019", "Morris 2018"],
    },
    {
      time: "约 4.75 亿年前",
      title: "最早的脚印：岩石里留下了孢子",
      story: "最早能可靠指向陆地植物的证据，不是一棵完整植物，而是显微镜下的小孢子。它们有抗分解的孢粉素外壁，能在岩石中保存很久。",
      evidence: "Wellman 等在《Nature》报道，中奥陶世约 4.75 亿年前的微体化石为早期陆地植物提供证据，也解释了为什么孢子记录早于完整植物化石。",
      challenge: "陆地环境会让生殖细胞暴露在干燥和紫外线下。",
      innovation: "带孢粉素外壁的孢子，提高保存和传播能力。",
      prompt: "为什么孢子化石可能早于完整植物体化石？",
      answerHint: "孢粉素外壁更抗分解，也更容易在沉积物中保存；小型早期植物体本身不一定容易形成完整化石。",
      teacherMove: "引导学生区分“最早化石记录”和“真实起源时间”，说明化石保存会筛选证据。",
      certainty: "化石证据强",
      refs: ["Wellman 2003", "Kenrick 1997"],
    },
    {
      time: "志留纪-早泥盆世",
      title: "小身体，大转折：早期陆地植物开始长出轴和孢子囊",
      story: "早期陆地植物体型很小，但已经开始把身体分成能直立的轴、产生孢子的结构，以及帮助贴附地面的组织。它们没有今天树木那样复杂，却改变了陆地生态系统的底层结构。",
      evidence: "Kenrick 与 Crane 的综述把 4.8-3.6 亿年前视为早期陆地植物起源和分化的关键窗口；Morris 等整合化石与分子钟，重建了早期陆地植物演化时间尺度。",
      challenge: "离开水体后，植物需要把身体抬起来，同时把孢子送到更容易扩散的位置。",
      innovation: "直立轴、孢子囊和更清晰的孢子体结构。",
      prompt: "早期植物还很小，为什么直立结构仍然重要？",
      answerHint: "直立结构能把孢子抬离地表，增加扩散机会，也让植物开始在空间上争夺光照。",
      teacherMove: "可以让学生画出贴地结构和直立结构，比较孢子释放高度、光照获取和身体支撑需求。",
      certainty: "化石与系统发育共同支持",
      refs: ["Kenrick 1997", "Morris 2018"],
    },
    {
      time: "泥盆纪",
      title: "运输系统：植物终于可以长高",
      story: "维管组织让水分和养分能在植物体内长距离运输。植物不再只是贴着地面生活，而是逐渐向上竞争光照，陆地开始出现更复杂的植被结构。",
      evidence: "早期维管植物和多孢子囊植物的化石记录显示，陆地植物在志留纪到泥盆纪期间逐步获得更复杂的孢子体结构和运输能力。",
      challenge: "要长高就必须解决水分运输、机械支撑和远距离资源分配。",
      innovation: "维管组织和更复杂的分枝结构。",
      prompt: "维管组织为什么会改变陆地生态系统的高度结构？",
      answerHint: "维管组织让水分和养分能长距离运输，并配合支撑结构让植物长高，陆地植被从低矮覆盖转向分层结构。",
      teacherMove: "把维管组织类比成运输管线，再追问：如果没有运输系统，植物高度会被什么限制？",
      certainty: "形态化石证据强",
      refs: ["Kenrick 1997", "Nature Plants 2018"],
    },
    {
      time: "晚泥盆世",
      title: "种子：把下一代装进保护包",
      story: "种子的出现改变了繁殖方式。胚、营养和保护结构被组织在一起，植物可以更好地等待合适环境，也更容易向干燥或不稳定的陆地环境扩展。",
      evidence: "早期种子化石来自晚泥盆世到早石炭世记录；《Nature》关于早期种子的研究显示，原始种子结构为理解种子习性起源提供了关键材料。",
      challenge: "干燥陆地上，下一代需要保护、营养和等待合适时机的能力。",
      innovation: "胚、营养组织和保护结构整合成种子习性。",
      prompt: "种子为什么比裸露孢子更适合不稳定环境？",
      answerHint: "种子把胚、营养和保护结构放在一起，可以等待合适条件再萌发，比裸露孢子更能应对干燥和季节波动。",
      teacherMove: "让学生比较“孢子像轻量传播单元”和“种子像带补给的保护包”，再讨论两者各自优势。",
      certainty: "早期种子化石支持",
      refs: ["Pettitt 1981", "Prestianni 2017"],
    },
    {
      time: "白垩纪",
      title: "花和果实：把动物也写进植物故事",
      story: "被子植物用花、果实和封闭胚珠重组了繁殖方式。传粉者、食草动物和种子传播者都卷入这套系统，陆地生态网络变得更加密集。",
      evidence: "被子植物在早白垩世快速多样化的化石记录较清楚，但其更早起源仍有争议；相关综述提醒我们区分“可靠化石证据”和“分子钟推测”。",
      challenge: "繁殖不只要产生后代，还要提高传粉和传播效率。",
      innovation: "花、果实、封闭胚珠以及和动物互动的繁殖系统。",
      prompt: "花和果实为什么会让动物进入植物演化叙事？",
      answerHint: "花可以吸引或利用传粉者，果实可以帮助种子传播；植物繁殖效率开始和动物行为紧密相连。",
      teacherMove: "让学生举一个传粉或种子传播例子，再指出这是植物结构和动物行为共同塑造的生态关系。",
      certainty: "早白垩世化石清楚，更早起源仍有争议",
      refs: ["Friis 1994", "Herendeen 2017"],
    },
  ];
  const activeChapter = chapters[activeChapterIndex];
  const shortTimes = ["5.1-4.7亿年", "4.75亿年", "志留-泥盆", "泥盆纪", "晚泥盆", "白垩纪"];
  const plantTimelinePoints = [
    { x: 252, y: 668 },
    { x: 236, y: 552 },
    { x: 266, y: 436 },
    { x: 236, y: 320 },
    { x: 266, y: 204 },
    { x: 252, y: 88 },
  ];
  const plantStageLabels = ["浅水绿藻", "孢子外壁", "直立小轴", "维管分枝", "种子保护包", "花和果实"];

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
  const activeReferences = references.filter((reference) => activeChapter.refs.includes(reference.key));
  const studyCardOutput = `【植物演化学习卡】
阶段：${activeChapter.title}
时间：${activeChapter.time}

1. 发生了什么
${activeChapter.story}

2. 当时的生存问题
${activeChapter.challenge}

3. 关键创新
${activeChapter.innovation}

4. 证据状态
${activeChapter.certainty}
${activeChapter.evidence}

5. 课堂提问
${activeChapter.prompt}
作答提示：${activeChapter.answerHint}
教师追问：${activeChapter.teacherMove}

6. 参考文献
${activeReferences.map((reference) => `[${reference.key}] ${reference.title}`).join("\n")}`;

  async function copyStudyCard() {
    const copiedToClipboard = await copyText(studyCardOutput);
    if (copiedToClipboard) {
      setCopiedStudyCard(true);
      setStudyCardStatus("学习卡已复制到剪贴板。");
      window.setTimeout(() => setCopiedStudyCard(false), 1400);
      return;
    }

    setCopiedStudyCard(false);
    setStudyCardStatus("复制失败，请手动选中文本复制。");
  }

  function choosePlantChapter(index: number) {
    setActiveChapterIndex(index);
    setCopiedStudyCard(false);
    setStudyCardStatus("");
  }

  function renderPlantStageIcon(index: number, visible: boolean) {
    const opacity = visible ? 1 : 0.25;

    if (index === 0) {
      return (
        <g opacity={opacity}>
          <path d="M-34 18 C-22 3 -8 7 0 18 C10 2 28 6 36 20" fill="none" stroke="var(--cherry-sage)" strokeWidth={5} strokeLinecap="round" />
          <circle cx={-22} cy={10} r={10} fill="var(--cherry-blue-light)" stroke="var(--cherry-sage)" strokeWidth={2.2} />
          <circle cx={2} cy={14} r={13} fill="var(--cherry-sage-light)" stroke="var(--cherry-sage)" strokeWidth={2.2} />
          <circle cx={25} cy={9} r={8} fill="rgba(132,184,204,0.52)" stroke="var(--cherry-sage)" strokeWidth={2} />
          <path d="M-2 12 C6 7 12 9 18 14" stroke="var(--cherry-forest)" strokeWidth={2.2} strokeLinecap="round" opacity={0.45} />
        </g>
      );
    }

    if (index === 1) {
      return (
        <g opacity={opacity}>
          {[[-28, 6], [-14, -10], [2, -4], [18, -12], [30, 4], [-1, 18]].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={8} fill="var(--cherry-yellow)" stroke="var(--cherry-warm-brown)" strokeWidth={1.4} opacity={0.9} />
          ))}
          <path d="M-34 23 C-13 30 14 31 36 22" stroke="var(--cherry-forest)" strokeWidth={3} strokeLinecap="round" opacity={0.32} />
          <path d="M-22 5 L-16 10 M-2 -4 L5 1 M21 -12 L28 -7" stroke="var(--cherry-warm-brown)" strokeWidth={1.8} strokeLinecap="round" opacity={0.42} />
        </g>
      );
    }

    if (index === 2) {
      return (
        <g opacity={opacity}>
          <path d="M-4 34 C-4 16 -2 1 6 -18" fill="none" stroke="var(--cherry-forest)" strokeWidth={6} strokeLinecap="round" />
          <path d="M5 -7 C18 -18 33 -15 39 0" fill="none" stroke="var(--cherry-forest)" strokeWidth={4} strokeLinecap="round" />
          <ellipse cx={40} cy={3} rx={9} ry={12} fill="var(--cherry-yellow)" stroke="var(--cherry-warm-brown)" strokeWidth={1.7} />
          <path d="M-26 31 C-10 23 8 24 27 31" stroke="var(--cherry-sage)" strokeWidth={4} strokeLinecap="round" />
        </g>
      );
    }

    if (index === 3) {
      return (
        <g opacity={opacity}>
          <path d="M0 36 C0 12 5 -9 15 -31" fill="none" stroke="var(--cherry-forest)" strokeWidth={8} strokeLinecap="round" />
          <path d="M8 -1 C28 -14 43 -7 48 11 M7 9 C-18 4 -30 13 -36 29 M14 -17 C0 -27 -13 -25 -24 -12" fill="none" stroke="var(--cherry-forest)" strokeWidth={4.3} strokeLinecap="round" />
          <path d="M18 -30 Q31 -48 49 -36 Q40 -21 18 -30Z M-36 28 Q-52 15 -43 -2 Q-26 6 -36 28Z M49 11 Q62 1 74 14 Q59 25 49 11Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth={1.8} />
          <path d="M-7 30 H17" stroke="var(--cherry-yellow)" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
        </g>
      );
    }

    if (index === 4) {
      return (
        <g opacity={opacity}>
          <ellipse cx={2} cy={2} rx={23} ry={30} fill="var(--cherry-yellow)" stroke="var(--cherry-warm-brown)" strokeWidth={2.5} />
          <path d="M2 -19 C14 -35 32 -34 39 -20 C29 -8 14 -7 2 -19Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth={2} />
          <path d="M2 -20 C8 -10 8 8 1 21" stroke="rgba(94,68,42,0.34)" strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={-4} cy={5} r={5} fill="rgba(250,247,241,0.6)" />
        </g>
      );
    }

    return (
      <g opacity={opacity}>
        {[[-18, 2], [0, -16], [18, 2], [0, 20]].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={15} fill="var(--cherry-peach)" stroke="rgba(94,68,42,0.12)" strokeWidth={2} />
        ))}
        <circle cx={0} cy={2} r={12} fill="var(--cherry-yellow)" stroke="var(--cherry-warm-brown)" strokeWidth={2} />
        <circle cx={34} cy={24} r={13} fill="var(--cherry-red)" opacity={0.86} />
        <path d="M27 13 C34 2 47 2 54 12 C47 21 35 23 27 13Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth={1.8} />
      </g>
    );
  }

  return (
    <div id="plant-evolution-explorer" style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(280px, 0.8fr)", gap: "1rem", alignItems: "start" }}>
        <div style={{ display: "grid", gap: "0.85rem", alignContent: "start" }}>
          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)", overflow: "hidden" }}>
            <svg viewBox="0 0 520 760" role="img" aria-label="植物从淡水绿藻到被子植物的竖向演化插画时间轴" style={{ width: "100%", display: "block", borderRadius: 18 }}>
              <defs>
                <linearGradient id="plant-evolution-bg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#FFF8EA" />
                  <stop offset="0.45" stopColor="#EDF3DF" />
                  <stop offset="0.78" stopColor="#DCECD8" />
                  <stop offset="1" stopColor="#D9C9AA" />
                </linearGradient>
                <linearGradient id="plant-water" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#84B8CC" stopOpacity="0.1" />
                  <stop offset="0.5" stopColor="#84B8CC" stopOpacity="0.32" />
                  <stop offset="1" stopColor="#84B8CC" stopOpacity="0.08" />
                </linearGradient>
                <filter id="plant-soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#5E442A" floodOpacity="0.13" />
                </filter>
              </defs>
              <rect x={0} y={0} width={520} height={760} fill="url(#plant-evolution-bg)" />
              <rect x={24} y={24} width={468} height={712} rx={94} fill="rgba(250,247,241,0.26)" stroke="rgba(93,140,101,0.28)" strokeWidth={2.5} strokeDasharray="8 8" />
              <circle cx={420} cy={82} r={34} fill="var(--cherry-yellow)" opacity={0.62} />
              <path d="M94 103 C127 80 166 86 188 113 C151 127 118 124 94 103Z M340 137 C371 114 413 119 439 148 C400 161 365 158 340 137Z" fill="#FAF7F1" opacity={0.62} />
              <path d="M72 190 C122 164 171 177 212 202 C263 231 317 219 367 185 C401 162 438 158 472 177" fill="none" stroke="rgba(132,184,204,0.24)" strokeWidth={12} strokeLinecap="round" />
              <path d="M54 585 C113 553 159 600 222 558 C296 507 348 553 469 492" fill="none" stroke="rgba(93,140,101,0.18)" strokeWidth={44} strokeLinecap="round" />
              <path d="M52 624 C116 584 186 626 247 588 C323 543 393 563 474 512 V736 H52Z" fill="rgba(169,201,172,0.2)" />
              <path d="M52 654 C130 697 230 655 305 688 C372 717 431 690 474 648 V736 H52Z" fill="url(#plant-water)" />
              <path d="M52 704 C96 686 138 700 177 690 C221 680 260 653 307 672 C358 692 409 678 474 638 V736 H52Z" fill="rgba(216,199,168,0.58)" />
              <path d="M52 692 C103 667 157 682 213 664 C291 640 349 661 462 620" fill="none" stroke="rgba(58,92,62,0.17)" strokeWidth={26} strokeLinecap="round" />
              <path d="M91 713 C130 725 173 714 209 719 M333 724 C369 708 421 725 456 711" fill="none" stroke="rgba(94,68,42,0.16)" strokeWidth={5} strokeLinecap="round" />
              {[78, 104, 132, 378, 414, 442].map((x, index) => (
                <g key={x} opacity={0.46 + (index % 2) * 0.16}>
                  <path d={`M${x} 632 C${x - 8} 608 ${x - 15} 591 ${x - 7} 568`} stroke="var(--cherry-forest)" strokeWidth={3.5} strokeLinecap="round" />
                  <path d={`M${x - 8} 604 Q${x - 27} 591 ${x - 36} 612 M${x - 5} 583 Q${x + 10} 569 ${x + 25} 586 M${x - 4} 618 Q${x + 13} 607 ${x + 25} 621`} stroke="var(--cherry-sage)" strokeWidth={3.2} strokeLinecap="round" fill="none" />
                </g>
              ))}
              <g opacity={0.72}>
                <path d="M79 688 C98 671 126 671 147 688 C128 699 101 700 79 688Z" fill="rgba(132,184,204,0.28)" stroke="rgba(58,92,62,0.22)" strokeWidth={2} />
                {[92, 112, 133].map((x, index) => (
                  <circle key={x} cx={x} cy={684 + index * 3} r={9 - index * 1.5} fill={index === 1 ? "var(--cherry-sage-light)" : "var(--cherry-blue-light)"} stroke="var(--cherry-sage)" strokeWidth={1.8} />
                ))}
                {[348, 369, 392, 419].map((x, index) => (
                  <circle key={x} cx={x} cy={704 + (index % 2) * 8} r={6} fill="var(--cherry-yellow)" stroke="rgba(94,68,42,0.2)" strokeWidth={1.5} />
                ))}
                <path d="M287 716 C302 699 327 699 343 715" stroke="var(--cherry-forest)" strokeWidth={4} strokeLinecap="round" />
                <path d="M315 712 C312 691 321 675 335 663 M331 678 C348 666 366 672 372 689 M323 696 C303 689 287 697 280 713" stroke="var(--cherry-forest)" strokeWidth={3.5} strokeLinecap="round" fill="none" />
              </g>
              {[96, 152, 398, 446].map((x) => (
                <path key={x} d={`M${x} 134 C${x + 16} 122 ${x + 34} 123 ${x + 48} 137`} fill="none" stroke="rgba(132,184,204,0.3)" strokeWidth={9} strokeLinecap="round" />
              ))}
              <g opacity={0.72}>
                <path d="M388 256 C388 221 397 190 415 160" stroke="var(--cherry-forest)" strokeWidth={7} strokeLinecap="round" fill="none" />
                <path d="M408 172 C428 150 459 158 468 185 C441 197 420 192 408 172Z M395 215 C367 197 342 212 336 239 C362 248 383 239 395 215Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth={2} />
                <circle cx={431} cy={150} r={10} fill="var(--cherry-red)" opacity={0.86} />
                <circle cx={453} cy={174} r={8} fill="var(--cherry-peach)" opacity={0.86} />
              </g>
              <g opacity={0.66}>
                <ellipse cx={111} cy={314} rx={19} ry={28} fill="var(--cherry-yellow)" stroke="var(--cherry-warm-brown)" strokeWidth={2.4} />
                <path d="M111 292 C124 274 145 276 153 294 C139 309 123 309 111 292Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth={2} />
              </g>
              <path d="M252 668 C192 607 312 552 252 494 C190 435 312 374 252 318 C192 257 312 201 252 88" fill="none" stroke="var(--cherry-forest)" strokeWidth={10} strokeLinecap="round" opacity={0.16} />
              <path d="M252 668 C192 607 312 552 252 494 C190 435 312 374 252 318 C192 257 312 201 252 88" fill="none" stroke="var(--cherry-sage)" strokeWidth={4.8} strokeLinecap="round" />
              <text x={54} y={64} fill="var(--cherry-forest)" fontSize={18} fontWeight={900}>植物演化竖向图</text>
              <text x={54} y={86} fill="var(--cherry-warm-mid)" fontSize={11} fontWeight={800}>从水边工具箱，到花和果实</text>
              {chapters.map((chapter, index) => {
                const point = plantTimelinePoints[index];
                const active = activeChapterIndex === index;
                const leftSide = index % 2 === 0;
                const branchX = leftSide ? -108 : 108;
                const labelX = leftSide ? -178 : 50;
                return (
                  <g
                    key={chapter.title}
                    transform={`translate(${point.x} ${point.y})`}
                    role="button"
                    tabIndex={0}
                    aria-label={`查看${chapter.title}`}
                    aria-pressed={active}
                    onClick={() => choosePlantChapter(index)}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      choosePlantChapter(index);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <path d={`M0 0 C${branchX * 0.25} -22 ${branchX * 0.58} -24 ${branchX} -42`} fill="none" stroke={index <= activeChapterIndex ? "var(--cherry-forest)" : "rgba(93,140,101,0.28)"} strokeWidth={3.2} strokeLinecap="round" />
                    <g transform={`translate(${branchX} -34)`} filter={active ? "url(#plant-soft-shadow)" : undefined}>
                      {renderPlantStageIcon(index, index <= activeChapterIndex)}
                    </g>
                    {active ? <circle r={32} fill="none" stroke="rgba(214,91,74,0.24)" strokeWidth={7} /> : null}
                    <circle r={active ? 23 : 17} fill={active ? "var(--cherry-yellow)" : "var(--cherry-sage-light)"} stroke={active ? "var(--cherry-red)" : "var(--cherry-forest)"} strokeWidth={active ? 3 : 2} />
                    <text y={5} textAnchor="middle" fill="var(--cherry-warm-brown)" fontSize={12} fontWeight={900}>{index + 1}</text>
                    <g transform={`translate(${labelX} -48)`}>
                      <rect width={148} height={54} rx={16} fill={active ? "rgba(250,247,241,0.92)" : "rgba(250,247,241,0.72)"} stroke={active ? "var(--cherry-red)" : "rgba(94,68,42,0.12)"} strokeWidth={active ? 2 : 1.2} />
                      <text x={14} y={21} fill="var(--cherry-red)" fontSize={10} fontWeight={900}>{shortTimes[index]}</text>
                      <text x={14} y={39} fill="var(--cherry-warm-brown)" fontSize={11} fontWeight={900}>{plantStageLabels[index]}</text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.72rem" }}>
            {chapters.map((chapter, index) => {
              const active = activeChapterIndex === index;
              return (
                <button key={chapter.title} type="button" aria-pressed={active} onClick={() => choosePlantChapter(index)} style={{ textAlign: "left", background: active ? "var(--cherry-sage-light)" : "var(--card)", border: active ? "1.5px solid var(--cherry-forest)" : "1.5px solid var(--border)", borderRadius: 18, padding: "0.78rem", boxShadow: active ? "3px 5px 0px rgba(58,92,62,0.14)" : "3px 5px 0px rgba(94,68,42,0.05)", cursor: "pointer" }}>
                  <div style={{ color: active ? "var(--cherry-forest)" : "var(--cherry-red)", fontFamily: "'Caveat', cursive", fontSize: "0.9rem", fontWeight: 900, marginBottom: "0.3rem" }}>{chapter.time}</div>
                  <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.82rem", lineHeight: 1.42, marginBottom: "0.45rem" }}>{chapter.title}</div>
                  <div style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.5, fontSize: "0.74rem", marginBottom: "0.5rem" }}>{chapter.innovation}</div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {chapter.refs.map((ref) => (
                      <span key={ref} style={{ background: "rgba(250,247,241,0.78)", border: "1.5px solid rgba(94,68,42,0.1)", borderRadius: 999, padding: "0.15rem 0.45rem", color: "var(--cherry-forest)", fontWeight: 900, fontSize: "0.65rem" }}>
                        {ref}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
            <div style={{ fontFamily: "'Caveat', cursive", color: "var(--cherry-red)", fontWeight: 900, fontSize: "1.05rem", marginBottom: "0.45rem" }}>{activeChapter.time}</div>
            <h3 style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, lineHeight: 1.35, marginBottom: "0.7rem" }}>{activeChapter.title}</h3>
            <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.75, fontSize: "0.9rem", marginBottom: "0.8rem" }}>{activeChapter.story}</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {[
                ["生存问题", activeChapter.challenge],
                ["关键创新", activeChapter.innovation],
                ["证据状态", activeChapter.certainty],
              ].map(([label, body]) => (
                <div key={label} style={{ background: "var(--muted)", borderRadius: 14, padding: "0.68rem", color: "var(--cherry-warm-mid)", lineHeight: 1.55, fontSize: "0.82rem" }}>
                  <strong style={{ color: "var(--cherry-warm-brown)" }}>{label}：</strong>{body}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 22, padding: "1rem", color: "var(--cherry-warm-mid)", lineHeight: 1.7, fontSize: "0.9rem" }}>
            <strong style={{ color: "var(--cherry-warm-brown)" }}>课堂提问：</strong>{activeChapter.prompt}
          </div>

          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)", display: "grid", gap: "0.65rem" }}>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900 }}>讨论引导</div>
            <div style={{ background: "var(--muted)", borderRadius: 14, padding: "0.72rem", color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.84rem" }}>
              <strong style={{ color: "var(--cherry-warm-brown)" }}>作答提示：</strong>{activeChapter.answerHint}
            </div>
            <div style={{ background: "rgba(169,201,172,0.18)", border: "1.5px solid rgba(93,140,101,0.18)", borderRadius: 14, padding: "0.72rem", color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.84rem" }}>
              <strong style={{ color: "var(--cherry-warm-brown)" }}>教师追问：</strong>{activeChapter.teacherMove}
            </div>
          </div>

          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              <strong style={{ color: "var(--cherry-warm-brown)" }}>本阶段学习卡</strong>
              <button type="button" onClick={copyStudyCard} aria-describedby="plant-study-card-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.44rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                {copiedStudyCard ? "已复制" : "复制学习卡"}
              </button>
            </div>
            <div id="plant-study-card-status" role="status" aria-live="polite" style={{ minHeight: "1.05rem", color: "var(--cherry-forest)", fontSize: "0.76rem", fontWeight: 900, marginBottom: "0.55rem" }}>
              {studyCardStatus}
            </div>
            <code style={{ display: "block", whiteSpace: "pre-wrap", background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 14, padding: "0.75rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.72rem", lineHeight: 1.55, maxHeight: 180, overflow: "auto" }}>
              {studyCardOutput}
            </code>
          </div>
        </aside>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 18, padding: "1rem" }}>
        <h3 style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.8rem" }}>证据与参考文献</h3>
        <div style={{ background: "var(--muted)", borderRadius: 14, padding: "0.8rem", color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.86rem", marginBottom: "0.8rem" }}>
          <strong style={{ color: "var(--cherry-warm-brown)" }}>当前阶段证据：</strong>{activeChapter.evidence}
        </div>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {references.map((reference) => (
            <a key={reference.key} href={reference.url} target="_blank" rel="noreferrer" aria-label={`${reference.title}，新窗口打开`} style={{ color: "var(--cherry-forest)", textDecoration: "none", lineHeight: 1.6, fontSize: "0.86rem", fontWeight: 800 }}>
              [{reference.key}] {reference.title} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>

      <style>
        {`
          #plant-evolution-explorer button:focus-visible,
          #plant-evolution-explorer a:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          #plant-evolution-explorer button {
            transition: transform 0.18s ease, box-shadow 0.18s ease;
          }

          #plant-evolution-explorer button:hover,
          #plant-evolution-explorer button:focus-visible {
            transform: translateY(-2px);
          }

          @media (max-width: 880px) {
            #plant-evolution-explorer > div:first-child {
              grid-template-columns: 1fr !important;
            }
          }

          #plant-evolution-explorer svg [role="button"]:focus-visible circle {
            stroke: var(--cherry-red);
            stroke-width: 4;
          }

          @media (prefers-reduced-motion: reduce) {
            #plant-evolution-explorer button {
              transition: none !important;
              transform: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}

function ConceptExplainerContent() {
  const [concept, setConcept] = useState("转录");
  const [levelIndex, setLevelIndex] = useState(1);
  const [quizChoice, setQuizChoice] = useState<string | null>(null);
  const [audience, setAudience] = useState("高中生");
  const [lessonGoal, setLessonGoal] = useState("把抽象概念讲清楚，并检查学生是否真的理解");
  const [copiedLesson, setCopiedLesson] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const explanations: Record<string, { color: string; analogy: string; levels: Array<{ title: string; body: string }>; terms: string[]; mechanism: string[]; compare: string; pitfall: string; quiz: { question: string; options: string[]; answer: string; explain: string } }> = {
    转录: {
      color: "var(--cherry-blue)",
      analogy: "把书架上的原文抄成一张便签。书还在原处，便签可以被拿去加工。",
      levels: [
        { title: "小学版", body: "DNA 像一本很大的说明书，转录就是把其中一小段抄成 RNA 便签。" },
        { title: "高中版", body: "细胞以 DNA 的一条链为模板合成 mRNA，RNA 中用 U 替代 T，mRNA 会把遗传信息带到核糖体。" },
        { title: "研究生版", body: "转录包含启动子识别、转录因子调控、RNA 聚合酶延伸、终止，以及真核细胞中的剪接和转录后加工。" },
      ],
      terms: ["DNA 模板链", "RNA 聚合酶", "mRNA", "启动子"],
      mechanism: ["转录因子帮助定位启动子", "RNA 聚合酶结合 DNA", "按模板链合成 mRNA", "mRNA 离开 DNA，进入后续加工或翻译"],
      compare: "转录负责“写出 RNA”；翻译负责“读 RNA 做蛋白质”。",
      pitfall: "转录不是把 DNA 变成 RNA；DNA 仍然保留，RNA 是按模板新合成出来的拷贝。",
      quiz: {
        question: "DNA 编码链片段 ATG 对应的 mRNA 密码子通常写作什么？",
        options: ["AUG", "TAC", "UAC"],
        answer: "AUG",
        explain: "mRNA 与编码链方向和信息相同，但 RNA 用 U 替代 T。",
      },
    },
    端粒: {
      color: "var(--cherry-red)",
      analogy: "像鞋带末端的保护套，保护染色体末端不被磨坏、也不容易和别的断端混淆。",
      levels: [
        { title: "小学版", body: "端粒在染色体两头，像保护套一样保护重要信息。" },
        { title: "高中版", body: "端粒位于染色体末端，随着细胞分裂逐渐缩短，能减少染色体末端被误认为断裂的风险。" },
        { title: "研究生版", body: "端粒长度、端粒酶活性与复制潜能、细胞衰老、肿瘤发生和干细胞状态有关。" },
      ],
      terms: ["染色体末端", "端粒酶", "复制末端问题", "细胞衰老"],
      mechanism: ["DNA 复制不能完整复制最末端", "端粒重复序列先被消耗", "端粒过短会触发损伤反应", "端粒酶可在部分细胞中延长端粒"],
      compare: "端粒是染色体末端结构；端粒酶是维护端粒长度的酶。",
      pitfall: "端粒缩短不是所有衰老现象的唯一原因，它只是细胞衰老机制中的一部分。",
      quiz: {
        question: "下面哪类细胞更可能依赖端粒维护？",
        options: ["频繁分裂的细胞", "成熟红细胞", "角质层死细胞"],
        answer: "频繁分裂的细胞",
        explain: "分裂越频繁，染色体末端复制问题越明显，因此更依赖端粒维护机制。",
      },
    },
    生态位: {
      color: "var(--cherry-sage)",
      analogy: "不只是住址，更像一份生活档案：住在哪里、吃什么、什么时候活动、和谁竞争。",
      levels: [
        { title: "小学版", body: "生态位像一种生物在自然里的生活位置和工作。" },
        { title: "高中版", body: "生态位描述生物如何利用资源、生活在什么环境、和其他生物如何相互作用。" },
        { title: "研究生版", body: "生态位包含资源维度、空间维度和相互作用维度，可用于解释竞争、共存、适应辐射和群落结构。" },
      ],
      terms: ["资源利用", "竞争", "共存", "群落"],
      mechanism: ["环境提供资源和限制", "物种选择可利用的资源范围", "相似物种发生竞争", "资源分化可帮助物种共存"],
      compare: "栖息地偏向“住在哪里”；生态位还包含“怎么生活”。",
      pitfall: "生态位不等于栖息地。栖息地偏向“住在哪里”，生态位还包含“吃什么、怎样生存、和谁互动”。",
      quiz: {
        question: "两种鸟生活在同一片森林，但取食高度不同，这说明什么？",
        options: ["生态位可以不同", "一定是同一物种", "不存在竞争"],
        answer: "生态位可以不同",
        explain: "同一栖息地内也可能通过资源或空间分化形成不同生态位。",
      },
    },
    凋亡: {
      color: "var(--cherry-peach)",
      analogy: "像细胞按下自我清理按钮，把自己有序拆开，再交给身体清理。",
      levels: [
        { title: "小学版", body: "凋亡是细胞有计划地结束自己，避免影响周围细胞。" },
        { title: "高中版", body: "凋亡是一种程序性细胞死亡，细胞会收缩、DNA 断裂，并被免疫细胞清除，通常不引发明显炎症。" },
        { title: "研究生版", body: "凋亡通过内源性线粒体通路或外源性死亡受体通路激活 caspase 级联反应，在发育、免疫和肿瘤抑制中很关键。" },
      ],
      terms: ["程序性细胞死亡", "caspase", "线粒体通路", "死亡受体"],
      mechanism: ["细胞收到内部或外部死亡信号", "caspase 级联被激活", "细胞结构被有序拆解", "碎片被吞噬清除"],
      compare: "凋亡更有序、炎症较少；坏死常伴随细胞破裂和炎症。",
      pitfall: "凋亡不是细胞坏死。坏死常伴随细胞破裂和炎症，凋亡更有序。",
      quiz: {
        question: "凋亡和坏死最核心的区别之一是什么？",
        options: ["凋亡更有序", "凋亡一定会感染", "坏死没有细胞死亡"],
        answer: "凋亡更有序",
        explain: "凋亡是程序性死亡，坏死常伴随细胞破裂和炎症反应。",
      },
    },
  };
  const active = explanations[concept];
  const selectedLevel = active.levels[levelIndex];
  const quizAnswered = quizChoice !== null;
  const lessonFlow = [
    {
      title: "1 分钟进入",
      body: `先问“你听到${concept}会想到什么”，再用类比切入：${active.analogy}`,
    },
    {
      title: "3 分钟讲清",
      body: `${selectedLevel.title}只保留一个主线：${selectedLevel.body}`,
    },
    {
      title: "2 分钟辨析",
      body: `${active.compare} 常见误区提醒：${active.pitfall}`,
    },
    {
      title: "1 分钟检查",
      body: `用即时小测收束：${active.quiz.question}`,
    },
  ];
  const lessonOutput = `【概念】${concept}
【对象】${audience}
【目标】${lessonGoal}

一、先用类比进入
${active.analogy}

二、${selectedLevel.title}讲解
${selectedLevel.body}

三、机制步骤
${active.mechanism.map((item, index) => `${index + 1}. ${item}`).join("\n")}

四、关键词
${active.terms.join("、")}

五、辨析
${active.compare}

六、常见误区
${active.pitfall}

七、课堂流程
${lessonFlow.map((item) => `${item.title}：${item.body}`).join("\n")}

八、即时小测
问题：${active.quiz.question}
选项：${active.quiz.options.join(" / ")}
答案：${active.quiz.answer}
解释：${active.quiz.explain}`;

  function chooseConcept(name: string) {
    setConcept(name);
    setQuizChoice(null);
    setCopiedLesson(false);
    setCopyStatus("");
  }

  async function copyLessonOutput() {
    const copiedToClipboard = await copyText(lessonOutput);
    if (copiedToClipboard) {
      setCopiedLesson(true);
      setCopyStatus("讲解稿已复制到剪贴板。");
      window.setTimeout(() => setCopiedLesson(false), 1400);
      return;
    }

    setCopiedLesson(false);
    setCopyStatus("复制失败，请手动选中文本复制。");
  }

  return (
    <section id="concept-explainer-tool" style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {Object.keys(explanations).map((name) => (
          <button key={name} type="button" aria-pressed={concept === name} onClick={() => chooseConcept(name)} style={{ border: concept === name ? `1.5px solid ${active.color}` : "1.5px solid var(--border)", background: concept === name ? "var(--cherry-yellow-light)" : "var(--card)", borderRadius: 999, padding: "0.45rem 0.9rem", color: "var(--cherry-warm-brown)", fontWeight: 900, cursor: "pointer" }}>
            {name}
          </button>
        ))}
      </div>

      <div className="concept-responsive-grid" style={{ display: "grid", gridTemplateColumns: "minmax(180px, 0.52fr) minmax(0, 1fr) auto", gap: "0.75rem", alignItems: "end", background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 18, padding: "0.95rem", boxShadow: "3px 5px 0px rgba(94,68,42,0.06)" }}>
        <label style={{ display: "grid", gap: 5, color: "var(--cherry-warm-brown)", fontSize: "0.78rem", fontWeight: 900 }}>
          讲给谁
          <input value={audience} onChange={(event) => { setAudience(event.target.value); setCopiedLesson(false); setCopyStatus(""); }} style={{ border: "1.5px solid var(--border)", borderRadius: 12, padding: "0.58rem 0.72rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800 }} />
        </label>
        <label style={{ display: "grid", gap: 5, color: "var(--cherry-warm-brown)", fontSize: "0.78rem", fontWeight: 900 }}>
          讲解目标
          <input value={lessonGoal} onChange={(event) => { setLessonGoal(event.target.value); setCopiedLesson(false); setCopyStatus(""); }} style={{ border: "1.5px solid var(--border)", borderRadius: 12, padding: "0.58rem 0.72rem", background: "var(--muted)", color: "var(--cherry-warm-brown)", fontFamily: "'Nunito', sans-serif", fontWeight: 800 }} />
        </label>
        <button type="button" onClick={copyLessonOutput} aria-describedby="concept-copy-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.62rem 0.95rem", fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap" }}>
          {copiedLesson ? "已复制" : "复制讲解稿"}
        </button>
        <div id="concept-copy-status" role="status" aria-live="polite" style={{ gridColumn: "1 / -1", minHeight: "1.1rem", color: "var(--cherry-forest)", fontSize: "0.78rem", fontWeight: 900 }}>
          {copyStatus}
        </div>
      </div>

      <div className="concept-responsive-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(280px, 0.78fr)", gap: "1rem", alignItems: "stretch" }}>
        <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)", position: "relative", overflow: "hidden" }}>
          <svg style={{ position: "absolute", right: -20, top: -14, opacity: 0.16 }} width="180" height="150" viewBox="0 0 180 150" fill="none" aria-hidden="true" focusable="false">
            <path d="M28 128 Q44 54 146 22 Q150 96 28 128Z" fill={active.color} />
            <path d="M48 112 Q86 76 134 32" stroke="var(--cherry-warm-brown)" strokeWidth="3" strokeLinecap="round" opacity="0.28" />
          </svg>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "0.9rem" }}>
              {active.levels.map((level, index) => (
                <button key={level.title} type="button" aria-pressed={levelIndex === index} onClick={() => setLevelIndex(index)} style={{ background: levelIndex === index ? active.color : "var(--muted)", color: levelIndex === index ? "#FAF7F1" : "var(--cherry-warm-brown)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.42rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.8rem" }}>
                  {level.title}
                </button>
              ))}
            </div>
            <h2 style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "1.35rem", marginBottom: "0.65rem" }}>{concept}</h2>
            <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 16, padding: "0.85rem", color: "var(--cherry-warm-mid)", lineHeight: 1.7, marginBottom: "0.9rem" }}>
              <strong style={{ color: "var(--cherry-warm-brown)" }}>类比：</strong>{active.analogy}
            </div>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.45rem" }}>{selectedLevel.title}</div>
            <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.78, fontSize: "0.95rem", marginBottom: "1rem" }}>{selectedLevel.body}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {active.terms.map((term) => (
                <span key={term} style={{ background: "rgba(250,247,241,0.8)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 999, padding: "0.25rem 0.62rem", color: "var(--cherry-warm-brown)", fontWeight: 800, fontSize: "0.76rem" }}>
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.8rem" }}>即时小测</div>
          <div style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.9rem", marginBottom: "0.8rem" }}>{active.quiz.question}</div>
          <div style={{ display: "grid", gap: 7 }}>
            {active.quiz.options.map((option) => {
              const correct = option === active.quiz.answer;
              const selected = quizChoice === option;
              return (
                <button key={option} type="button" aria-pressed={selected} onClick={() => setQuizChoice(option)} style={{ textAlign: "left", background: selected ? (correct ? "var(--cherry-sage-light)" : "var(--cherry-peach-light)") : "var(--muted)", border: selected ? `1.5px solid ${correct ? "var(--cherry-forest)" : "var(--cherry-red)"}` : "1.5px solid var(--border)", borderRadius: 14, padding: "0.58rem 0.72rem", color: "var(--cherry-warm-brown)", fontWeight: 900, cursor: "pointer" }}>
                  {option}
                </button>
              );
            })}
          </div>
          {quizAnswered ? (
            <div role="status" aria-live="polite" style={{ marginTop: "0.85rem", background: quizChoice === active.quiz.answer ? "var(--cherry-sage-light)" : "var(--cherry-yellow-light)", borderRadius: 14, padding: "0.72rem", color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.84rem" }}>
              <strong style={{ color: "var(--cherry-warm-brown)" }}>{quizChoice === active.quiz.answer ? "答对了：" : "再看一遍："}</strong>{active.quiz.explain}
            </div>
          ) : null}
        </div>
      </div>

      <div className="concept-responsive-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(240px, 0.72fr)", gap: "1rem" }}>
        <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.9rem" }}>机制步骤</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
            {active.mechanism.map((item, index) => (
              <div key={item} style={{ background: index === levelIndex ? "var(--cherry-yellow-light)" : "var(--muted)", border: index === levelIndex ? `1.5px solid ${active.color}` : "1.5px solid rgba(94,68,42,0.1)", borderRadius: 16, padding: "0.78rem", minHeight: 112 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: active.color, color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 900, marginBottom: "0.55rem" }}>{index + 1}</div>
                <div style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.58, fontSize: "0.84rem", fontWeight: 800 }}>{item}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gap: "1rem" }}>
          <ContentCard title="辨析">
            {active.compare}
          </ContentCard>
          <ContentCard title="常见误区">
            {active.pitfall}
          </ContentCard>
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
        <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.9rem" }}>课堂流程</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
          {lessonFlow.map((item, index) => (
            <div key={item.title} style={{ background: index === 1 ? "var(--cherry-yellow-light)" : "var(--muted)", border: index === 1 ? `1.5px solid ${active.color}` : "1.5px solid rgba(94,68,42,0.1)", borderRadius: 16, padding: "0.82rem", minHeight: 126 }}>
              <div style={{ color: active.color, fontWeight: 900, marginBottom: "0.45rem", fontSize: "0.82rem" }}>{item.title}</div>
              <div style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.62, fontSize: "0.82rem", fontWeight: 800 }}>{item.body}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900 }}>可复制讲解稿</div>
          <button type="button" onClick={copyLessonOutput} aria-describedby="concept-copy-status" style={{ background: "var(--cherry-yellow-light)", color: "var(--cherry-warm-brown)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 999, padding: "0.42rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
            {copiedLesson ? "已复制" : "复制"}
          </button>
        </div>
        <code style={{ display: "block", whiteSpace: "pre-wrap", background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 16, padding: "0.95rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.78rem", lineHeight: 1.68 }}>
          {lessonOutput}
        </code>
      </div>

      <style>
        {`
          #concept-explainer-tool button:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          #concept-explainer-tool button {
            transition: transform 0.18s ease, box-shadow 0.18s ease;
          }

          #concept-explainer-tool button:hover,
          #concept-explainer-tool button:focus-visible {
            transform: translateY(-2px);
          }

          @media (max-width: 860px) {
            #concept-explainer-tool .concept-responsive-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            #concept-explainer-tool button {
              transition: none !important;
              transform: none !important;
            }
          }
        `}
      </style>
    </section>
  );
}

function CrisprContent() {
  const [guideIndex, setGuideIndex] = useState(0);
  const [step, setStep] = useState<"scan" | "bind" | "cut" | "repair">("scan");
  const [repair, setRepair] = useState<"indel" | "replace" | "failed">("indel");
  const [copiedReport, setCopiedReport] = useState(false);
  const [reportStatus, setReportStatus] = useState("");
  const target = "T A C G A T T A C C G T A G G".split(" ");
  const rnaComplement: Record<string, string> = { A: "U", T: "A", C: "G", G: "C" };
  const targetStart = 4;
  const targetLength = 8;
  const pamStart = 12;
  const guides = [
    { name: "向导 A", sequence: "U A A U G G C A", start: targetStart, score: 96, note: "目标区互补，旁边有 AGG PAM，Cas9 能稳定定位。" },
    { name: "向导 B", sequence: "U A A C G G C A", start: targetStart, score: 68, note: "目标区有 1 个错配，Cas9 仍可能结合，但剪切效率下降。" },
    { name: "向导 C", sequence: "G C A U U A C G", start: 1, score: 32, note: "目标弱匹配且离 PAM 较远，Cas9 很难在预期位点剪切。" },
  ];
  const stages = [
    { key: "scan", label: "找 PAM", text: "Cas9 先扫到 NGG 这类 PAM，才会检查旁边的 DNA 序列。" },
    { key: "bind", label: "配对", text: "向导 RNA 和目标 DNA 形成互补配对，错配会降低稳定性。" },
    { key: "cut", label: "剪切", text: "匹配足够时，Cas9 在 PAM 上游附近切开两条 DNA 链。" },
    { key: "repair", label: "修复", text: "细胞修复切口，结果可能是插入/删除、模板替换或未编辑。" },
  ] as const;
  const activeGuide = guides[guideIndex];
  const guideRange = Array.from({ length: targetLength }).map((_, index) => activeGuide.start + index);
  const guideBases = activeGuide.sequence.split(" ");
  const expectedGuideBases = guideRange.map((index) => rnaComplement[target[index]] ?? "?");
  const computedMismatches = guideBases
    .map((base, index) => (base !== expectedGuideBases[index] ? index : -1))
    .filter((index) => index >= 0);
  const cutIndex = Math.min(target.length - 1, activeGuide.start + 5);
  const pamSequence = target.slice(pamStart).join("");
  const cutDistanceFromPam = pamStart - cutIndex;
  const stepIndex = stages.findIndex((item) => item.key === step);
  const canCut = activeGuide.score >= 60 && stepIndex >= 2;
  const repairActive = step === "repair";
  const repairResults = {
    indel: {
      title: "小片段插入/删除",
      sequence: target.map((base, index) => (index === cutIndex ? "Δ" : base)),
      result: "阅读框可能改变，目标蛋白容易失活。",
      color: "var(--cherry-red)",
    },
    replace: {
      title: "模板引导替换",
      sequence: target.map((base, index) => (index === cutIndex ? "G" : base)),
      result: "如果提供修复模板，细胞可能把指定碱基写入目标位置。",
      color: "var(--cherry-blue)",
    },
    failed: {
      title: "未成功编辑",
      sequence: target,
      result: "细胞完成原样修复，或者 Cas 蛋白没有稳定切开目标位点。",
      color: "var(--cherry-sage)",
    },
  };
  const activeRepair = repairResults[repair];
  const effectiveRepair = activeGuide.score < 60 ? repairResults.failed : activeRepair;
  const guideDecision = activeGuide.score >= 80
    ? {
        level: "推荐继续",
        risk: "定位稳定，适合进入剪切和修复结果讨论。",
        nextAction: "下一步可以比较插入/删除和模板替换两种修复产物。",
        color: "var(--cherry-forest)",
        bg: "var(--cherry-sage-light)",
      }
    : activeGuide.score >= 60
      ? {
          level: "谨慎使用",
          risk: "存在错配或效率下降风险，剪切可能发生但不够理想。",
          nextAction: "先让学生找出错配位置，再比较换用向导 A 后结果如何变化。",
          color: "var(--cherry-yellow)",
          bg: "var(--cherry-yellow-light)",
        }
      : {
          level: "不建议执行",
          risk: "guide 匹配不足或离 PAM 关系不理想，本轮按未成功编辑处理。",
          nextAction: "回到向导 RNA 区域，选择更接近目标互补序列且靠近 PAM 的 guide。",
          color: "var(--cherry-red)",
          bg: "var(--cherry-peach-light)",
        };
  const baseX = (index: number) => 72 + index * 44;
  const casX = canCut ? baseX(cutIndex) : stepIndex >= 1 ? baseX(activeGuide.start + 3) : baseX(pamStart + 1);
  const reportResult = activeGuide.score < 60 ? "guide 匹配不足，Cas9 不稳定定位，本轮按未成功编辑处理。" : activeRepair.result;
  const crisprReport = `【CRISPR 模拟报告】
目标 DNA：${target.join(" ")}
PAM：${pamSequence}

0. 编辑判定
${guideDecision.level}
风险说明：${guideDecision.risk}
建议动作：${guideDecision.nextAction}

1. 向导 RNA
名称：${activeGuide.name}
序列：${activeGuide.sequence}
目标互补序列：${expectedGuideBases.join(" ")}
匹配评分：${activeGuide.score}%
错配数：${computedMismatches.length} 个
说明：${activeGuide.note}

2. 当前步骤
${stages[stepIndex].label}：${stages[stepIndex].text}

3. 剪切判断
${activeGuide.score >= 60 ? `可剪切；位点为第 ${cutIndex + 1} 个碱基，PAM 上游 ${cutDistanceFromPam} nt。` : "不执行剪切；guide 匹配不足。"}

4. 修复结果
${effectiveRepair.title}
产物序列：${effectiveRepair.sequence.join(" ")}
结果解释：${reportResult}`;

  function clearCrisprCopyStatus() {
    setCopiedReport(false);
    setReportStatus("");
  }

  function chooseCrisprStep(nextStep: typeof step) {
    setStep(nextStep);
    clearCrisprCopyStatus();
  }

  function chooseCrisprGuide(index: number) {
    setGuideIndex(index);
    clearCrisprCopyStatus();
  }

  function chooseCrisprRepair(nextRepair: typeof repair) {
    setRepair(nextRepair);
    setStep("repair");
    clearCrisprCopyStatus();
  }

  async function copyCrisprReport() {
    const copiedToClipboard = await copyText(crisprReport);
    if (copiedToClipboard) {
      setCopiedReport(true);
      setReportStatus("模拟报告已复制到剪贴板。");
      window.setTimeout(() => setCopiedReport(false), 1400);
      return;
    }

    setCopiedReport(false);
    setReportStatus("复制失败，请手动选中文本复制。");
  }

  return (
    <section id="crispr-simulator" style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.45fr) minmax(286px, 0.72fr)", gap: "1rem", alignItems: "stretch" }}>
        <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, overflow: "hidden", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
          <svg viewBox="0 0 760 430" role="img" aria-label="CRISPR Cas9 识别、剪切和修复示意图" style={{ width: "100%", display: "block", background: "linear-gradient(180deg, #FFF8EA 0%, #F2E9DB 100%)" }}>
            <rect x={24} y={26} width={708} height={382} rx={90} fill="rgba(169,201,172,0.18)" stroke="rgba(93,140,101,0.28)" strokeWidth={2.5} strokeDasharray="8 8" />
            <text x={42} y={60} fill="var(--cherry-forest)" fontSize={18} fontWeight={900}>
              Cas9 编辑实验台
            </text>
            <g transform="translate(42 74)">
              <rect width={148} height={26} rx={999} fill="rgba(250,247,241,0.78)" stroke="rgba(94,68,42,0.14)" strokeWidth={1.4} />
              <text x={74} y={18} textAnchor="middle" fill="var(--cherry-warm-mid)" fontSize={11} fontWeight={900}>
                SpCas9 / NGG PAM
              </text>
            </g>
            <line x1={60} y1={166} x2={704} y2={166} stroke="url(#crisprStrandA)" strokeWidth={10} strokeLinecap="round" />
            <line x1={60} y1={206} x2={704} y2={206} stroke="url(#crisprStrandB)" strokeWidth={10} strokeLinecap="round" opacity={0.82} />
            <defs>
              <linearGradient id="crisprStrandA" x1="0" x2="1">
                <stop offset="0%" stopColor="var(--cherry-blue)" />
                <stop offset="46%" stopColor="var(--cherry-sage)" />
                <stop offset="100%" stopColor="var(--cherry-red)" />
              </linearGradient>
              <linearGradient id="crisprStrandB" x1="0" x2="1">
                <stop offset="0%" stopColor="var(--cherry-red)" />
                <stop offset="46%" stopColor="var(--cherry-yellow)" />
                <stop offset="100%" stopColor="var(--cherry-blue)" />
              </linearGradient>
            </defs>

            {target.map((base, index) => {
              const inGuide = guideRange.includes(index);
              const inPam = index >= pamStart;
              const mismatch = computedMismatches.includes(index - activeGuide.start);
              return (
                <g key={`${base}-${index}`} transform={`translate(${baseX(index)} 0)`}>
                  <rect x={-15} y={126} width={30} height={30} rx={9} fill={inPam ? "var(--cherry-peach-light)" : inGuide ? "var(--cherry-yellow-light)" : "rgba(250,247,241,0.8)"} stroke={mismatch ? "var(--cherry-red)" : "rgba(94,68,42,0.16)"} strokeWidth={mismatch ? 2.3 : 1.4} />
                  <text x={0} y={146} textAnchor="middle" fill="var(--cherry-warm-brown)" fontSize={13} fontWeight={900}>{base}</text>
                  <line x1={0} y1={160} x2={0} y2={211} stroke="rgba(94,68,42,0.2)" strokeWidth={1.4} />
                </g>
              );
            })}

            <rect x={baseX(pamStart) - 20} y={222} width={122} height={28} rx={999} fill="var(--cherry-peach-light)" stroke="var(--cherry-red)" strokeWidth={1.8} opacity={stepIndex >= 0 ? 1 : 0.4} />
            <text x={baseX(pamStart) + 41} y={241} textAnchor="middle" fill="var(--cherry-warm-brown)" fontSize={12} fontWeight={900}>
              PAM: AGG
            </text>

            <g transform={`translate(${casX} 106)`} style={{ transition: "transform 0.28s ease" }}>
              <path d="M-56 8 C-60 -28 -20 -44 18 -36 C54 -28 66 8 42 34 C20 58 -44 48 -56 8Z" fill={canCut ? "var(--cherry-peach-light)" : "var(--cherry-blue-light)"} stroke={canCut ? "var(--cherry-red)" : "var(--cherry-blue)"} strokeWidth={3} />
              <text x={0} y={10} textAnchor="middle" fill="var(--cherry-warm-brown)" fontSize={15} fontWeight={900}>Cas9</text>
            </g>

            <g opacity={stepIndex >= 1 ? 1 : 0.22}>
              <path d={`M${baseX(activeGuide.start)} 94 C${baseX(activeGuide.start + 2)} 76 ${baseX(activeGuide.start + 5)} 78 ${baseX(activeGuide.start + 7)} 94`} fill="none" stroke="var(--cherry-red)" strokeWidth={7} strokeLinecap="round" />
              {guideBases.map((_, index) => {
                const mismatch = computedMismatches.includes(index);
                const x = baseX(activeGuide.start + index);
                return (
                  <line
                    key={`pairing-${index}`}
                    x1={x}
                    y1={86}
                    x2={x}
                    y2={126}
                    stroke={mismatch ? "var(--cherry-red)" : "var(--cherry-forest)"}
                    strokeWidth={mismatch ? 2.4 : 3.2}
                    strokeLinecap="round"
                    strokeDasharray={mismatch ? "4 5" : undefined}
                    opacity={mismatch ? 0.9 : 0.62}
                  />
                );
              })}
              {guideBases.map((base, index) => (
                <g key={`${base}-${index}`} transform={`translate(${baseX(activeGuide.start + index)} 70)`}>
                  <circle r={14} fill={computedMismatches.includes(index) ? "var(--cherry-peach-light)" : "var(--cherry-red)"} stroke="rgba(94,68,42,0.14)" strokeWidth={1.4} />
                  <text y={4} textAnchor="middle" fill={computedMismatches.includes(index) ? "var(--cherry-warm-brown)" : "#FAF7F1"} fontSize={11} fontWeight={900}>{base}</text>
                </g>
              ))}
            </g>

            {canCut ? (
              <g transform={`translate(${baseX(cutIndex)} 184)`}>
                <path d="M-22 -28 L22 28 M22 -28 L-22 28" stroke="var(--cherry-red)" strokeWidth={4} strokeLinecap="round" />
                <circle r={30} fill="none" stroke="var(--cherry-red)" strokeWidth={2} strokeDasharray="5 5" />
                <text x={0} y={52} textAnchor="middle" fill="var(--cherry-red)" fontSize={12} fontWeight={900}>剪切</text>
                <text x={0} y={68} textAnchor="middle" fill="var(--cherry-warm-mid)" fontSize={10} fontWeight={800}>PAM 上游 {cutDistanceFromPam} nt</text>
              </g>
            ) : null}

            <g transform="translate(72 310)" opacity={repairActive ? 1 : 0.35}>
              <text x={0} y={-18} fill="var(--cherry-warm-brown)" fontSize={14} fontWeight={900}>修复产物</text>
              {effectiveRepair.sequence.map((base, index) => (
                <g key={`${base}-${index}`} transform={`translate(${index * 38} 0)`}>
                  <rect x={-14} y={-14} width={28} height={28} rx={8} fill={index === cutIndex ? "var(--cherry-yellow-light)" : "rgba(250,247,241,0.86)"} stroke={index === cutIndex ? effectiveRepair.color : "rgba(94,68,42,0.14)"} strokeWidth={index === cutIndex ? 2.4 : 1.4} />
                  <text y={5} textAnchor="middle" fill="var(--cherry-warm-brown)" fontSize={12} fontWeight={900}>{base}</text>
                </g>
              ))}
            </g>
          </svg>
        </div>

        <aside style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.75rem" }}>流程控制</div>
            <div style={{ display: "grid", gap: 7 }}>
              {stages.map((item, index) => (
                <button key={item.key} type="button" aria-pressed={step === item.key} onClick={() => chooseCrisprStep(item.key)} style={{ display: "grid", gridTemplateColumns: "26px 1fr", gap: 8, alignItems: "start", textAlign: "left", background: step === item.key ? "var(--cherry-sage-light)" : "var(--muted)", border: step === item.key ? "1.5px solid var(--cherry-forest)" : "1.5px solid var(--border)", borderRadius: 14, padding: "0.62rem", cursor: "pointer" }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: stepIndex >= index ? "var(--cherry-forest)" : "rgba(250,247,241,0.9)", color: stepIndex >= index ? "#FAF7F1" : "var(--cherry-warm-mid)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 900 }}>{index + 1}</span>
                  <span>
                    <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.82rem" }}>{item.label}</strong>
                    <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.55 }}>{item.text}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.75rem" }}>向导 RNA</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: "0.75rem" }}>
              {guides.map((guide, index) => (
                <button key={guide.name} type="button" aria-pressed={guideIndex === index} onClick={() => chooseCrisprGuide(index)} style={{ background: guideIndex === index ? "var(--cherry-forest)" : "var(--muted)", color: guideIndex === index ? "#FAF7F1" : "var(--cherry-warm-brown)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.4rem 0.74rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                  {guide.name}
                </button>
              ))}
            </div>
            <code style={{ display: "block", background: "var(--cherry-yellow-light)", borderRadius: 12, padding: "0.65rem", color: "var(--cherry-warm-brown)", fontSize: "0.78rem", fontWeight: 900, whiteSpace: "pre-wrap", marginBottom: "0.7rem" }}>{activeGuide.sequence}</code>
            <div style={{ height: 10, borderRadius: 999, background: "var(--muted)", overflow: "hidden", marginBottom: "0.55rem" }}>
              <div style={{ width: `${activeGuide.score}%`, height: "100%", background: activeGuide.score > 80 ? "var(--cherry-sage)" : activeGuide.score > 50 ? "var(--cherry-yellow)" : "var(--cherry-red)", transition: "width 0.25s ease" }} />
            </div>
            <div style={{ color: "var(--cherry-red)", fontSize: "1.35rem", fontWeight: 900, marginBottom: "0.45rem" }}>{activeGuide.score}%</div>
            <div role="status" aria-live="polite" style={{ background: guideDecision.bg, border: `1.5px solid ${guideDecision.color}`, borderRadius: 14, padding: "0.68rem", color: "var(--cherry-warm-mid)", lineHeight: 1.58, fontSize: "0.8rem", fontWeight: 800, marginBottom: "0.75rem" }}>
              <strong style={{ display: "block", color: guideDecision.color, marginBottom: "0.28rem" }}>{guideDecision.level}</strong>
              {guideDecision.risk}
              <div style={{ marginTop: "0.42rem", color: "var(--cherry-warm-brown)" }}>{guideDecision.nextAction}</div>
            </div>
            <div style={{ background: "rgba(250,247,241,0.74)", border: "1.5px solid rgba(94,68,42,0.1)", borderRadius: 12, padding: "0.6rem", color: "var(--cherry-warm-mid)", fontSize: "0.76rem", fontWeight: 800, marginBottom: "0.75rem" }}>
              目标互补序列：<strong style={{ color: "var(--cherry-warm-brown)" }}>{expectedGuideBases.join(" ")}</strong>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: "0.45rem", color: "var(--cherry-warm-mid)", fontSize: "0.7rem" }}>
                <span><strong style={{ color: "var(--cherry-forest)" }}>实线</strong> 互补</span>
                <span><strong style={{ color: "var(--cherry-red)" }}>虚线</strong> 错配</span>
              </div>
            </div>
            <div style={{ display: "grid", gap: 6, marginBottom: "0.75rem" }}>
              {[
                ["PAM", pamSequence],
                ["剪切位点", activeGuide.score >= 60 ? `第 ${cutIndex + 1} 个碱基，PAM 上游 ${cutDistanceFromPam} nt` : "匹配不足，不执行剪切"],
                ["错配数", `${computedMismatches.length} 个`],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 10, color: "var(--cherry-warm-mid)", fontSize: "0.78rem", fontWeight: 800 }}>
                  <span>{label}</span>
                  <span style={{ color: "var(--cherry-warm-brown)", textAlign: "right", fontWeight: 900 }}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.82rem" }}>{activeGuide.note}</div>
          </div>
        </aside>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.85rem" }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900 }}>修复结果</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {([
              ["indel", "插入/删除"],
              ["replace", "模板替换"],
              ["failed", "未成功编辑"],
            ] as const).map(([key, label]) => (
              <button key={key} type="button" aria-pressed={repair === key} onClick={() => chooseCrisprRepair(key)} style={{ background: repair === key ? "var(--cherry-forest)" : "var(--muted)", color: repair === key ? "#FAF7F1" : "var(--cherry-warm-brown)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.42rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.8rem" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div role="status" aria-live="polite" style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.7, fontSize: "0.9rem" }}>
          <strong style={{ color: effectiveRepair.color }}>{effectiveRepair.title}：</strong>
          {reportResult}
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.1rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900 }}>模拟报告</div>
          <button type="button" onClick={copyCrisprReport} aria-describedby="crispr-report-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.46rem 0.82rem", fontWeight: 900, cursor: "pointer", fontSize: "0.8rem" }}>
            {copiedReport ? "已复制" : "复制报告"}
          </button>
        </div>
        <div id="crispr-report-status" role="status" aria-live="polite" style={{ minHeight: "1.05rem", color: "var(--cherry-forest)", fontSize: "0.76rem", fontWeight: 900, marginBottom: "0.55rem" }}>
          {reportStatus}
        </div>
        <code style={{ display: "block", whiteSpace: "pre-wrap", background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 16, padding: "0.9rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.78rem", lineHeight: 1.65 }}>
          {crisprReport}
        </code>
      </div>

      <style>
        {`
          #crispr-simulator button:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          #crispr-simulator button {
            transition: transform 0.18s ease, box-shadow 0.18s ease;
          }

          #crispr-simulator button:hover,
          #crispr-simulator button:focus-visible {
            transform: translateY(-2px);
          }

          @media (max-width: 880px) {
            #crispr-simulator > div:first-child {
              grid-template-columns: 1fr !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            #crispr-simulator button {
              transition: none !important;
              transform: none !important;
            }
          }
        `}
      </style>
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

const richWorkSlugs = ["research-prompt-kit", "plant-evolution-stories", "concept-explainer", "crispr-interactive"];

function hasRichWorkContent(slug: string) {
  return richWorkSlugs.includes(slug);
}

function WorkHero({ work, compact = false }: { work: Work; compact?: boolean }) {
  return (
    <section
      style={{
        padding: compact ? "0.48rem 1.5rem" : "1.15rem 1.5rem 0.75rem",
        background: "var(--background)",
        fontFamily: "'Nunito', sans-serif",
        borderBottom: "1px solid rgba(94,68,42,0.1)",
      }}
    >
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        {!compact ? (
          <a
            className="work-detail-back-link"
            href="/#works"
            onClick={(event) => {
              if (!shouldUseClientNavigation(event)) return;
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
              marginBottom: "0.65rem",
            }}
          >
            ← 回到作品集
          </a>
        ) : null}

        <div
          className="work-detail-hero-row"
          style={{
            display: "grid",
            gridTemplateColumns: compact ? "auto auto minmax(0, 1fr)" : "auto minmax(0, 1fr)",
            alignItems: "center",
            gap: compact ? "0.58rem" : "0.75rem",
          }}
        >
          {compact ? (
            <a
              className="work-detail-back-link"
              href="/#works"
              onClick={(event) => {
                if (!shouldUseClientNavigation(event)) return;
                event.preventDefault();
                navigateHome("#works");
              }}
              aria-label="回到作品集"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                color: "var(--cherry-forest)",
                background: "var(--card)",
                border: "1.5px solid var(--border)",
                borderRadius: 999,
                textDecoration: "none",
                fontWeight: 900,
                fontSize: "1rem",
              }}
            >
              ←
            </a>
          ) : null}
          <div
            style={{
              width: compact ? 34 : 50,
              height: compact ? 34 : 50,
              borderRadius: compact ? 11 : 16,
              background: work.color,
              border: `1.5px solid ${work.border}`,
              display: "grid",
              placeItems: "center",
              boxShadow: "3px 5px 0px rgba(94,68,42,0.08)",
            }}
          >
            <div style={{ transform: "scale(0.72)" }}>{work.icon}</div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: compact ? 8 : 10, flexWrap: "wrap", marginBottom: compact ? 0 : "0.2rem" }}>
              <h1
                style={{
                  color: "var(--cherry-warm-brown)",
                  fontSize: compact ? "clamp(1rem, 2.2vw, 1.22rem)" : "clamp(1.35rem, 3vw, 1.85rem)",
                  fontWeight: 900,
                  lineHeight: 1.18,
                  margin: 0,
                }}
              >
                {work.title}
              </h1>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                <span
                  style={{
                    background: work.color,
                    color: "var(--cherry-forest)",
                    border: `1px solid ${work.border}`,
                    borderRadius: 999,
                    padding: compact ? "0.11rem 0.48rem" : "0.16rem 0.55rem",
                    fontSize: compact ? "0.66rem" : "0.7rem",
                    fontWeight: 900,
                  }}
                >
                  {work.category}
                </span>
                {work.tags.slice(0, compact ? 2 : work.tags.length).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "rgba(250,247,241,0.78)",
                      color: "var(--cherry-warm-mid)",
                      border: "1px solid rgba(94,68,42,0.1)",
                      borderRadius: 999,
                      padding: compact ? "0.11rem 0.48rem" : "0.16rem 0.55rem",
                      fontSize: compact ? "0.66rem" : "0.7rem",
                      fontWeight: 900,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {compact ? null : (
              <p style={{ color: "var(--cherry-warm-mid)", fontSize: "0.85rem", lineHeight: 1.5, maxWidth: 780, margin: 0 }}>
                {work.desc}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkContinueLinks({ work }: { work: Work }) {
  const relatedWorks = [
    ...works.filter((item) => item.slug !== work.slug && item.category === work.category),
    ...works.filter((item) => item.slug !== work.slug && item.category !== work.category),
  ].slice(0, 2);

  if (relatedWorks.length === 0) return null;

  function openWork(href: string, event: React.MouseEvent<HTMLAnchorElement>) {
    if (!shouldUseClientNavigation(event)) return;
    event.preventDefault();
    navigateClient(href);
  }

  return (
    <section style={{ padding: "0 1.5rem 5rem", fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gap: "0.9rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <h2 style={{ color: "var(--cherry-warm-brown)", fontSize: "1.08rem", fontWeight: 900, margin: 0 }}>继续打开</h2>
          <a
            className="work-detail-link"
            href="/#works"
            onClick={(event) => {
              if (!shouldUseClientNavigation(event)) return;
              event.preventDefault();
              navigateHome("#works");
            }}
            style={{ color: "var(--cherry-forest)", textDecoration: "none", fontWeight: 900, fontSize: "0.84rem" }}
          >
            全部作品 →
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.85rem" }}>
          {relatedWorks.map((item) => {
            const isPlantEvolution = item.slug === "plant-evolution-stories";

            return (
              <a
                className="work-next-card"
                key={item.slug}
                href={item.href}
                onClick={(event) => openWork(item.href, event)}
                style={{
                  display: "grid",
                  gridTemplateColumns: isPlantEvolution ? "92px minmax(0, 1fr)" : "118px minmax(0, 1fr)",
                  gap: "0.85rem",
                  alignItems: "center",
                  background: item.color,
                  border: `1.5px solid ${item.border}`,
                  borderRadius: 18,
                  padding: "0.9rem",
                  color: "inherit",
                  textDecoration: "none",
                  boxShadow: "3px 5px 0px rgba(94,68,42,0.07)",
                  minWidth: 0,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    minHeight: isPlantEvolution ? 142 : 94,
                    borderRadius: 16,
                    background: "rgba(250,247,241,0.56)",
                    border: "1.5px dashed rgba(94,68,42,0.12)",
                    display: "grid",
                    placeItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <WorkPreviewIllustration slug={item.slug} color={item.border} width={isPlantEvolution ? 78 : 112} height={isPlantEvolution ? 130 : 84} />
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 10, background: "rgba(250,247,241,0.64)", marginBottom: "0.42rem" }}>
                    <span style={{ transform: "scale(0.54)", display: "inline-flex" }}>{item.icon}</span>
                  </span>
                  <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.92rem", lineHeight: 1.35, marginBottom: "0.34rem" }}>{item.title}</strong>
                  <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.5, marginBottom: "0.5rem" }}>{item.desc}</span>
                  <span style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {item.outputs.map((output) => (
                      <span key={output} style={{ background: "rgba(250,247,241,0.74)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 999, padding: "0.13rem 0.46rem", color: "var(--cherry-warm-brown)", fontSize: "0.66rem", fontWeight: 900 }}>
                        {output}
                      </span>
                    ))}
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WorkSequenceLinks({ work }: { work: Work }) {
  const currentIndex = works.findIndex((item) => item.slug === work.slug);
  const previousWork = currentIndex > 0 ? works[currentIndex - 1] : null;
  const nextWork = currentIndex >= 0 && currentIndex < works.length - 1 ? works[currentIndex + 1] : null;

  if (!previousWork && !nextWork) return null;

  function openWork(href: string, event: React.MouseEvent<HTMLAnchorElement>) {
    if (!shouldUseClientNavigation(event)) return;
    event.preventDefault();
    navigateClient(href);
  }

  const navItems = [
    previousWork ? { label: "上一个作品", direction: "←", work: previousWork, align: "left" as const } : null,
    nextWork ? { label: "下一个作品", direction: "→", work: nextWork, align: "right" as const } : null,
  ].filter((item): item is { label: string; direction: string; work: Work; align: "left" | "right" } => Boolean(item));

  return (
    <section style={{ padding: "0 1.5rem 1rem", fontFamily: "'Nunito', sans-serif" }}>
      <nav aria-label="作品前后导航" style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.85rem" }}>
        {navItems.map((item) => (
          <a
            className="work-sequence-card"
            key={item.work.slug}
            href={item.work.href}
            onClick={(event) => openWork(item.work.href, event)}
            style={{
              display: "grid",
              gap: "0.45rem",
              justifyItems: item.align === "right" ? "end" : "start",
              textAlign: item.align,
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 18,
              padding: "0.95rem",
              color: "inherit",
              textDecoration: "none",
              boxShadow: "3px 5px 0px rgba(94,68,42,0.06)",
              minWidth: 0,
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'Caveat', cursive", color: "var(--cherry-forest)", fontWeight: 900, fontSize: "1rem" }}>
              {item.align === "left" ? item.direction : null}
              {item.label}
              {item.align === "right" ? item.direction : null}
            </span>
            <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.95rem", lineHeight: 1.38, overflowWrap: "anywhere" }}>{item.work.title}</strong>
            <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.5, overflowWrap: "anywhere" }}>{item.work.desc}</span>
          </a>
        ))}
      </nav>
    </section>
  );
}

export function WorkDetailPage({ slug }: { slug: string }) {
  const work = works.find((item) => item.slug === slug);

  if (!work) {
    return (
      <section id="main-content" tabIndex={-1} style={{ padding: "5rem 1.5rem", maxWidth: 720, margin: "0 auto", fontFamily: "'Nunito', sans-serif" }}>
        <a
          className="work-detail-back-link"
          href="/#works"
          onClick={(event) => {
            if (!shouldUseClientNavigation(event)) return;
            event.preventDefault();
            navigateHome("#works");
          }}
          style={{ color: "var(--cherry-forest)", fontWeight: 900, textDecoration: "none" }}
        >
          ← 回到作品集
        </a>
        <h1 style={{ color: "var(--cherry-warm-brown)", fontSize: "2rem", marginTop: "1.5rem" }}>没有找到这个小作品</h1>
        <style>
          {`
            .work-detail-back-link:focus-visible {
              outline: 3px solid var(--cherry-red);
              outline-offset: 4px;
            }

            .work-detail-back-link:hover,
            .work-detail-back-link:focus-visible {
              color: var(--cherry-red) !important;
            }
          `}
        </style>
      </section>
    );
  }

  return (
    <main id="main-content" tabIndex={-1}>
      <WorkHero work={work} compact />

      {hasRichWorkContent(work.slug) ? (
        <section
          style={{
            padding: "0 1.5rem 5rem",
            maxWidth: 1060,
            margin: "0 auto",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          <RichWorkContent slug={work.slug} />
        </section>
      ) : null}
      {work.slug === "gene-expression" ? <GeneExpressionTool /> : null}
      <WorkSequenceLinks work={work} />
      <WorkContinueLinks work={work} />
      <style>
        {`
          .work-detail-back-link:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          .work-detail-back-link:hover,
          .work-detail-back-link:focus-visible {
            color: var(--cherry-red) !important;
          }

          .work-detail-link:focus-visible,
          .work-sequence-card:focus-visible,
          .work-next-card:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          .work-sequence-card,
          .work-next-card {
            transition: transform 0.18s ease, box-shadow 0.18s ease;
          }

          .work-sequence-card:hover,
          .work-sequence-card:focus-visible,
          .work-next-card:hover,
          .work-next-card:focus-visible {
            transform: translateY(-2px);
            box-shadow: 4px 8px 0 rgba(94,68,42,0.1) !important;
          }

          @media (prefers-reduced-motion: reduce) {
            .work-sequence-card,
            .work-next-card {
              transition: none !important;
              transform: none !important;
            }
          }

          @media (max-width: 560px) {
            .work-next-card {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </main>
  );
}
