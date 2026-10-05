import {
  useEffect,
  useState,
} from "react";

import CitizenRouteMap from "./CitizenRouteMap";

import {
  decodeRouteShareUrl,
} from "../../services/routeShare";

import type {
  SharedRoutePayload,
} from "../../services/routeShare";

export default function CitizenRoute() {
  const [
    route,
    setRoute,
  ] =
    useState<SharedRoutePayload | null>(
      null
    );

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    try {
      const hash =
        window.location.hash;

      console.log(
        "[ResQMesh Citizen] Hash:",
        hash
      );

      const queryStart =
        hash.indexOf("?");

      if (queryStart === -1) {
        throw new Error(
          "No route data found."
        );
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

      console.log(
        "[ResQMesh Citizen] Route data found:",
        Boolean(encoded)
      );

      if (!encoded) {
        throw new Error(
          "No evacuation route found."
        );
      }

      const decoded =
        decodeRouteShareUrl(
          encoded
        );

      console.log(
        "[ResQMesh Citizen] Route decoded:",
        decoded
      );

      setRoute(decoded);

    } catch (err) {
      console.error(
        "Citizen route error:",
        err
      );

      setError(
        "This evacuation route is invalid or corrupted."
      );
    }
  }, []);

  if (error) {
    return (
      <div className="citizen-error-page">
        <div className="citizen-error-card">

          <div className="citizen-error-icon">
            !
          </div>

          <h2>
            Route Unavailable
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() => {
              window.location.href =
                "/";
            }}
          >
            Return to ResQMesh
          </button>

        </div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="citizen-loading">
        Loading evacuation route...
      </div>
    );
  }

  return (
    <CitizenRouteMap
      route={route}
    />
  );
}