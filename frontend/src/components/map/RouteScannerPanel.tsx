import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Html5Qrcode,
  Html5QrcodeScannerState,
} from "html5-qrcode";

import {
  decodeRoutePayload,
} from "../../services/routeShare";

import type {
  SharedRoutePayload,
} from "../../services/routeShare";

interface RouteScannerPanelProps {
  onRouteReceived: (
    route: SharedRoutePayload
  ) => void;

  onClose: () => void;
}

export default function RouteScannerPanel({
  onRouteReceived,
  onClose,
}: RouteScannerPanelProps) {
  const scannerRef =
    useRef<Html5Qrcode | null>(null);

  const [error, setError] =
    useState("");

  const [scanning, setScanning] =
    useState(true);

  async function stopScanner() {
    const scanner =
      scannerRef.current;

    if (!scanner) {
      return;
    }

    try {
      const state =
        scanner.getState();

      if (
        state ===
        Html5QrcodeScannerState.SCANNING
      ) {
        await scanner.stop();
      }

      scanner.clear();

    } catch (err) {
      console.error(
        "Scanner stop error:",
        err
      );
    }

    scannerRef.current = null;
  }

  useEffect(() => {
    const scanner =
      new Html5Qrcode(
        "resqmesh-qr-reader"
      );

    scannerRef.current = scanner;

    async function startScanner() {
      try {
        await scanner.start(
          {
            facingMode: "environment",
          },
          {
            fps: 10,
            qrbox: {
              width: 230,
              height: 230,
            },
          },
          async (decodedText) => {
            try {
              const route =
                decodeRoutePayload(
                  decodedText
                );

              await stopScanner();

              setScanning(false);

              onRouteReceived(route);

            } catch (err) {
              console.error(
                "QR decode error:",
                err
              );

              setError(
                "This is not a valid ResQMesh route QR."
              );
            }
          },
          () => {
            // Ignore normal scanning frames
          }
        );

      } catch (err) {
        console.error(
          "Camera error:",
          err
        );

        setScanning(false);

        setError(
          "Camera permission denied or camera unavailable."
        );
      }
    }

    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  async function handleClose() {
    await stopScanner();

    onClose();
  }

  return (
    <div className="qr-overlay">

      <div className="qr-panel scanner-panel">

        {/* HEADER */}

        <div className="qr-header">

          <div>
            <span>
              RESQMESH
            </span>

            <h3>
              Receive Evacuation Route
            </h3>
          </div>

          <button
            className="qr-close-button"
            type="button"
            onClick={handleClose}
          >
            ×
          </button>

        </div>


        {/* SCANNER */}

        <div className="scanner-container">

          <div
            id="resqmesh-qr-reader"
            className="qr-reader"
          />

        </div>


        {/* STATUS */}

        {scanning && !error && (
          <div className="scanner-status">
            <span className="scanner-status-dot" />

            Point the camera at a
            ResQMesh QR code
          </div>
        )}


        {error && (
          <div className="scanner-error">
            <strong>
              Scan failed
            </strong>

            <span>
              {error}
            </span>
          </div>
        )}


        {/* FOOTER */}

        <div className="scanner-footer">

          <span>
            🔒 Route data is processed
            locally on this device.
          </span>

        </div>


        <div className="qr-actions">

          <button
            className="qr-done-button"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}