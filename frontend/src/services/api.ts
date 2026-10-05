const API_PORT = 5000;

const API_BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? `http://localhost:${API_PORT}`
    : `http://${window.location.hostname}:${API_PORT}`;

const API_TIMEOUT = 4000;

export interface ApiLocation {
  id: string;
  name: string;
  type: "hazard" | "shelter" | "node" | "hospital";
  position: [number, number];
  description: string;
  status: string;
}

export interface ApiRoad {
  id: string;
  name: string;
  points: [number, number][];
  status: "open" | "blocked" | "caution";
}

interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  message?: string;
}

interface BackendEmergency {
  _id: string;
  emergencyId: string;
  name: string;
  type: string;
  description: string;
  severity?: string;
  status: string;
  position: {
    lat: number;
    lng: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface BackendShelter {
  _id: string;
  shelterId?: string;
  id?: string;
  name: string;
  description?: string;
  status?: string;
  capacity?: number;
  position: {
    lat: number;
    lng: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface BackendRoad {
  _id?: string;
  roadId?: string;
  id?: string;
  name: string;
  status: string;
  points: unknown;
}

async function apiFetch<T>(
  endpoint: string
): Promise<T> {
  const url =
    `${API_BASE_URL}${endpoint}`;

  console.log(
    `[ResQMesh API] GET ${url}`
  );

  const controller =
    new AbortController();

  const timeout =
    window.setTimeout(() => {
      controller.abort();
    }, API_TIMEOUT);

  try {
    const response =
      await fetch(url, {
        method: "GET",
        headers: {
          Accept:
            "application/json",
        },
        signal:
          controller.signal,
      });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const json =
      (await response.json()) as ApiResponse<T>;

    if (json.success === false) {
      throw new Error(
        json.message ||
          "API request failed."
      );
    }

    return json.data;
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      throw new Error(
        "ResQMesh API request timed out."
      );
    }

    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}function normalizePosition(
  position: {
    lat: number;
    lng: number;
  }
): [number, number] {
  return [
    Number(position.lat),
    Number(position.lng),
  ];
}

function normalizeEmergency(
  emergency: BackendEmergency
): ApiLocation {
  return {
    id:
      emergency.emergencyId ||
      emergency._id,

    name: emergency.name,

    type: "hazard",

    position:
      normalizePosition(
        emergency.position
      ),

    description:
      emergency.description ||
      "Emergency location",

    status:
      emergency.severity
        ? emergency.severity.toUpperCase()
        : emergency.status.toUpperCase(),
  };
}

function normalizeShelter(
  shelter: BackendShelter
): ApiLocation {
  return {
    id:
      shelter.shelterId ||
      shelter.id ||
      shelter._id,

    name: shelter.name,

    type: "shelter",

    position:
      normalizePosition(
        shelter.position
      ),

    description:
      shelter.description ||
      "Emergency evacuation shelter",

    status:
      shelter.status
        ? shelter.status.toUpperCase()
        : "AVAILABLE",
  };
}

function normalizeRoadPoints(
  points: unknown
): [number, number][] {
  if (!Array.isArray(points)) {
    return [];
  }

  return points
    .map(
      (
        point
      ): [number, number] | null => {

        if (
          Array.isArray(point) &&
          point.length >= 2
        ) {
          const lat =
            Number(point[0]);

          const lng =
            Number(point[1]);

          if (
            Number.isFinite(lat) &&
            Number.isFinite(lng)
          ) {
            return [
              lat,
              lng,
            ];
          }

          return null;
        }

        if (
          typeof point ===
            "object" &&
          point !== null &&
          "lat" in point &&
          "lng" in point
        ) {
          const value =
            point as {
              lat: number;
              lng: number;
            };

          const lat =
            Number(value.lat);

          const lng =
            Number(value.lng);

          if (
            Number.isFinite(lat) &&
            Number.isFinite(lng)
          ) {
            return [
              lat,
              lng,
            ];
          }
        }

        return null;
      }
    )
    .filter(
      (
        point
      ): point is [
        number,
        number
      ] =>
        point !== null
    );
}

function normalizeRoad(
  road: BackendRoad
): ApiRoad {
  let status:
    | "open"
    | "blocked"
    | "caution" =
    "open";

  const backendStatus =
    String(
      road.status || ""
    ).toLowerCase();

  if (
    backendStatus.includes(
      "block"
    ) ||
    backendStatus.includes(
      "closed"
    )
  ) {
    status = "blocked";
  } else if (
    backendStatus.includes(
      "caution"
    ) ||
    backendStatus.includes(
      "warning"
    )
  ) {
    status = "caution";
  }

  return {
    id:
      road.roadId ||
      road.id ||
      road._id ||
      `ROAD-${Math.random()
        .toString(36)
        .slice(2, 8)}`,

    name: road.name,

    points:
      normalizeRoadPoints(
        road.points
      ),

    status,
  };
}
export async function getEmergencies(): Promise<
  ApiLocation[]
> {
  const data =
    await apiFetch<
      BackendEmergency[]
    >(
      "/api/emergencies"
    );

  if (!Array.isArray(data)) {
    throw new Error(
      "Invalid emergencies API response."
    );
  }

  return data.map(
    normalizeEmergency
  );
}

export async function getShelters(): Promise<
  ApiLocation[]
> {
  const data =
    await apiFetch<
      BackendShelter[]
    >(
      "/api/shelters"
    );

  if (!Array.isArray(data)) {
    throw new Error(
      "Invalid shelters API response."
    );
  }

  return data.map(
    normalizeShelter
  );
}

export async function getRoads(): Promise<
  ApiRoad[]
> {
  const data =
    await apiFetch<
      BackendRoad[]
    >(
      "/api/roads"
    );

  if (!Array.isArray(data)) {
    throw new Error(
      "Invalid roads API response."
    );
  }

  return data.map(
    normalizeRoad
  );
}

export async function getMapData(): Promise<{
  locations: ApiLocation[];
  roads: ApiRoad[];
}> {
  const [
    emergencies,
    shelters,
    roads,
  ] = await Promise.all([
    getEmergencies(),
    getShelters(),
    getRoads(),
  ]);

  const locations:
    ApiLocation[] = [
    ...emergencies,
    ...shelters,
  ];

  console.log(
    "[ResQMesh API] Normalized map data:",
    {
      hazards:
        emergencies.length,

      shelters:
        shelters.length,

      roads:
        roads.length,
    }
  );

  return {
    locations,
    roads,
  };
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const response =
      await fetch(
        `${API_BASE_URL}/api/health`,
        {
          signal:
            AbortSignal.timeout(
              API_TIMEOUT
            ),
        }
      );

    return response.ok;
  } catch {
    return false;
  }
}

export { API_BASE_URL };