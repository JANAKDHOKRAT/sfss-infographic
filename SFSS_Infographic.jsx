import { useState } from "react";

const C = {
  bg: "#0D1B2A",
  bgMid: "#1B2A3B",
  bgCard: "#162030",
  cyan: "#00D4FF",
  purple: "#7B61FF",
  mint: "#00E5A0",
  coral: "#FF6B6B",
  gold: "#FFD700",
  white: "#FFFFFF",
  light: "#B0C4DE",
  muted: "#607B96",
};

const defaultData = {
  title: "Streaming Function Secret Sharing",
  subtitle: "SFSS — A Cryptographic Protocol for Secure Data Filtering",
  part1: {
    label: "PART 1",
    title: "Single-Point Functions",
    subtitle: "Streaming DPF (SDPF)",
    example: '"Accept data only if ID = 4"',
    color: "#00D4FF",
    steps: [
      {
        num: "1",
        title: "Setup Phase",
        body: "Client creates DPF keys targeting single point α with embedded random payload r. Pseudorandom shares ⟦r⟧₀ and ⟦r⟧₁ are saved as secret PRF keys.",
      },
      {
        num: "2",
        title: "Streaming Encryption",
        body: "For each message mⱼ, client runs PRF twice to produce two masks. Formula: cⱼ = mⱼ − F(⟦r⟧₀, j) + F(−⟦r⟧₁, j)",
      },
      {
        num: "3",
        title: "Non-Interactive Evaluation",
        body: "Match (x=α): Keys output multiplier 1 + correct PRF shares → message recovered. No match (x≠α): Shares cancel out → result is exactly 0.",
      },
    ],
  },
  part2: {
    label: "PART 2",
    title: "Multi-Point Functions",
    subtitle: "Key-Homomorphic PRF",
    example: '"Accept data if ID is 4, 5, OR 6"',
    color: "#7B61FF",
    problem: "Double-masking from Part 1 fails — random shares become inconsistent across multiple target points.",
    steps: [
      {
        num: "1",
        title: "Setup Phase",
        body: "Client generates a master KH-PRF key k_kh. An augmented function outputs k_kh at EVERY valid target point, and 0 elsewhere. Distributed via FSS.",
      },
      {
        num: "2",
        title: "Streaming Encryption",
        body: "Much simpler: cⱼ = mⱼ + F(k_kh, j). One single mask from the master key — no double-masking needed.",
      },
      {
        num: "3",
        title: "Non-Interactive Evaluation",
        body: "Valid: Keys output shares of k_kh → KH property reconstructs mask → message recovered. Invalid: Shares of 0 + zero-key property → exactly 0.",
      },
    ],
  },
  comparison: [
    { feature: "Target Points", p1: "Single point α", p2: "Multiple points {α₁, α₂, ...}" },
    { feature: "Core Primitive", p1: "Standard PRF (double-masking)", p2: "Key-Homomorphic PRF" },
    { feature: "Masks Used", p1: "Two masks", p2: "One single mask" },
    { feature: "Valid Output", p1: "Exact mⱼ — no error", p2: "mⱼ + small bounded error" },
    { feature: "Invalid Output", p1: "0 (shares cancel)", p2: "0 (zero-key property)" },
  ],
};

function EditableText({ value, onChange, style, multiline, className }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);

  const commit = () => {
    onChange(val);
    setEditing(false);
  };

  if (editing) {
    return multiline ? (
      <textarea
        autoFocus
        value={val}
        onChange={e => setVal(e.target.value)}
        onBlur={commit}
        style={{
          ...style,
          background: "rgba(0,212,255,0.08)",
          border: "1px solid #00D4FF",
          borderRadius: 4,
          padding: "2px 6px",
          outline: "none",
          resize: "vertical",
          width: "100%",
          fontFamily: "inherit",
          minHeight: 60,
        }}
      />
    ) : (
      <input
        autoFocus
        value={val}
        onChange={e => setVal(e.target.value)}
        onBlur={commit}
        onKeyDown={e => e.key === "Enter" && commit()}
        style={{
          ...style,
          background: "rgba(0,212,255,0.08)",
          border: "1px solid #00D4FF",
          borderRadius: 4,
          padding: "2px 6px",
          outline: "none",
          width: "100%",
          fontFamily: "inherit",
        }}
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      title="Click to edit"
      className={className}
      style={{
        ...style,
        cursor: "text",
        borderBottom: "1px dashed rgba(0,212,255,0.3)",
        display: "inline-block",
        width: "100%",
        transition: "border-color 0.2s",
      }}
    >
      {value}
    </span>
  );
}

