import { type FormEvent, useState } from "react";
import { IconMail, IconSend, IconGithub } from "./Icons";
import { copyText } from "../clipboard";

const emailAddress = "liruirui321@gmail.com";

export function Contact() {
  const [name, setName] = useState("");
  const [feedbackType, setFeedbackType] = useState("内容卡住");
  const [relatedPage, setRelatedPage] = useState("/works/gene-expression");
  const [stuckPoint, setStuckPoint] = useState("");
  const [triedAction, setTriedAction] = useState("");
  const [expectedOutcome, setExpectedOutcome] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [copiedFeedbackChecklist, setCopiedFeedbackChecklist] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [draftStatus, setDraftStatus] = useState("");

  const trimmedName = name.trim();
  const trimmedRelatedPage = relatedPage.trim();
  const trimmedStuckPoint = stuckPoint.trim();
  const trimmedTriedAction = triedAction.trim();
  const trimmedExpectedOutcome = expectedOutcome.trim();
  const trimmedMessage = message.trim();
  const canUseDraft = Boolean(trimmedName && trimmedMessage);
  const feedbackTypes = ["内容卡住", "页面问题", "工具建议", "资料补充", "合作讨论"];
  const contactPagePresets = [
    { label: "基因表达", href: "/works/gene-expression" },
    { label: "概念解释", href: "/works/concept-explainer" },
    { label: "科研 Agent", href: "/works/research-prompt-kit" },
    { label: "植物演化", href: "/works/plant-evolution-stories" },
    { label: "SciFusion", href: "/research/ai-assessment-quality-control" },
  ];
  const draftSubject = `By Cherry ${feedbackType} - ${trimmedName || "未署名"}`;
  const draftBody = `反馈类型：${feedbackType}
相关页面：${trimmedRelatedPage || "未填写"}
当前卡点：${trimmedStuckPoint || "未填写"}
已经尝试：${trimmedTriedAction || "未填写"}
希望得到：${trimmedExpectedOutcome || "未填写"}

具体内容：
${trimmedMessage || "（未填写内容）"}

来自：${trimmedName || "（未填写名字）"}`;
  const draftText = `收件人：${emailAddress}\n主题：${draftSubject}\n\n${draftBody}`;
  const emailCopyStatusId = "contact-email-copy-status";
  const formReadinessId = "contact-form-readiness";
  const formDraftCopyStatusId = "contact-form-draft-copy-status";
  const sentDraftCopyStatusId = "contact-sent-draft-copy-status";
  const formReadinessText = canUseDraft ? "结构化邮件草稿已准备好，也可以先复制一份备份。" : "写下名字和具体内容后，就可以打开邮件草稿。";
  const feedbackQualityItems = [
    {
      label: "相关页面",
      pass: trimmedRelatedPage.length >= 6,
      help: "写清具体页面路径或选择常见页面。",
    },
    {
      label: "当前卡点",
      pass: trimmedStuckPoint.length >= 8,
      help: "说明卡在哪里，而不是只写“看不懂”。",
    },
    {
      label: "已经尝试",
      pass: trimmedTriedAction.length >= 10,
      help: "写出已经点过、拖过、复制过或读过什么。",
    },
    {
      label: "希望得到",
      pass: trimmedExpectedOutcome.length >= 10,
      help: "说明希望页面补什么、改什么或解释到什么程度。",
    },
    {
      label: "具体内容",
      pass: trimmedMessage.length >= 18,
      help: "补充具体例子、现象或建议。",
    },
  ];
  const feedbackQualityScore = feedbackQualityItems.filter((item) => item.pass).length;
  const feedbackChecklistText = `【By Cherry 反馈核查单】
反馈类型：${feedbackType}
相关页面：${trimmedRelatedPage || "未填写"}
当前卡点：${trimmedStuckPoint || "未填写"}
已经尝试：${trimmedTriedAction || "未填写"}
希望得到：${trimmedExpectedOutcome || "未填写"}
具体内容：${trimmedMessage || "未填写"}

可处理度：${feedbackQualityScore}/5
${feedbackQualityItems.map((item, index) => `${index + 1}. ${item.label}：${item.pass ? "可用" : "待补充"}｜${item.help}`).join("\n")}

发送前确认
1. 我已经写清页面位置。
2. 我已经写清具体卡点。
3. 我已经说明自己尝试过什么。
4. 我已经写出希望得到的改进结果。
5. 我已经保留具体例子或现象。`;

  function clearDraftStatus() {
    setCopiedDraft(false);
    setCopiedFeedbackChecklist(false);
    setDraftStatus("");
  }

  function resetContactForm() {
    setSent(false);
    setCopiedEmail(false);
    setCopyStatus("");
    clearDraftStatus();
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
      setCopiedFeedbackChecklist(false);
      setDraftStatus("信息内容已复制。");
      window.setTimeout(() => setCopiedDraft(false), 1400);
      return;
    }

    setCopiedDraft(false);
    setDraftStatus("复制失败，请手动复制信息内容。");
  }

  async function copyFeedbackChecklist() {
    const copiedToClipboard = await copyText(feedbackChecklistText);
    if (copiedToClipboard) {
      setCopiedFeedbackChecklist(true);
      setCopiedDraft(false);
      setDraftStatus("反馈核查单已复制。");
      window.setTimeout(() => setCopiedFeedbackChecklist(false), 1400);
      return;
    }

    setCopiedFeedbackChecklist(false);
    setDraftStatus("复制失败，请手动复制反馈核查单。");
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
          <span style={{ fontSize: "1rem", color: "var(--cherry-warm-mid)", fontWeight: 600 }}>联系与反馈</span>
        </div>

        <h2 id="contact-heading" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "var(--cherry-warm-brown)", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", lineHeight: 1.3, marginBottom: "0.75rem" }}>
          联系 Cherry
        </h2>

        <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.7, fontSize: "0.95rem", maxWidth: 480, margin: "0 auto 2.5rem" }}>
          如果你在某个页面卡住、发现问题或想补充资料，可以把页面、卡点和建议一起发来，方便继续改进内容。
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
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 8,
              padding: "1.45rem",
              boxShadow: "0 8px 18px rgba(94,68,42,0.06)",
              textAlign: "left",
              position: "relative",
            }}
          >
            {/* Name */}
            <label htmlFor="contact-name" style={{ fontSize: "1rem", color: "var(--cherry-warm-brown)", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
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
              placeholder="你的姓名或称呼"
              required
              style={{
                width: "100%", background: "rgba(250,247,241,0.85)",
                border: "1.5px solid var(--border)", borderRadius: 8,
                padding: "0.65rem 1rem", fontSize: "0.9rem",
                fontFamily: "'Nunito', sans-serif", color: "var(--cherry-warm-brown)",
                marginBottom: "1.25rem", boxSizing: "border-box",
              }}
            />

            <div className="contact-feedback-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.72fr) minmax(0, 1fr)", gap: "0.8rem", marginBottom: "1.25rem" }}>
              <label htmlFor="contact-feedback-type" style={{ fontSize: "1rem", color: "var(--cherry-warm-brown)", fontWeight: 600, display: "grid", gap: "0.4rem" }}>
                反馈类型
                <select
                  id="contact-feedback-type"
                  name="feedback-type"
                  value={feedbackType}
                  onChange={(e) => {
                    setFeedbackType(e.target.value);
                    clearDraftStatus();
                  }}
                  style={{
                    width: "100%", background: "rgba(250,247,241,0.85)",
                    border: "1.5px solid var(--border)", borderRadius: 8,
                    padding: "0.65rem 1rem", fontSize: "0.9rem",
                    fontFamily: "'Nunito', sans-serif", color: "var(--cherry-warm-brown)",
                    boxSizing: "border-box",
                  }}
                >
                  {feedbackTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label htmlFor="contact-related-page" style={{ fontSize: "1rem", color: "var(--cherry-warm-brown)", fontWeight: 600, display: "grid", gap: "0.4rem" }}>
                相关页面
                <input
                  id="contact-related-page"
                  name="related-page"
                  type="text"
                  value={relatedPage}
                  onChange={(e) => {
                    setRelatedPage(e.target.value);
                    clearDraftStatus();
                  }}
                  placeholder="/works/gene-expression"
                  style={{
                    width: "100%", background: "rgba(250,247,241,0.85)",
                    border: "1.5px solid var(--border)", borderRadius: 8,
                    padding: "0.65rem 1rem", fontSize: "0.9rem",
                    fontFamily: "'Nunito', sans-serif", color: "var(--cherry-warm-brown)",
                    boxSizing: "border-box",
                  }}
                />
              </label>
            </div>

            <div className="contact-page-presets" role="group" aria-label="选择常见反馈页面" style={{ display: "flex", flexWrap: "wrap", gap: "0.42rem", marginTop: "-0.85rem", marginBottom: "1.15rem" }}>
              {contactPagePresets.map((preset) => (
                <button
                  key={preset.href}
                  type="button"
                  aria-pressed={relatedPage === preset.href}
                  onClick={() => {
                    setRelatedPage(preset.href);
                    clearDraftStatus();
                  }}
                  style={{
                    background: relatedPage === preset.href ? "var(--cherry-sage-light)" : "rgba(250,247,241,0.82)",
                    color: relatedPage === preset.href ? "var(--cherry-forest)" : "var(--cherry-warm-mid)",
                    border: relatedPage === preset.href ? "1.5px solid var(--cherry-sage)" : "1.5px solid var(--border)",
                    borderRadius: 999,
                    padding: "0.28rem 0.68rem",
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 900,
                    fontSize: "0.76rem",
                    cursor: "pointer",
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <label htmlFor="contact-stuck-point" style={{ fontSize: "1rem", color: "var(--cherry-warm-brown)", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
              当前卡点
            </label>
            <input
              id="contact-stuck-point"
              name="stuck-point"
              type="text"
              value={stuckPoint}
              onChange={(e) => {
                setStuckPoint(e.target.value);
                clearDraftStatus();
              }}
              placeholder="例如：mRNA 和核糖体的关系还是没看懂"
              style={{
                width: "100%", background: "rgba(250,247,241,0.85)",
                border: "1.5px solid var(--border)", borderRadius: 8,
                padding: "0.65rem 1rem", fontSize: "0.9rem",
                fontFamily: "'Nunito', sans-serif", color: "var(--cherry-warm-brown)",
                marginBottom: "1.25rem", boxSizing: "border-box",
              }}
            />

            <div className="contact-learning-context-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.8rem", marginBottom: "1.25rem" }}>
              <label htmlFor="contact-tried-action" style={{ fontSize: "1rem", color: "var(--cherry-warm-brown)", fontWeight: 600, display: "grid", gap: "0.4rem" }}>
                已经尝试
                <textarea
                  id="contact-tried-action"
                  name="tried-action"
                  value={triedAction}
                  onChange={(e) => {
                    setTriedAction(e.target.value);
                    clearDraftStatus();
                  }}
                  rows={3}
                  placeholder="例如：拖过 RNA 聚合酶，也复制了表达过程记录"
                  style={{
                    width: "100%", background: "rgba(250,247,241,0.85)",
                    border: "1.5px solid var(--border)", borderRadius: 8,
                    padding: "0.65rem 1rem", fontSize: "0.9rem",
                    fontFamily: "'Nunito', sans-serif", color: "var(--cherry-warm-brown)",
                    boxSizing: "border-box", lineHeight: 1.6, resize: "vertical",
                  }}
                />
              </label>
              <label htmlFor="contact-expected-outcome" style={{ fontSize: "1rem", color: "var(--cherry-warm-brown)", fontWeight: 600, display: "grid", gap: "0.4rem" }}>
                希望得到
                <textarea
                  id="contact-expected-outcome"
                  name="expected-outcome"
                  value={expectedOutcome}
                  onChange={(e) => {
                    setExpectedOutcome(e.target.value);
                    clearDraftStatus();
                  }}
                  rows={3}
                  placeholder="例如：希望页面更明确显示核糖体从哪里开始翻译"
                  style={{
                    width: "100%", background: "rgba(250,247,241,0.85)",
                    border: "1.5px solid var(--border)", borderRadius: 8,
                    padding: "0.65rem 1rem", fontSize: "0.9rem",
                    fontFamily: "'Nunito', sans-serif", color: "var(--cherry-warm-brown)",
                    boxSizing: "border-box", lineHeight: 1.6, resize: "vertical",
                  }}
                />
              </label>
            </div>

            {/* Message */}
            <label htmlFor="contact-message" style={{ fontSize: "1rem", color: "var(--cherry-warm-brown)", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
              具体内容
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
              placeholder="写下你遇到的问题、希望补充的内容，或希望我优先改进的地方"
              required
              style={{
                width: "100%", background: "rgba(250,247,241,0.85)",
                border: "1.5px solid var(--border)", borderRadius: 8,
                padding: "0.65rem 1rem", fontSize: "0.9rem",
                fontFamily: "'Nunito', sans-serif", color: "var(--cherry-warm-brown)",
                resize: "none", marginBottom: "1.5rem",
                boxSizing: "border-box", lineHeight: 1.65,
              }}
            />

            <div className="contact-feedback-quality-panel" style={{ background: "var(--muted)", border: "1.5px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.78rem", marginBottom: "1.2rem", display: "grid", gap: "0.62rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <div style={{ color: "var(--cherry-warm-brown)", fontSize: "0.86rem", fontWeight: 900 }}>反馈可处理度</div>
                  <div style={{ color: "var(--cherry-warm-mid)", fontSize: "0.74rem", lineHeight: 1.5, marginTop: "0.16rem", fontWeight: 800 }}>
                    尽量把页面、卡点、尝试、期待和例子写清楚，后续才容易改进。
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ background: feedbackQualityScore >= 4 ? "var(--cherry-sage-light)" : "var(--cherry-yellow-light)", border: feedbackQualityScore >= 4 ? "1.5px solid var(--cherry-sage)" : "1.5px solid var(--cherry-yellow)", borderRadius: 999, padding: "0.28rem 0.62rem", color: feedbackQualityScore >= 4 ? "var(--cherry-forest)" : "var(--cherry-warm-brown)", fontSize: "0.72rem", fontWeight: 900 }}>
                    {feedbackQualityScore}/5 可用
                  </span>
                  <button type="button" onClick={copyFeedbackChecklist} aria-describedby={formDraftCopyStatusId} style={{ background: "var(--card)", color: "var(--cherry-forest)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "0.34rem 0.68rem", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "0.76rem", cursor: "pointer" }}>
                    {copiedFeedbackChecklist ? "已复制" : "复制核查单"}
                  </button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.48rem" }}>
                {feedbackQualityItems.map((item) => (
                  <div key={item.label} style={{ background: item.pass ? "var(--cherry-sage-light)" : "rgba(250,247,241,0.82)", border: item.pass ? "1.5px solid rgba(93,140,101,0.22)" : "1.5px solid rgba(94,68,42,0.1)", borderRadius: 8, padding: "0.52rem", display: "grid", gap: "0.22rem", minHeight: 94 }}>
                    <span style={{ display: "flex", justifyContent: "space-between", gap: "0.45rem", color: "var(--cherry-warm-brown)", fontSize: "0.72rem", fontWeight: 900 }}>
                      {item.label}
                      <span style={{ color: item.pass ? "var(--cherry-forest)" : "var(--cherry-red)" }}>{item.pass ? "可用" : "待补"}</span>
                    </span>
                    <span style={{ color: "var(--cherry-warm-mid)", fontSize: "0.68rem", lineHeight: 1.42, fontWeight: 800 }}>{item.help}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="contact-action-row" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <button
                className="contact-submit"
                type="submit"
                disabled={!canUseDraft}
                aria-describedby="contact-form-readiness"
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
                打开邮件草稿
              </button>
              <button
                className="contact-copy-draft"
                type="button"
                onClick={copyDraft}
                disabled={!canUseDraft}
                aria-describedby="contact-form-readiness contact-form-draft-copy-status"
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
                {copiedDraft ? "已复制内容" : "复制信息内容"}
              </button>
            </div>
            <div id={formReadinessId} role="status" aria-live="polite" style={{ minHeight: "1.05rem", color: canUseDraft ? "var(--cherry-forest)" : "var(--cherry-warm-mid)", fontSize: "0.78rem", fontWeight: 900, marginTop: "0.65rem" }}>
              {formReadinessText}
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
              borderRadius: 8,
              padding: "2rem",
              textAlign: "center",
              boxShadow: "0 8px 18px rgba(94,68,42,0.06)",
            }}
          >
            <div aria-hidden="true" style={{ width: 42, height: 42, borderRadius: 999, background: "var(--cherry-forest)", color: "#FAF7F1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", fontWeight: 900, marginBottom: "0.8rem" }}>
              ✓
            </div>
            <h3 style={{ fontSize: "1.45rem", color: "var(--cherry-warm-brown)", fontWeight: 700, marginBottom: "0.5rem" }}>
              邮件草稿已打开，谢谢 {name}
            </h3>
            <p style={{ color: "var(--cherry-warm-mid)", fontSize: "0.9rem" }}>
              确认内容后在邮件客户端发送，我就能收到你的信息。
            </p>
            <button
              className="contact-reset"
              type="button"
              onClick={resetContactForm}
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
              继续修改内容
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
              {copiedDraft ? "已复制内容" : "复制信息内容"}
            </button>
            <div id={sentDraftCopyStatusId} role="status" aria-live="polite" style={{ minHeight: "1.05rem", color: "var(--cherry-forest)", fontSize: "0.78rem", fontWeight: 900, marginTop: "0.55rem" }}>
              {draftStatus}
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
          #contact select:focus-visible,
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
            #contact .contact-feedback-grid,
            #contact .contact-learning-context-grid {
              grid-template-columns: 1fr !important;
            }

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
