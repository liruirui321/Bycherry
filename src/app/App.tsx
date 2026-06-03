import { useEffect, useMemo, useState } from "react";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Works } from "./components/Works";
import { WorkDetailPage } from "./components/WorkDetailPage";
import { ResearchEssays } from "./components/ResearchEssays";
import { Notes } from "./components/Notes";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  const detailSlug = useMemo(() => {
    const match = hash.match(/^#\/works\/(.+)$/);
    return match?.[1] ?? null;
  }, [hash]);

  useEffect(() => {
    function handleHashChange() {
      setHash(window.location.hash);
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (detailSlug) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const id = hash.replace("#", "");
    if (!id) return;

    window.requestAnimationFrame(() => {
      const target = document.getElementById(id);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [detailSlug, hash]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <Nav />
      {detailSlug ? (
        <WorkDetailPage slug={detailSlug} />
      ) : (
        <main>
          <Hero />
          <About />
          <Works />
          <ResearchEssays />
          <Notes />
          <Contact />
        </main>
      )}
      <Footer />
    </div>
  );
}
