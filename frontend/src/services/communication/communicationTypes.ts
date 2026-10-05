/**
 * ResQMesh Communication Layer
 *
 * Common types shared by QR, BLE and future
 * communication transports.
 */

export type CommunicationTransport =
  | "qr"
  | "bluetooth";

export type CommunicationStatus =
  | "available"
  | "unavailable"
  | "unsupported"
  | "error";

export interface CommunicationResult {
  success: boolean;
  transport: CommunicationTransport;
  message?: string;
  error?: string;
}

export interface RouteTransferPacket {
  protocol: "RM2";
  payload: string;
  createdAt: number;
  transport?: CommunicationTransport;
}

export interface CommunicationAdapter {
  readonly transport: CommunicationTransport;

  getStatus(): Promise<CommunicationStatus>;

  send(
    packet: RouteTransferPacket
  ): Promise<CommunicationResult>;

  receive(): Promise<RouteTransferPacket | null>;
}