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
      { x: 89, y: 304, branch: -52, fill: "var(--cherry-blue-light)", accent: "var(--cherry-sage)" },
      { x: 97, y: 253, branch: 52, fill: "var(--cherry-yellow-light)", accent: "var(--cherry-yellow)" },
      { x: 80, y: 204, branch: -50, fill: "var(--cherry-sage-light)", accent: "var(--cherry-forest)" },
      { x: 102, y: 154, branch: 50, fill: "var(--cherry-sage-light)", accent: "var(--cherry-sage)" },
      { x: 82, y: 105, branch: -50, fill: "var(--cherry-yellow)", accent: "var(--cherry-warm-brown)" },
      { x: 101, y: 51, branch: 44, fill: "var(--cherry-peach-light)", accent: "var(--cherry-red)" },
    ];

    return (
      <svg width={width} height={height} viewBox="0 0 180 340" fill="none" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="plant-card-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFF4DE" />
            <stop offset="0.34" stopColor="#EEF8E8" />
            <stop offset="0.66" stopColor="#DDEFCF" />
            <stop offset="1" stopColor="#D3E8D7" />
          </linearGradient>
          <linearGradient id="plant-card-water" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#84B8CC" stopOpacity="0.2" />
            <stop offset="0.52" stopColor="#84B8CC" stopOpacity="0.48" />
            <stop offset="1" stopColor="#84B8CC" stopOpacity="0.24" />
          </linearGradient>
          <linearGradient id="plant-card-path" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#8BBE9A" />
            <stop offset="0.55" stopColor="#5D8C65" />
            <stop offset="1" stopColor="#E5A3A0" />
          </linearGradient>
          <clipPath id="plant-card-clip">
            <rect x="8" y="6" width="164" height="328" rx="34" />
          </clipPath>
        </defs>
        <rect x="8" y="6" width="164" height="328" rx="34" fill="url(#plant-card-sky)" stroke="rgba(93,140,101,0.28)" strokeWidth="1.8" />
        <g clipPath="url(#plant-card-clip)">
          <circle cx="133" cy="38" r="22" fill="var(--cherry-yellow)" opacity="0.72" />
          <circle cx="132" cy="38" r="29" fill="var(--cherry-yellow)" opacity="0.13" />
          <path d="M18 65 C40 45 63 50 78 71 C58 82 35 82 18 65Z M102 86 C122 68 149 73 163 94 C142 105 118 103 102 86Z" fill="#FAF7F1" opacity="0.68" />
          <path d="M2 130 C36 101 70 128 103 96 C131 69 151 78 179 55 V335 H2Z" fill="rgba(169,201,172,0.16)" />
          <path d="M1 185 C34 160 59 181 91 152 C124 122 147 138 180 108 V335 H1Z" fill="rgba(169,201,172,0.25)" />
          <path d="M0 253 C31 232 63 250 95 226 C128 201 153 211 180 187 V335 H0Z" fill="rgba(216,199,168,0.52)" />
          <path d="M0 285 C34 302 62 279 95 295 C123 309 149 281 180 294 V335 H0Z" fill="url(#plant-card-water)" />
          <path d="M8 315 C40 296 63 310 92 297 C124 283 148 296 174 276 V335 H8Z" fill="rgba(216,199,168,0.66)" />
          <path d="M17 316 C45 326 122 323 159 304" stroke="rgba(58,92,62,0.18)" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M22 322 C35 306 54 306 68 323 M112 321 C123 301 146 302 160 321" stroke="var(--cherry-forest)" strokeWidth="3" strokeLinecap="round" opacity="0.48" />
          <path d="M33 318 C27 294 35 277 50 265 M42 294 C60 282 75 292 78 312 M131 319 C123 292 132 270 150 258 M145 281 C159 272 173 279 178 296" stroke="var(--cherry-sage)" strokeWidth="2.7" strokeLinecap="round" fill="none" opacity="0.72" />
          <path d="M89 304 C25 251 128 227 81 187 C34 146 132 128 88 92 C70 77 70 47 106 25" stroke="var(--cherry-forest)" strokeWidth="17" strokeLinecap="round" opacity="0.09" />
          <path d="M89 304 C25 251 128 227 81 187 C34 146 132 128 88 92 C70 77 70 47 106 25" stroke="url(#plant-card-path)" strokeWidth="6" strokeLinecap="round" />
          {[34, 56, 125, 151].map((x, index) => (
            <path key={x} d={`M${x} ${118 + index * 36} C${x - 7} ${106 + index * 36} ${x - 6} ${96 + index * 36} ${x + 5} ${89 + index * 36} M${x + 5} ${89 + index * 36} C${x + 16} ${98 + index * 36} ${x + 12} ${109 + index * 36} ${x} ${118 + index * 36}`} stroke="rgba(58,92,62,0.22)" strokeWidth="1.7" strokeLinecap="round" fill="rgba(169,201,172,0.18)" />
          ))}
        </g>
        {stages.map((stage, index) => {
          const side = stage.branch;
          return (
            <g key={stage.y} transform={`translate(${stage.x} ${stage.y})`}>
              <path d={`M0 0 C${side * 0.22} -11 ${side * 0.62} -12 ${side} -25`} stroke="var(--cherry-forest)" strokeWidth="2.8" strokeLinecap="round" opacity="0.76" />
              <g transform={`translate(${side} -25)`}>
                <circle cx="2" cy="2" r={index === 0 ? 24 : 22} fill="rgba(250,247,241,0.72)" stroke="rgba(94,68,42,0.12)" strokeWidth="1.3" />
                {index === 0 ? (
                  <g>
                    <path d="M-21 8 C-12 -6 -2 4 6 -7 C13 -15 23 -8 29 5" stroke="var(--cherry-sage)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                    <path d="M-18 15 C-6 5 6 17 18 7 C23 3 28 6 32 12" stroke="var(--cherry-blue)" strokeWidth="2.3" strokeLinecap="round" opacity="0.62" />
                    <circle cx="-13" cy="3" r="6.7" fill="var(--cherry-blue-light)" stroke="var(--cherry-sage)" strokeWidth="1.4" />
                    <circle cx="7" cy="6" r="7.6" fill="var(--cherry-sage-light)" stroke="var(--cherry-sage)" strokeWidth="1.4" />
                    <circle cx="25" cy="2" r="5.2" fill="rgba(132,184,204,0.62)" stroke="var(--cherry-sage)" strokeWidth="1.2" />
                  </g>
                ) : null}
                {index === 1 ? (
                  <g>
                    <path d="M-22 15 C-9 -18 19 -18 31 14" fill="rgba(238,199,103,0.16)" stroke="var(--cherry-yellow)" strokeWidth="1.4" />
                    {[[-15, 4], [-8, -9], [5, -11], [17, -2], [0, 12], [25, 9], [12, 12]].map(([cx, cy]) => (
                      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.6" fill="var(--cherry-yellow)" stroke="rgba(94,68,42,0.18)" strokeWidth="1.1" />
                    ))}
                  </g>
                ) : null}
                {index === 2 ? (
                  <g>
                    <path d="M-4 22 C-4 8 -1 -8 7 -23 M7 -12 C17 -20 28 -15 31 -4 M-18 22 C-4 16 14 17 28 22" stroke="var(--cherry-forest)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                    {[[-13, 15], [2, 7], [16, 4]].map(([cx, cy]) => (
                      <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx="5" ry="8" fill="var(--cherry-sage)" opacity="0.62" transform={`rotate(${cx * 2} ${cx} ${cy})`} />
                    ))}
                  </g>
                ) : null}
                {index === 3 ? (
                  <g>
                    <path d="M0 24 C0 2 5 -18 17 -32 M7 -9 C25 -18 36 -8 40 6 M7 2 C-19 -3 -29 8 -31 23 M15 -23 C4 -31 -10 -29 -20 -17" stroke="var(--cherry-forest)" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <path d="M18 -25 C23 -18 25 -12 25 -4 M9 -6 C16 -2 21 3 24 10 M-9 4 C-15 10 -18 16 -19 22" stroke="rgba(250,247,241,0.78)" strokeWidth="1.5" strokeLinecap="round" />
                  </g>
                ) : null}
                {index === 4 ? (
                  <g>
                    <ellipse cx="4" cy="-2" rx="12" ry="16" fill="var(--cherry-yellow)" stroke="var(--cherry-warm-brown)" strokeWidth="1.6" />
                    <path d="M4 -16 C14 -26 27 -24 32 -14 C24 -5 14 -4 4 -16Z" fill="var(--cherry-sage)" />
                    <path d="M-5 11 C-18 4 -21 -9 -14 -20 C-2 -18 5 -8 2 6" fill="rgba(169,201,172,0.58)" stroke="var(--cherry-forest)" strokeWidth="1.2" />
                    <path d="M4 -14 C10 -4 9 9 1 18" stroke="rgba(94,68,42,0.32)" strokeWidth="1.5" strokeLinecap="round" />
                  </g>
                ) : null}
                {index === 5 ? (
                  <g>
                    {[[-11, -1], [0, -13], [11, -1], [0, 11], [-8, 11], [8, 11]].map(([cx, cy]) => (
                      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7.2" fill="var(--cherry-peach)" stroke="rgba(94,68,42,0.12)" strokeWidth="1.1" />
                    ))}
                    <circle cx="0" cy="-2" r="5.3" fill="var(--cherry-yellow)" />
                    <circle cx="25" cy="13" r="7.4" fill="var(--cherry-red)" opacity="0.88" />
                    <circle cx="36" cy="7" r="5.8" fill="var(--cherry-red)" opacity="0.72" />
                    <path d="M19 2 C28 -10 41 -4 43 8 C35 15 26 14 19 2Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth="1.1" />
                  </g>
                ) : null}
              </g>
              <circle r="10.4" fill="#FAF7F1" stroke="rgba(94,68,42,0.13)" strokeWidth="1.2" />
              <circle r="8.2" fill={stage.fill} stroke={stage.accent} strokeWidth="1.8" />
              <text y="3" textAnchor="middle" fontSize="7" fontWeight="900" fill="var(--cherry-warm-brown)">{index + 1}</text>
            </g>
          );
        })}
        <path d="M22 328 C52 338 127 336 160 315" stroke="var(--cherry-forest)" strokeWidth="2.6" strokeLinecap="round" opacity="0.34" />
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
