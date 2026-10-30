import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

/**
 * GET /api/orders
 * Returns the current user's order history, newest first.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("bb-session")?.value;

    if (!sessionCookie) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie) as { userId: string };

    const supabase = await createSupabaseAdminClient();

    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        "id, network, phone_number, amount_ngn, amount_usdt, tx_hash, status, supplier_ref, created_at",
      )
      .eq("user_id", session.userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("[Orders] Fetch error:", error);
      return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
    }

    return Response.json({ orders });
  } catch (err) {
    console.error("[Orders] Error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
