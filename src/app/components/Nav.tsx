import { useEffect, useRef, useState } from "react";
import { IconCherry, IconMenu, IconClose } from "./Icons";
import { navigateClient, shouldUseClientNavigation } from "../navigation";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [locationKey, setLocationKey] = useState(`${window.location.pathname}${window.location.hash}`);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement | null>(null);

  const links = [
    { label: "主题作品", href: "/#works" },
    { label: "科学模拟", href: "/works/gene-expression" },
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
      setOpen(false);
    }

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => firstMobileLinkRef.current?.focus());

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      window.requestAnimationFrame(() => toggleRef.current?.focus());
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function isActiveLink(href: string) {
    const { pathname, hash } = window.location;
    if (pathname === "/works/gene-expression") return href === "/works/gene-expression";
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
          width: "100%",
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 1.5rem",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 62,
          position: "relative",
        }}
      >
        {/* Logo */}
        <a
          className="nav-logo"
          href="/#top"
          onClick={(event) => {
            if (!shouldUseClientNavigation(event)) return;
            event.preventDefault();
            navigate("#top");
          }}
          style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
        >
          <IconCherry size={28} />
          <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--cherry-warm-brown)", letterSpacing: 0.3 }}>
            By Cherry
          </span>
        </a>

        {/* Desktop links */}
        <div className="nav-desktop-links" style={{ gap: "0.75rem", alignItems: "center" }}>
          {links.map((l) => {
            const active = isActiveLink(l.href);
            return (
              <a
                className="nav-link"
                key={l.label}
                href={l.href}
                aria-current={active ? "page" : undefined}
                onClick={(event) => {
                  if (!shouldUseClientNavigation(event)) return;
                  event.preventDefault();
                  navigate(l.href);
                }}
                style={desktopLinkStyle(active)}
              >
                {l.label}
              </a>
            );
          })}
        </div>

        {/* Mobile toggle */}
        <button
          ref={toggleRef}
          type="button"
          className="nav-mobile-toggle"
          onClick={() => setOpen(!open)}
          style={{
            position: "absolute",
            right: "1.5rem",
            top: "50%",
            transform: "translateY(-50%)",
            width: 38,
            height: 38,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label={open ? "关闭菜单" : "打开菜单"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <IconClose size={22} /> : <IconMenu size={22} />}
        </button>
      </div>

      {open && (
        <div id="mobile-navigation" role="navigation" aria-label="移动端导航菜单" style={{ background: "var(--cherry-cream)", borderTop: "1.5px solid var(--border)", padding: "1rem 1.5rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "calc(100vh - 62px)", overflowY: "auto" }}>
          {links.map((l, index) => {
            const active = isActiveLink(l.href);
            return (
              <a
                ref={index === 0 ? firstMobileLinkRef : undefined}
                className="mobile-nav-link"
                key={l.label}
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

      <style>
        {`
          nav .nav-logo:focus-visible,
          nav .nav-link:focus-visible,
          nav .mobile-nav-link:focus-visible,
          nav button:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          nav .nav-link:hover,
          nav .nav-link:focus-visible {
            color: var(--cherry-red) !important;
          }

          nav .mobile-nav-link:hover,
          nav .mobile-nav-link:focus-visible {
            color: var(--cherry-red) !important;
            background: rgba(232,144,124,0.14) !important;
          }

          nav .nav-desktop-links {
            display: none;
          }

          nav .nav-mobile-toggle {
            display: inline-flex;
          }

          @media (min-width: 900px) {
            nav .nav-desktop-links {
              display: flex;
            }

            nav .nav-mobile-toggle {
              display: none !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            nav .nav-link,
            nav .mobile-nav-link {
              transition: none !important;
            }
          }
        `}
      </style>
    </nav>
  );
}
