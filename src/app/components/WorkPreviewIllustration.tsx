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
      { x: 40, y: 113, branch: -20, fill: "var(--cherry-blue-light)", accent: "var(--cherry-sage)" },
      { x: 48, y: 94, branch: 19, fill: "var(--cherry-yellow-light)", accent: "var(--cherry-yellow)" },
      { x: 39, y: 75, branch: -23, fill: "var(--cherry-sage-light)", accent: "var(--cherry-forest)" },
      { x: 50, y: 56, branch: 22, fill: "var(--cherry-sage-light)", accent: "var(--cherry-sage)" },
      { x: 38, y: 36, branch: -22, fill: "var(--cherry-yellow)", accent: "var(--cherry-warm-brown)" },
      { x: 48, y: 17, branch: 19, fill: "var(--cherry-peach-light)", accent: "var(--cherry-red)" },
    ];

    return (
      <svg width={width} height={height} viewBox="0 0 88 132" fill="none" aria-hidden="true">
        <rect x="9" y="5" width="70" height="122" rx="27" fill="#FFF8EA" stroke="rgba(93,140,101,0.24)" strokeWidth="1.5" />
        <path d="M12 98 C25 91 38 101 51 93 C61 87 70 88 79 82 V127 H12Z" fill="rgba(169,201,172,0.26)" />
        <path d="M9 105 C20 111 29 103 41 109 C53 115 64 104 79 110 V127 H9Z" fill="rgba(132,184,204,0.18)" />
        <circle cx="63" cy="18" r="8.5" fill="var(--cherry-yellow)" opacity="0.62" />
        <path d="M44 116 C24 100 60 88 43 72 C24 54 61 42 44 20" stroke="var(--cherry-forest)" strokeWidth="6.2" strokeLinecap="round" opacity="0.13" />
        <path d="M44 116 C24 100 60 88 43 72 C24 54 61 42 44 20" stroke="var(--cherry-sage)" strokeWidth="3.2" strokeLinecap="round" />
        {stages.map((stage, index) => {
          const side = stage.branch;
          return (
            <g key={stage.y} transform={`translate(${stage.x} ${stage.y})`}>
              <path d={`M0 0 C${side * 0.28} -6 ${side * 0.6} -7 ${side} -13`} stroke="var(--cherry-forest)" strokeWidth="1.9" strokeLinecap="round" opacity="0.76" />
              <g transform={`translate(${side} -13)`}>
                {index === 0 ? (
                  <g>
                    <path d="M-12 8 C-8 1 -1 2 3 7 C8 1 14 3 16 9" stroke="var(--cherry-sage)" strokeWidth="2.2" strokeLinecap="round" />
                    <circle cx="-8" cy="5" r="3.6" fill="var(--cherry-blue-light)" stroke="var(--cherry-sage)" strokeWidth="1.1" />
                    <circle cx="5" cy="6" r="4.2" fill="var(--cherry-sage-light)" stroke="var(--cherry-sage)" strokeWidth="1.1" />
                  </g>
                ) : null}
                {index === 1 ? (
                  <g>
                    {[[-9, 1], [-2, -5], [7, -2], [12, 5], [0, 7]].map(([cx, cy]) => (
                      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.1" fill="var(--cherry-yellow)" stroke="rgba(94,68,42,0.18)" strokeWidth="1" />
                    ))}
                  </g>
                ) : null}
                {index === 2 ? <path d="M-2 14 C-2 4 -1 -5 3 -14 M3 -7 C9 -12 14 -10 17 -3" stroke="var(--cherry-forest)" strokeWidth="2.6" strokeLinecap="round" fill="none" /> : null}
                {index === 3 ? <path d="M0 15 C0 1 2 -11 8 -18 M4 -4 C14 -8 19 -4 21 4 M4 1 C-9 -1 -14 4 -15 12" stroke="var(--cherry-forest)" strokeWidth="3.2" strokeLinecap="round" fill="none" /> : null}
                {index === 4 ? (
                  <g>
                    <ellipse cx="3" cy="-3" rx="7.8" ry="10.5" fill="var(--cherry-yellow)" stroke="var(--cherry-warm-brown)" strokeWidth="1.4" />
                    <path d="M3 -10 C8 -17 15 -16 18 -10 C14 -5 8 -4 3 -10Z" fill="var(--cherry-sage)" />
                  </g>
                ) : null}
                {index === 5 ? (
                  <g>
                    {[[-7, -2], [0, -8], [7, -2], [0, 5]].map(([cx, cy]) => (
                      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5.4" fill="var(--cherry-peach)" stroke="rgba(94,68,42,0.12)" strokeWidth="1" />
                    ))}
                    <circle cx="0" cy="-2" r="4.2" fill="var(--cherry-yellow)" />
                    <circle cx="15" cy="7" r="5" fill="var(--cherry-red)" opacity="0.78" />
                  </g>
                ) : null}
              </g>
              <circle r="7.1" fill={stage.fill} stroke={stage.accent} strokeWidth="1.7" />
              <text y="2.6" textAnchor="middle" fontSize="5.4" fontWeight="900" fill="var(--cherry-warm-brown)">{index + 1}</text>
            </g>
          );
        })}
        <path d="M22 123 C31 127 49 128 61 122" stroke="var(--cherry-forest)" strokeWidth="1.7" strokeLinecap="round" opacity="0.32" />
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
