export function WorkPreviewIllustration({ slug, color, width = 96, height = 72 }: { slug: string; color: string; width?: number; height?: number }) {
  if (slug === "gene-expression") {
    return (
      <svg width={width} height={height} viewBox="0 0 96 72" fill="none" aria-hidden="true">
        <path d="M10 18 C25 4 39 34 54 18 C69 2 79 26 88 14" stroke="var(--cherry-blue)" strokeWidth="5" strokeLinecap="round" opacity="0.78" />
        <path d="M10 36 C25 50 39 20 54 36 C69 52 79 28 88 40" stroke="var(--cherry-red)" strokeWidth="5" strokeLinecap="round" opacity="0.76" />
        <path d="M18 54 C34 46 50 50 66 42" stroke="var(--cherry-red)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="5 5" />
        {[18, 33, 48, 63].map((x, index) => (
          <circle key={x} cx={x} cy={61} r="6" fill={["var(--cherry-peach)", "var(--cherry-yellow)", "var(--cherry-sage)", "var(--cherry-blue)"][index]} stroke="rgba(94,68,42,0.16)" strokeWidth="1.4" />
        ))}
      </svg>
    );
  }

  if (slug === "plant-evolution-stories") {
    return (
      <svg width={width} height={height} viewBox="0 0 96 72" fill="none" aria-hidden="true">
        <path d="M12 58 C24 44 34 52 46 36 C58 20 72 25 86 12" stroke="var(--cherry-forest)" strokeWidth="4" strokeLinecap="round" opacity="0.62" />
        {[18, 36, 54, 72].map((x, index) => (
          <path key={x} d={`M${x} ${56 - index * 10} Q${x + 2} ${38 - index * 8} ${x + 22} ${30 - index * 8} Q${x + 20} ${50 - index * 8} ${x} ${56 - index * 10}Z`} fill="var(--cherry-sage)" opacity={0.42 + index * 0.12} />
        ))}
      </svg>
    );
  }

  if (slug === "crispr-interactive") {
    return (
      <svg width={width} height={height} viewBox="0 0 96 72" fill="none" aria-hidden="true">
        <path d="M12 28 H86" stroke="var(--cherry-blue)" strokeWidth="5" strokeLinecap="round" />
        <path d="M12 42 H86" stroke="var(--cherry-red)" strokeWidth="5" strokeLinecap="round" opacity="0.78" />
        <path d="M50 19 L42 54 M58 19 L50 54" stroke="var(--cherry-warm-brown)" strokeWidth="3" strokeLinecap="round" />
        <path d="M62 13 C76 10 85 18 82 30 C78 42 58 40 54 28 C51 20 55 15 62 13Z" fill="var(--cherry-peach-light)" stroke="var(--cherry-red)" strokeWidth="2.5" />
      </svg>
    );
  }

  if (slug === "research-prompt-kit" || slug === "concept-explainer") {
    return (
      <svg width={width} height={height} viewBox="0 0 96 72" fill="none" aria-hidden="true">
        <rect x="16" y="12" width="50" height="46" rx="10" fill="rgba(250,247,241,0.82)" stroke={color} strokeWidth="2.5" />
        <path d="M28 27 H54 M28 37 H58 M28 47 H46" stroke="var(--cherry-warm-mid)" strokeWidth="3" strokeLinecap="round" opacity="0.54" />
        <path d="M64 20 Q76 22 82 34 Q74 38 62 34 Q58 26 64 20Z" fill="var(--cherry-yellow)" opacity="0.72" />
        <path d="M74 12 L78 20 L86 22 L78 26 L74 34 L70 26 L62 22 L70 20Z" fill="var(--cherry-peach)" opacity="0.88" />
      </svg>
    );
  }

  return (
    <svg width={width} height={height} viewBox="0 0 96 72" fill="none" aria-hidden="true">
      <path d="M14 62 Q24 28 78 10 Q80 46 14 62Z" fill={color} opacity="0.42" />
      <path d="M24 54 Q46 38 72 18" stroke="var(--cherry-warm-brown)" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}
