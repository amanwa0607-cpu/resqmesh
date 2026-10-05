import { mapLocations } from "../data/mapData";

export interface RouteNode {
  id: string;
  position: [number, number];
}

export interface RouteEdge {
  from: string;
  to: string;
  distance: number;
  blocked?: boolean;
}

export interface RouteResult {
  path: [number, number][];
  distance: number;
  blockedRoadsAvoided: number;
  status: "SAFE" | "NO_ROUTE";
  nodePath: string[];
}

/*
 * Internal evacuation network.
 *
 * These junctions represent the road-network graph
 * used by the route calculation engine.
 */

const routeNodes: RouteNode[] = [
  {
    id: "HZ-01",
    position: [710, 430],
  },

  {
    id: "HZ-02",
    position: [500, 720],
  },

  {
    id: "J-01",
    position: [700, 500],
  },

  {
    id: "J-02",
    position: [1100, 580],
  },

  {
    id: "J-03",
    position: [700, 950],
  },

  {
    id: "J-04",
    position: [900, 250],
  },

  {
    id: "J-05",
    position: [850, 500],
  },

  {
    id: "J-06",
    position: [800, 700],
  },

  {
    id: "S-01",
    position: [820, 980],
  },

  {
    id: "S-02",
    position: [250, 850],
  },
];

/*
 * Road network.
 *
 * Blocked roads are deliberately included so that
 * Dijkstra can avoid them and find an alternate route.
 */

const routeEdges: RouteEdge[] = [
  {
    from: "HZ-01",
    to: "J-01",
    distance: 100,
  },

  {
    from: "HZ-02",
    to: "J-01",
    distance: 230,
  },

  {
    from: "J-01",
    to: "J-02",
    distance: 420,
  },

  {
    from: "J-01",
    to: "J-03",
    distance: 450,
  },

  {
    from: "J-03",
    to: "S-01",
    distance: 130,
  },

  {
    from: "J-03",
    to: "S-02",
    distance: 520,
  },

  {
    from: "J-04",
    to: "J-05",
    distance: 280,
    blocked: true,
  },

  {
    from: "J-05",
    to: "J-06",
    distance: 210,
    blocked: true,
  },

  {
    from: "J-06",
    to: "S-01",
    distance: 300,
    blocked: true,
  },

  {
    from: "J-04",
    to: "J-02",
    distance: 330,
  },

  {
    from: "J-05",
    to: "J-01",
    distance: 200,
  },
];

/*
 * Build an undirected graph.
 */

function buildGraph() {
  const graph: Record<string, RouteEdge[]> = {};

  routeNodes.forEach((node) => {
    graph[node.id] = [];
  });

  routeEdges.forEach((edge) => {
    graph[edge.from].push(edge);

    graph[edge.to].push({
      from: edge.to,
      to: edge.from,
      distance: edge.distance,
      blocked: edge.blocked,
    });
  });

  return graph;
}

/*
 * Dijkstra shortest-path algorithm.
 */

function dijkstra(
  start: string,
  destination: string
): {
  path: string[];
  distance: number;
} | null {
  const graph = buildGraph();

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();

  routeNodes.forEach((node) => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  });

  distances[start] = 0;

  while (visited.size < routeNodes.length) {
    let current: string | null = null;

    for (const node of routeNodes) {
      if (visited.has(node.id)) continue;

      if (
        current === null ||
        distances[node.id] < distances[current]
      ) {
        current = node.id;
      }
    }

    if (current === null) break;

    if (current === destination) break;

    visited.add(current);

    for (const edge of graph[current]) {
      /*
       * Never use blocked roads.
       */
      if (edge.blocked) continue;

      const newDistance =
        distances[current] + edge.distance;

      if (newDistance < distances[edge.to]) {
        distances[edge.to] = newDistance;
        previous[edge.to] = current;
      }
    }
  }

  if (distances[destination] === Infinity) {
    return null;
  }

  const path: string[] = [];

  let current: string | null = destination;

  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  return {
    path,
    distance: distances[destination],
  };
}

/*
 * Convert node IDs into map coordinates.
 */

function nodePathToCoordinates(
  nodePath: string[]
): [number, number][] {
  return nodePath
    .map((nodeId) =>
      routeNodes.find((node) => node.id === nodeId)
    )
    .filter(
      (node): node is RouteNode => node !== undefined
    )
    .map((node) => node.position);
}

/*
 * Public route calculation function.
 */

export function calculateEvacuationRoute(
  hazardId: string,
  shelterId: string
): RouteResult {
  /*
   * Make sure both locations exist in map data.
   */
  const hazardExists = mapLocations.some(
    (location) =>
      location.id === hazardId &&
      location.type === "hazard"
  );

  const shelterExists = mapLocations.some(
    (location) =>
      location.id === shelterId &&
      location.type === "shelter"
  );

  if (!hazardExists || !shelterExists) {
    return {
      path: [],
      distance: 0,
      blockedRoadsAvoided: 0,
      status: "NO_ROUTE",
      nodePath: [],
    };
  }

  /*
   * Calculate shortest available route.
   */
  const result = dijkstra(
    hazardId,
    shelterId
  );

  if (!result) {
    return {
      path: [],
      distance: 0,
      blockedRoadsAvoided: 0,
      status: "NO_ROUTE",
      nodePath: [],
    };
  }

  /*
   * Count blocked alternatives skipped by the engine.
   */
  const blockedRoadsAvoided = routeEdges.filter(
    (edge) => edge.blocked
  ).length;

  return {
    path: nodePathToCoordinates(result.path),
    distance: result.distance,
    blockedRoadsAvoided,
    status: "SAFE",
    nodePath: result.path,
  };
}