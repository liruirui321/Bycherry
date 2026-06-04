import type { MouseEvent } from "react";

export function EmptyStateCard({
  eyebrow,
  title,
  body,
  href,
  linkText,
  onNavigate,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  linkText: string;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <section style={{ maxWidth: 620, textAlign: "center", background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "1.45rem 1.35rem 1.65rem", boxShadow: "5px 8px 0px rgba(94,68,42,0.08)", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", top: -10, left: "50%", width: 82, height: 20, borderRadius: 4, background: "var(--cherry-yellow)", opacity: 0.68, transform: "translateX(-50%) rotate(-3deg)" }} />
      <svg width="190" height="112" viewBox="0 0 190 112" fill="none" aria-hidden="true" focusable="false" style={{ display: "block", margin: "0 auto 0.8rem" }}>
        <path d="M18 84 C45 65 72 78 96 60 C126 38 151 53 178 30 V106 H18Z" fill="var(--cherry-sage-light)" opacity="0.58" />
        <path d="M34 92 C66 102 138 100 166 87" stroke="rgba(94,68,42,0.15)" strokeWidth="6" strokeLinecap="round" />
        <rect x="53" y="27" width="88" height="58" rx="15" fill="#FFF8EA" stroke="var(--cherry-peach)" strokeWidth="2.5" />
        <path d="M55 40 L97 64 L139 40" stroke="var(--cherry-peach)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M128 20 L134 30 L146 34 L136 41 L133 53 L127 43 L115 39 L125 32Z" fill="var(--cherry-yellow)" stroke="rgba(94,68,42,0.14)" strokeWidth="1.2" />
        <path d="M31 45 C43 33 57 34 68 47" stroke="var(--cherry-blue)" strokeWidth="5" strokeLinecap="round" opacity="0.36" />
        <path d="M143 77 C152 63 168 66 175 80 C159 90 149 87 143 77Z" fill="var(--cherry-sage)" stroke="var(--cherry-forest)" strokeWidth="1.8" />
        <circle cx="66" cy="30" r="6" fill="var(--cherry-red)" opacity="0.74" />
      </svg>
      <div style={{ color: "var(--cherry-red)", fontSize: "1.15rem", fontWeight: 900, marginBottom: "0.45rem" }}>{eyebrow}</div>
      <h1 style={{ color: "var(--cherry-warm-brown)", fontSize: "clamp(1.55rem, 4vw, 2.1rem)", fontWeight: 900, lineHeight: 1.25, marginBottom: "0.7rem" }}>
        {title}
      </h1>
      <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.75, fontSize: "0.95rem", margin: "0 auto 1.3rem", maxWidth: 430 }}>
        {body}
      </p>
      <a
        className="empty-state-link"
        href={href}
        onClick={onNavigate}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--cherry-forest)", color: "#FAF7F1", borderRadius: 999, padding: "0.62rem 1.1rem", textDecoration: "none", fontWeight: 900, boxShadow: "3px 5px 0px rgba(58,92,62,0.22)" }}
      >
        {linkText}
      </a>
      <style>
        {`
          .empty-state-link:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          .empty-state-link:hover,
          .empty-state-link:focus-visible {
            background: var(--cherry-red) !important;
          }
        `}
      </style>
    </section>
  );
}
