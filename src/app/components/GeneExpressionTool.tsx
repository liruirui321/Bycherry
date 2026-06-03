import { useMemo, useState } from "react";
import { IconCheck, IconDNA, IconFlask, IconMicroscope, IconSparkle } from "./Icons";

const dnaCodons = ["ATG", "GAA", "TTT", "CCG"];
const rnaCodons = ["AUG", "GAA", "UUU", "CCG"];
const aminoAcids = [
  { label: "Met", color: "var(--cherry-peach)" },
  { label: "Glu", color: "var(--cherry-yellow)" },
  { label: "Phe", color: "var(--cherry-sage)" },
  { label: "Pro", color: "var(--cherry-blue)" },
];

function SliderControl({
  label,
  value,
  setValue,
  note,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
  note: string;
}) {
  return (
    <label style={{ display: "grid", gap: "0.45rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
        <span style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.86rem" }}>{label}</span>
        <span style={{ fontFamily: "'Caveat', cursive", color: "var(--cherry-red)", fontWeight: 800 }}>{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={5}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        style={{ width: "100%", accentColor: "var(--cherry-red)" }}
      />
      <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.5 }}>{note}</span>
    </label>
  );
}

function StageBadge({ number, title, active }: { number: string; title: string; active: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: active ? "var(--cherry-sage-light)" : "rgba(250,247,241,0.76)",
        border: active ? "1.5px solid var(--cherry-sage)" : "1.5px solid var(--border)",
        borderRadius: 999,
        padding: "0.42rem 0.75rem",
        color: "var(--cherry-warm-brown)",
        fontWeight: 900,
        fontSize: "0.78rem",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: active ? "var(--cherry-forest)" : "var(--muted)",
          color: active ? "#FAF7F1" : "var(--cherry-warm-mid)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.72rem",
        }}
      >
        {number}
      </span>
      {title}
    </div>
  );
}

function FloatingMolecule({
  label,
  left,
  top,
  color,
  delay,
}: {
  label: string;
  left: string;
  top: string;
  color: string;
  delay: number;
}) {
  return (
    <span
      className="gene-floating-molecule"
      style={{
        left,
        top,
        background: color,
        animationDelay: `${delay}s`,
      }}
    >
      {label}
    </span>
  );
}

function CodonStrip({ type }: { type: "dna" | "rna" }) {
  const source = type === "dna" ? dnaCodons : rnaCodons;
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {source.map((codon, index) => (
        <span
          key={`${type}-${codon}-${index}`}
          style={{
            background: type === "dna" ? "rgba(141,190,221,0.28)" : "rgba(232,121,95,0.22)",
            border: "1.5px solid rgba(94,68,42,0.15)",
            borderRadius: 10,
            padding: "0.3rem 0.52rem",
            color: "var(--cherry-warm-brown)",
            fontWeight: 900,
            fontSize: "0.74rem",
          }}
        >
          {codon}
        </span>
      ))}
    </div>
  );
}

function ProteinChain({ active }: { active: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
      {aminoAcids.map((amino, index) => (
        <span
          key={amino.label}
          className={active ? "gene-amino-active" : ""}
          style={{
            width: 45,
            height: 45,
            borderRadius: "50%",
            background: amino.color,
            border: "1.5px solid rgba(94,68,42,0.2)",
            boxShadow: "3px 4px 0px rgba(94,68,42,0.08)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--cherry-warm-brown)",
            fontWeight: 900,
            fontSize: "0.7rem",
            opacity: active ? 1 : 0.25,
            animationDelay: `${index * 0.45}s`,
          }}
        >
          {amino.label}
        </span>
      ))}
    </div>
  );
}

