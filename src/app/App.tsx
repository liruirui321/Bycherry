import { useEffect, useMemo, useRef, useState } from "react";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Works } from "./components/Works";
import { WorkDetailPage } from "./components/WorkDetailPage";
import { ArticleDetailPage } from "./components/ArticleDetailPage";
import { ResearchEssays } from "./components/ResearchEssays";
import { essays } from "./components/ResearchEssays";
import { Notes } from "./components/Notes";
import { notes } from "./components/Notes";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { works } from "./components/Works";
import { navigateClient, shouldUseClientNavigation } from "./navigation";

const siteTitle = "By Cherry";
const homeTitle = "科学、课程与 AI";
const defaultDescription = "By Cherry 是一个可爱插画风的个人网站，收录科学教育、AI 学习工具、项目制课程和创作工作流。";
const siteUrl = "https://bycherry.me";
const socialImageUrl = `${siteUrl}/social-preview.png`;

function upsertMeta(selector: string, attributes: Record<string, string>, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function setOptionalMeta(selector: string, attributes: Record<string, string>, content: string | null) {
  if (content) {
    upsertMeta(selector, attributes, content);
    return;
  }

  document.head.querySelector(selector)?.remove();
}

function upsertCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", url);
}

function upsertJsonLd(data: Record<string, unknown>) {
  let element = document.head.querySelector<HTMLScriptElement>('script[data-schema="bycherry-page"]');
  if (!element) {
    element = document.createElement("script");
    element.type = "application/ld+json";
    element.dataset.schema = "bycherry-page";
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data);
}

function getScrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

function focusPageTarget(element: HTMLElement | null) {
  if (!element) return;
  const hadTabIndex = element.hasAttribute("tabindex");
  if (!hadTabIndex) element.setAttribute("tabindex", "-1");
  element.focus({ preventScroll: true });
  if (!hadTabIndex) {
    element.addEventListener("blur", () => element.removeAttribute("tabindex"), { once: true });
  }
}

function getLocationKey() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function readRedirectPath() {
  try {
    return sessionStorage.getItem("bycherry-redirect-path");
  } catch {
    return null;
  }
}

function clearRedirectPath() {
  try {
    sessionStorage.removeItem("bycherry-redirect-path");
  } catch {
    // Storage can be unavailable in some privacy modes; route normally.
  }
}

function NotFoundPage() {
  return (
    <main id="main-content" tabIndex={-1} style={{ minHeight: "58vh", padding: "5rem 1.5rem", display: "grid", placeItems: "center", fontFamily: "'Nunito', sans-serif" }}>
      <section style={{ maxWidth: 620, textAlign: "center", background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "2rem", boxShadow: "5px 8px 0px rgba(94,68,42,0.08)" }}>
        <div style={{ fontFamily: "'Caveat', cursive", color: "var(--cherry-red)", fontSize: "1.15rem", fontWeight: 900, marginBottom: "0.5rem" }}>404</div>
        <h1 style={{ color: "var(--cherry-warm-brown)", fontSize: "clamp(1.55rem, 4vw, 2.1rem)", fontWeight: 900, lineHeight: 1.25, marginBottom: "0.7rem" }}>
          没有找到这个页面
        </h1>
        <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.75, fontSize: "0.95rem", marginBottom: "1.3rem" }}>
          这个地址可能写错了，或者内容已经移动。可以回到首页继续打开作品、笔记和科研随笔。
        </p>
        <a
          href="/#top"
          onClick={(event) => {
            if (!shouldUseClientNavigation(event)) return;
            event.preventDefault();
            navigateClient("/#top");
          }}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--cherry-forest)", color: "#FAF7F1", borderRadius: 999, padding: "0.62rem 1.1rem", textDecoration: "none", fontWeight: 900, boxShadow: "3px 5px 0px rgba(58,92,62,0.22)" }}
        >
          回到首页
        </a>
      </section>
    </main>
  );
}

