import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { essays } from "./components/ResearchEssays";
import { notes } from "./components/Notes";
import { Footer } from "./components/Footer";
import { EmptyStateCard } from "./components/EmptyStateCard";
import { works } from "./components/Works";
import { navigateClient, shouldUseClientNavigation } from "./navigation";
import { homeTitle, shareImageAlt, siteDescription, siteTitle, siteUrl, socialImageUrl } from "./siteMetadata";

const WorkDetailPage = lazy(() => import("./components/WorkDetailPage").then((module) => ({ default: module.WorkDetailPage })));
const ArticleDetailPage = lazy(() => import("./components/ArticleDetailPage").then((module) => ({ default: module.ArticleDetailPage })));
const ArticleLibraryPage = lazy(() => import("./components/ArticleLibraryPage").then((module) => ({ default: module.ArticleLibraryPage })));

const legacyNoteSlugMap: Record<string, string> = {
  "ai-course-development": "ai-learning-material-audit",
};

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

const metaDescriptionMaxLength = 180;

function truncateMetaText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
}

function buildMetaDescription(baseDescription: string, actionDescription: string | null) {
  if (!actionDescription) return truncateMetaText(baseDescription, metaDescriptionMaxLength);

  const actionText = truncateMetaText(actionDescription, metaDescriptionMaxLength);
  const baseMaxLength = metaDescriptionMaxLength - actionText.length - 1;
  if (baseMaxLength < 24) return actionText;

  return `${truncateMetaText(baseDescription, baseMaxLength)} ${actionText}`;
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

function buildHomeJsonLd() {
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;
  const worksListId = `${siteUrl}/#works`;
  const articlesListId = `${siteUrl}/#articles`;
  const articles = [
    ...essays.map((item) => ({ ...item, kind: "科研证据" })),
    ...notes.map((item) => ({ ...item, kind: "学习方法" })),
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: "Cherry",
        url: siteUrl,
        sameAs: ["https://github.com/liruirui321"],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: siteTitle,
        alternateName: "Bycherry",
        description: siteDescription,
        inLanguage: "zh-CN",
        image: socialImageUrl,
        publisher: { "@id": personId },
      },
      {
        "@type": "ItemList",
        "@id": worksListId,
        name: "By Cherry 工具与项目",
        description: "科学模拟、AI 工具和学习项目入口。",
        numberOfItems: works.length,
        itemListElement: works.map((work, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${siteUrl}${work.href}`,
          item: {
            "@type": "CreativeWork",
            name: work.title,
            description: work.desc,
            url: `${siteUrl}${work.href}`,
            genre: work.category,
            keywords: work.tags.join(", "),
            learningResourceType: work.category,
            teaches: [work.task, work.starter, work.success, ...work.path, ...work.outputs],
            dateModified: work.updated,
            creator: { "@id": personId },
          },
        })),
      },
      {
        "@type": "ItemList",
        "@id": articlesListId,
        name: "By Cherry 文章",
        description: "学习方法、科研证据、AI 创作和科研转译文章。",
        numberOfItems: articles.length,
        itemListElement: articles.map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${siteUrl}${article.href}`,
          item: {
            "@type": "Article",
            headline: article.title,
            description: article.excerpt ?? article.body,
            url: `${siteUrl}${article.href}`,
            datePublished: article.date,
            articleSection: article.kind,
            teaches: [article.actionSteps[0], article.checklist[0], article.starterTemplate[0]],
            author: { "@id": personId },
          },
        })),
      },
    ],
  };
}

