import { Router, type IRouter, type Request } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const router: IRouter = Router();
const dataFile = path.join("/home/runner/workspace", "demo-sessions.json");
const DEMO_DURATION_MS = 3 * 60 * 1000;

interface DemoSession {
  token: string;
  startedAt: number;
  expiresAt: number;
  used: boolean;
}

interface SessionStore {
  sessions: Record<string, DemoSession>;
}

function readStore(): SessionStore {
  try {
    if (fs.existsSync(dataFile)) {
      return JSON.parse(fs.readFileSync(dataFile, "utf-8")) as SessionStore;
    }
  } catch {
    // ignore
  }
  return { sessions: {} };
}

function writeStore(store: SessionStore): void {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(store, null, 2));
  } catch {
    // ignore
  }
}

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.socket.remoteAddress ?? "unknown";
}

router.post("/demo/start", (req, res) => {
  const ip = getClientIp(req);
  const store = readStore();
  const existing = store.sessions[ip];

  if (existing) {
    const now = Date.now();
    if (now < existing.expiresAt) {
      res.json({
        ok: true,
        token: existing.token,
        startedAt: existing.startedAt,
        expiresAt: existing.expiresAt,
        resumed: true,
      });
      return;
    }
    res.json({ ok: false, blocked: true });
    return;
  }

  const token = crypto.randomBytes(4).toString("hex").toUpperCase();
  const now = Date.now();
  const session: DemoSession = {
    token,
    startedAt: now,
    expiresAt: now + DEMO_DURATION_MS,
    used: true,
  };
  store.sessions[ip] = session;
  writeStore(store);

  res.json({ ok: true, token, startedAt: now, expiresAt: now + DEMO_DURATION_MS, resumed: false });
});

router.get("/demo/check", (req, res) => {
  const ip = getClientIp(req);
  const store = readStore();
  const existing = store.sessions[ip];
  const now = Date.now();

  if (!existing) {
    res.json({ status: "none" });
    return;
  }
  if (now >= existing.expiresAt) {
    res.json({ status: "expired", token: existing.token });
    return;
  }
  res.json({
    status: "active",
    token: existing.token,
    startedAt: existing.startedAt,
    expiresAt: existing.expiresAt,
    timeLeft: existing.expiresAt - now,
  });
});

export default router;
