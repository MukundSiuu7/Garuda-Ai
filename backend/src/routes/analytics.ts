import { Router } from "express";

import {
  Person,
  Organization,
  Location,
  Vehicle,
  Phone,
  Account,
  Case,
  Event,
  Transaction,
  Relationship,
} from "../models/models";

const router = Router();

/*
==================================================
TYPES
==================================================
*/

interface GraphNode {
  id: string;
  label: string;
  type: string;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  strength: number;
}

interface AnalyticsNode {
  id: string;
  label: string;
  type: string;

  degreeCentrality: number;
  betweennessCentrality: number;
  pageRank: number;

  community: number;

  structuralImportance: number;
}

/*
==================================================
HELPERS
==================================================
*/

function createGraph(nodes: GraphNode[], edges: GraphEdge[]) {
  const adjacency = new Map<string, Set<string>>();

  nodes.forEach((node) => {
    adjacency.set(node.id, new Set());
  });

  edges.forEach((edge) => {
    if (!adjacency.has(edge.source)) {
      adjacency.set(edge.source, new Set());
    }

    if (!adjacency.has(edge.target)) {
      adjacency.set(edge.target, new Set());
    }

    adjacency.get(edge.source)!.add(edge.target);

    adjacency.get(edge.target)!.add(edge.source);
  });

  return adjacency;
}

/*
==================================================
DEGREE CENTRALITY
==================================================

Number of direct connections.

Normalized:

degree / (N - 1)
==================================================
*/

function calculateDegreeCentrality(
  nodes: GraphNode[],
  adjacency: Map<string, Set<string>>,
) {
  const result = new Map<string, number>();

  const totalNodes = nodes.length;

  nodes.forEach((node) => {
    const degree = adjacency.get(node.id)?.size ?? 0;

    const centrality = totalNodes <= 1 ? 0 : degree / (totalNodes - 1);

    result.set(node.id, centrality);
  });

  return result;
}

/*
==================================================
BETWEENNESS CENTRALITY
==================================================

Brandes-style algorithm for
an unweighted graph.

Measures how often a node
appears on shortest paths.
==================================================
*/

function calculateBetweennessCentrality(
  nodes: GraphNode[],
  adjacency: Map<string, Set<string>>,
) {
  const betweenness = new Map<string, number>();

  nodes.forEach((node) => {
    betweenness.set(node.id, 0);
  });

  for (const source of nodes) {
    const stack: string[] = [];

    const predecessors = new Map<string, string[]>();

    const distance = new Map<string, number>();

    const paths = new Map<string, number>();

    nodes.forEach((node) => {
      predecessors.set(node.id, []);

      distance.set(node.id, -1);

      paths.set(node.id, 0);
    });

    distance.set(source.id, 0);

    paths.set(source.id, 1);

    const queue: string[] = [source.id];

    /*
    ==============================================
    BFS
    ==============================================
    */

    while (queue.length > 0) {
      const current = queue.shift()!;

      stack.push(current);

      const neighbors = adjacency.get(current) ?? new Set();

      for (const neighbor of neighbors) {
        if (distance.get(neighbor) === -1) {
          distance.set(neighbor, (distance.get(current) ?? 0) + 1);

          queue.push(neighbor);
        }

        if (distance.get(neighbor) === (distance.get(current) ?? 0) + 1) {
          paths.set(
            neighbor,
            (paths.get(neighbor) ?? 0) + (paths.get(current) ?? 0),
          );

          predecessors.get(neighbor)!.push(current);
        }
      }
    }

    /*
    ==============================================
    ACCUMULATION
    ==============================================
    */

    const dependency = new Map<string, number>();

    nodes.forEach((node) => {
      dependency.set(node.id, 0);
    });

    while (stack.length > 0) {
      const current = stack.pop()!;

      const previousNodes = predecessors.get(current) ?? [];

      for (const previous of previousNodes) {
        const currentPaths = paths.get(current) ?? 1;

        const previousPaths = paths.get(previous) ?? 0;

        const contribution =
          currentPaths === 0
            ? 0
            : (previousPaths / currentPaths) *
              (1 + (dependency.get(current) ?? 0));

        dependency.set(
          previous,
          (dependency.get(previous) ?? 0) + contribution,
        );
      }

      if (current !== source.id) {
        betweenness.set(
          current,

          (betweenness.get(current) ?? 0) + (dependency.get(current) ?? 0),
        );
      }
    }
  }

  /*
  ==============================================
  NORMALIZE
  ==============================================
  */

  const totalNodes = nodes.length;

  if (totalNodes > 2) {
    const normalization = (totalNodes - 1) * (totalNodes - 2);

    betweenness.forEach((value, id) => {
      betweenness.set(id, value / normalization);
    });
  }

  return betweenness;
}

