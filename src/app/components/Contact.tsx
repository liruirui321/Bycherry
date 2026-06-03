import { useState } from "react";
import { IconMail, IconSend, IconTwitter, IconGithub, IconZhihu, IconBilibili, IconLeaf, IconCheck } from "./Icons";

export function Contact() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function sendMail() {
    if (!name.trim() || !message.trim()) return;
    const subject = encodeURIComponent(`By Cherry 留言 - ${name.trim()}`);
    const body = encodeURIComponent(`${message.trim()}\n\n来自：${name.trim()}`);
    window.location.href = `mailto:liruirui321@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  const socials = [
    { icon: <IconTwitter size={17} />, label: "Twitter" },
    { icon: <IconZhihu size={17} />, label: "知乎" },
    { icon: <IconBilibili size={17} />, label: "Bilibili" },
    { icon: <IconGithub size={17} />, label: "GitHub" },
  ];

  return (
    <section
      id="contact"
      style={{
        fontFamily: "'Nunito', sans-serif",
        padding: "5rem 1.5rem 4rem",
        background: "var(--muted)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Wave top */}
      <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", display: "block" }} viewBox="0 0 1440 28" preserveAspectRatio="none" fill="none">
        <path d="M0 14 Q180 0 360 14 Q540 28 720 14 Q900 0 1080 14 Q1260 28 1440 14 L1440 0 L0 0Z" fill="var(--background)" />
      </svg>

      {/* Forest deco leaves */}
      <svg style={{ position: "absolute", top: 40, left: 10, opacity: 0.1, pointerEvents: "none", transform: "rotate(-15deg)" }} width="80" height="85" viewBox="0 0 80 85" fill="none">
        <path d="M10 80 Q14 52 65 15 Q65 48 10 80Z" fill="var(--cherry-forest)" />
        <path d="M10 80 Q36 56 65 15" stroke="var(--cherry-forest)" strokeWidth="1" fill="none" opacity="0.5" />
      </svg>
      <svg style={{ position: "absolute", bottom: 50, right: 15, opacity: 0.1, pointerEvents: "none", transform: "scaleX(-1) rotate(10deg)" }} width="70" height="75" viewBox="0 0 80 85" fill="none">
        <path d="M10 80 Q14 52 65 15 Q65 48 10 80Z" fill="var(--cherry-forest)" />
      </svg>

      <div style={{ maxWidth: 660, margin: "0 auto", paddingTop: "1rem", textAlign: "center" }}>
        {/* Header */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: "0.75rem" }}>
          <IconMail size={20} color="var(--cherry-warm-mid)" />
          <span style={{ fontFamily: "'Caveat', cursive", fontSize: "1rem", color: "var(--cherry-warm-mid)", fontWeight: 600 }}>留言小纸条</span>
        </div>

        <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "var(--cherry-warm-brown)", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", lineHeight: 1.3, marginBottom: "0.75rem" }}>
          说声 Hi 吧
        </h2>

        <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.7, fontSize: "0.95rem", maxWidth: 480, margin: "0 auto 2.5rem" }}>
          如果你想聊聊科学、课程、AI 工具，或者只是想说一声「你好」，都欢迎给我留言~ 我会认真读每一条。
        </p>

        {/* Note form card */}
        {!sent ? (
          <div
            style={{
              background: "var(--cherry-yellow-light)",
              border: "1.5px solid var(--cherry-yellow)",
              borderRadius: 22,
              padding: "2rem",
              boxShadow: "5px 8px 0px rgba(94,68,42,0.08)",
              textAlign: "left",
              position: "relative",
            }}
          >
            {/* Washi tapes */}
            <div style={{ position: "absolute", top: -13, left: "38%", width: 70, height: 18, background: "var(--cherry-peach)", opacity: 0.65, borderRadius: 3, transform: "rotate(-2.5deg)" }} />
            <div style={{ position: "absolute", top: -9, right: "20%", width: 48, height: 14, background: "var(--cherry-sage-light)", opacity: 0.7, borderRadius: 3, transform: "rotate(3.5deg)" }} />

            {/* Name */}
            <label style={{ fontFamily: "'Caveat', cursive", fontSize: "1rem", color: "var(--cherry-warm-brown)", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
              你的名字
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Cherry 会怎么叫你？"
              style={{
                width: "100%", background: "rgba(250,247,241,0.85)",
                border: "1.5px solid var(--cherry-yellow)", borderRadius: 10,
                padding: "0.65rem 1rem", fontSize: "0.9rem",
                fontFamily: "'Nunito', sans-serif", color: "var(--cherry-warm-brown)",
                outline: "none", marginBottom: "1.25rem", boxSizing: "border-box",
              }}
            />

            {/* Message */}
            <label style={{ fontFamily: "'Caveat', cursive", fontSize: "1rem", color: "var(--cherry-warm-brown)", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
              你想说什么
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="聊聊你感兴趣的话题、反馈，或者只是打个招呼都好~"
              style={{
                width: "100%", background: "rgba(250,247,241,0.85)",
                border: "1.5px solid var(--cherry-yellow)", borderRadius: 10,
                padding: "0.65rem 1rem", fontSize: "0.9rem",
                fontFamily: "'Nunito', sans-serif", color: "var(--cherry-warm-brown)",
                outline: "none", resize: "none", marginBottom: "1.5rem",
                boxSizing: "border-box", lineHeight: 1.65,
              }}
            />

            <button
              onClick={sendMail}
              disabled={!name.trim() || !message.trim()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: name.trim() && message.trim() ? "var(--cherry-forest)" : "var(--border)",
                color: name.trim() && message.trim() ? "#FAF7F1" : "var(--cherry-warm-mid)",
                border: "none",
                borderRadius: 999,
                padding: "0.7rem 2rem",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                fontSize: "0.93rem",
                cursor: name.trim() && message.trim() ? "pointer" : "not-allowed",
                transition: "background 0.2s, transform 0.15s",
                boxShadow: name.trim() && message.trim() ? "3px 4px 0px rgba(58,92,62,0.22)" : "none",
              }}
              onMouseEnter={(e) => { if (name.trim() && message.trim()) (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
            >
              <IconSend size={18} color={name.trim() && message.trim() ? "#FAF7F1" : "var(--cherry-warm-mid)"} />
              发送小纸条
            </button>
          </div>
        ) : (
          <div
            style={{
              background: "var(--cherry-sage-light)",
              border: "1.5px solid var(--cherry-sage)",
              borderRadius: 22,
              padding: "2.5rem",
              textAlign: "center",
              boxShadow: "5px 8px 0px rgba(94,68,42,0.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
              <IconCheck size={40} color="var(--cherry-forest)" />
            </div>
            <h3 style={{ fontFamily: "'Caveat', cursive", fontSize: "1.45rem", color: "var(--cherry-warm-brown)", fontWeight: 700, marginBottom: "0.5rem" }}>
              收到了！谢谢 {name} ~
            </h3>
            <p style={{ color: "var(--cherry-warm-mid)", fontSize: "0.9rem" }}>
              我会认真读你的留言，有空就回复你
            </p>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "0.75rem" }}>
              <IconLeaf size={28} color="var(--cherry-forest)" />
            </div>
          </div>
        )}

        {/* Social links */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "2.5rem", flexWrap: "wrap" }}>
          {socials.map((s) => (
            <a
              key={s.label}
              href="#"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                color: "var(--cherry-warm-mid)",
                textDecoration: "none",
                fontSize: "0.86rem", fontWeight: 600,
                padding: "0.4rem 1rem",
                background: "var(--card)",
                borderRadius: 999,
                border: "1.5px solid var(--border)",
                transition: "color 0.2s, border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--cherry-forest)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--cherry-sage)";
                (e.currentTarget as HTMLElement).style.background = "var(--cherry-sage-light)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--cherry-warm-mid)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.background = "var(--card)";
              }}
            >
              {s.icon} {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
