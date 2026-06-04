export function WorkPreviewIllustration({ slug, color, width = 96, height = 72 }: { slug: string; color: string; width?: number; height?: number }) {
  if (slug === "gene-expression") {
    return (
      <svg width={width} height={height} viewBox="0 0 96 72" fill="none" aria-hidden="true">
        <rect x="5" y="9" width="86" height="54" rx="22" fill="rgba(250,247,241,0.7)" stroke="rgba(94,68,42,0.12)" strokeWidth="1.2" />
        <path d="M12 24 C25 12 37 34 50 24 C63 12 76 32 88 20" stroke="var(--cherry-blue)" strokeWidth="4.8" strokeLinecap="round" opacity="0.8" />
        <path d="M12 35 C25 47 37 25 50 35 C63 47 76 27 88 39" stroke="var(--cherry-red)" strokeWidth="4.8" strokeLinecap="round" opacity="0.76" />
        <ellipse cx="51" cy="25" rx="12" ry="9" fill="var(--cherry-blue-light)" stroke="var(--cherry-blue)" strokeWidth="2" />
        <text x="51" y="28" textAnchor="middle" fontSize="5.2" fontWeight="900" fill="var(--cherry-warm-brown)">pol</text>
        <path d="M51 34 C43 42 35 42 27 48" stroke="var(--cherry-red)" strokeWidth="3.2" strokeLinecap="round" strokeDasharray="5 4" />
        <ellipse cx="34" cy="48" rx="15" ry="10" fill="var(--cherry-peach-light)" stroke="var(--cherry-peach)" strokeWidth="2" />
        <path d="M24 49 C31 45 38 53 45 49" stroke="var(--cherry-red)" strokeWidth="2.4" strokeLinecap="round" />
        {[50, 59, 68, 77].map((x, index) => (
          <circle key={x} cx={x} cy={52 + (index % 2) * 5} r="5.2" fill={["var(--cherry-peach)", "var(--cherry-yellow)", "var(--cherry-sage)", "var(--cherry-blue)"][index]} stroke="rgba(94,68,42,0.16)" strokeWidth="1.2" />
        ))}
        <path d="M45 50 C52 53 58 58 66 55 C72 53 76 57 81 57" stroke="var(--cherry-forest)" strokeWidth="2.4" strokeLinecap="round" opacity="0.55" />
      </svg>
    );
  }

  if (slug === "plant-evolution-stories") {
    const stages = [
      { x: 48, y: 150, branch: -30, fill: "var(--cherry-blue-light)", accent: "var(--cherry-sage)" },
      { x: 54, y: 124, branch: 31, fill: "var(--cherry-yellow-light)", accent: "var(--cherry-yellow)" },
      { x: 46, y: 98, branch: -33, fill: "var(--cherry-sage-light)", accent: "var(--cherry-forest)" },
      { x: 57, y: 72, branch: 34, fill: "var(--cherry-sage-light)", accent: "var(--cherry-sage)" },
      { x: 47, y: 45, branch: -32, fill: "var(--cherry-yellow)", accent: "var(--cherry-warm-brown)" },
      { x: 57, y: 20, branch: 29, fill: "var(--cherry-peach-light)", accent: "var(--cherry-red)" },
    ];

    return (
      <svg width={width} height={height} viewBox="0 0 108 172" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="plant-card-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFF8EA" />
            <stop offset="0.55" stopColor="#EEF6E9" />
            <stop offset="1" stopColor="#DDECCF" />
          </linearGradient>
          <clipPath id="plant-card-clip">
            <rect x="8" y="5" width="92" height="162" rx="30" />
          </clipPath>
        </defs>
        <rect x="8" y="5" width="92" height="162" rx="30" fill="url(#plant-card-sky)" stroke="rgba(93,140,101,0.26)" strokeWidth="1.6" />
        <g clipPath="url(#plant-card-clip)">
          <circle cx="76" cy="22" r="12" fill="var(--cherry-yellow)" opacity="0.7" />
          <path d="M5 126 C25 111 41 128 59 113 C73 102 88 106 103 94 V168 H5Z" fill="rgba(169,201,172,0.3)" />
          <path d="M4 139 C18 146 34 136 50 143 C65 150 80 137 103 144 V168 H4Z" fill="rgba(132,184,204,0.2)" />
          <path d="M15 154 C31 159 73 159 91 151" stroke="rgba(58,92,62,0.18)" strokeWidth="3" strokeLinecap="round" />
          <path d="M49 150 C20 126 74 112 50 92 C24 70 77 57 52 35 C40 25 44 18 57 12" stroke="var(--cherry-forest)" strokeWidth="8.2" strokeLinecap="round" opacity="0.11" />
          <path d="M49 150 C20 126 74 112 50 92 C24 70 77 57 52 35 C40 25 44 18 57 12" stroke="var(--cherry-sage)" strokeWidth="3.8" strokeLinecap="round" />
        </g>
        {stages.map((stage, index) => {
          const side = stage.branch;
          return (
            <g key={stage.y} transform={`translate(${stage.x} ${stage.y})`}>
              <path d={`M0 0 C${side * 0.25} -7 ${side * 0.62} -8 ${side} -16`} stroke="var(--cherry-forest)" strokeWidth="2.1" strokeLinecap="round" opacity="0.72" />
              <g transform={`translate(${side} -16)`}>
                {index === 0 ? (
                  <g>
                    <path d="M-15 9 C-9 1 -1 3 3 9 C9 1 17 3 20 10" stroke="var(--cherry-sage)" strokeWidth="2.4" strokeLinecap="round" />
                    <circle cx="-9" cy="5" r="4.3" fill="var(--cherry-blue-light)" stroke="var(--cherry-sage)" strokeWidth="1.1" />
                    <circle cx="7" cy="6" r="5" fill="var(--cherry-sage-light)" stroke="var(--cherry-sage)" strokeWidth="1.1" />
                    <circle cx="18" cy="7" r="3.3" fill="rgba(132,184,204,0.58)" stroke="var(--cherry-sage)" strokeWidth="1" />
                  </g>
                ) : null}
                {index === 1 ? (
                  <g>
                    {[[-11, 1], [-4, -7], [7, -4], [14, 4], [0, 9], [19, -5]].map(([cx, cy]) => (
                      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" fill="var(--cherry-yellow)" stroke="rgba(94,68,42,0.18)" strokeWidth="1" />
                    ))}
                  </g>
                ) : null}
                {index === 2 ? <path d="M-2 16 C-2 5 -1 -6 4 -16 M4 -8 C11 -14 18 -11 21 -3 M-10 16 C-1 12 9 12 18 16" stroke="var(--cherry-forest)" strokeWidth="2.8" strokeLinecap="round" fill="none" /> : null}
                {index === 3 ? <path d="M0 17 C0 1 3 -13 10 -21 M4 -5 C16 -10 23 -5 25 4 M4 2 C-12 -1 -18 6 -18 15" stroke="var(--cherry-forest)" strokeWidth="3.4" strokeLinecap="round" fill="none" /> : null}
                {index === 4 ? (
                  <g>
                    <ellipse cx="3" cy="-3" rx="8.5" ry="12" fill="var(--cherry-yellow)" stroke="var(--cherry-warm-brown)" strokeWidth="1.4" />
                    <path d="M3 -11 C9 -19 17 -18 21 -11 C16 -5 9 -4 3 -11Z" fill="var(--cherry-sage)" />
                    <path d="M3 -10 C7 -3 7 6 2 12" stroke="rgba(94,68,42,0.3)" strokeWidth="1.4" strokeLinecap="round" />
                  </g>
                ) : null}
                {index === 5 ? (
                  <g>
                    {[[-7, -2], [0, -8], [7, -2], [0, 5]].map(([cx, cy]) => (
                      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5.8" fill="var(--cherry-peach)" stroke="rgba(94,68,42,0.12)" strokeWidth="1" />
                    ))}
                    <circle cx="0" cy="-2" r="4.2" fill="var(--cherry-yellow)" />
                    <circle cx="16" cy="8" r="5.6" fill="var(--cherry-red)" opacity="0.82" />
                    <path d="M13 2 C20 -5 27 -2 29 5 C24 10 18 10 13 2Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth="0.9" />
                  </g>
                ) : null}
              </g>
              <circle r="7.6" fill={stage.fill} stroke={stage.accent} strokeWidth="1.8" />
              <text y="2.9" textAnchor="middle" fontSize="5.8" fontWeight="900" fill="var(--cherry-warm-brown)">{index + 1}</text>
            </g>
          );
        })}
        <path d="M23 160 C36 166 70 166 86 158" stroke="var(--cherry-forest)" strokeWidth="1.9" strokeLinecap="round" opacity="0.3" />
      </svg>
    );
  }

  if (slug === "crispr-interactive") {
    return (
      <svg width={width} height={height} viewBox="0 0 96 72" fill="none" aria-hidden="true">
        <rect x="8" y="14" width="80" height="44" rx="18" fill="rgba(250,247,241,0.66)" stroke="rgba(94,68,42,0.12)" strokeWidth="1.2" />
        <path d="M14 31 H86" stroke="var(--cherry-blue)" strokeWidth="5" strokeLinecap="round" />
        <path d="M14 44 H86" stroke="var(--cherry-red)" strokeWidth="5" strokeLinecap="round" opacity="0.78" />
        {[24, 36, 48, 60, 72].map((x) => (
          <line key={x} x1={x} y1="30" x2={x} y2="45" stroke="rgba(94,68,42,0.24)" strokeWidth="1.6" />
        ))}
        <path d="M25 20 C34 12 45 12 54 20" stroke="var(--cherry-red)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="33" cy="17" r="4.8" fill="var(--cherry-red)" stroke="#FAF7F1" strokeWidth="1.4" />
        <circle cx="45" cy="17" r="4.8" fill="var(--cherry-red)" stroke="#FAF7F1" strokeWidth="1.4" />
        <path d="M56 22 C69 15 83 21 80 34 C77 47 57 45 53 33 C51 28 52 24 56 22Z" fill="var(--cherry-peach-light)" stroke="var(--cherry-red)" strokeWidth="2.2" />
        <text x="66" y="35" textAnchor="middle" fontSize="7" fontWeight="900" fill="var(--cherry-warm-brown)">Cas9</text>
        <path d="M60 18 L51 54 M69 18 L60 54" stroke="var(--cherry-warm-brown)" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
        <path d="M72 50 H84" stroke="var(--cherry-peach)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (slug === "research-prompt-kit") {
    return (
      <svg width={width} height={height} viewBox="0 0 96 72" fill="none" aria-hidden="true">
        <rect x="12" y="10" width="54" height="52" rx="11" fill="rgba(250,247,241,0.82)" stroke={color} strokeWidth="2.3" />
        <rect x="21" y="20" width="33" height="7" rx="3.5" fill="var(--cherry-blue-light)" />
        <path d="M22 36 H56 M22 45 H50 M22 54 H44" stroke="var(--cherry-warm-mid)" strokeWidth="2.8" strokeLinecap="round" opacity="0.52" />
        <path d="M67 22 Q78 24 84 34 Q76 39 64 35 Q61 27 67 22Z" fill="var(--cherry-yellow)" opacity="0.76" />
        <path d="M72 17 L76 24 L84 26 L77 30 L74 38 L70 30 L62 27 L69 24Z" fill="var(--cherry-peach)" opacity="0.86" />
        <path d="M64 49 H84" stroke="var(--cherry-forest)" strokeWidth="4" strokeLinecap="round" />
        <path d="M76 43 L84 49 L76 55" stroke="var(--cherry-forest)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (slug === "concept-explainer") {
    return (
      <svg width={width} height={height} viewBox="0 0 96 72" fill="none" aria-hidden="true">
        <rect x="11" y="12" width="74" height="48" rx="18" fill="rgba(250,247,241,0.72)" stroke={color} strokeWidth="2.2" />
        <circle cx="31" cy="34" r="16" fill="#EDE9F5" stroke="#B5AEDD" strokeWidth="2.2" />
        <path d="M23 34 H39 M31 26 V42" stroke="#7B6CC4" strokeWidth="2.7" strokeLinecap="round" />
        <path d="M52 22 H75 M52 32 H70 M52 42 H77" stroke="var(--cherry-warm-mid)" strokeWidth="2.7" strokeLinecap="round" opacity="0.5" />
        <circle cx="59" cy="54" r="5.5" fill="var(--cherry-sage)" opacity="0.78" />
        <circle cx="72" cy="54" r="5.5" fill="var(--cherry-yellow)" opacity="0.84" />
        <path d="M80 14 L83 20 L89 21 L84 25 L82 31 L79 25 L73 22 L78 20Z" fill="var(--cherry-peach)" opacity="0.82" />
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
