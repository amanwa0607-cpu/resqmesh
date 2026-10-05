import {
  CircleMarker,
  Tooltip,
} from "react-leaflet";

import type {
  MapLocation,
} from "../../data/mapData";

interface MapMarkerProps {
  location: MapLocation;
}

const markerColors: Record<
  MapLocation["type"],
  string
> = {
  hazard: "#e45c63",
  shelter: "#2db273",
  node: "#536dfe",
  hospital: "#8b63d9",
};

const markerLabels: Record<
  MapLocation["type"],
  string
> = {
  hazard: "HAZARD",
  shelter: "SHELTER",
  node: "NETWORK",
  hospital: "HOSPITAL",
};

export default function MapMarker({
  location,
}: MapMarkerProps) {
  const color =
    markerColors[location.type];

  return (
    <CircleMarker
      center={location.position}
      radius={9}
      pathOptions={{
        color,
        fillColor: color,
        fillOpacity: 0.92,
        weight: 3,
      }}
    >
      <Tooltip direction="top">
        <div
          style={{
            minWidth: "150px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <strong>
            {location.name}
          </strong>

          <br />

          <span>
            Type:{" "}
            {markerLabels[location.type]}
          </span>

          <br />

          <span>
            ID: {location.id}
          </span>

          <br />

          <span>
            Status: {location.status}
          </span>

          <br />

          <small>
            {location.description}
          </small>
        </div>
      </Tooltip>
    </CircleMarker>
  );
}