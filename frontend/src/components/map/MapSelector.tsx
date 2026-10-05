import { RESQMESH_MAPS } from "../../data/mapRegistry";

interface MapSelectorProps {
  selectedMapId: string;
  onMapChange: (mapId: string) => void;
}

export default function MapSelector({
  selectedMapId,
  onMapChange,
}: MapSelectorProps) {
  return (
    <div className="resq-map-selector">

      <div className="resq-map-selector-info">
        <span>ACTIVE MAP</span>
        <strong>Select Emergency Zone</strong>
      </div>

      <select
        value={selectedMapId}
        onChange={(event) =>
          onMapChange(event.target.value)
        }
        className="resq-map-selector-select"
        aria-label="Select emergency map"
      >
        {RESQMESH_MAPS.map((map) => (
          <option
            key={map.id}
            value={map.id}
          >
            {map.id} · {map.name}
          </option>
        ))}
      </select>

    </div>
  );
}