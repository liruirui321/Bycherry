import { useEffect, useMemo, useRef, useState } from "react";
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
  { dna: "ATG", template: "TAC", rna: "AUG", amino: "Met", anticodon: "UAC", color: "var(--cherry-peach)" },
  { dna: "GAA", template: "CTT", rna: "GAA", amino: "Glu", anticodon: "CUU", color: "var(--cherry-yellow)" },
  { dna: "TTT", template: "AAA", rna: "UUU", amino: "Phe", anticodon: "AAA", color: "var(--cherry-sage)" },
  { dna: "CCG", template: "GGC", rna: "CCG", amino: "Pro", anticodon: "GGC", color: "var(--cherry-blue)" },
];

function inBox(molecule: Molecule, box: { x: number; y: number; w: number; h: number }) {
  return molecule.x >= box.x && molecule.x <= box.x + box.w && molecule.y >= box.y && molecule.y <= box.y + box.h;
}

function inExpandedBox(molecule: Molecule, box: { x: number; y: number; w: number; h: number }, margin = 18) {
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
            cx={(index % 4) * 34}
            cy={Math.floor(index / 4) * 34}
            r={13}
            fill={active ? amino.color : "rgba(94,68,42,0.08)"}
            stroke="rgba(94,68,42,0.16)"
            strokeWidth={1.5}
          >
            {active ? <animate attributeName="r" values="12;15;13" dur="1.5s" begin={`${index * 0.08}s`} repeatCount="indefinite" /> : null}
          </circle>
        );
      })}
    </g>
  );
}

