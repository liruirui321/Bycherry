import { useId } from "react";

export function WorkPreviewIllustration({ slug, color, width = 96, height = 72 }: { slug: string; color: string; width?: number; height?: number }) {
  const svgId = useId().replace(/[^a-zA-Z0-9_-]/g, "");

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
    const skyId = `${svgId}-plant-card-sky`;
    const waterId = `${svgId}-plant-card-water`;
    const pathId = `${svgId}-plant-card-path`;
    const clipId = `${svgId}-plant-card-clip`;
    const stages = [
      { x: 90, y: 280, branch: -48, fill: "var(--cherry-blue-light)", accent: "var(--cherry-blue)" },
      { x: 101, y: 231, branch: 48, fill: "var(--cherry-yellow-light)", accent: "var(--cherry-yellow)" },
      { x: 79, y: 184, branch: -48, fill: "var(--cherry-sage-light)", accent: "var(--cherry-forest)" },
      { x: 103, y: 136, branch: 48, fill: "var(--cherry-sage-light)", accent: "var(--cherry-sage)" },
      { x: 81, y: 87, branch: -48, fill: "var(--cherry-yellow)", accent: "var(--cherry-warm-brown)" },
      { x: 104, y: 39, branch: 42, fill: "var(--cherry-peach-light)", accent: "var(--cherry-red)" },
    ];

    return (
      <svg width={width} height={height} viewBox="0 0 180 316" fill="none" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFF4DE" />
            <stop offset="0.28" stopColor="#F7EED0" />
            <stop offset="0.58" stopColor="#E8F4D8" />
            <stop offset="1" stopColor="#CDE7E4" />
          </linearGradient>
          <linearGradient id={waterId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#84B8CC" stopOpacity="0.24" />
            <stop offset="0.5" stopColor="#84B8CC" stopOpacity="0.56" />
            <stop offset="1" stopColor="#84B8CC" stopOpacity="0.28" />
          </linearGradient>
          <linearGradient id={pathId} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#8BBE9A" />
            <stop offset="0.55" stopColor="#5D8C65" />
            <stop offset="1" stopColor="#E5A3A0" />
          </linearGradient>
          <clipPath id={clipId}>
            <rect x="8" y="6" width="164" height="304" rx="32" />
          </clipPath>
        </defs>
        <rect x="8" y="6" width="164" height="304" rx="32" fill={`url(#${skyId})`} stroke="rgba(93,140,101,0.3)" strokeWidth="1.8" />
        <g clipPath={`url(#${clipId})`}>
          <circle cx="132" cy="37" r="20" fill="var(--cherry-yellow)" opacity="0.78" />
          <circle cx="132" cy="37" r="30" fill="var(--cherry-yellow)" opacity="0.12" />
          <path d="M17 57 C38 41 63 45 76 66 C55 76 34 75 17 57Z M105 78 C123 62 149 66 163 86 C142 97 120 95 105 78Z" fill="#FAF7F1" opacity="0.72" />
          <path d="M0 112 C32 89 63 106 94 78 C125 50 148 62 180 34 V310 H0Z" fill="rgba(169,201,172,0.15)" />
          <path d="M0 169 C31 145 57 162 88 136 C123 107 151 119 180 91 V310 H0Z" fill="rgba(169,201,172,0.26)" />
          <path d="M0 236 C29 218 63 234 95 213 C127 191 151 198 180 177 V310 H0Z" fill="rgba(216,199,168,0.54)" />
          <path d="M0 267 C33 281 60 262 94 276 C123 289 151 264 180 276 V310 H0Z" fill={`url(#${waterId})`} />
          <path d="M11 299 C39 285 65 294 93 283 C122 270 149 281 171 262 V310 H11Z" fill="rgba(216,199,168,0.7)" />
          <path d="M18 298 C47 306 118 304 158 288" stroke="rgba(58,92,62,0.18)" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M21 302 C35 288 53 289 66 302 M113 302 C123 284 145 285 159 302" stroke="var(--cherry-forest)" strokeWidth="3" strokeLinecap="round" opacity="0.46" />
          <path d="M33 298 C27 276 35 259 50 248 M43 274 C59 262 74 273 77 294 M131 300 C122 275 132 253 149 242 M145 264 C160 254 174 261 178 279" stroke="var(--cherry-sage)" strokeWidth="2.7" strokeLinecap="round" fill="none" opacity="0.72" />
          <path d="M90 280 C28 235 126 212 79 174 C36 139 132 121 87 84 C68 68 73 41 108 22" stroke="var(--cherry-forest)" strokeWidth="17" strokeLinecap="round" opacity="0.09" />
          <path d="M90 280 C28 235 126 212 79 174 C36 139 132 121 87 84 C68 68 73 41 108 22" stroke={`url(#${pathId})`} strokeWidth="6.2" strokeLinecap="round" />
          {[31, 151, 42, 137, 60].map((x, index) => (
            <path key={x} d={`M${x} ${94 + index * 37} C${x - 7} ${83 + index * 37} ${x - 4} ${74 + index * 37} ${x + 7} ${67 + index * 37} M${x + 7} ${67 + index * 37} C${x + 17} ${76 + index * 37} ${x + 11} ${88 + index * 37} ${x} ${94 + index * 37}`} stroke="rgba(58,92,62,0.2)" strokeWidth="1.8" strokeLinecap="round" fill="rgba(169,201,172,0.18)" />
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
                    <path d="M-22 7 C-12 -7 -2 4 6 -8 C14 -17 25 -8 31 4" stroke="var(--cherry-sage)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                    <path d="M-20 15 C-7 4 6 16 19 7 C24 3 30 6 34 12" stroke="var(--cherry-blue)" strokeWidth="2.4" strokeLinecap="round" opacity="0.68" />
                    <circle cx="-13" cy="3" r="6.7" fill="var(--cherry-blue-light)" stroke="var(--cherry-sage)" strokeWidth="1.4" />
                    <circle cx="7" cy="6" r="7.6" fill="var(--cherry-sage-light)" stroke="var(--cherry-sage)" strokeWidth="1.4" />
                    <circle cx="25" cy="1" r="5.4" fill="rgba(132,184,204,0.68)" stroke="var(--cherry-sage)" strokeWidth="1.2" />
                    <circle cx="1" cy="-13" r="3.2" fill="var(--cherry-blue-light)" opacity="0.72" />
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
                    <circle cx="24" cy="13" r="7.4" fill="var(--cherry-red)" opacity="0.9" />
                    <circle cx="35" cy="7" r="5.8" fill="var(--cherry-red)" opacity="0.74" />
                    <path d="M18 2 C28 -10 41 -4 42 8 C35 15 26 14 18 2Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth="1.1" />
                  </g>
                ) : null}
              </g>
              <circle r="10.4" fill="#FAF7F1" stroke="rgba(94,68,42,0.13)" strokeWidth="1.2" />
              <circle r="8.2" fill={stage.fill} stroke={stage.accent} strokeWidth="1.8" />
              <text y="3" textAnchor="middle" fontSize="7" fontWeight="900" fill="var(--cherry-warm-brown)">{index + 1}</text>
            </g>
          );
        })}
        <path d="M22 306 C52 314 127 313 160 296" stroke="var(--cherry-forest)" strokeWidth="2.6" strokeLinecap="round" opacity="0.34" />
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
