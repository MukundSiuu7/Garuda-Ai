import { useEffect, useMemo, useState } from "react";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "reactflow";

import "reactflow/dist/style.css";

import dagre from "@dagrejs/dagre";
import {
  ArrowLeftRight,
  Banknote,
  Building2,
  CalendarDays,
  CarFront,
  CircleHelp,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

import { getNetwork } from "../api/network";
import type { NetworkData } from "../api/network";

import { getEntity } from "../api/entities";

import EntityPanel from "../components/EntityPanel";
import GarudaLoader from "../components/GarudaLoader";

// ==========================================
// CONSTANTS
// ==========================================

const NODE_WIDTH = 170;
const NODE_HEIGHT = 60;

// ==========================================
// NODE COLOR
// ==========================================

const getNodeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "person":
      return "#2563eb";

    case "organization":
      return "#16a34a";

    case "location":
      return "#ea580c";

    case "vehicle":
      return "#9333ea";

    case "phone":
      return "#db2777";

    case "bank account":
      return "#d97706";

    default:
      return "#64748b";
  }
};

const getNodeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "person":
      return UserRound;
    case "organization":
      return Building2;
    case "location":
      return MapPin;
    case "vehicle":
      return CarFront;
    case "phone":
      return Phone;
    case "bank account":
      return Banknote;
    case "case":
      return CalendarDays;
    case "transaction":
      return ArrowLeftRight;
    default:
      return CircleHelp;
  }
};