function StageRail({ model }: { model: { tfBound: number; polBound: number; ribBound: number; transcriptionOn: boolean; translationOn: boolean; protein: number } }) {
  const stages = [
    { label: "TF 结合启动子", active: model.tfBound > 0 },
    { label: "RNA pol 转录", active: model.transcriptionOn },
    { label: "核糖体翻译", active: model.translationOn },
    { label: "蛋白质累积", active: model.protein > 0 },
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

type Point = { x: number; y: number };

const transcriptPath: Point[] = [
  { x: 396, y: 292 },
  { x: 426, y: 326 },
  { x: 494, y: 348 },
  { x: 584, y: 382 },
  { x: 676, y: 432 },
];

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function pointOnPolyline(points: Point[], progress: number) {
  const boundedProgress = clamp01(progress);
  const lengths = points.slice(1).map((point, index) => {
    const previous = points[index];
    return Math.hypot(point.x - previous.x, point.y - previous.y);
  });
  const totalLength = lengths.reduce((sum, length) => sum + length, 0);
  let remaining = totalLength * boundedProgress;

  for (let index = 0; index < lengths.length; index += 1) {
    if (remaining <= lengths[index]) {
      const previous = points[index];
      const next = points[index + 1];
      const localProgress = lengths[index] === 0 ? 0 : remaining / lengths[index];
      return { x: lerp(previous.x, next.x, localProgress), y: lerp(previous.y, next.y, localProgress) };
    }
    remaining -= lengths[index];
  }

  return points[points.length - 1];
}

function partialPolylinePath(points: Point[], progress: number) {
  const boundedProgress = clamp01(progress);
  if (boundedProgress <= 0) return `M${points[0].x} ${points[0].y}`;

  const lengths = points.slice(1).map((point, index) => {
    const previous = points[index];
    return Math.hypot(point.x - previous.x, point.y - previous.y);
  });
  const totalLength = lengths.reduce((sum, length) => sum + length, 0);
  let remaining = totalLength * boundedProgress;
  const path = [`M${points[0].x} ${points[0].y}`];

  for (let index = 0; index < lengths.length; index += 1) {
    const previous = points[index];
    const next = points[index + 1];
    if (remaining >= lengths[index]) {
      path.push(`L${next.x} ${next.y}`);
      remaining -= lengths[index];
    } else {
      const localProgress = lengths[index] === 0 ? 0 : remaining / lengths[index];
      path.push(`L${lerp(previous.x, next.x, localProgress)} ${lerp(previous.y, next.y, localProgress)}`);
      break;
    }
  }

  return path.join(" ");
}

function LiveExpressionProcess({ model, progress }: { model: { transcriptionOn: boolean; translationOn: boolean; mrna: number }; progress: number }) {
  const transcriptionProgress = model.transcriptionOn ? clamp01(progress / 0.78) : 0;
  const translationProgress = model.translationOn ? clamp01((progress - 0.28) / 0.62) : 0;
  const polymeraseX = model.transcriptionOn ? lerp(392, 676, transcriptionProgress) : 392;
  const mrnaPath = partialPolylinePath(transcriptPath, transcriptionProgress);
  const mrnaTip = pointOnPolyline(transcriptPath, transcriptionProgress);
  const ribosomeCanRead = model.translationOn && transcriptionProgress > 0.28;
  const ribosomeProgress = ribosomeCanRead ? Math.min(translationProgress, Math.max(0, transcriptionProgress - 0.08)) : 0;
  const ribosomePoint = pointOnPolyline(transcriptPath, ribosomeProgress);
  const activeCodonIndex = ribosomeCanRead ? Math.min(codons.length - 1, Math.floor(ribosomeProgress * codons.length)) : -1;
  const aminoCount = ribosomeCanRead ? Math.min(codons.length, Math.max(0, Math.floor(ribosomeProgress * (codons.length + 0.75)))) : 0;

  if (!model.transcriptionOn) {
    return (
      <g opacity={0.4}>
        <path d="M392 270 C396 312 424 324 462 330" fill="none" stroke="var(--cherry-red)" strokeWidth={8} strokeLinecap="round" strokeDasharray="12 14" />
        <text x={418} y={362} fill="var(--cherry-warm-mid)" fontSize={15} fontWeight={800}>
          RNA pol 结合后，新生 mRNA 会从 DNA 旁边延伸出来
        </text>
      </g>
    );
  }

  return (
    <g>
      <g transform={`translate(${polymeraseX} 250)`}>
        <ellipse rx={42} ry={27} fill="var(--cherry-blue-light)" stroke="var(--cherry-blue)" strokeWidth={3} />
        <text textAnchor="middle" dominantBaseline="middle" fill="var(--cherry-warm-brown)" fontSize={12} fontWeight={900}>
          RNA pol
        </text>
      </g>

      <path d={mrnaPath} fill="none" stroke="rgba(232,121,95,0.2)" strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" />
      <path d={mrnaPath} fill="none" stroke="var(--cherry-red)" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={mrnaTip.x} cy={mrnaTip.y} r={8} fill="var(--cherry-red)" stroke="#FAF7F1" strokeWidth={3} />
      <line x1={polymeraseX - 2} y1={274} x2={mrnaTip.x} y2={mrnaTip.y} stroke="var(--cherry-red)" strokeWidth={4} strokeLinecap="round" opacity={0.48} />

      <text x={390} y={342} fill="var(--cherry-red)" fontSize={13} fontWeight={900} opacity={transcriptionProgress > 0.08 ? 1 : 0}>
        5' mRNA
      </text>
      <text x={polymeraseX - 34} y={224} fill="var(--cherry-blue)" fontSize={12} fontWeight={900}>
        RNA pol 生成 3' 端
      </text>

      {codons.map((codon, index) => {
        const point = pointOnPolyline(transcriptPath, 0.18 + index * 0.2);
        const visible = transcriptionProgress > 0.22 + index * 0.13;
        const active = activeCodonIndex === index;
        return (
          <g key={codon.rna} transform={`translate(${point.x - 25} ${point.y + 18})`} opacity={visible ? 1 : 0.16}>
            <rect width={50} height={25} rx={9} fill={active ? "var(--cherry-yellow-light)" : "rgba(250,247,241,0.84)"} stroke={active ? "var(--cherry-red)" : "rgba(94,68,42,0.18)"} strokeWidth={active ? 2.4 : 1.4} />
            <text x={25} y={17} textAnchor="middle" fill="var(--cherry-warm-brown)" fontSize={12} fontWeight={900}>
              {codon.rna}
            </text>
          </g>
        );
      })}

      {Array.from({ length: Math.max(0, model.mrna - 1) }).map((_, index) => (
        <path
          key={index}
          d={partialPolylinePath(transcriptPath, Math.max(0.25, transcriptionProgress - index * 0.08))}
          fill="none"
          stroke="var(--cherry-red)"
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.18}
          transform={`translate(${-10 - index * 7} ${18 + index * 10})`}
          strokeDasharray="18 14"
        />
      ))}

      {model.translationOn ? (
        <>
          <g transform={`translate(${ribosomePoint.x} ${ribosomePoint.y})`} opacity={ribosomeCanRead ? 1 : 0}>
            <ellipse rx={48} ry={30} fill="var(--cherry-peach-light)" stroke="var(--cherry-peach)" strokeWidth={3} />
            <text textAnchor="middle" dominantBaseline="middle" fill="var(--cherry-warm-brown)" fontSize={13} fontWeight={900}>
              ribosome
            </text>
            <rect x={-28} y={24} width={56} height={24} rx={8} fill="rgba(250,247,241,0.92)" stroke="rgba(94,68,42,0.18)" strokeWidth={1.4} />
            <text x={0} y={40} textAnchor="middle" fill="var(--cherry-red)" fontSize={11} fontWeight={900}>
              {activeCodonIndex >= 0 ? codons[activeCodonIndex].rna : ""}
            </text>
          </g>

          {codons.map((codon, index) => (
            <g key={`trna-${codon.rna}`} transform={`translate(${540 + index * 42} ${500 - index * 16})`} opacity={activeCodonIndex === index ? 1 : 0.12}>
              <path d="M0 0 Q10 -18 20 0 Q10 15 0 0Z" fill={codon.color} stroke="rgba(94,68,42,0.18)" strokeWidth={1.4} />
              <text x={10} y={4} textAnchor="middle" fill="var(--cherry-warm-brown)" fontSize={8} fontWeight={900}>
                {codon.anticodon}
              </text>
            </g>
          ))}

          <g transform="translate(386 548)">
            <text x={0} y={0} fill="var(--cherry-warm-brown)" fontSize={14} fontWeight={900}>
              amino acid chain
            </text>
            {codons.map((codon, index) => (
              <g key={codon.amino} transform={`translate(${index * 58} 22)`} opacity={index < aminoCount ? 1 : 0.22}>
                <circle r={18} fill={codon.color} stroke="rgba(94,68,42,0.16)" strokeWidth={1.5} />
                <text textAnchor="middle" dominantBaseline="middle" fill="var(--cherry-warm-brown)" fontSize={10} fontWeight={900}>
                  {codon.amino}
                </text>
              </g>
            ))}
          </g>
        </>
      ) : null}
    </g>
  );
}

export function GeneExpressionTool() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const progressRef = useRef(0);
  const [molecules, setMolecules] = useState(initialMolecules);
  const [dragging, setDragging] = useState<{ id: string; dx: number; dy: number } | null>(null);
  const [cycleProgress, setCycleProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);

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
  const taskStatuses = [
    { label: "把 TF 拖到 promoter，观察启动子变亮。", done: model.tfBound > 0 },
    { label: "把 RNA pol 拖到 gene body，观察 mRNA 出现。", done: model.transcriptionOn },
    { label: "把 ribosome 拖到 mRNA 附近，观察蛋白质产物增加。", done: model.translationOn },
  ];
  const transcriptionProgress = model.transcriptionOn ? clamp01(cycleProgress / 0.78) : 0;
  const translationProgress = model.translationOn ? clamp01((cycleProgress - 0.28) / 0.62) : 0;
  const ribosomeCanRead = model.translationOn && transcriptionProgress > 0.28;
  const ribosomeProgress = ribosomeCanRead ? Math.min(translationProgress, Math.max(0, transcriptionProgress - 0.08)) : 0;
  const activeCodonIndex = ribosomeCanRead ? Math.min(codons.length - 1, Math.floor(ribosomeProgress * codons.length)) : -1;

  useEffect(() => {
    progressRef.current = cycleProgress;
  }, [cycleProgress]);

  useEffect(() => {
    if (!model.transcriptionOn) {
      progressRef.current = 0;
      setCycleProgress(0);
      return;
    }
    if (isPaused) return;

    let frame = 0;
    const cycleLength = 6800;
    let last = performance.now();

    function tick(now: number) {
      const next = (progressRef.current + ((now - last) * speed) / cycleLength) % 1;
      last = now;
      progressRef.current = next;
      setCycleProgress(next);
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [model.transcriptionOn, isPaused, speed]);

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
    setIsPaused(false);
  }

  function runExpressionPreset() {
    const starterSet = new Set(["tf-1", "pol-1", "rib-1"]);
    setMolecules((items) =>
      items.map((molecule) => {
        if (!starterSet.has(molecule.id)) {
          return { ...molecule, x: molecule.homeX, y: molecule.homeY };
        }
        const zoneKey = moleculeZone(molecule.type);
        const slot = slots[zoneKey][moleculeSlotIndex(molecule)] ?? slots[zoneKey][0];
        return { ...molecule, x: slot.x, y: slot.y };
      })
    );
    setDragging(null);
    setIsPaused(false);
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
              基因表达实验台
            </text>
            <StageRail model={model} />

            <g transform="translate(154 170)">
              <rect x={0} y={0} width={668} height={150} rx={34} fill="rgba(250,247,241,0.72)" stroke="rgba(94,68,42,0.18)" strokeWidth={2} />
              <text x={24} y={34} fill="var(--cherry-warm-brown)" fontSize={16} fontWeight={900}>
                DNA
              </text>
              <rect x={60} y={64} width={540} height={10} rx={999} fill="url(#dnaTop)" />
              <rect x={60} y={90} width={540} height={10} rx={999} fill="url(#dnaBottom)" opacity={0.78} />
              <g transform="translate(242 18)">
                <text x={0} y={0} fill="var(--cherry-warm-mid)" fontSize={11} fontWeight={900}>
                  coding 5' {codons.map((codon) => codon.dna).join(" ")} 3'
                </text>
                <text x={0} y={124} fill="var(--cherry-warm-mid)" fontSize={11} fontWeight={900}>
                  template 3' {codons.map((codon) => codon.template).join(" ")} 5'
                </text>
              </g>
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
            </g>

            <LiveExpressionProcess model={model} progress={cycleProgress} />

            <rect x={zones.ribosome.x} y={zones.ribosome.y} width={zones.ribosome.w} height={zones.ribosome.h} rx={22} fill={model.ribBound > 0 ? "rgba(232,121,95,0.15)" : "rgba(250,247,241,0.38)"} stroke="var(--cherry-peach)" strokeWidth={2} strokeDasharray="7 7" />
            <text x={zones.ribosome.x + 22} y={zones.ribosome.y + 34} fill="var(--cherry-warm-brown)" fontSize={15} fontWeight={900}>
              ribosome dock
            </text>
            {[406, 520, 634].map((x, index) => (
              <circle key={x} cx={x} cy={450} r={30} fill="none" stroke={model.ribBound > index ? "var(--cherry-forest)" : "rgba(94,68,42,0.18)"} strokeWidth={2} strokeDasharray="4 5" />
            ))}

            <ProductBeads count={model.translationOn ? Math.min(model.protein, Math.max(1, Math.floor(cycleProgress * 12))) : 0} />

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
            <div style={{ display: "grid", gap: 8, marginTop: "1rem" }}>
              {[
                ["转录速率", `${model.transcriptionOn ? Math.min(100, 28 + model.tfBound * 18 + model.polBound * 16) : 0}%`],
                ["翻译速率", `${model.translationOn ? Math.min(100, 35 + model.ribBound * 20) : 0}%`],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--cherry-warm-mid)", fontSize: "0.78rem", fontWeight: 900, marginBottom: 4 }}>
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: "var(--muted)", overflow: "hidden" }}>
                    <div style={{ width: value, height: "100%", borderRadius: 999, background: label === "转录速率" ? "var(--cherry-blue)" : "var(--cherry-peach)" }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "1rem" }}>
              <button onClick={runExpressionPreset} style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.58rem 0.95rem", fontWeight: 900, cursor: "pointer" }}>
                运行表达
              </button>
              <button onClick={() => setIsPaused((value) => !value)} disabled={!model.transcriptionOn} style={{ background: model.transcriptionOn ? "var(--cherry-blue)" : "var(--muted)", color: model.transcriptionOn ? "#FAF7F1" : "var(--cherry-warm-mid)", border: "none", borderRadius: 999, padding: "0.58rem 0.95rem", fontWeight: 900, cursor: model.transcriptionOn ? "pointer" : "default" }}>
                {isPaused ? "继续" : "暂停"}
              </button>
              <button onClick={resetScene} style={{ background: "var(--muted)", color: "var(--cherry-warm-brown)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.58rem 0.95rem", fontWeight: 900, cursor: "pointer" }}>
                重置
              </button>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: "0.75rem" }}>
              {([0.5, 1, 1.5] as const).map((value) => (
                <button key={value} onClick={() => setSpeed(value)} style={{ background: speed === value ? "var(--cherry-yellow)" : "rgba(250,247,241,0.82)", color: "var(--cherry-warm-brown)", border: "1.5px solid rgba(94,68,42,0.14)", borderRadius: 999, padding: "0.32rem 0.68rem", fontWeight: 900, cursor: "pointer", fontSize: "0.75rem" }}>
                  {value}x
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.2rem", boxShadow: "4px 7px 0px rgba(94,68,42,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.85rem" }}>
              <IconDNA size={18} />
              序列读取
            </div>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {codons.map((codon, index) => {
                const active = activeCodonIndex === index;
                const transcribed = model.transcriptionOn && cycleProgress > 0.2 + index * 0.12;
                return (
                  <div key={codon.rna} style={{ display: "grid", gridTemplateColumns: "42px 1fr 42px", alignItems: "center", gap: 8, background: active ? "var(--cherry-yellow-light)" : transcribed ? "rgba(250,247,241,0.78)" : "var(--muted)", border: active ? "1.5px solid var(--cherry-red)" : "1.5px solid rgba(94,68,42,0.1)", borderRadius: 14, padding: "0.55rem", color: "var(--cherry-warm-mid)" }}>
                    <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.78rem" }}>{codon.dna}</strong>
                    <span style={{ fontSize: "0.78rem", fontWeight: 800 }}>
                      {transcribed ? `${codon.rna} / ${codon.anticodon}` : "等待转录"}
                    </span>
                    <strong style={{ color: active ? "var(--cherry-red)" : "var(--cherry-forest)", textAlign: "right", fontSize: "0.78rem" }}>{transcribed ? codon.amino : "--"}</strong>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 22, padding: "1.2rem", color: "var(--cherry-warm-mid)", lineHeight: 1.7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.65rem" }}>
              <IconSparkle size={18} />
              操作任务
            </div>
            <div style={{ display: "grid", gap: "0.55rem", fontSize: "0.86rem" }}>
              {taskStatuses.map((item, index) => (
                <div key={item.label} style={{ display: "flex", gap: 8, alignItems: "flex-start", opacity: item.done ? 1 : 0.72 }}>
                  <span style={{ width: 18, height: 18, borderRadius: "50%", background: item.done ? "var(--cherry-forest)" : "rgba(250,247,241,0.7)", border: "1.5px solid rgba(94,68,42,0.16)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    {item.done ? <IconCheck size={12} color="#FAF7F1" /> : <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.68rem", fontWeight: 900 }}>{index + 1}</span>}
                  </span>
                  <span style={{ color: item.done ? "var(--cherry-warm-brown)" : "var(--cherry-warm-mid)", fontWeight: item.done ? 900 : 700 }}>{item.label}</span>
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
                  ? "mRNA 正从 RNA 聚合酶后方延伸出来：把核糖体放到 mRNA 附近可以开始翻译。"
                  : "转录和翻译正在连续发生：mRNA 边延伸，核糖体边读取密码子，蛋白质产物开始累积。"}
            </div>
          </div>
        </aside>
      </div>

      <style>
        {`
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
