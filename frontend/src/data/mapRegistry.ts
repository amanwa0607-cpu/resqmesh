import {
  mapLocations,
  roads,
  zones,
} from "./mapData";

import type {
  MapLocation,
  Road,
  Zone,
} from "./mapData";

/* =========================================
   MAP DEFINITION
========================================= */

export interface ResQMap {
  id: string;
  name: string;
  description: string;

  locations: MapLocation[];
  roads: Road[];
  zones: Zone[];
}

/* =========================================
   AVAILABLE OFFLINE MAPS
========================================= */

export const RESQMESH_MAPS: ResQMap[] = [
  {
    id: "MAP-01",
    name: "Central Emergency Zone",
    description:
      "Primary fictional emergency response map.",

    locations: mapLocations,
    roads,
    zones,
  },
];

/* =========================================
   DEFAULT MAP
========================================= */

export const DEFAULT_MAP_ID =
  "MAP-01";

/* =========================================
   GET MAP BY ID
========================================= */

export function getMapById(
  mapId: string
): ResQMap | null {
  return (
    RESQMESH_MAPS.find(
      (map) => map.id === mapId
    ) ?? null
  );
}

/* =========================================
   GET DEFAULT MAP
========================================= */

export function getDefaultMap(): ResQMap {
  return (
    getMapById(DEFAULT_MAP_ID) ??
    RESQMESH_MAPS[0]
  );
}