function StepCard({ step, color, onChange }) {
  return (
    <div
      style={{
        background: C.bgCard,
        border: `1.5px solid ${color}22`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 10,
        padding: "14px 16px",
        flex: 1,
        minWidth: 0,
        position: "relative",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 14,
          color: C.bg,
          marginBottom: 8,
          flexShrink: 0,
        }}
      >
        {step.num}
      </div>
      <div style={{ fontWeight: 700, fontSize: 13, color: C.white, marginBottom: 6 }}>
        <EditableText
          value={step.title}
          onChange={v => onChange({ ...step, title: v })}
          style={{ fontSize: 13, fontWeight: 700, color: C.white }}
        />
      </div>
      <div style={{ fontSize: 12, color: C.light, lineHeight: 1.55 }}>
        <EditableText
          value={step.body}
          onChange={v => onChange({ ...step, body: v })}
          style={{ fontSize: 12, color: C.light, lineHeight: 1.55 }}
          multiline
        />
      </div>
    </div>
  );
}

function PartSection({ data, onChange }) {
  return (
    <div
      style={{
        background: C.bgMid,
        border: `1.5px solid ${data.color}44`,
        borderRadius: 14,
        padding: "20px 22px",
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div
          style={{
            background: data.color,
            color: C.bg,
            fontWeight: 700,
            fontSize: 11,
            padding: "3px 10px",
            borderRadius: 4,
            letterSpacing: 2,
            flexShrink: 0,
          }}
        >
          <EditableText
            value={data.label}
            onChange={v => onChange({ ...data, label: v })}
            style={{ fontSize: 11, fontWeight: 700, color: C.bg, letterSpacing: 2 }}
          />
        </div>
      </div>

      <div style={{ fontSize: 22, fontWeight: 800, color: C.white, marginBottom: 2 }}>
        <EditableText
          value={data.title}
          onChange={v => onChange({ ...data, title: v })}
          style={{ fontSize: 22, fontWeight: 800, color: C.white }}
        />
      </div>
      <div style={{ fontSize: 13, color: data.color, fontStyle: "italic", marginBottom: 6 }}>
        <EditableText
          value={data.subtitle}
          onChange={v => onChange({ ...data, subtitle: v })}
          style={{ fontSize: 13, color: data.color, fontStyle: "italic" }}
        />
      </div>
      <div
        style={{
          background: `${data.color}15`,
          border: `1px solid ${data.color}44`,
          borderRadius: 6,
          padding: "6px 10px",
          fontSize: 12,
          color: C.light,
          marginBottom: data.problem ? 12 : 16,
          fontStyle: "italic",
        }}
      >
        <EditableText
          value={data.example}
          onChange={v => onChange({ ...data, example: v })}
          style={{ fontSize: 12, color: C.light, fontStyle: "italic" }}
        />
      </div>

      {data.problem && (
        <div
          style={{
            background: "#FF6B6B18",
            border: "1px solid #FF6B6B44",
            borderRadius: 6,
            padding: "7px 10px",
            fontSize: 11.5,
            color: "#FF6B6B",
            marginBottom: 16,
          }}
        >
          <span style={{ fontWeight: 700 }}>⚠ Problem: </span>
          <EditableText
            value={data.problem}
            onChange={v => onChange({ ...data, problem: v })}
            style={{ fontSize: 11.5, color: "#FF6B6B" }}
            multiline
          />
        </div>
      )}

      {/* Steps */}
      <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
        {data.steps.map((step, i) => (
          <StepCard
            key={i}
            step={step}
            color={data.color}
            onChange={updated => {
              const steps = [...data.steps];
              steps[i] = updated;
              onChange({ ...data, steps });
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function SFSSInfographic() {
  const [d, setD] = useState(defaultData);
  const [activeTab, setActiveTab] = useState("full");

  const tabs = [
    { id: "full", label: "Full Overview" },
    { id: "part1", label: "Part 1: SDPF" },
    { id: "part2", label: "Part 2: KH-PRF" },
    { id: "compare", label: "Comparison" },
  ];

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        color: C.white,
        padding: "24px 28px",
      }}
    >
      {/* Edit hint */}
      <div
        style={{
          background: "rgba(0,212,255,0.08)",
          border: "1px dashed rgba(0,212,255,0.4)",
          borderRadius: 6,
          padding: "7px 14px",
          fontSize: 12,
          color: C.cyan,
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        ✏️ Click any text to edit it — this infographic is fully customizable
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: C.white, margin: "0 0 6px 0" }}>
          <EditableText
            value={d.title}
            onChange={v => setD({ ...d, title: v })}
            style={{ fontSize: 28, fontWeight: 800, color: C.white, textAlign: "center" }}
          />
        </h1>
        <div style={{ fontSize: 14, color: C.light }}>
          <EditableText
            value={d.subtitle}
            onChange={v => setD({ ...d, subtitle: v })}
            style={{ fontSize: 14, color: C.light }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 22 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? C.cyan : C.bgCard,
              color: activeTab === tab.id ? C.bg : C.light,
              border: `1px solid ${activeTab === tab.id ? C.cyan : C.bgMid}`,
              borderRadius: 6,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "full" && (
        <div style={{ display: "flex", gap: 16 }}>
          <PartSection
            data={d.part1}
            onChange={p => setD({ ...d, part1: p })}
          />
          {/* VS divider */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <div style={{ width: 1, flex: 1, background: "rgba(255,215,0,0.2)" }} />
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: C.bg,
                border: `2px solid ${C.gold}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: C.gold,
                flexShrink: 0,
              }}
            >
              VS
            </div>
            <div style={{ width: 1, flex: 1, background: "rgba(255,215,0,0.2)" }} />
          </div>
          <PartSection
            data={d.part2}
            onChange={p => setD({ ...d, part2: p })}
          />
        </div>
      )}

      {activeTab === "part1" && (
        <PartSection data={d.part1} onChange={p => setD({ ...d, part1: p })} />
      )}

      {activeTab === "part2" && (
        <PartSection data={d.part2} onChange={p => setD({ ...d, part2: p })} />
      )}

      {activeTab === "compare" && (
        <div>
          <div
            style={{
              background: C.bgMid,
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 2fr 2fr",
                background: "rgba(13,24,38,0.8)",
              }}
            >
              {["Feature", "Part 1: SDPF", "Part 2: KH-PRF"].map((h, i) => (
                <div
                  key={i}
                  style={{
                    padding: "12px 18px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: i === 0 ? C.gold : i === 1 ? C.cyan : C.purple,
                    borderBottom: `2px solid ${i === 0 ? C.gold : i === 1 ? C.cyan : C.purple}`,
                    textAlign: i === 0 ? "left" : "center",
                  }}
                >
                  {h}
                </div>
              ))}
            </div>
            {d.comparison.map((row, ri) => (
              <div
                key={ri}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.4fr 2fr 2fr",
                  background: ri % 2 === 0 ? C.bgCard : C.bgMid,
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div style={{ padding: "12px 18px", fontSize: 13, fontWeight: 600, color: C.white }}>
                  <EditableText
                    value={row.feature}
                    onChange={v => {
                      const cmp = [...d.comparison];
                      cmp[ri] = { ...row, feature: v };
                      setD({ ...d, comparison: cmp });
                    }}
                    style={{ fontSize: 13, fontWeight: 600, color: C.white }}
                  />
                </div>
                <div style={{ padding: "12px 18px", fontSize: 12, color: C.light, textAlign: "center" }}>
                  <EditableText
                    value={row.p1}
                    onChange={v => {
                      const cmp = [...d.comparison];
                      cmp[ri] = { ...row, p1: v };
                      setD({ ...d, comparison: cmp });
                    }}
                    style={{ fontSize: 12, color: C.light, textAlign: "center" }}
                  />
                </div>
                <div style={{ padding: "12px 18px", fontSize: 12, color: C.light, textAlign: "center" }}>
                  <EditableText
                    value={row.p2}
                    onChange={v => {
                      const cmp = [...d.comparison];
                      cmp[ri] = { ...row, p2: v };
                      setD({ ...d, comparison: cmp });
                    }}
                    style={{ fontSize: 12, color: C.light, textAlign: "center" }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Shared conclusion */}
          <div
            style={{
              background: "rgba(0,212,255,0.07)",
              border: "1px solid rgba(0,212,255,0.25)",
              borderRadius: 10,
              padding: "12px 18px",
              marginTop: 14,
              fontSize: 13,
              color: C.cyan,
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            Both constructions are non-interactive and provide perfect secrecy for non-target data.
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: 24,
          textAlign: "center",
          fontSize: 11,
          color: C.muted,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: 14,
        }}
      >
        SFSS — Streaming Function Secret Sharing · Click any text to edit · Tab between views
      </div>
    </div>
  );
}
