import { IconCherry } from "./Icons";

const externalLinks = [
  { label: "GitHub", href: "https://github.com/liruirui321" },
  { label: "Email", href: "mailto:liruirui321@gmail.com" },
];

export function Footer() {
  return (
    <footer
      id="contact"
      style={{
        fontFamily: "'Nunito', sans-serif",
        background: "var(--cherry-forest)",
        color: "rgba(245,241,234,0.72)",
        padding: "1rem 1.5rem",
      }}
    >
      <div className="footer-inner" style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap", minWidth: 0 }}>
        <div className="footer-brand" style={{ display: "inline-flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <IconCherry size={18} color="#F2A896" />
          <span style={{ color: "rgba(245,241,234,0.92)", fontSize: "0.86rem", fontWeight: 900 }}>By Cherry</span>
          <span style={{ color: "rgba(245,241,234,0.6)", fontSize: "0.76rem", fontWeight: 800 }}>科学学习与 AI · 2026</span>
        </div>

        <div className="footer-links" style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", minWidth: 0 }}>
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

          @media (max-width: 560px) {
            footer {
              padding: 0.9rem 1rem !important;
            }

            footer .footer-inner {
              display: grid !important;
              grid-template-columns: 1fr !important;
              justify-items: start !important;
              gap: 0.62rem !important;
              width: 100% !important;
              max-width: calc(100vw - 2rem) !important;
            }

            footer .footer-brand {
              display: grid !important;
              grid-template-columns: auto minmax(0, auto) minmax(0, 1fr) !important;
              max-width: 100% !important;
            }

            footer .footer-brand span {
              overflow-wrap: anywhere;
            }

            footer .footer-links {
              justify-content: flex-start !important;
              max-width: 100% !important;
            }
          }
        `}
      </style>
    </footer>
  );
}
