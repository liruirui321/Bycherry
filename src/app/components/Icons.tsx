/* Cherry Studio — Custom SVG Icon Library */

type IconProps = { size?: number; color?: string; className?: string };

export function IconCherry({ size = 28, color = "var(--cherry-red)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="10" cy="21" r="6.5" fill={color} />
      <circle cx="22" cy="23" r="5.5" fill={color} opacity="0.82" />
      <path d="M10 14.5 C11 10 14 5 20 4 C24 3.5 26 6 26 9" stroke="var(--cherry-sage)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M10 14.5 C12 12 16 9 20 10" stroke="var(--cherry-sage)" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.6" />
      <circle cx="26" cy="9" r="2.2" fill="var(--cherry-sage)" />
    </svg>
  );
}

export function IconMicroscope({ size = 36, color = "var(--cherry-blue)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="17" y="5" width="7" height="12" rx="3.5" fill={color} opacity="0.9" />
      <rect x="15.5" y="15" width="9" height="5" rx="2.5" fill="var(--cherry-sage)" />
      <path d="M12 34 Q12 30 20 30 Q28 30 28 34" stroke="var(--cherry-warm-brown)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <line x1="20" y1="20" x2="20" y2="30" stroke="var(--cherry-warm-mid)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20.5" cy="7.5" r="3" fill="white" stroke={color} strokeWidth="1.5" opacity="0.9" />
      <line x1="13" y1="5" x2="24" y2="5" stroke="var(--cherry-warm-mid)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconTestTube({ size = 30, color = "var(--cherry-peach)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
      <path d="M9 4 L9 20 Q9 26 15 26 Q21 26 21 20 L21 4" stroke="var(--cherry-warm-mid)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 18 Q12 20 15 18 Q18 16 21 18" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <ellipse cx="15" cy="24" rx="3.5" ry="1.5" fill={color} opacity="0.55" />
      <line x1="7" y1="4" x2="23" y2="4" stroke="var(--cherry-warm-mid)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconDNA({ size = 32, color1 = "var(--cherry-blue)", color2 = "var(--cherry-red)" }: IconProps & { color1?: string; color2?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 36" fill="none">
      <path d="M7 3 Q16 9 25 3 Q16 14 7 14 Q16 20 25 14 Q16 25 7 25 Q16 31 25 25" stroke={color1} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <line x1="10" y1="8.5" x2="22" y2="8.5" stroke="var(--cherry-sage)" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.6" />
      <line x1="10" y1="19.5" x2="22" y2="19.5" stroke="var(--cherry-sage)" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.6" />
      <circle cx="7" cy="3" r="2.2" fill={color2} />
      <circle cx="25" cy="3" r="2.2" fill={color2} />
      <circle cx="7" cy="14" r="2.2" fill={color1} />
      <circle cx="25" cy="14" r="2.2" fill={color1} />
      <circle cx="7" cy="25" r="2.2" fill={color2} />
      <circle cx="25" cy="25" r="2.2" fill={color2} />
    </svg>
  );
}

export function IconLeaf({ size = 32, color = "var(--cherry-sage)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M7 28 Q9 16 26 7 Q26 22 7 28Z" fill={color} opacity="0.88" />
      <path d="M7 28 Q15.5 20 26 7" stroke={color} strokeWidth="1.2" fill="none" opacity="0.45" strokeLinecap="round" />
      <path d="M7 28 Q11 23 14 17" stroke="white" strokeWidth="0.8" fill="none" opacity="0.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconLeafSmall({ size = 22, color = "var(--cherry-sage)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path d="M5 19 Q7 11 18 5 Q18 15 5 19Z" fill={color} opacity="0.85" />
      <path d="M5 19 Q10 14 18 5" stroke={color} strokeWidth="1" fill="none" opacity="0.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconMushroom({ size = 30, color = "var(--cherry-peach)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
      <path d="M5 18 Q5 8 15 8 Q25 8 25 18Z" fill={color} opacity="0.9" />
      <circle cx="10" cy="14" r="2" fill="white" opacity="0.6" />
      <circle cx="18" cy="12" r="1.5" fill="white" opacity="0.5" />
      <circle cx="21" cy="16" r="1.2" fill="white" opacity="0.45" />
      <rect x="12" y="18" width="6" height="8" rx="3" fill="var(--cherry-yellow-light)" stroke={color} strokeWidth="1" />
    </svg>
  );
}

