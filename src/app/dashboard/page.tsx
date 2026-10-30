import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";
import { OrderHistory } from "@/components/OrderHistory";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard — Bitbundle",
  description: "View your airtime purchase history and account details.",
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("bb-session")?.value;

  if (!sessionCookie) {
    redirect("/");
  }

  const session = JSON.parse(sessionCookie) as { userId: string; address: string };
  const shortAddr = `${session.address.slice(0, 6)}…${session.address.slice(-4)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container-page">
          <div className="h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 font-extrabold text-xl text-gray-900 tracking-tight"
            >
              <span className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </span>
              <span>Bitbundle</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-mono font-semibold text-green-700">{shortAddr}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container-page py-10">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Summary cards */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Your Dashboard</h1>
          <p className="text-sm text-gray-500">All your airtime purchases in one place.</p>
        </div>

        {/* Order history */}
        <OrderHistory />
      </main>
    </div>
  );
}
