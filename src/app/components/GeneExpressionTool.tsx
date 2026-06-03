import { useMemo, useState } from "react";
import { IconBook, IconCheck, IconDNA, IconFlask, IconMicroscope, IconSparkle } from "./Icons";

const codons = [
  { rna: "AUG", amino: "Met", color: "var(--cherry-peach)" },
  { rna: "GAA", amino: "Glu", color: "var(--cherry-yellow)" },
  { rna: "UUU", amino: "Phe", color: "var(--cherry-sage)" },
  { rna: "CCG", amino: "Pro", color: "var(--cherry-blue)" },
];

const checks = [
  "转录因子越多，RNA 聚合酶越容易启动转录。",
  "mRNA 越多，核糖体越有机会读取密码子。",
  "核糖体越多，蛋白质合成速度越快。",
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

function Molecule({
  left,
  top,
  label,
  color,
  delay = 0,
}: {
  left: string;
  top: string;
  label: string;
  color: string;
  delay?: number;
}) {
  return (
    <div
      className="gene-molecule"
      style={{
        position: "absolute",
        left,
        top,
        width: 48,
        height: 38,
        borderRadius: "45% 55% 50% 50% / 55% 40% 60% 45%",
        background: color,
        border: "1.5px solid rgba(94,68,42,0.18)",
        boxShadow: "3px 4px 0px rgba(94,68,42,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--cherry-warm-brown)",
        fontWeight: 900,
        fontSize: "0.72rem",
        animationDelay: `${delay}s`,
      }}
    >
      {label}
    </div>
  );
}

function ProteinChain({ activeCount }: { activeCount: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      {codons.map((codon, index) => (
        <div
          key={codon.amino}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: codon.color,
            border: "1.5px solid rgba(94,68,42,0.2)",
            boxShadow: "3px 4px 0px rgba(94,68,42,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--cherry-warm-brown)",
            fontWeight: 900,
            fontSize: "0.72rem",
            opacity: index < activeCount ? 1 : 0.25,
            transform: index < activeCount ? "translateY(0) scale(1)" : "translateY(8px) scale(0.92)",
            transition: "all 0.25s ease",
          }}
        >
          {codon.amino}
        </div>
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
    const chainProgress = Math.min(4, Math.max(1, Math.ceil((protein / 12) * 4)));

    return { promoterAccess, transcriptionRate, mrna, protein, chainProgress };
  }, [transcriptionFactors, polymerase, ribosomes]);

  return (
    <section
      id="gene-expression"
      style={{
        fontFamily: "'Nunito', sans-serif",
        padding: "4.5rem 1.5rem 5rem",
        maxWidth: 1120,
        margin: "0 auto",
        position: "relative",
        scrollMarginTop: 76,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: "0.65rem" }}>
            <IconMicroscope size={20} color="var(--cherry-warm-mid)" />
            <span style={{ fontFamily: "'Caveat', cursive", color: "var(--cherry-warm-mid)", fontWeight: 800 }}>可操作学习模拟</span>
          </div>
          <h2 style={{ color: "var(--cherry-warm-brown)", fontSize: "clamp(1.7rem, 4vw, 2.45rem)", fontWeight: 900, lineHeight: 1.2 }}>
            调节分子，观察蛋白质产量
          </h2>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["转录因子", "RNA 聚合酶", "核糖体"].map((item) => (
            <span key={item} style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.32rem 0.78rem", color: "var(--cherry-warm-mid)", fontSize: "0.78rem", fontWeight: 800 }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(290px, 0.65fr)", gap: "1.25rem", alignItems: "stretch" }}>
        <div
          style={{
            minHeight: 520,
            background: "linear-gradient(180deg, #FDF9EF 0%, #F3E7D6 100%)",
            border: "1.5px solid var(--border)",
            borderRadius: 28,
            boxShadow: "6px 10px 0px rgba(94,68,42,0.09)",
            position: "relative",
            overflow: "hidden",
            padding: "1.2rem",
          }}
        >
          <div style={{ position: "absolute", inset: 22, borderRadius: "44% 56% 48% 52% / 56% 42% 58% 44%", background: "rgba(169,201,172,0.22)", border: "2px dashed rgba(93,140,101,0.34)" }} />
          <div style={{ position: "absolute", top: 24, left: 28, display: "flex", alignItems: "center", gap: 8, color: "var(--cherry-forest)", fontWeight: 900 }}>
            <IconFlask size={18} color="var(--cherry-forest)" />
            cell view
          </div>

          <div
            style={{
              position: "absolute",
              left: "8%",
              right: "8%",
              top: "38%",
              height: 92,
              borderRadius: 999,
              background: "rgba(250,247,241,0.72)",
              border: "1.5px solid rgba(94,68,42,0.16)",
              boxShadow: "inset 0 2px 0 rgba(255,255,255,0.65)",
            }}
          >
            <div style={{ position: "absolute", left: "5%", right: "5%", top: 30, height: 8, borderRadius: 999, background: "linear-gradient(90deg, var(--cherry-blue), var(--cherry-sage), var(--cherry-yellow), var(--cherry-red))" }} />
            <div style={{ position: "absolute", left: "5%", right: "5%", top: 50, height: 8, borderRadius: 999, background: "linear-gradient(90deg, var(--cherry-red), var(--cherry-yellow), var(--cherry-sage), var(--cherry-blue))", opacity: 0.75 }} />
            <span style={{ position: "absolute", left: "10%", top: 8, color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.76rem" }}>promoter</span>
            <span style={{ position: "absolute", right: "14%", top: 8, color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.76rem" }}>gene</span>
            <div style={{ position: "absolute", left: "12%", top: 26, width: 44, height: 22, borderRadius: 999, background: expression.promoterAccess > 0.5 ? "var(--cherry-yellow)" : "rgba(221,185,90,0.35)", border: "1.5px solid rgba(94,68,42,0.16)" }} />
            <div
              style={{
                position: "absolute",
                left: `${18 + polymerase * 9}%`,
                top: 18,
                width: 66,
                height: 54,
                borderRadius: "45% 55% 48% 52%",
                background: "var(--cherry-blue-light)",
                border: "2px solid var(--cherry-blue)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--cherry-warm-brown)",
                fontWeight: 900,
                fontSize: "0.68rem",
                transition: "left 0.35s ease",
              }}
            >
              RNA pol
            </div>
          </div>

          {Array.from({ length: transcriptionFactors }).map((_, index) => (
            <Molecule key={`tf-${index}`} left={`${14 + index * 8}%`} top={`${18 + (index % 2) * 9}%`} label="TF" color="var(--cherry-yellow-light)" delay={index * 0.12} />
          ))}
          {Array.from({ length: polymerase }).map((_, index) => (
            <Molecule key={`pol-${index}`} left={`${54 + index * 6}%`} top={`${17 + (index % 2) * 10}%`} label="pol" color="var(--cherry-blue-light)" delay={index * 0.16} />
          ))}
          {Array.from({ length: ribosomes }).map((_, index) => (
            <Molecule key={`rib-${index}`} left={`${20 + index * 11}%`} top={`${68 + (index % 2) * 7}%`} label="ribo" color="var(--cherry-peach-light)" delay={index * 0.14} />
          ))}

          <div
            style={{
              position: "absolute",
              left: "18%",
              top: "54%",
              width: `${Math.max(80, expression.mrna * 18)}px`,
              maxWidth: "58%",
              height: 12,
              borderRadius: 999,
              background: "repeating-linear-gradient(90deg, var(--cherry-red), var(--cherry-red) 16px, var(--cherry-peach) 16px, var(--cherry-peach) 32px)",
              opacity: expression.mrna > 0 ? 1 : 0.18,
              transition: "all 0.35s ease",
              boxShadow: "0 3px 0 rgba(94,68,42,0.08)",
            }}
          />
          <span style={{ position: "absolute", left: "18%", top: "58%", color: "var(--cherry-warm-mid)", fontSize: "0.76rem", fontWeight: 800 }}>mRNA x {expression.mrna}</span>

          <div
            style={{
              position: "absolute",
              right: "8%",
              bottom: "9%",
              width: 210,
              minHeight: 148,
              borderRadius: 22,
              background: "rgba(250,247,241,0.82)",
              border: "1.5px solid var(--border)",
              padding: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.75rem" }}>
              <IconSparkle size={16} color="var(--cherry-peach)" />
              protein product
            </div>
            <ProteinChain activeCount={expression.chainProgress} />
            <div style={{ marginTop: "0.8rem", color: "var(--cherry-red)", fontWeight: 900, fontSize: "1.2rem" }}>
              {expression.protein} molecules
            </div>
          </div>
        </div>

        <aside style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.25rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "1rem" }}>
              <IconDNA size={20} />
              分子控制台
            </div>
            <div style={{ display: "grid", gap: "1rem" }}>
              <SliderControl label="转录因子" value={transcriptionFactors} setValue={setTranscriptionFactors} note="帮助 RNA 聚合酶识别启动子区域。" />
              <SliderControl label="RNA 聚合酶" value={polymerase} setValue={setPolymerase} note="负责根据 DNA 模板合成 mRNA。" />
              <SliderControl label="核糖体" value={ribosomes} setValue={setRibosomes} note="读取 mRNA 密码子并连接氨基酸。" />
            </div>
          </div>

          <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 22, padding: "1.25rem" }}>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.75rem" }}>实时读数</div>
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--cherry-warm-mid)", fontWeight: 800 }}><span>启动子可读性</span><span>{Math.round(expression.promoterAccess * 100)}%</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--cherry-warm-mid)", fontWeight: 800 }}><span>mRNA 生成</span><span>{expression.mrna}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--cherry-warm-mid)", fontWeight: 800 }}><span>蛋白质产量</span><span>{expression.protein}</span></div>
            </div>
          </div>

          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.85rem" }}>
              <IconBook size={18} />
              观察提示
            </div>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              {checks.map((item) => (
                <div key={item} style={{ display: "flex", gap: 8, color: "var(--cherry-warm-mid)", lineHeight: 1.6, fontSize: "0.86rem" }}>
                  <IconCheck size={16} color="var(--cherry-forest)" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div style={{ marginTop: "1.1rem", background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 18, padding: "1rem", color: "var(--cherry-warm-mid)", lineHeight: 1.75, fontSize: "0.9rem" }}>
        这个模型做了教学简化：把基因表达压缩到一个细胞视图中，重点观察“转录调控 → mRNA 数量 → 翻译效率 → 蛋白质产量”的关系。
      </div>

      <style>
        {`
          .gene-molecule {
            animation: geneFloat 3.8s ease-in-out infinite;
          }

          @keyframes geneFloat {
            0%, 100% { transform: translateY(0) rotate(-2deg); }
            50% { transform: translateY(-10px) rotate(3deg); }
          }

          @media (max-width: 880px) {
            #gene-expression > div:nth-of-type(2) {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </section>
  );
}
