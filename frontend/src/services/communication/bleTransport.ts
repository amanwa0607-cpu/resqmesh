import type {
  CommunicationAdapter,
  CommunicationResult,
  CommunicationStatus,
  RouteTransferPacket,
} from "./communicationTypes";

/**
 * BLE Transport Adapter
 *
 * This adapter keeps ResQMesh ready for a future
 * Bluetooth implementation without pretending that
 * browser-to-browser Bluetooth is currently supported.
 *
 * QR remains the active transport.
 */

export class BLETransport implements CommunicationAdapter {
  readonly transport = "bluetooth" as const;

  private get bluetoothAvailable(): boolean {
    return (
      typeof navigator !== "undefined" &&
      "bluetooth" in navigator
    );
  }

  async getStatus(): Promise<CommunicationStatus> {
    if (!this.bluetoothAvailable) {
      return "unsupported";
    }

    return "available";
  }

  async send(
    packet: RouteTransferPacket
  ): Promise<CommunicationResult> {
    if (packet.protocol !== "RM2") {
      return {
        success: false,
        transport: "bluetooth",
        error: "Unsupported communication protocol.",
      };
    }

    if (!this.bluetoothAvailable) {
      return {
        success: false,
        transport: "bluetooth",
        error:
          "Bluetooth transport is not supported by this browser.",
      };
    }

    /*
     * Intentionally not calling navigator.bluetooth.requestDevice()
     * here.
     *
     * Web Bluetooth is designed around BLE peripherals/GATT
     * and cannot reliably provide browser-to-browser phone
     * route transfer in this web-only prototype.
     */

    return {
      success: false,
      transport: "bluetooth",
      error:
        "BLE transport adapter is ready, but direct browser-to-browser transfer is unavailable.",
    };
  }

  async receive(): Promise<RouteTransferPacket | null> {
    if (!this.bluetoothAvailable) {
      return null;
    }

    /*
     * Reserved for a future native BLE/GATT implementation.
     */
    return null;
  }
}

export const bleTransport = new BLETransport();