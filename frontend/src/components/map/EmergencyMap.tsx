import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  MapContainer,
  Polygon,
  Polyline,
  Tooltip,
  useMap,
} from "react-leaflet";

import {
  CRS,
  LatLngBounds,
} from "leaflet";

import {
  type MapLocation,
  type Road,
  type Zone,
} from "../../data/mapData";

import {
  DEFAULT_MAP_ID,
  getMapById,
} from "../../data/mapRegistry";

import {
  getMapData,
} from "../../services/api";

import {
  calculateEvacuationRoute,
  type RouteResult,
} from "../../services/routeEngine";

import {
  decodeRouteShareUrl,
  type SharedRoutePayload,
} from "../../services/routeShare";

import {
  getMapSnapshot,
  getReceivedRoute,
  saveMapSnapshot,
  saveReceivedRoute,
  clearReceivedRoute,
} from "../../services/offlineStorage";

import MapSelector from "./MapSelector";
import RouteSharePanel from "./RouteSharePanel";
import RouteScannerPanel from "./RouteScannerPanel";
import MapMarker from "./MapMarker";


/* =========================================================
   MAP CONFIG
========================================================= */

const DEFAULT_CENTER: [number, number] = [
  650,
  750,
];

const DEFAULT_ZOOM = -1;


/* =========================================================
   MAP FIT COMPONENT
========================================================= */

interface MapFitProps {
  locations: MapLocation[];
  roads: Road[];
  zones: Zone[];
}

function MapFit({
  locations,
  roads,
  zones,
}: MapFitProps) {
  const map = useMap();

  useEffect(() => {
    const coordinates: [number, number][] = [];

    locations.forEach((location) => {
      coordinates.push(location.position);
    });

    roads.forEach((road) => {
      road.points.forEach((point) => {
        coordinates.push(point);
      });
    });

    zones.forEach((zone) => {
      zone.points.forEach((point) => {
        coordinates.push(point);
      });
    });

    if (coordinates.length === 0) {
      map.setView(
        DEFAULT_CENTER,
        DEFAULT_ZOOM
      );
      return;
    }

    const bounds =
      new LatLngBounds(coordinates);

    map.fitBounds(bounds, {
      padding: [45, 45],
      maxZoom: 0,
      animate: true,
    });
  }, [
    map,
    locations,
    roads,
    zones,
  ]);

  return null;
}


/* =========================================================
   ZONE COLORS
========================================================= */

const zoneColors = {
  high: {
    color: "#e45c63",
    fillColor: "#e45c63",
  },

  medium: {
    color: "#e4a94f",
    fillColor: "#e4a94f",
  },

  safe: {
    color: "#2db273",
    fillColor: "#2db273",
  },
};


/* =========================================================
   COMPONENT
========================================================= */

