import type { IncomingMessage, ServerResponse } from "http";

interface ContactBody {
  nombre?: string;
  empresa?: string;
  mensaje?: string;
}

function parseBody(req: IncomingMessage): Promise<ContactBody> {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk: Buffer) => { raw += chunk.toString(); });
    req.on("end", () => {
      try { resolve(JSON.parse(raw) as ContactBody); }
      catch { resolve({}); }
    });
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") { res.statusCode = 204; res.end(); return; }
  if (req.method !== "POST") { res.statusCode = 405; res.end(JSON.stringify({ error: "Method not allowed" })); return; }

  const body = await parseBody(req);
  const { nombre = "", empresa = "", mensaje = "" } = body;

  if (!nombre || !empresa || !mensaje) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Faltan campos obligatorios" }));
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Email service not configured" }));
    return;
  }

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#6366F1">Nueva consulta desde albariasolutions.com</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#888;width:100px">Nombre</td><td style="padding:8px 0;font-weight:600">${nombre}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Empresa</td><td style="padding:8px 0;font-weight:600">${empresa}</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
      <p style="color:#333;white-space:pre-wrap">${mensaje}</p>
    </div>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Albaria Web <onboarding@resend.dev>",
        to: ["jaime@albariasolutions.com"],
        subject: `Consulta de ${nombre} — ${empresa}`,
        html,
        reply_to: undefined,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      res.statusCode = 502;
      res.end(JSON.stringify({ error: "Error al enviar", detail: err }));
      return;
    }

    res.end(JSON.stringify({ ok: true }));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Error de red" }));
  }
}