function buildArticleLibraryJsonLd() {
  const personId = `${siteUrl}/#person`;
  const articles = [
    ...essays.map((item) => ({ ...item, kind: "科研证据", description: item.body })),
    ...notes.map((item) => ({ ...item, kind: "学习方法", description: item.excerpt })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "阅读库",
    description: "By Cherry 阅读库集中整理科研证据和学习方法文章，每篇都给出行动、检查和可保存产出。",
    url: `${siteUrl}/reading`,
    inLanguage: "zh-CN",
    publisher: {
      "@type": "Person",
      "@id": personId,
      name: "Cherry",
      url: siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      "@id": `${siteUrl}/reading#articles`,
      name: "By Cherry 阅读库",
      numberOfItems: articles.length,
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}${article.href}`,
        item: {
          "@type": "Article",
          headline: article.title,
          description: article.description,
          url: `${siteUrl}${article.href}`,
          datePublished: article.date,
          articleSection: article.kind,
          teaches: [article.actionSteps[0], article.checklist[0], article.starterTemplate[0]],
          author: { "@id": personId },
        },
      })),
    },
  };
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

function scrollToHashTarget(shouldMoveFocus: boolean, attempt = 0) {
  const id = window.location.hash.replace("#", "");
  if (!id) return false;

  window.requestAnimationFrame(() => {
    const target = document.getElementById(id);
    if (!target && attempt < 8) {
      window.setTimeout(() => scrollToHashTarget(shouldMoveFocus, attempt + 1), 60);
      return;
    }

    target?.scrollIntoView({ behavior: getScrollBehavior(), block: "start" });
    if (shouldMoveFocus) focusPageTarget(target);
  });

  return true;
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
      <EmptyStateCard
        eyebrow="404"
        title="没有找到这个页面"
        body="这个地址可能写错了，或者内容已经移动。可以回到内容目录继续浏览工具、项目和阅读库。"
        href="/#works"
        linkText="回到内容目录"
        onNavigate={(event) => {
          if (!shouldUseClientNavigation(event)) return;
          event.preventDefault();
          navigateClient("/#works");
        }}
      />
    </main>
  );
}

function RouteLoading() {
  return (
    <main id="main-content" tabIndex={-1} style={{ minHeight: "58vh", padding: "0 1.5rem 1.2rem", fontFamily: "'Nunito', sans-serif", background: "var(--background)" }}>
      <div role="status" aria-live="polite" className="route-loading-shell" style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gap: "0.72rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "var(--cherry-warm-brown)", fontWeight: 950, fontSize: "1rem", lineHeight: 1.2, padding: "0.55rem 0 0.1rem" }}>
          <span aria-hidden="true" style={{ color: "var(--cherry-forest)", fontSize: "1rem" }}>←</span>
          正在载入内容
        </div>
        <section aria-label="内容载入进度" style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 12, padding: "0.9rem", boxShadow: "0 8px 18px rgba(94,68,42,0.05)", display: "grid", gap: "0.75rem" }}>
          <div className="route-loading-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(220px, 0.8fr)", gap: "0.75rem", alignItems: "stretch" }}>
            <div style={{ border: "1.5px dashed rgba(58,92,62,0.24)", borderRadius: 12, background: "linear-gradient(135deg, rgba(169,201,172,0.28), rgba(194,220,233,0.18))", minHeight: 230, padding: "0.9rem", display: "grid", alignContent: "space-between", gap: "1rem" }}>
              <span style={{ width: "38%", height: 14, borderRadius: 999, background: "rgba(94,68,42,0.14)" }} />
              <span style={{ display: "grid", gap: "0.5rem" }}>
                {[0, 1, 2].map((item) => (
                  <span key={item} style={{ width: item === 0 ? "86%" : item === 1 ? "68%" : "78%", height: 12, borderRadius: 999, background: "rgba(58,92,62,0.12)" }} />
                ))}
              </span>
              <span style={{ display: "flex", gap: "0.42rem", flexWrap: "wrap" }}>
                {[0, 1, 2, 3].map((item) => (
                  <span key={item} style={{ width: 54, height: 24, borderRadius: 999, background: "rgba(250,247,241,0.78)", border: "1px solid rgba(94,68,42,0.09)" }} />
                ))}
              </span>
            </div>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {[0, 1, 2, 3].map((item) => (
                <span key={item} style={{ borderRadius: 10, minHeight: 48, background: item === 0 ? "var(--cherry-sage-light)" : item === 1 ? "var(--cherry-blue-light)" : item === 2 ? "var(--cherry-yellow-light)" : "var(--cherry-peach-light)", border: "1px solid rgba(94,68,42,0.11)", opacity: 0.78 }} />
              ))}
            </div>
          </div>
          <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", lineHeight: 1.5, fontWeight: 850 }}>
            正在准备工具界面、学习记录和可复制输出。
          </span>
        </section>
      </div>
      <style>{`
        @media (max-width: 760px) {
          .route-loading-shell {
            max-width: 100% !important;
          }

          .route-loading-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
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
  const canonicalNoteSlug = useMemo(() => (noteSlug ? legacyNoteSlugMap[noteSlug] ?? noteSlug : null), [noteSlug]);
  const researchSlug = useMemo(() => {
    const match = window.location.pathname.match(/^\/research\/([^/]+)\/?$/);
    return match?.[1] ?? null;
  }, [locationKey]);
  const isReadingLibrary = useMemo(() => /^\/reading\/?$/.test(window.location.pathname), [locationKey]);
  const unknownPath = useMemo(() => window.location.pathname !== "/" && !detailSlug && !noteSlug && !researchSlug && !isReadingLibrary, [detailSlug, noteSlug, researchSlug, isReadingLibrary, locationKey]);
  const isHome = !detailSlug && !canonicalNoteSlug && !researchSlug && !isReadingLibrary && !unknownPath;

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
    if (!noteSlug) return;
    const canonicalSlug = legacyNoteSlugMap[noteSlug];
    if (!canonicalSlug) return;

    window.history.replaceState(null, "", `/notes/${canonicalSlug}${window.location.search}${window.location.hash}`);
    setLocationKey(getLocationKey());
  }, [noteSlug]);

  useEffect(() => {
    const shouldMoveFocus = hasNavigated.current;
    hasNavigated.current = true;

    if (detailSlug || canonicalNoteSlug || researchSlug || isReadingLibrary || unknownPath) {
      if (!unknownPath && scrollToHashTarget(shouldMoveFocus)) return;

      window.scrollTo({ top: 0, behavior: getScrollBehavior() });
      if (shouldMoveFocus) {
        window.requestAnimationFrame(() => focusPageTarget(document.getElementById("main-content")));
      }
      return;
    }

    scrollToHashTarget(shouldMoveFocus);
  }, [detailSlug, canonicalNoteSlug, researchSlug, isReadingLibrary, unknownPath, locationKey]);

  useEffect(() => {
    const work = detailSlug ? works.find((item) => item.slug === detailSlug) : null;
    const note = canonicalNoteSlug ? notes.find((item) => item.slug === canonicalNoteSlug) : null;
    const essay = researchSlug ? essays.find((item) => item.slug === researchSlug) : null;
    const missingRoutedItem = Boolean((detailSlug && !work) || (canonicalNoteSlug && !note) || (researchSlug && !essay));
    const notFound = unknownPath || missingRoutedItem;
    const readingLibraryDescription = "By Cherry 阅读库集中整理科研证据和学习方法文章，每篇都给出行动、检查和可保存产出。";
    const title = notFound ? "没有找到页面" : isReadingLibrary ? "阅读库" : work?.title ?? note?.title ?? essay?.title ?? homeTitle;
    const baseDescription = notFound ? "这个地址没有对应的 By Cherry 页面，可以回到内容目录继续浏览工具、项目和阅读库。" : isReadingLibrary ? readingLibraryDescription : work?.desc ?? note?.excerpt ?? essay?.body ?? siteDescription;
    const workActionDescription = work ? `先做这个：${work.starter}。完成标准：${work.success}` : null;
    const articleFirstAction = note?.actionSteps[0] ?? essay?.actionSteps[0] ?? null;
    const articleFirstCheck = note?.checklist[0] ?? essay?.checklist[0] ?? null;
    const articleActionDescription = (note || essay) && articleFirstAction && articleFirstCheck
      ? `先做这个：${articleFirstAction}。完成后检查：${articleFirstCheck}`
      : null;
    const description = buildMetaDescription(baseDescription, workActionDescription ?? articleActionDescription);
    const isArticle = Boolean(note || essay);
    const publishedDate = note?.date ?? essay?.date ?? null;
    const workUpdatedDate = work?.updated ?? null;
    const keywords = isReadingLibrary ? "科研证据, 学习方法, AI 学习, 科学学习" : work?.tags.join(", ") ?? essay?.tags.join(", ") ?? note?.tag ?? null;
    const fullTitle = title === homeTitle ? `${siteTitle} | ${title}` : `${title} | ${siteTitle}`;
    const canonicalPath = window.location.pathname === "/" ? "/" : window.location.pathname.replace(/\/$/, "");
    const canonicalUrl = `${siteUrl}${canonicalPath}`;
    const personId = `${siteUrl}/#person`;
    const jsonLdBase = {
      publisher: {
        "@type": "Person",
        "@id": personId,
        name: "Cherry",
        url: siteUrl,
      },
      creator: { "@id": personId },
      url: canonicalUrl,
      name: title,
      description,
      image: socialImageUrl,
      inLanguage: "zh-CN",
      mainEntityOfPage: canonicalUrl,
    };
    const jsonLd = notFound
      ? {
          "@context": "https://schema.org",
          "@type": "WebPage",
          ...jsonLdBase,
        }
      : isReadingLibrary
      ? buildArticleLibraryJsonLd()
      : work
      ? {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          ...jsonLdBase,
          genre: work.category,
          keywords: work.tags.join(", "),
          learningResourceType: work.category,
          teaches: [work.task, work.starter, work.success, ...work.path, ...work.outputs],
          dateModified: work.updated,
        }
      : note || essay
        ? {
            "@context": "https://schema.org",
            "@type": "Article",
            ...jsonLdBase,
            headline: title,
            datePublished: note?.date ?? essay?.date,
            dateModified: note?.date ?? essay?.date,
            teaches: [note?.actionSteps[0] ?? essay?.actionSteps[0], note?.checklist[0] ?? essay?.checklist[0], note?.starterTemplate[0] ?? essay?.starterTemplate[0]],
            author: {
              "@type": "Person",
              "@id": personId,
              name: "Cherry",
              url: siteUrl,
            },
            keywords: essay?.tags?.join(", ") ?? note?.tag,
          }
        : buildHomeJsonLd();

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
    upsertMeta('meta[property="og:image:alt"]', { property: "og:image:alt" }, shareImageAlt);
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, fullTitle);
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image" }, socialImageUrl);
    upsertMeta('meta[name="twitter:image:alt"]', { name: "twitter:image:alt" }, shareImageAlt);
    upsertMeta('meta[name="robots"]', { name: "robots" }, notFound ? "noindex" : "index, follow");
    setOptionalMeta('meta[property="article:published_time"]', { property: "article:published_time" }, isArticle ? publishedDate : null);
    setOptionalMeta('meta[property="article:modified_time"]', { property: "article:modified_time" }, isArticle ? publishedDate : null);
    setOptionalMeta('meta[property="article:tag"]', { property: "article:tag" }, isArticle ? keywords : null);
    setOptionalMeta('meta[property="og:updated_time"]', { property: "og:updated_time" }, workUpdatedDate);
    setOptionalMeta('meta[name="keywords"]', { name: "keywords" }, keywords);
    upsertCanonical(canonicalUrl);
    upsertJsonLd(jsonLd);
  }, [detailSlug, canonicalNoteSlug, researchSlug, isReadingLibrary, unknownPath, locationKey]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        fontFamily: "'Nunito', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <a className="skip-link" href="#main-content">
        跳到正文
      </a>
      <Nav />
      <div style={{ flex: isHome ? "0 0 auto" : "1 0 auto", minWidth: 0 }}>
        {detailSlug ? (
          <Suspense fallback={<RouteLoading />}>
            <WorkDetailPage slug={detailSlug} />
          </Suspense>
        ) : canonicalNoteSlug ? (
          <Suspense fallback={<RouteLoading />}>
            <ArticleDetailPage kind="note" slug={canonicalNoteSlug} />
          </Suspense>
        ) : researchSlug ? (
          <Suspense fallback={<RouteLoading />}>
            <ArticleDetailPage kind="research" slug={researchSlug} />
          </Suspense>
        ) : isReadingLibrary ? (
          <Suspense fallback={<RouteLoading />}>
            <ArticleLibraryPage />
          </Suspense>
        ) : unknownPath ? (
          <NotFoundPage />
        ) : (
          <main id="main-content" tabIndex={-1}>
            <Hero />
          </main>
        )}
      </div>
      {isHome ? null : <Footer />}
    </div>
  );
}
