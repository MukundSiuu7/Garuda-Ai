import { useEffect, useState } from "react";

import { getAnalytics } from "../api/analytics";

import type { AnalyticsData, AnalyticsNode } from "../api/analytics";

import GarudaLoader from "../components/GarudaLoader";

function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /*
  ==============================================
  LOAD ANALYTICS
  ==============================================
  */

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const result = await getAnalytics();

        setData(result);
      } catch (error) {
        console.error("Analytics error:", error);

        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  /*
  ==============================================
  LOADING
  ==============================================
  */

  if (loading) {
    return (
      <div
        style={{
          padding: 30,
        }}
      >
        <GarudaLoader label="Loading network analytics" />
      </div>
    );
  }

  /*
  ==============================================
  ERROR
  ==============================================
  */

  if (error) {
    return (
      <div
        style={{
          padding: 30,
        }}
      >
        <h1>{error}</h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        style={{
          padding: 30,
        }}
      >
        <h1>No analytics data</h1>
      </div>
    );
  }

  /*
  ==============================================
  TOP STRUCTURAL NODES
  ==============================================
  */

  const topNodes: AnalyticsNode[] = data.nodes.slice(0, 10);

  /*
  ==============================================
  UI
  ==============================================
  */

  return (
    <div
      style={{
        minHeight: "100vh",

        background: "#0f172a",

        color: "white",

        padding: "30px",
      }}
    >
      <h1>Network Analytics</h1>

      <p
        style={{
          color: "#94a3b8",
        }}
      >
        Structural / Network Importance
      </p>

      {/* =====================================
          SUMMARY
      ===================================== */}

      <div
        style={{
          display: "flex",

          gap: "20px",

          flexWrap: "wrap",

          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "#1e293b",

            padding: "20px",

            borderRadius: "10px",

            minWidth: "180px",
          }}
        >
          <h3>Nodes</h3>

          <p
            style={{
              fontSize: "28px",
            }}
          >
            {data.totalNodes}
          </p>
        </div>

        <div
          style={{
            background: "#1e293b",

            padding: "20px",

            borderRadius: "10px",

            minWidth: "180px",
          }}
        >
          <h3>Connections</h3>

          <p
            style={{
              fontSize: "28px",
            }}
          >
            {data.totalEdges}
          </p>
        </div>

        <div
          style={{
            background: "#1e293b",

            padding: "20px",

            borderRadius: "10px",

            minWidth: "180px",
          }}
        >
          <h3>Communities</h3>

          <p
            style={{
              fontSize: "28px",
            }}
          >
            {data.communities.length}
          </p>
        </div>
      </div>

      {/* =====================================
          ALGORITHM EXPLANATION
      ===================================== */}

      <div
        style={{
          background: "#111827",

          padding: "20px",

          borderRadius: "10px",

          marginBottom: "30px",
        }}
      >
        <h2>Network Metrics</h2>

        <p>
          <strong>Degree Centrality:</strong> Number of direct connections an
          entity has.
        </p>

        <p>
          <strong>Betweenness Centrality:</strong> Measures how frequently an
          entity appears on shortest paths between other entities.
        </p>

        <p>
          <strong>PageRank:</strong> Measures structural importance based on
          connections to other important nodes.
        </p>

        <p>
          <strong>Community:</strong> Indicates the network cluster to which an
          entity belongs.
        </p>
      </div>

      {/* =====================================
          TOP ENTITIES
      ===================================== */}

      <h2>Top Structurally Important Entities</h2>

      <div
        style={{
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",

            borderCollapse: "collapse",

            background: "#111827",
          }}
        >
          <thead>
            <tr>
              <th style={headerStyle}>Entity</th>

              <th style={headerStyle}>Type</th>

              <th style={headerStyle}>Degree</th>

              <th style={headerStyle}>Betweenness</th>

              <th style={headerStyle}>PageRank</th>

              <th style={headerStyle}>Community</th>

              <th style={headerStyle}>Structural Importance</th>
            </tr>
          </thead>

          <tbody>
            {topNodes.map((node) => (
              <tr key={node.id}>
                <td style={cellStyle}>
                  <strong>{node.label}</strong>

                  <br />

                  <small>{node.id}</small>
                </td>

                <td style={cellStyle}>{node.type}</td>

                <td style={cellStyle}>{node.degreeCentrality}</td>

                <td style={cellStyle}>{node.betweennessCentrality}</td>

                <td style={cellStyle}>{node.pageRank}</td>

                <td style={cellStyle}>Community {node.community}</td>

                <td style={cellStyle}>
                  <strong>{node.structuralImportance}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =====================================
          COMMUNITIES
      ===================================== */}

      <h2
        style={{
          marginTop: "40px",
        }}
      >
        Communities
      </h2>

      <div
        style={{
          display: "flex",

          gap: "15px",

          flexWrap: "wrap",
        }}
      >
        {data.communities.map((community) => (
          <div
            key={community.community}

            style={{
              background: "#1e293b",

              padding: "15px",

              borderRadius: "10px",

              minWidth: "150px",
            }}
          >
            <strong>Community {community.community}</strong>

            <p>{community.size} nodes</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/*
==================================================
TABLE STYLES
==================================================
*/

const headerStyle: React.CSSProperties = {
  padding: "12px",

  borderBottom: "1px solid #475569",

  textAlign: "left",
};

const cellStyle: React.CSSProperties = {
  padding: "12px",

  borderBottom: "1px solid #334155",
};

export default Analytics;
