import api from "./api";

export interface CrimeCase {
  caseId: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  locationId: string;
  createdAt: string;
}

export interface CasesResponse {
  count: number;
  cases: CrimeCase[];
}

// Get all cases
export const getCases = async (): Promise<CasesResponse> => {
  const response = await api.get<CasesResponse>("/cases");

  return response.data;
};

// Get one case
export const getCase = async (id: string): Promise<CrimeCase> => {
  const response = await api.get<CrimeCase>(`/cases/${id}`);

  return response.data;
};
