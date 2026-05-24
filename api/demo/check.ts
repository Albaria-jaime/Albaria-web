import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sessionStore, getClientIp } from "../_store";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const ip = getClientIp(req as never);
  const existing = sessionStore.get(ip);
  const now = Date.now();

  if (!existing) return res.json({ status: "none" });

  if (now >= existing.expiresAt) {
    return res.json({ status: "expired", token: existing.token });
  }

  return res.json({
    status: "active",
    token: existing.token,
    startedAt: existing.startedAt,
    expiresAt: existing.expiresAt,
    timeLeft: existing.expiresAt - now,
  });
}
