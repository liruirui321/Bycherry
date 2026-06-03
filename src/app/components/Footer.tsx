import { IconCherry, IconLeafSmall } from "./Icons";

export function Footer() {
  return (
    <footer
      style={{
        fontFamily: "'Nunito', sans-serif",
        background: "var(--cherry-forest)",
        color: "rgba(245,241,234,0.7)",
        padding: "2rem 1.5rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle leaf pattern */}
      <svg style={{ position: "absolute", top: 10, left: 20, opacity: 0.12, pointerEvents: "none" }} width="50" height="55" viewBox="0 0 60 60" fill="none">
        <path d="M8 55 Q12 34 50 10 Q50 38 8 55Z" fill="white" />
      </svg>
      <svg style={{ position: "absolute", bottom: 8, right: 24, opacity: 0.1, pointerEvents: "none", transform: "scaleX(-1)" }} width="44" height="48" viewBox="0 0 60 60" fill="none">
        <path d="M8 55 Q12 34 50 10 Q50 38 8 55Z" fill="white" />
      </svg>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: "0.5rem" }}>
        <IconCherry size={20} color="#F2A896" />
        <span style={{ fontFamily: "'Caveat', cursive", fontSize: "1rem", color: "rgba(245,241,234,0.9)", fontWeight: 600 }}>
          By Cherry
        </span>
        <IconLeafSmall size={16} color="var(--cherry-sage-light)" />
      </div>
      <p style={{ fontSize: "0.8rem" }}>
        科学、课程和 AI 小作品 · © 2026 By Cherry
      </p>
    </footer>
  );
}
