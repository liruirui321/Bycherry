import { useMemo, useRef, useState } from "react";
import { IconCheck, IconDNA, IconMicroscope, IconSparkle } from "./Icons";

type MoleculeType = "tf" | "pol" | "ribosome";
type ZoneKey = "promoter" | "polymerase" | "ribosome";

type Molecule = {
  id: string;
  type: MoleculeType;
  label: string;
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  color: string;
};

const initialMolecules: Molecule[] = [
  { id: "tf-1", type: "tf", label: "TF", x: 82, y: 146, homeX: 82, homeY: 146, color: "var(--cherry-yellow)" },
  { id: "tf-2", type: "tf", label: "TF", x: 136, y: 112, homeX: 136, homeY: 112, color: "var(--cherry-yellow)" },
  { id: "tf-3", type: "tf", label: "TF", x: 188, y: 146, homeX: 188, homeY: 146, color: "var(--cherry-yellow)" },
  { id: "pol-1", type: "pol", label: "RNA pol", x: 710, y: 120, homeX: 710, homeY: 120, color: "var(--cherry-blue-light)" },
  { id: "pol-2", type: "pol", label: "RNA pol", x: 804, y: 156, homeX: 804, homeY: 156, color: "var(--cherry-blue-light)" },
  { id: "rib-1", type: "ribosome", label: "ribo", x: 90, y: 500, homeX: 90, homeY: 500, color: "var(--cherry-peach-light)" },
  { id: "rib-2", type: "ribosome", label: "ribo", x: 164, y: 536, homeX: 164, homeY: 536, color: "var(--cherry-peach-light)" },
  { id: "rib-3", type: "ribosome", label: "ribo", x: 238, y: 500, homeX: 238, homeY: 500, color: "var(--cherry-peach-light)" },
];

const codons = [
  { rna: "AUG", amino: "Met", color: "var(--cherry-peach)" },
  { rna: "GAA", amino: "Glu", color: "var(--cherry-yellow)" },
  { rna: "UUU", amino: "Phe", color: "var(--cherry-sage)" },
  { rna: "CCG", amino: "Pro", color: "var(--cherry-blue)" },
];

function inBox(molecule: Molecule, box: { x: number; y: number; w: number; h: number }) {
  return molecule.x >= box.x && molecule.x <= box.x + box.w && molecule.y >= box.y && molecule.y <= box.y + box.h;
}

function inExpandedBox(molecule: Molecule, box: { x: number; y: number; w: number; h: number }, margin = 42) {
  return molecule.x >= box.x - margin && molecule.x <= box.x + box.w + margin && molecule.y >= box.y - margin && molecule.y <= box.y + box.h + margin;
}

function moleculeZone(type: MoleculeType): ZoneKey {
  if (type === "tf") return "promoter";
  if (type === "pol") return "polymerase";
  return "ribosome";
}

function MoleculeNode({
  molecule,
  dragging,
  onPointerDown,
}: {
  molecule: Molecule;
  dragging: boolean;
  onPointerDown: (event: React.PointerEvent<SVGGElement>, molecule: Molecule) => void;
}) {
  const radius = molecule.type === "pol" ? 44 : molecule.type === "ribosome" ? 38 : 31;

  return (
    <g
      transform={`translate(${molecule.x} ${molecule.y})`}
      onPointerDown={(event) => onPointerDown(event, molecule)}
      style={{ cursor: "grab", filter: dragging ? "drop-shadow(5px 8px 0 rgba(94,68,42,0.16))" : "drop-shadow(3px 4px 0 rgba(94,68,42,0.08))" }}
    >
      <ellipse
        rx={radius}
        ry={molecule.type === "pol" ? 30 : 26}
        fill={molecule.color}
        stroke={molecule.type === "pol" ? "var(--cherry-blue)" : "rgba(94,68,42,0.22)"}
        strokeWidth={molecule.type === "pol" ? 3 : 2}
      />
      <text textAnchor="middle" dominantBaseline="middle" fill="var(--cherry-warm-brown)" fontSize={molecule.type === "pol" ? 13 : 14} fontWeight={900}>
        {molecule.label}
      </text>
    </g>
  );
}

