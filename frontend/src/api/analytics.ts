import api from "./api";

/*
==================================================
ANALYTICS NODE
==================================================
*/

export interface AnalyticsNode {
  id: string;

  label: string;

  type: string;

  degreeCentrality: number;

  betweennessCentrality: number;

  pageRank: number;

  community: number;

  structuralImportance: number;
}

/*
==================================================
COMMUNITY
==================================================
*/

export interface Community {
  community: number;

  size: number;
}

/*
==================================================
ANALYTICS RESPONSE
==================================================
*/

export interface AnalyticsData {
  totalNodes: number;

  totalEdges: number;

  nodes: AnalyticsNode[];

  communities: Community[];
}

/*
==================================================
GET ANALYTICS
==================================================
*/

export const getAnalytics = async (): Promise<AnalyticsData> => {
  const response = await api.get<AnalyticsData>("/analytics");

  return response.data;
};
