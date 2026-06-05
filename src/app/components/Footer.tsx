import { IconCherry } from "./Icons";

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
        color: "rgba(245,241,234,0.72)",
        padding: "1rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <IconCherry size={18} color="#F2A896" />
          <span style={{ color: "rgba(245,241,234,0.92)", fontSize: "0.86rem", fontWeight: 900 }}>By Cherry</span>
          <span style={{ color: "rgba(245,241,234,0.6)", fontSize: "0.76rem", fontWeight: 800 }}>科学学习与 AI · 2026</span>
        </div>

        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
          {externalLinks.map((link) => (
            <a
              className="footer-link"
              key={link.href}
              href={link.href}
              target={link.href.startsWith("https://") ? "_blank" : undefined}
              rel={link.href.startsWith("https://") ? "noreferrer" : undefined}
              style={{
                color: "rgba(245,241,234,0.84)",
                textDecoration: "none",
                border: "1px solid rgba(245,241,234,0.18)",
                background: "rgba(250,247,241,0.06)",
                borderRadius: 999,
                padding: "0.24rem 0.62rem",
                fontSize: "0.74rem",
                fontWeight: 900,
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
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
        `}
      </style>
    </footer>
  );
}
