import {
  useEffect,
  useState,
} from "react";

import {
  createRoutePayload,
  createRouteShareUrl,
  generateRouteQRCode,
} from "../../services/routeShare";

import type {
  RouteResult,
} from "../../services/routeEngine";


interface RouteSharePanelProps {
  hazardId: string;

  shelterId: string;

  route: RouteResult;

  onClose: () => void;
}


export default function RouteSharePanel({
  hazardId,
  shelterId,
  route,
  onClose,
}: RouteSharePanelProps) {

  const [
    qrCode,
    setQrCode,
  ] = useState("");

  const [
    copied,
    setCopied,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);


  useEffect(() => {

    async function generateQR() {

      if (
        route.status !== "SAFE" ||
        route.path.length === 0
      ) {
        setLoading(false);
        return;
      }


      try {

        const payload =
          createRoutePayload(
            hazardId,
            shelterId,
            route.distance,
            route.blockedRoadsAvoided,
            route.path
          );


        const qr =
          await generateRouteQRCode(
            payload
          );


        setQrCode(qr);

      } catch (error) {

        console.error(
          "QR generation failed:",
          error
        );

      } finally {

        setLoading(false);

      }

    }


    generateQR();

  }, [
    hazardId,
    shelterId,
    route,
  ]);


  async function handleCopy() {

    if (
      route.status !== "SAFE" ||
      route.path.length === 0
    ) {
      return;
    }


    const payload =
      createRoutePayload(
        hazardId,
        shelterId,
        route.distance,
        route.blockedRoadsAvoided,
        route.path
      );


    try {

      await navigator.clipboard.writeText(
        payload
      );


      setCopied(true);


      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {

      console.error(
        "Copy failed:",
        error
      );

    }

  }


  async function handleShareLink() {

    if (
      route.status !== "SAFE" ||
      route.path.length === 0
    ) {
      return;
    }


    const payload =
      createRoutePayload(
        hazardId,
        shelterId,
        route.distance,
        route.blockedRoadsAvoided,
        route.path
      );


    const url =
      createRouteShareUrl(
        payload
      );


    try {

      await navigator.clipboard.writeText(
        url
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {

      console.error(
        "Share link copy failed:",
        error
      );

    }

  }


  return (
    <div className="qr-overlay">

      <div className="qr-panel">

        <div className="qr-header">

          <div>

            <span>
              RESQMESH
            </span>

            <h3>
              Share Evacuation Route
            </h3>

          </div>


          <button
            className="qr-close-button"
            onClick={onClose}
            type="button"
          >
            ×
          </button>

        </div>


        <div className="qr-route-summary">

          <div>

            <span>
              FROM
            </span>

            <strong>
              {hazardId}
            </strong>

          </div>


          <div className="qr-route-arrow">
            →
          </div>


          <div>

            <span>
              TO
            </span>

            <strong>
              {shelterId}
            </strong>

          </div>

        </div>


        <div className="qr-code-container">

          {loading ? (

            <div className="qr-loading">
              Generating QR...
            </div>

          ) : qrCode ? (

            <img
              src={qrCode}
              alt="ResQMesh evacuation route QR code"
              className="qr-code-image"
            />

          ) : (

            <div className="qr-loading">
              Route unavailable
            </div>

          )}

        </div>


        <div className="qr-details">

          <div>

            <span>
              Distance
            </span>

            <strong>
              {route.distance} m
            </strong>

          </div>


          <div>

            <span>
              Blocked Roads
            </span>

            <strong>
              {route.blockedRoadsAvoided}
            </strong>

          </div>


          <div>

            <span>
              Protocol
            </span>

            <strong>
              RM2
            </strong>

          </div>

        </div>


        <div className="qr-info">

          <span className="qr-info-icon">
            ✓
          </span>

          <p>
            Scan with the phone camera.
            ResQMesh will open and load
            this route automatically.
          </p>

        </div>


        <div className="qr-actions">

          <button
            className="qr-copy-button"
            onClick={handleCopy}
            type="button"
          >
            {copied
              ? "Copied ✓"
              : "Copy RM2 Data"}
          </button>


          <button
            className="qr-done-button"
            onClick={handleShareLink}
            type="button"
          >
            Copy Link
          </button>

        </div>


        <div
          style={{
            marginTop: "10px",
            textAlign: "center",
            fontSize: "8px",
            color: "#8993a1",
          }}
        >
          Compact offline payload ·
          QR + Bluetooth compatible
        </div>

      </div>

    </div>
  );
}