import api from "./api";

export interface Entity {
  entityId: string;
  name?: string;
  type: string;
  [key: string]: any;
}

export interface EntitiesResponse {
  count: number;
  entities: Entity[];
}

export const getEntities = async (): Promise<EntitiesResponse> => {
  const response = await api.get<EntitiesResponse>("/entities");

  return response.data;
};

export const getEntity = async (id: string): Promise<Entity> => {
  const response = await api.get<Entity>(`/entities/${id}`);

  return response.data;
};
