import api from "./api";

/*
==================================================
AI REQUEST
==================================================
*/

export interface AIRequest {
  question: string;

  caseId?: string;
}

/*
==================================================
AI RESPONSE
==================================================
*/

export interface AIResponse {
  answer: string;

  source: string;

  context: {
    caseId: string | null;

    entityCount: number;

    relationshipCount: number;
  };
}

/*
==================================================
ASK AI
==================================================
*/

export const askAI = async (request: AIRequest): Promise<AIResponse> => {
  try {
    console.log("Sending AI request:", request);

    const response = await api.post<AIResponse>("/ai/ask", request);

    console.log("AI response:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("AI API ERROR:", error);

    /*
    ================================================
    SERVER RETURNED AN ERROR
    ================================================
    */

    if (error.response) {
      console.error("Status:", error.response.status);

      console.error("Response:", error.response.data);
    }

    /*
    ================================================
    SERVER DID NOT RESPOND
    ================================================
    */
    else if (error.request) {
      console.error("No response received from backend.");

      console.error("Request:", error.request);
    }

    /*
    ================================================
    REQUEST SETUP ERROR
    ================================================
    */
    else {
      console.error("Request error:", error.message);
    }

    throw error;
  }
};