/*
==================================================
PAGERANK
==================================================

Measures structural importance
based on connections to other
important nodes.
==================================================
*/

function calculatePageRank(
  nodes: GraphNode[],
  adjacency: Map<string, Set<string>>,
) {
  const pageRank = new Map<string, number>();

  const totalNodes = nodes.length;

  if (totalNodes === 0) {
    return pageRank;
  }

  const damping = 0.85;

  const iterations = 30;

  nodes.forEach((node) => {
    pageRank.set(node.id, 1 / totalNodes);
  });

  for (let iteration = 0; iteration < iterations; iteration++) {
    const nextRank = new Map<string, number>();

    nodes.forEach((node) => {
      nextRank.set(node.id, (1 - damping) / totalNodes);
    });

    for (const node of nodes) {
      const neighbors = adjacency.get(node.id) ?? new Set();

      const currentRank = pageRank.get(node.id) ?? 0;

      if (neighbors.size === 0) {
        const contribution = (damping * currentRank) / totalNodes;

        nodes.forEach((target) => {
          nextRank.set(
            target.id,

            (nextRank.get(target.id) ?? 0) + contribution,
          );
        });
      } else {
        const contribution = (damping * currentRank) / neighbors.size;

        for (const neighbor of neighbors) {
          nextRank.set(
            neighbor,

            (nextRank.get(neighbor) ?? 0) + contribution,
          );
        }
      }
    }

    nextRank.forEach((value, id) => {
      pageRank.set(id, value);
    });
  }

  /*
  ==============================================
  NORMALIZE PAGE RANK
  ==============================================
  */

  const maximum = Math.max(...Array.from(pageRank.values()));

  if (maximum > 0) {
    pageRank.forEach((value, id) => {
      pageRank.set(id, value / maximum);
    });
  }

  return pageRank;
}

/*
==================================================
COMMUNITY DETECTION
==================================================

Simple label-propagation approach.

Nodes repeatedly adopt the most
common community label among
their neighbors.
==================================================
*/

function detectCommunities(
  nodes: GraphNode[],
  adjacency: Map<string, Set<string>>,
) {
  const communities = new Map<string, number>();

  /*
  ==============================================
  INITIAL COMMUNITY
  ==============================================
  */

  nodes.forEach((node, index) => {
    communities.set(node.id, index);
  });

  /*
  ==============================================
  ITERATIONS
  ==============================================
  */

  for (let iteration = 0; iteration < 10; iteration++) {
    let changed = false;

    for (const node of nodes) {
      const neighbors = adjacency.get(node.id) ?? new Set();

      if (neighbors.size === 0) {
        continue;
      }

      const counts = new Map<number, number>();

      for (const neighbor of neighbors) {
        const community = communities.get(neighbor);

        if (community === undefined) {
          continue;
        }

        counts.set(
          community,

          (counts.get(community) ?? 0) + 1,
        );
      }

      if (counts.size === 0) {
        continue;
      }

      let bestCommunity = communities.get(node.id)!;

      let bestCount = 0;

      counts.forEach((count, community) => {
        if (count > bestCount) {
          bestCount = count;

          bestCommunity = community;
        }
      });

      if (bestCommunity !== communities.get(node.id)) {
        communities.set(node.id, bestCommunity);

        changed = true;
      }
    }

    if (!changed) {
      break;
    }
  }

  /*
  ==============================================
  RENUMBER COMMUNITIES
  ==============================================
  */

  const communityMap = new Map<number, number>();

  let nextCommunity = 1;

  communities.forEach((community, nodeId) => {
    if (!communityMap.has(community)) {
      communityMap.set(community, nextCommunity);

      nextCommunity++;
    }

    communities.set(
      nodeId,

      communityMap.get(community)!,
    );
  });

  return communities;
}

/*
==================================================
GET ALL NETWORK DATA
==================================================
*/

