import type { IncomingMessage, ServerResponse } from "http";
import { analyticsStore } from "../_store";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }
  analyticsStore.visits += 1;
  res.end(JSON.stringify({ visits: analyticsStore.visits }));
}
