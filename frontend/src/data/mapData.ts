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

/* =========================================
   MAP DATA INTERFACE
========================================= */

export interface EmergencyMapData {
  id: string;
  name: string;
  description: string;
  locations: MapLocation[];
  roads: Road[];
  zones: Zone[];
}

/* =========================================================
   MAP 01 — CENTRAL EMERGENCY ZONE
========================================================= */

export const map01Locations: MapLocation[] = [
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

export const map01Roads: Road[] = [
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

export const map01Zones: Zone[] = [
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

/* =========================================================
   MAP 02 — EASTERN INDUSTRIAL CORRIDOR
========================================================= */

export const map02Locations: MapLocation[] = [
  {
    id: "HZ-11",
    name: "Gas Leak",
    type: "hazard",
    position: [360, 380],
    description:
      "Industrial gas leakage detected",
    status: "CRITICAL",
  },

  {
    id: "HZ-12",
    name: "Bridge Damage",
    type: "hazard",
    position: [920, 520],
    description:
      "Bridge structure unsafe",
    status: "HIGH",
  },

  {
    id: "S-11",
    name: "East Shelter",
    type: "shelter",
    position: [1120, 850],
    description:
      "Emergency evacuation shelter",
    status: "AVAILABLE",
  },

  {
    id: "S-12",
    name: "West Shelter",
    type: "shelter",
    position: [250, 900],
    description:
      "Temporary relief shelter",
    status: "AVAILABLE",
  },

  {
    id: "H-11",
    name: "Emergency Hospital",
    type: "hospital",
    position: [1080, 280],
    description:
      "Emergency medical facility",
    status: "OPERATIONAL",
  },

  {
    id: "N-11",
    name: "Network Node A",
    type: "node",
    position: [550, 450],
    description:
      "Emergency communication node",
    status: "ONLINE",
  },

  {
    id: "N-12",
    name: "Network Node B",
    type: "node",
    position: [760, 760],
    description:
      "Emergency communication node",
    status: "ONLINE",
  },

  {
    id: "N-13",
    name: "Network Node C",
    type: "node",
    position: [1050, 1000],
    description:
      "Emergency communication node",
    status: "LIMITED",
  },
];

export const map02Roads: Road[] = [
  {
    id: "R-11",
    name: "Industrial Road",
    status: "open",
    points: [
      [100, 250],
      [400, 350],
      [700, 430],
      [1100, 500],
      [1400, 650],
    ],
  },

  {
    id: "R-12",
    name: "Eastern Highway",
    status: "blocked",
    points: [
      [920, 200],
      [920, 520],
      [1000, 700],
      [1120, 850],
    ],
  },

  {
    id: "R-13",
    name: "West Corridor",
    status: "open",
    points: [
      [150, 850],
      [350, 700],
      [600, 650],
      [850, 700],
      [1120, 850],
    ],
  },

  {
    id: "R-14",
    name: "Northern Link",
    status: "caution",
    points: [
      [200, 120],
      [500, 180],
      [800, 200],
      [1080, 280],
    ],
  },

  {
    id: "R-15",
    name: "Southern Connector",
    status: "open",
    points: [
      [100, 1050],
      [350, 950],
      [650, 900],
      [900, 920],
      [1120, 850],
    ],
  },
];

export const map02Zones: Zone[] = [
  {
    id: "Z-11",
    name: "Industrial Sector",
    risk: "high",
    points: [
      [250, 250],
      [600, 220],
      [650, 500],
      [400, 600],
      [200, 450],
    ],
  },

  {
    id: "Z-12",
    name: "Urban Sector",
    risk: "medium",
    points: [
      [600, 550],
      [900, 450],
      [1050, 650],
      [900, 850],
      [600, 800],
    ],
  },

  {
    id: "Z-13",
    name: "Safe East",
    risk: "safe",
    points: [
      [900, 700],
      [1200, 650],
      [1400, 800],
      [1300, 1100],
      [1000, 1050],
    ],
  },
];

/* =========================================================
   MAP 03 — FLOOD & COLLAPSE SECTOR
========================================================= */

export const map03Locations: MapLocation[] = [
  {
    id: "HZ-21",
    name: "Building Collapse",
    type: "hazard",
    position: [620, 350],
    description:
      "Major structural collapse risk",
    status: "CRITICAL",
  },

  {
    id: "HZ-22",
    name: "Flooded Road",
    type: "hazard",
    position: [800, 720],
    description:
      "Road flooded and unsafe",
    status: "HIGH",
  },

  {
    id: "S-21",
    name: "North Relief Center",
    type: "shelter",
    position: [500, 150],
    description:
      "Emergency relief center",
    status: "AVAILABLE",
  },

  {
    id: "S-22",
    name: "South Shelter",
    type: "shelter",
    position: [1000, 1050],
    description:
      "Large evacuation shelter",
    status: "AVAILABLE",
  },

  {
    id: "H-21",
    name: "Medical Center",
    type: "hospital",
    position: [1150, 400],
    description:
      "Emergency medical facility",
    status: "OPERATIONAL",
  },

  {
    id: "N-21",
    name: "Mesh Node 01",
    type: "node",
    position: [350, 550],
    description:
      "Emergency mesh node",
    status: "ONLINE",
  },

  {
    id: "N-22",
    name: "Mesh Node 02",
    type: "node",
    position: [900, 550],
    description:
      "Emergency mesh node",
    status: "ONLINE",
  },

  {
    id: "N-23",
    name: "Mesh Node 03",
    type: "node",
    position: [650, 1000],
    description:
      "Emergency mesh node",
    status: "LIMITED",
  },
];

export const map03Roads: Road[] = [
  {
    id: "R-21",
    name: "North Avenue",
    status: "open",
    points: [
      [100, 200],
      [400, 250],
      [700, 300],
      [1000, 350],
      [1300, 400],
    ],
  },

  {
    id: "R-22",
    name: "River Road",
    status: "blocked",
    points: [
      [300, 500],
      [600, 600],
      [800, 720],
      [1000, 900],
      [1000, 1050],
    ],
  },

  {
    id: "R-23",
    name: "South Bypass",
    status: "open",
    points: [
      [150, 1000],
      [400, 900],
      [650, 950],
      [850, 1000],
      [1000, 1050],
    ],
  },

  {
    id: "R-24",
    name: "Hospital Link",
    status: "caution",
    points: [
      [700, 300],
      [900, 350],
      [1150, 400],
    ],
  },

  {
    id: "R-25",
    name: "Western Escape",
    status: "open",
    points: [
      [100, 650],
      [300, 700],
      [500, 800],
      [650, 950],
    ],
  },
];

export const map03Zones: Zone[] = [
  {
    id: "Z-21",
    name: "Collapse Zone",
    risk: "high",
    points: [
      [450, 250],
      [750, 220],
      [850, 500],
      [650, 600],
      [400, 500],
    ],
  },

  {
    id: "Z-22",
    name: "Flood Risk Area",
    risk: "medium",
    points: [
      [650, 600],
      [950, 550],
      [1100, 800],
      [900, 950],
      [650, 850],
    ],
  },

  {
    id: "Z-23",
    name: "Safe District",
    risk: "safe",
    points: [
      [350, 800],
      [650, 850],
      [850, 1000],
      [600, 1150],
      [300, 1050],
    ],
  },
];

/* =========================================================
   COMPLETE MAP REGISTRY
========================================================= */

export const emergencyMaps: EmergencyMapData[] = [
  {
    id: "MAP-01",
    name: "Central Emergency Zone",
    description:
      "Primary industrial and residential emergency map.",
    locations: map01Locations,
    roads: map01Roads,
    zones: map01Zones,
  },

  {
    id: "MAP-02",
    name: "Eastern Industrial Corridor",
    description:
      "Gas leak and bridge damage response map.",
    locations: map02Locations,
    roads: map02Roads,
    zones: map02Zones,
  },

  {
    id: "MAP-03",
    name: "Flood & Collapse Sector",
    description:
      "Flood and structural damage response map.",
    locations: map03Locations,
    roads: map03Roads,
    zones: map03Zones,
  },
];

/* =========================================================
   DEFAULT / BACKWARD COMPATIBILITY
========================================================= */

/*
 * IMPORTANT:
 *
 * Existing components still use:
 *
 * mapLocations
 * roads
 * zones
 *
 * So MAP-01 remains the default.
 */

export const defaultMap =
  emergencyMaps[0];

export const mapLocations =
  defaultMap.locations;

export const roads =
  defaultMap.roads;

export const zones =
  defaultMap.zones;