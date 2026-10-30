"use client";

import { useState, useEffect } from "react";
import { Loader2, RefreshCw, ShoppingBag } from "lucide-react";

interface Order {
  id: string;
  network: string;
  phone_number: string;
  amount_ngn: number;
  amount_usdt: number;
  tx_hash: string;
  status: "pending" | "processing" | "completed" | "failed";
  supplier_ref: string | null;
  created_at: string;
}

const statusConfig: Record<Order["status"], { label: string; classes: string }> = {
  pending: { label: "Pending", classes: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  processing: { label: "Processing", classes: "bg-blue-100 text-blue-700 border-blue-200" },
  completed: { label: "Completed", classes: "bg-green-100 text-green-700 border-green-200" },
  failed: { label: "Failed", classes: "bg-red-100 text-red-700 border-red-200" },
};

const networkColors: Record<string, string> = {
  mtn: "#ffcc00",
  airtel: "#e40000",
  glo: "#48b834",
  "9mobile": "#006633",
};

const networkTextColors: Record<string, string> = {
  mtn: "#1a1a00",
  airtel: "#fff",
  glo: "#fff",
  "9mobile": "#fff",
};

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchOrders() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to load orders");
      const data = (await res.json()) as { orders: Order[] };
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-8 text-center">
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
          <ShoppingBag className="w-7 h-7 text-gray-400" />
        </div>
        <div>
          <p className="font-semibold text-gray-800 mb-1">No orders yet</p>
          <p className="text-sm text-gray-500">Your airtime purchases will appear here.</p>
        </div>
        <a
          href="/"
          className="mt-2 inline-block px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition-colors"
        >
          Buy airtime →
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Table header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-900">Order history</h2>
        <button
          onClick={fetchOrders}
          id="orders-refresh-btn"
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Network</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Crypto</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tx</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => {
              const status = statusConfig[order.status] ?? statusConfig.pending;
              const netColor = networkColors[order.network] ?? "#aaa";
              const netText = networkTextColors[order.network] ?? "#fff";
              return (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString("en-NG", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black"
                      style={{ backgroundColor: netColor, color: netText }}
                    >
                      {order.network.slice(0, 1).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-700">{order.phone_number}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">
                    ₦{order.amount_ngn.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-gray-700">
                    {order.amount_usdt.toFixed(4)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${status.classes}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`https://etherscan.io/tx/${order.tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-green-600 hover:underline"
                    >
                      {order.tx_hash.slice(0, 8)}…
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-100">
        {orders.map((order) => {
          const status = statusConfig[order.status] ?? statusConfig.pending;
          const netColor = networkColors[order.network] ?? "#aaa";
          const netText = networkTextColors[order.network] ?? "#fff";
          return (
            <div key={order.id} className="px-4 py-4 flex items-start gap-3">
              <span
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-black shrink-0 mt-0.5"
                style={{ backgroundColor: netColor, color: netText }}
              >
                {order.network.slice(0, 1).toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900">₦{order.amount_ngn.toLocaleString()}</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${status.classes}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{order.phone_number}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(order.created_at).toLocaleDateString("en-NG", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                  {" · "}
                  <a
                    href={`https://etherscan.io/tx/${order.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline font-mono"
                  >
                    {order.tx_hash.slice(0, 8)}…
                  </a>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
