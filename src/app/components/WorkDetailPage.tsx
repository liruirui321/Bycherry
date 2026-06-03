import { GeneExpressionTool } from "./GeneExpressionTool";
import { IconArrowRight, IconBook, IconCheck, IconFlask, IconLeafSmall } from "./Icons";
import { works } from "./Works";

type Work = (typeof works)[number];

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1.5px solid var(--border)",
        borderRadius: 18,
        padding: "1.25rem",
      }}
    >
      <h3
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          color: "var(--cherry-warm-brown)",
          fontSize: "1rem",
          fontWeight: 900,
          marginBottom: "0.85rem",
        }}
      >
        <IconCheck size={17} color="var(--cherry-forest)" />
        {title}
      </h3>
      <div style={{ display: "grid", gap: "0.65rem" }}>
        {items.map((item) => (
          <div
            key={item}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              color: "var(--cherry-warm-mid)",
              fontSize: "0.9rem",
              lineHeight: 1.65,
            }}
          >
            <IconLeafSmall size={15} color="var(--cherry-sage)" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkHero({ work }: { work: Work }) {
  return (
    <section
      style={{
        padding: "4.5rem 1.5rem 3rem",
        background: "var(--background)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <a
          href="#works"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--cherry-forest)",
            textDecoration: "none",
            fontWeight: 900,
            fontSize: "0.86rem",
            marginBottom: "1.6rem",
          }}
        >
          ← 回到作品集
        </a>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.6rem",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              background: work.color,
              border: `1.5px solid ${work.border}`,
              borderRadius: 24,
              padding: "2rem",
              boxShadow: "6px 10px 0px rgba(94,68,42,0.1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: -18, right: 26, width: 94, height: 26, background: "rgba(250,247,241,0.58)", borderRadius: 5, transform: "rotate(4deg)" }} />
            <div style={{ marginBottom: "1rem" }}>{work.icon}</div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "rgba(250,247,241,0.72)",
                border: "1px dashed rgba(94,68,42,0.24)",
                borderRadius: 999,
                padding: "0.28rem 0.8rem",
                color: "var(--cherry-red)",
                fontWeight: 900,
                fontSize: "0.78rem",
                marginBottom: "1rem",
              }}
            >
              <IconFlask size={15} color="var(--cherry-red)" />
              {work.status}
            </div>
            <h1
              style={{
                color: "var(--cherry-warm-brown)",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 900,
                lineHeight: 1.18,
                marginBottom: "0.85rem",
              }}
            >
              {work.title}
            </h1>
            <p style={{ color: "var(--cherry-warm-mid)", fontSize: "1rem", lineHeight: 1.85, maxWidth: 680 }}>
              {work.desc}
            </p>
          </div>

          <aside
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 22,
              padding: "1.45rem",
              boxShadow: "4px 7px 0px rgba(94,68,42,0.08)",
            }}
          >
            <div style={{ fontFamily: "'Caveat', cursive", color: "var(--cherry-warm-mid)", fontWeight: 700, fontSize: "1rem", marginBottom: "0.45rem" }}>
              先做成这样
            </div>
            <p style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, lineHeight: 1.6, marginBottom: "1.2rem" }}>
              {work.outcome}
            </p>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <div>
                <div style={{ color: "var(--cherry-warm-brown)", fontWeight: 900, fontSize: "0.82rem", marginBottom: 5 }}>
                  目标用户
                </div>
                <p style={{ color: "var(--cherry-warm-mid)", lineHeight: 1.65, fontSize: "0.88rem" }}>
                  {work.audience}
                </p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {work.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "var(--muted)",
                      color: "var(--cherry-warm-mid)",
                      borderRadius: 999,
                      padding: "0.22rem 0.65rem",
                      fontSize: "0.74rem",
                      fontWeight: 800,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export function WorkDetailPage({ slug }: { slug: string }) {
  const work = works.find((item) => item.slug === slug);

  if (!work) {
    return (
      <section style={{ padding: "5rem 1.5rem", maxWidth: 720, margin: "0 auto", fontFamily: "'Nunito', sans-serif" }}>
        <a href="#works" style={{ color: "var(--cherry-forest)", fontWeight: 900, textDecoration: "none" }}>
          ← 回到作品集
        </a>
        <h1 style={{ color: "var(--cherry-warm-brown)", fontSize: "2rem", marginTop: "1.5rem" }}>没有找到这个小作品</h1>
      </section>
    );
  }

  return (
    <main>
      <WorkHero work={work} />

      {work.slug === "gene-expression" ? (
        <GeneExpressionTool />
      ) : (
        <section
          style={{
            padding: "0 1.5rem 5rem",
            maxWidth: 1060,
            margin: "0 auto",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.2rem" }}>
            <DetailList title="第一版交付物" items={work.deliverables} />
            <DetailList title="下一步路线图" items={work.roadmap} />
          </div>

          <div
            style={{
              marginTop: "1.2rem",
              background: "var(--cherry-yellow-light)",
              border: "1.5px solid var(--cherry-yellow)",
              borderRadius: 18,
              padding: "1.25rem",
              color: "var(--cherry-warm-mid)",
              lineHeight: 1.75,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--cherry-warm-brown)", fontWeight: 900, marginBottom: "0.35rem" }}>
              <IconBook size={18} />
              页面状态
            </div>
            这是一个作品详情页原型。后续可以继续往这里加真实 Demo、课程材料、插画草稿、下载链接或开发日志。
            <a
              href="#works"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                marginLeft: 8,
                color: "var(--cherry-forest)",
                fontWeight: 900,
                textDecoration: "none",
              }}
            >
              回作品集 <IconArrowRight size={14} color="var(--cherry-forest)" />
            </a>
          </div>
        </section>
      )}
    </main>
  );
}
