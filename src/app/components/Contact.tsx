import { useState } from "react";
import { IconGithub, IconMail } from "./Icons";
import { copyText } from "../clipboard";

const emailAddress = "liruirui321@gmail.com";
const mailSubject = "By Cherry 反馈";
const mailBody = "页面：\n说明：";

export function Contact() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const emailCopyStatusId = "contact-email-copy-status";
  const mailHref = `mailto:${emailAddress}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

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

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      style={{
        fontFamily: "'Nunito', sans-serif",
        padding: "1.35rem 1.5rem",
        background: "var(--muted)",
        borderTop: "1px solid rgba(94,68,42,0.1)",
      }}
    >
      <div className="contact-action-strip" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "0.85rem", alignItems: "center" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-mid)", fontSize: "0.8rem", fontWeight: 900, marginBottom: "0.22rem" }}>
            <IconMail size={17} color="var(--cherry-warm-mid)" />
            联系与反馈
          </div>
          <h2 id="contact-heading" style={{ margin: 0, color: "var(--cherry-warm-brown)", fontSize: "clamp(1.05rem, 2vw, 1.38rem)", lineHeight: 1.24, fontWeight: 900 }}>
            页面卡住、内容有误或想补资料，直接发邮件。
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.45rem", flexWrap: "wrap", minWidth: 0 }}>
          <span className="contact-email-chip" style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.78rem", overflowWrap: "anywhere" }}>
            {emailAddress}
          </span>
          <button type="button" onClick={copyEmail} aria-describedby={emailCopyStatusId} style={{ background: copiedEmail ? "var(--cherry-sage-light)" : "var(--cherry-forest)", color: copiedEmail ? "var(--cherry-forest)" : "#FAF7F1", border: copiedEmail ? "1.5px solid var(--cherry-sage)" : "1.5px solid var(--cherry-forest)", borderRadius: 999, padding: "0.42rem 0.72rem", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "0.76rem", cursor: "pointer" }}>
            {copiedEmail ? "已复制" : "复制邮箱"}
          </button>
          <a className="contact-mailto-link" href={mailHref} style={{ background: "var(--card)", color: "var(--cherry-forest)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.42rem 0.72rem", textDecoration: "none", fontWeight: 900, fontSize: "0.76rem" }}>
            打开邮件
          </a>
          <a className="contact-social-link" href="https://github.com/liruirui321" target="_blank" rel="noreferrer" aria-label="打开 Cherry 的 GitHub" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, color: "var(--cherry-forest)", background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 999 }}>
            <IconGithub size={16} />
          </a>
        </div>
      </div>
      <div id={emailCopyStatusId} role="status" aria-live="polite" style={{ maxWidth: 1100, margin: "0.35rem auto 0", minHeight: "1rem", color: "var(--cherry-forest)", fontSize: "0.72rem", fontWeight: 900 }}>
        {copyStatus}
      </div>

      <style>
        {`
          #contact button:focus-visible,
          #contact a:focus-visible {
            outline: 3px solid var(--cherry-red);
            outline-offset: 4px;
          }

          #contact button:hover,
          #contact .contact-mailto-link:hover,
          #contact .contact-social-link:hover {
            transform: translateY(-1px);
          }

          @media (max-width: 760px) {
            #contact .contact-action-strip {
              grid-template-columns: 1fr !important;
            }

            #contact .contact-action-strip > div:last-child {
              justify-content: flex-start !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            #contact button,
            #contact a {
              transition: none !important;
              transform: none !important;
            }
          }
        `}
      </style>
    </section>
  );
}
