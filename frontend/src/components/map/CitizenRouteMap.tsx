import {
  useMemo,
} from "react";

import {
  MapContainer,
  Polygon,
  Polyline,
  Tooltip,
} from "react-leaflet";

import { CRS } from "leaflet";

import {
  mapLocations,
  roads,
  zones,
} from "../../data/mapData";

import type {
  SharedRoutePayload,
} from "../../services/routeShare";


interface CitizenRouteMapProps {
  route: SharedRoutePayload;
}


const MAP_CENTER: [number, number] = [
  650,
  750,
];


const zoneColors = {
  high: "#e45c63",
  medium: "#f0a64a",
  safe: "#2db273",
};


export default function CitizenRouteMap({
  route,
}: CitizenRouteMapProps) {

  const hazard =
    useMemo(
      () =>
        mapLocations.find(
          (location) =>
            location.id ===
            route.hazardId
        ),
      [route.hazardId]
    );


  const shelter =
    useMemo(
      () =>
        mapLocations.find(
          (location) =>
            location.id ===
            route.shelterId
        ),
      [route.shelterId]
    );


  return (
    <div className="citizen-route-page">

      {/* =================================
          HEADER
      ================================= */}

      <div className="citizen-header">

        <div>

          <span className="citizen-brand">
            RESQMESH
          </span>

          <h1>
            Emergency Evacuation Route
          </h1>

          <p>
            Route received from operator
          </p>

        </div>


        <div className="offline-badge">

          <span />

          OFFLINE READY

        </div>

      </div>


      {/* =================================
          ROUTE SUMMARY
      ================================= */}

      <div className="citizen-route-card">

        <div className="citizen-point">

          <span>
            EMERGENCY
          </span>

          <strong>
            {route.hazardId}
          </strong>

          <small>
            {hazard?.name ??
              "Emergency Zone"}
          </small>

        </div>


        <div className="citizen-arrow">
          →
        </div>


        <div className="citizen-point">

          <span>
            SAFE SHELTER
          </span>

          <strong>
            {route.shelterId}
          </strong>

          <small>
            {shelter?.name ??
              "Evacuation Shelter"}
          </small>

        </div>

      </div>


      {/* =================================
          MAP
      ================================= */}

      <div className="citizen-map-wrapper">

        <MapContainer
          crs={CRS.Simple}
          center={MAP_CENTER}
          zoom={-1}
          minZoom={-2}
          maxZoom={2}
          maxBounds={[
            [0, 0],
            [1250, 1500],
          ]}
          maxBoundsViscosity={1}
          zoomControl={true}
          attributionControl={false}
          style={{
            width: "100%",
            height: "100%",
            background:
              "#eef2f7",
          }}
        >

          {/* ZONES */}

          {zones.map(
            (zone) => (

              <Polygon
                key={zone.id}
                positions={
                  zone.points
                }
                pathOptions={{
                  color:
                    zoneColors[
                      zone.risk
                    ],

                  fillColor:
                    zoneColors[
                      zone.risk
                    ],

                  fillOpacity:
                    zone.risk === "safe"
                      ? 0.10
                      : 0.14,

                  weight: 2,

                  dashArray:
                    "8 6",
                }}
              >

                <Tooltip>

                  {zone.name}
                  {" · "}
                  {zone.risk.toUpperCase()}
                  {" RISK"}

                </Tooltip>

              </Polygon>

            )
          )}


          {/* ROADS */}

          {roads.map(
            (road) => {

              let color =
                "#aab3c2";

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
                  "#f0a64a";
              }


              return (

                <Polyline
                  key={road.id}
                  positions={
                    road.points
                  }
                  pathOptions={{
                    color,
                    weight:
                      road.status ===
                      "blocked"
                        ? 6
                        : 4,

                    opacity: 0.75,

                    dashArray:
                      road.status ===
                      "blocked"
                        ? "10 7"
                        : undefined,
                  }}
                >

                  <Tooltip>

                    {road.name}
                    {" · "}
                    {road.status.toUpperCase()}

                  </Tooltip>

                </Polyline>

              );
            }
          )}


          {/* ROUTE */}

          {route.path.length > 1 && (

            <Polyline
              positions={
                route.path
              }
              pathOptions={{
                color: "#536dfe",
                weight: 10,
                opacity: 1,
                lineCap: "round",
                lineJoin: "round",
              }}
            >

              <Tooltip sticky>

                YOUR EVACUATION ROUTE

              </Tooltip>

            </Polyline>

          )}


          {/* HAZARD */}

          {hazard && (

            <Polygon
              positions={[
                [
                  hazard.position[0] - 22,
                  hazard.position[1] - 22,
                ],
                [
                  hazard.position[0] - 22,
                  hazard.position[1] + 22,
                ],
                [
                  hazard.position[0] + 22,
                  hazard.position[1] + 22,
                ],
                [
                  hazard.position[0] + 22,
                  hazard.position[1] - 22,
                ],
              ]}
              pathOptions={{
                color: "#e45c63",
                fillColor: "#e45c63",
                fillOpacity: 0.18,
                weight: 2,
              }}
            />

          )}

        </MapContainer>


        {/* MAP MESSAGE */}

        <div className="citizen-map-message">

          <span>
            ✓
          </span>

          <div>

            <strong>
              Follow the highlighted route
            </strong>

            <small>
              Avoid blocked roads and
              hazardous zones.
            </small>

          </div>

        </div>

      </div>


      {/* =================================
          INFORMATION
      ================================= */}

      <div className="citizen-info-grid">

        <div className="citizen-info-card">

          <span>
            DISTANCE
          </span>

          <strong>
            {route.distance} m
          </strong>

        </div>


        <div className="citizen-info-card">

          <span>
            BLOCKED ROADS
          </span>

          <strong>
            {route.blockedRoadsAvoided}
          </strong>

        </div>


        <div className="citizen-info-card">

          <span>
            ROUTE STATUS
          </span>

          <strong className="citizen-safe">
            SAFE
          </strong>

        </div>

      </div>


      {/* =================================
          OFFLINE MESSAGE
      ================================= */}

      <div className="citizen-offline-info">

        <span>
          ✓
        </span>

        <div>

          <strong>
            Route stored locally
          </strong>

          <p>
            This evacuation route can be
            viewed even when the network
            is unavailable.
          </p>

        </div>

      </div>

    </div>
  );
}