export default function App() {
  const [locationKey, setLocationKey] = useState(getLocationKey());
  const hasNavigated = useRef(false);
  const detailSlug = useMemo(() => {
    const match = window.location.pathname.match(/^\/works\/([^/]+)\/?$/);
    return match?.[1] ?? null;
  }, [locationKey]);
  const noteSlug = useMemo(() => {
    const match = window.location.pathname.match(/^\/notes\/([^/]+)\/?$/);
    return match?.[1] ?? null;
  }, [locationKey]);
  const researchSlug = useMemo(() => {
    const match = window.location.pathname.match(/^\/research\/([^/]+)\/?$/);
    return match?.[1] ?? null;
  }, [locationKey]);
  const unknownPath = useMemo(() => window.location.pathname !== "/" && !detailSlug && !noteSlug && !researchSlug, [detailSlug, noteSlug, researchSlug, locationKey]);

  useEffect(() => {
    function handleLocationChange() {
      setLocationKey(getLocationKey());
    }

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  useEffect(() => {
    const redirectPath = readRedirectPath();
    if (!redirectPath?.startsWith("/")) return;

    clearRedirectPath();
    if (redirectPath === getLocationKey()) return;

    window.history.replaceState(null, "", redirectPath);
    setLocationKey(getLocationKey());
  }, []);

  useEffect(() => {
    const shouldMoveFocus = hasNavigated.current;
    hasNavigated.current = true;

    if (detailSlug || noteSlug || researchSlug || unknownPath) {
      window.scrollTo({ top: 0, behavior: getScrollBehavior() });
      if (shouldMoveFocus) {
        window.requestAnimationFrame(() => focusPageTarget(document.getElementById("main-content")));
      }
      return;
    }

    const id = window.location.hash.replace("#", "");
    if (!id) return;

    window.requestAnimationFrame(() => {
      const target = document.getElementById(id);
      target?.scrollIntoView({ behavior: getScrollBehavior(), block: "start" });
      if (shouldMoveFocus) focusPageTarget(target);
    });
  }, [detailSlug, noteSlug, researchSlug, unknownPath, locationKey]);

  useEffect(() => {
    const work = detailSlug ? works.find((item) => item.slug === detailSlug) : null;
    const note = noteSlug ? notes.find((item) => item.slug === noteSlug) : null;
    const essay = researchSlug ? essays.find((item) => item.slug === researchSlug) : null;
    const missingRoutedItem = Boolean((detailSlug && !work) || (noteSlug && !note) || (researchSlug && !essay));
    const notFound = unknownPath || missingRoutedItem;
    const title = notFound ? "没有找到页面" : work?.title ?? note?.title ?? essay?.title ?? homeTitle;
    const description = notFound ? "这个地址没有对应的 By Cherry 页面，可以回到首页继续浏览作品、笔记和科研随笔。" : work?.desc ?? note?.excerpt ?? essay?.body ?? defaultDescription;
    const isArticle = Boolean(note || essay);
    const publishedDate = note?.date ?? essay?.date ?? null;
    const workUpdatedDate = work?.updated ?? null;
    const keywords = work?.tags.join(", ") ?? essay?.tags.join(", ") ?? note?.tag ?? null;
    const fullTitle = title === homeTitle ? `${siteTitle} | ${title}` : `${title} | ${siteTitle}`;
    const canonicalPath = window.location.pathname === "/" ? "/" : window.location.pathname.replace(/\/$/, "");
    const canonicalUrl = `${siteUrl}${canonicalPath}`;
    const jsonLdBase = {
      publisher: {
        "@type": "Person",
        name: "Cherry",
        url: siteUrl,
      },
      url: canonicalUrl,
      name: title,
      description,
    };
    const jsonLd = notFound
      ? {
          "@context": "https://schema.org",
          "@type": "WebPage",
          ...jsonLdBase,
        }
      : work
      ? {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          ...jsonLdBase,
          genre: work.category,
          keywords: work.tags.join(", "),
        }
      : note || essay
        ? {
            "@context": "https://schema.org",
            "@type": "Article",
            ...jsonLdBase,
            headline: title,
            datePublished: note?.date ?? essay?.date,
            author: {
              "@type": "Person",
              name: "Cherry",
              url: siteUrl,
            },
            keywords: essay?.tags?.join(", ") ?? note?.tag,
          }
        : {
            "@context": "https://schema.org",
            "@type": "WebSite",
            ...jsonLdBase,
            alternateName: "Bycherry",
          };

    document.title = fullTitle;
    upsertMeta('meta[name="description"]', { name: "description" }, description);
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, fullTitle);
    upsertMeta('meta[property="og:description"]', { property: "og:description" }, description);
    upsertMeta('meta[property="og:type"]', { property: "og:type" }, isArticle ? "article" : "website");
    upsertMeta('meta[property="og:locale"]', { property: "og:locale" }, "zh_CN");
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name" }, siteTitle);
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    upsertMeta('meta[property="og:image"]', { property: "og:image" }, socialImageUrl);
    upsertMeta('meta[property="og:image:width"]', { property: "og:image:width" }, "1200");
    upsertMeta('meta[property="og:image:height"]', { property: "og:image:height" }, "630");
    upsertMeta('meta[property="og:image:type"]', { property: "og:image:type" }, "image/png");
    upsertMeta('meta[property="og:image:alt"]', { property: "og:image:alt" }, "By Cherry 科学、课程与 AI 作品集预览图");
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, fullTitle);
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image" }, socialImageUrl);
    upsertMeta('meta[name="twitter:image:alt"]', { name: "twitter:image:alt" }, "By Cherry 科学、课程与 AI 作品集预览图");
    upsertMeta('meta[name="robots"]', { name: "robots" }, notFound ? "noindex" : "index, follow");
    setOptionalMeta('meta[property="article:published_time"]', { property: "article:published_time" }, isArticle ? publishedDate : null);
    setOptionalMeta('meta[property="article:modified_time"]', { property: "article:modified_time" }, isArticle ? publishedDate : null);
    setOptionalMeta('meta[property="article:tag"]', { property: "article:tag" }, isArticle ? keywords : null);
    setOptionalMeta('meta[property="og:updated_time"]', { property: "og:updated_time" }, workUpdatedDate);
    setOptionalMeta('meta[name="keywords"]', { name: "keywords" }, keywords);
    upsertCanonical(canonicalUrl);
    upsertJsonLd(jsonLd);
  }, [detailSlug, noteSlug, researchSlug, unknownPath, locationKey]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <a className="skip-link" href="#main-content">
        跳到正文
      </a>
      <Nav />
      {detailSlug ? (
        <WorkDetailPage slug={detailSlug} />
      ) : noteSlug ? (
        <ArticleDetailPage kind="note" slug={noteSlug} />
      ) : researchSlug ? (
        <ArticleDetailPage kind="research" slug={researchSlug} />
      ) : unknownPath ? (
        <NotFoundPage />
      ) : (
        <main id="main-content" tabIndex={-1}>
          <Hero />
          <Works />
          <About />
          <ResearchEssays />
          <Notes />
          <Contact />
        </main>
      )}
      <Footer />
    </div>
  );
}
