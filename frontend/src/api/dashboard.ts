import api from "./api";

export interface DashboardData {
  totalCases: number;
  personsOfInterest: number;
  organizations: number;
  locations: number;
  connectedNetworks: number;
  suspiciousTransactions: number;
  activeInvestigations: number;
  alerts: number;
}

export const getDashboard = async (): Promise<DashboardData> => {
  const response = await api.get<DashboardData>("/dashboard");

  return response.data;
};
