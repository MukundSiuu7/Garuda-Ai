import api from "./api";

/*
==================================================
TYPES
==================================================
*/

export interface CrimeOverTime {
  date: string;

  count: number;
}

export interface CrimeCategory {
  category: string;

  count: number;
}

export interface CrimeLocation {
  locationId: string;

  count: number;
}

export interface TimeOfDay {
  hour: number;

  count: number;
}

export interface NetworkGrowth {
  date: string;

  nodes: number;

  connections: number;
}

export interface EmergingPattern {
  type: string;

  value: string;

  count: number;
}

export interface CrimeAnalyticsSummary {
  totalCases: number;

  totalEvents: number;

  totalRelationships: number;

  categories: number;

  locations: number;
}

export interface CrimeAnalyticsData {
  summary: CrimeAnalyticsSummary;

  crimeOverTime: CrimeOverTime[];

  crimeCategories: CrimeCategory[];

  crimeByLocation: CrimeLocation[];

  timeOfDay: TimeOfDay[];

  networkGrowth: NetworkGrowth[];

  emergingPatterns: EmergingPattern[];
}

/*
==================================================
GET CRIME ANALYTICS
==================================================
*/

export const getCrimeAnalytics = async (): Promise<CrimeAnalyticsData> => {
  const response = await api.get<CrimeAnalyticsData>("/crime-analytics");

  return response.data;
};
