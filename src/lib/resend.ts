import { Resend } from "resend";

export function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

// Fallback placeholder key prevents top-level errors during Next.js build / page data collection
export const resend = new Resend(process.env.RESEND_API_KEY || "re_build_placeholder");

export interface ReceiptEmailParams {
  to: string;
  orderRef: string;
  network: string;
  phone: string;
  amountNgn: number;
  amountUsdt: number;
  txHash: string;
}

export async function sendReceiptEmail(params: ReceiptEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[Resend] RESEND_API_KEY is not configured; skipping receipt email.");
    return null;
  }

  const { to, orderRef, network, phone, amountNgn, amountUsdt, txHash } = params;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Airtime Receipt — Bitbundle</title>
      </head>
      <body style="font-family: system-ui, sans-serif; background: #f9fafb; padding: 24px; color: #111;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 32px; border: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
            <div style="width: 28px; height: 28px; background: #22c55e; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <span style="color: #fff; font-size: 16px;">⚡</span>
            </div>
            <span style="font-weight: 800; font-size: 18px; color: #111;">Bitbundle</span>
          </div>

          <h1 style="font-size: 20px; font-weight: 700; margin: 0 0 4px;">Airtime delivered ✓</h1>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px;">Your airtime top-up was successful.</p>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 8px 0; color: #6b7280; border-top: 1px solid #f3f4f6;">Order ref</td><td style="padding: 8px 0; font-weight: 600; text-align: right;">${orderRef}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; border-top: 1px solid #f3f4f6;">Network</td><td style="padding: 8px 0; font-weight: 600; text-align: right;">${network.toUpperCase()}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; border-top: 1px solid #f3f4f6;">Phone</td><td style="padding: 8px 0; font-weight: 600; text-align: right;">+234${phone.replace(/^0/, "")}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; border-top: 1px solid #f3f4f6;">Amount (NGN)</td><td style="padding: 8px 0; font-weight: 600; text-align: right;">₦${amountNgn.toLocaleString()}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; border-top: 1px solid #f3f4f6;">Paid (USDT)</td><td style="padding: 8px 0; font-weight: 700; color: #16a34a; text-align: right;">${amountUsdt} USDT</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; border-top: 1px solid #f3f4f6; word-break: break-all;">Tx hash</td><td style="padding: 8px 0; font-size: 11px; text-align: right; word-break: break-all;">${txHash.slice(0, 20)}…</td></tr>
          </table>

          <p style="font-size: 12px; color: #9ca3af; margin-top: 24px; border-top: 1px solid #f3f4f6; padding-top: 16px;">
            © ${new Date().getFullYear()} Bitbundle. If you did not make this purchase, please contact support immediately.
          </p>
        </div>
      </body>
    </html>
  `;

  const client = getResend() ?? resend;
  return client.emails.send({
    from: "Bitbundle <receipts@bitbundle.xyz>",
    to,
    subject: `Airtime receipt — ₦${amountNgn.toLocaleString()} top-up confirmed`,
    html,
  });
}
