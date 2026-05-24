import type { VercelRequest, VercelResponse } from "@vercel/node";
import { analyticsStore } from "../_store";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const demo = (req.body as { demo?: string })?.demo ?? "unknown";
  analyticsStore.demoClicks[demo] = (analyticsStore.demoClicks[demo] ?? 0) + 1;
  return res.json({ ok: true });
}