export function IconNotebook({ size = 32, color = "var(--cherry-yellow)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="6" y="5" width="20" height="22" rx="3" fill={color} opacity="0.9" />
      <rect x="6" y="5" width="5" height="22" rx="2.5" fill="var(--cherry-peach)" opacity="0.85" />
      <line x1="14" y1="11" x2="23" y2="11" stroke="var(--cherry-warm-mid)" strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
      <line x1="14" y1="15" x2="23" y2="15" stroke="var(--cherry-warm-mid)" strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
      <line x1="14" y1="19" x2="20" y2="19" stroke="var(--cherry-warm-mid)" strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
      <circle cx="8.5" cy="9" r="1.5" fill="white" opacity="0.5" />
      <circle cx="8.5" cy="14" r="1.5" fill="white" opacity="0.5" />
      <circle cx="8.5" cy="19" r="1.5" fill="white" opacity="0.5" />
    </svg>
  );
}

export function IconPencil({ size = 28, color = "var(--cherry-yellow)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M6 22 L19 6 L23 10 L10 26 Z" fill={color} opacity="0.85" />
      <path d="M19 6 L23 10" stroke="var(--cherry-warm-mid)" strokeWidth="1.5" />
      <path d="M6 22 L10 26 L5 27 Z" fill="var(--cherry-peach)" />
      <path d="M19 6 L21 4 L24 7 L22 9 Z" fill="var(--cherry-warm-mid)" opacity="0.7" />
    </svg>
  );
}

export function IconBranch({ size = 40, color = "var(--cherry-forest)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M8 36 Q12 26 20 20 Q28 14 32 6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M20 20 Q26 18 30 12" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M14 27 Q8 24 6 18" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
      <ellipse cx="32" cy="6" rx="4" ry="3" fill="var(--cherry-sage)" opacity="0.8" transform="rotate(-20 32 6)" />
      <ellipse cx="30" cy="12" rx="3.5" ry="2.5" fill="var(--cherry-sage)" opacity="0.7" transform="rotate(10 30 12)" />
      <ellipse cx="6" cy="17" rx="3.5" ry="2.5" fill="var(--cherry-sage)" opacity="0.65" transform="rotate(-15 6 17)" />
    </svg>
  );
}

export function IconStar({ size = 20, color = "var(--cherry-yellow)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2.5L11.6 7.8H17.2L12.8 11.1L14.4 16.4L10 13.1L5.6 16.4L7.2 11.1L2.8 7.8H8.4L10 2.5Z" fill={color} />
    </svg>
  );
}

export function IconSparkle({ size = 18, color = "var(--cherry-yellow)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M9 1 L10 7 L16 8 L10 9 L9 17 L8 9 L2 8 L8 7 Z" fill={color} />
    </svg>
  );
}

export function IconArrowDown({ size = 18, color = "var(--cherry-warm-mid)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M9 2V14M3 8L9 14L15 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconArrowRight({ size = 16, color = "var(--cherry-red)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8H13M8 3L13 8L8 13" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPin({ size = 18, color = "var(--cherry-red)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M9 2 L12 8 L16 9 L12 10 L9 16 L6 10 L2 9 L6 8 Z" fill={color} opacity="0.85" />
      <circle cx="9" cy="9" r="2" fill="white" opacity="0.6" />
    </svg>
  );
}

