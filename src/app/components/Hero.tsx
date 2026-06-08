import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { works } from "./Works";
import {
  IconBranch,
  IconDNA,
  IconLeaf,
  IconMicroscope,
  IconNotebook,
  IconSeedling,
  IconSparkle,
  IconStar,
  IconTestTube,
} from "./Icons";
import { getWorkToolHref, navigateClient, shouldUseClientNavigation } from "../navigation";
import { preloadRouteForHref } from "../routePrefetch";

function FloatDeco({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`hero-float-deco ${className}`}>{children}</div>;
}

function ForestBlob({ className }: { className: string }) {
  return <div className={`hero-forest-blob ${className}`} />;
}

function DotTexture({ className }: { className: string }) {
  return <div className={`hero-dot-texture ${className}`} />;
}

function FernDeco({ className }: { className: string }) {
  return (
    <svg className={`hero-fern ${className}`} width="70" height="80" viewBox="0 0 70 80" fill="none" aria-hidden="true">
      <path d="M35 78 Q35 50 35 30" stroke="var(--cherry-forest)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M35 55 Q22 45 18 32 Q28 33 35 45" fill="var(--cherry-sage)" opacity="0.55" />
      <path d="M35 45 Q48 35 52 22 Q42 23 35 35" fill="var(--cherry-sage)" opacity="0.45" />
      <path d="M35 65 Q24 58 21 48 Q30 49 35 58" fill="var(--cherry-moss)" opacity="0.4" />
    </svg>
  );
}

