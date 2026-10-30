import { cookies } from "next/headers";

/**
 * GET /api/auth/me
 * Returns the current session's userId and address from the httpOnly cookie.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("bb-session")?.value;

    if (!sessionCookie) {
      return Response.json({ error: "No session" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie) as { userId: string; address: string };
    return Response.json({ userId: session.userId, address: session.address });
  } catch {
    return Response.json({ error: "Invalid session" }, { status: 401 });
  }
}