function ProteinPile({ count }: { count: number }) {
  const visible = Math.min(12, Math.max(0, count));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 22px)", gap: 7, minHeight: 80, alignContent: "end" }}>
      {Array.from({ length: 12 }).map((_, index) => (
        <span
          key={index}
          className={index < visible ? "gene-protein-pop" : ""}
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: index < visible ? aminoAcids[index % aminoAcids.length].color : "rgba(94,68,42,0.08)",
            border: "1.3px solid rgba(94,68,42,0.15)",
            boxShadow: index < visible ? "2px 3px 0 rgba(94,68,42,0.08)" : "none",
            opacity: index < visible ? 1 : 0.34,
            animationDelay: `${index * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}

export function GeneExpressionTool() {
  const [transcriptionFactors, setTranscriptionFactors] = useState(3);
  const [polymerase, setPolymerase] = useState(3);
  const [ribosomes, setRibosomes] = useState(3);

  const expression = useMemo(() => {
    const promoterAccess = transcriptionFactors / 5;
    const transcriptionRate = Math.round(promoterAccess * polymerase * 2);
    const mrna = Math.max(0, transcriptionRate);
    const protein = Math.round(mrna * (0.6 + ribosomes / 4));
    const transcriptionActive = transcriptionFactors > 0 && polymerase > 0;
    const translationActive = transcriptionActive && ribosomes > 0 && mrna > 0;
    const polDuration = Math.max(2.4, 7.2 - polymerase * 0.72 - transcriptionFactors * 0.26);
    const ribosomeDuration = Math.max(2.1, 6.5 - ribosomes * 0.75);
    const mrnaLanes = Math.min(5, Math.max(0, mrna));
    const proteinDisplay = Math.min(12, protein);

    return {
      promoterAccess,
      mrna,
      protein,
      transcriptionActive,
      translationActive,
      polDuration,
      ribosomeDuration,
      mrnaLanes,
      proteinDisplay,
    };
  }, [transcriptionFactors, polymerase, ribosomes]);

  return (
    <section
      id="gene-expression"
      style={{
        fontFamily: "'Nunito', sans-serif",
        padding: "2rem 1.5rem 5rem",
        maxWidth: 1180,
        margin: "0 auto",
        position: "relative",
        scrollMarginTop: 76,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.45fr) minmax(300px, 0.75fr)", gap: "1.2rem", alignItems: "stretch" }}>
        <div
          style={{
            minHeight: 650,
            background: "linear-gradient(180deg, #FFF8EA 0%, #F4E8D7 100%)",
            border: "1.5px solid var(--border)",
            borderRadius: 30,
            boxShadow: "6px 10px 0px rgba(94,68,42,0.09)",
            position: "relative",
            overflow: "hidden",
            padding: "1.25rem",
          }}
        >
          <div style={{ position: "absolute", inset: 24, borderRadius: "45% 55% 50% 50% / 56% 44% 58% 42%", background: "rgba(169,201,172,0.2)", border: "2px dashed rgba(93,140,101,0.34)" }} />

          <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--cherry-forest)", fontWeight: 900 }}>
              <IconMicroscope size={20} color="var(--cherry-forest)" />
              调节分子，观察蛋白质产量
            </div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              <StageBadge number="1" title="DNA 转录" active={expression.transcriptionActive} />
              <StageBadge number="2" title="mRNA 生成" active={expression.mrna > 0} />
              <StageBadge number="3" title="核糖体翻译" active={expression.translationActive} />
            </div>
          </div>

          {Array.from({ length: transcriptionFactors }).map((_, index) => (
            <FloatingMolecule
              key={`tf-${index}`}
              label="TF"
              left={`${8 + index * 8}%`}
              top={`${17 + (index % 2) * 9}%`}
              color="var(--cherry-yellow-light)"
              delay={index * 0.12}
            />
          ))}
          {Array.from({ length: polymerase }).map((_, index) => (
            <FloatingMolecule
              key={`pol-${index}`}
              label="pol"
              left={`${56 + index * 6}%`}
              top={`${17 + (index % 2) * 9}%`}
              color="var(--cherry-blue-light)"
              delay={index * 0.15}
            />
          ))}
          {Array.from({ length: ribosomes }).map((_, index) => (
            <FloatingMolecule
              key={`ribo-${index}`}
              label="ribo"
              left={`${12 + index * 11}%`}
              top={`${79 + (index % 2) * 5}%`}
              color="var(--cherry-peach-light)"
              delay={index * 0.14}
            />
          ))}

          <div className="gene-zone gene-dna-zone">
            <div className="gene-zone-label">
              <IconDNA size={18} />
              DNA
            </div>
            <div className="gene-dna-track">
              <div className="gene-promoter" style={{ opacity: 0.35 + expression.promoterAccess * 0.65 }}>
                promoter
              </div>
              <div className="gene-dna-strand gene-dna-top" />
              <div className="gene-dna-strand gene-dna-bottom" />
              <div className="gene-codon-row">
                <CodonStrip type="dna" />
              </div>
              {expression.transcriptionActive ? (
                <div
                  className="gene-polymerase-runner"
                  style={{
                    animationDuration: `${expression.polDuration}s`,
                  }}
                >
                  RNA pol
                </div>
              ) : (
                <div className="gene-polymerase-idle">RNA pol</div>
              )}
            </div>
          </div>

          <div className="gene-arrow gene-arrow-transcription">
            <span>transcription</span>
          </div>

          <div className="gene-zone gene-mrna-zone">
            <div className="gene-zone-label">
              <IconFlask size={17} />
              mRNA
            </div>
            <div style={{ display: "grid", gap: 9 }}>
              {Array.from({ length: Math.max(1, expression.mrnaLanes) }).map((_, index) => (
                <div
                  key={`mrna-${index}`}
                  className={expression.mrnaLanes > index ? "gene-mrna-line gene-mrna-active" : "gene-mrna-line"}
                  style={{ animationDelay: `${index * 0.32}s` }}
                >
                  <CodonStrip type="rna" />
                </div>
              ))}
            </div>
          </div>

          <div className="gene-arrow gene-arrow-translation">
            <span>translation</span>
          </div>

          <div className="gene-zone gene-ribosome-zone">
            <div className="gene-zone-label">
              <IconSparkle size={17} />
              ribosome
            </div>
            <div className="gene-ribosome-stage">
              <div className="gene-rna-template">
                <CodonStrip type="rna" />
                {expression.translationActive ? (
                  <div className="gene-ribosome-runner" style={{ animationDuration: `${expression.ribosomeDuration}s` }}>
                    ribosome
                  </div>
                ) : null}
              </div>
              <div className="gene-chain-card">
                <ProteinChain active={expression.translationActive} />
                <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", fontWeight: 800, marginTop: "0.7rem" }}>
                  AUG → Met · GAA → Glu · UUU → Phe · CCG → Pro
                </div>
              </div>
            </div>
          </div>

          <div className="gene-product-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: "0.7rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900 }}>
                <IconSparkle size={17} color="var(--cherry-peach)" />
                蛋白质产物
              </div>
              <span style={{ color: "var(--cherry-red)", fontWeight: 900, fontSize: "1.28rem" }}>{expression.protein}</span>
            </div>
            <ProteinPile count={expression.proteinDisplay} />
          </div>
        </div>

        <aside style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.25rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "1rem" }}>
              <IconDNA size={20} />
              分子控制台
            </div>
            <div style={{ display: "grid", gap: "1rem" }}>
              <SliderControl label="转录因子" value={transcriptionFactors} setValue={setTranscriptionFactors} note="越高，启动子越容易被 RNA 聚合酶识别。" />
              <SliderControl label="RNA 聚合酶" value={polymerase} setValue={setPolymerase} note="越高，DNA 到 mRNA 的转录速度越快。" />
              <SliderControl label="核糖体" value={ribosomes} setValue={setRibosomes} note="越高，同一批 mRNA 被翻译成蛋白质的效率越高。" />
            </div>
          </div>

          <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 22, padding: "1.25rem" }}>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.75rem" }}>实时读数</div>
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--cherry-warm-mid)", fontWeight: 800 }}>
                <span>启动子可读性</span>
                <span>{Math.round(expression.promoterAccess * 100)}%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--cherry-warm-mid)", fontWeight: 800 }}>
                <span>mRNA 数量</span>
                <span>{expression.mrna}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--cherry-warm-mid)", fontWeight: 800 }}>
                <span>蛋白质产量</span>
                <span>{expression.protein}</span>
              </div>
            </div>
          </div>

          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.25rem" }}>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.8rem" }}>即时小测</div>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              {[
                "DNA 序列 ATG 转录后会变成 mRNA 的 AUG。",
                "mRNA 是 DNA 信息进入蛋白质合成流程的中间载体。",
                "核糖体读取 mRNA 密码子，并连接对应的氨基酸。",
              ].map((item) => (
                <div key={item} style={{ display: "flex", gap: 8, color: "var(--cherry-warm-mid)", lineHeight: 1.6, fontSize: "0.86rem" }}>
                  <IconCheck size={16} color="var(--cherry-forest)" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <style>
        {`
          .gene-zone {
            position: absolute;
            z-index: 2;
            background: rgba(250,247,241,0.82);
            border: 1.5px solid rgba(94,68,42,0.16);
            border-radius: 22px;
            box-shadow: 4px 6px 0 rgba(94,68,42,0.06);
            padding: 1rem;
          }

          .gene-zone-label {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            color: var(--cherry-warm-brown);
            font-weight: 900;
            margin-bottom: 0.8rem;
          }

          .gene-dna-zone {
            left: 7%;
            right: 7%;
            top: 16%;
            min-height: 142px;
          }

          .gene-mrna-zone {
            left: 9%;
            width: 43%;
            top: 43%;
            min-height: 124px;
          }

          .gene-ribosome-zone {
            right: 7%;
            width: 44%;
            top: 43%;
            min-height: 200px;
          }

          .gene-dna-track {
            position: relative;
            height: 88px;
            border-radius: 999px;
            background: rgba(255,255,255,0.5);
            border: 1.5px solid rgba(94,68,42,0.12);
            overflow: hidden;
          }

          .gene-dna-strand {
            position: absolute;
            left: 8%;
            right: 6%;
            height: 8px;
            border-radius: 999px;
            box-shadow: 0 2px 0 rgba(94,68,42,0.06);
          }

          .gene-dna-top {
            top: 31px;
            background: linear-gradient(90deg, var(--cherry-blue), var(--cherry-sage), var(--cherry-yellow), var(--cherry-red));
          }

          .gene-dna-bottom {
            top: 51px;
            background: linear-gradient(90deg, var(--cherry-red), var(--cherry-yellow), var(--cherry-sage), var(--cherry-blue));
            opacity: 0.75;
          }

          .gene-promoter {
            position: absolute;
            left: 4%;
            top: 11px;
            z-index: 2;
            border-radius: 999px;
            background: var(--cherry-yellow);
            border: 1.5px solid rgba(94,68,42,0.16);
            color: var(--cherry-warm-brown);
            font-weight: 900;
            font-size: 0.72rem;
            padding: 0.18rem 0.56rem;
            transition: opacity 0.25s ease;
          }

          .gene-codon-row {
            position: absolute;
            left: 20%;
            top: 12px;
          }

          .gene-polymerase-runner,
          .gene-polymerase-idle {
            position: absolute;
            z-index: 4;
            top: 22px;
            width: 72px;
            height: 54px;
            border-radius: 45% 55% 48% 52%;
            background: var(--cherry-blue-light);
            border: 2px solid var(--cherry-blue);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--cherry-warm-brown);
            font-weight: 900;
            font-size: 0.68rem;
            box-shadow: 3px 5px 0 rgba(94,68,42,0.1);
          }

          .gene-polymerase-runner {
            left: 7%;
            animation: genePolymeraseScan linear infinite;
          }

          .gene-polymerase-idle {
            left: 7%;
            opacity: 0.42;
          }

          .gene-floating-molecule {
            position: absolute;
            z-index: 3;
            width: 48px;
            height: 38px;
            border-radius: 45% 55% 50% 50% / 55% 40% 60% 45%;
            border: 1.5px solid rgba(94,68,42,0.18);
            box-shadow: 3px 4px 0px rgba(94,68,42,0.08);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--cherry-warm-brown);
            font-weight: 900;
            font-size: 0.72rem;
            animation: geneFloat 3.8s ease-in-out infinite;
          }

          .gene-arrow {
            position: absolute;
            z-index: 1;
            height: 34px;
            border-radius: 999px;
            background: linear-gradient(90deg, rgba(232,121,95,0), rgba(232,121,95,0.32), rgba(232,121,95,0));
            overflow: hidden;
          }

          .gene-arrow span {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--cherry-red);
            font-family: 'Caveat', cursive;
            font-weight: 800;
            font-size: 1rem;
          }

          .gene-arrow::after {
            content: "";
            position: absolute;
            top: 14px;
            left: 8%;
            width: 84%;
            height: 6px;
            border-radius: 999px;
            background: repeating-linear-gradient(90deg, var(--cherry-red), var(--cherry-red) 16px, transparent 16px, transparent 28px);
            animation: geneFlow 1.4s linear infinite;
          }

          .gene-arrow-transcription {
            left: 22%;
            top: 37%;
            width: 30%;
            transform: rotate(18deg);
          }

          .gene-arrow-translation {
            left: 48%;
            top: 52%;
            width: 23%;
            transform: rotate(-2deg);
          }

          .gene-mrna-line {
            min-height: 35px;
            border-radius: 999px;
            background: rgba(255,255,255,0.45);
            border: 1.5px dashed rgba(94,68,42,0.14);
            padding: 0.28rem 0.45rem;
            opacity: 0.24;
            transform: translateX(-14px);
          }

          .gene-mrna-active {
            opacity: 1;
            animation: geneMrnaGrow 2.4s ease-in-out infinite;
          }

          .gene-ribosome-stage {
            display: grid;
            gap: 0.75rem;
          }

          .gene-rna-template {
            position: relative;
            min-height: 78px;
            border-radius: 18px;
            background: var(--cherry-yellow-light);
            border: 1.5px solid rgba(94,68,42,0.13);
            padding: 0.75rem;
            overflow: hidden;
          }

          .gene-ribosome-runner {
            position: absolute;
            top: 38px;
            left: 8px;
            width: 88px;
            height: 44px;
            border-radius: 45% 55% 50% 50%;
            background: var(--cherry-peach-light);
            border: 2px solid var(--cherry-peach);
            box-shadow: 3px 4px 0 rgba(94,68,42,0.1);
            color: var(--cherry-warm-brown);
            font-weight: 900;
            font-size: 0.7rem;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: geneRibosomeScan linear infinite;
          }

          .gene-chain-card {
            border-radius: 18px;
            background: rgba(250,247,241,0.78);
            border: 1.5px solid rgba(94,68,42,0.13);
            padding: 0.8rem;
          }

          .gene-amino-active {
            animation: geneAminoBuild 2.8s ease-in-out infinite;
          }

          .gene-product-card {
            position: absolute;
            z-index: 4;
            right: 7%;
            bottom: 5%;
            width: 230px;
            min-height: 150px;
            border-radius: 22px;
            background: rgba(250,247,241,0.9);
            border: 1.5px solid var(--border);
            box-shadow: 4px 7px 0 rgba(94,68,42,0.08);
            padding: 1rem;
          }

          .gene-protein-pop {
            animation: geneProteinPop 1.5s ease-in-out infinite;
          }

          @keyframes genePolymeraseScan {
            0% { left: 7%; transform: scale(0.92); opacity: 0; }
            12% { opacity: 1; }
            78% { opacity: 1; }
            100% { left: calc(100% - 92px); transform: scale(1); opacity: 0; }
          }

          @keyframes geneRibosomeScan {
            0% { left: 8px; transform: translateY(0) rotate(-2deg); opacity: 0; }
            10% { opacity: 1; }
            82% { opacity: 1; }
            100% { left: calc(100% - 100px); transform: translateY(-3px) rotate(2deg); opacity: 0; }
          }

          @keyframes geneMrnaGrow {
            0% { transform: translateX(-12px); box-shadow: 0 0 0 rgba(232,121,95,0); }
            35% { transform: translateX(0); box-shadow: 0 0 0 rgba(232,121,95,0); }
            65% { transform: translateX(8px); box-shadow: 4px 0 0 rgba(232,121,95,0.18); }
            100% { transform: translateX(-12px); box-shadow: 0 0 0 rgba(232,121,95,0); }
          }

          @keyframes geneAminoBuild {
            0%, 18% { transform: translateY(8px) scale(0.82); opacity: 0.35; }
            42%, 100% { transform: translateY(0) scale(1); opacity: 1; }
          }

          @keyframes geneProteinPop {
            0%, 100% { transform: translateY(0) scale(1); }
            45% { transform: translateY(-4px) scale(1.08); }
          }

          @keyframes geneFloat {
            0%, 100% { transform: translateY(0) rotate(-2deg); }
            50% { transform: translateY(-10px) rotate(3deg); }
          }

          @keyframes geneFlow {
            from { transform: translateX(-28px); }
            to { transform: translateX(28px); }
          }

          @media (max-width: 980px) {
            #gene-expression > div:first-child {
              grid-template-columns: 1fr !important;
            }

            .gene-dna-zone,
            .gene-mrna-zone,
            .gene-ribosome-zone,
            .gene-product-card {
              position: relative;
              left: auto;
              right: auto;
              top: auto;
              bottom: auto;
              width: auto;
              margin-top: 1rem;
            }

            .gene-dna-zone {
              margin-top: 3.5rem;
            }

            .gene-arrow {
              display: none;
            }

            .gene-product-card {
              width: auto;
            }
          }
        `}
      </style>
    </section>
  );
}
