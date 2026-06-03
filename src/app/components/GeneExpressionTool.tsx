import { useMemo, useState } from "react";
import { IconAI, IconArrowRight, IconBook, IconCheck, IconDNA, IconFlask, IconMicroscope, IconSparkle } from "./Icons";

const steps = [
  {
    label: "看见 DNA",
    title: "基因是一段可以被读取的 DNA",
    text: "这段 DNA 像一小段说明书。细胞不会直接把整本说明书拿去做蛋白质，而是先读取其中需要的一段。",
  },
  {
    label: "转录",
    title: "DNA 模板被转录成 mRNA",
    text: "转录时，细胞根据 DNA 模板生成一条 mRNA。这里把 T 换成 U，是 RNA 和 DNA 的一个重要区别。",
  },
  {
    label: "进入核糖体",
    title: "mRNA 把信息带到核糖体",
    text: "mRNA 像一张临时抄写的小纸条，把基因信息带到负责合成蛋白质的核糖体附近。",
  },
  {
    label: "翻译",
    title: "核糖体每三个碱基读取一次",
    text: "mRNA 上每三个碱基组成一个密码子。核糖体按密码子顺序连接对应的氨基酸。",
  },
  {
    label: "形成蛋白质",
    title: "氨基酸链折叠成蛋白质",
    text: "多个氨基酸连接成链，之后会进一步折叠，形成具有特定功能的蛋白质。",
  },
];

const codons = [
  { dna: "ATG", rna: "AUG", amino: "Met" },
  { dna: "GAA", rna: "GAA", amino: "Glu" },
  { dna: "TTT", rna: "UUU", amino: "Phe" },
  { dna: "CCG", rna: "CCG", amino: "Pro" },
];

const quiz = [
  {
    question: "mRNA 主要由哪个过程产生？",
    options: ["转录", "翻译", "光合作用"],
    answer: "转录",
  },
  {
    question: "mRNA 中每几个碱基通常组成一个密码子？",
    options: ["1 个", "3 个", "6 个"],
    answer: "3 个",
  },
  {
    question: "翻译主要发生在哪里？",
    options: ["核糖体", "细胞壁", "叶绿体基质"],
    answer: "核糖体",
  },
  {
    question: "蛋白质的基本组成单位是什么？",
    options: ["氨基酸", "葡萄糖", "脂肪酸"],
    answer: "氨基酸",
  },
  {
    question: "RNA 中通常用哪个碱基替代 DNA 里的 T？",
    options: ["U", "C", "G"],
    answer: "U",
  },
];

function SequencePill({ text, active, muted = false }: { text: string; active: boolean; muted?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 48,
        padding: "0.38rem 0.62rem",
        borderRadius: 999,
        background: active ? "var(--cherry-yellow-light)" : muted ? "rgba(250,247,241,0.5)" : "var(--card)",
        border: active ? "1.5px solid var(--cherry-yellow)" : "1.5px solid var(--border)",
        color: active ? "var(--cherry-bark)" : "var(--cherry-warm-mid)",
        fontWeight: 800,
        fontSize: "0.8rem",
        transition: "all 0.25s ease",
      }}
    >
      {text}
    </span>
  );
}

function ProteinBead({ amino, index, visible }: { amino: string; index: number; visible: boolean }) {
  const colors = ["var(--cherry-peach)", "var(--cherry-yellow)", "var(--cherry-sage)", "var(--cherry-blue)"];

  return (
    <div
      style={{
        width: 58,
        height: 58,
        borderRadius: "50%",
        background: colors[index % colors.length],
        border: "2px solid rgba(94,68,42,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--cherry-warm-brown)",
        fontWeight: 900,
        fontSize: "0.78rem",
        boxShadow: "3px 5px 0px rgba(94,68,42,0.1)",
        opacity: visible ? 1 : 0.18,
        transform: visible ? "translateY(0) scale(1)" : "translateY(10px) scale(0.9)",
        transition: "all 0.3s ease",
      }}
    >
      {amino}
    </div>
  );
}

