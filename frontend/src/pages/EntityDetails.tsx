import { useEffect, useState } from "react";

import { getEntity } from "../api/entities";
import type { Entity } from "../api/entities";
import GarudaLoader from "../components/GarudaLoader";

interface EntityDetailsProps {
  entityId: string;
}

function EntityDetails({ entityId }: EntityDetailsProps) {
  const getEntityLabel = (entity: Entity) =>
    entity.name ||
    (entity.bankName && entity.accountNumber
      ? `${entity.bankName} - ${entity.accountNumber}`
      : entity.number ||
        entity.registrationNumber ||
        entity.accountNumber ||
        entity.entityId);

  const [entity, setEntity] = useState<Entity | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEntity = async () => {
      try {
        const result = await getEntity(entityId);

        setEntity(result);
      } catch (error) {
        console.error(error);

        setError("Entity not found");
      } finally {
        setLoading(false);
      }
    };

    loadEntity();
  }, [entityId]);

  if (loading) {
    return <GarudaLoader label="Loading entity" />;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  if (!entity) {
    return <h1>No entity found</h1>;
  }

  return (
    <div className="product-page detail-page">
      <h1>Entity Details</h1>

      <h2>{entity.entityId}</h2>

      <p>Name: {getEntityLabel(entity)}</p>

      <p>Type: {entity.type}</p>

      <pre>{JSON.stringify(entity, null, 2)}</pre>
    </div>
  );
}

export default EntityDetails;