export function IconSend({ size = 20, color = "var(--cherry-red)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M3 10L17 3L10 17L9 11L3 10Z" fill={color} opacity="0.9" />
      <path d="M9 11L17 3" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function IconMail({ size = 22, color = "var(--cherry-warm-mid)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <rect x="2" y="5" width="18" height="13" rx="2.5" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M2 7L11 13L20 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function IconBook({ size = 28, color = "var(--cherry-sage)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M4 6 Q14 4 14 14 Q14 4 24 6 L24 22 Q14 20 14 24 Q14 20 4 22 Z" fill={color} opacity="0.25" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
      <line x1="14" y1="4" x2="14" y2="24" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      <path d="M8 10 Q11 9 14 10" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path d="M8 13 Q11 12 14 13" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function IconFlask({ size = 30, color = "var(--cherry-sage)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
      <path d="M10 4 L10 14 L4 24 Q4 27 15 27 Q26 27 26 24 L20 14 L20 4" stroke="var(--cherry-warm-mid)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M7 20 Q11 18 15 20 Q19 22 23 20" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <ellipse cx="15" cy="25" rx="6" ry="1.5" fill={color} opacity="0.35" />
      <line x1="8" y1="4" x2="22" y2="4" stroke="var(--cherry-warm-mid)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconAI({ size = 30, color = "var(--cherry-blue)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
      <rect x="7" y="8" width="16" height="14" rx="4" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5" />
      <circle cx="11" cy="13" r="1.5" fill={color} />
      <circle cx="15" cy="13" r="1.5" fill={color} />
      <circle cx="19" cy="13" r="1.5" fill={color} />
      <path d="M11 17 Q13 19 15 17 Q17 15 19 17" stroke={color} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <line x1="11" y1="8" x2="11" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15" y1="8" x2="15" y2="4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19" y1="8" x2="19" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="11" cy="4.5" r="1.2" fill={color} />
      <circle cx="15" cy="3.5" r="1.2" fill={color} />
      <circle cx="19" cy="4.5" r="1.2" fill={color} />
    </svg>
  );
}

export function IconSeedling({ size = 28, color = "var(--cherry-sage)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <line x1="14" y1="26" x2="14" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M14 18 Q8 16 7 10 Q13 9 14 14 Q15 9 21 10 Q20 16 14 18Z" fill={color} opacity="0.8" />
    </svg>
  );
}

export function IconCoffee({ size = 24, color = "var(--cherry-warm-mid)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 9 H16 L14 20 H6 Z" fill={color} opacity="0.2" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M16 11 Q20 11 20 14.5 Q20 18 16 18" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M8 5 Q8 3 10 3" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.55" />
      <path d="M12 6 Q12 4 14 4" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.55" />
    </svg>
  );
}

export function IconMenu({ size = 22, color = "var(--cherry-warm-brown)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path d="M3 6H19M3 11H19M3 16H19" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function IconClose({ size = 22, color = "var(--cherry-warm-brown)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path d="M4 4L18 18M4 18L18 4" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function IconTwitter({ size = 18, color = "var(--cherry-warm-mid)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M2 3h4l3 4.5L13 3h3L11 9.5 16 15h-4l-3-4.5L5 15H2l5-5.5L2 3Z" fill={color} />
    </svg>
  );
}

export function IconGithub({ size = 18, color = "var(--cherry-warm-mid)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M9 1a8 8 0 00-2.53 15.59c.4.07.55-.17.55-.38v-1.34c-2.22.48-2.69-1.07-2.69-1.07-.36-.92-.88-1.17-.88-1.17-.72-.49.06-.48.06-.48.8.06 1.22.82 1.22.82.71 1.22 1.86.87 2.31.66.07-.52.28-.87.5-1.07-1.77-.2-3.63-.89-3.63-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.69 7.69 0 019 5.9c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 009 1z" fill={color} />
    </svg>
  );
}

export function IconZhihu({ size = 18, color = "var(--cherry-warm-mid)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <rect x="1.5" y="1.5" width="15" height="15" rx="3" stroke={color} strokeWidth="1.4" fill="none" />
      <path d="M5 5 C5 5 4 9 4 12 H7 L8 15 L10 12 H13 C13 12 12 8 12 5" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="5" y1="8" x2="12" y2="8" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function IconBilibili({ size = 18, color = "var(--cherry-warm-mid)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <rect x="1.5" y="4" width="15" height="11" rx="2.5" stroke={color} strokeWidth="1.4" fill="none" />
      <path d="M1 8H17" stroke={color} strokeWidth="1" opacity="0.3" />
      <path d="M5 1.5 L7.5 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13 1.5 L10.5 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 10.5 L7 13.5 L11 12 Z" fill={color} opacity="0.7" />
    </svg>
  );
}

export function IconTree({ size = 48, color = "var(--cherry-forest)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M24 5 L35 22 H28 L38 36 H26 V44 H22 V36 H10 L20 22 H13 Z" fill={color} opacity="0.85" />
    </svg>
  );
}

export function IconResearch({ size = 30, color = "var(--cherry-sage)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
      <circle cx="13" cy="13" r="8" stroke={color} strokeWidth="1.7" fill="none" />
      <line x1="19" y1="19" x2="26" y2="26" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="9" y1="10" x2="17" y2="10" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <line x1="9" y1="13" x2="17" y2="13" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <line x1="9" y1="16" x2="14" y2="16" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function IconCheck({ size = 22, color = "var(--cherry-sage)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" fill={color} opacity="0.15" />
      <path d="M6 11L9.5 14.5L16 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
