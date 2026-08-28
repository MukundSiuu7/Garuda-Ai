import { useEffect, useState } from "react";

import { getCases } from "../api/cases";
import type { CrimeCase } from "../api/cases";
import GarudaLoader from "../components/GarudaLoader";

function Cases() {
  const [cases, setCases] = useState<CrimeCase[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCases = async () => {
      try {
        const result = await getCases();

        setCases(result.cases);
      } catch (error) {
        console.error("Failed to load cases:", error);

        setError("Failed to load cases");
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, []);

  if (loading) {
    return <GarudaLoader label="Loading investigations" />;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div className="product-page">
      <h1>Investigations</h1>

      <p>Total Cases: {cases.length}</p>

      {cases.map((caseItem) => (
        <div
          className="product-card"
          key={caseItem.caseId}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px",
          }}
        >
          <h2>{caseItem.caseId}</h2>

          <p>Title: {caseItem.title}</p>

          <p>Category: {caseItem.category}</p>

          <p>Status: {caseItem.status}</p>

          <p>Priority: {caseItem.priority}</p>

          <p>Location: {caseItem.locationId}</p>
        </div>
      ))}
    </div>
  );
}

export default Cases;
