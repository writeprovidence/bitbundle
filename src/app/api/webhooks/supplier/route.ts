import type { NextRequest } from "next/server";
import { airtimeSupplier } from "@/lib/airtime/vtpass";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

/**
 * POST /api/webhooks/supplier
 * Receives status callbacks from VTpass (or other supplier).
 * Validates a shared secret, then updates the order status.
 */
export async function POST(request: NextRequest) {
  try {
    // Validate shared secret
    const secret = request.headers.get("x-webhook-secret");
    if (secret !== process.env.WEBHOOK_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = (await request.json()) as {
      reference: string;
      status: string;
    };

    const { reference, status } = body;

    if (!reference) {
      return new Response("Missing reference", { status: 400 });
    }

    const supabase = await createSupabaseAdminClient();

    // Map supplier status to our internal status
    const internalStatus =
      status === "delivered"
        ? "completed"
        : status === "failed"
          ? "failed"
          : "processing";

    const { error } = await supabase
      .from("orders")
      .update({ status: internalStatus, supplier_ref: reference, updated_at: new Date().toISOString() })
      .eq("supplier_ref", reference);

    if (error) {
      console.error("[Webhook] Supabase update error:", error);
      return new Response("DB error", { status: 500 });
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("[Webhook] Error:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