async function getNetworkData() {
  const [
    persons,
    organizations,
    locations,
    vehicles,
    phones,
    accounts,
    cases,
    events,
    transactions,
    relationships,
  ] = await Promise.all([
    Person.find().lean(),

    Organization.find().lean(),

    Location.find().lean(),

    Vehicle.find().lean(),

    Phone.find().lean(),

    Account.find().lean(),

    Case.find().lean(),

    Event.find().lean(),

    Transaction.find().lean(),

    Relationship.find().lean(),
  ]);

  /*
  ==============================================
  NODES
  ==============================================
  */

  const nodes: GraphNode[] = [];

  persons.forEach((person) => {
    nodes.push({
      id: person.entityId,

      label: person.name,

      type: "Person",
    });
  });

  organizations.forEach((organization) => {
    nodes.push({
      id: organization.entityId,

      label: organization.name,

      type: "Organization",
    });
  });

  locations.forEach((location) => {
    nodes.push({
      id: location.entityId,

      label: location.name,

      type: "Location",
    });
  });

  vehicles.forEach((vehicle) => {
    nodes.push({
      id: vehicle.entityId,

      label: vehicle.registrationNumber,

      type: "Vehicle",
    });
  });

  phones.forEach((phone) => {
    nodes.push({
      id: phone.entityId,

      label: phone.number,

      type: "Phone",
    });
  });

  accounts.forEach((account) => {
    nodes.push({
      id: account.entityId,

      label: account.accountNumber,

      type: "Bank Account",
    });
  });

  cases.forEach((crimeCase) => {
    nodes.push({
      id: crimeCase.caseId,

      label: crimeCase.title,

      type: "Case",
    });
  });

  events.forEach((event) => {
    nodes.push({
      id: event.eventId,

      label: event.eventType,

      type: "Event",
    });
  });

  transactions.forEach((transaction) => {
    nodes.push({
      id: transaction.transactionId,

      label: transaction.transactionId,

      type: "Transaction",
    });
  });

  /*
  ==============================================
  EDGES
  ==============================================
  */

  const edges: GraphEdge[] = relationships.map((relationship) => ({
    id: relationship.relationshipId,

    source: relationship.sourceId,

    target: relationship.targetId,

    type: relationship.relationshipType,

    strength: relationship.strength,
  }));

  return {
    nodes,
    edges,
  };
}

/*
==================================================
GET ANALYTICS
==================================================
*/

router.get("/", async (_req, res) => {
  try {
    /*
    ==============================================
    GET NETWORK
    ==============================================
    */

    const { nodes, edges } = await getNetworkData();

    /*
    ==============================================
    BUILD GRAPH
    ==============================================
    */

    const adjacency = createGraph(nodes, edges);

    /*
    ==============================================
    CALCULATE ALGORITHMS
    ==============================================
    */

    const degree = calculateDegreeCentrality(nodes, adjacency);

    const betweenness = calculateBetweennessCentrality(nodes, adjacency);

    const pageRank = calculatePageRank(nodes, adjacency);

    const communities = detectCommunities(nodes, adjacency);

    /*
    ==============================================
    COMBINE RESULTS
    ==============================================
    */

    const analyticsNodes: AnalyticsNode[] = nodes.map((node) => {
      const degreeValue = degree.get(node.id) ?? 0;

      const betweennessValue = betweenness.get(node.id) ?? 0;

      const pageRankValue = pageRank.get(node.id) ?? 0;

      const community = communities.get(node.id) ?? 0;

      /*
        ==========================================
        STRUCTURAL IMPORTANCE
        ==========================================

        This is NOT criminal probability.

        It is simply a combined network
        importance indicator.
        ==========================================
        */

      const structuralImportance =
        (degreeValue + betweennessValue + pageRankValue) / 3;

      return {
        id: node.id,

        label: node.label,

        type: node.type,

        degreeCentrality: Number(degreeValue.toFixed(4)),

        betweennessCentrality: Number(betweennessValue.toFixed(4)),

        pageRank: Number(pageRankValue.toFixed(4)),

        community,

        structuralImportance: Number(structuralImportance.toFixed(4)),
      };
    });

    /*
    ==============================================
    SORT BY STRUCTURAL IMPORTANCE
    ==============================================
    */

    analyticsNodes.sort(
      (a, b) => b.structuralImportance - a.structuralImportance,
    );

    /*
    ==============================================
    COMMUNITY SUMMARY
    ==============================================
    */

    const communitySummary = new Map<number, number>();

    analyticsNodes.forEach((node) => {
      communitySummary.set(
        node.community,

        (communitySummary.get(node.community) ?? 0) + 1,
      );
    });

    const communitiesResult = Array.from(communitySummary.entries()).map(
      ([community, size]) => ({
        community,

        size,
      }),
    );

    /*
    ==============================================
    RESPONSE
    ==============================================
    */

    res.status(200).json({
      totalNodes: nodes.length,

      totalEdges: edges.length,

      nodes: analyticsNodes,

      communities: communitiesResult,
    });
  } catch (error) {
    console.error("Analytics API error:", error);

    res.status(500).json({
      message: "Failed to calculate network analytics",
    });
  }
});

export default router;
