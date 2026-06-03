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
  const [locationKey, setLocationKey] = useState(`${window.location.pathname}${window.location.hash}`);
  const detailSlug = useMemo(() => {
    const match = window.location.pathname.match(/^\/works\/([^/]+)\/?$/);
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
    if (detailSlug) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const id = window.location.hash.replace("#", "");
    if (!id) return;

    window.requestAnimationFrame(() => {
      const target = document.getElementById(id);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [detailSlug, locationKey]);

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
