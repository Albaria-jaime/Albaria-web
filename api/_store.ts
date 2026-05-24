import type { IncomingMessage } from "http";

export interface DemoSession {
  token: string;
  startedAt: number;
  expiresAt: number;
}

export const DEMO_DURATION_MS = 3 * 60 * 1000;
export const sessionStore = new Map<string, DemoSession>();
export const analyticsStore = { visits: 0, demoClicks: {} as Record<string, number> };

export function getClientIp(req: IncomingMessage): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0].trim();
  return req.socket?.remoteAddress ?? "unknown";
}
