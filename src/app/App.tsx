import { useEffect, useMemo, useState } from "react";
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
const defaultDescription = "A warm illustrated portfolio about science education, AI learning tools, project-based courses, and creative workflows.";
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

export default function App() {
  const [locationKey, setLocationKey] = useState(`${window.location.pathname}${window.location.hash}`);
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
    if (detailSlug || noteSlug || researchSlug) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const id = window.location.hash.replace("#", "");
    if (!id) return;

    window.requestAnimationFrame(() => {
      const target = document.getElementById(id);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [detailSlug, noteSlug, researchSlug, locationKey]);

  useEffect(() => {
    const work = detailSlug ? works.find((item) => item.slug === detailSlug) : null;
    const note = noteSlug ? notes.find((item) => item.slug === noteSlug) : null;
    const essay = researchSlug ? essays.find((item) => item.slug === researchSlug) : null;
    const title = work?.title ?? note?.title ?? essay?.title ?? "Science, Education & AI";
    const description = work?.desc ?? note?.excerpt ?? essay?.body ?? defaultDescription;
    const fullTitle = title === "Science, Education & AI" ? `${siteTitle} | ${title}` : `${title} | ${siteTitle}`;
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
