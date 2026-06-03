import { useEffect } from "react";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Works } from "./components/Works";
import { GeneExpressionTool } from "./components/GeneExpressionTool";
import { ResearchEssays } from "./components/ResearchEssays";
import { Notes } from "./components/Notes";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function App() {
  useEffect(() => {
    function scrollToHash() {
      const id = window.location.hash.replace("#", "");
      if (!id) return;

      window.requestAnimationFrame(() => {
        const target = document.getElementById(id);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <Nav />
      <main>
        <Hero />
        <About />
        <Works />
        <GeneExpressionTool />
        <ResearchEssays />
        <Notes />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