export function Hero() {
  const worksHref = "/#works";
  const readingHref = "/reading";
  const entries = works.map((work) => ({
    key: work.slug,
    title: work.title,
    desc: work.desc,
    href: getWorkToolHref(work.href),
    border: work.border,
    color: work.color,
    outputs: work.outputs,
    icon: work.icon,
  }));

  function openEntry(href: string, event: MouseEvent<HTMLAnchorElement>) {
    if (!shouldUseClientNavigation(event)) return;
    event.preventDefault();
    navigateClient(href);
  }

  return (
    <section className="hero-shell" aria-labelledby="hero-heading">
      <div className="hero-atmosphere" aria-hidden="true">
        <ForestBlob className="hero-forest-sage" />
        <ForestBlob className="hero-forest-yellow" />
        <ForestBlob className="hero-forest-blue" />
        <ForestBlob className="hero-forest-peach" />
        <DotTexture className="hero-dots-left" />
        <DotTexture className="hero-dots-right" />
        <FernDeco className="hero-fern-left" />
        <FernDeco className="hero-fern-right" />
        <FloatDeco className="hero-float-star"><IconStar size={22} color="var(--cherry-yellow)" /></FloatDeco>
        <FloatDeco className="hero-float-microscope"><IconMicroscope size={44} /></FloatDeco>
        <FloatDeco className="hero-float-dna"><IconDNA size={40} /></FloatDeco>
        <FloatDeco className="hero-float-tube"><IconTestTube size={35} /></FloatDeco>
        <FloatDeco className="hero-float-leaf"><IconLeaf color="var(--cherry-sage)" size={35} /></FloatDeco>
        <FloatDeco className="hero-float-branch"><IconBranch size={38} color="var(--cherry-forest)" /></FloatDeco>
        <FloatDeco className="hero-float-seed"><IconSeedling size={26} color="var(--cherry-forest)" /></FloatDeco>
      </div>

      <div className="hero-layout">
        <div className="hero-main">
          <div className="hero-badge">
            <IconSparkle size={13} color="var(--cherry-bark)" />
            <span>By Cherry</span>
            <IconSparkle size={13} color="var(--cherry-bark)" />
          </div>

          <h1 id="hero-heading" className="hero-title">
            A tiny studio for{" "}
            <span className="hero-title-science">science</span>,{" "}
            <span className="hero-title-learning">learning</span>
            {" & "}
            <span className="hero-title-ai">AI</span>
          </h1>

          <p className="hero-subtitle">
            科学模拟、科研阅读和 AI 学习工具，打开后直接进入内容。
          </p>

          <div className="hero-action-row">
            <a href={worksHref} className="hero-primary-link" onClick={(event) => openEntry(worksHref, event)}>
              <IconSeedling size={18} color="#FAF7F1" />
              浏览主题作品
            </a>
            <a
              href={readingHref}
              className="hero-reading-link"
              onClick={(event) => openEntry(readingHref, event)}
              onMouseEnter={() => preloadRouteForHref(readingHref)}
              onFocus={() => preloadRouteForHref(readingHref)}
            >
              <IconNotebook size={18} />
              读读笔记
            </a>
          </div>
        </div>

        <div className="hero-showcase">
          <div className="hero-showcase-head">
            <strong>精选内容</strong>
            <span>{entries.length} 个主题作品</span>
          </div>
          <nav id="works" className="hero-entry-grid" aria-label="内容目录">
            {entries.map((entry) => (
              <a
                className="hero-entry-card"
                key={entry.key}
                href={entry.href}
                aria-label={`打开${entry.title}：${entry.desc}`}
                onClick={(event) => openEntry(entry.href, event)}
                onMouseEnter={() => preloadRouteForHref(entry.href)}
                onFocus={() => preloadRouteForHref(entry.href)}
                onPointerDown={() => preloadRouteForHref(entry.href)}
                style={{
                  "--entry-color": entry.color,
                  "--entry-border": entry.border,
                } as CSSProperties}
              >
                <span className="hero-entry-icon" aria-hidden="true">{entry.icon}</span>
                <span className="hero-entry-copy">
                  <strong>{entry.title}</strong>
                  <span>{entry.desc}</span>
                </span>
                <span className="hero-entry-meta">
                  {entry.outputs.slice(0, 2).map((output) => <em key={output}>{output}</em>)}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      <style>{`
        .hero-shell {
          min-height: calc(100svh - 56px);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(2.6rem, 5.4vh, 4.2rem) clamp(1rem, 3vw, 2rem) clamp(1.4rem, 3vh, 2.2rem);
          background: var(--background);
          font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          box-sizing: border-box;
        }

        .hero-atmosphere {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .hero-forest-blob {
          position: absolute;
          border-radius: 58% 42% 52% 48% / 46% 58% 42% 54%;
          opacity: 0.28;
          filter: blur(1px);
        }

        .hero-forest-sage {
          width: min(31vw, 420px);
          height: 300px;
          top: 6%;
          right: 3%;
          background: var(--cherry-sage-light);
        }

        .hero-forest-yellow {
          width: min(30vw, 360px);
          height: 240px;
          bottom: 7%;
          left: 0;
          background: var(--cherry-yellow-light);
        }

        .hero-forest-blue {
          width: min(23vw, 300px);
          height: 185px;
          right: 12%;
          bottom: 11%;
          background: var(--cherry-blue-light);
        }

        .hero-forest-peach {
          width: min(18vw, 210px);
          height: 160px;
          top: 22%;
          left: 4%;
          background: var(--cherry-peach-light);
        }

        .hero-dot-texture {
          position: absolute;
          width: 120px;
          height: 120px;
          opacity: 0.18;
          background-image: radial-gradient(circle, var(--cherry-forest) 2px, transparent 2px);
          background-size: 20px 20px;
        }

        .hero-dots-left {
          top: 12%;
          left: 2%;
        }

        .hero-dots-right {
          right: 5%;
          bottom: 12%;
        }

        .hero-fern {
          position: absolute;
          bottom: 0;
        }

        .hero-fern-left {
          left: 2%;
        }

        .hero-fern-right {
          right: 3%;
          transform: scaleX(-1);
          transform-origin: bottom right;
        }

        .hero-float-deco {
          position: absolute;
          animation: heroFloatDeco 4.8s ease-in-out infinite;
        }

        .hero-float-star {
          top: 15%;
          right: 18%;
        }

        .hero-float-microscope {
          top: 23%;
          left: 10%;
          animation-delay: -0.7s;
        }

        .hero-float-dna {
          bottom: 25%;
          left: 18%;
          animation-delay: -1.1s;
        }

        .hero-float-tube {
          bottom: 28%;
          right: 12%;
          animation-delay: -0.4s;
        }

        .hero-float-leaf {
          top: 58%;
          left: 5%;
          animation-delay: -0.2s;
        }

        .hero-float-branch {
          top: 39%;
          right: 5%;
          animation-delay: -1.6s;
        }

        .hero-float-seed {
          top: 8%;
          left: 52%;
          animation-delay: -2s;
        }

        .hero-layout {
          position: relative;
          z-index: 2;
          width: min(100%, 1520px);
          display: grid;
          grid-template-columns: minmax(390px, 0.9fr) minmax(620px, 1.35fr);
          align-items: center;
          gap: clamp(1.4rem, 3vw, 3.4rem);
        }

        .hero-main {
          width: min(100%, 680px);
          text-align: left;
          display: grid;
          justify-items: start;
          align-content: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--cherry-yellow-light);
          border: 1.5px dashed var(--cherry-yellow);
          border-radius: 999px;
          padding: 0.36rem 1.1rem;
          margin-bottom: clamp(1rem, 2.4vh, 1.8rem);
          color: var(--cherry-warm-brown);
          font-size: 0.96rem;
          font-weight: 850;
        }

        .hero-title {
          margin: 0;
          color: var(--cherry-warm-brown);
          font-size: clamp(2.45rem, 5.8vw, 4.45rem);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: 0;
        }

        .hero-title-science {
          position: relative;
          display: inline-block;
          color: var(--cherry-red);
        }

        .hero-title-science::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -0.08em;
          height: 0.1em;
          border-radius: 999px;
          background: var(--cherry-peach);
        }

        .hero-title-learning {
          color: var(--cherry-sage);
        }

        .hero-title-ai {
          color: var(--cherry-blue);
        }

        .hero-subtitle {
          margin: 1rem 0 0;
          max-width: 580px;
          color: var(--cherry-warm-mid);
          font-size: clamp(1.02rem, 1.45vw, 1.28rem);
          line-height: 1.7;
          font-weight: 760;
        }

        .hero-action-row {
          display: flex;
          gap: 0.85rem;
          justify-content: flex-start;
          flex-wrap: wrap;
          margin-top: clamp(1.35rem, 2.9vh, 2.2rem);
        }

        .hero-action-row a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          padding: 0.72rem 1.55rem;
          text-decoration: none;
          font-weight: 900;
          font-size: 0.92rem;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease;
        }

        .hero-primary-link {
          background: var(--cherry-forest);
          color: #FAF7F1;
          border: 1.5px solid var(--cherry-forest);
          box-shadow: 3px 5px 0 rgba(58,92,62,0.25);
        }

        .hero-reading-link {
          background: rgba(250,247,241,0.58);
          color: var(--cherry-warm-brown);
          border: 1.5px solid var(--border);
        }

        .hero-action-row a:hover,
        .hero-action-row a:focus-visible {
          transform: translateY(-2px);
        }

        .hero-showcase {
          min-width: 0;
          display: grid;
          gap: 0.7rem;
        }

        .hero-showcase-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 1rem;
          color: var(--cherry-warm-brown);
          padding: 0 0.2rem;
        }

        .hero-showcase-head strong {
          font-size: 1.08rem;
          font-weight: 950;
        }

        .hero-showcase-head span {
          color: var(--cherry-warm-mid);
          font-size: 0.82rem;
          font-weight: 900;
        }

        .hero-entry-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.85rem;
        }

        .hero-entry-card {
          min-width: 0;
          min-height: 150px;
          display: grid;
          box-sizing: border-box;
          grid-template-columns: 2.7rem minmax(0, 1fr);
          grid-template-rows: auto 1fr auto;
          gap: 0.55rem 0.78rem;
          align-items: start;
          padding: 0.95rem;
          border-radius: 18px;
          border: 2px solid var(--entry-border);
          background: linear-gradient(150deg, var(--entry-color), rgba(250,247,241,0.9));
          color: var(--cherry-warm-brown);
          text-decoration: none;
          box-shadow: 0 14px 26px rgba(94,68,42,0.08);
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        }

        .hero-entry-card:first-child,
        .hero-entry-card:nth-child(3) {
          min-height: 172px;
        }

        .hero-entry-card:hover,
        .hero-entry-card:focus-visible {
          transform: translateY(-3px);
          box-shadow: 3px 7px 0 rgba(94,68,42,0.08), 0 18px 30px rgba(94,68,42,0.08);
          background: rgba(250,247,241,0.92);
        }

        .hero-entry-card:focus-visible {
          outline: 3px solid var(--cherry-red);
          outline-offset: 4px;
        }

        .hero-entry-icon {
          grid-row: 1 / 3;
          display: grid;
          place-items: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 12px;
          background: rgba(250,247,241,0.66);
          border: 1px solid rgba(94,68,42,0.08);
        }

        .hero-entry-icon > svg {
          width: 1.8rem;
          height: 1.8rem;
        }

        .hero-entry-copy {
          grid-column: 2;
          min-width: 0;
          display: grid;
          gap: 0.42rem;
        }

        .hero-entry-copy strong {
          color: var(--cherry-warm-brown);
          font-size: 1.08rem;
          line-height: 1.2;
          font-weight: 950;
        }

        .hero-entry-copy span {
          color: var(--cherry-warm-mid);
          font-size: 0.86rem;
          line-height: 1.55;
          font-weight: 820;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .hero-entry-meta {
          grid-column: 1 / -1;
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          align-self: end;
        }

        .hero-entry-meta em {
          border-radius: 999px;
          background: rgba(250,247,241,0.82);
          color: var(--cherry-warm-brown);
          padding: 0.24rem 0.52rem;
          font-style: normal;
          font-size: 0.72rem;
          font-weight: 900;
        }

        @keyframes heroFloatDeco {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-9px); }
        }

        @media (max-width: 1100px) {
          .hero-layout {
            grid-template-columns: 1fr;
            width: min(100%, 760px);
            gap: 1.2rem;
          }

          .hero-main {
            text-align: center;
            justify-items: center;
            margin: 0 auto;
          }

          .hero-action-row {
            justify-content: center;
          }

          .hero-entry-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .hero-shell {
            min-height: auto;
            padding-top: 2rem;
            gap: 1rem;
          }

          .hero-main {
            width: min(100%, 560px);
          }

          .hero-title {
            font-size: clamp(2rem, 9.4vw, 2.75rem);
          }

          .hero-subtitle {
            font-size: 0.96rem;
            line-height: 1.56;
          }

          .hero-entry-grid {
            grid-template-columns: 1fr;
            gap: 0.56rem;
          }

          .hero-entry-card {
            min-height: 74px;
            padding: 0.8rem;
            border-radius: 12px;
          }

          .hero-entry-card:first-child,
          .hero-entry-card:nth-child(3) {
            min-height: 74px;
          }

          .hero-entry-copy span,
          .hero-entry-meta {
            display: none;
          }

          .hero-float-tube,
          .hero-float-branch,
          .hero-float-seed,
          .hero-fern-right {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .hero-shell {
            padding-left: 0.85rem;
            padding-right: 0.85rem;
          }

          .hero-badge {
            margin-bottom: 0.9rem;
          }

          .hero-action-row {
            width: 100%;
          }

          .hero-action-row a {
            flex: 1 1 140px;
            justify-content: center;
            padding-left: 0.8rem;
            padding-right: 0.8rem;
          }

          .hero-entry-grid {
            grid-template-columns: 1fr;
          }

          .hero-entry-card {
            min-height: 66px;
            grid-template-columns: 2.1rem minmax(0, 1fr);
            grid-template-rows: auto;
          }

          .hero-entry-icon {
            grid-row: auto;
            width: 2rem;
            height: 2rem;
          }

          .hero-entry-icon > svg {
            width: 1.55rem;
            height: 1.55rem;
          }

          .hero-entry-copy span,
          .hero-entry-meta {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-float-deco,
          .hero-scroll-hint,
          .hero-entry-card,
          .hero-action-row a {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
