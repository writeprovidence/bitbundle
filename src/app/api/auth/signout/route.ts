import { cookies } from "next/headers";

/**
 * POST /api/auth/signout
 * Clears the bb-session cookie to sign the user out.
 */
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("bb-session");
  return Response.json({ ok: true });
}
