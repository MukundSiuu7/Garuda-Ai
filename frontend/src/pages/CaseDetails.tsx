import { useEffect, useState } from "react";

import { getCase } from "../api/cases";
import type { CrimeCase } from "../api/cases";
import GarudaLoader from "../components/GarudaLoader";

interface CaseDetailsProps {
  caseId: string;
}

function CaseDetails({ caseId }: CaseDetailsProps) {
  const [caseData, setCaseData] = useState<CrimeCase | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCase = async () => {
      try {
        const result = await getCase(caseId);

        setCaseData(result);
      } catch (error) {
        console.error("Failed to load case:", error);

        setError("Case not found");
      } finally {
        setLoading(false);
      }
    };

    loadCase();
  }, [caseId]);

  if (loading) {
    return <GarudaLoader label="Loading case" />;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  if (!caseData) {
    return <h1>No case found</h1>;
  }

  return (
    <div className="product-page detail-page">
      <h1>Case Details</h1>

      <h2>{caseData.caseId}</h2>

      <p>Title: {caseData.title}</p>

      <p>Category: {caseData.category}</p>

      <p>Status: {caseData.status}</p>

      <p>Priority: {caseData.priority}</p>

      <p>Location: {caseData.locationId}</p>

      <p>Created: {new Date(caseData.createdAt).toLocaleDateString()}</p>
    </div>
  );
}

export default CaseDetails;
