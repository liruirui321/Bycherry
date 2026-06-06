import { IconCherry } from "./Icons";
import { navigateClient, shouldUseClientNavigation } from "../navigation";

export function Nav() {
  return (
    <nav
      style={{
        fontFamily: "'Nunito', sans-serif",
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(245,241,234,0.92)",
        backdropFilter: "blur(14px)",
        borderBottom: "1.5px solid var(--border)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 1.5rem",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 50,
          position: "relative",
        }}
      >
        <a
          className="nav-logo"
          href="/#works"
          onClick={(event) => {
            if (!shouldUseClientNavigation(event)) return;
            event.preventDefault();
            navigateClient("/#works");
          }}
          style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
        >
          <IconCherry size={24} />
          <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--cherry-warm-brown)", letterSpacing: 0 }}>
            By Cherry
          </span>
        </a>
      </div>

      <style>
        {`
          nav .nav-logo:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          @media (max-width: 860px) {
            nav > div {
	              height: 48px !important;
              padding-left: 1rem !important;
              padding-right: 1rem !important;
              gap: 0.55rem !important;
            }

            nav .nav-logo {
              gap: 6px !important;
            }

            nav .nav-logo span {
	              font-size: 1rem !important;
            }

            nav .nav-logo svg {
	              width: 22px !important;
	              height: 22px !important;
            }
          }
        `}
      </style>
    </nav>
  );
}
