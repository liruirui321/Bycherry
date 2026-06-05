import { IconArrowRight, IconBook, IconResearch } from "./Icons";
import { notes } from "./Notes";
import { essays } from "./ResearchEssays";
import { navigateClient, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";

type LibraryItem = {
  href: string;
  title: string;
  label: string;
  color: string;
  firstAction: string;
  firstCheck: string;
  firstOutput: string;
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
            aria-label={`打开${item.title}。先做这个，${item.firstAction}。完成后检查，${item.firstCheck}`}
            onClick={(event) => openArticle(item.href, event)}
            onMouseEnter={() => preloadRouteForHref(item.href)}
            onFocus={() => preloadRouteForHref(item.href)}
            onPointerDown={() => preloadRouteForHref(item.href)}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto",
              gap: "0.75rem",
              alignItems: "center",
              color: "inherit",
              textDecoration: "none",
              borderTop: "1px solid rgba(94,68,42,0.1)",
              padding: "0.66rem 0",
            }}
          >
            <span style={{ minWidth: 0, display: "grid", gap: "0.24rem" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, flexWrap: "wrap" }}>
                <span style={{ color: item.color, fontSize: "0.68rem", fontWeight: 900 }}>{item.label}</span>
                <strong style={{ color: "var(--cherry-warm-brown)", fontSize: "0.86rem", lineHeight: 1.32, fontWeight: 900, overflowWrap: "anywhere" }}>
                  {item.title}
                </strong>
              </span>
              <span className="home-library-action" style={{ color: "var(--cherry-warm-mid)", fontSize: "0.72rem", lineHeight: 1.42, fontWeight: 800, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {item.firstAction}
              </span>
              <span className="home-library-output" style={{ color: "var(--cherry-forest)", fontSize: "0.68rem", lineHeight: 1.35, fontWeight: 900, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                产出：{item.firstOutput}
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
    firstAction: essay.actionSteps[0],
    firstCheck: essay.checklist[0],
    firstOutput: essay.starterTemplate[0],
  }));
  const noteItems = notes.map((note): LibraryItem => ({
    href: note.href,
    title: note.title,
    label: note.tag,
    color: note.tagColor,
    firstAction: note.actionSteps[0],
    firstCheck: note.checklist[0],
    firstOutput: note.starterTemplate[0],
  }));

  return (
    <section
      aria-labelledby="home-library-heading"
      style={{
        fontFamily: "'Nunito', sans-serif",
        padding: "1.9rem 1.5rem",
        background: "var(--background)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "1rem", flexWrap: "wrap", marginBottom: "0.9rem" }}>
          <div>
            <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.82rem", fontWeight: 900, marginBottom: "0.26rem" }}>文章索引</div>
            <h2 id="home-library-heading" style={{ margin: 0, color: "var(--cherry-warm-brown)", fontSize: "clamp(1.25rem, 2.6vw, 1.72rem)", lineHeight: 1.22, fontWeight: 900 }}>
              读证据和学方法
            </h2>
          </div>
          <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.78rem", fontWeight: 900 }}>
            {researchItems.length + noteItems.length} 篇
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "1.2rem" }}>
          <div id="research" className="home-library-group" style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-forest)", fontSize: "0.82rem", fontWeight: 900, marginBottom: "0.3rem" }}>
              <IconResearch size={17} color="var(--cherry-forest)" />
              科研证据库
            </div>
            <LibraryRows items={researchItems} />
          </div>

          <div id="notes" className="home-library-group" style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-red)", fontSize: "0.82rem", fontWeight: 900, marginBottom: "0.3rem" }}>
              <IconBook size={17} color="var(--cherry-red)" />
              学习方法库
            </div>
            <LibraryRows items={noteItems} />
          </div>
        </div>
      </div>

      <style>
        {`
          #research .home-library-link:focus-visible,
          #notes .home-library-link:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          #research .home-library-link:hover strong,
          #research .home-library-link:focus-visible strong,
          #notes .home-library-link:hover strong,
          #notes .home-library-link:focus-visible strong {
            color: var(--cherry-red) !important;
          }

          @media (max-width: 760px) {
            section[aria-labelledby="home-library-heading"] > div > div:nth-child(2) {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </section>
  );
}
