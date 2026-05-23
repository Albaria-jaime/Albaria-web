import { Router, type IRouter } from "express";
import fs from "fs";
import path from "path";

const router: IRouter = Router();
const dataFile = path.join("/home/runner/workspace", "analytics-data.json");

interface AnalyticsData {
  visits: number;
  demoClicks: Record<string, number>;
}

function readData(): AnalyticsData {
  try {
    if (fs.existsSync(dataFile)) {
      return JSON.parse(fs.readFileSync(dataFile, "utf-8")) as AnalyticsData;
    }
  } catch {
    // ignore
  }
  return { visits: 0, demoClicks: {} };
}

function writeData(data: AnalyticsData): void {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  } catch {
    // ignore
  }
}

router.post("/analytics/visit", (req, res) => {
  const data = readData();
  data.visits = (data.visits || 0) + 1;
  writeData(data);
  res.json({ visits: data.visits });
});

router.post("/analytics/demo-click", (req, res) => {
  const body = req.body as { demo?: string };
  const demo = body.demo ?? "unknown";
  const data = readData();
  if (!data.demoClicks) data.demoClicks = {};
  data.demoClicks[demo] = (data.demoClicks[demo] || 0) + 1;
  writeData(data);
  res.json({ ok: true });
});

router.get("/analytics/stats", (_req, res) => {
  const data = readData();
  res.json(data);
});

export default router;
