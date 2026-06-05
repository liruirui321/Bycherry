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
    <ul className="home-library-list" style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.5rem" }}>
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
              display: "flex",
              minHeight: 62,
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "0.28rem",
              color: "inherit",
              textDecoration: "none",
              border: "1px solid rgba(94,68,42,0.1)",
              borderRadius: 8,
              padding: "0.46rem 0.52rem",
              background: "rgba(250,247,241,0.62)",
            }}
          >
            <span style={{ minWidth: 0, display: "grid", gap: "0.18rem" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, flexWrap: "wrap" }}>
                <span style={{ color: item.color, fontSize: "0.68rem", fontWeight: 900 }}>{item.label}</span>
                <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.8rem", lineHeight: 1.28, fontWeight: 900, overflowWrap: "anywhere", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {item.title}
                </strong>
              </span>
              <span className="home-library-meta" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.66rem", lineHeight: 1.25, fontWeight: 800 }}>
                {item.date}
              </span>
            </span>
            <span style={{ alignSelf: "flex-end", lineHeight: 1 }}>
              <IconArrowRight size={14} color="var(--cherry-forest)" />
            </span>
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
  const visibleArticles = articleItems.slice(0, 4);

  return (
    <section
      aria-labelledby="home-library-heading"
      style={{ fontFamily: "'Nunito', sans-serif", padding: "0.45rem 1.5rem 0.6rem", background: "var(--background)" }}
    >
      <div id="research" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "0.42rem" }}>
          <div>
            <h2 id="home-library-heading" style={{ margin: 0, color: "var(--cherry-warm-brown)", fontSize: "0.94rem", lineHeight: 1.2, fontWeight: 900 }}>
              最新文章
            </h2>
          </div>
          <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", fontWeight: 900 }}>
            {visibleArticles.length} 篇
          </span>
        </div>

        <LibraryRows items={visibleArticles} />
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

          @media (max-width: 860px) {
            #research .home-library-list {
              display: flex !important;
              overflow-x: auto;
              scroll-snap-type: x proximity;
              padding-bottom: 0.2rem !important;
            }

            #research .home-library-list > li {
              min-width: min(58vw, 220px);
              scroll-snap-align: start;
            }
          }
        `}
      </style>
    </section>
  );
}
