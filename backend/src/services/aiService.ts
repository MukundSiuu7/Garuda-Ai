/* =========================================================
   AI SERVICE
   =========================================================
   
   This service supports two modes:

   MOCK
   ----
   Uses database information and generates a deterministic
   response without calling an external AI API.

   REAL
   ----
   Can later be connected to GLM Flash / Zoho Catalyst.

========================================================= */

export interface AIRequest {
  question: string;

  caseData: any | null;

  entities: any[];

  relationships: any[];
}

export interface AIResponse {
  answer: string;

  source: string;
}

/* =========================================================
   MAIN AI FUNCTION
========================================================= */

export async function askAI(data: AIRequest): Promise<AIResponse> {
  const mode = process.env.AI_MODE || "mock";

  console.log(`AI mode: ${mode}`);

  /* =====================================================
     MOCK MODE
  ===================================================== */

  if (mode.toLowerCase() === "mock") {
    return mockAI(data);
  }

  /* =====================================================
     REAL AI MODE
  ===================================================== */

  return realAI(data);
}

/* =========================================================
   MOCK AI
========================================================= */

function mockAI(data: AIRequest): AIResponse {
  const { question, caseData, entities, relationships } = data;

  /* =====================================================
     CASE INFORMATION
  ===================================================== */

  let answer = "";

  if (caseData) {
    answer += `Case ${caseData.caseId} is titled "${caseData.title}". `;

    answer += `The case category is ${caseData.category}. `;

    answer += `Its current status is ${caseData.status}. `;

    answer += `The priority is ${caseData.priority}. `;
  }

  /* =====================================================
     QUESTION
  ===================================================== */

  answer += `\n\nQuestion: ${question}`;

  /* =====================================================
     RELATIONSHIPS
  ===================================================== */

  if (relationships.length > 0) {
    answer +=
      `\n\nThe retrieved database contains ` +
      `${relationships.length} relationship(s).`;

    answer += `\n\nConnections:`;

    relationships.slice(0, 20).forEach((relationship) => {
      answer +=
        `\n• ${relationship.sourceId}` +
        ` → ${relationship.targetId}` +
        ` (${relationship.relationshipType})`;
    });
  } else {
    answer += `\n\nNo relationships were found ` + `for the supplied case.`;
  }

  /* =====================================================
     ENTITIES
  ===================================================== */

  if (entities.length > 0) {
    answer += `\n\nRetrieved entities: ` + `${entities.length}.`;

    answer += `\n\nEntities:`;

    entities.slice(0, 20).forEach((entity) => {
      const name =
        entity.name ||
        entity.number ||
        entity.accountNumber ||
        entity.registrationNumber ||
        entity.entityId ||
        "Unknown";

      answer +=
        `\n• ${entity.entityId || "Unknown"} ` +
        `— ${name} ` +
        `(${entity.type || "Unknown"})`;
    });
  } else {
    answer += `\n\nNo related entities were retrieved.`;
  }

  /* =====================================================
     SAFETY / DATA SOURCE MESSAGE
  ===================================================== */

  answer +=
    `\n\nThis response is based only on ` +
    `records retrieved from the CrimeGraph database. ` +
    `No unsupported facts were added.`;

  return {
    answer,

    source: "mock-database-context",
  };
}

/* =========================================================
   REAL AI
========================================================= */

async function realAI(data: AIRequest): Promise<AIResponse> {
  /*
    We intentionally do not call the external AI yet.

    Once GLM Flash / Zoho Catalyst is configured,
    this function can be replaced with the real API call.
  */

  console.log("Real AI mode requested.");

  console.log("Question:", data.question);

  return {
    answer:
      "Real AI mode is not configured yet. " +
      "The system is currently using database-backed " +
      "mock AI mode.",

    source: "real-ai-not-configured",
  };
}
