import type { IncomingMessage, ServerResponse } from "http";
import { analyticsStore } from "../_store";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }
  let body = "";
  req.on("data", (chunk: Buffer) => { body += chunk.toString(); });
  req.on("end", () => {
    try {
      const parsed = JSON.parse(body) as { demo?: string };
      const demo = parsed.demo ?? "unknown";
      analyticsStore.demoClicks[demo] = (analyticsStore.demoClicks[demo] ?? 0) + 1;
    } catch { /* ignore */ }
    res.end(JSON.stringify({ ok: true }));
  });
}
