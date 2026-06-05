import { IconCherry, IconLeafSmall } from "./Icons";
import { navigateHomeSection } from "../navigation";

const footerLinks = [
  { label: "学习模块", href: "#works" },
  { label: "证据库", href: "#research" },
  { label: "方法库", href: "#notes" },
  { label: "联系", href: "#contact" },
];

const externalLinks = [
  { label: "GitHub", href: "https://github.com/liruirui321" },
  { label: "Email", href: "mailto:liruirui321@gmail.com" },
];

export function Footer() {
  return (
    <footer
      style={{
        fontFamily: "'Nunito', sans-serif",
        background: "var(--cherry-forest)",
        color: "rgba(245,241,234,0.7)",
        padding: "1.45rem 1.5rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg style={{ position: "absolute", top: 10, left: 20, opacity: 0.12, pointerEvents: "none" }} width="50" height="55" viewBox="0 0 60 60" fill="none" aria-hidden="true" focusable="false">
        <path d="M8 55 Q12 34 50 10 Q50 38 8 55Z" fill="white" />
      </svg>
      <svg style={{ position: "absolute", bottom: 8, right: 24, opacity: 0.1, pointerEvents: "none", transform: "scaleX(-1)" }} width="44" height="48" viewBox="0 0 60 60" fill="none" aria-hidden="true" focusable="false">
        <path d="M8 55 Q12 34 50 10 Q50 38 8 55Z" fill="white" />
      </svg>

      <div style={{ position: "relative", zIndex: 1, display: "grid", gap: "0.72rem", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <IconCherry size={20} color="#F2A896" />
          <span style={{ fontSize: "1rem", color: "rgba(245,241,234,0.92)", fontWeight: 800 }}>
            By Cherry
          </span>
          <IconLeafSmall size={16} color="var(--cherry-sage-light)" />
        </div>

        <nav aria-label="页尾导航" style={{ display: "flex", justifyContent: "center", gap: "0.45rem", flexWrap: "wrap" }}>
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

        <div style={{ display: "flex", justifyContent: "center", gap: "0.45rem", flexWrap: "wrap" }}>
          {externalLinks.map((link) => (
            <a
              className="footer-link"
              key={link.href}
              href={link.href}
              target={link.href.startsWith("https://") ? "_blank" : undefined}
              rel={link.href.startsWith("https://") ? "noreferrer" : undefined}
              style={{
                color: "rgba(245,241,234,0.8)",
                textDecoration: "none",
                border: "1px solid rgba(245,241,234,0.16)",
                background: "rgba(250,247,241,0.05)",
                borderRadius: 999,
                padding: "0.22rem 0.62rem",
                fontSize: "0.74rem",
                fontWeight: 800,
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <p style={{ color: "rgba(245,241,234,0.74)", fontSize: "0.78rem", lineHeight: 1.55, margin: 0 }}>
          科学学习和 AI 学习模块 · bycherry.me · © 2026 By Cherry
        </p>
      </div>

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