// ==========================================
// DAGRE LAYOUT
// ==========================================

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const graph = new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(() => ({}));

  graph.setGraph({
    rankdir: "LR",

    nodesep: 80,

    ranksep: 180,

    marginx: 50,

    marginy: 50,
  });

  nodes.forEach((node) => {
    graph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  const layoutedNodes = nodes.map((node) => {
    const position = graph.node(node.id);

    return {
      ...node,

      position: {
        x: position.x - NODE_WIDTH / 2,

        y: position.y - NODE_HEIGHT / 2,
      },
    };
  });

  return {
    nodes: layoutedNodes,

    edges,
  };
};

// ==========================================
// NETWORK COMPONENT
// ==========================================

function Network() {
  // ========================================
  // NETWORK DATA
  // ========================================

  const [networkData, setNetworkData] = useState<NetworkData | null>(null);

  // ========================================
  // SELECTED ENTITY
  // ========================================

  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);

  // ========================================
  // ENTITY LOADING
  // ========================================

  const [entityLoading, setEntityLoading] = useState(false);

  // ========================================
  // FILTERS
  // ========================================

  const [search, setSearch] = useState("");

  const [selectedType, setSelectedType] = useState("All");

  const [minStrength, setMinStrength] = useState(0);

  // ========================================
  // STATUS
  // ========================================

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // ========================================
  // LOAD NETWORK
  // ========================================

  useEffect(() => {
    const loadNetwork = async () => {
      try {
        const result = await getNetwork();

        setNetworkData(result);
      } catch (error) {
        console.error("Network error:", error);

        setError("Failed to load network");
      } finally {
        setLoading(false);
      }
    };

    loadNetwork();
  }, []);

  // ========================================
  // ENTITY TYPES
  // ========================================

  const entityTypes = useMemo(() => {
    if (!networkData) {
      return [];
    }

    const types = networkData.nodes.map((node) => node.type);

    return [...new Set(types)];
  }, [networkData]);

  // ========================================
  // FILTER NETWORK
  // ========================================

  const filteredData = useMemo(() => {
    if (!networkData) {
      return {
        nodes: [],

        edges: [],
      };
    }

    const searchText = search.trim().toLowerCase();

    let filteredNodes = networkData.nodes.filter((node) => {
      const matchesSearch =
        searchText === "" ||
        node.id.toLowerCase().includes(searchText) ||
        node.label.toLowerCase().includes(searchText);

      const matchesType = selectedType === "All" || node.type === selectedType;

      return matchesSearch && matchesType;
    });

    const nodeIds = new Set(filteredNodes.map((node) => node.id));

    const filteredEdges = networkData.edges.filter((edge) => {
      const matchingNodes =
        nodeIds.has(edge.source) && nodeIds.has(edge.target);

      const strongEnough = edge.strength >= minStrength;

      return matchingNodes && strongEnough;
    });

    if (searchText !== "" || selectedType !== "All") {
      const connectedIds = new Set(nodeIds);

      filteredEdges.forEach((edge) => {
        connectedIds.add(edge.source);

        connectedIds.add(edge.target);
      });

      filteredNodes = networkData.nodes.filter((node) =>
        connectedIds.has(node.id),
      );
    }

    return {
      nodes: filteredNodes,

      edges: filteredEdges,
    };
  }, [networkData, search, selectedType, minStrength]);

  // ========================================
  // NODE CLICK
  // ========================================

  const handleNodeClick: NodeMouseHandler = async (_event, node) => {
    try {
      setEntityLoading(true);

      console.log("Loading entity:", node.id);

      const entity = await getEntity(node.id);

      console.log("Entity loaded:", entity);

      setSelectedEntity(entity);
    } catch (error) {
      console.error("Failed to load entity:", error);

      setSelectedEntity(null);
    } finally {
      setEntityLoading(false);
    }
  };

  // ========================================
  // REACT FLOW GRAPH
  // ========================================

  const graph = useMemo(() => {
    const flowNodes: Node[] = filteredData.nodes.map((node) => {
      const NodeIcon = getNodeIcon(node.type);
      const nodeColor = getNodeColor(node.type);

      return {
        id: node.id,

        position: {
          x: 0,
          y: 0,
        },

        data: {
          label: (
            <div className="network-node-content">
              <span
                className="network-node-icon"
                style={{ color: nodeColor, borderColor: nodeColor }}
              >
                <NodeIcon size={18} strokeWidth={1.8} />
              </span>
              <strong>{node.label}</strong>
              <small>{node.type}</small>
            </div>
          ),
        },

        style: {
          width: NODE_WIDTH,

          minHeight: NODE_HEIGHT,

          background: "transparent",

          color: "white",

          border: "0",

          borderRadius: "0",

          padding: "0",

          fontSize: "11px",

          boxShadow: "none",
        },
      };
    });

    const flowEdges: Edge[] = filteredData.edges.map((edge) => {
      return {
        id: edge.id,

        source: edge.source,

        target: edge.target,

        label: edge.type,

        type: "smoothstep",

        animated: edge.strength >= 0.7,

        style: {
          stroke: edge.strength >= 0.7 ? "#ef4444" : "#94a3b8",

          strokeWidth: 1.5 + edge.strength * 3,
        },

        labelStyle: {
          fontSize: 9,

          fontWeight: 600,
        },

        labelBgStyle: {
          fill: "#ffffff",

          fillOpacity: 0.85,
        },
      };
    });

    return getLayoutedElements(flowNodes, flowEdges);
  }, [filteredData]);

  // ========================================
  // STEP 14
  // CALCULATE CONNECTIONS
  // ========================================

  const connectionCount = selectedEntity
    ? filteredData.edges.filter(
        (edge) =>
          edge.source === selectedEntity.entityId ||
          edge.target === selectedEntity.entityId,
      ).length
    : 0;

  // ========================================
  // RESET FILTERS
  // ========================================

  const resetFilters = () => {
    setSearch("");

    setSelectedType("All");

    setMinStrength(0);

    setSelectedEntity(null);
  };

  // ========================================
  // LOADING SCREEN
  // ========================================

  if (loading) {
    return (
      <div
        style={{
          padding: "30px",
        }}
      >
        <GarudaLoader />
      </div>
    );
  }

  // ========================================
  // ERROR SCREEN
  // ========================================

  if (error) {
    return (
      <div
        style={{
          padding: "30px",
        }}
      >
        <h1>{error}</h1>
      </div>
    );
  }

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <div className="network-page">
      <header className="network-header">
        <div className="network-brand">
          <span className="brand-mark">G</span>
          <div>
            <strong>GARUDA-AI</strong>
            <span>NETWORK INTELLIGENCE</span>
          </div>
        </div>
        <div className="network-title">
          <span className="eyebrow">INVESTIGATION WORKSPACE</span>
          <h1>Entity relationship map</h1>
        </div>
        <div className="network-status">
          <i /> SYSTEM ONLINE
        </div>
      </header>

      <div className="network-body">
        <aside className="network-rail">
          <div className="rail-label">CONTROL DECK</div>
          <label className="network-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search entity"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label className="network-field">
            <span>ENTITY CLASS</span>
            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
            >
              <option value="All">All types</option>
              {entityTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className="network-field">
            <span>
              MINIMUM LINK STRENGTH <b>{Math.round(minStrength * 100)}%</b>
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={minStrength}
              onChange={(event) => setMinStrength(Number(event.target.value))}
            />
          </label>
          <button className="network-reset" onClick={resetFilters}>
            Reset filters <span>↻</span>
          </button>

          <div className="network-legend">
            <div className="rail-label">SIGNAL LEGEND</div>
            {[
              ["Person", "#ff476f"],
              ["Organization", "#a855f7"],
              ["Location", "#f59e0b"],
              ["Vehicle", "#22c55e"],
              ["Bank Account", "#38bdf8"],
            ].map(([label, color]) => (
              <div className="legend-row" key={label}>
                <i style={{ background: color }} /> {label}
              </div>
            ))}
          </div>
          <div className="rail-footer">
            CASE FILE <strong>LIVE / 08.26</strong>
          </div>
        </aside>

        <main className="network-workspace">
          <div className="workspace-toolbar">
            <div>
              <span className="live-pip" /> LIVE GRAPH{" "}
              <small>LAST SYNC 22:47:08</small>
            </div>
            <div className="workspace-counts">
              <b>{filteredData.nodes.length}</b> NODES{" "}
              <b>{filteredData.edges.length}</b> LINKS
            </div>
          </div>

          <div className="network-canvas">
            <ReactFlow
              nodes={graph.nodes}

              edges={graph.edges}

              fitView

              fitViewOptions={{
                padding: 0.2,
              }}

              minZoom={0.1}

              maxZoom={2}

              onNodeClick={handleNodeClick}
            >
              <MiniMap className="network-minimap" />

              <Controls />

              <Background color="#193858" gap={28} size={1} />
            </ReactFlow>

            {/* =================================
            ENTITY LOADING
        ================================= */}

            {entityLoading && (
              <div className="entity-loading">Loading entity...</div>
            )}

            {/* =================================
            ENTITY PANEL
        ================================= */}

            {!entityLoading && (
              <EntityPanel
                entity={selectedEntity}

                connectionCount={connectionCount}

                onClose={() => setSelectedEntity(null)}
              />
            )}
          </div>
          <div className="workspace-hint">
            SELECT A NODE TO INSPECT RELATIONSHIPS{" "}
            <span>CLICK + DRAG TO EXPLORE</span>
          </div>
        </main>
        <aside className="network-insights">
          <div className="insight-heading">
            <span>NETWORK TELEMETRY</span>
            <i />
          </div>
          <div className="metric-grid">
            <div>
              <span>VISIBLE NODES</span>
              <strong>{filteredData.nodes.length}</strong>
              <em>ACTIVE</em>
            </div>
            <div>
              <span>CONNECTIONS</span>
              <strong>{filteredData.edges.length}</strong>
              <em>INDEXED</em>
            </div>
          </div>
          <div className="insight-section">
            <div className="insight-heading">
              <span>RELATIONSHIP DENSITY</span>
            </div>
            <div className="density-bars">
              {[38, 64, 48, 82, 57, 76, 68, 91, 72, 84].map((height, index) => (
                <i key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="density-label">
              <strong>
                {filteredData.nodes.length
                  ? (
                      filteredData.edges.length / filteredData.nodes.length
                    ).toFixed(1)
                  : "0.0"}
              </strong>
              <span>LINKS / NODE</span>
            </div>
          </div>
          <div className="insight-section">
            <div className="insight-heading">
              <span>HIGH-VALUE SIGNALS</span>
              <small>TOP 04</small>
            </div>
            {networkData?.nodes.slice(0, 4).map((node, index) => (
              <div className="signal-row" key={node.id}>
                <b>0{index + 1}</b>
                <span
                  className="signal-dot"
                  style={{ background: getNodeColor(node.type) }}
                />
                <div>
                  <strong>{node.label}</strong>
                  <small>{node.type}</small>
                </div>
              </div>
            ))}
          </div>
          <div className="insight-note">
            <span>●</span> DATA STREAM NOMINAL
            <br />
            <small>All relationship data is synchronized</small>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Network;