function CodonLabels({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {codons.map((codon, index) => (
        <g key={codon.rna} transform={`translate(${index * 78} 0)`}>
          <rect width={62} height={30} rx={10} fill="rgba(250,247,241,0.72)" stroke="rgba(94,68,42,0.18)" strokeWidth={1.5} />
          <text x={31} y={20} textAnchor="middle" fill="var(--cherry-warm-brown)" fontSize={14} fontWeight={900}>
            {codon.rna}
          </text>
        </g>
      ))}
    </g>
  );
}

function ProductBeads({ count }: { count: number }) {
  return (
    <g transform="translate(704 442)">
      <text x={0} y={-18} fill="var(--cherry-warm-brown)" fontSize={16} fontWeight={900}>
        protein product
      </text>
      {Array.from({ length: 12 }).map((_, index) => {
        const active = index < count;
        const amino = codons[index % codons.length];
        return (
          <circle
            key={index}
            className={active ? "gene-svg-pop" : ""}
            cx={(index % 4) * 34}
            cy={Math.floor(index / 4) * 34}
            r={13}
            fill={active ? amino.color : "rgba(94,68,42,0.08)"}
            stroke="rgba(94,68,42,0.16)"
            strokeWidth={1.5}
            style={{ animationDelay: `${index * 0.08}s` }}
          />
        );
      })}
    </g>
  );
}

function StageRail({ model }: { model: { tfBound: number; polBound: number; ribBound: number; transcriptionOn: boolean; translationOn: boolean; protein: number } }) {
  const stages = [
    { label: "TF binds promoter", active: model.tfBound > 0 },
    { label: "RNA pol transcribes", active: model.transcriptionOn },
    { label: "ribosome translates", active: model.translationOn },
    { label: "protein accumulates", active: model.protein > 0 },
  ];

  return (
    <g transform="translate(300 48)">
      {stages.map((stage, index) => (
        <g key={stage.label} transform={`translate(${index * 132} 0)`}>
          {index > 0 ? <line x1={-78} y1={15} x2={-18} y2={15} stroke={stage.active ? "var(--cherry-forest)" : "rgba(94,68,42,0.18)"} strokeWidth={4} strokeLinecap="round" /> : null}
          <circle cx={0} cy={15} r={15} fill={stage.active ? "var(--cherry-forest)" : "rgba(250,247,241,0.86)"} stroke="rgba(94,68,42,0.18)" strokeWidth={1.5} />
          <text x={0} y={20} textAnchor="middle" fill={stage.active ? "#FAF7F1" : "var(--cherry-warm-mid)"} fontSize={12} fontWeight={900}>
            {index + 1}
          </text>
          <text x={0} y={44} textAnchor="middle" fill="var(--cherry-warm-mid)" fontSize={11} fontWeight={800}>
            {stage.label}
          </text>
        </g>
      ))}
    </g>
  );
}

