import { useEffect, useState } from "react";

import { getEntities } from "../api/entities";
import type { Entity } from "../api/entities";
import GarudaLoader from "../components/GarudaLoader";

function Entities() {
  const getEntityLabel = (entity: Entity) =>
    entity.name ||
    (entity.bankName && entity.accountNumber
      ? `${entity.bankName} - ${entity.accountNumber}`
      : entity.number ||
        entity.registrationNumber ||
        entity.accountNumber ||
        entity.entityId);

  const [entities, setEntities] = useState<Entity[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEntities = async () => {
      try {
        const result = await getEntities();

        setEntities(result.entities);
      } catch (error) {
        console.error("Failed to load entities:", error);

        setError("Failed to load entities");
      } finally {
        setLoading(false);
      }
    };

    loadEntities();
  }, []);

  if (loading) {
    return <GarudaLoader label="Loading entities" />;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div className="product-page">
      <h1>Entity Explorer</h1>

      <p>Total Entities: {entities.length}</p>

      {entities.map((entity) => (
        <div
          className="product-card"
          key={entity.entityId}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <strong>{entity.entityId}</strong>

          <p>Name: {getEntityLabel(entity)}</p>

          <p>Type: {entity.type}</p>
        </div>
      ))}
    </div>
  );
}

export default Entities;
