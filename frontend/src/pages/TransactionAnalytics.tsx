import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { getTransactionAnalytics } from "../api/transactionAnalytics";

import type { TransactionAnalyticsData } from "../api/transactionAnalytics";

import GarudaLoader from "../components/GarudaLoader";

function TransactionAnalytics() {
  const [data, setData] = useState<TransactionAnalyticsData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /*
  ==============================================
  LOAD DATA
  ==============================================
  */

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getTransactionAnalytics();

        setData(result);
      } catch (error) {
        console.error("Transaction analytics error:", error);

        setError("Failed to load transaction analytics");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /*
  ==============================================
  LOADING
  ==============================================
  */

  if (loading) {
    return (
      <div className="product-page" style={pageStyle}>
        <GarudaLoader label="Loading financial analysis" />
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
      <div className="product-page" style={pageStyle}>
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
      <div className="product-page" style={pageStyle}>
        <h1>No transaction data</h1>
      </div>
    );
  }

  /*
  ==============================================
  CHART DATA
  ==============================================
  */

  const dailyData = buildDailyChartData(data.transactions);

  /*
  ==============================================
  PAGE
  ==============================================
  */

  return (
    <div className="product-page" style={pageStyle}>
      <h1>Financial Analysis</h1>

      <p
        style={{
          color: "#94a3b8",
        }}
      >
        Transaction patterns in synthetic demonstration data.
      </p>

      {/* ======================================
          SUMMARY
      ====================================== */}

      <div style={cardGrid}>
        <SummaryCard
          title="Transactions"
          value={data.summary.totalTransactions}
        />

        <SummaryCard
          title="Total Amount"
          value={`₹${data.summary.totalAmount.toLocaleString()}`}
        />

        <SummaryCard
          title="Unique Senders"
          value={data.summary.uniqueSenders}
        />

        <SummaryCard
          title="Unique Receivers"
          value={data.summary.uniqueReceivers}
        />
      </div>

      {/* ======================================
          TRANSACTION ACTIVITY
      ====================================== */}

      <AnalyticsCard title="Transaction Activity">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="count"
              name="Transactions"
              stroke="#38bdf8"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </AnalyticsCard>

      {/* ======================================
          HIGH FREQUENCY
      ====================================== */}

      <AnalyticsCard title="High-Frequency Activity">
        {data.patterns.highFrequency.length === 0 ? (
          <EmptyMessage />
        ) : (
          <div style={tableWrapper}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headerStyle}>Entity</th>

                  <th style={headerStyle}>Date</th>

                  <th style={headerStyle}>Transactions</th>
                </tr>
              </thead>

              <tbody>
                {data.patterns.highFrequency.map((item, index) => (
                  <tr key={index}>
                    <td style={cellStyle}>{item.entity}</td>

                    <td style={cellStyle}>{item.period}</td>

                    <td style={cellStyle}>{item.transactionCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AnalyticsCard>

      {/* ======================================
          CIRCULAR TRANSACTIONS
      ====================================== */}

      <AnalyticsCard title="Circular / Reciprocal Transactions">
        <p style={descriptionStyle}>
          Identifies entity pairs where money moved in both directions.
        </p>

        {data.patterns.circularTransactions.length === 0 ? (
          <EmptyMessage />
        ) : (
          <div style={tableWrapper}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headerStyle}>Entity A</th>

                  <th style={headerStyle}>Entity B</th>

                  <th style={headerStyle}>Transactions</th>

                  <th style={headerStyle}>Total Amount</th>
                </tr>
              </thead>

              <tbody>
                {data.patterns.circularTransactions.map((item, index) => (
                  <tr key={index}>
                    <td style={cellStyle}>{item.entityA}</td>

                    <td style={cellStyle}>{item.entityB}</td>

                    <td style={cellStyle}>{item.transactionCount}</td>

                    <td style={cellStyle}>
                      ₹{item.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AnalyticsCard>

      {/* ======================================
          TRANSACTION SPIKES
      ====================================== */}

      <AnalyticsCard title="Transaction Spikes">
        {data.patterns.transactionSpikes.length === 0 ? (
          <EmptyMessage />
        ) : (
          <div style={tableWrapper}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headerStyle}>Date</th>

                  <th style={headerStyle}>Transactions</th>

                  <th style={headerStyle}>Average</th>
                </tr>
              </thead>

              <tbody>
                {data.patterns.transactionSpikes.map((item, index) => (
                  <tr key={index}>
                    <td style={cellStyle}>{item.date}</td>

                    <td style={cellStyle}>{item.transactionCount}</td>

                    <td style={cellStyle}>{item.averageTransactions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AnalyticsCard>

      {/* ======================================
          REPEATED TRANSFERS
      ====================================== */}

      <AnalyticsCard title="Repeated Transfers">
        <p style={descriptionStyle}>
          Identifies repeated transfers between the same sender and receiver.
        </p>

        {data.patterns.repeatedTransfers.length === 0 ? (
          <EmptyMessage />
        ) : (
          <div style={tableWrapper}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headerStyle}>Sender</th>

                  <th style={headerStyle}>Receiver</th>

                  <th style={headerStyle}>Count</th>

                  <th style={headerStyle}>Total Amount</th>
                </tr>
              </thead>

              <tbody>
                {data.patterns.repeatedTransfers.map((item, index) => (
                  <tr key={index}>
                    <td style={cellStyle}>{item.sender}</td>

                    <td style={cellStyle}>{item.receiver}</td>

                    <td style={cellStyle}>{item.transactionCount}</td>

                    <td style={cellStyle}>
                      ₹{item.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AnalyticsCard>

      {/* ======================================
          DENSE CLUSTERS
      ====================================== */}

      <AnalyticsCard title="Dense Transaction Clusters">
        <p style={descriptionStyle}>
          Entities connected to several different transaction counterparties.
        </p>

        {data.patterns.denseClusters.length === 0 ? (
          <EmptyMessage />
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.patterns.denseClusters.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="entity" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="connectedEntities"
                name="Connected Entities"
                fill="#818cf8"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </AnalyticsCard>

      {/* ======================================
          EXPLANATION
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
        <h3>Interpretation</h3>

        <p>
          These indicators identify explainable transaction patterns. They do
          not determine whether a transaction is criminal, fraudulent, or
          suspicious.
        </p>

        <p>
          High frequency indicates many transactions in a defined period.
          Circular activity indicates reciprocal transfers. Spikes identify
          unusually high daily transaction volume. Repeated transfers identify
          recurring sender-receiver pairs. Dense clusters identify entities with
          many transaction connections.
        </p>
      </div>
    </div>
  );
}

/*
==================================================
BUILD DAILY CHART DATA
==================================================
*/

function buildDailyChartData(
  transactions: {
    timestamp: string;
  }[],
) {
  const map = new Map<string, number>();

  transactions.forEach((transaction) => {
    const date = new Date(transaction.timestamp).toISOString().split("T")[0];

    map.set(
      date,

      (map.get(date) ?? 0) + 1,
    );
  });

  return Array.from(map.entries())
    .map(([date, count]) => ({
      date,

      count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/*
==================================================
SUMMARY CARD
==================================================
*/

interface SummaryCardProps {
  title: string;

  value: string | number;
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
          fontSize: "26px",

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
EMPTY MESSAGE
==================================================
*/

function EmptyMessage() {
  return (
    <p
      style={{
        color: "#94a3b8",

        padding: "20px 0",
      }}
    >
      No matching patterns found in the current dataset.
    </p>
  );
}

/*
==================================================
STYLES
==================================================
*/

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",

  background: "#0f172a",

  color: "white",

  padding: "clamp(16px, 4vw, 30px)",
};

const cardGrid: React.CSSProperties = {
  display: "grid",

  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",

  gap: "15px",

  marginTop: "25px",
};

const tableWrapper: React.CSSProperties = {
  overflowX: "auto",
};

const tableStyle: React.CSSProperties = {
  width: "100%",

  borderCollapse: "collapse",
};

const headerStyle: React.CSSProperties = {
  textAlign: "left",

  padding: "12px",

  borderBottom: "1px solid #475569",
};

const cellStyle: React.CSSProperties = {
  padding: "12px",

  borderBottom: "1px solid #334155",
};

const descriptionStyle: React.CSSProperties = {
  color: "#94a3b8",
};

export default TransactionAnalytics;
