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
      { x: 74, y: 214, branch: -43, fill: "var(--cherry-blue-light)", accent: "var(--cherry-sage)" },
      { x: 82, y: 178, branch: 42, fill: "var(--cherry-yellow-light)", accent: "var(--cherry-yellow)" },
      { x: 68, y: 140, branch: -45, fill: "var(--cherry-sage-light)", accent: "var(--cherry-forest)" },
      { x: 86, y: 104, branch: 43, fill: "var(--cherry-sage-light)", accent: "var(--cherry-sage)" },
      { x: 70, y: 68, branch: -43, fill: "var(--cherry-yellow)", accent: "var(--cherry-warm-brown)" },
      { x: 84, y: 34, branch: 39, fill: "var(--cherry-peach-light)", accent: "var(--cherry-red)" },
    ];

    return (
      <svg width={width} height={height} viewBox="0 0 150 250" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="plant-card-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFF8EA" />
            <stop offset="0.52" stopColor="#EEF6E9" />
            <stop offset="0.8" stopColor="#DDECCF" />
            <stop offset="1" stopColor="#D8C7A8" />
          </linearGradient>
          <clipPath id="plant-card-clip">
            <rect x="11" y="7" width="128" height="236" rx="36" />
          </clipPath>
        </defs>
        <rect x="11" y="7" width="128" height="236" rx="36" fill="url(#plant-card-sky)" stroke="rgba(93,140,101,0.28)" strokeWidth="1.8" />
        <g clipPath="url(#plant-card-clip)">
          <circle cx="110" cy="34" r="16" fill="var(--cherry-yellow)" opacity="0.68" />
          <path d="M8 158 C35 133 59 155 83 132 C104 113 123 116 145 98 V245 H8Z" fill="rgba(169,201,172,0.24)" />
          <path d="M8 188 C30 170 55 181 79 167 C104 153 124 164 145 147 V245 H8Z" fill="rgba(169,201,172,0.28)" />
          <path d="M7 213 C32 225 56 211 79 222 C101 232 124 211 146 219 V245 H7Z" fill="rgba(132,184,204,0.2)" />
          <path d="M18 225 C38 231 104 232 130 220" stroke="rgba(58,92,62,0.18)" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M26 229 C38 217 52 217 64 229 M103 228 C113 214 128 216 136 229" stroke="var(--cherry-forest)" strokeWidth="2.8" strokeLinecap="round" opacity="0.38" />
          <path d="M33 231 C28 219 31 211 38 205 M38 218 C49 209 59 214 63 225 M117 229 C111 215 115 204 125 198 M124 213 C134 204 143 208 147 218" stroke="var(--cherry-sage)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.66" />
          <path d="M74 214 C24 175 111 156 72 128 C30 94 112 81 75 55 C58 43 62 26 86 18" stroke="var(--cherry-forest)" strokeWidth="13" strokeLinecap="round" opacity="0.1" />
          <path d="M74 214 C24 175 111 156 72 128 C30 94 112 81 75 55 C58 43 62 26 86 18" stroke="var(--cherry-sage)" strokeWidth="4.8" strokeLinecap="round" />
        </g>
        {stages.map((stage, index) => {
          const side = stage.branch;
          return (
            <g key={stage.y} transform={`translate(${stage.x} ${stage.y})`}>
              <path d={`M0 0 C${side * 0.25} -9 ${side * 0.62} -10 ${side} -22`} stroke="var(--cherry-forest)" strokeWidth="2.5" strokeLinecap="round" opacity="0.72" />
              <g transform={`translate(${side} -22)`}>
                {index === 0 ? (
                  <g>
                    <path d="M-22 12 C-12 0 -2 4 3 12 C12 0 25 4 30 14" stroke="var(--cherry-sage)" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="-14" cy="7" r="6.5" fill="var(--cherry-blue-light)" stroke="var(--cherry-sage)" strokeWidth="1.4" />
                    <circle cx="8" cy="8" r="7.3" fill="var(--cherry-sage-light)" stroke="var(--cherry-sage)" strokeWidth="1.4" />
                    <circle cx="25" cy="9" r="5" fill="rgba(132,184,204,0.58)" stroke="var(--cherry-sage)" strokeWidth="1.2" />
                  </g>
                ) : null}
                {index === 1 ? (
                  <g>
                    {[[-16, 2], [-7, -10], [7, -7], [18, 2], [0, 12], [25, -8]].map(([cx, cy]) => (
                      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.8" fill="var(--cherry-yellow)" stroke="rgba(94,68,42,0.18)" strokeWidth="1.1" />
                    ))}
                  </g>
                ) : null}
                {index === 2 ? <path d="M-3 22 C-3 8 -1 -8 6 -22 M6 -11 C16 -19 26 -15 30 -4 M-15 22 C-3 17 13 17 26 22" stroke="var(--cherry-forest)" strokeWidth="3.4" strokeLinecap="round" fill="none" /> : null}
                {index === 3 ? <path d="M0 24 C0 2 5 -18 16 -30 M7 -8 C25 -16 35 -8 38 5 M7 2 C-18 -2 -27 8 -29 22 M14 -22 C4 -29 -8 -28 -18 -17" stroke="var(--cherry-forest)" strokeWidth="4" strokeLinecap="round" fill="none" /> : null}
                {index === 4 ? (
                  <g>
                    <ellipse cx="4" cy="-3" rx="11" ry="15" fill="var(--cherry-yellow)" stroke="var(--cherry-warm-brown)" strokeWidth="1.6" />
                    <path d="M4 -15 C13 -25 25 -24 30 -15 C23 -6 13 -5 4 -15Z" fill="var(--cherry-sage)" />
                    <path d="M4 -14 C9 -4 9 8 2 16" stroke="rgba(94,68,42,0.3)" strokeWidth="1.5" strokeLinecap="round" />
                  </g>
                ) : null}
                {index === 5 ? (
                  <g>
                    {[[-10, -1], [0, -12], [10, -1], [0, 10]].map(([cx, cy]) => (
                      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7.4" fill="var(--cherry-peach)" stroke="rgba(94,68,42,0.12)" strokeWidth="1.1" />
                    ))}
                    <circle cx="0" cy="-2" r="5.3" fill="var(--cherry-yellow)" />
                    <circle cx="22" cy="12" r="7.2" fill="var(--cherry-red)" opacity="0.84" />
                    <path d="M18 3 C27 -8 38 -3 41 7 C34 14 25 14 18 3Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth="1.1" />
                  </g>
                ) : null}
              </g>
              <circle r="9.4" fill={stage.fill} stroke={stage.accent} strokeWidth="2" />
              <text y="3.4" textAnchor="middle" fontSize="7" fontWeight="900" fill="var(--cherry-warm-brown)">{index + 1}</text>
            </g>
          );
        })}
        <path d="M30 234 C50 242 104 241 128 229" stroke="var(--cherry-forest)" strokeWidth="2.2" strokeLinecap="round" opacity="0.3" />
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
