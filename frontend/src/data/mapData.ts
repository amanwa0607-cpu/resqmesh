export type LocationType =
  | "hazard"
  | "shelter"
  | "node"
  | "hospital";

export type RiskLevel =
  | "high"
  | "medium"
  | "safe";

export type RoadStatus =
  | "open"
  | "blocked"
  | "caution";

export interface MapLocation {
  id: string;
  name: string;
  type: LocationType;
  position: [number, number];
  description: string;
  status: string;
}

export interface Road {
  id: string;
  name: string;
  points: [number, number][];
  status: RoadStatus;
}

export interface Zone {
  id: string;
  name: string;
  points: [number, number][];
  risk: RiskLevel;
}

export const mapLocations: MapLocation[] = [
  {
    id: "HZ-01",
    name: "Chemical Fire",
    type: "hazard",
    position: [710, 430],
    description:
      "Active fire detected in industrial sector",
    status: "CRITICAL",
  },

  {
    id: "HZ-02",
    name: "Structural Damage",
    type: "hazard",
    position: [500, 720],
    description:
      "Building collapse risk detected",
    status: "HIGH",
  },

  {
    id: "S-01",
    name: "Central Shelter",
    type: "shelter",
    position: [820, 980],
    description:
      "Emergency shelter with medical support",
    status: "AVAILABLE",
  },

  {
    id: "S-02",
    name: "North Shelter",
    type: "shelter",
    position: [250, 850],
    description:
      "Temporary evacuation shelter",
    status: "AVAILABLE",
  },

  {
    id: "H-01",
    name: "City Hospital",
    type: "hospital",
    position: [1050, 600],
    description:
      "Emergency medical facility",
    status: "OPERATIONAL",
  },

  {
    id: "N-01",
    name: "Network Node 01",
    type: "node",
    position: [350, 500],
    description:
      "Emergency communication node",
    status: "ONLINE",
  },

  {
    id: "N-02",
    name: "Network Node 02",
    type: "node",
    position: [700, 800],
    description:
      "Emergency communication node",
    status: "ONLINE",
  },

  {
    id: "N-03",
    name: "Network Node 03",
    type: "node",
    position: [1050, 900],
    description:
      "Emergency communication node",
    status: "LIMITED",
  },
];

export const roads: Road[] = [
  {
    id: "R-01",
    name: "Central Avenue",
    status: "open",
    points: [
      [100, 300],
      [400, 420],
      [700, 500],
      [1100, 580],
      [1450, 700],
    ],
  },

  {
    id: "R-02",
    name: "North Highway",
    status: "open",
    points: [
      [200, 100],
      [500, 250],
      [800, 320],
      [1150, 360],
      [1450, 400],
    ],
  },

  {
    id: "R-03",
    name: "East Connector",
    status: "blocked",
    points: [
      [900, 250],
      [850, 500],
      [800, 700],
      [820, 980],
    ],
  },

  {
    id: "R-04",
    name: "South Route",
    status: "open",
    points: [
      [150, 1100],
      [450, 1000],
      [700, 950],
      [1000, 1000],
      [1400, 1080],
    ],
  },

  {
    id: "R-05",
    name: "West Bypass",
    status: "caution",
    points: [
      [180, 150],
      [250, 400],
      [250, 650],
      [250, 850],
      [200, 1100],
    ],
  },
];

export const zones: Zone[] = [
  {
    id: "Z-A",
    name: "Industrial Zone",
    risk: "high",
    points: [
      [520, 300],
      [850, 250],
      [900, 520],
      [720, 650],
      [500, 540],
    ],
  },

  {
    id: "Z-B",
    name: "Residential Zone",
    risk: "medium",
    points: [
      [250, 600],
      [500, 540],
      [600, 800],
      [500, 1000],
      [250, 900],
    ],
  },

  {
    id: "Z-C",
    name: "Safe District",
    risk: "safe",
    points: [
      [750, 780],
      [1100, 720],
      [1350, 850],
      [1300, 1100],
      [950, 1150],
    ],
  },
];