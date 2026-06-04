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
    <section style={{ maxWidth: 620, textAlign: "center", background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "1.45rem 1.35rem 1.65rem", boxShadow: "0 8px 18px rgba(94,68,42,0.06)", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ width: 44, height: 44, borderRadius: 999, background: "var(--cherry-sage-light)", border: "1.5px solid var(--cherry-sage)", color: "var(--cherry-forest)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1.2rem", marginBottom: "0.8rem" }}>
        ?
      </div>
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
