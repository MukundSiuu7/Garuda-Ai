import { useState } from "react";

import { askAI } from "../api/ai";

function AIAnalysis() {
  const [question, setQuestion] = useState("");

  const [caseId, setCaseId] = useState("");

  const [answer, setAnswer] = useState("");

  const [source, setSource] = useState("");

  const [entityCount, setEntityCount] = useState<number | null>(null);

  const [relationshipCount, setRelationshipCount] = useState<number | null>(
    null,
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /*
  ==============================================
  ASK AI
  ==============================================
  */

  const handleAsk = async () => {
    if (question.trim().length === 0) {
      setError("Please enter a question.");

      return;
    }

    setLoading(true);

    setError(null);

    setAnswer("");

    try {
      const result = await askAI({
        question: question.trim(),

        caseId: caseId.trim() || undefined,
      });

      setAnswer(result.answer);

      setSource(result.source);

      setEntityCount(result.context.entityCount);

      setRelationshipCount(result.context.relationshipCount);
    } catch (error) {
      console.error("AI request error:", error);

      setError("Failed to get AI response.");
    } finally {
      setLoading(false);
    }
  };

  /*
  ==============================================
  EXAMPLE QUESTION
  ==============================================
  */

  const useExample = () => {
    setCaseId("C-010");

    setQuestion("What entities are connected to Case C-010?");
  };

  /*
  ==============================================
  PAGE
  ==============================================
  */

  return (
    <div className="product-page" style={pageStyle}>
      <h1>Garuda-AI</h1>

      <p
        style={{
          color: "#94a3b8",
        }}
      >
        AI analysis uses retrieved database records as its context.
      </p>

      {/* ======================================
          QUESTION
      ====================================== */}

      <section style={cardStyle}>
        <h2>Ask a Question</h2>

        <label style={labelStyle}>Case ID</label>

        <input
          value={caseId}
          onChange={(event) => setCaseId(event.target.value)}
          placeholder="Example: C-010"
          style={inputStyle}
        />

        <label style={labelStyle}>Question</label>

        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="What entities are connected to Case C-104?"
          rows={5}
          style={textareaStyle}
        />

        <div
          style={{
            display: "flex",

            gap: "10px",

            marginTop: "15px",
          }}
        >
          <button onClick={handleAsk} disabled={loading} style={buttonStyle}>
            {loading ? "Analyzing..." : "Ask AI"}
          </button>

          <button onClick={useExample} style={secondaryButtonStyle}>
            Use Example
          </button>
        </div>

        {error && (
          <p
            style={{
              color: "#f87171",

              marginTop: "15px",
            }}
          >
            {error}
          </p>
        )}
      </section>

      {/* ======================================
          RESPONSE
      ====================================== */}

      {answer && (
        <section style={cardStyle}>
          <div
            style={{
              display: "flex",

              justifyContent: "space-between",

              alignItems: "center",
            }}
          >
            <h2>AI Analysis</h2>

            <span style={sourceBadge}>{source}</span>
          </div>

          <div
            style={{
              marginTop: "20px",

              lineHeight: 1.7,

              whiteSpace: "pre-wrap",
            }}
          >
            {answer}
          </div>

          {/* ==================================
              RETRIEVAL CONTEXT
          ================================== */}

          <hr
            style={{
              borderColor: "#334155",

              margin: "25px 0",
            }}
          />

          <h3>Retrieved Context</h3>

          <div style={contextGrid}>
            <div style={contextCard}>
              <span>Entities</span>

              <strong>{entityCount}</strong>
            </div>

            <div style={contextCard}>
              <span>Relationships</span>

              <strong>{relationshipCount}</strong>
            </div>
          </div>

          <p
            style={{
              color: "#94a3b8",

              marginTop: "20px",

              fontSize: "14px",
            }}
          >
            The response is based on retrieved synthetic database records.
            Missing information should not be inferred as fact.
          </p>
        </section>
      )}

      {/* ======================================
          ARCHITECTURE
      ====================================== */}

      <section style={cardStyle}>
        <h2>AI Architecture</h2>

        <div style={architectureStyle}>
          <ArchitectureStep text="React" />

          <Arrow />

          <ArchitectureStep text="Node API" />

          <Arrow />

          <ArchitectureStep text="MongoDB Retrieval" />

          <Arrow />

          <ArchitectureStep text="AI Service" />

          <Arrow />

          <ArchitectureStep text="Zoho Catalyst" />

          <Arrow />

          <ArchitectureStep text="GLM Flash" />
        </div>
      </section>

      {/* ======================================
          SAFETY NOTE
      ====================================== */}

      <section
        style={{
          ...cardStyle,

          border: "1px solid #475569",
        }}
      >
        <h3>Data Grounding</h3>

        <p
          style={{
            color: "#cbd5e1",

            lineHeight: 1.6,
          }}
        >
          Garuda-AI is instructed to answer only from retrieved records. It
          should not invent entities, relationships, transactions, events,
          locations, or other facts.
        </p>

        <p
          style={{
            color: "#cbd5e1",

            lineHeight: 1.6,
          }}
        >
          Analytical observations are not determinations of criminality, guilt,
          or future behavior.
        </p>
      </section>
    </div>
  );
}

/*
==================================================
ARCHITECTURE STEP
==================================================
*/

function ArchitectureStep({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: "15px 20px",

        background: "#1e293b",

        border: "1px solid #334155",

        borderRadius: "10px",

        textAlign: "center",

        minWidth: "130px",
      }}
    >
      {text}
    </div>
  );
}

