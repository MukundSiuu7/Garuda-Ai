import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { getCrimeAnalytics } from "../api/crimeAnalytics";

import type { CrimeAnalyticsData } from "../api/crimeAnalytics";

import GarudaLoader from "../components/GarudaLoader";

/*
==================================================
PIE CHART COLORS
==================================================
*/

const PIE_COLORS = [
  "#38bdf8",
  "#818cf8",
  "#f472b6",
  "#34d399",
  "#f59e0b",
  "#ef4444",
  "#a78bfa",
  "#22d3ee",
];

/*
==================================================
CRIME ANALYTICS PAGE
==================================================
*/

function CrimeAnalytics() {
  const [data, setData] = useState<CrimeAnalyticsData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /*
  ==============================================
  LOAD ANALYTICS DATA
  ==============================================
  */

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const result = await getCrimeAnalytics();

        setData(result);
      } catch (error) {
        console.error("Crime analytics error:", error);

        setError("Failed to load crime analytics");
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
      <div style={pageStyle}>
        <GarudaLoader label="Loading crime analytics" />
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
      <div style={pageStyle}>
        <h1>{error}</h1>
      </div>
    );
  }

  /*
  ==============================================
  NO DATA
  ==============================================
  */

  if (!data) {
    return (
      <div style={pageStyle}>
        <h1>No analytics data</h1>
      </div>
    );
  }

  /*
  ==============================================
  PAGE
  ==============================================
  */

  return (
    <div className="product-page" style={pageStyle}>
      <h1>Crime Analytics</h1>

      <p
        style={{
          color: "#94a3b8",
        }}
      >
        Synthetic / Demonstration Data
      </p>

      {/* ======================================
          SUMMARY CARDS
      ====================================== */}

      <div style={cardGrid}>
        <SummaryCard title="Total Cases" value={data.summary.totalCases} />

        <SummaryCard title="Total Events" value={data.summary.totalEvents} />

        <SummaryCard
          title="Relationships"
          value={data.summary.totalRelationships}
        />

        <SummaryCard title="Crime Categories" value={data.summary.categories} />

        <SummaryCard title="Locations" value={data.summary.locations} />
      </div>

      {/* ======================================
          CRIME OVER TIME
      ====================================== */}

      <AnalyticsCard title="Crime Over Time">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data.crimeOverTime}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="count"
              name="Cases"
              stroke="#38bdf8"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </AnalyticsCard>

      {/* ======================================
          CRIME CATEGORIES - PIE CHART
      ====================================== */}

      <AnalyticsCard title="Crime Categories">
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data.crimeCategories}

              dataKey="count"

              nameKey="category"

              cx="50%"

              cy="50%"

              outerRadius={120}

              label
            >
              {data.crimeCategories.map((_, index) => (
                <Cell
                  key={`cell-${index}`}

                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </AnalyticsCard>

      {/* ======================================
          CRIME BY LOCATION
      ====================================== */}

      <AnalyticsCard title="Crime by Fictional Location">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data.crimeByLocation}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="locationId" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar dataKey="count" name="Cases" fill="#f472b6" />
          </BarChart>
        </ResponsiveContainer>
      </AnalyticsCard>

      {/* ======================================
          TIME OF DAY
      ====================================== */}

      <AnalyticsCard title="Time-of-Day Distribution">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data.timeOfDay}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="hour"

              label={{
                value: "Hour",

                position: "insideBottom",

                offset: -5,
              }}
            />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar dataKey="count" name="Events" fill="#34d399" />
          </BarChart>
        </ResponsiveContainer>
      </AnalyticsCard>

      {/* ======================================
          NETWORK GROWTH
      ====================================== */}

      <AnalyticsCard title="Network Growth">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data.networkGrowth}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="nodes"
              name="Nodes"
              stroke="#f59e0b"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="connections"
              name="Connections"
              stroke="#ef4444"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </AnalyticsCard>

      {/* ======================================
          EMERGING PATTERNS
      ====================================== */}

      <AnalyticsCard title="Emerging Patterns">
        <div
          style={{
            display: "grid",

            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",

            gap: "15px",
          }}
        >
          {data.emergingPatterns.map((pattern, index) => (
            <div
              key={index}

              style={{
                background: "#1e293b",

                padding: "20px",

                borderRadius: "10px",

                border: "1px solid #334155",
              }}
            >
              <h3>{pattern.type}</h3>

              <p
                style={{
                  fontSize: "20px",

                  fontWeight: "bold",
                }}
              >
                {pattern.value}
              </p>

              <p
                style={{
                  color: "#94a3b8",
                }}
              >
                Count: {pattern.count}
              </p>
            </div>
          ))}
        </div>
      </AnalyticsCard>

      {/* ======================================
          DISCLAIMER
      ====================================== */}

      <div
        style={{
          marginTop: "30px",

          padding: "20px",

          background: "#172033",

          border: "1px solid #475569",

          borderRadius: "10px",

          color: "#cbd5e1",
        }}
      >
        <strong>Analytical note:</strong>

        <p>
          These visualizations describe patterns in the synthetic dataset. They
          do not establish criminality, guilt, or future criminal behavior.
        </p>
      </div>
    </div>
  );
}

/*
==================================================
SUMMARY CARD
==================================================
*/

interface SummaryCardProps {
  title: string;

  value: number;
}

function SummaryCard({ title, value }: SummaryCardProps) {
  return (
    <div
      style={{
        background: "#1e293b",

        padding: "20px",

        borderRadius: "10px",

        border: "1px solid #334155",
      }}
    >
      <p
        style={{
          color: "#94a3b8",

          margin: 0,
        }}
      >
        {title}
      </p>

      <h2
        style={{
          fontSize: "30px",

          marginBottom: 0,
        }}
      >
        {value}
      </h2>
    </div>
  );
}

/*
==================================================
ANALYTICS CARD
==================================================
*/

interface AnalyticsCardProps {
  title: string;

  children: React.ReactNode;
}

function AnalyticsCard({ title, children }: AnalyticsCardProps) {
  return (
    <section
      style={{
        background: "#111827",

        padding: "25px",

        borderRadius: "12px",

        border: "1px solid #334155",

        marginTop: "25px",
      }}
    >
      <h2>{title}</h2>

      {children}
    </section>
  );
}

/*
==================================================
PAGE STYLE
==================================================
*/

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",

  background: "#0f172a",

  color: "white",

  padding: "clamp(16px, 4vw, 30px)",
};

/*
==================================================
CARD GRID
==================================================
*/

const cardGrid: React.CSSProperties = {
  display: "grid",

  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",

  gap: "15px",

  marginTop: "25px",
};

export default CrimeAnalytics;
