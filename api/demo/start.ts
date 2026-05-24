import type { IncomingMessage, ServerResponse } from "http";
import crypto from "crypto";
import { sessionStore, DEMO_DURATION_MS, getClientIp } from "../_store";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  const ip = getClientIp(req);
  const existing = sessionStore.get(ip);
  const now = Date.now();

  if (existing) {
    if (now < existing.expiresAt) {
      res.end(JSON.stringify({ ok: true, token: existing.token, startedAt: existing.startedAt, expiresAt: existing.expiresAt, resumed: true }));
      return;
    }
    res.end(JSON.stringify({ ok: false, blocked: true }));
    return;
  }

  const token = crypto.randomBytes(4).toString("hex").toUpperCase();
  const session = { token, startedAt: now, expiresAt: now + DEMO_DURATION_MS };
  sessionStore.set(ip, session);
  res.end(JSON.stringify({ ok: true, token, startedAt: now, expiresAt: now + DEMO_DURATION_MS, resumed: false }));
}
