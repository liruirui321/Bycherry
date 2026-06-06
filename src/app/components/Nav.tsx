import type { MouseEvent } from "react";
import { IconCherry } from "./Icons";
import { navigateClient, shouldUseClientNavigation } from "../navigation";

export function Nav() {
  const menuItems = [
    { label: "精选", href: "/#works" },
    { label: "科学模拟", href: "/works/gene-expression" },
    { label: "AI 工具", href: "/works/concept-explainer" },
    { label: "笔记", href: "/reading" },
  ];

  function openMenuItem(href: string, event: MouseEvent<HTMLAnchorElement>) {
    if (!shouldUseClientNavigation(event)) return;
    event.preventDefault();
    navigateClient(href);
  }

  return (
    <nav
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(247,245,239,0.94)",
        backdropFilter: "blur(14px)",
        borderBottom: "1.5px solid var(--border)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1320,
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
          <span style={{ fontSize: "1rem", fontWeight: 780, color: "var(--cherry-warm-brown)", letterSpacing: 0 }}>
            By Cherry
          </span>
        </a>
        <div className="nav-menu" role="group" aria-label="主要内容入口" style={{ display: "flex", alignItems: "center", gap: "1.4rem" }}>
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => openMenuItem(item.href, event)}
              style={{ color: "var(--cherry-warm-brown)", textDecoration: "none", fontSize: "0.86rem", fontWeight: 820, whiteSpace: "nowrap" }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <style>
        {`
          nav .nav-logo:focus-visible,
          nav .nav-menu a:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          nav .nav-menu a {
            transition: color 0.18s ease;
          }

          nav .nav-menu a:hover,
          nav .nav-menu a:focus-visible {
            color: var(--cherry-forest) !important;
          }

          @media (max-width: 860px) {
            nav > div {
	              height: 48px !important;
              padding-left: 1rem !important;
              padding-right: 1rem !important;
              gap: 0.55rem !important;
            }

            nav .nav-menu {
              gap: 0.78rem !important;
              max-width: 58vw !important;
              overflow: hidden !important;
            }

            nav .nav-menu a {
              font-size: 0.76rem !important;
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

          @media (max-width: 560px) {
            nav .nav-menu {
              display: none !important;
            }
          }
        `}
      </style>
    </nav>
  );
}
