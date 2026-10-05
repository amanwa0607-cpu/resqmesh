import QRCode from "qrcode";

export interface SharedRoutePayload {
  version: 2;
  app: "RESQMESH";
  hazardId: string;
  shelterId: string;
  distance: number;
  blockedRoadsAvoided: number;
  path: [number, number][];
}

/* =========================================
   BASE64 URL ENCODING
========================================= */

function encodeBase64Url(
  value: string
): string {
  const bytes =
    new TextEncoder().encode(value);

  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeBase64Url(
  value: string
): string {
  const base64 =
    value
      .replace(/-/g, "+")
      .replace(/_/g, "/");

  const padded =
    base64 +
    "=".repeat(
      (4 - (base64.length % 4)) % 4
    );

  const binary = atob(padded);

  const bytes =
    Uint8Array.from(
      binary,
      (char) =>
        char.charCodeAt(0)
    );

  return new TextDecoder().decode(bytes);
}

/* =========================================
   COMPACT PATH ENCODING
========================================= */

function encodePath(
  path: [number, number][]
): string {
  if (path.length === 0) {
    return "";
  }

  let previousLat =
    path[0][0];

  let previousLng =
    path[0][1];

  const encoded = [
    `${previousLat},${previousLng}`,
  ];

  for (
    let index = 1;
    index < path.length;
    index++
  ) {
    const [lat, lng] =
      path[index];

    const deltaLat =
      lat - previousLat;

    const deltaLng =
      lng - previousLng;

    encoded.push(
      `${deltaLat},${deltaLng}`
    );

    previousLat = lat;
    previousLng = lng;
  }

  return encoded.join(";");
}

function decodePath(
  encodedPath: string
): [number, number][] {
  if (!encodedPath) {
    return [];
  }

  const chunks =
    encodedPath.split(";");

  const first =
    chunks[0]
      .split(",")
      .map(Number);

  if (
    first.length !== 2 ||
    first.some(
      (value) =>
        !Number.isFinite(value)
    )
  ) {
    throw new Error(
      "Invalid route coordinates."
    );
  }

  let currentLat =
    first[0];

  let currentLng =
    first[1];

  const path:
    [number, number][] = [
    [currentLat, currentLng],
  ];

  for (
    let index = 1;
    index < chunks.length;
    index++
  ) {
    const delta =
      chunks[index]
        .split(",")
        .map(Number);

    if (
      delta.length !== 2 ||
      delta.some(
        (value) =>
          !Number.isFinite(value)
      )
    ) {
      throw new Error(
        "Invalid route delta."
      );
    }

    currentLat +=
      delta[0];

    currentLng +=
      delta[1];

    path.push([
      currentLat,
      currentLng,
    ]);
  }

  return path;
}

/* =========================================
   CREATE RM2 PAYLOAD
========================================= */

export function createRoutePayload(
  hazardId: string,
  shelterId: string,
  distance: number,
  blockedRoadsAvoided: number,
  path: [number, number][]
): string {
  if (
    !hazardId ||
    !shelterId
  ) {
    throw new Error(
      "Hazard and shelter are required."
    );
  }

  if (
    !Number.isFinite(distance)
  ) {
    throw new Error(
      "Invalid route distance."
    );
  }

  if (
    !Number.isFinite(
      blockedRoadsAvoided
    )
  ) {
    throw new Error(
      "Invalid blocked road count."
    );
  }

  if (
    !path ||
    path.length === 0
  ) {
    throw new Error(
      "Route path is empty."
    );
  }

  const encodedPath =
    encodePath(path);

  return [
    "RM2",
    hazardId,
    shelterId,
    Math.round(distance),
    Math.round(
      blockedRoadsAvoided
    ),
    encodedPath,
  ].join("|");
}

/* =========================================
   DECODE RM2 PAYLOAD
========================================= */

export function decodeRoutePayload(
  rawPayload: string
): SharedRoutePayload {
  const value =
    rawPayload.trim();

  if (
    !value.startsWith("RM2|")
  ) {
    throw new Error(
      "Invalid or unsupported ResQMesh route."
    );
  }

  const parts =
    value.split("|");

  if (
    parts.length !== 6
  ) {
    throw new Error(
      "Corrupted ResQMesh route."
    );
  }

  const [
    version,
    hazardId,
    shelterId,
    distanceText,
    blockedText,
    encodedPath,
  ] = parts;

  if (
    version !== "RM2"
  ) {
    throw new Error(
      "Unsupported route version."
    );
  }

  if (
    !hazardId ||
    !shelterId
  ) {
    throw new Error(
      "Invalid route endpoints."
    );
  }

  const distance =
    Number(distanceText);

  const blockedRoadsAvoided =
    Number(blockedText);

  if (
    !Number.isFinite(
      distance
    ) ||
    !Number.isFinite(
      blockedRoadsAvoided
    )
  ) {
    throw new Error(
      "Invalid route metadata."
    );
  }

  const path =
    decodePath(encodedPath);

  if (
    path.length === 0
  ) {
    throw new Error(
      "Route contains no path."
    );
  }

  return {
    version: 2,
    app: "RESQMESH",
    hazardId,
    shelterId,
    distance,
    blockedRoadsAvoided,
    path,
  };
}

/* =========================================
   CREATE SHARE URL
========================================= */

export function createRouteShareUrl(
  payload: string
): string {
  if (
    !payload.startsWith("RM2|")
  ) {
    throw new Error(
      "Invalid RM2 payload."
    );
  }

  const encoded =
    encodeBase64Url(payload);

  /*
   * IMPORTANT
   *
   * Keep this URL format.
   * Phone camera → CitizenRoute
   * already works with this.
   */

  const host =
    window.location.hostname ===
      "localhost" ||
    window.location.hostname ===
      "127.0.0.1"
      ? "10.107.13.107:5175"
      : window.location.host;

  return (
    `http://${host}` +
    `${window.location.pathname}` +
    `#/route?d=${encoded}`
  );
}

/* =========================================
   DECODE SHARE URL
========================================= */

export function decodeRouteShareUrl(
  encoded: string
): SharedRoutePayload {
  if (!encoded) {
    throw new Error(
      "Missing route data."
    );
  }

  const payload =
    decodeBase64Url(encoded);

  return decodeRoutePayload(
    payload
  );
}

/* =========================================
   GENERATE QR CODE
========================================= */

export async function generateRouteQRCode(
  payload: string
): Promise<string> {
  if (
    !payload.startsWith("RM2|")
  ) {
    throw new Error(
      "Invalid RM2 payload."
    );
  }

  const shareUrl =
    createRouteShareUrl(
      payload
    );

  console.log(
    "[ResQMesh QR] Share URL:",
    shareUrl
  );

  return QRCode.toDataURL(
    shareUrl,
    {
      width: 300,
      margin: 2,
      errorCorrectionLevel: "M",
    }
  );
}