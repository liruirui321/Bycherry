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

const siteTitle = "By Cherry";
const homeTitle = "科学、课程与 AI";
const defaultDescription = "By Cherry 是一个可爱插画风的个人网站，收录科学教育、AI 学习工具、项目制课程和创作工作流。";
const siteUrl = "https://bycherry.me";

function upsertMeta(selector: string, attributes: Record<string, string>, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
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

export default function App() {
  const [locationKey, setLocationKey] = useState(`${window.location.pathname}${window.location.hash}`);
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

  useEffect(() => {
    const shouldMoveFocus = hasNavigated.current;
    hasNavigated.current = true;

    if (detailSlug || noteSlug || researchSlug) {
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
  }, [detailSlug, noteSlug, researchSlug, locationKey]);

  useEffect(() => {
    const work = detailSlug ? works.find((item) => item.slug === detailSlug) : null;
    const note = noteSlug ? notes.find((item) => item.slug === noteSlug) : null;
    const essay = researchSlug ? essays.find((item) => item.slug === researchSlug) : null;
    const title = work?.title ?? note?.title ?? essay?.title ?? homeTitle;
    const description = work?.desc ?? note?.excerpt ?? essay?.body ?? defaultDescription;
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
    const jsonLd = work
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
    upsertMeta('meta[property="og:type"]', { property: "og:type" }, work || note || essay ? "article" : "website");
    upsertMeta('meta[property="og:locale"]', { property: "og:locale" }, "zh_CN");
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, fullTitle);
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    upsertCanonical(canonicalUrl);
    upsertJsonLd(jsonLd);
  }, [detailSlug, noteSlug, researchSlug, locationKey]);

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
