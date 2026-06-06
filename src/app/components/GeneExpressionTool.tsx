import { useEffect, useMemo, useRef, useState } from "react";
import { IconCheck, IconDNA, IconMicroscope, IconSparkle } from "./Icons";
import { copyText } from "../clipboard";

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

const moleculeNames: Record<MoleculeType, string> = {
  tf: "转录因子",
  pol: "RNA 聚合酶",
  ribosome: "核糖体",
};

const initialMolecules: Molecule[] = [
  { id: "tf-1", type: "tf", label: "TF", x: 82, y: 146, homeX: 82, homeY: 146, color: "var(--cherry-yellow)" },
  { id: "tf-2", type: "tf", label: "TF", x: 136, y: 112, homeX: 136, homeY: 112, color: "var(--cherry-yellow)" },
  { id: "tf-3", type: "tf", label: "TF", x: 188, y: 146, homeX: 188, homeY: 146, color: "var(--cherry-yellow)" },
  { id: "pol-1", type: "pol", label: "RNA pol", x: 710, y: 120, homeX: 710, homeY: 120, color: "var(--cherry-blue-light)" },
  { id: "pol-2", type: "pol", label: "RNA pol", x: 804, y: 156, homeX: 804, homeY: 156, color: "var(--cherry-blue-light)" },
  { id: "rib-1", type: "ribosome", label: "核糖体", x: 90, y: 500, homeX: 90, homeY: 500, color: "var(--cherry-peach-light)" },
  { id: "rib-2", type: "ribosome", label: "核糖体", x: 164, y: 536, homeX: 164, homeY: 536, color: "var(--cherry-peach-light)" },
  { id: "rib-3", type: "ribosome", label: "核糖体", x: 238, y: 500, homeX: 238, homeY: 500, color: "var(--cherry-peach-light)" },
];

const defaultDockedMoleculeIds = new Set(["tf-1", "pol-1", "rib-1"]);

const codons = [
  { dna: "ATG", template: "TAC", rna: "AUG", amino: "Met", anticodon: "UAC", color: "var(--cherry-peach)" },
  { dna: "GAA", template: "CTT", rna: "GAA", amino: "Glu", anticodon: "CUU", color: "var(--cherry-yellow)" },
  { dna: "TTT", template: "AAA", rna: "UUU", amino: "Phe", anticodon: "AAA", color: "var(--cherry-sage)" },
  { dna: "CCG", template: "GGC", rna: "CCG", amino: "Pro", anticodon: "GGC", color: "var(--cherry-blue)" },
];

const transcriptBases = codons.flatMap((codon, codonIndex) =>
  codon.rna.split("").map((base, baseIndex) => ({
    base,
    codonIndex,
    baseIndex,
    color: codon.color,
  })),
);

const geneQuizItems = [
  {
    id: "five-end",
    question: "边转录边翻译时，核糖体最先读取 mRNA 的哪一端？",
    options: ["5' 自由端", "3' 生长端", "RNA 聚合酶内部"],
    answer: "5' 自由端",
    explain: "新生 mRNA 的 5' 端先露出，核糖体可以从这段已露出的序列开始读取密码子。",
  },
  {
    id: "growth-end",
    question: "mRNA 的 3' 生长端在动画里为什么贴着 RNA 聚合酶？",
    options: ["新碱基在聚合酶出口附近接上", "核糖体把 mRNA 拉长", "mRNA 自己从尾端复制出来"],
    answer: "新碱基在聚合酶出口附近接上",
    explain: "转录时 RNA 聚合酶沿 DNA 移动，并在出口附近持续延长 RNA 的 3' 端。",
  },
  {
    id: "start-codon",
    question: "固定序列里的 AUG 在这个模型中对应哪一个氨基酸？",
    options: ["Met", "Glu", "Phe"],
    answer: "Met",
    explain: "AUG 通常作为起始密码子，在这里对应 Met，后面的 GAA、UUU、CCG 继续接出 Glu、Phe、Pro。",
  },
  {
    id: "ribosome-role",
    question: "如果保留 mRNA 但移走核糖体，最直接的结果是什么？",
    options: ["多肽链不再继续延伸", "DNA 会立刻消失", "mRNA 会变回 DNA"],
    answer: "多肽链不再继续延伸",
    explain: "mRNA 只是被读取的模板；没有核糖体读取密码子，氨基酸就不会继续接到多肽链上。",
  },
  {
    id: "tf-pol",
    question: "启动子没有 TF 或基因区没有 RNA 聚合酶时，动画为什么不会产生新 mRNA？",
    options: ["转录没有启动", "翻译速度太快", "多肽链已经完成"],
    answer: "转录没有启动",
    explain: "这个简化模型要求 TF 帮助启动子进入可转录状态，同时 RNA 聚合酶负责实际合成 mRNA。",
  },
];

const initialCycleProgress = 0.42;
const ribosomeStartFraction = 0.08;
const ribosomeTravelSpan = 0.86;

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
  docked,
  dragging,
  onPointerDown,
  onKeyToggle,
}: {
  molecule: Molecule;
  docked: boolean;
  dragging: boolean;
  onPointerDown: (event: React.PointerEvent<SVGGElement>, molecule: Molecule) => void;
  onKeyToggle: (molecule: Molecule) => void;
}) {
  const radius = docked ? (molecule.type === "pol" ? 30 : molecule.type === "ribosome" ? 27 : 24) : molecule.type === "pol" ? 44 : molecule.type === "ribosome" ? 38 : 31;
  const shortLabel = molecule.type === "pol" ? "RNA pol" : molecule.type === "ribosome" ? "核糖体" : "TF";

  return (
    <g
      transform={`translate(${molecule.x} ${molecule.y})`}
      role="button"
      tabIndex={0}
      aria-label={`${moleculeNames[molecule.type]}${docked ? "已加入反应区域，按 Enter 移回分子库" : "在分子库，按 Enter 加入反应区域"}`}
      onPointerDown={(event) => onPointerDown(event, molecule)}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        onKeyToggle(molecule);
      }}
      opacity={docked && !dragging ? 0.7 : 1}
      style={{ cursor: "grab", filter: dragging ? "drop-shadow(5px 8px 0 rgba(94,68,42,0.16))" : docked ? "drop-shadow(1px 2px 0 rgba(94,68,42,0.07))" : "drop-shadow(3px 4px 0 rgba(94,68,42,0.08))" }}
    >
      {docked ? <circle r={radius + 9} fill="none" stroke="var(--cherry-forest)" strokeWidth={2} strokeDasharray="4 6" opacity={0.72} /> : null}
      <ellipse
        rx={radius}
        ry={docked ? radius * 0.72 : molecule.type === "pol" ? 30 : 26}
        fill={molecule.color}
        stroke={molecule.type === "pol" ? "var(--cherry-blue)" : "rgba(94,68,42,0.22)"}
        strokeWidth={docked ? 2 : molecule.type === "pol" ? 3 : 2}
      />
      <text textAnchor="middle" dominantBaseline="middle" fill="var(--cherry-warm-brown)" fontSize={molecule.type === "pol" ? 13 : 14} fontWeight={900}>
        {docked ? shortLabel : molecule.label}
      </text>
    </g>
  );
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

