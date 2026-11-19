import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { generateNonce, SiweMessage } from "siwe";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/auth/siwe
 * Returns a fresh nonce to be included in the SIWE message.
 */
export async function GET() {
  const nonce = generateNonce();

  const cookieStore = await cookies();
  cookieStore.set("siwe-nonce", nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 300, // 5 minutes
    path: "/",
  });

  return Response.json({ nonce });
}

/**
 * POST /api/auth/siwe
 * Verifies the SIWE signature, then creates or updates the user in Supabase.
 */
export async function POST(request: NextRequest) {
  try {
    const { message, signature } = (await request.json()) as {
      message: string;
      signature: string;
    };

    const cookieStore = await cookies();
    const nonce = cookieStore.get("siwe-nonce")?.value;

    if (!nonce) {
      return Response.json({ error: "Missing nonce" }, { status: 400 });
    }

    const siweMessage = new SiweMessage(message);
    const { data: fields } = await siweMessage.verify({ signature, nonce });

    if (fields.nonce !== nonce) {
      return Response.json({ error: "Nonce mismatch" }, { status: 422 });
    }

    // Default userId from verified address
    let userId = `usr_${fields.address.slice(2, 10).toLowerCase()}`;

    // Try storing wallet address in Supabase users table if configured and reachable
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const isPlaceholder = !supabaseUrl || supabaseUrl.includes("your-project.supabase.co");

      if (!isPlaceholder) {
        const supabase = await createSupabaseAdminClient();
        const { data: user, error } = await supabase
          .from("users")
          .upsert(
            { wallet_address: fields.address.toLowerCase() },
            { onConflict: "wallet_address" },
          )
          .select("id")
          .single();

        if (user && !error) {
          userId = user.id;
        } else if (error) {
          console.warn("[SIWE] Supabase non-critical warning:", error.message);
        }
      }
    } catch (dbErr) {
      console.warn("[SIWE] Supabase unreachable, proceeding with verified address session:", dbErr);
    }

    // Set session cookie
    cookieStore.set("bb-session", JSON.stringify({ userId, address: fields.address }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Clear nonce
    cookieStore.delete("siwe-nonce");

    return Response.json({ ok: true, address: fields.address, userId });
  } catch (err) {
    console.error("[SIWE] Verification error:", err);
    return Response.json({ error: "Verification failed" }, { status: 422 });
  }
}
