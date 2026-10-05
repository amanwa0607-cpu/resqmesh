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
} from "react-leaflet";

import { CRS } from "leaflet";

import {
  zones,
  type MapLocation,
  type Road,
} from "../../data/mapData";

import { getMapData } from "../../services/api";

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

import RouteSharePanel from "./RouteSharePanel";
import RouteScannerPanel from "./RouteScannerPanel";
import MapMarker from "./MapMarker";

const MAP_CENTER: [number, number] = [650, 750];

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

export default function EmergencyMap() {
  const [locations, setLocations] =
    useState<MapLocation[]>([]);

  const [roadData, setRoadData] =
    useState<Road[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [offlineMode, setOfflineMode] =
    useState(false);

  const [apiError, setApiError] =
    useState("");

  const [selectedHazard, setSelectedHazard] =
    useState("HZ-01");

  const [selectedShelter, setSelectedShelter] =
    useState("S-01");

  const [showQR, setShowQR] =
    useState(false);

  const [showScanner, setShowScanner] =
    useState(false);

  const [receivedRoute, setReceivedRoute] =
    useState<SharedRoutePayload | null>(null);

  /* LOAD MAP */

  useEffect(() => {
    let mounted = true;

    async function loadMap() {
      try {
        setLoading(true);
        setApiError("");

        const data = await getMapData();

        if (!mounted) return;

        const normalizedLocations =
          data.locations.map((item) => ({
            ...item,
            type:
              item.type === "shelter"
                ? "shelter"
                : "hazard",
          })) as MapLocation[];

        setLocations(normalizedLocations);
        setRoadData(data.roads);
        setOfflineMode(false);

        try {
          await saveMapSnapshot(
            normalizedLocations,
            data.roads
          );
        } catch (error) {
          console.warn(
            "Snapshot save failed:",
            error
          );
        }
      } catch (error) {
        console.error(
          "Map API unavailable:",
          error
        );

        try {
          const snapshot =
            await getMapSnapshot();

          if (
            snapshot &&
            snapshot.locations.length
          ) {
            setLocations(
              snapshot.locations
            );

            setRoadData(
              snapshot.roads
            );

            setOfflineMode(true);
            setApiError(
              "Live server unavailable. Using saved offline map."
            );
          } else {
            setApiError(
              "Unable to load emergency map."
            );
          }
        } catch {
          setApiError(
            "Unable to load emergency map."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadMap();

    return () => {
      mounted = false;
    };
  }, []);

  /* LOAD SAVED ROUTE */

  useEffect(() => {
    getReceivedRoute()
      .then((route) => {
        if (route) {
          setReceivedRoute(route);
        }
      })
      .catch(console.error);
  }, []);

  /* QR DEEP LINK */

  useEffect(() => {
    async function readSharedRoute() {
      try {
        const hash =
          window.location.hash;

        if (!hash.startsWith("#/route")) {
          return;
        }

        const query =
          hash.split("?")[1];

        if (!query) return;

        const params =
          new URLSearchParams(query);

        const encoded =
          params.get("d");

        if (!encoded) return;

        const route =
          decodeRouteShareUrl(encoded);

        setReceivedRoute(route);

        await saveReceivedRoute(route);

        window.history.replaceState(
          null,
          "",
          window.location.pathname
        );
      } catch (error) {
        console.error(
          "Route decode failed:",
          error
        );
      }
    }

    readSharedRoute();
  }, []);

  const hazards = useMemo(
    () =>
      locations.filter(
        (item) =>
          item.type === "hazard"
      ),
    [locations]
  );

  const shelters = useMemo(
    () =>
      locations.filter(
        (item) =>
          item.type === "shelter"
      ),
    [locations]
  );

  const route = useMemo<RouteResult>(
    () =>
      calculateEvacuationRoute(
        selectedHazard,
        selectedShelter
      ),
    [
      selectedHazard,
      selectedShelter,
    ]
  );

  useEffect(() => {
    if (
      hazards.length &&
      !hazards.some(
        (x) =>
          x.id === selectedHazard
      )
    ) {
      setSelectedHazard(
        hazards[0].id
      );
    }

    if (
      shelters.length &&
      !shelters.some(
        (x) =>
          x.id === selectedShelter
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

  if (loading) {
    return (
      <div className="emergency-map-loading">
        <div className="loading-card">
          <div className="loading-spinner" />
          <h3>Loading ResQMesh</h3>
          <p>
            Preparing emergency map...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="emergency-map">

      {(offlineMode || apiError) && (
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

      <div className="route-control-panel">
        <div
  style={{
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    margin: "15px 0",
  }}
>
  <button
    type="button"
    onClick={() => setShowQR(true)}
    style={{
      padding: "12px 24px",
      border: "none",
      borderRadius: "12px",
      background: "#536dfe",
      color: "white",
      fontWeight: 800,
      cursor: "pointer",
    }}
  >
    📱 SHARE ROUTE
  </button>

  <button
    type="button"
    onClick={() => setShowScanner(true)}
    style={{
      padding: "12px 24px",
      border: "none",
      borderRadius: "12px",
      background: "#eef2f7",
      color: "#26313d",
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

            <h3>Evacuation Route</h3>
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
              value={selectedHazard}
              onChange={(e) =>
                setSelectedHazard(
                  e.target.value
                )
              }
            >
              {hazards.length ? (
                hazards.map((hazard) => (
                  <option
                    key={hazard.id}
                    value={hazard.id}
                  >
                    {hazard.id} · {hazard.name}
                  </option>
                ))
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
              value={selectedShelter}
              onChange={(e) =>
                setSelectedShelter(
                  e.target.value
                )
              }
            >
              {shelters.length ? (
                shelters.map((shelter) => (
                  <option
                    key={shelter.id}
                    value={shelter.id}
                  >
                    {shelter.id} · {shelter.name}
                  </option>
                ))
              ) : (
                <option value="">
                  No shelters
                </option>
              )}
            </select>
          </div>

        </div>
      </div>

      <div className="map-container-wrapper">

        <MapContainer
          className="resqmesh-map"
          crs={CRS.Simple}
          center={MAP_CENTER}
          zoom={-1}
          minZoom={-2}
          maxZoom={2}
          scrollWheelZoom
          zoomControl
          attributionControl={false}
          style={{
            width: "100%",
            height: "100%",
            minHeight: "600px",
          }}
        >

          {zones.map((zone) => {
            const style =
              zoneColors[zone.risk];

            return (
              <Polygon
                key={zone.id}
                positions={zone.points}
                pathOptions={{
                  color: style.color,
                  fillColor:
                    style.fillColor,
                  fillOpacity: 0.12,
                  weight: 2,
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
          })}

          {roadData.map((road) => {
            const color =
              road.status === "blocked"
                ? "#e45c63"
                : road.status === "caution"
                ? "#e4a94f"
                : "#2db273";

            return (
              <Polyline
                key={road.id}
                positions={road.points}
                pathOptions={{
                  color,
                  weight:
                    road.status === "blocked"
                      ? 7
                      : 5,
                  opacity: 0.82,
                  dashArray:
                    road.status === "blocked"
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
          })}

          {locations.map((location) => (
            <MapMarker
              key={location.id}
              location={location}
            />
          ))}

          {route.status === "SAFE" &&
            route.path.length > 0 && (
              <Polyline
                positions={route.path}
                pathOptions={{
                  color: "#536dfe",
                  weight: 8,
                  opacity: 0.9,
                }}
              >
                <Tooltip sticky>
                  <strong>
                    Recommended Evacuation Route
                  </strong>
                  <br />
                  Distance: {route.distance} m
                </Tooltip>
              </Polyline>
            )}

          {receivedRoute &&
            receivedRoute.path.length > 0 && (
              <Polyline
                positions={receivedRoute.path}
                pathOptions={{
                  color: "#2db273",
                  weight: 10,
                  opacity: 0.95,
                  dashArray: "14 8",
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
                  {receivedRoute.distance} m
                </Tooltip>
              </Polyline>
            )}

        </MapContainer>
      </div>
      <div className="route-status-panel">
        <div
          className={
            route.status === "SAFE"
              ? "route-status-card safe"
              : "route-status-card danger"
          }
        >
          <div className="route-status-icon">
            {route.status === "SAFE" ? "✓" : "!"}
          </div>

          <div className="route-status-content">
            <span className="route-status-label">
              ROUTE STATUS
            </span>

            <strong>
              {route.status === "SAFE"
                ? "SAFE EVACUATION ROUTE"
                : "NO SAFE ROUTE"}
            </strong>

            <p>
              {route.status === "SAFE"
                ? `${selectedHazard} → ${selectedShelter}`
                : "All available paths are blocked."}
            </p>
          </div>
        </div>
      </div>

      {route.status === "SAFE" &&
        route.path.length > 0 && (
          <>
            <div className="route-info-card">

              <div className="route-info-item">
                <span>DISTANCE</span>
                <strong>
                  {route.distance} m
                </strong>
              </div>

              <div className="route-info-divider" />

              <div className="route-info-item">
                <span>BLOCKED ROADS</span>
                <strong>
                  {route.blockedRoadsAvoided}
                </strong>
              </div>

              <div className="route-info-divider" />

              <div className="route-info-item">
                <span>PATH NODES</span>
                <strong>
                  {route.path.length}
                </strong>
              </div>

              <div className="route-info-divider" />

              <div className="route-info-item">
                <span>PROTOCOL</span>
                <strong>RM2</strong>
              </div>

            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "14px",
                width: "100%",
                margin: "18px 0",
                padding: "0 12px",
                boxSizing: "border-box",
                flexWrap: "wrap",
              }}
            >

              <button
                type="button"
                onClick={() => setShowQR(true)}
                style={{
                  border: "none",
                  borderRadius: "14px",
                  padding: "14px 28px",
                  background: "#536dfe",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 800,
                  cursor: "pointer",
                  minWidth: "170px",
                }}
              >
                SHARE ROUTE
              </button>

              <button
                type="button"
                onClick={() => setShowScanner(true)}
                style={{
                  border: "none",
                  borderRadius: "14px",
                  padding: "14px 28px",
                  background: "#eef2f7",
                  color: "#26313d",
                  fontSize: "13px",
                  fontWeight: 800,
                  cursor: "pointer",
                  minWidth: "170px",
                }}
              >
                SCAN ROUTE
              </button>

            </div>
          </>
        )}

      {receivedRoute && (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: "0 12px 18px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "760px",
              padding: "14px 18px",
              borderRadius: "14px",
              background: "#eef2f7",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              boxSizing: "border-box",
            }}
          >
            <div>
              <strong>
                Route Received
              </strong>

              <div
                style={{
                  fontSize: "11px",
                  marginTop: "4px",
                  color: "#718096",
                }}
              >
                {receivedRoute.hazardId}
                {" → "}
                {receivedRoute.shelterId}
                {" · "}
                {receivedRoute.distance} m
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                setReceivedRoute(null);

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
                border: "none",
                borderRadius: "10px",
                padding: "8px 12px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              CLEAR
            </button>
          </div>
        </div>
      )}

      {showQR && (
        <RouteSharePanel
          hazardId={selectedHazard}
          shelterId={selectedShelter}
          route={route}
          onClose={() => setShowQR(false)}
        />
      )}

      {showScanner && (
        <RouteScannerPanel
          onRouteReceived={async (route) => {
            setReceivedRoute(route);
            setShowScanner(false);

            try {
              await saveReceivedRoute(route);
            } catch (error) {
              console.error(
                "Route save failed:",
                error
              );
            }
          }}
          onClose={() => setShowScanner(false)}
        />
      )}

    </div>
  );
}