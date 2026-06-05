import { type FormEvent, useState } from "react";
import { IconMail, IconSend, IconGithub } from "./Icons";
import { copyText } from "../clipboard";

const emailAddress = "liruirui321@gmail.com";

const contactPagePresets = [
  { label: "基因表达", href: "/works/gene-expression" },
  { label: "概念解释", href: "/works/concept-explainer" },
  { label: "科研 Agent", href: "/works/research-prompt-kit" },
  { label: "植物演化", href: "/works/plant-evolution-stories" },
  { label: "SciFusion", href: "/research/ai-assessment-quality-control" },
];

export function Contact() {
  const [name, setName] = useState("");
  const [relatedPage, setRelatedPage] = useState("/works/gene-expression");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [draftStatus, setDraftStatus] = useState("");

  const trimmedName = name.trim();
  const trimmedRelatedPage = relatedPage.trim();
  const trimmedMessage = message.trim();
  const canUseDraft = Boolean(trimmedName && trimmedMessage);
  const draftSubject = `By Cherry 反馈 - ${trimmedName || "未署名"}`;
  const draftBody = `相关页面：${trimmedRelatedPage || "未填写"}
具体内容：
${trimmedMessage || "（未填写内容）"}

来自：${trimmedName || "（未填写名字）"}`;
  const draftText = `收件人：${emailAddress}\n主题：${draftSubject}\n\n${draftBody}`;
  const emailCopyStatusId = "contact-email-copy-status";
  const formReadinessId = "contact-form-readiness";
  const draftCopyStatusId = "contact-draft-copy-status";

  function resetDraftStatus() {
    setSent(false);
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
      setDraftStatus("邮件内容已复制。");
      window.setTimeout(() => setCopiedDraft(false), 1400);
      return;
    }

    setCopiedDraft(false);
    setDraftStatus("复制失败，请手动复制邮件内容。");
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      style={{
        fontFamily: "'Nunito', sans-serif",
        padding: "2.6rem 1.5rem 2.2rem",
        background: "var(--muted)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", display: "block" }} viewBox="0 0 1440 28" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
        <path d="M0 14 Q180 0 360 14 Q540 28 720 14 Q900 0 1080 14 Q1260 28 1440 14 L1440 0 L0 0Z" fill="var(--background)" />
      </svg>

      <div style={{ maxWidth: 820, margin: "0 auto", paddingTop: "0.85rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.74fr) minmax(0, 1.26fr)", gap: "1rem", alignItems: "start" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: "0.58rem" }}>
              <IconMail size={19} color="var(--cherry-warm-mid)" />
              <span style={{ fontSize: "0.92rem", color: "var(--cherry-warm-mid)", fontWeight: 800 }}>联系与反馈</span>
            </div>
            <h2 id="contact-heading" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, color: "var(--cherry-warm-brown)", fontSize: "clamp(1.35rem, 2.8vw, 1.82rem)", lineHeight: 1.22, margin: "0 0 0.55rem" }}>
              联系 Cherry
            </h2>
            <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.62, fontSize: "0.86rem", margin: "0 0 0.85rem", fontWeight: 700 }}>
              页面卡住、内容有误或希望补充资料时，留下页面和具体说明就够了。
            </p>

            <div className="contact-email-chip" style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap", background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.38rem 0.48rem 0.38rem 0.78rem", boxShadow: "3px 5px 0px rgba(94,68,42,0.06)", maxWidth: "100%", boxSizing: "border-box" }}>
              <span style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.78rem", overflowWrap: "anywhere" }}>{emailAddress}</span>
              <button type="button" onClick={copyEmail} aria-describedby={emailCopyStatusId} style={{ background: copiedEmail ? "var(--cherry-sage-light)" : "var(--cherry-forest)", color: copiedEmail ? "var(--cherry-forest)" : "#FAF7F1", border: copiedEmail ? "1.5px solid var(--cherry-sage)" : "none", borderRadius: 999, padding: "0.3rem 0.62rem", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "0.72rem", cursor: "pointer" }}>
                {copiedEmail ? "已复制" : "复制"}
              </button>
            </div>
            <div id={emailCopyStatusId} role="status" aria-live="polite" style={{ minHeight: "1rem", color: "var(--cherry-forest)", fontSize: "0.72rem", fontWeight: 900, marginTop: "0.45rem" }}>
              {copyStatus}
            </div>

            <a
              className="contact-social-link"
              href="https://github.com/liruirui321"
              target="_blank"
              rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: "0.35rem", color: "var(--cherry-warm-mid)", textDecoration: "none", fontSize: "0.8rem", fontWeight: 800, padding: "0.34rem 0.72rem", background: "var(--card)", borderRadius: 999, border: "1.5px solid var(--border)" }}
            >
              <IconGithub size={16} /> GitHub
            </a>
          </div>

          <form
            className="contact-compact-form"
            onSubmit={sendMail}
            style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.95rem", boxShadow: "0 8px 18px rgba(94,68,42,0.06)", textAlign: "left", display: "grid", gap: "0.72rem" }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.72fr) minmax(0, 1fr)", gap: "0.65rem" }}>
              <label htmlFor="contact-name" style={{ color: "var(--cherry-warm-brown)", fontSize: "0.82rem", fontWeight: 900, display: "grid", gap: "0.32rem" }}>
                你的名字
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    resetDraftStatus();
                  }}
                  placeholder="姓名或称呼"
                  required
                  style={{ width: "100%", background: "rgba(250,247,241,0.85)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.58rem 0.72rem", fontSize: "0.84rem", fontFamily: "'Nunito', sans-serif", color: "var(--cherry-warm-brown)", boxSizing: "border-box" }}
                />
              </label>

              <label htmlFor="contact-related-page" style={{ color: "var(--cherry-warm-brown)", fontSize: "0.82rem", fontWeight: 900, display: "grid", gap: "0.32rem" }}>
                相关页面
                <input
                  id="contact-related-page"
                  name="related-page"
                  type="text"
                  value={relatedPage}
                  onChange={(event) => {
                    setRelatedPage(event.target.value);
                    resetDraftStatus();
                  }}
                  placeholder="/works/gene-expression"
                  style={{ width: "100%", background: "rgba(250,247,241,0.85)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.58rem 0.72rem", fontSize: "0.84rem", fontFamily: "'Nunito', sans-serif", color: "var(--cherry-warm-brown)", boxSizing: "border-box" }}
                />
              </label>
            </div>

            <div className="contact-page-presets" role="group" aria-label="选择常见反馈页面" style={{ display: "flex", flexWrap: "wrap", gap: "0.38rem" }}>
              {contactPagePresets.map((preset) => (
                <button
                  key={preset.href}
                  type="button"
                  aria-pressed={relatedPage === preset.href}
                  onClick={() => {
                    setRelatedPage(preset.href);
                    resetDraftStatus();
                  }}
                  style={{ background: relatedPage === preset.href ? "var(--cherry-sage-light)" : "rgba(250,247,241,0.82)", color: relatedPage === preset.href ? "var(--cherry-forest)" : "var(--cherry-warm-mid)", border: relatedPage === preset.href ? "1.5px solid var(--cherry-sage)" : "1.5px solid var(--border)", borderRadius: 999, padding: "0.24rem 0.58rem", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "0.7rem", cursor: "pointer" }}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <label htmlFor="contact-message" style={{ color: "var(--cherry-warm-brown)", fontSize: "0.82rem", fontWeight: 900, display: "grid", gap: "0.32rem" }}>
              具体内容
              <textarea
                id="contact-message"
                name="message"
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  resetDraftStatus();
                }}
                rows={4}
                placeholder="写下页面里哪里卡住、哪里不准确，或希望补充什么。"
                required
                style={{ width: "100%", background: "rgba(250,247,241,0.85)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.62rem 0.72rem", fontSize: "0.84rem", fontFamily: "'Nunito', sans-serif", color: "var(--cherry-warm-brown)", resize: "vertical", boxSizing: "border-box", lineHeight: 1.55, minHeight: 108 }}
              />
            </label>

            <div className="contact-action-row" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <button
                className="contact-submit"
                type="submit"
                disabled={!canUseDraft}
                aria-describedby={formReadinessId}
                style={{ display: "inline-flex", alignItems: "center", gap: 7, background: canUseDraft ? "var(--cherry-forest)" : "var(--border)", color: canUseDraft ? "#FAF7F1" : "var(--cherry-warm-mid)", border: "none", borderRadius: 999, padding: "0.56rem 1rem", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "0.82rem", cursor: canUseDraft ? "pointer" : "not-allowed", boxShadow: canUseDraft ? "3px 4px 0px rgba(58,92,62,0.22)" : "none" }}
              >
                <IconSend size={16} color={canUseDraft ? "#FAF7F1" : "var(--cherry-warm-mid)"} />
                打开邮件草稿
              </button>
              <button
                className="contact-copy-draft"
                type="button"
                onClick={copyDraft}
                disabled={!canUseDraft}
                aria-describedby={`${formReadinessId} ${draftCopyStatusId}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 7, background: copiedDraft ? "var(--cherry-sage-light)" : "var(--card)", color: canUseDraft ? "var(--cherry-forest)" : "var(--cherry-warm-mid)", border: copiedDraft ? "1.5px solid var(--cherry-sage)" : "1.5px solid var(--border)", borderRadius: 999, padding: "0.54rem 0.86rem", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "0.8rem", cursor: canUseDraft ? "pointer" : "not-allowed" }}
              >
                {copiedDraft ? "已复制" : "复制内容"}
              </button>
              {sent ? (
                <span style={{ color: "var(--cherry-forest)", fontSize: "0.76rem", fontWeight: 900 }}>邮件草稿已打开。</span>
              ) : null}
            </div>
            <div id={formReadinessId} role="status" aria-live="polite" style={{ minHeight: "1rem", color: canUseDraft ? "var(--cherry-forest)" : "var(--cherry-warm-mid)", fontSize: "0.72rem", fontWeight: 900 }}>
              {canUseDraft ? "可以打开邮件草稿。" : "写下名字和具体内容后即可发送。"}
            </div>
            <div id={draftCopyStatusId} role="status" aria-live="polite" style={{ minHeight: "1rem", color: "var(--cherry-forest)", fontSize: "0.72rem", fontWeight: 900 }}>
              {draftStatus}
            </div>
          </form>
        </div>
      </div>

      <style>
        {`
          #contact input:focus-visible,
          #contact textarea:focus-visible,
          #contact button:focus-visible,
          #contact .contact-social-link:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          #contact .contact-submit:not(:disabled):hover,
          #contact .contact-submit:not(:disabled):focus-visible,
          #contact .contact-copy-draft:not(:disabled):hover,
          #contact .contact-copy-draft:not(:disabled):focus-visible,
          #contact .contact-social-link:hover,
          #contact .contact-social-link:focus-visible {
            transform: translateY(-2px);
          }

          #contact .contact-social-link:hover,
          #contact .contact-social-link:focus-visible {
            color: var(--cherry-forest) !important;
            border-color: var(--cherry-sage) !important;
            background: var(--cherry-sage-light) !important;
          }

          @media (max-width: 720px) {
            #contact > div > div {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 560px) {
            #contact .contact-compact-form > div:first-child {
              grid-template-columns: 1fr !important;
            }

            #contact .contact-email-chip,
            #contact .contact-action-row,
            #contact .contact-submit,
            #contact .contact-copy-draft {
              width: 100% !important;
              justify-content: center !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            #contact .contact-submit,
            #contact .contact-copy-draft,
            #contact .contact-social-link {
              transition: none !important;
              transform: none !important;
            }
          }
        `}
      </style>
    </section>
  );
}