function StageRail({ model, activeRibosomeCount, visibleProteinCount }: { model: { tfBound: number; polBound: number; transcriptionOn: boolean }; activeRibosomeCount: number; visibleProteinCount: number }) {
  const stages = [
    { label: "TF 结合启动子", active: model.tfBound > 0 },
    { label: "RNA 聚合酶转录", active: model.transcriptionOn },
    { label: "核糖体翻译", active: activeRibosomeCount > 0 || visibleProteinCount > 0 },
    { label: "出口长出多肽", active: visibleProteinCount > 0 },
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

function smoothPath(points: Point[]) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${points[0].x} ${points[0].y}`;
  if (points.length === 2) return `M${points[0].x} ${points[0].y} L${points[1].x} ${points[1].y}`;

  const path = [`M${points[0].x} ${points[0].y}`];
  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const midpoint = { x: (current.x + next.x) / 2, y: (current.y + next.y) / 2 };
    path.push(`Q${current.x} ${current.y} ${midpoint.x} ${midpoint.y}`);
  }

  const last = points[points.length - 1];
  path.push(`L${last.x} ${last.y}`);
  return path.join(" ");
}

function partialPolylinePoints(points: Point[], progress: number) {
  const boundedProgress = clamp01(progress);
  if (boundedProgress <= 0) return [points[0]];

  const lengths = points.slice(1).map((point, index) => {
    const previous = points[index];
    return Math.hypot(point.x - previous.x, point.y - previous.y);
  });
  const totalLength = lengths.reduce((sum, length) => sum + length, 0);
  let remaining = totalLength * boundedProgress;
  const partialPoints = [points[0]];

  for (let index = 0; index < lengths.length; index += 1) {
    const previous = points[index];
    const next = points[index + 1];
    if (remaining >= lengths[index]) {
      partialPoints.push(next);
      remaining -= lengths[index];
    } else {
      const localProgress = lengths[index] === 0 ? 0 : remaining / lengths[index];
      partialPoints.push({ x: lerp(previous.x, next.x, localProgress), y: lerp(previous.y, next.y, localProgress) });
      break;
    }
  }

  return partialPoints;
}

function partialPolylinePath(points: Point[], progress: number) {
  return smoothPath(partialPolylinePoints(points, progress));
}

function fullPolylinePath(points: Point[]) {
  return partialPolylinePath(points, 1);
}

function buildNascentMrnaPath(polymerasePoint: Point, progress: number, offset: Point = { x: 0, y: 0 }) {
  const exit = { x: polymerasePoint.x + 10 + offset.x, y: polymerasePoint.y + 31 + offset.y };
  const boundedProgress = clamp01(progress);
  const tailLength = 78 + boundedProgress * 335;

  return [
    { x: exit.x - tailLength, y: exit.y + 90 },
    { x: exit.x - tailLength * 0.86, y: exit.y + 42 },
    { x: exit.x - tailLength * 0.64, y: exit.y + 118 },
    { x: exit.x - tailLength * 0.43, y: exit.y + 62 },
    { x: exit.x - tailLength * 0.23, y: exit.y + 98 },
    exit,
  ];
}

function buildPolymeraseTracks(progress: number, polBound: number) {
  return Array.from({ length: Math.max(1, polBound) }).map((_, index) => {
    const activeSpan = 0.86;
    const phase = (progress + index * 0.22) % 1;
    const localProgress = phase < activeSpan ? phase / activeSpan : 0;
    const entryOpacity = clamp01(phase / 0.08);
    const exitOpacity = clamp01((activeSpan - phase) / 0.1);
    const opacity = phase < activeSpan ? Math.min(entryOpacity, exitOpacity) : 0;
    const offset = { x: -index * 12, y: index * 14 };
    const tip = pointOnPolyline(transcriptPath, localProgress);
    const point = { x: lerp(392, 676, localProgress), y: 250 + index * 12 };
    const exit = { x: point.x + 10, y: point.y + 31 };
    return {
      point,
      offset,
      path: partialPolylinePath(transcriptPath, localProgress),
      tip: { x: tip.x + offset.x, y: tip.y + offset.y },
      exit,
      progress: localProgress,
      opacity,
    };
  });
}

function maxVisibleTranscribedProgress(progress: number, polBound: number) {
  const transcriptionProgress = clamp01(progress / 0.78);
  const polymerases = buildPolymeraseTracks(progress, polBound);
  return Math.max(transcriptionProgress, ...polymerases.map((polymerase) => polymerase.progress * polymerase.opacity));
}

function buildRibosomeTracks(progress: number, ribBound: number, canRead: boolean, maxTranscribedProgress: number, path: Point[] = transcriptPath) {
  return Array.from({ length: ribBound }).map((_, index) => {
    const readableLimit = clamp01(maxTranscribedProgress - 0.08);
    const readableSpan = Math.max(0, readableLimit - ribosomeStartFraction);
    const hasReadableSegment = canRead && readableSpan > 0.05;
    const phase = (progress * 0.92 + index * 0.22) % 1;
    const localProgress = hasReadableSegment ? phase : 0;
    const readProgress = hasReadableSegment
      ? ribosomeStartFraction + readableSpan * localProgress
      : ribosomeStartFraction;
    const translationProgress = clamp01((readProgress - ribosomeStartFraction) / ribosomeTravelSpan);
    const entryOpacity = clamp01(readableSpan / 0.12) * clamp01(phase / 0.08);
    const exitOpacity = phase > 0.92 ? clamp01((1 - phase) / 0.08) : 1;
    return {
      point: pointOnPolyline(path, readProgress),
      progress: translationProgress,
      readProgress,
      opacity: hasReadableSegment ? Math.min(entryOpacity, exitOpacity) : 0,
    };
  });
}

function aminoCountForRibosome(progress: number) {
  if (progress <= 0.08) return 0;
  return Math.min(codons.length, Math.floor(progress * codons.length) + 1);
}

function ribosomePeptideExitPoint(ribosomeCenter: Point) {
  return { x: ribosomeCenter.x + 36, y: ribosomeCenter.y - 16 };
}

function peptideBeadPoint(exit: Point, index: number) {
  const points = [
    { x: exit.x + 6, y: exit.y - 5 },
    { x: exit.x + 19, y: exit.y - 17 },
    { x: exit.x + 35, y: exit.y - 9 },
    { x: exit.x + 50, y: exit.y - 23 },
  ];
  return points[index] ?? points[points.length - 1];
}

function LiveExpressionProcess({
  model,
  progress,
  retainedMrnaCount,
  canTranslate,
  prefersReducedMotion,
}: {
  model: { transcriptionOn: boolean; polBound: number; ribBound: number };
  progress: number;
  retainedMrnaCount: number;
  canTranslate: boolean;
  prefersReducedMotion: boolean;
}) {
  const transcriptionProgress = model.transcriptionOn ? clamp01(progress / 0.78) : 0;
  const ribosomeCanRead = canTranslate && (model.transcriptionOn ? transcriptionProgress > 0.28 : retainedMrnaCount > 0);
  const polymerases = buildPolymeraseTracks(progress, model.polBound);
  const leadPolymerase = polymerases.find((polymerase) => polymerase.opacity > 0);
  const coupledMrnaPath = model.transcriptionOn && leadPolymerase
    ? buildNascentMrnaPath(leadPolymerase.point, leadPolymerase.progress, leadPolymerase.offset)
    : transcriptPath;
  const maxTranscribedProgress = model.transcriptionOn
    ? Math.max(transcriptionProgress, ...polymerases.map((polymerase) => polymerase.progress * polymerase.opacity))
    : retainedMrnaCount > 0 ? 1 : 0;
  const readableMrnaProgress = clamp01(Math.max(0, maxTranscribedProgress - 0.06));
  const readableMrnaPath = partialPolylinePath(coupledMrnaPath, readableMrnaProgress);
  const ribosomes = buildRibosomeTracks(progress, model.ribBound, ribosomeCanRead, maxTranscribedProgress, coupledMrnaPath);
  const renderedRibosomes = ribosomes.map((ribosome, index) => ({
    ...ribosome,
    renderPoint: { x: ribosome.point.x, y: ribosome.point.y + index * 8 },
  }));
  const leadRibosome = renderedRibosomes.find((ribosome) => ribosome.opacity > 0);
  const leadRibosomeProgress = leadRibosome?.progress ?? 0;
  const leadRibosomePoint = leadRibosome?.renderPoint ?? null;
  const activeCodonIndex = ribosomeCanRead && leadRibosomeProgress > 0 ? Math.min(codons.length - 1, Math.floor(leadRibosomeProgress * codons.length)) : -1;
  const translationLayer = canTranslate ? (
    <>
      {renderedRibosomes.map((ribosome, index) => {
        const codonIndex = Math.min(codons.length - 1, Math.floor(ribosome.progress * codons.length));
        const currentCodon = codons[codonIndex];
        return (
          <g key={`moving-ribosome-${index}`} transform={`translate(${ribosome.renderPoint.x} ${ribosome.renderPoint.y})`} opacity={ribosome.opacity}>
            <ellipse rx={48} ry={30} fill="var(--cherry-peach-light)" stroke="var(--cherry-peach)" strokeWidth={3} />
            <circle cx={-22} cy={-7} r={9} fill="rgba(250,247,241,0.58)" />
            <circle cx={18} cy={9} r={7} fill="rgba(250,247,241,0.58)" />
            <rect x={-42} y={7} width={84} height={20} rx={9} fill="rgba(250,247,241,0.92)" stroke="rgba(94,68,42,0.16)" strokeWidth={1.4} />
            <circle cx={-13} cy={-3} r={8} fill="rgba(250,247,241,0.72)" stroke="rgba(94,68,42,0.14)" strokeWidth={1.2} />
            <circle cx={13} cy={-3} r={8} fill="rgba(250,247,241,0.72)" stroke="rgba(94,68,42,0.14)" strokeWidth={1.2} />
            <circle className="ribosome-peptide-exit-port" cx={36} cy={-16} r={6.5} fill="var(--cherry-forest)" stroke="#FAF7F1" strokeWidth={2.2} />
            <text x={36} y={-27} textAnchor="middle" fill="var(--cherry-forest)" fontSize={7} fontWeight={900}>
              出口
            </text>
            <g transform="translate(13 -42)" opacity={0.92}>
              <path d="M-13 1 Q0 -14 13 1 Q0 13 -13 1Z" fill={currentCodon?.color ?? "var(--cherry-yellow)"} stroke="#FAF7F1" strokeWidth={2}>
                {prefersReducedMotion ? null : <animateTransform attributeName="transform" type="translate" values="0 -2;0 3;0 0" dur="0.8s" repeatCount="indefinite" />}
              </path>
              <text y={4} textAnchor="middle" dominantBaseline="middle" fill="var(--cherry-warm-brown)" fontSize={6.5} fontWeight={900}>
                tRNA
              </text>
            </g>
            <text x={-13} y={0} textAnchor="middle" fill="var(--cherry-warm-mid)" fontSize={7} fontWeight={900}>
              P
            </text>
            <text x={13} y={0} textAnchor="middle" fill="var(--cherry-warm-mid)" fontSize={7} fontWeight={900}>
              A
            </text>
            <text y={-14} textAnchor="middle" dominantBaseline="middle" fill="var(--cherry-warm-brown)" fontSize={13} fontWeight={900}>
              核糖体
            </text>
            <text x={0} y={22} textAnchor="middle" fill="var(--cherry-red)" fontSize={11} fontWeight={900}>
              {currentCodon?.rna ?? ""}
            </text>
          </g>
        );
      })}

      {renderedRibosomes.map((ribosome, ribosomeIndex) => {
        const aminoCount = aminoCountForRibosome(ribosome.progress);
        if (ribosome.opacity <= 0 || aminoCount <= 0) return null;

        const exit = ribosomePeptideExitPoint(ribosome.renderPoint);
        const beadPoints = codons.slice(0, aminoCount).map((_, aminoIndex) => peptideBeadPoint(exit, aminoIndex));
        const chainPath = [exit, ...beadPoints].map((point, aminoIndex) => `${aminoIndex === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");

        return (
          <g className="live-peptide-bead-chain" key={`live-peptide-chain-${ribosomeIndex}`} opacity={ribosome.opacity}>
            <path
              d={`M${exit.x - 28} ${exit.y + 6} C${exit.x - 18} ${exit.y + 2} ${exit.x - 8} ${exit.y - 2} ${exit.x + 4} ${exit.y - 4}`}
              fill="none"
              stroke="var(--cherry-forest)"
              strokeWidth={6}
              strokeLinecap="round"
              opacity={0.46}
            />
            {beadPoints.length > 0 ? <path d={chainPath} fill="none" stroke="var(--cherry-forest)" strokeWidth={4.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.78} /> : null}
            {ribosomeIndex === 0 ? (
              <text x={exit.x + 24} y={exit.y - 34} fill="var(--cherry-forest)" fontSize={11} fontWeight={900}>
                多肽链
              </text>
            ) : null}
            {codons.slice(0, aminoCount).map((codon, aminoIndex) => {
              const point = beadPoints[aminoIndex];

              return (
                <g key={`live-peptide-${ribosomeIndex}-${codon.amino}`} transform={`translate(${point.x} ${point.y})`}>
                  <circle r={10.5} fill={codon.color} stroke="rgba(94,68,42,0.18)" strokeWidth={1.4}>
                    {prefersReducedMotion ? null : <animate attributeName="r" values="8;12;10.5" dur="0.7s" begin={`${aminoIndex * 0.08}s`} repeatCount="1" />}
                  </circle>
                  <text textAnchor="middle" dominantBaseline="middle" fill="var(--cherry-warm-brown)" fontSize={7} fontWeight={900}>
                    {codon.amino}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {codons.map((codon, index) => {
        const activePoint = activeCodonIndex === index ? leadRibosomePoint : null;
        const poolX = 540 + index * 42;
        const poolY = 500 - index * 16;
        const x = activePoint ? activePoint.x + 2 : poolX;
        const y = activePoint ? activePoint.y - 48 : poolY;
        return (
          <g key={`trna-${codon.rna}`} transform={`translate(${x} ${y})`} opacity={activePoint ? 1 : 0.16}>
            {activePoint ? <line x1={10} y1={14} x2={10} y2={38} stroke="var(--cherry-peach)" strokeWidth={2.2} strokeLinecap="round" strokeDasharray="4 4" /> : null}
            <path d="M0 0 Q10 -18 20 0 Q10 15 0 0Z" fill={codon.color} stroke="rgba(94,68,42,0.18)" strokeWidth={1.4} />
            <circle cx={10} cy={-18} r={10} fill={codon.color} stroke="rgba(94,68,42,0.16)" strokeWidth={1.4} />
            <text x={10} y={4} textAnchor="middle" fill="var(--cherry-warm-brown)" fontSize={8} fontWeight={900}>
              {codon.anticodon}
            </text>
            <text x={10} y={-15} textAnchor="middle" fill="var(--cherry-warm-brown)" fontSize={7} fontWeight={900}>
              {codon.amino}
            </text>
          </g>
        );
      })}
    </>
  ) : null;

  if (!model.transcriptionOn) {
    if (retainedMrnaCount > 0) {
      return (
        <g>
          <g opacity={0.72}>
            {Array.from({ length: Math.min(4, retainedMrnaCount) }).map((_, index) => (
              <path
                key={index}
                d={partialPolylinePath(transcriptPath, Math.min(1, 0.28 + index * 0.22))}
                fill="none"
                stroke="var(--cherry-red)"
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                transform={`translate(${-8 - index * 8} ${10 + index * 13})`}
                opacity={0.42}
              />
            ))}
            <text x={418} y={362} fill="var(--cherry-warm-mid)" fontSize={15} fontWeight={800}>
              已生成的 mRNA 片段仍保留在反应区域
            </text>
          </g>
          {translationLayer}
        </g>
      );
    }

    return (
      <g opacity={0.4}>
        <path d="M392 270 C396 312 424 324 462 330" fill="none" stroke="var(--cherry-red)" strokeWidth={8} strokeLinecap="round" strokeDasharray="12 14" />
        <text x={418} y={362} fill="var(--cherry-warm-mid)" fontSize={15} fontWeight={800}>
          RNA 聚合酶结合后，新生 mRNA 会从 DNA 旁边延伸出来
        </text>
      </g>
    );
  }

  return (
    <g>
      {polymerases.map((polymerase, index) => {
        const nascentPath = buildNascentMrnaPath(polymerase.point, polymerase.progress, polymerase.offset);
        const fiveEnd = nascentPath[0];
        const growthEnd = nascentPath[nascentPath.length - 1];
        const polymeraseBody = { x: polymerase.point.x + polymerase.offset.x, y: polymerase.point.y + polymerase.offset.y };

        return (
          <g key={`moving-transcript-${index}`} opacity={polymerase.opacity}>
            <path d={fullPolylinePath(nascentPath)} fill="none" stroke="rgba(232,121,95,0.2)" strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" />
            <path d={fullPolylinePath(nascentPath)} fill="none" stroke="var(--cherry-red)" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#mrnaArrow)" />
            <path
              d={partialPolylinePath(nascentPath, Math.max(ribosomeStartFraction, polymerase.progress - 0.06))}
              fill="none"
              stroke="#FAF7F1"
              strokeWidth={3.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="7 8"
              opacity={polymerase.progress > 0.2 ? 0.95 : 0}
            />
            <path
              d={`M${polymeraseBody.x + 3} ${polymeraseBody.y + 18} C${polymeraseBody.x + 8} ${polymeraseBody.y + 26} ${growthEnd.x - 3} ${growthEnd.y - 5} ${growthEnd.x} ${growthEnd.y}`}
              fill="none"
              stroke="var(--cherry-red)"
              strokeWidth={4}
              strokeLinecap="round"
              opacity={0.72}
            />
            <g transform={`translate(${fiveEnd.x} ${fiveEnd.y})`} opacity={polymerase.progress > 0.12 ? 1 : 0}>
              <circle r={8} fill="#FAF7F1" stroke="var(--cherry-red)" strokeWidth={2.4} />
              <path d="M-15 -6 C-22 -10 -26 -4 -22 1" fill="none" stroke="var(--cherry-red)" strokeWidth={2.2} strokeLinecap="round" opacity={0.62} />
              <text x={-12} y={24} fill="var(--cherry-red)" fontSize={11} fontWeight={900}>
                5' 自由端
              </text>
            </g>
            {polymerase.progress > 0.16 ? (
              <text x={fiveEnd.x - 14} y={fiveEnd.y + 39} fill="var(--cherry-warm-mid)" fontSize={10} fontWeight={800}>
                核糖体从 5' 端附近开始读
              </text>
            ) : null}
            {transcriptBases.map((base, baseIndex) => {
              const pathProgress = 0.08 + baseIndex * 0.066;
              const visible = polymerase.progress > 0.1 + baseIndex * 0.052;
              const basePoint = pointOnPolyline(nascentPath, pathProgress);

              return (
                <g className="mrna-nucleotide-bead" key={`rna-base-${index}-${base.codonIndex}-${base.baseIndex}`} transform={`translate(${basePoint.x} ${basePoint.y})`} opacity={visible ? 1 : 0}>
                  <circle r={8.5} fill="rgba(250,247,241,0.94)" stroke={base.color} strokeWidth={2} />
                  <text textAnchor="middle" dominantBaseline="middle" fill="var(--cherry-red)" fontSize={7} fontWeight={900}>
                    {base.base}
                  </text>
                </g>
              );
            })}
            <g transform={`translate(${growthEnd.x} ${growthEnd.y})`}>
              <circle r={13} fill="rgba(232,121,95,0.18)" />
              <circle r={8.5} fill="var(--cherry-red)" stroke="#FAF7F1" strokeWidth={3}>
                {prefersReducedMotion ? null : <animate attributeName="r" values="7;11;8.5" dur="0.9s" repeatCount="indefinite" />}
              </circle>
              <text x={14} y={4} fill="var(--cherry-red)" fontSize={11} fontWeight={900}>
                3' 生长端
              </text>
            </g>
            <text x={growthEnd.x + 14} y={growthEnd.y + 19} fill="var(--cherry-warm-mid)" fontSize={10} fontWeight={800}>
              贴着 RNA 聚合酶出口
            </text>
            <text x={growthEnd.x - 76} y={growthEnd.y + 31} fill="var(--cherry-warm-mid)" fontSize={10} fontWeight={800}>
              原核模型：只能读取已露出的 mRNA
            </text>
          </g>
        );
      })}

      {ribosomeCanRead ? (
        <g opacity={0.9}>
          <path d={readableMrnaPath} fill="none" stroke="var(--cherry-forest)" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 7" />
          <text x={438} y={392} fill="var(--cherry-forest)" fontSize={11} fontWeight={900}>
            绿色虚线：核糖体当前可读取的已转录片段
          </text>
        </g>
      ) : null}

      {polymerases.map((polymerase, index) => (
        <g key={`moving-pol-${index}`} transform={`translate(${polymerase.point.x + polymerase.offset.x} ${polymerase.point.y + polymerase.offset.y})`} opacity={polymerase.opacity}>
          <ellipse rx={42} ry={27} fill="var(--cherry-blue-light)" stroke="var(--cherry-blue)" strokeWidth={3} />
          <path d="M-18 9 C-6 16 6 16 18 9" fill="none" stroke="var(--cherry-blue)" strokeWidth={3} strokeLinecap="round" opacity={0.58} />
          <circle cx={10} cy={31} r={7} fill="var(--cherry-red)" stroke="#FAF7F1" strokeWidth={2.2} />
          <text textAnchor="middle" dominantBaseline="middle" fill="var(--cherry-warm-brown)" fontSize={12} fontWeight={900}>
            RNA 聚合酶
          </text>
        </g>
      ))}

      {codons.map((codon, index) => {
        const point = pointOnPolyline(coupledMrnaPath, 0.12 + index * 0.2);
        const visible = maxTranscribedProgress > 0.22 + index * 0.13;
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

      {translationLayer}
    </g>
  );
}

export function GeneExpressionTool() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const progressRef = useRef(initialCycleProgress);
  const prefersReducedMotion = usePrefersReducedMotion();
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
      { x: 452, y: 214 },
      { x: 586, y: 214 },
    ],
    ribosome: [
      { x: 406, y: 404 },
      { x: 520, y: 404 },
      { x: 634, y: 404 },
    ],
  };

  function dockDefaultMolecules() {
    return initialMolecules.map((molecule) => {
      if (!defaultDockedMoleculeIds.has(molecule.id)) return molecule;
      const zoneKey = moleculeZone(molecule.type);
      const slot = slots[zoneKey][moleculeSlotIndex(molecule)] ?? slots[zoneKey][0];
      return { ...molecule, x: slot.x, y: slot.y };
    });
  }

  const [molecules, setMolecules] = useState<Molecule[]>(dockDefaultMolecules);
  const [dragging, setDragging] = useState<{ id: string; dx: number; dy: number } | null>(null);
  const [cycleProgress, setCycleProgress] = useState(initialCycleProgress);
  const [displayedMrnaCount, setDisplayedMrnaCount] = useState(0);
  const [displayedProteinCount, setDisplayedProteinCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [copiedProcessRecord, setCopiedProcessRecord] = useState(false);
  const [processRecordStatus, setProcessRecordStatus] = useState("");
  const [copiedExperimentRecord, setCopiedExperimentRecord] = useState(false);
  const [experimentRecordStatus, setExperimentRecordStatus] = useState("");
  const [experimentVariableDraft, setExperimentVariableDraft] = useState("");
  const [experimentObservationDraft, setExperimentObservationDraft] = useState("");
  const [experimentExplanationDraft, setExperimentExplanationDraft] = useState("");
  const [experimentNextDraft, setExperimentNextDraft] = useState("");

  const model = useMemo(() => {
    const tfBound = molecules.filter((molecule) => molecule.type === "tf" && inBox(molecule, zones.promoter)).length;
    const polBound = molecules.filter((molecule) => molecule.type === "pol" && inBox(molecule, zones.polymerase)).length;
    const ribBound = molecules.filter((molecule) => molecule.type === "ribosome" && inBox(molecule, zones.ribosome)).length;
    const transcriptionOn = tfBound > 0 && polBound > 0;
    const mrna = transcriptionOn ? Math.min(5, tfBound + polBound + 1) : 0;

    return { tfBound, polBound, ribBound, transcriptionOn, mrna };
  }, [molecules, zones.polymerase, zones.promoter, zones.ribosome]);
  const transcriptionProgress = model.transcriptionOn ? clamp01(cycleProgress / 0.78) : 0;
  const transcribedProgress = model.transcriptionOn ? maxVisibleTranscribedProgress(cycleProgress, model.polBound) : 0;
  const instantMrnaCount = model.transcriptionOn ? Math.min(model.mrna, Math.floor(transcribedProgress * (model.mrna + 0.75))) : 0;
  const visibleMrnaCount = Math.min(5, Math.max(displayedMrnaCount, instantMrnaCount));
  const mrnaReadoutMax = Math.max(visibleMrnaCount, model.mrna);
  const retainedTranscriptProgress = model.transcriptionOn ? transcribedProgress : visibleMrnaCount > 0 ? 1 : 0;
  const canTranslate = model.ribBound > 0 && visibleMrnaCount > 0;
  const reactionRunning = model.transcriptionOn || canTranslate;
  const canPauseReaction = reactionRunning && !prefersReducedMotion;
  const ribosomeCanRead = canTranslate && (model.transcriptionOn ? transcriptionProgress > 0.28 : visibleMrnaCount > 0);
  const currentPolymerases = buildPolymeraseTracks(cycleProgress, model.polBound);
  const currentLeadPolymerase = currentPolymerases.find((polymerase) => polymerase.opacity > 0);
  const currentReadableMrnaPath = model.transcriptionOn && currentLeadPolymerase
    ? buildNascentMrnaPath(currentLeadPolymerase.point, currentLeadPolymerase.progress, currentLeadPolymerase.offset)
    : transcriptPath;
  const readableRibosomes = buildRibosomeTracks(cycleProgress, model.ribBound, ribosomeCanRead, retainedTranscriptProgress, currentReadableMrnaPath).filter((ribosome) => ribosome.opacity > 0);
  const activeRibosomeCount = readableRibosomes.length;
  const leadRibosomeProgress = readableRibosomes[0]?.progress ?? 0;
  const activeCodonIndex = leadRibosomeProgress > 0 ? Math.min(codons.length - 1, Math.floor(leadRibosomeProgress * codons.length)) : -1;
  const activeCodon = activeCodonIndex >= 0 ? codons[activeCodonIndex] : null;
  const focusedCodon = activeCodon ?? (visibleMrnaCount > 0 ? codons[Math.min(codons.length - 1, Math.max(0, visibleProteinCount))] : null);
  const peptidePreviewCount = activeRibosomeCount > 0 ? aminoCountForRibosome(leadRibosomeProgress) : Math.min(codons.length, visibleProteinCount);
  const peptidePreview = peptidePreviewCount > 0 ? codons.slice(0, peptidePreviewCount).map((codon) => codon.amino).join(" - ") : "等待第一颗氨基酸";
  const translatedSignal = readableRibosomes.reduce((sum, ribosome) => sum + ribosome.progress, 0);
  const proteinCapacity = canTranslate ? Math.min(12, visibleMrnaCount * model.ribBound) : 0;
  const instantProteinCount = canTranslate ? Math.min(proteinCapacity, Math.floor(translatedSignal * 4)) : 0;
  const visibleProteinCount = Math.min(12, Math.max(displayedProteinCount, instantProteinCount));
  const proteinReadoutMax = Math.max(visibleProteinCount, proteinCapacity);
  const translationRate = activeRibosomeCount > 0 ? Math.min(100, 35 + activeRibosomeCount * 20) : 0;
  const activeQuiz = geneQuizItems[activeQuizIndex];
  const activeQuizAnswer = quizAnswers[activeQuiz.id];
  const quizAnsweredCount = geneQuizItems.filter((item) => quizAnswers[item.id]).length;
  const quizCorrectCount = geneQuizItems.filter((item) => quizAnswers[item.id] === item.answer).length;
  const taskStatuses = [
    { label: "把 TF 拖到启动子，观察启动子变亮。", done: model.tfBound > 0 },
    { label: "把 RNA 聚合酶拖到基因区，观察 mRNA 从 5' 端到 3' 生长端延伸。", done: visibleMrnaCount > 0 },
    { label: "把核糖体拖到 mRNA 附近，观察多肽链从出口逐颗长出。", done: visibleProteinCount > 0 },
  ];
  const expressionCompletionChecks = [
    {
      title: "转录启动",
      done: model.transcriptionOn,
      body: model.transcriptionOn ? "TF 和 RNA 聚合酶都已进入正确区域，DNA 信息正在被转写成 mRNA。" : "先把 TF 放到启动子，再把 RNA 聚合酶放到基因区。",
    },
    {
      title: "mRNA 生长端",
      done: visibleMrnaCount > 0,
      body: visibleMrnaCount > 0 ? "已经能看到 mRNA 曲线从 DNA 旁边延伸，3' 生长端贴着 RNA 聚合酶出口。" : "等待 mRNA 片段出现后，再观察 5' 自由端和 3' 生长端的位置。",
    },
    {
      title: "翻译产物",
      done: visibleProteinCount > 0,
      body: visibleProteinCount > 0 ? `多肽链已从核糖体出口长出，当前片段是 ${peptidePreview}。` : "把核糖体放到 mRNA 附近，观察氨基酸小圆逐颗接出。",
    },
    {
      title: "小测自查",
      done: quizCorrectCount >= 3,
      body: quizCorrectCount >= 3 ? `已答对 ${quizCorrectCount}/${geneQuizItems.length} 题，可以复制记录。` : `当前答对 ${quizCorrectCount}/${geneQuizItems.length} 题；至少答对 3 题再复制记录。`,
    },
  ];
  const integratedMolecules = molecules.filter((molecule) => molecule.type !== "tf" && inBox(molecule, zones[moleculeZone(molecule.type)]));
  const nextTask = taskStatuses.find((item) => !item.done)?.label ?? "三个操作任务已经完成，可以继续调节分子数量、速度和暂停状态观察表达变化。";
  const currentStatus = (() => {
    if (!model.transcriptionOn) {
      if (activeRibosomeCount > 0) return "转录已经停止，核糖体正在读取保留的 mRNA，多肽链仍会按密码子继续延伸。";
      if (visibleProteinCount > 0) return "转录已经停止，已经形成的多肽链会保留；重新加入 TF 和 RNA 聚合酶可以继续表达。";
      if (canTranslate) return "转录已经停止，已有 mRNA 片段会保留；核糖体可以继续读取这些片段。";
      if (visibleMrnaCount > 0) return "转录已经停止，已有 mRNA 片段会保留；重新加入 TF 和 RNA 聚合酶可以继续产生新 mRNA。";
      return "转录尚未启动：启动子需要 TF，基因区域需要 RNA 聚合酶。";
    }

    if (visibleMrnaCount === 0) return "RNA 聚合酶正在沿基因区移动，新生 mRNA 的 3' 生长端正跟着聚合酶延伸。";
    if (!canTranslate) return "mRNA 的 5' 端已经露出：把核糖体放到 mRNA 附近，可以模拟原核式边转录边翻译。";
    if (activeRibosomeCount === 0 && visibleProteinCount === 0) return "核糖体已进入入口，正在等待 mRNA 读带进入 A/P 位点。";
    if (activeRibosomeCount === 0) return "多肽链片段已经从核糖体出口形成，下一批核糖体正在等待新的可读片段。";
    if (visibleProteinCount === 0) return `核糖体正在读取 ${activeCodon?.rna ?? "密码子"}，tRNA 对准 A/P 位点，第一颗氨基酸小圆即将从出口出现。`;
    return `原核式耦合表达正在发生：RNA 聚合酶延伸 mRNA，核糖体读取 ${activeCodon?.rna ?? "密码子"}，多肽链正按 ${activeCodon?.amino ?? "氨基酸"} 紧贴出口长出。`;
  })();
  const processFocusCards = [
    {
      title: "mRNA 生长端",
      active: model.transcriptionOn,
      body: model.transcriptionOn ? "3' 生长端贴着 RNA 聚合酶出口，RNA 聚合酶往前走时曲线继续变长；5' 自由端留在外侧。" : "转录未启动时不会产生新的 3' 生长端；先放入 TF 和 RNA 聚合酶。",
    },
    {
      title: "核糖体读带",
      active: activeRibosomeCount > 0,
      body: activeRibosomeCount > 0 ? `核糖体正在读 ${activeCodon?.rna ?? "已露出的密码子"}，它只沿已经转录出来的绿色虚线片段移动，不能越过 RNA 聚合酶。` : "mRNA 的 5' 自由端露出后，把核糖体放到入口，才会开始读密码子。",
    },
    {
      title: "多肽出口",
      active: visibleProteinCount > 0,
      body: visibleProteinCount > 0 ? `多肽链从核糖体右上出口长出，当前片段是 ${peptidePreview}。` : "没有看到氨基酸小圆时，说明核糖体还没读到足够的密码子或还没有加入核糖体。",
    },
    {
      title: "模型边界",
      active: true,
      body: "这个仿真显示原核式耦合表达：转录和翻译可以同时发生；真核细胞通常先在细胞核内转录加工，再到细胞质翻译。",
    },
  ];
  const activeProcessFocus = processFocusCards.find((item) => item.active)?.title ?? "等待启动";
  const accessibleSummary = `基因表达仿真。启动子上有 ${model.tfBound} 个转录因子，基因区有 ${model.polBound} 个 RNA 聚合酶，核糖体入口有 ${model.ribBound} 个核糖体。当前 mRNA 数量 ${visibleMrnaCount}，已接入氨基酸 ${visibleProteinCount}。当前过程焦点：${activeProcessFocus}。当前状态：${currentStatus} 下一步：${nextTask}`;
  const expressionExperimentFields = [
    {
      id: "gene-experiment-variable",
      label: "我改变的变量",
      value: experimentVariableDraft,
      setValue: setExperimentVariableDraft,
      placeholder: "例如：把核糖体从 1 个增加到 3 个，其他分子保持不变。",
    },
    {
      id: "gene-experiment-observation",
      label: "观察到的变化",
      value: experimentObservationDraft,
      setValue: setExperimentObservationDraft,
      placeholder: `例如：mRNA ${visibleMrnaCount}/${mrnaReadoutMax}，已接入氨基酸 ${visibleProteinCount}/${proteinReadoutMax}，多肽链更快变长。`,
    },
    {
      id: "gene-experiment-explanation",
      label: "我的解释",
      value: experimentExplanationDraft,
      setValue: setExperimentExplanationDraft,
      placeholder: "例如：mRNA 是模板，核糖体数量影响同一段 mRNA 被读取的效率。",
    },
    {
      id: "gene-experiment-next",
      label: "下一次要验证",
      value: experimentNextDraft,
      setValue: setExperimentNextDraft,
      placeholder: "例如：只移走 TF，看看已有 mRNA 是否还能继续被核糖体读取。",
    },
  ];
  const expressionExperimentScore = expressionExperimentFields.filter((field) => field.value.trim().length >= 8).length;
  const expressionExperimentRecord = `【基因表达变量实验记录】
当前读数：TF ${model.tfBound}，RNA 聚合酶 ${model.polBound}，核糖体 ${model.ribBound}
mRNA：${visibleMrnaCount}/${mrnaReadoutMax}
已接入氨基酸：${visibleProteinCount}/${proteinReadoutMax}
过程焦点：${activeProcessFocus}
多肽片段：${peptidePreview}

一、我改变的变量
${experimentVariableDraft.trim() || "待填写"}

二、观察到的变化
${experimentObservationDraft.trim() || "待填写"}

三、我的解释
${experimentExplanationDraft.trim() || "待填写"}

四、下一次要验证
${experimentNextDraft.trim() || "待填写"}

填写完成度：${expressionExperimentScore}/${expressionExperimentFields.length}`;
  const expressionProcessRecord = `【基因表达过程记录】
当前状态：${currentStatus}
下一步：${nextTask}

一、分子状态
启动子上的转录因子：${model.tfBound}
参与转录的 RNA 聚合酶：${model.polBound}
核糖体入口：${model.ribBound}
正在读取的核糖体：${activeRibosomeCount}

二、过程焦点
${processFocusCards.map((item, index) => `${index + 1}. ${item.title}：${item.active ? "正在发生" : "等待条件"}。${item.body}`).join("\n")}

三、翻译放大镜
当前密码子：${focusedCodon?.rna ?? "等待 mRNA 片段"}
tRNA 反密码子：${focusedCodon?.anticodon ?? "等待核糖体读取"}
氨基酸：${focusedCodon?.amino ?? "等待多肽延伸"}
出口处多肽片段：${peptidePreview}

四、读数
mRNA 数量：${visibleMrnaCount}/${mrnaReadoutMax}
已接入氨基酸：${visibleProteinCount}/${proteinReadoutMax}
转录速率：${model.transcriptionOn ? Math.min(100, 28 + model.tfBound * 18 + model.polBound * 16) : 0}%
翻译速率：${translationRate}%

五、操作任务
${taskStatuses.map((item, index) => `${index + 1}. ${item.done ? "已完成" : "待完成"}：${item.label}`).join("\n")}

六、完成验收
${expressionCompletionChecks.map((item, index) => `${index + 1}. ${item.done ? "通过" : "待完成"}：${item.title}。${item.body}`).join("\n")}

七、小测进度
已作答：${quizAnsweredCount}/${geneQuizItems.length}
答对：${quizCorrectCount}/${geneQuizItems.length}`;

  useEffect(() => {
    progressRef.current = cycleProgress;
  }, [cycleProgress]);

  useEffect(() => {
    setDisplayedMrnaCount((count) => Math.min(5, Math.max(count, instantMrnaCount)));
  }, [instantMrnaCount]);

  useEffect(() => {
    setDisplayedProteinCount((count) => Math.min(12, Math.max(count, instantProteinCount)));
  }, [instantProteinCount]);

  useEffect(() => {
    if (!model.transcriptionOn && !canTranslate) {
      progressRef.current = 0;
      setCycleProgress(0);
      setIsPaused(false);
      return;
    }
    if (prefersReducedMotion) {
      progressRef.current = canTranslate ? 0.72 : 0.46;
      setCycleProgress(progressRef.current);
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
  }, [model.transcriptionOn, canTranslate, prefersReducedMotion, isPaused, speed]);

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

  function clearRecordCopyState() {
    setCopiedProcessRecord(false);
    setProcessRecordStatus("");
    setCopiedExperimentRecord(false);
    setExperimentRecordStatus("");
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

  function restartReactionTimeline() {
    progressRef.current = 0;
    setCycleProgress(0);
    setIsPaused(false);
    setDisplayedMrnaCount(0);
    setDisplayedProteinCount(0);
    clearRecordCopyState();
  }

  function resetScene() {
    setMolecules(initialMolecules);
    setDragging(null);
    restartReactionTimeline();
  }

  function chooseQuizAnswer(option: string) {
    setQuizAnswers((answers) => ({ ...answers, [activeQuiz.id]: option }));
    clearRecordCopyState();
  }

  function nextQuiz() {
    setActiveQuizIndex((index) => (index + 1) % geneQuizItems.length);
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
    restartReactionTimeline();
  }

  function releaseMolecule(moleculeId: string) {
    setMolecules((items) =>
      items.map((molecule) =>
        molecule.id === moleculeId
          ? { ...molecule, x: molecule.homeX, y: molecule.homeY }
          : molecule
      )
    );
    clearRecordCopyState();
  }

  function toggleMoleculeDocking(molecule: Molecule) {
    if (isMoleculeDocked(molecule)) {
      releaseMolecule(molecule.id);
      return;
    }

    const zoneKey = moleculeZone(molecule.type);
    const slot = slots[zoneKey][moleculeSlotIndex(molecule)] ?? slots[zoneKey][0];
    setMolecules((items) =>
      items.map((item) =>
        item.id === molecule.id
          ? { ...item, x: slot.x, y: slot.y }
          : item
      )
    );
    clearRecordCopyState();
  }

  async function copyExpressionProcessRecord() {
    const copiedToClipboard = await copyText(expressionProcessRecord);
    if (copiedToClipboard) {
      setCopiedProcessRecord(true);
      setProcessRecordStatus("表达过程记录已复制到剪贴板。");
      window.setTimeout(() => setCopiedProcessRecord(false), 1400);
      return;
    }

    setCopiedProcessRecord(false);
    setProcessRecordStatus("复制失败，请手动选中文本复制。");
  }

  async function copyExpressionExperimentRecord() {
    const copiedToClipboard = await copyText(expressionExperimentRecord);
    if (copiedToClipboard) {
      setCopiedExperimentRecord(true);
      setExperimentRecordStatus("变量实验记录已复制到剪贴板。");
      window.setTimeout(() => setCopiedExperimentRecord(false), 1400);
      return;
    }

    setCopiedExperimentRecord(false);
    setExperimentRecordStatus("复制失败，请手动选中文本复制。");
  }

  function isMoleculeDocked(molecule: Molecule) {
    if (dragging?.id === molecule.id) return false;
    return inBox(molecule, zones[moleculeZone(molecule.type)]);
  }

  function isIntegratedIntoProcess(molecule: Molecule) {
    return molecule.type !== "tf" && isMoleculeDocked(molecule);
  }

  return (
    <section
      id="gene-expression"
      style={{
        fontFamily: "'Nunito', sans-serif",
        padding: "1rem 1.5rem 5rem",
        width: "100%",
        maxWidth: 1180,
        margin: "0 auto",
        overflowX: "hidden",
        scrollMarginTop: 76,
      }}
    >
      <div id="gene-expression-summary" className="gene-sr-only">
        {accessibleSummary}
      </div>
      <div className="gene-expression-main-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.45fr) minmax(286px, 0.7fr)", gap: "0.68rem", alignItems: "stretch", minWidth: 0 }}>
        <div className="gene-canvas-card" style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 12, boxShadow: "0 8px 18px rgba(94,68,42,0.05)", overflow: "hidden", minWidth: 0 }}>
          <svg
            className="gene-canvas-svg"
            ref={svgRef}
            viewBox="0 0 980 660"
            role="group"
            aria-label="基因表达互动仿真画布"
            aria-describedby="gene-expression-summary"
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
              <marker id="mrnaArrow" markerWidth={9} markerHeight={9} refX={7.5} refY={4.5} orient="auto" markerUnits="userSpaceOnUse">
                <path d="M0 0 L9 4.5 L0 9Z" fill="var(--cherry-red)" />
              </marker>
            </defs>

            <rect x={22} y={26} width={936} height={606} rx={220} fill="rgba(169,201,172,0.2)" stroke="rgba(93,140,101,0.34)" strokeWidth={3} strokeDasharray="9 9" />

            <text x={42} y={58} fill="var(--cherry-forest)" fontSize={18} fontWeight={900}>
              基因表达实验台
            </text>
            <g transform="translate(42 72)">
              <rect width={162} height={26} rx={999} fill="rgba(250,247,241,0.78)" stroke="rgba(94,68,42,0.14)" strokeWidth={1.4} />
              <text x={81} y={18} textAnchor="middle" fill="var(--cherry-warm-mid)" fontSize={11} fontWeight={900}>
                原核耦合表达模型
              </text>
            </g>
            <StageRail model={model} activeRibosomeCount={activeRibosomeCount} visibleProteinCount={visibleProteinCount} />

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
                启动子
              </text>
              {[90, 148, 206].map((x, index) => (
                <circle key={x} cx={x} cy={84} r={18} fill="none" stroke={model.tfBound > index ? "var(--cherry-forest)" : "rgba(94,68,42,0.18)"} strokeWidth={2} strokeDasharray="4 5" />
              ))}
              <rect x={226} y={42} width={320} height={78} rx={18} fill={model.polBound > 0 ? "rgba(141,190,221,0.26)" : "rgba(250,247,241,0.4)"} stroke="var(--cherry-blue)" strokeWidth={2} strokeDasharray="7 7" />
              <text x={344} y={88} fill="var(--cherry-warm-brown)" fontSize={14} fontWeight={900}>
                基因区
              </text>
              {[298, 432].map((x, index) =>
                model.polBound > index ? null : (
                  <g key={x} opacity={0.42}>
                    <circle cx={x} cy={44} r={15} fill="none" stroke="rgba(94,68,42,0.18)" strokeWidth={1.6} strokeDasharray="3 5" />
                    <line x1={x - 9} y1={44} x2={x + 9} y2={44} stroke="rgba(94,68,42,0.16)" strokeWidth={1.4} strokeLinecap="round" />
                    <line x1={x} y1={35} x2={x} y2={53} stroke="rgba(94,68,42,0.16)" strokeWidth={1.4} strokeLinecap="round" />
                  </g>
                )
              )}
            </g>

            <LiveExpressionProcess model={model} progress={cycleProgress} retainedMrnaCount={visibleMrnaCount} canTranslate={canTranslate} prefersReducedMotion={prefersReducedMotion} />

            <rect x={zones.ribosome.x} y={zones.ribosome.y} width={zones.ribosome.w} height={zones.ribosome.h} rx={22} fill={model.ribBound > 0 ? "rgba(232,121,95,0.15)" : "rgba(250,247,241,0.38)"} stroke="var(--cherry-peach)" strokeWidth={2} strokeDasharray="7 7" />
            <text x={zones.ribosome.x + 22} y={zones.ribosome.y + 34} fill="var(--cherry-warm-brown)" fontSize={15} fontWeight={900}>
              核糖体入口
            </text>
            {[406, 520, 634].map((x, index) =>
              model.ribBound > index ? null : (
                <g key={x} opacity={0.4}>
                  <circle cx={x} cy={404} r={17} fill="none" stroke="rgba(94,68,42,0.18)" strokeWidth={1.6} strokeDasharray="3 5" />
                  <line x1={x - 10} y1={404} x2={x + 10} y2={404} stroke="rgba(94,68,42,0.16)" strokeWidth={1.4} strokeLinecap="round" />
                  <line x1={x} y1={394} x2={x} y2={414} stroke="rgba(94,68,42,0.16)" strokeWidth={1.4} strokeLinecap="round" />
                </g>
              )
            )}

            <g transform="translate(46 86)">
              <rect width={190} height={28} rx={999} fill="rgba(250,247,241,0.74)" stroke="rgba(94,68,42,0.16)" />
              <text x={18} y={19} fill="var(--cherry-warm-mid)" fontSize={13} fontWeight={900}>
                分子库
              </text>
            </g>

            {molecules.filter((molecule) => !isIntegratedIntoProcess(molecule)).map((molecule) => (
              <MoleculeNode key={molecule.id} molecule={molecule} docked={isMoleculeDocked(molecule)} dragging={dragging?.id === molecule.id} onPointerDown={startDrag} onKeyToggle={toggleMoleculeDocking} />
            ))}
          </svg>
        </div>

        <aside className="gene-control-aside" style={{ display: "grid", gap: "0.68rem", alignContent: "start", minWidth: 0 }}>
          <div className="gene-readout-panel" style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 12, padding: "0.78rem", boxShadow: "0 8px 18px rgba(94,68,42,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.58rem" }}>
              <IconMicroscope size={19} />
              仿真读数
            </div>
            <div className="gene-readout-list" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 6 }}>
              {[
                ["启动子上的转录因子", model.tfBound],
                ["参与转录的 RNA 聚合酶", model.polBound],
                ["正在读取的核糖体", `${activeRibosomeCount}/${model.ribBound}`],
                ["当前密码子", activeCodon ? `${activeCodon.rna} → ${activeCodon.amino}` : "等待读取"],
                ["mRNA 数量", `${visibleMrnaCount}/${mrnaReadoutMax}`],
                ["已接入氨基酸", `${visibleProteinCount}/${proteinReadoutMax}`],
              ].map(([label, value]) => (
                <div className="gene-readout-row" key={label} style={{ display: "grid", gap: 3, background: "rgba(250,247,241,0.72)", border: "1px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.42rem", color: "var(--cherry-warm-mid)", fontWeight: 800, minWidth: 0 }}>
                  <span style={{ minWidth: 0, lineHeight: 1.18, fontSize: "0.66rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
                  <span className="gene-readout-value" style={{ color: "var(--cherry-red)", fontWeight: 900, fontSize: "0.78rem", lineHeight: 1.16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>
                </div>
              ))}
            </div>
            <div className="gene-rate-list" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 7, marginTop: "0.62rem" }}>
              {[
                ["转录速率", `${model.transcriptionOn ? Math.min(100, 28 + model.tfBound * 18 + model.polBound * 16) : 0}%`],
                ["翻译速率", `${translationRate}%`],
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
            <div className="gene-action-row" style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: "0.72rem" }}>
              <button type="button" onClick={runExpressionPreset} aria-label="放入所有分子并从头运行表达过程" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.58rem 0.95rem", fontWeight: 900, cursor: "pointer" }}>
                运行表达
              </button>
              <button type="button" onClick={() => setIsPaused((value) => !value)} aria-label={canPauseReaction ? (isPaused ? "继续基因表达动画" : "暂停基因表达动画") : prefersReducedMotion ? "系统已减少动态效果，动画保持静态" : "反应尚未开始，暂时不能暂停"} aria-pressed={isPaused} disabled={!canPauseReaction} style={{ background: canPauseReaction ? "var(--cherry-blue)" : "var(--muted)", color: canPauseReaction ? "#FAF7F1" : "var(--cherry-warm-mid)", border: "none", borderRadius: 999, padding: "0.58rem 0.95rem", fontWeight: 900, cursor: canPauseReaction ? "pointer" : "default" }}>
                {isPaused ? "继续" : "暂停"}
              </button>
              <button type="button" onClick={resetScene} aria-label="清空画布并重置基因表达仿真" style={{ background: "var(--muted)", color: "var(--cherry-warm-brown)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.58rem 0.95rem", fontWeight: 900, cursor: "pointer" }}>
                重置
              </button>
            </div>
            <div className="gene-speed-row" style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: "0.5rem" }}>
              {([0.5, 1, 1.5] as const).map((value) => (
                <button key={value} type="button" onClick={() => setSpeed(value)} aria-label={`将动画速度设为 ${value} 倍`} aria-pressed={speed === value} style={{ background: speed === value ? "var(--cherry-yellow)" : "rgba(250,247,241,0.82)", color: "var(--cherry-warm-brown)", border: "1.5px solid rgba(94,68,42,0.14)", borderRadius: 999, padding: "0.32rem 0.68rem", fontWeight: 900, cursor: "pointer", fontSize: "0.75rem" }}>
                  {value}x
                </button>
              ))}
            </div>
            {integratedMolecules.length > 0 ? (
              <div className="gene-integrated-strip" style={{ marginTop: "0.62rem", display: "grid", gap: 6 }}>
                <div style={{ color: "var(--cherry-warm-brown)", fontSize: "0.78rem", fontWeight: 900 }}>已加入反应</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {integratedMolecules.map((molecule) => (
                    <button key={molecule.id} type="button" onClick={() => releaseMolecule(molecule.id)} aria-label={`移回${moleculeNames[molecule.type]}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: molecule.type === "pol" ? "rgba(141,190,221,0.22)" : "rgba(232,121,95,0.18)", color: "var(--cherry-warm-brown)", border: "1.5px solid rgba(94,68,42,0.14)", borderRadius: 999, padding: "0.34rem 0.68rem", fontWeight: 900, cursor: "pointer", fontSize: "0.76rem" }}>
                      <span>{moleculeNames[molecule.type]}</span>
                      <span aria-hidden="true" style={{ color: "var(--cherry-red)" }}>移回</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <details className="gene-support-pack-details gene-compact-details" style={{ background: "transparent", border: "none", borderRadius: 0, padding: "0.2rem 0", boxShadow: "none" }}>
            <summary style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, cursor: "pointer" }}>练习与记录</summary>

          <details className="gene-compact-details gene-process-focus-details" style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 12, padding: "0.72rem", boxShadow: "0 8px 18px rgba(94,68,42,0.04)" }}>
            <summary style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, cursor: "pointer" }}>过程追踪 · {activeProcessFocus}</summary>
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900 }}>
              <IconSparkle size={18} />
              过程追踪
            </div>
            <div style={{ display: "grid", gap: "0.58rem" }}>
              {processFocusCards.map((item, index) => (
                <div key={item.title} style={{ display: "grid", gridTemplateColumns: "28px minmax(0, 1fr)", gap: "0.58rem", alignItems: "start", background: item.active ? (index === 0 ? "var(--cherry-blue-light)" : index === 1 ? "var(--cherry-yellow-light)" : "var(--cherry-sage-light)") : "var(--muted)", border: item.active ? "1.5px solid rgba(94,68,42,0.18)" : "1.5px solid rgba(94,68,42,0.08)", borderRadius: 16, padding: "0.72rem" }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: item.active ? "var(--cherry-forest)" : "rgba(250,247,241,0.8)", border: "1.5px solid rgba(94,68,42,0.14)", color: item.active ? "#FAF7F1" : "var(--cherry-warm-mid)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 900 }}>
                    {index + 1}
                  </span>
                  <span>
                    <strong style={{ display: "block", color: item.active ? "var(--cherry-warm-brown)" : "var(--cherry-warm-mid)", fontSize: "0.8rem", marginBottom: "0.28rem" }}>{item.title}</strong>
                    <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.58, fontWeight: 800 }}>{item.body}</span>
                  </span>
                </div>
              ))}
            </div>
          </details>

          <details className="gene-compact-details gene-result-check-details" style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 12, padding: "0.72rem", boxShadow: "0 8px 18px rgba(94,68,42,0.04)" }}>
            <summary style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, cursor: "pointer" }}>结果检查 · {expressionCompletionChecks.filter((item) => item.done).length}/{expressionCompletionChecks.length}</summary>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: "0.85rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900 }}>
                <IconCheck size={18} />
                结果检查
              </div>
              <span style={{ background: quizCorrectCount >= 3 ? "var(--cherry-sage-light)" : "var(--card)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 999, padding: "0.22rem 0.58rem", color: quizCorrectCount >= 3 ? "var(--cherry-forest)" : "var(--cherry-red)", fontSize: "0.72rem", fontWeight: 900 }}>
                {expressionCompletionChecks.filter((item) => item.done).length}/{expressionCompletionChecks.length}
              </span>
            </div>
            <div style={{ display: "grid", gap: "0.58rem" }}>
              {expressionCompletionChecks.map((item, index) => (
                <div key={item.title} style={{ display: "grid", gridTemplateColumns: "28px minmax(0, 1fr)", gap: "0.58rem", alignItems: "start", background: item.done ? "rgba(169,201,172,0.2)" : "rgba(250,247,241,0.72)", border: item.done ? "1.5px solid rgba(93,140,101,0.24)" : "1.5px solid rgba(94,68,42,0.1)", borderRadius: 16, padding: "0.72rem" }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: item.done ? "var(--cherry-forest)" : "var(--cherry-red)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 900 }}>
                    {item.done ? "✓" : index + 1}
                  </span>
                  <span>
                    <strong style={{ display: "block", color: "var(--cherry-warm-brown)", fontSize: "0.8rem", marginBottom: "0.28rem" }}>{item.title}</strong>
                    <span style={{ display: "block", color: "var(--cherry-warm-mid)", fontSize: "0.76rem", lineHeight: 1.58, fontWeight: 800 }}>{item.body}</span>
                  </span>
                </div>
              ))}
            </div>
          </details>

          <details className="gene-compact-details gene-experiment-record-details" style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 12, padding: "0.72rem", boxShadow: "0 8px 18px rgba(94,68,42,0.04)" }}>
            <summary style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, cursor: "pointer" }}>变量实验记录 · {expressionExperimentScore}/{expressionExperimentFields.length}</summary>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900 }}>
                <IconMicroscope size={18} />
                变量实验记录
              </div>
              <span style={{ background: expressionExperimentScore === expressionExperimentFields.length ? "var(--cherry-sage-light)" : "var(--cherry-yellow-light)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 999, padding: "0.22rem 0.58rem", color: expressionExperimentScore === expressionExperimentFields.length ? "var(--cherry-forest)" : "var(--cherry-warm-mid)", fontSize: "0.72rem", fontWeight: 900 }}>
                填写完成度 {expressionExperimentScore}/{expressionExperimentFields.length}
              </span>
            </div>
            <div style={{ background: "rgba(169,201,172,0.16)", border: "1.5px solid rgba(93,140,101,0.18)", borderRadius: 16, padding: "0.72rem 0.8rem", color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.58, fontWeight: 800 }}>
              调节分子数量后，先写下改变了什么，再记录 mRNA、氨基酸和多肽链变化。
            </div>
            <div className="gene-experiment-record-grid" style={{ display: "grid", gap: "0.68rem" }}>
              {expressionExperimentFields.map((field) => (
                <label key={field.id} htmlFor={field.id} style={{ display: "grid", gap: "0.36rem" }}>
                  <span style={{ color: "var(--cherry-warm-brown)", fontSize: "0.78rem", fontWeight: 900 }}>{field.label}</span>
                  <textarea
                    id={field.id}
                    value={field.value}
                    placeholder={field.placeholder}
                    rows={3}
                    onChange={(event) => {
                      field.setValue(event.currentTarget.value);
                      setCopiedExperimentRecord(false);
                      setExperimentRecordStatus("");
                    }}
                    style={{ width: "100%", resize: "vertical", minHeight: 76, background: "rgba(250,247,241,0.82)", border: "1.5px solid rgba(94,68,42,0.14)", borderRadius: 16, padding: "0.68rem 0.72rem", color: "var(--cherry-warm-brown)", fontFamily: "inherit", fontWeight: 800, lineHeight: 1.55, outlineColor: "var(--cherry-forest)" }}
                  />
                </label>
              ))}
            </div>
            <button type="button" onClick={copyExpressionExperimentRecord} aria-describedby="gene-experiment-record-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.52rem 0.88rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
              {copiedExperimentRecord ? "已复制" : "复制实验记录"}
            </button>
            <div id="gene-experiment-record-status" role="status" aria-live="polite" style={{ minHeight: "1.05rem", color: "var(--cherry-forest)", fontSize: "0.76rem", fontWeight: 900 }}>
              {experimentRecordStatus}
            </div>
          </details>

          <details className="gene-compact-details gene-process-record-details" style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 12, padding: "0.72rem", boxShadow: "0 8px 18px rgba(94,68,42,0.04)" }}>
            <summary style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, cursor: "pointer" }}>表达过程记录</summary>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900 }}>
                <IconDNA size={18} />
                表达过程记录
              </div>
              <button type="button" onClick={copyExpressionProcessRecord} aria-describedby="gene-process-record-status" style={{ background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.42rem 0.78rem", fontWeight: 900, cursor: "pointer", fontSize: "0.78rem" }}>
                {copiedProcessRecord ? "已复制" : "复制记录"}
              </button>
            </div>
            <div id="gene-process-record-status" role="status" aria-live="polite" style={{ minHeight: "1.05rem", color: "var(--cherry-forest)", fontSize: "0.76rem", fontWeight: 900 }}>
              {processRecordStatus}
            </div>
            <div style={{ background: "var(--cherry-sage-light)", border: "1.5px solid rgba(93,140,101,0.2)", borderRadius: 16, padding: "0.72rem", color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.58, fontWeight: 800 }}>
              <strong style={{ color: "var(--cherry-warm-brown)" }}>当前焦点：</strong>{activeProcessFocus}
              <div style={{ marginTop: "0.34rem" }}>{currentStatus}</div>
            </div>
            <code style={{ display: "block", whiteSpace: "pre-wrap", background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 16, padding: "0.72rem", color: "var(--cherry-warm-brown)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.68rem", lineHeight: 1.55, maxHeight: 220, overflow: "auto" }}>
              {expressionProcessRecord}
            </code>
          </details>

          <details className="gene-compact-details gene-translation-lens-details" style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 12, padding: "0.72rem", boxShadow: "0 8px 18px rgba(94,68,42,0.04)" }}>
            <summary style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, cursor: "pointer" }}>翻译放大镜 · {focusedCodon?.rna ?? "---"} → {focusedCodon?.amino ?? "---"}</summary>
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900 }}>
              <IconSparkle size={18} />
              翻译放大镜
            </div>
            <div className="translation-lens-grid" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", alignItems: "stretch", gap: 7 }}>
              {[
                ["mRNA", focusedCodon?.rna ?? "---"],
                ["tRNA", focusedCodon?.anticodon ?? "---"],
                ["氨基酸", focusedCodon?.amino ?? "---"],
              ].map(([label, value], index) => (
                <span key={label} style={{ display: "contents" }}>
                  <div style={{ background: index === 2 ? "var(--cherry-yellow-light)" : "rgba(250,247,241,0.78)", border: "1.5px solid rgba(94,68,42,0.12)", borderRadius: 16, padding: "0.65rem 0.45rem", textAlign: "center", minWidth: 0 }}>
                    <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.66rem", fontWeight: 900, marginBottom: "0.28rem" }}>{label}</div>
                    <strong style={{ display: "block", color: index === 2 ? "var(--cherry-red)" : "var(--cherry-warm-brown)", fontSize: "0.86rem", lineHeight: 1.2 }}>{value}</strong>
                  </div>
                  {index < 2 ? (
                    <div className="translation-lens-arrow" aria-hidden="true" style={{ display: "grid", placeItems: "center", color: "var(--cherry-forest)", fontWeight: 900 }}>
                      →
                    </div>
                  ) : null}
                </span>
              ))}
            </div>
            <div style={{ marginTop: "0.8rem", background: "rgba(169,201,172,0.18)", border: "1.5px solid rgba(93,140,101,0.18)", borderRadius: 16, padding: "0.72rem 0.8rem" }}>
              <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.7rem", fontWeight: 900, marginBottom: "0.32rem" }}>出口处多肽片段</div>
              <strong style={{ color: "var(--cherry-forest)", fontSize: "0.9rem", lineHeight: 1.35 }}>{peptidePreview}</strong>
            </div>
          </details>

          <details className="gene-compact-details gene-quiz-details" style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 12, padding: "0.72rem", boxShadow: "0 8px 18px rgba(94,68,42,0.04)" }}>
            <summary style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, cursor: "pointer" }}>即时小测 · {quizCorrectCount}/{geneQuizItems.length}</summary>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: "0.58rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900 }}>
                <IconCheck size={18} />
                第 {activeQuizIndex + 1} 题
              </div>
              <div style={{ color: "var(--cherry-red)", fontWeight: 900, fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                {quizCorrectCount}/{geneQuizItems.length}
              </div>
            </div>
            <div role="group" style={{ display: "flex", gap: 5, marginBottom: "0.62rem" }} aria-label={`已完成 ${quizAnsweredCount} 道小测`}>
              {geneQuizItems.map((item, index) => {
                const answered = Boolean(quizAnswers[item.id]);
                const correct = quizAnswers[item.id] === item.answer;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`第 ${index + 1} 题${answered ? (correct ? "，已答对" : "，已作答") : "，未作答"}`}
                    aria-pressed={activeQuizIndex === index}
                    onClick={() => setActiveQuizIndex(index)}
                    style={{
                      width: 24,
                      height: 10,
                      borderRadius: 999,
                      border: "none",
                      background: activeQuizIndex === index ? "var(--cherry-red)" : answered ? (correct ? "var(--cherry-forest)" : "var(--cherry-yellow)") : "var(--muted)",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  />
                );
              })}
            </div>
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, lineHeight: 1.45, fontSize: "0.88rem", marginBottom: "0.62rem" }}>
              {activeQuiz.question}
            </div>
            <div style={{ display: "grid", gap: 7 }}>
              {activeQuiz.options.map((option) => {
                const selected = activeQuizAnswer === option;
                const correct = option === activeQuiz.answer;
                const answered = Boolean(activeQuizAnswer);
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => chooseQuizAnswer(option)}
                    style={{
                      textAlign: "left",
                      background: selected ? (correct ? "var(--cherry-sage-light)" : "var(--cherry-peach-light)") : "var(--muted)",
                      border: selected ? `1.5px solid ${correct ? "var(--cherry-forest)" : "var(--cherry-red)"}` : answered && correct ? "1.5px solid var(--cherry-forest)" : "1.5px solid var(--border)",
                      borderRadius: 10,
                      padding: "0.48rem 0.62rem",
                      color: "var(--cherry-warm-brown)",
                      fontWeight: 900,
                      cursor: "pointer",
                      lineHeight: 1.35,
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {activeQuizAnswer ? (
              <div role="status" aria-live="polite" style={{ marginTop: "0.62rem", background: activeQuizAnswer === activeQuiz.answer ? "rgba(169,201,172,0.2)" : "var(--cherry-yellow-light)", border: `1.5px solid ${activeQuizAnswer === activeQuiz.answer ? "rgba(93,140,101,0.22)" : "var(--cherry-yellow)"}`, borderRadius: 12, padding: "0.58rem 0.66rem", color: "var(--cherry-warm-mid)", fontSize: "0.8rem", lineHeight: 1.55, fontWeight: 800 }}>
                <strong style={{ color: "var(--cherry-warm-brown)" }}>{activeQuizAnswer === activeQuiz.answer ? "答对了：" : "再看一遍："}</strong>{activeQuiz.explain}
              </div>
            ) : null}
            <button type="button" onClick={nextQuiz} style={{ marginTop: "0.62rem", width: "100%", background: "var(--cherry-forest)", color: "#FAF7F1", border: "none", borderRadius: 999, padding: "0.5rem 0.8rem", fontWeight: 900, cursor: "pointer" }}>
              下一题
            </button>
          </details>

          <details className="gene-compact-details gene-sequence-details" style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 12, padding: "0.72rem", boxShadow: "0 8px 18px rgba(94,68,42,0.04)" }}>
            <summary style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, cursor: "pointer" }}>序列读取</summary>
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.85rem" }}>
              <IconDNA size={18} />
              序列读取
            </div>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {codons.map((codon, index) => {
                const active = activeCodonIndex === index;
                const transcribed = retainedTranscriptProgress > 0.22 + index * 0.13;
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
          </details>

          <details className="gene-compact-details gene-task-details" style={{ background: "var(--cherry-yellow-light)", border: "1.5px solid var(--cherry-yellow)", borderRadius: 12, padding: "0.82rem", color: "var(--cherry-warm-mid)", lineHeight: 1.7 }}>
            <summary style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, cursor: "pointer" }}>操作任务 · {taskStatuses.filter((item) => item.done).length}/{taskStatuses.length}</summary>
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.65rem" }}>
              <IconSparkle size={18} />
              操作任务
            </div>
            <ol style={{ display: "grid", gap: "0.55rem", fontSize: "0.86rem", listStyle: "none", margin: 0, padding: 0 }}>
              {taskStatuses.map((item, index) => (
                <li key={item.label} style={{ display: "flex", gap: 8, alignItems: "flex-start", opacity: item.done ? 1 : 0.72 }}>
                  <span style={{ width: 18, height: 18, borderRadius: "50%", background: item.done ? "var(--cherry-forest)" : "rgba(250,247,241,0.7)", border: "1.5px solid rgba(94,68,42,0.16)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    {item.done ? <IconCheck size={12} color="#FAF7F1" /> : <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.68rem", fontWeight: 900 }}>{index + 1}</span>}
                  </span>
                  <span style={{ color: item.done ? "var(--cherry-warm-brown)" : "var(--cherry-warm-mid)", fontWeight: item.done ? 900 : 700 }}>{item.label}</span>
                </li>
              ))}
            </ol>
          </details>

          <details className="gene-compact-details gene-status-details" style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 12, padding: "0.82rem", color: "var(--cherry-warm-mid)", lineHeight: 1.7 }}>
            <summary style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, cursor: "pointer" }}>当前状态</summary>
          <div role="status" aria-live="polite">
            <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.65rem" }}>当前状态</div>
            <div style={{ fontSize: "0.88rem" }}>
              {currentStatus}
            </div>
          </div>
          </details>
          </details>
        </aside>
      </div>

      <style>
        {`
          #gene-expression .gene-sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }

          @media (max-width: 920px) {
            #gene-expression .gene-expression-main-grid {
              grid-template-columns: 1fr !important;
            }
          }

          #gene-expression details > summary {
            list-style-position: outside;
          }

          #gene-expression details[open] > summary {
            margin-bottom: 0.72rem;
          }

          #gene-expression .gene-compact-details[open] {
            display: grid;
            gap: 0.7rem;
          }

          @media (max-width: 520px) {
            #gene-expression {
              padding-left: 1rem !important;
              padding-right: 1rem !important;
            }

            #gene-expression .gene-control-aside {
              gap: 0.52rem !important;
            }

            #gene-expression .gene-readout-panel {
              padding: 0.68rem !important;
              border-radius: 12px !important;
              box-shadow: none !important;
            }

            #gene-expression .gene-readout-panel > div:first-child {
              margin-bottom: 0.48rem !important;
              font-size: 0.82rem !important;
            }

            #gene-expression .gene-readout-list {
              gap: 0.3rem !important;
            }

            #gene-expression .translation-lens-grid {
              grid-template-columns: 1fr !important;
            }

            #gene-expression .translation-lens-arrow {
              min-height: 16px;
              transform: rotate(90deg);
            }

            #gene-expression .gene-canvas-card {
              overflow: hidden !important;
              border-radius: 18px !important;
            }

            #gene-expression .gene-canvas-svg {
              width: 100% !important;
              max-width: 100% !important;
              min-width: 0 !important;
            }

            #gene-expression .gene-readout-row {
              grid-template-columns: minmax(0, 1fr) auto !important;
              gap: 0.44rem !important;
              font-size: 0.72rem !important;
              line-height: 1.25 !important;
              min-height: 0 !important;
            }

            #gene-expression .gene-readout-value {
              text-align: right !important;
              white-space: nowrap !important;
              overflow-wrap: anywhere;
            }

            #gene-expression .gene-rate-list {
              gap: 0.42rem !important;
              margin-top: 0.6rem !important;
            }

            #gene-expression .gene-rate-list > div > div:first-child {
              font-size: 0.68rem !important;
              margin-bottom: 3px !important;
            }

            #gene-expression .gene-rate-list > div > div:last-child {
              height: 6px !important;
            }

            #gene-expression .gene-action-row {
              display: grid !important;
              grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
              gap: 0.42rem !important;
              margin-top: 0.62rem !important;
            }

            #gene-expression .gene-action-row button,
            #gene-expression .gene-speed-row button {
              padding: 0.42rem 0.34rem !important;
              min-height: 0 !important;
              font-size: 0.72rem !important;
              border-radius: 999px !important;
            }

            #gene-expression .gene-speed-row {
              margin-top: 0.46rem !important;
              gap: 0.36rem !important;
            }

            #gene-expression .gene-integrated-strip {
              margin-top: 0.54rem !important;
              gap: 0.34rem !important;
            }

            #gene-expression .gene-integrated-strip > div:first-child {
              display: none !important;
            }

            #gene-expression .gene-integrated-strip button {
              padding: 0.26rem 0.5rem !important;
              font-size: 0.68rem !important;
            }

            #gene-expression .gene-compact-details {
              padding: 0.68rem !important;
              border-radius: 12px !important;
              box-shadow: none !important;
            }

            #gene-expression .gene-experiment-record-grid textarea {
              min-height: 58px !important;
              font-size: 0.72rem !important;
              line-height: 1.38 !important;
              padding: 0.48rem !important;
              border-radius: 10px !important;
            }
          }

          #gene-expression svg [role="button"]:focus-visible ellipse {
            stroke: var(--cherry-red);
            stroke-width: 4;
          }

          #gene-expression svg [role="button"]:focus-visible text {
            fill: var(--cherry-red);
          }

          #gene-expression button:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }
        `}
      </style>
    </section>
  );
}
