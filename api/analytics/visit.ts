import type { VercelRequest, VercelResponse } from "@vercel/node";
import { analyticsStore } from "../_store";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  analyticsStore.visits += 1;
  return res.json({ visits: analyticsStore.visits });
}
