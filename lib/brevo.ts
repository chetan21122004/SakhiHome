import type { Enquiry } from "./enquiries";

type SendResult = { ok: true } | { ok: false; error: string };

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function brevoConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY?.trim());
}

/**
 * Sends a transactional email via Brevo when a homepage enquiry is received.
 *
 * Env:
 * - BREVO_API_KEY — required
 * - BREVO_SENDER_EMAIL — optional (default Brevo account: chetanm122004@gmail.com)
 * - BREVO_SENDER_NAME — optional (default SakhiHome)
 * - ENQUIRY_NOTIFY_EMAIL — recipient (default chetan44rt@gmail.com)
 */
const DEFAULT_BREVO_SENDER_EMAIL = "chetanm122004@gmail.com";

export async function sendEnquiryNotification(
  enquiry: Enquiry,
): Promise<SendResult> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const senderEmail =
    process.env.BREVO_SENDER_EMAIL?.trim() || DEFAULT_BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || "SakhiHome";
  const toEmail =
    process.env.ENQUIRY_NOTIFY_EMAIL?.trim() || "chetan44rt@gmail.com";

  if (!apiKey) {
    return { ok: false, error: "BREVO_API_KEY is not set" };
  }
  const subject = `New SakhiHome enquiry — ${enquiry.name} (${enquiry.area || "area TBD"})`;

  const rows = [
    ["Name", enquiry.name],
    ["Phone", enquiry.phone],
    ["Area", enquiry.area || "—"],
    ["Service", enquiry.service || "—"],
    ["Budget", enquiry.budget || "—"],
    ["Preferred time", [enquiry.startTime, enquiry.endTime].filter(Boolean).join(" – ") || "—"],
    ["Message", enquiry.message || "—"],
    ["Enquiry ID", enquiry.id],
  ];

  const html = `
    <h2>New website enquiry</h2>
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:6px 12px 6px 0;font-weight:600;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;">${escapeHtml(value)}</td></tr>`,
        )
        .join("")}
    </table>
    <p style="color:#64748b;font-size:12px;margin-top:16px;">Also saved in SakhiHome admin → Enquiries.</p>
  `.trim();

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: toEmail }],
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    return {
      ok: false,
      error: `Brevo ${response.status}: ${body.slice(0, 200)}`,
    };
  }

  return { ok: true };
}
