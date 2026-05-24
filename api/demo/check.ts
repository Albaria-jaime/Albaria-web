import type { IncomingMessage, ServerResponse } from "http";
import { sessionStore, getClientIp } from "../_store";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  const ip = getClientIp(req);
  const existing = sessionStore.get(ip);
  const now = Date.now();

  if (!existing) {
    res.end(JSON.stringify({ status: "none" }));
    return;
  }
  if (now >= existing.expiresAt) {
    res.end(JSON.stringify({ status: "expired", token: existing.token }));
    return;
  }
  res.end(JSON.stringify({
    status: "active",
    token: existing.token,
    startedAt: existing.startedAt,
    expiresAt: existing.expiresAt,
    timeLeft: existing.expiresAt - now,
  }));
}