export function GeneExpressionTool() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [molecules, setMolecules] = useState(initialMolecules);
  const [dragging, setDragging] = useState<{ id: string; dx: number; dy: number } | null>(null);

  const zones = {
    promoter: { x: 214, y: 212, w: 160, h: 86 },
    polymerase: { x: 380, y: 206, w: 330, h: 96 },
    ribosome: { x: 332, y: 392, w: 358, h: 116 },
  };
  const slots: Record<ZoneKey, Array<{ x: number; y: number }>> = {
    promoter: [
      { x: 244, y: 254 },
      { x: 302, y: 254 },
      { x: 360, y: 254 },
    ],
    polymerase: [
      { x: 456, y: 254 },
      { x: 570, y: 254 },
    ],
    ribosome: [
      { x: 406, y: 450 },
      { x: 520, y: 450 },
      { x: 634, y: 450 },
    ],
  };

  const model = useMemo(() => {
    const tfBound = molecules.filter((molecule) => molecule.type === "tf" && inBox(molecule, zones.promoter)).length;
    const polBound = molecules.filter((molecule) => molecule.type === "pol" && inBox(molecule, zones.polymerase)).length;
    const ribBound = molecules.filter((molecule) => molecule.type === "ribosome" && inBox(molecule, zones.ribosome)).length;
    const transcriptionOn = tfBound > 0 && polBound > 0;
    const mrna = transcriptionOn ? Math.min(5, tfBound + polBound + 1) : 0;
    const translationOn = mrna > 0 && ribBound > 0;
    const protein = translationOn ? Math.min(12, mrna * ribBound) : 0;

    return { tfBound, polBound, ribBound, transcriptionOn, mrna, translationOn, protein };
  }, [molecules, zones.polymerase, zones.promoter, zones.ribosome]);

  function svgPoint(event: React.PointerEvent<SVGSVGElement | SVGGElement>) {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const matrix = svg.getScreenCTM();
    if (!matrix) return { x: 0, y: 0 };
    return point.matrixTransform(matrix.inverse());
  }

  function startDrag(event: React.PointerEvent<SVGGElement>, molecule: Molecule) {
    event.preventDefault();
    const point = svgPoint(event);
    setDragging({ id: molecule.id, dx: point.x - molecule.x, dy: point.y - molecule.y });
  }

  function moveDrag(event: React.PointerEvent<SVGSVGElement>) {
    if (!dragging) return;
    const point = svgPoint(event);
    setMolecules((items) =>
      items.map((molecule) =>
        molecule.id === dragging.id
          ? {
              ...molecule,
              x: Math.max(42, Math.min(936, point.x - dragging.dx)),
              y: Math.max(72, Math.min(594, point.y - dragging.dy)),
            }
          : molecule
      )
    );
  }

  function moleculeSlotIndex(molecule: Molecule) {
    const rawIndex = Number(molecule.id.split("-")[1]) - 1;
    return Number.isFinite(rawIndex) ? rawIndex : 0;
  }

  function snapMolecule(molecule: Molecule) {
    const zoneKey = moleculeZone(molecule.type);
    const zone = zones[zoneKey];
    if (!inExpandedBox(molecule, zone)) return molecule;
    const slot = slots[zoneKey][moleculeSlotIndex(molecule)] ?? slots[zoneKey][0];
    return { ...molecule, x: slot.x, y: slot.y };
  }

  function endDrag() {
    if (!dragging) return;
    setMolecules((items) => items.map((molecule) => (molecule.id === dragging.id ? snapMolecule(molecule) : molecule)));
    setDragging(null);
  }

  function resetScene() {
    setMolecules(initialMolecules);
    setDragging(null);
  }

  function runExpressionPreset() {
    setMolecules((items) =>
      items.map((molecule) => {
        const zoneKey = moleculeZone(molecule.type);
        const slot = slots[zoneKey][moleculeSlotIndex(molecule)] ?? slots[zoneKey][0];
        return { ...molecule, x: slot.x, y: slot.y };
      })
    );
    setDragging(null);
  }

  return (
    <section
      id="gene-expression"
      style={{
        fontFamily: "'Nunito', sans-serif",
        padding: "2rem 1.5rem 5rem",
        maxWidth: 1180,
        margin: "0 auto",
        scrollMarginTop: 76,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.45fr) minmax(286px, 0.7fr)", gap: "1rem", alignItems: "stretch" }}>
        <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 28, boxShadow: "6px 10px 0px rgba(94,68,42,0.09)", overflow: "hidden" }}>
          <svg
            ref={svgRef}
            viewBox="0 0 980 660"
            role="img"
            aria-label="基因表达互动仿真画布"
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            style={{ width: "100%", display: "block", touchAction: "none", background: "linear-gradient(180deg, #FFF8EA 0%, #F3E8D7 100%)" }}
          >
            <defs>
              <linearGradient id="dnaTop" x1="0" x2="1">
                <stop offset="0%" stopColor="var(--cherry-blue)" />
                <stop offset="38%" stopColor="var(--cherry-sage)" />
                <stop offset="70%" stopColor="var(--cherry-yellow)" />
                <stop offset="100%" stopColor="var(--cherry-red)" />
              </linearGradient>
              <linearGradient id="dnaBottom" x1="0" x2="1">
                <stop offset="0%" stopColor="var(--cherry-red)" />
                <stop offset="42%" stopColor="var(--cherry-yellow)" />
                <stop offset="72%" stopColor="var(--cherry-sage)" />
                <stop offset="100%" stopColor="var(--cherry-blue)" />
              </linearGradient>
            </defs>

            <rect x={22} y={26} width={936} height={606} rx={220} fill="rgba(169,201,172,0.2)" stroke="rgba(93,140,101,0.34)" strokeWidth={3} strokeDasharray="9 9" />

            <text x={42} y={58} fill="var(--cherry-forest)" fontSize={18} fontWeight={900}>
              Gene Expression Lab
            </text>
            <StageRail model={model} />

            <g transform="translate(154 170)">
              <rect x={0} y={0} width={668} height={150} rx={34} fill="rgba(250,247,241,0.72)" stroke="rgba(94,68,42,0.18)" strokeWidth={2} />
              <text x={24} y={34} fill="var(--cherry-warm-brown)" fontSize={16} fontWeight={900}>
                DNA
              </text>
              <rect x={60} y={64} width={540} height={10} rx={999} fill="url(#dnaTop)" />
              <rect x={60} y={90} width={540} height={10} rx={999} fill="url(#dnaBottom)" opacity={0.78} />
              <rect x={66} y={40} width={150} height={80} rx={18} fill={model.tfBound > 0 ? "rgba(221,185,90,0.36)" : "rgba(250,247,241,0.46)"} stroke="var(--cherry-yellow)" strokeWidth={2} strokeDasharray="7 7" />
              <text x={92} y={88} fill="var(--cherry-warm-brown)" fontSize={14} fontWeight={900}>
                promoter
              </text>
              {[90, 148, 206].map((x, index) => (
                <circle key={x} cx={x} cy={84} r={18} fill="none" stroke={model.tfBound > index ? "var(--cherry-forest)" : "rgba(94,68,42,0.18)"} strokeWidth={2} strokeDasharray="4 5" />
              ))}
              <rect x={226} y={42} width={320} height={78} rx={18} fill={model.polBound > 0 ? "rgba(141,190,221,0.26)" : "rgba(250,247,241,0.4)"} stroke="var(--cherry-blue)" strokeWidth={2} strokeDasharray="7 7" />
              <text x={344} y={88} fill="var(--cherry-warm-brown)" fontSize={14} fontWeight={900}>
                gene body
              </text>
              {[302, 416].map((x, index) => (
                <circle key={x} cx={x} cy={84} r={24} fill="none" stroke={model.polBound > index ? "var(--cherry-forest)" : "rgba(94,68,42,0.18)"} strokeWidth={2} strokeDasharray="4 5" />
              ))}
              {model.transcriptionOn ? (
                <g className="gene-svg-pol-scan" transform="translate(238 80)">
                  <ellipse rx={42} ry={27} fill="var(--cherry-blue-light)" stroke="var(--cherry-blue)" strokeWidth={3} />
                  <text textAnchor="middle" dominantBaseline="middle" fill="var(--cherry-warm-brown)" fontSize={12} fontWeight={900}>
                    RNA pol
                  </text>
                </g>
              ) : null}
            </g>

            {model.transcriptionOn ? (
              <>
                {Array.from({ length: model.mrna }).map((_, index) => (
                  <g key={index} className="gene-svg-mrna" transform={`translate(${264 + index * 7} ${350 + index * 12})`} style={{ animationDelay: `${index * 0.12}s` }}>
                    <path d="M0 0 C80 36 170 -34 250 0 C324 32 410 -20 490 8" fill="none" stroke="var(--cherry-red)" strokeWidth={index === 0 ? 9 : 5} strokeLinecap="round" opacity={index === 0 ? 1 : 0.42} />
                    {index === 0 ? <CodonLabels x={74} y={18} /> : null}
                  </g>
                ))}
              </>
            ) : (
              <g transform="translate(332 382)" opacity={0.35}>
                <path d="M0 0 C68 26 150 -24 226 0" fill="none" stroke="var(--cherry-red)" strokeWidth={8} strokeLinecap="round" strokeDasharray="10 10" />
                <text x={250} y={7} fill="var(--cherry-warm-mid)" fontSize={15} fontWeight={800}>
                  mRNA appears after TF and RNA pol bind
                </text>
              </g>
            )}

            <rect x={zones.ribosome.x} y={zones.ribosome.y} width={zones.ribosome.w} height={zones.ribosome.h} rx={22} fill={model.ribBound > 0 ? "rgba(232,121,95,0.15)" : "rgba(250,247,241,0.38)"} stroke="var(--cherry-peach)" strokeWidth={2} strokeDasharray="7 7" />
            <text x={zones.ribosome.x + 22} y={zones.ribosome.y + 34} fill="var(--cherry-warm-brown)" fontSize={15} fontWeight={900}>
              ribosome dock
            </text>
            {[406, 520, 634].map((x, index) => (
              <circle key={x} cx={x} cy={450} r={30} fill="none" stroke={model.ribBound > index ? "var(--cherry-forest)" : "rgba(94,68,42,0.18)"} strokeWidth={2} strokeDasharray="4 5" />
            ))}

            {model.translationOn ? (
              <g className="gene-svg-ribosome-scan" transform="translate(348 438)">
                <ellipse rx={48} ry={30} fill="var(--cherry-peach-light)" stroke="var(--cherry-peach)" strokeWidth={3} />
                <text textAnchor="middle" dominantBaseline="middle" fill="var(--cherry-warm-brown)" fontSize={13} fontWeight={900}>
                  ribosome
                </text>
              </g>
            ) : null}

            <ProductBeads count={model.protein} />

            {model.translationOn ? (
              <g transform="translate(372 548)">
                <text x={0} y={0} fill="var(--cherry-warm-brown)" fontSize={14} fontWeight={900}>
                  amino acid chain
                </text>
                {codons.map((codon, index) => (
                  <g key={codon.amino} className="gene-svg-amino" transform={`translate(${index * 58} 22)`} style={{ animationDelay: `${index * 0.24}s` }}>
                    <circle r={18} fill={codon.color} stroke="rgba(94,68,42,0.16)" strokeWidth={1.5} />
                    <text textAnchor="middle" dominantBaseline="middle" fill="var(--cherry-warm-brown)" fontSize={10} fontWeight={900}>
                      {codon.amino}
                    </text>
                  </g>
                ))}
              </g>
            ) : null}

            <g transform="translate(46 86)">
              <rect width={190} height={28} rx={999} fill="rgba(250,247,241,0.74)" stroke="rgba(94,68,42,0.16)" />
              <text x={18} y={19} fill="var(--cherry-warm-mid)" fontSize={13} fontWeight={900}>
                molecule bank
              </text>
            </g>

            {molecules.map((molecule) => (
              <MoleculeNode key={molecule.id} molecule={molecule} dragging={dragging?.id === molecule.id} onPointerDown={startDrag} />
            ))}
          </svg>
        </div>

        <aside style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.85rem" }}>
              <IconMicroscope size={19} />
              仿真读数
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {[
                ["启动子上的转录因子", model.tfBound],
                ["DNA 上的 RNA 聚合酶", model.polBound],
                ["mRNA 上的核糖体", model.ribBound],
                ["mRNA 数量", model.mrna],
                ["蛋白质产量", model.protein],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--cherry-warm-mid)", fontWeight: 800 }}>
                  <span>{label}</span>
                  <span style={{ color: "var(--cherry-red)", fontWeight: 900 }}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "1rem" }}>
              <button onClick={runExpressionPreset} style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.58rem 0.95rem", fontWeight: 900, cursor: "pointer" }}>
                运行表达
              </button>
              <button onClick={resetScene} style={{ background: "var(--muted)", color: "var(--cherry-warm-brown)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.58rem 0.95rem", fontWeight: 900, cursor: "pointer" }}>
                重置
              </button>
            </div>
          </div>

          <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 22, padding: "1.2rem", color: "var(--cherry-warm-mid)", lineHeight: 1.7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.65rem" }}>
              <IconSparkle size={18} />
              操作任务
            </div>
            <div style={{ display: "grid", gap: "0.55rem", fontSize: "0.86rem" }}>
              {[
                "把 TF 拖到 promoter，观察启动子变亮。",
                "把 RNA pol 拖到 gene body，观察 mRNA 出现。",
                "把 ribosome 拖到 mRNA 附近，观察蛋白质产物增加。",
              ].map((item) => (
                <div key={item} style={{ display: "flex", gap: 8 }}>
                  <IconCheck size={16} color="var(--cherry-forest)" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", color: "var(--cherry-warm-mid)", lineHeight: 1.7 }}>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.65rem" }}>当前状态</div>
            <div style={{ fontSize: "0.88rem" }}>
              {!model.transcriptionOn
                ? "转录尚未启动：启动子需要 TF，基因区域需要 RNA 聚合酶。"
                : !model.translationOn
                  ? "mRNA 已生成：把核糖体放到 mRNA 附近可以开始翻译。"
                  : "翻译正在进行：核糖体读取密码子，蛋白质产物开始累积。"}
            </div>
          </div>
        </aside>
      </div>

      <style>
        {`
          .gene-svg-mrna {
            animation: geneSvgMrnaPulse 2.8s ease-in-out infinite;
          }

          .gene-svg-ribosome-scan {
            animation: geneSvgRibosomeScan 4.2s linear infinite;
          }

          .gene-svg-pol-scan {
            animation: geneSvgPolScan 3.6s linear infinite;
          }

          .gene-svg-pop {
            animation: geneSvgProteinPop 1.5s ease-in-out infinite;
          }

          .gene-svg-amino {
            animation: geneSvgAminoBuild 2.2s ease-in-out infinite;
          }

          @keyframes geneSvgMrnaPulse {
            0%, 100% { opacity: 0.78; transform: translate(264px, 350px) scaleX(0.96); }
            50% { opacity: 1; transform: translate(264px, 350px) scaleX(1.02); }
          }

          @keyframes geneSvgRibosomeScan {
            0% { transform: translate(348px, 438px); opacity: 0; }
            12% { opacity: 1; }
            78% { opacity: 1; }
            100% { transform: translate(632px, 438px); opacity: 0; }
          }

          @keyframes geneSvgPolScan {
            0% { transform: translate(238px, 80px); opacity: 0; }
            12% { opacity: 1; }
            82% { opacity: 1; }
            100% { transform: translate(522px, 80px); opacity: 0; }
          }

          @keyframes geneSvgProteinPop {
            0%, 100% { transform: scale(1); }
            45% { transform: scale(1.12); }
          }

          @keyframes geneSvgAminoBuild {
            0%, 18% { opacity: 0.3; transform: translateY(10px) scale(0.82); }
            44%, 100% { opacity: 1; transform: translateY(0) scale(1); }
          }

          @media (max-width: 920px) {
            #gene-expression > div:first-child {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </section>
  );
}
