import api from "./api";

/*
==================================================
NETWORK NODE
==================================================
*/

export interface NetworkNode {
  id: string;
  label: string;
  type: string;
}

/*
==================================================
NETWORK EDGE
==================================================
*/

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  strength: number;
}

/*
==================================================
NETWORK DATA
==================================================
*/

export interface NetworkData {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

/*
==================================================
GET NETWORK
==================================================
*/

export const getNetwork = async (): Promise<NetworkData> => {
  const response = await api.get<NetworkData>("/network");

  return response.data;
};
