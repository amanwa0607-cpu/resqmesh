import {
  createRoutePayload,
  decodeRoutePayload,
} from "../routeShare";

import type { RouteResult } from "../routeEngine";

import type {
  CommunicationAdapter,
  CommunicationResult,
  CommunicationStatus,
  RouteTransferPacket,
} from "./communicationTypes";

export class QRTransport implements CommunicationAdapter {
  readonly transport = "qr" as const;

  async getStatus(): Promise<CommunicationStatus> {
    return "available";
  }

  async send(
    packet: RouteTransferPacket
  ): Promise<CommunicationResult> {
    if (!packet.payload.startsWith("RM2|")) {
      return {
        success: false,
        transport: "qr",
        error: "Invalid RM2 route payload.",
      };
    }

    return {
      success: true,
      transport: "qr",
      message: "Route payload ready for QR transfer.",
    };
  }

  async receive(): Promise<RouteTransferPacket | null> {
    return null;
  }

  static createPacket(
    payload: string
  ): RouteTransferPacket {
    if (!payload.startsWith("RM2|")) {
      throw new Error("Invalid RM2 payload.");
    }

    return {
      protocol: "RM2",
      payload,
      createdAt: Date.now(),
      transport: "qr",
    };
  }

  static createPacketFromRoute(
    hazardId: string,
    shelterId: string,
    route: RouteResult
  ): RouteTransferPacket {
    const payload = createRoutePayload(
      hazardId,
      shelterId,
      route.distance,
      route.blockedRoadsAvoided,
      route.path
    );

    return QRTransport.createPacket(payload);
  }

  static decodePacket(
    packet: RouteTransferPacket
  ) {
    if (packet.protocol !== "RM2") {
      throw new Error("Unsupported communication protocol.");
    }

    return decodeRoutePayload(packet.payload);
  }
}

export const qrTransport = new QRTransport();