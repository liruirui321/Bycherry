import { useEffect, useState } from "react";
import { IconCherry } from "./Icons";
import { navigateClient, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";

export function Nav() {
  const [locationKey, setLocationKey] = useState(`${window.location.pathname}${window.location.hash}`);

  const links = [
    { label: "内容", href: "/#works", matchHashes: ["#works", "#top"] },
    { label: "文章", href: "/#research", matchHashes: ["#research"] },
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

  function isActiveLink(link: (typeof links)[number]) {
    const { pathname, hash } = window.location;
    if ("matchHashes" in link && pathname === "/" && link.matchHashes.includes(hash || "#top")) return true;
    if (pathname.startsWith("/notes/") || pathname.startsWith("/research/")) return link.href === "/#research";
    if (pathname.startsWith("/works/")) return link.href === "/#works";
    return pathname === "/" && link.href === `/${hash || "#top"}`;
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

        <div className="nav-links" style={{ position: "fixed", top: 18, left: "max(9.2rem, calc((100vw - 1100px) / 2 + 9.2rem))", zIndex: 80, display: "flex", gap: "0.75rem", alignItems: "center", justifyContent: "flex-start", minWidth: 0 }}>
          {links.map((l) => {
            const active = isActiveLink(l);
            return (
              <a
                className="nav-link"
                key={l.label}
                href={l.href}
                aria-current={active ? "page" : undefined}
                onMouseEnter={() => preloadRouteForHref(l.href)}
                onFocus={() => preloadRouteForHref(l.href)}
                onPointerDown={() => preloadRouteForHref(l.href)}
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
      </div>

      <style>
        {`
          nav .nav-logo:focus-visible,
          nav .nav-link:focus-visible,
          nav button:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          nav .nav-link:hover,
          nav .nav-link:focus-visible {
            color: var(--cherry-red) !important;
          }

          @media (max-width: 860px) {
            nav > div {
              height: 56px !important;
              padding-left: 1rem !important;
              padding-right: 1rem !important;
              gap: 0.55rem !important;
            }

            nav .nav-logo {
              gap: 6px !important;
            }

            nav .nav-logo span {
              font-size: 1.08rem !important;
            }

            nav .nav-logo svg {
              width: 24px !important;
              height: 24px !important;
            }

            nav .nav-links {
              top: 14px !important;
              left: 8.5rem !important;
              gap: 0.28rem !important;
            }

            nav .nav-link {
              font-size: 0.72rem !important;
              padding: 0.2rem 0.32rem !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            nav .nav-link {
              transition: none !important;
              transform: none !important;
            }
          }
        `}
      </style>
    </nav>
  );
}