export default function EmergencyMap() {

  const [
    selectedMapId,
    setSelectedMapId,
  ] = useState(
    DEFAULT_MAP_ID
  );


  const [
    locations,
    setLocations,
  ] = useState<MapLocation[]>([]);


  const [
    roadData,
    setRoadData,
  ] = useState<Road[]>([]);


  const [
    zoneData,
    setZoneData,
  ] = useState<Zone[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    offlineMode,
    setOfflineMode,
  ] = useState(false);


  const [
    apiError,
    setApiError,
  ] = useState("");


  const [
    selectedHazard,
    setSelectedHazard,
  ] = useState("");


  const [
    selectedShelter,
    setSelectedShelter,
  ] = useState("");


  const [
    showQR,
    setShowQR,
  ] = useState(false);


  const [
    showScanner,
    setShowScanner,
  ] = useState(false);


  const [
    receivedRoute,
    setReceivedRoute,
  ] = useState<SharedRoutePayload | null>(
    null
  );


  /* =======================================================
     SELECTED MAP
  ======================================================= */

  const selectedMap = useMemo(
    () =>
      getMapById(
        selectedMapId
      ),
    [selectedMapId]
  );


  /* =======================================================
     MAP SELECTOR HANDLER
  ======================================================= */

  function handleMapChange(
    mapId: string
  ) {
    const map =
      getMapById(mapId);

    if (!map) {
      return;
    }

    setSelectedMapId(mapId);

    setLocations(
      map.locations
    );

    setRoadData(
      map.roads
    );

    setZoneData(
      map.zones
    );

    const firstHazard =
      map.locations.find(
        (location) =>
          location.type ===
          "hazard"
      );

    const firstShelter =
      map.locations.find(
        (location) =>
          location.type ===
          "shelter"
      );

    setSelectedHazard(
      firstHazard?.id || ""
    );

    setSelectedShelter(
      firstShelter?.id || ""
    );

    setApiError("");

    console.log(
      "[ResQMesh Map] Switched to:",
      map.id,
      map.name
    );
  }


  /* =======================================================
     LOAD DEFAULT MAP IMMEDIATELY
  ======================================================= */

  useEffect(() => {
    const map =
      getMapById(
        DEFAULT_MAP_ID
      );

    if (!map) {
      return;
    }

    setLocations(
      map.locations
    );

    setRoadData(
      map.roads
    );

    setZoneData(
      map.zones
    );

    const firstHazard =
      map.locations.find(
        (location) =>
          location.type ===
          "hazard"
      );

    const firstShelter =
      map.locations.find(
        (location) =>
          location.type ===
          "shelter"
      );

    setSelectedHazard(
      firstHazard?.id || ""
    );

    setSelectedShelter(
      firstShelter?.id || ""
    );
  }, []);


  /* =======================================================
     LIVE API + OFFLINE SNAPSHOT
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadOfflineSnapshot() {
      try {
        const snapshot =
          await getMapSnapshot();

        if (!mounted) {
          return;
        }

        if (
          snapshot &&
          snapshot.locations.length > 0
        ) {
          setLocations(
            snapshot.locations
          );

          setRoadData(
            snapshot.roads
          );

          setZoneData(
            selectedMap?.zones || []
          );

          setOfflineMode(true);

          setApiError(
            "Live server unavailable. Using saved offline map."
          );

          console.log(
            "[ResQMesh Offline] Snapshot loaded:",
            new Date(
              snapshot.savedAt
            ).toLocaleString()
          );
        }
      } catch (error) {
        console.error(
          "[ResQMesh Offline] Snapshot load failed:",
          error
        );
      }
    }


    async function loadLiveMap() {
      try {
        setLoading(true);
        setApiError("");

        const data =
          await getMapData();

        if (!mounted) {
          return;
        }

        /*
         * The backend currently represents
         * the default operational map.
         *
         * The three fictional maps are
         * maintained locally for offline
         * demonstration and rapid switching.
         */

        const defaultMap =
          getMapById(
            DEFAULT_MAP_ID
          );

        if (defaultMap) {
          setLocations(
            defaultMap.locations
          );

          setRoadData(
            defaultMap.roads
          );

          setZoneData(
            defaultMap.zones
          );

          const firstHazard =
            defaultMap.locations.find(
              (item) =>
                item.type ===
                "hazard"
            );

          const firstShelter =
            defaultMap.locations.find(
              (item) =>
                item.type ===
                "shelter"
            );

          setSelectedHazard(
            firstHazard?.id || ""
          );

          setSelectedShelter(
            firstShelter?.id || ""
          );
        }

        setOfflineMode(false);

        try {
          await saveMapSnapshot(
            defaultMap?.locations ||
              data.locations as MapLocation[],
            defaultMap?.roads ||
              data.roads as Road[]
          );
        } catch (error) {
          console.warn(
            "[ResQMesh Offline] Snapshot save failed:",
            error
          );
        }

      } catch (error) {
        console.error(
          "[ResQMesh API] Live map unavailable:",
          error
        );

        await loadOfflineSnapshot();

      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }


    function handleOffline() {
      if (!mounted) {
        return;
      }

      setOfflineMode(true);

      setApiError(
        "Network unavailable. ResQMesh is using saved offline data."
      );

      loadOfflineSnapshot();
    }


    function handleOnline() {
      if (!mounted) {
        return;
      }

      setOfflineMode(false);

      setApiError("");

      loadLiveMap();
    }


    window.addEventListener(
      "offline",
      handleOffline
    );

    window.addEventListener(
      "online",
      handleOnline
    );


    loadLiveMap();


    return () => {
      mounted = false;

      window.removeEventListener(
        "offline",
        handleOffline
      );

      window.removeEventListener(
        "online",
        handleOnline
      );
    };

  }, []);
  /* =======================================================
     LOAD RECEIVED ROUTE
  ======================================================= */

  useEffect(() => {
    getReceivedRoute()
      .then((route) => {
        if (route) {
          console.log(
            "[ResQMesh Offline] Saved route loaded:",
            route.hazardId,
            "→",
            route.shelterId
          );

          setReceivedRoute(route);
        }
      })
      .catch((error) => {
        console.error(
          "[ResQMesh Offline] Saved route load failed:",
          error
        );
      });
  }, []);


  /* =======================================================
     READ ROUTE FROM QR URL
  ======================================================= */

  useEffect(() => {
    async function readSharedRoute() {
      try {
        const hash =
          window.location.hash;

        if (
          !hash.startsWith(
            "#/route"
          )
        ) {
          return;
        }

        const queryStart =
          hash.indexOf("?");

        if (queryStart === -1) {
          return;
        }

        const query =
          hash.slice(
            queryStart + 1
          );

        const params =
          new URLSearchParams(
            query
          );

        const encoded =
          params.get("d");

        if (!encoded) {
          return;
        }

        const route =
          decodeRouteShareUrl(
            encoded
          );

        console.log(
          "[ResQMesh QR] Route decoded:",
          route
        );

        setReceivedRoute(
          route
        );

        await saveReceivedRoute(
          route
        );

        window.history.replaceState(
          null,
          "",
          window.location.pathname
        );

      } catch (error) {
        console.error(
          "[ResQMesh QR] Route decode failed:",
          error
        );
      }
    }

    readSharedRoute();
  }, []);


  /* =======================================================
     FILTER HAZARDS + SHELTERS
  ======================================================= */

  const hazards = useMemo(
    () =>
      locations.filter(
        (item) =>
          item.type ===
          "hazard"
      ),
    [locations]
  );


  const shelters = useMemo(
    () =>
      locations.filter(
        (item) =>
          item.type ===
          "shelter"
      ),
    [locations]
  );


  /* =======================================================
     CALCULATE ROUTE
  ======================================================= */

  const route = useMemo<RouteResult>(
    () => {
      if (
        !selectedHazard ||
        !selectedShelter
      ) {
        return {
          status: "NO_ROUTE",
          path: [],
          nodePath: [],
          distance: 0,
          blockedRoadsAvoided: 0,
        };
      }

      return calculateEvacuationRoute(
        selectedHazard,
        selectedShelter
      );
    },
    [
      selectedHazard,
      selectedShelter,
    ]
  );


  /* =======================================================
     VALIDATE SELECTED HAZARD / SHELTER
  ======================================================= */

  useEffect(() => {
    if (
      hazards.length > 0 &&
      !hazards.some(
        (item) =>
          item.id ===
          selectedHazard
      )
    ) {
      setSelectedHazard(
        hazards[0].id
      );
    }


    if (
      shelters.length > 0 &&
      !shelters.some(
        (item) =>
          item.id ===
          selectedShelter
      )
    ) {
      setSelectedShelter(
        shelters[0].id
      );
    }
  }, [
    hazards,
    shelters,
    selectedHazard,
    selectedShelter,
  ]);


  /* =======================================================
     LOADING SCREEN
  ======================================================= */

  if (loading) {
    return (
      <div className="emergency-map-loading">
        <div className="loading-card">

          <div className="loading-spinner" />

          <h3>
            Loading ResQMesh
          </h3>

          <p>
            Preparing emergency map...
          </p>

        </div>
      </div>
    );
  }


  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="emergency-map">

      {/* ===============================================
          STATUS BANNER
      =============================================== */}

      {(offlineMode ||
        apiError) && (
        <div
          className={
            offlineMode
              ? "map-status-banner offline"
              : "map-status-banner error"
          }
        >

          <span className="map-status-dot" />

          <span>
            {offlineMode
              ? "OFFLINE MODE · Saved emergency map active"
              : apiError}
          </span>

        </div>
      )}


      {/* ===============================================
          MAP SELECTOR
      =============================================== */}

      <MapSelector
        selectedMapId={
          selectedMapId
        }
        onMapChange={
          handleMapChange
        }
      />


      {/* ===============================================
          ACTIVE MAP INFORMATION
      =============================================== */}

      {selectedMap && (
        <div
          className="active-map-info"
        >

          <div>
            <span>
              CURRENT EMERGENCY MAP
            </span>

            <strong>
              {selectedMap.id}
              {" · "}
              {selectedMap.name}
            </strong>

            <small>
              {selectedMap.description}
            </small>
          </div>

          <div className="active-map-stats">

            <div>
              <strong>
                {locations.length}
              </strong>

              <span>
                LOCATIONS
              </span>
            </div>

            <div>
              <strong>
                {roadData.length}
              </strong>

              <span>
                ROADS
              </span>
            </div>

            <div>
              <strong>
                {zoneData.length}
              </strong>

              <span>
                ZONES
              </span>
            </div>

          </div>

        </div>
      )}


      {/* ===============================================
          ROUTE CONTROL
      =============================================== */}

      <div className="route-control-panel">

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            margin: "15px 0",
            flexWrap: "wrap",
          }}
        >

          <button
            type="button"
            onClick={() =>
              setShowQR(true)
            }
            style={{
              padding:
                "12px 24px",
              border: "none",
              borderRadius:
                "12px",
              background:
                "#536dfe",
              color: "white",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            📱 SHARE ROUTE
          </button>


          <button
            type="button"
            onClick={() =>
              setShowScanner(
                true
              )
            }
            style={{
              padding:
                "12px 24px",
              border: "none",
              borderRadius:
                "12px",
              background:
                "#eef2f7",
              color:
                "#26313d",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            📷 SCAN ROUTE
          </button>

        </div>


        <div className="route-control-heading">

          <div>

            <span className="route-control-eyebrow">
              RESQMESH
            </span>

            <h3>
              Evacuation Route
            </h3>

          </div>


          <div className="route-control-badge">
            OFFLINE READY
          </div>

        </div>


        <div className="route-select-grid">

          <div className="route-select-group">

            <label htmlFor="hazard-select">
              FROM HAZARD
            </label>

            <select
              id="hazard-select"
              value={
                selectedHazard
              }
              onChange={(event) =>
                setSelectedHazard(
                  event.target.value
                )
              }
            >

              {hazards.length >
              0 ? (
                hazards.map(
                  (hazard) => (
                    <option
                      key={
                        hazard.id
                      }
                      value={
                        hazard.id
                      }
                    >
                      {hazard.id}
                      {" · "}
                      {hazard.name}
                    </option>
                  )
                )
              ) : (
                <option value="">
                  No hazards
                </option>
              )}

            </select>

          </div>


          <div className="route-select-group">

            <label htmlFor="shelter-select">
              TO SHELTER
            </label>

            <select
              id="shelter-select"
              value={
                selectedShelter
              }
              onChange={(event) =>
                setSelectedShelter(
                  event.target.value
                )
              }
            >

              {shelters.length >
              0 ? (
                shelters.map(
                  (shelter) => (
                    <option
                      key={
                        shelter.id
                      }
                      value={
                        shelter.id
                      }
                    >
                      {shelter.id}
                      {" · "}
                      {shelter.name}
                    </option>
                  )
                )
              ) : (
                <option value="">
                  No shelters
                </option>
              )}

            </select>

          </div>

        </div>

      </div>


      {/* ===============================================
          MAP
      =============================================== */}

      <div className="map-container-wrapper">

        <MapContainer
          className="resqmesh-map"

          crs={CRS.Simple}

          center={
            DEFAULT_CENTER
          }

          zoom={
            DEFAULT_ZOOM
          }

          minZoom={-3}

          maxZoom={2}

          scrollWheelZoom

          zoomControl

          attributionControl={
            false
          }

          style={{
            width: "100%",
            height: "100%",
            minHeight:
              "600px",
          }}
        >

          <MapFit
            locations={
              locations
            }
            roads={
              roadData
            }
            zones={
              zoneData
            }
          />


          {/* =========================================
              RISK ZONES
          ========================================= */}

          {zoneData.map(
            (zone: Zone) => {

              const style =
                zoneColors[
                  zone.risk
                ];

              return (
                <Polygon
                  key={
                    zone.id
                  }

                  positions={
                    zone.points
                  }

                  pathOptions={{
                    color:
                      style.color,

                    fillColor:
                      style.fillColor,

                    fillOpacity:
                      0.12,

                    weight: 2,

                    dashArray:
                      "8 6",
                  }}
                >

                  <Tooltip>

                    <strong>
                      {zone.name}
                    </strong>

                    <br />

                    Risk:{" "}
                    {zone.risk.toUpperCase()}

                  </Tooltip>

                </Polygon>
              );
            }
          )}


          {/* =========================================
              ROADS
          ========================================= */}

          {roadData.map(
            (road: Road) => {

              let color =
                "#2db273";

              if (
                road.status ===
                "blocked"
              ) {
                color =
                  "#e45c63";
              }

              if (
                road.status ===
                "caution"
              ) {
                color =
                  "#e4a94f";
              }

              return (
                <Polyline
                  key={
                    road.id
                  }

                  positions={
                    road.points
                  }

                  pathOptions={{
                    color,

                    weight:
                      road.status ===
                      "blocked"
                        ? 7
                        : 5,

                    opacity:
                      0.82,

                    dashArray:
                      road.status ===
                      "blocked"
                        ? "10 8"
                        : undefined,
                  }}
                >

                  <Tooltip>

                    <strong>
                      {road.name}
                    </strong>

                    <br />

                    Status:{" "}
                    {road.status.toUpperCase()}

                  </Tooltip>

                </Polyline>
              );
            }
          )}


          {/* =========================================
              LOCATIONS
          ========================================= */}

          {locations.map(
            (
              location
            ) => (
              <MapMarker
                key={
                  location.id
                }
                location={
                  location
                }
              />
            )
          )}
          {/* =========================================
              CALCULATED EVACUATION ROUTE
          ========================================= */}

          {route.status === "SAFE" &&
            route.path.length > 0 && (
              <Polyline
                positions={
                  route.path
                }
                pathOptions={{
                  color:
                    "#536dfe",
                  weight: 8,
                  opacity: 0.9,
                }}
              >
                <Tooltip sticky>
                  <strong>
                    Recommended Evacuation Route
                  </strong>

                  <br />

                  Distance:{" "}
                  {route.distance} m
                </Tooltip>
              </Polyline>
            )}


          {/* =========================================
              RECEIVED ROUTE
          ========================================= */}

          {receivedRoute &&
            receivedRoute.path.length >
              0 && (
              <Polyline
                positions={
                  receivedRoute.path
                }
                pathOptions={{
                  color:
                    "#2db273",
                  weight: 10,
                  opacity: 0.95,
                  dashArray:
                    "14 8",
                }}
              >
                <Tooltip sticky>
                  <strong>
                    Received Evacuation Route
                  </strong>

                  <br />

                  {receivedRoute.hazardId}
                  {" → "}
                  {receivedRoute.shelterId}

                  <br />

                  Distance:{" "}
                  {
                    receivedRoute.distance
                  }{" "}
                  m
                </Tooltip>
              </Polyline>
            )}

        </MapContainer>

      </div>


      {/* ===============================================
          ROUTE STATUS
      =============================================== */}

      <div className="route-status-panel">

        <div
          className={
            route.status ===
            "SAFE"
              ? "route-status-card safe"
              : "route-status-card danger"
          }
        >

          <div className="route-status-icon">

            {route.status ===
            "SAFE"
              ? "✓"
              : "!"}

          </div>


          <div className="route-status-content">

            <span className="route-status-label">
              ROUTE STATUS
            </span>

            <strong>

              {route.status ===
              "SAFE"
                ? "SAFE EVACUATION ROUTE"
                : "NO SAFE ROUTE"}

            </strong>

            <p>

              {route.status ===
              "SAFE"
                ? `${selectedHazard} → ${selectedShelter}`
                : "All available paths are blocked."}

            </p>

          </div>

        </div>

      </div>


      {/* ===============================================
          ROUTE INFORMATION
      =============================================== */}

      {route.status ===
        "SAFE" &&
        route.path.length >
          0 && (
          <>

            <div className="route-info-card">

              <div className="route-info-item">

                <span>
                  DISTANCE
                </span>

                <strong>
                  {route.distance} m
                </strong>

              </div>


              <div className="route-info-divider" />


              <div className="route-info-item">

                <span>
                  BLOCKED ROADS
                </span>

                <strong>
                  {
                    route.blockedRoadsAvoided
                  }
                </strong>

              </div>


              <div className="route-info-divider" />


              <div className="route-info-item">

                <span>
                  PATH NODES
                </span>

                <strong>
                  {
                    route.path.length
                  }
                </strong>

              </div>


              <div className="route-info-divider" />


              <div className="route-info-item">

                <span>
                  MAP
                </span>

                <strong>
                  {selectedMapId}
                </strong>

              </div>

            </div>


            {/* =========================================
                SHARE / SCAN BUTTONS
            ========================================= */}

            <div
              style={{
                display:
                  "flex",

                justifyContent:
                  "center",

                gap: "14px",

                width:
                  "100%",

                margin:
                  "18px 0",

                padding:
                  "0 12px",

                boxSizing:
                  "border-box",

                flexWrap:
                  "wrap",
              }}
            >

              <button
                type="button"
                onClick={() =>
                  setShowQR(
                    true
                  )
                }
                style={{
                  border:
                    "none",

                  borderRadius:
                    "14px",

                  padding:
                    "14px 28px",

                  background:
                    "#536dfe",

                  color:
                    "#fff",

                  fontSize:
                    "13px",

                  fontWeight:
                    800,

                  cursor:
                    "pointer",

                  minWidth:
                    "170px",
                }}
              >
                SHARE ROUTE
              </button>


              <button
                type="button"
                onClick={() =>
                  setShowScanner(
                    true
                  )
                }
                style={{
                  border:
                    "none",

                  borderRadius:
                    "14px",

                  padding:
                    "14px 28px",

                  background:
                    "#eef2f7",

                  color:
                    "#26313d",

                  fontSize:
                    "13px",

                  fontWeight:
                    800,

                  cursor:
                    "pointer",

                  minWidth:
                    "170px",
                }}
              >
                SCAN ROUTE
              </button>

            </div>

          </>
        )}


      {/* ===============================================
          RECEIVED ROUTE CARD
      =============================================== */}

      {receivedRoute && (
        <div
          style={{
            width:
              "100%",

            display:
              "flex",

            justifyContent:
              "center",

            padding:
              "0 12px 18px",

            boxSizing:
              "border-box",
          }}
        >

          <div
            style={{
              width:
                "100%",

              maxWidth:
                "760px",

              padding:
                "14px 18px",

              borderRadius:
                "14px",

              background:
                "#eef2f7",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              gap:
                "12px",

              boxSizing:
                "border-box",
            }}
          >

            <div>

              <strong>
                Route Received
              </strong>

              <div
                style={{
                  fontSize:
                    "11px",

                  marginTop:
                    "4px",

                  color:
                    "#718096",
                }}
              >

                {receivedRoute.hazardId}

                {" → "}

                {receivedRoute.shelterId}

                {" · "}

                {
                  receivedRoute.distance
                }{" "}
                m

              </div>

            </div>


            <button
              type="button"
              onClick={async () => {

                setReceivedRoute(
                  null
                );

                try {
                  await clearReceivedRoute();

                } catch (error) {

                  console.error(
                    "Clear route failed:",
                    error
                  );

                }

              }}
              style={{
                border:
                  "none",

                borderRadius:
                  "10px",

                padding:
                  "8px 12px",

                cursor:
                  "pointer",

                fontWeight:
                  700,
              }}
            >
              CLEAR
            </button>

          </div>

        </div>
      )}


      {/* ===============================================
          QR SHARE PANEL
      =============================================== */}

      {showQR && (
        <RouteSharePanel
          hazardId={
            selectedHazard
          }

          shelterId={
            selectedShelter
          }

          route={
            route
          }

          onClose={() =>
            setShowQR(false)
          }
        />
      )}


      {/* ===============================================
          QR SCANNER PANEL
      =============================================== */}

      {showScanner && (
        <RouteScannerPanel

          onRouteReceived={
            async (
              receivedRouteData
            ) => {

              setReceivedRoute(
                receivedRouteData
              );

              setShowScanner(
                false
              );

              try {

                await saveReceivedRoute(
                  receivedRouteData
                );

                console.log(
                  "[ResQMesh Offline] Received route saved."
                );

              } catch (error) {

                console.error(
                  "Route save failed:",
                  error
                );

              }

            }
          }

          onClose={() =>
            setShowScanner(false)
          }

        />
      )}

    </div>
  );
}