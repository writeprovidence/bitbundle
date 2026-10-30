import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { enqueueAirtimeFulfillment } from "@/lib/queue";

/**
 * POST /api/topup
 * Creates a new airtime order after blockchain payment is verified.
 *
 * Body: { network, phoneNumber, amountNgn, amountUsdt, txHash }
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("bb-session")?.value;

    if (!sessionCookie) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie) as { userId: string; address: string };

    const { network, phoneNumber, amountNgn, amountUsdt, txHash } =
      (await request.json()) as {
        network: string;
        phoneNumber: string;
        amountNgn: number;
        amountUsdt: number;
        txHash: string;
      };

    // Basic validation
    if (!network || !phoneNumber || !amountNgn || !txHash) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createSupabaseAdminClient();

    // Prevent duplicate orders for same tx hash
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("tx_hash", txHash)
      .single();

    if (existing) {
      return Response.json({ error: "Order already exists for this transaction" }, { status: 409 });
    }

    // Create order in DB
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: session.userId,
        network,
        phone_number: phoneNumber,
        amount_ngn: amountNgn,
        amount_usdt: amountUsdt,
        tx_hash: txHash,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("[Topup] Order creation error:", orderError);
      return Response.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Enqueue fulfillment job
    await enqueueAirtimeFulfillment({
      orderId: order.id,
      network,
      phoneNumber,
      amountNgn,
      amountUsdt,
      txHash,
    });

    return Response.json({ ok: true, orderId: order.id }, { status: 201 });
  } catch (err) {
    console.error("[Topup] Error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
