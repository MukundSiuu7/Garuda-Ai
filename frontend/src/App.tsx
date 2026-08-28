import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

import "./App.css";
import { navItems } from "./config/navigation";
import DashboardCard from "./components/DashboardCard";
import GarudaLoader from "./components/GarudaLoader";
const AIAnalysis = lazy(() => import("./pages/AIAnalysis"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Cases = lazy(() => import("./pages/Cases"));
const Entities = lazy(() => import("./pages/Entities"));
const Network = lazy(() => import("./pages/Network"));
const TransactionAnalytics = lazy(() => import("./pages/TransactionAnalytics"));

const dashboardCards = [
  {
    to: "/entities",
    title: "Entities",
    description: "View investigation entities.",
  },
  { to: "/cases", title: "Cases", description: "View investigation cases." },
  {
    to: "/network",
    title: "Network",
    description: "Explore entity relationships.",
  },
  {
    to: "/analytics",
    title: "Analytics",
    description: "View crime analytics.",
  },
  {
    to: "/transactions",
    title: "Transactions",
    description: "Analyze transactions.",
  },
  {
    to: "/ai",
    title: "AI Assistant",
    description: "Ask questions about investigation data.",
  },
] as const;

function Dashboard() {
  return (
    <main className="dashboard-page product-page">
      <header className="dashboard-intro">
        <span className="eyebrow">GARUDA-AI / OPERATIONS</span>
        <h1>Garuda-AI</h1>
        <p>Investigation and network intelligence platform</p>
      </header>
      <section className="dashboard-card-grid" aria-label="Application areas">
        {dashboardCards.map((card) => (
          <Link to={card.to} key={card.to} className="dashboard-card-link">
            <DashboardCard title={card.title} description={card.description} />
          </Link>
        ))}
      </section>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <nav className="app-nav" aria-label="Primary navigation">
        <Link to="/" className="app-brand">
          <img src="/garuda(512).svg" alt="" width="32" height="32" />
          <span>Garuda-AI</span>
        </Link>
        {navItems.map((item) => (
          <Link to={item.to} key={item.to}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Suspense fallback={<GarudaLoader label="Loading module" />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/entities" element={<Entities />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/network" element={<Network />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/transactions" element={<TransactionAnalytics />} />
          <Route path="/ai" element={<AIAnalysis />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
