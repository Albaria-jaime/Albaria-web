import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import { sessionStore, DEMO_DURATION_MS, getClientIp } from "../_store";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = getClientIp(req as never);
  const existing = sessionStore.get(ip);
  const now = Date.now();

  if (existing) {
    if (now < existing.expiresAt) {
      return res.json({ ok: true, token: existing.token, startedAt: existing.startedAt, expiresAt: existing.expiresAt, resumed: true });
    }
    return res.json({ ok: false, blocked: true });
  }

  const token = crypto.randomBytes(4).toString("hex").toUpperCase();
  const session = { token, startedAt: now, expiresAt: now + DEMO_DURATION_MS };
  sessionStore.set(ip, session);

  return res.json({ ok: true, token, startedAt: now, expiresAt: now + DEMO_DURATION_MS, resumed: false });
}
