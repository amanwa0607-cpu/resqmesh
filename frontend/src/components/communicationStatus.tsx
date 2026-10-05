import { useEffect, useState } from "react";

import { qrTransport } from "../services/communication/qrTransport";
import { bleTransport } from "../services/communication/bleTransport";
import { getMapSnapshot } from "../services/offlineStorage";


type Status = "READY" | "ACTIVE" | "UNSUPPORTED" | "ERROR";

interface StatusItemProps {
  label: string;
  status: Status;
  description: string;
}

function StatusItem({
  label,
  status,
  description,
}: StatusItemProps) {
  const isGood =
    status === "READY" || status === "ACTIVE";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "14px",
        padding: "12px 14px",
        borderRadius: "14px",
        background: "#eef2f7",
        boxShadow:
          "inset 3px 3px 7px rgba(163,177,198,.35), inset -3px -3px 7px rgba(255,255,255,.8)",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 800,
            color: "#26313d",
          }}
        >
          {label}
        </div>

        <div
          style={{
            marginTop: "3px",
            fontSize: "10px",
            color: "#7b8794",
          }}
        >
          {description}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          whiteSpace: "nowrap",
          fontSize: "9px",
          fontWeight: 900,
          color: isGood ? "#209b62" : "#d16b72",
        }}
      >
        <span
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: isGood ? "#2db273" : "#e45c63",
            boxShadow: isGood
              ? "0 0 0 3px rgba(45,178,115,.12)"
              : "0 0 0 3px rgba(228,92,99,.12)",
          }}
        />

        {status}
      </div>
    </div>
  );
}

export default function CommunicationStatus() {
  const [qrStatus, setQrStatus] =
    useState<Status>("READY");

  const [bleStatus, setBleStatus] =
    useState<Status>("UNSUPPORTED");

  const [offlineStatus, setOfflineStatus] =
    useState<Status>("ERROR");

  useEffect(() => {
    let mounted = true;

    async function checkStatus() {
      try {
        const qr = await qrTransport.getStatus();

        if (mounted) {
          setQrStatus(
            qr === "available"
              ? "READY"
              : "ERROR"
          );
        }
      } catch {
        if (mounted) {
          setQrStatus("ERROR");
        }
      }

      try {
        const ble = await bleTransport.getStatus();

        if (mounted) {
          setBleStatus(
            ble === "available"
              ? "READY"
              : "UNSUPPORTED"
          );
        }
      } catch {
        if (mounted) {
          setBleStatus("ERROR");
        }
      }

      try {
        const snapshot = await getMapSnapshot();

        if (mounted) {
          setOfflineStatus(
            snapshot ? "ACTIVE" : "ERROR"
          );
        }
      } catch {
        if (mounted) {
          setOfflineStatus("ERROR");
        }
      }
    }

    checkStatus();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "18px",
        borderRadius: "20px",
        background: "#eef2f7",
        boxShadow:
          "8px 8px 18px rgba(163,177,198,.35), -8px -8px 18px rgba(255,255,255,.9)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "14px",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "9px",
              fontWeight: 900,
              letterSpacing: "1.4px",
              color: "#536dfe",
            }}
          >
            RESQMESH
          </span>

          <h3
            style={{
              margin: "4px 0 0",
              fontSize: "17px",
              color: "#26313d",
            }}
          >
            Communication
          </h3>
        </div>

        <div
          style={{
            padding: "7px 10px",
            borderRadius: "10px",
            background: "#e2f5eb",
            color: "#209b62",
            fontSize: "9px",
            fontWeight: 900,
          }}
        >
          OFFLINE READY
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "10px",
        }}
      >
        <StatusItem
          label="QR ROUTE TRANSFER"
          status={qrStatus}
          description="Compact RM2 evacuation payload"
        />

        <StatusItem
          label="BLE TRANSPORT"
          status={bleStatus}
          description="Browser BLE adapter"
        />

        <StatusItem
          label="OFFLINE STORAGE"
          status={offlineStatus}
          description="IndexedDB emergency map"
        />
      </div>
    </section>
  );
}