/*
==================================================
ARROW
==================================================
*/

function Arrow() {
  return (
    <div
      style={{
        fontSize: "24px",

        color: "#64748b",
      }}
    >
      →
    </div>
  );
}

/*
==================================================
STYLES
==================================================
*/

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",

  background: "#0f172a",

  color: "white",

  padding: "clamp(16px, 4vw, 30px)",
};

const cardStyle: React.CSSProperties = {
  background: "#111827",

  padding: "25px",

  borderRadius: "12px",

  border: "1px solid #334155",

  marginBottom: "25px",
};

const labelStyle: React.CSSProperties = {
  display: "block",

  marginTop: "15px",

  marginBottom: "8px",

  color: "#cbd5e1",
};

const inputStyle: React.CSSProperties = {
  width: "100%",

  boxSizing: "border-box",

  padding: "12px",

  background: "#0f172a",

  color: "white",

  border: "1px solid #475569",

  borderRadius: "8px",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",

  boxSizing: "border-box",

  padding: "12px",

  background: "#0f172a",

  color: "white",

  border: "1px solid #475569",

  borderRadius: "8px",

  resize: "vertical",
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 20px",

  background: "#2563eb",

  color: "white",

  border: "none",

  borderRadius: "8px",

  cursor: "pointer",

  fontWeight: "bold",
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "12px 20px",

  background: "#334155",

  color: "white",

  border: "none",

  borderRadius: "8px",

  cursor: "pointer",
};

const sourceBadge: React.CSSProperties = {
  padding: "6px 10px",

  background: "#1e293b",

  border: "1px solid #475569",

  borderRadius: "20px",

  color: "#93c5fd",

  fontSize: "12px",
};

const contextGrid: React.CSSProperties = {
  display: "grid",

  gridTemplateColumns: "repeat(2, 1fr)",

  gap: "15px",
};

const contextCard: React.CSSProperties = {
  display: "flex",

  flexDirection: "column",

  gap: "5px",

  padding: "15px",

  background: "#1e293b",

  borderRadius: "8px",
};

const architectureStyle: React.CSSProperties = {
  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  flexWrap: "wrap",

  gap: "10px",

  padding: "20px 0",
};

export default AIAnalysis;
