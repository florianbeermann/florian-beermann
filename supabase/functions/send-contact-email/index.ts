import { corsHeaders } from "@supabase/supabase-js/cors";
import { z } from "npm:zod@3.23.8";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const RECIPIENT = "florian.beermann@gmail.com";

const BodySchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  company: z.string().min(1).max(255),
  role: z.string().max(255).optional().default(""),
  size: z.string().max(50).optional().default(""),
  tooling: z.string().max(50).optional().default(""),
  message: z.string().max(5000).optional().default(""),
});

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const data = parsed.data;

    const rows: Array<[string, string]> = [
      ["Name", data.name],
      ["Email", data.email],
      ["Company", data.company],
      ["Role", data.role || "—"],
      ["Company size", data.size || "—"],
      ["Current CS tooling", data.tooling || "—"],
    ];

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a;">
        <h2 style="margin:0 0 16px;font-size:18px;">New CS audit request</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${rows.map(([k, v]) => `
            <tr>
              <td style="padding:8px 12px;background:#f1f5f9;font-weight:600;width:160px;border:1px solid #e2e8f0;">${escapeHtml(k)}</td>
              <td style="padding:8px 12px;border:1px solid #e2e8f0;">${escapeHtml(v)}</td>
            </tr>`).join("")}
        </table>
        <h3 style="margin:24px 0 8px;font-size:14px;">Message</h3>
        <div style="padding:12px;border:1px solid #e2e8f0;border-radius:6px;white-space:pre-wrap;font-size:14px;line-height:1.5;">
          ${escapeHtml(data.message || "(no message)")}
        </div>
      </div>`;

    const text =
      `New CS audit request\n\n` +
      rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
      `\n\nMessage:\n${data.message || "(no message)"}\n`;

    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: "Beermann.XYZ Contact <onboarding@resend.dev>",
        to: [RECIPIENT],
        reply_to: data.email,
        subject: `New CS audit request — ${data.name} (${data.company})`,
        html,
        text,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(`Resend API failed [${response.status}]: ${JSON.stringify(result)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("send-contact-email error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
