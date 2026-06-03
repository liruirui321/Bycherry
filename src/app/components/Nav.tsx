import { useEffect, useState } from "react";
import { IconCherry, IconMenu, IconClose } from "./Icons";
import { navigateClient, shouldUseClientNavigation } from "../navigation";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [locationKey, setLocationKey] = useState(`${window.location.pathname}${window.location.hash}`);

  const links = [
    { label: "作品", href: "/#works" },
    { label: "小工具", href: "/works/gene-expression" },
    { label: "科研", href: "/#research" },
    { label: "笔记", href: "/#notes" },
    { label: "关于", href: "/#about" },
    { label: "联系", href: "/#contact" },
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

  useEffect(() => {
    function handleLocationChange() {
      setLocationKey(`${window.location.pathname}${window.location.hash}`);
    }

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  function isActiveLink(href: string) {
    const { pathname, hash } = window.location;
    if (href === "/works/gene-expression") return pathname === href;
    if (pathname.startsWith("/works/")) return href === "/#works";
    if (pathname.startsWith("/notes/")) return href === "/#notes";
    if (pathname.startsWith("/research/")) return href === "/#research";
    return pathname === "/" && href === `/${hash || "#top"}`;
  }

  function desktopLinkStyle(active: boolean): React.CSSProperties {
    return {
      textDecoration: "none",
      color: active ? "var(--cherry-red)" : "var(--cherry-warm-mid)",
      fontSize: "0.92rem",
      fontWeight: active ? 900 : 600,
      transition: "color 0.2s, background 0.2s",
      background: active ? "rgba(232,144,124,0.16)" : "transparent",
      borderRadius: 999,
      padding: "0.28rem 0.58rem",
    };
  }

  function mobileLinkStyle(active: boolean): React.CSSProperties {
    return {
      textDecoration: "none",
      color: active ? "var(--cherry-red)" : "var(--cherry-warm-brown)",
      fontSize: "1rem",
      fontWeight: active ? 900 : 600,
      background: active ? "rgba(232,144,124,0.14)" : "transparent",
      borderRadius: 12,
      padding: "0.35rem 0.5rem",
    };
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
        <div className="hidden sm:flex" style={{ gap: "0.75rem", alignItems: "center" }}>
          {links.map((l) => {
            const active = isActiveLink(l.href);
            return (
              <a
                key={`${l.label}-${locationKey}`}
                href={l.href}
                aria-current={active ? "page" : undefined}
                onClick={(event) => {
                  if (!shouldUseClientNavigation(event)) return;
                  event.preventDefault();
                  navigate(l.href);
                }}
                style={desktopLinkStyle(active)}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--cherry-red)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = active ? "var(--cherry-red)" : "var(--cherry-warm-mid)")}
              >
                {l.label}
              </a>
            );
          })}
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
          {links.map((l) => {
            const active = isActiveLink(l.href);
            return (
              <a
                key={`${l.label}-${locationKey}`}
                href={l.href}
                aria-current={active ? "page" : undefined}
                onClick={(event) => {
                  if (!shouldUseClientNavigation(event)) return;
                  event.preventDefault();
                  setOpen(false);
                  navigate(l.href);
                }}
                style={mobileLinkStyle(active)}
              >
                {l.label}
              </a>
            );
          })}
        </div>
      )}
    </nav>
  );
}