export function GeneExpressionTool() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const activeCodonIndex = useMemo(() => {
    if (step < 3) return -1;
    if (step === 3) return 1;
    return 3;
  }, [step]);

  const correctCount = quiz.reduce((count, item, index) => {
    return count + (answers[index] === item.answer ? 1 : 0);
  }, 0);

  return (
    <section
      id="gene-expression"
      style={{
        fontFamily: "'Nunito', sans-serif",
        padding: "5rem 1.5rem",
        maxWidth: 1120,
        margin: "0 auto",
        position: "relative",
        scrollMarginTop: 76,
      }}
    >
      <div style={{ position: "absolute", top: 46, right: 8, opacity: 0.16, pointerEvents: "none" }}>
        <IconDNA size={88} color1="var(--cherry-blue)" color2="var(--cherry-red)" />
      </div>

      <div style={{ marginBottom: "2.2rem", maxWidth: 720 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: "0.75rem" }}>
          <IconMicroscope size={20} color="var(--cherry-warm-mid)" />
          <span style={{ fontFamily: "'Caveat', cursive", fontSize: "1rem", color: "var(--cherry-warm-mid)", fontWeight: 700 }}>
            第一个落地小工具
          </span>
        </div>
        <h2
          style={{
            color: "var(--cherry-warm-brown)",
            fontSize: "clamp(1.7rem, 3.6vw, 2.35rem)",
            fontWeight: 900,
            lineHeight: 1.25,
            marginBottom: "0.8rem",
          }}
        >
          基因表达可视化
        </h2>
        <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.75, fontSize: "0.95rem" }}>
          拖动步骤，看 DNA 如何经过转录和翻译，变成一条由氨基酸连接起来的蛋白质小链。
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.35fr) minmax(280px, 0.65fr)",
          gap: "1.5rem",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            background: "var(--card)",
            border: "1.5px solid var(--border)",
            borderRadius: 22,
            padding: "1.4rem",
            boxShadow: "5px 8px 0px rgba(94,68,42,0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconFlask size={22} color="var(--cherry-sage)" />
              <strong style={{ color: "var(--cherry-warm-brown)" }}>互动流程图</strong>
            </div>
            <span
              style={{
                background: "var(--cherry-peach-light)",
                color: "var(--cherry-red)",
                borderRadius: 999,
                padding: "0.25rem 0.75rem",
                fontSize: "0.76rem",
                fontWeight: 800,
              }}
            >
              Step {step + 1} / {steps.length}
            </span>
          </div>

          <input
            aria-label="基因表达步骤"
            type="range"
            min={0}
            max={steps.length - 1}
            value={step}
            onChange={(event) => setStep(Number(event.target.value))}
            style={{ width: "100%", accentColor: "var(--cherry-red)", marginBottom: "0.9rem" }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 7, marginBottom: "1.4rem" }}>
            {steps.map((item, index) => (
              <button
                key={item.label}
                onClick={() => setStep(index)}
                style={{
                  minHeight: 42,
                  borderRadius: 12,
                  border: index === step ? "1.5px solid var(--cherry-forest)" : "1.5px solid var(--border)",
                  background: index === step ? "var(--cherry-sage-light)" : "rgba(250,247,241,0.75)",
                  color: index === step ? "var(--cherry-forest)" : "var(--cherry-warm-mid)",
                  fontWeight: 800,
                  fontSize: "0.74rem",
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div
            style={{
              background: "linear-gradient(180deg, rgba(245,237,204,0.65), rgba(250,247,241,0.9))",
              border: "1.5px dashed rgba(94,68,42,0.2)",
              borderRadius: 18,
              padding: "1rem",
            }}
          >
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: "0.55rem", color: "var(--cherry-warm-brown)", fontWeight: 900 }}>
                  <IconDNA size={22} /> DNA
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {codons.map((item, index) => (
                    <SequencePill key={item.dna} text={item.dna} active={step === 0 || activeCodonIndex === index} muted={step > 1} />
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--cherry-warm-mid)", fontWeight: 800, opacity: step >= 1 ? 1 : 0.35, transition: "opacity 0.25s" }}>
                <IconArrowRight size={16} color="var(--cherry-red)" />
                转录：T 变成 U，生成 mRNA
              </div>

              <div style={{ opacity: step >= 1 ? 1 : 0.25, transform: step >= 1 ? "translateX(0)" : "translateX(-10px)", transition: "all 0.3s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: "0.55rem", color: "var(--cherry-warm-brown)", fontWeight: 900 }}>
                  <IconBook size={21} /> mRNA
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {codons.map((item, index) => (
                    <SequencePill key={item.rna} text={item.rna} active={step >= 3 && activeCodonIndex >= index} muted={step < 1} />
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(130px, 190px) minmax(0, 1fr)",
                  gap: "1rem",
                  alignItems: "center",
                  marginTop: "0.2rem",
                }}
              >
                <div
                  style={{
                    minHeight: 108,
                    borderRadius: "48% 52% 45% 55% / 55% 45% 55% 45%",
                    background: step >= 2 ? "var(--cherry-blue-light)" : "rgba(194,220,233,0.28)",
                    border: "2px solid rgba(122,175,200,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    color: "var(--cherry-warm-brown)",
                    fontWeight: 900,
                    transition: "all 0.25s ease",
                  }}
                >
                  核糖体
                  <br />
                  ribosome
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: "0.7rem", color: "var(--cherry-warm-brown)", fontWeight: 900 }}>
                    <IconSparkle size={17} color="var(--cherry-peach)" /> 蛋白质小链
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    {codons.map((item, index) => (
                      <ProteinBead key={item.amino} amino={item.amino} index={index} visible={step >= 4 || (step >= 3 && index <= activeCodonIndex)} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside
          style={{
            display: "grid",
            gap: "1rem",
            alignContent: "start",
          }}
        >
          <div
            style={{
              background: "var(--cherry-yellow-light)",
              border: "1.5px solid var(--cherry-yellow)",
              borderRadius: 20,
              padding: "1.25rem",
              boxShadow: "4px 7px 0px rgba(94,68,42,0.08)",
            }}
          >
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: "1rem", color: "var(--cherry-warm-mid)", fontWeight: 700, marginBottom: "0.4rem" }}>
              这一幕在讲
            </div>
            <h3 style={{ color: "var(--cherry-warm-brown)", fontSize: "1.05rem", fontWeight: 900, lineHeight: 1.45, marginBottom: "0.55rem" }}>
              {steps[step].title}
            </h3>
            <p style={{ color: "var(--cherry-warm-mid)", fontSize: "0.88rem", lineHeight: 1.75 }}>
              {steps[step].text}
            </p>
          </div>

          <div
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 20,
              padding: "1.25rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: "1rem" }}>
              <strong style={{ color: "var(--cherry-warm-brown)" }}>即时小测</strong>
              <span style={{ color: "var(--cherry-red)", fontWeight: 900, fontSize: "0.82rem" }}>
                {correctCount} / {quiz.length}
              </span>
            </div>

            <div style={{ display: "grid", gap: "0.9rem" }}>
              {quiz.map((item, index) => {
                const chosen = answers[index];
                const isCorrect = chosen === item.answer;

                return (
                  <div key={item.question}>
                    <p style={{ color: "var(--cherry-warm-brown)", fontSize: "0.82rem", fontWeight: 800, lineHeight: 1.45, marginBottom: "0.45rem" }}>
                      {index + 1}. {item.question}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {item.options.map((option) => {
                        const selected = chosen === option;

                        return (
                          <button
                            key={option}
                            onClick={() => setAnswers((prev) => ({ ...prev, [index]: option }))}
                            style={{
                              border: selected ? "1.5px solid var(--cherry-forest)" : "1.5px solid var(--border)",
                              background: selected ? (isCorrect ? "var(--cherry-sage-light)" : "var(--cherry-peach-light)") : "rgba(250,247,241,0.75)",
                              color: selected ? "var(--cherry-warm-brown)" : "var(--cherry-warm-mid)",
                              borderRadius: 999,
                              padding: "0.28rem 0.62rem",
                              fontSize: "0.75rem",
                              fontWeight: 800,
                              cursor: "pointer",
                            }}
                          >
                            {selected && isCorrect ? <IconCheck size={12} color="var(--cherry-forest)" /> : null} {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setAnswers({})}
              style={{
                marginTop: "1rem",
                border: "1.5px solid var(--border)",
                background: "transparent",
                color: "var(--cherry-warm-mid)",
                borderRadius: 999,
                padding: "0.42rem 0.85rem",
                fontWeight: 800,
                fontSize: "0.78rem",
                cursor: "pointer",
              }}
            >
              重新作答
            </button>
          </div>
        </aside>
      </div>

      <style>
        {`
          @media (max-width: 860px) {
            #gene-expression > div:nth-of-type(2) {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 560px) {
            #gene-expression {
              padding-left: 1rem !important;
              padding-right: 1rem !important;
            }

            #gene-expression button {
              min-width: 0;
            }
          }
        `}
      </style>
    </section>
  );
}
