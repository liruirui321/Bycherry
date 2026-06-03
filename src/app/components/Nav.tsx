import { useState } from "react";
import { IconCherry, IconMenu, IconClose } from "./Icons";
import { navigateClient, shouldUseClientNavigation } from "../navigation";

export function Nav() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "作品", href: "#works" },
    { label: "小工具", href: "/works/gene-expression" },
    { label: "科研", href: "#research" },
    { label: "笔记", href: "#notes" },
    { label: "关于", href: "#about" },
    { label: "联系", href: "#contact" },
  ];

  function navigate(href: string) {
    if (href.startsWith("/")) {
      navigateClient(href);
      return;
    }

    if (window.location.pathname !== "/") {
      navigateClient(`/${href}`);
      return;
    }

    window.location.hash = href;
  }

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
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 62,
        }}
      >
        {/* Logo */}
        <a
          href="/#top"
          onClick={(event) => {
            if (!shouldUseClientNavigation(event)) return;
            event.preventDefault();
            navigate("#top");
          }}
          style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
        >
          <IconCherry size={28} />
          <span style={{ fontFamily: "'Caveat', cursive", fontSize: "1.25rem", fontWeight: 700, color: "var(--cherry-warm-brown)", letterSpacing: 0.3 }}>
            By Cherry
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden sm:flex" style={{ gap: "2rem", alignItems: "center" }}>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={(event) => {
                if (!shouldUseClientNavigation(event)) return;
                event.preventDefault();
                navigate(l.href);
              }}
              style={{ textDecoration: "none", color: "var(--cherry-warm-mid)", fontSize: "0.92rem", fontWeight: 600, transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--cherry-red)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--cherry-warm-mid)")}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="sm:hidden"
          onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}
          aria-label="菜单"
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <IconClose size={22} /> : <IconMenu size={22} />}
        </button>
      </div>

      {open && (
        <div id="mobile-navigation" style={{ background: "var(--cherry-cream)", borderTop: "1.5px solid var(--border)", padding: "1rem 1.5rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={(event) => {
                if (!shouldUseClientNavigation(event)) return;
                event.preventDefault();
                setOpen(false);
                navigate(l.href);
              }}
              style={{ textDecoration: "none", color: "var(--cherry-warm-brown)", fontSize: "1rem", fontWeight: 600 }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
