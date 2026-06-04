import { type FormEvent, useState } from "react";
import { IconMail, IconSend, IconGithub, IconLeaf, IconCheck } from "./Icons";
import { copyText } from "../clipboard";

const emailAddress = "liruirui321@gmail.com";

export function Contact() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [draftStatus, setDraftStatus] = useState("");

  const trimmedName = name.trim();
  const trimmedMessage = message.trim();
  const canUseDraft = Boolean(trimmedName && trimmedMessage);
  const draftSubject = `By Cherry 留言 - ${trimmedName || "未署名"}`;
  const draftBody = `${trimmedMessage || "（未填写留言）"}\n\n来自：${trimmedName || "（未填写名字）"}`;
  const draftText = `收件人：${emailAddress}\n主题：${draftSubject}\n\n${draftBody}`;
  const emailCopyStatusId = "contact-email-copy-status";
  const formDraftCopyStatusId = "contact-form-draft-copy-status";
  const sentDraftCopyStatusId = "contact-sent-draft-copy-status";

  function clearDraftStatus() {
    setCopiedDraft(false);
    setDraftStatus("");
  }

  function sendMail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canUseDraft) return;
    const subject = encodeURIComponent(draftSubject);
    const body = encodeURIComponent(draftBody);
    window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  async function copyEmail() {
    const copiedToClipboard = await copyText(emailAddress);
    if (copiedToClipboard) {
      setCopiedEmail(true);
      setCopyStatus("邮箱已复制。");
      window.setTimeout(() => setCopiedEmail(false), 1400);
      return;
    }

    setCopiedEmail(false);
    setCopyStatus("复制失败，请手动复制邮箱。");
  }

  async function copyDraft() {
    if (!canUseDraft) return;
    const copiedToClipboard = await copyText(draftText);
    if (copiedToClipboard) {
      setCopiedDraft(true);
      setDraftStatus("留言内容已复制。");
      window.setTimeout(() => setCopiedDraft(false), 1400);
      return;
    }

    setCopiedDraft(false);
    setDraftStatus("复制失败，请手动复制留言内容。");
  }

  const socials = [
    { icon: <IconMail size={17} />, label: "Email", href: `mailto:${emailAddress}` },
    { icon: <IconGithub size={17} />, label: "GitHub", href: "https://github.com/liruirui321" },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      style={{
        fontFamily: "'Nunito', sans-serif",
        padding: "5rem 1.5rem 4rem",
        background: "var(--muted)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Wave top */}
      <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", display: "block" }} viewBox="0 0 1440 28" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
        <path d="M0 14 Q180 0 360 14 Q540 28 720 14 Q900 0 1080 14 Q1260 28 1440 14 L1440 0 L0 0Z" fill="var(--background)" />
      </svg>

      {/* Forest deco leaves */}
      <svg style={{ position: "absolute", top: 40, left: 10, opacity: 0.1, pointerEvents: "none", transform: "rotate(-15deg)" }} width="80" height="85" viewBox="0 0 80 85" fill="none" aria-hidden="true" focusable="false">
        <path d="M10 80 Q14 52 65 15 Q65 48 10 80Z" fill="var(--cherry-forest)" />
        <path d="M10 80 Q36 56 65 15" stroke="var(--cherry-forest)" strokeWidth="1" fill="none" opacity="0.5" />
      </svg>
      <svg style={{ position: "absolute", bottom: 50, right: 15, opacity: 0.1, pointerEvents: "none", transform: "scaleX(-1) rotate(10deg)" }} width="70" height="75" viewBox="0 0 80 85" fill="none" aria-hidden="true" focusable="false">
        <path d="M10 80 Q14 52 65 15 Q65 48 10 80Z" fill="var(--cherry-forest)" />
      </svg>

      <div style={{ maxWidth: 660, margin: "0 auto", paddingTop: "1rem", textAlign: "center" }}>
        {/* Header */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: "0.75rem" }}>
          <IconMail size={20} color="var(--cherry-warm-mid)" />
          <span style={{ fontFamily: "'Caveat', cursive", fontSize: "1rem", color: "var(--cherry-warm-mid)", fontWeight: 600 }}>留言小纸条</span>
        </div>

        <h2 id="contact-heading" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "var(--cherry-warm-brown)", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", lineHeight: 1.3, marginBottom: "0.75rem" }}>
          说声 Hi 吧
        </h2>

        <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.7, fontSize: "0.95rem", maxWidth: 480, margin: "0 auto 2.5rem" }}>
          如果你想聊聊科学、课程、AI 工具，或者只是想说一声「你好」，都欢迎给我留言~ 我会认真读每一条。
        </p>

        <div className="contact-email-chip" style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center", background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.42rem 0.52rem 0.42rem 0.9rem", marginBottom: "1.4rem", boxShadow: "3px 5px 0px rgba(94,68,42,0.06)", maxWidth: "100%", boxSizing: "border-box" }}>
          <span style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.84rem", overflowWrap: "anywhere" }}>{emailAddress}</span>
          <button type="button" onClick={copyEmail} aria-describedby={emailCopyStatusId} style={{ background: copiedEmail ? "var(--cherry-sage-light)" : "var(--cherry-forest)", color: copiedEmail ? "var(--cherry-forest)" : "#FAF7F1", border: copiedEmail ? "1.5px solid var(--cherry-sage)" : "none", borderRadius: 999, padding: "0.38rem 0.78rem", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "0.78rem", cursor: "pointer" }}>
            {copiedEmail ? "已复制" : "复制邮箱"}
          </button>
        </div>
        <div id={emailCopyStatusId} role="status" aria-live="polite" style={{ minHeight: "1.05rem", color: "var(--cherry-forest)", fontSize: "0.78rem", fontWeight: 900, marginTop: "-1rem", marginBottom: "0.9rem" }}>
          {copyStatus}
        </div>

        {/* Note form card */}
        {!sent ? (
          <form
            onSubmit={sendMail}
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
            <label htmlFor="contact-name" style={{ fontFamily: "'Caveat', cursive", fontSize: "1rem", color: "var(--cherry-warm-brown)", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
              你的名字
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearDraftStatus();
              }}
              placeholder="Cherry 会怎么叫你？"
              required
              style={{
                width: "100%", background: "rgba(250,247,241,0.85)",
                border: "1.5px solid var(--cherry-yellow)", borderRadius: 10,
                padding: "0.65rem 1rem", fontSize: "0.9rem",
                fontFamily: "'Nunito', sans-serif", color: "var(--cherry-warm-brown)",
                marginBottom: "1.25rem", boxSizing: "border-box",
              }}
            />

            {/* Message */}
            <label htmlFor="contact-message" style={{ fontFamily: "'Caveat', cursive", fontSize: "1rem", color: "var(--cherry-warm-brown)", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
              你想说什么
            </label>
            <textarea
              id="contact-message"
              name="message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                clearDraftStatus();
              }}
              rows={4}
              placeholder="聊聊你感兴趣的话题、反馈，或者只是打个招呼都好~"
              required
              style={{
                width: "100%", background: "rgba(250,247,241,0.85)",
                border: "1.5px solid var(--cherry-yellow)", borderRadius: 10,
                padding: "0.65rem 1rem", fontSize: "0.9rem",
                fontFamily: "'Nunito', sans-serif", color: "var(--cherry-warm-brown)",
                resize: "none", marginBottom: "1.5rem",
                boxSizing: "border-box", lineHeight: 1.65,
              }}
            />

            <div className="contact-action-row" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <button
                className="contact-submit"
                type="submit"
                disabled={!canUseDraft}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: canUseDraft ? "var(--cherry-forest)" : "var(--border)",
                  color: canUseDraft ? "#FAF7F1" : "var(--cherry-warm-mid)",
                  border: "none",
                  borderRadius: 999,
                  padding: "0.7rem 2rem",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.93rem",
                  cursor: canUseDraft ? "pointer" : "not-allowed",
                  transition: "background 0.2s, transform 0.15s",
                  boxShadow: canUseDraft ? "3px 4px 0px rgba(58,92,62,0.22)" : "none",
                }}
              >
                <IconSend size={18} color={canUseDraft ? "#FAF7F1" : "var(--cherry-warm-mid)"} />
                发送小纸条
              </button>
              <button
                className="contact-copy-draft"
                type="button"
                onClick={copyDraft}
                disabled={!canUseDraft}
                aria-describedby={formDraftCopyStatusId}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: copiedDraft ? "var(--cherry-sage-light)" : "var(--card)",
                  color: canUseDraft ? "var(--cherry-forest)" : "var(--cherry-warm-mid)",
                  border: copiedDraft ? "1.5px solid var(--cherry-sage)" : "1.5px solid var(--border)",
                  borderRadius: 999,
                  padding: "0.68rem 1rem",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 900,
                  fontSize: "0.86rem",
                  cursor: canUseDraft ? "pointer" : "not-allowed",
                  transition: "background 0.2s, transform 0.15s",
                }}
              >
                {copiedDraft ? "已复制留言" : "复制留言内容"}
              </button>
            </div>
            <div id={formDraftCopyStatusId} role="status" aria-live="polite" style={{ minHeight: "1.05rem", color: "var(--cherry-forest)", fontSize: "0.78rem", fontWeight: 900, marginTop: "0.65rem" }}>
              {draftStatus}
            </div>
          </form>
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
              邮件草稿已打开，谢谢 {name} ~
            </h3>
            <p style={{ color: "var(--cherry-warm-mid)", fontSize: "0.9rem" }}>
              确认内容后在邮件客户端发送，我就能收到你的留言
            </p>
            <button
              className="contact-reset"
              type="button"
              onClick={() => {
                setSent(false);
                clearDraftStatus();
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginTop: "1rem",
                background: "var(--card)",
                color: "var(--cherry-forest)",
                border: "1.5px solid var(--cherry-sage)",
                borderRadius: 999,
                padding: "0.58rem 1rem",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 900,
                fontSize: "0.84rem",
                cursor: "pointer",
                transition: "background 0.2s, transform 0.15s",
              }}
            >
              继续修改留言
            </button>
            <button
              className="contact-copy-draft"
              type="button"
              onClick={copyDraft}
              aria-describedby={sentDraftCopyStatusId}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginTop: "0.7rem",
                background: copiedDraft ? "var(--cherry-sage-light)" : "var(--card)",
                color: "var(--cherry-forest)",
                border: copiedDraft ? "1.5px solid var(--cherry-sage)" : "1.5px solid var(--border)",
                borderRadius: 999,
                padding: "0.58rem 1rem",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 900,
                fontSize: "0.84rem",
                cursor: "pointer",
                transition: "background 0.2s, transform 0.15s",
              }}
            >
              {copiedDraft ? "已复制留言" : "复制留言内容"}
            </button>
            <div id={sentDraftCopyStatusId} role="status" aria-live="polite" style={{ minHeight: "1.05rem", color: "var(--cherry-forest)", fontSize: "0.78rem", fontWeight: 900, marginTop: "0.55rem" }}>
              {draftStatus}
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "0.75rem" }}>
              <IconLeaf size={28} color="var(--cherry-forest)" />
            </div>
          </div>
        )}

        {/* Social links */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "2.5rem", flexWrap: "wrap" }}>
          {socials.map((s) => (
            <a
              className="contact-social-link"
              key={s.label}
              href={s.href}
              target={s.href.startsWith("https://") ? "_blank" : undefined}
              rel={s.href.startsWith("https://") ? "noreferrer" : undefined}
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
            >
              {s.icon} {s.label}
            </a>
          ))}
        </div>
      </div>

      <style>
        {`
          #contact input:focus-visible,
          #contact textarea:focus-visible,
          #contact button:focus-visible,
          #contact .contact-submit:focus-visible,
          #contact .contact-reset:focus-visible,
          #contact .contact-copy-draft:focus-visible,
          #contact .contact-social-link:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          #contact .contact-submit:not(:disabled):hover,
          #contact .contact-submit:not(:disabled):focus-visible,
          #contact .contact-reset:hover,
          #contact .contact-reset:focus-visible,
          #contact .contact-copy-draft:not(:disabled):hover,
          #contact .contact-copy-draft:not(:disabled):focus-visible {
            transform: translateY(-2px);
          }

          #contact .contact-reset:hover,
          #contact .contact-reset:focus-visible {
            background: var(--cherry-yellow-light) !important;
          }

          #contact .contact-social-link:hover,
          #contact .contact-social-link:focus-visible {
            color: var(--cherry-forest) !important;
            border-color: var(--cherry-sage) !important;
            background: var(--cherry-sage-light) !important;
          }

          @media (prefers-reduced-motion: reduce) {
            #contact .contact-submit,
            #contact .contact-reset,
            #contact .contact-copy-draft,
            #contact .contact-social-link {
              transition: none !important;
              transform: none !important;
            }
          }

          @media (max-width: 560px) {
            #contact .contact-email-chip {
              border-radius: 18px !important;
              width: 100% !important;
            }

            #contact .contact-action-row,
            #contact .contact-submit,
            #contact .contact-copy-draft,
            #contact .contact-reset {
              width: 100% !important;
              justify-content: center !important;
            }
          }
        `}
      </style>
    </section>
  );
}
