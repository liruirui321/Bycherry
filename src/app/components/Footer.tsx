import { IconCherry, IconLeafSmall } from "./Icons";
import { navigateHomeSection } from "../navigation";

const footerLinks = [
  { label: "主题作品", href: "#works" },
  { label: "科研", href: "#research" },
  { label: "笔记", href: "#notes" },
  { label: "联系", href: "#contact" },
];

export function Footer() {
  return (
    <footer
      style={{
        fontFamily: "'Nunito', sans-serif",
        background: "var(--cherry-forest)",
        color: "rgba(245,241,234,0.7)",
        padding: "2rem 1.5rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle leaf pattern */}
      <svg style={{ position: "absolute", top: 10, left: 20, opacity: 0.12, pointerEvents: "none" }} width="50" height="55" viewBox="0 0 60 60" fill="none">
        <path d="M8 55 Q12 34 50 10 Q50 38 8 55Z" fill="white" />
      </svg>
      <svg style={{ position: "absolute", bottom: 8, right: 24, opacity: 0.1, pointerEvents: "none", transform: "scaleX(-1)" }} width="44" height="48" viewBox="0 0 60 60" fill="none">
        <path d="M8 55 Q12 34 50 10 Q50 38 8 55Z" fill="white" />
      </svg>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: "0.55rem" }}>
        <IconCherry size={20} color="#F2A896" />
        <span style={{ fontSize: "1rem", color: "rgba(245,241,234,0.9)", fontWeight: 600 }}>
          By Cherry
        </span>
        <IconLeafSmall size={16} color="var(--cherry-sage-light)" />
      </div>

      <nav aria-label="页尾导航" style={{ display: "flex", justifyContent: "center", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.85rem" }}>
        {footerLinks.map((link) => (
          <a
            className="footer-link"
            key={link.href}
            href={`/${link.href}`}
            onClick={(event) => navigateHomeSection(link.href, event)}
            style={{
              color: "rgba(245,241,234,0.84)",
              textDecoration: "none",
              border: "1px solid rgba(245,241,234,0.18)",
              background: "rgba(250,247,241,0.07)",
              borderRadius: 999,
              padding: "0.26rem 0.72rem",
              fontSize: "0.78rem",
              fontWeight: 800,
              transition: "background 0.18s ease, color 0.18s ease, border-color 0.18s ease",
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div aria-hidden="true" style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
        <svg width="132" height="28" viewBox="0 0 132 28" fill="none" focusable="false">
          <path d="M22 15 C36 5 50 24 64 14 C78 5 91 23 108 13" stroke="rgba(245,241,234,0.28)" strokeWidth="3" strokeLinecap="round" />
          <circle cx="18" cy="15" r="5" fill="#F2A896" opacity="0.86" />
          <circle cx="112" cy="13" r="5" fill="var(--cherry-sage-light)" opacity="0.76" />
          <path d="M61 7 L65 13 L72 15 L66 19 L64 26 L60 20 L53 17 L59 13Z" fill="var(--cherry-yellow)" opacity="0.82" />
        </svg>
      </div>

      <p style={{ fontSize: "0.8rem", margin: 0 }}>
        科学学习和 AI 主题作品 · © 2026 By Cherry
      </p>
      <style>
        {`
          footer .footer-link:hover,
          footer .footer-link:focus-visible {
            color: #FAF7F1 !important;
            background: rgba(250,247,241,0.14) !important;
            border-color: rgba(245,241,234,0.36) !important;
          }

          footer .footer-link:focus-visible {
            outline: 3px solid #F2A896;
            outline-offset: 4px;
          }

          @media (prefers-reduced-motion: reduce) {
            footer .footer-link {
              transition: none !important;
            }
          }
        `}
      </style>
    </footer>
  );
}
