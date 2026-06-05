import { IconArrowRight } from "./Icons";
import { notes } from "./Notes";
import { essays } from "./ResearchEssays";
import { navigateClient, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";

type LibraryItem = {
  href: string;
  title: string;
  label: string;
  color: string;
  date: string;
};

function openArticle(href: string, event: React.MouseEvent<HTMLAnchorElement>) {
  if (!shouldUseClientNavigation(event)) return;
  event.preventDefault();
  navigateClient(href);
}

function LibraryRows({ items }: { items: LibraryItem[] }) {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 0 }}>
      {items.map((item) => (
        <li key={item.href}>
          <a
            className="home-library-link"
            href={item.href}
            aria-label={`打开文章：${item.title}`}
            onClick={(event) => openArticle(item.href, event)}
            onMouseEnter={() => preloadRouteForHref(item.href)}
            onFocus={() => preloadRouteForHref(item.href)}
            onPointerDown={() => preloadRouteForHref(item.href)}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto",
              gap: "0.55rem",
              alignItems: "center",
              color: "inherit",
              textDecoration: "none",
              borderTop: "1px solid rgba(94,68,42,0.1)",
              padding: "0.48rem 0",
            }}
          >
            <span style={{ minWidth: 0, display: "grid", gap: "0.18rem" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, flexWrap: "wrap" }}>
                <span style={{ color: item.color, fontSize: "0.68rem", fontWeight: 900 }}>{item.label}</span>
                <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.86rem", lineHeight: 1.32, fontWeight: 900, overflowWrap: "anywhere" }}>
                  {item.title}
                </strong>
              </span>
              <span className="home-library-meta" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.35, fontWeight: 800 }}>
                {item.date}
              </span>
            </span>
            <IconArrowRight size={15} color="var(--cherry-forest)" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function HomeLibrary() {
  const researchItems = essays.map((essay): LibraryItem => ({
    href: essay.href,
    title: essay.title,
    label: essay.label,
    color: essay.labelColor,
    date: essay.date,
  }));
  const noteItems = notes.map((note): LibraryItem => ({
    href: note.href,
    title: note.title,
    label: note.tag,
    color: note.tagColor,
    date: note.date,
  }));
  const articleItems = [...researchItems, ...noteItems];
  const visibleArticles = articleItems.slice(0, 6);

  return (
    <section
      aria-labelledby="home-library-heading"
      style={{ fontFamily: "'Nunito', sans-serif", padding: "0.8rem 1.5rem 0.9rem", background: "var(--background)" }}
    >
      <div id="research" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "1rem", flexWrap: "wrap", marginBottom: "0.55rem" }}>
          <div>
            <h2 id="home-library-heading" style={{ margin: 0, color: "var(--cherry-warm-brown)", fontSize: "clamp(1.1rem, 2.2vw, 1.45rem)", lineHeight: 1.22, fontWeight: 900 }}>
              文章
            </h2>
          </div>
          <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", fontWeight: 900 }}>
            最近 {visibleArticles.length} 篇
          </span>
        </div>

        <div className="home-library-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", columnGap: "1.2rem" }}>
          <LibraryRows items={visibleArticles.slice(0, Math.ceil(visibleArticles.length / 2))} />
          <LibraryRows items={visibleArticles.slice(Math.ceil(visibleArticles.length / 2))} />
        </div>
      </div>

      <style>
        {`
          #research .home-library-link:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          #research .home-library-link:hover strong,
          #research .home-library-link:focus-visible strong {
            color: var(--cherry-red) !important;
          }

          @media (max-width: 760px) {
            .home-library-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </section>
  );
}
