import { useEffect, useRef, useState } from "react";
import { IconCherry, IconMenu, IconClose } from "./Icons";
import { works } from "./Works";
import { notes } from "./Notes";
import { essays } from "./ResearchEssays";
import { copyText } from "../clipboard";
import { getWorkToolHref, navigateClient, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [locationKey, setLocationKey] = useState(`${window.location.pathname}${window.location.hash}`);
  const [copiedRouteGuide, setCopiedRouteGuide] = useState(false);
  const [routeGuideStatus, setRouteGuideStatus] = useState("");
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement | null>(null);

  const links = [
    { label: "看生命过程", href: getWorkToolHref("/works/gene-expression"), matchHref: "/works/gene-expression" },
    { label: "拆概念", href: getWorkToolHref("/works/concept-explainer"), matchHref: "/works/concept-explainer" },
    { label: "整理科研", href: getWorkToolHref("/works/research-prompt-kit"), matchHref: "/works/research-prompt-kit" },
    { label: "更多工具", href: "/#works" },
    { label: "读证据", href: "/#research" },
    { label: "学方法", href: "/#notes" },
    { label: "联系", href: "/#contact" },
  ];
  const currentPath = locationKey.split("#")[0] || "/";
  const currentWork = works.find((work) => work.href === currentPath);
  const articleLibrary = [...notes, ...essays];
  const currentArticle = articleLibrary.find((article) => article.href === currentPath);
  const currentHomeSection = locationKey.includes("#") ? locationKey.slice(locationKey.indexOf("#")) : "#top";
  const currentRouteGuideText = currentWork
    ? `【当前位置学习路径】
页面：${currentWork.title}
入口：${getWorkToolHref(currentWork.href)}
类型：学习模块

先做这个
${currentWork.starter}

任务
${currentWork.task}

可保存产出
${currentWork.outputs.join(" / ")}

完成标准
${currentWork.success}

下一步
1. 在页面内复制记录、报告或学习卡。
2. 回到配套阅读或首页继续选一个相关入口。`
    : currentArticle
      ? `【当前位置学习路径】
页面：${currentArticle.title}
入口：${currentArticle.href}
类型：${"tag" in currentArticle ? currentArticle.tag : currentArticle.label}

先做这个
${currentArticle.actionSteps[0]}

完成后检查
${currentArticle.checklist[0]}

可保存产出
${currentArticle.starterTemplate[0]}

下一步
1. 复制文章里的阅读任务包或学习记录。
2. 打开配套模块继续操作。`
      : `【当前位置学习路径】
页面：By Cherry 首页 ${currentHomeSection}
入口：/
类型：学习工作台

先做这个
按目标选一个入口，不同时展开多个方向。

可选入口
${links.slice(0, 6).map((link, index) => `${index + 1}. ${link.label}：${link.href}`).join("\n")}

完成标准
打开一个模块，完成页面里的首步任务，并保存一份产出。

下一步
复制首页 30 分钟学习路径、工作台开始清单或页尾继续学习清单。`;

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

  async function copyCurrentRouteGuide() {
    const copiedToClipboard = await copyText(currentRouteGuideText);
    if (copiedToClipboard) {
      setCopiedRouteGuide(true);
      setRouteGuideStatus("当前位置学习路径已复制。");
      window.setTimeout(() => setCopiedRouteGuide(false), 1400);
      return;
    }

    setCopiedRouteGuide(false);
    setRouteGuideStatus("复制失败，请手动复制当前位置学习路径。");
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

  function isActiveLink(link: (typeof links)[number]) {
    const { pathname, hash } = window.location;
    if ("matchHref" in link && pathname === link.matchHref) return true;
    if (pathname.startsWith("/works/")) return link.href === "/#works";
    if (pathname.startsWith("/notes/")) return link.href === "/#notes";
    if (pathname.startsWith("/research/")) return link.href === "/#research";
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
          <button
            type="button"
            className="nav-route-guide-button"
            onClick={copyCurrentRouteGuide}
            aria-describedby="nav-route-guide-status"
            style={{
              background: copiedRouteGuide ? "var(--cherry-sage-light)" : "var(--cherry-forest)",
              color: copiedRouteGuide ? "var(--cherry-forest)" : "#FAF7F1",
              border: copiedRouteGuide ? "1.5px solid var(--cherry-sage)" : "none",
              borderRadius: 999,
              padding: "0.34rem 0.68rem",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 900,
              fontSize: "0.78rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {copiedRouteGuide ? "已复制" : "复制路径"}
          </button>
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
            const active = isActiveLink(l);
            return (
              <a
                ref={index === 0 ? firstMobileLinkRef : undefined}
                className="mobile-nav-link"
                key={l.label}
                href={l.href}
                aria-current={active ? "page" : undefined}
                onFocus={() => preloadRouteForHref(l.href)}
                onPointerDown={() => preloadRouteForHref(l.href)}
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
          <button
            type="button"
            className="nav-route-guide-button"
            onClick={copyCurrentRouteGuide}
            aria-describedby="nav-route-guide-status"
            style={{
              background: copiedRouteGuide ? "var(--cherry-sage-light)" : "var(--cherry-forest)",
              color: copiedRouteGuide ? "var(--cherry-forest)" : "#FAF7F1",
              border: copiedRouteGuide ? "1.5px solid var(--cherry-sage)" : "none",
              borderRadius: 12,
              padding: "0.58rem 0.75rem",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 900,
              fontSize: "0.9rem",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            {copiedRouteGuide ? "已复制当前位置路径" : "复制当前位置学习路径"}
          </button>
        </div>
      )}
      <div id="nav-route-guide-status" role="status" aria-live="polite" style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0 }}>
        {routeGuideStatus}
      </div>

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

          nav .nav-route-guide-button:hover,
          nav .nav-route-guide-button:focus-visible {
            transform: translateY(-1px);
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
            nav .mobile-nav-link,
            nav .nav-route-guide-button {
              transition: none !important;
              transform: none !important;
            }
          }
        `}
      </style>
    </nav>
  );
}
