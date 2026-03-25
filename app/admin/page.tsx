"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  Building2,
  Phone,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

const MRR_PER_SHOP = 299;

export default function AdminOverviewPage() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      if (!token) return;
      try {
        const [s, c] = await Promise.all([
          api.adminStats(token),
          api.adminCalls(token),
        ]);
        setStats(s);
        setCalls(c.calls || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 text-sm">Loading platform data...</div>
      </div>
    );

  const mrr = (stats?.active_shops ?? 0) * MRR_PER_SHOP;

  const statCards = [
    {
      label: "Total Shops",
      value: stats?.total_shops ?? 0,
      icon: Building2,
      color: "#6366f1",
    },
    {
      label: "Active Subscriptions",
      value: stats?.active_shops ?? 0,
      icon: TrendingUp,
      color: "#22c55e",
    },
    {
      label: "Monthly Revenue",
      value: "$" + mrr.toLocaleString(),
      icon: DollarSign,
      color: "#ea580c",
    },
    {
      label: "Total Calls",
      value: stats?.total_calls ?? 0,
      icon: Phone,
      color: "#3b82f6",
    },
    {
      label: "Appointments Booked",
      value: stats?.total_appointments_booked ?? 0,
      icon: Calendar,
      color: "#a855f7",
    },
    {
      label: "Conversion Rate",
      value: (stats?.platform_conversion_rate ?? 0) + "%",
      icon: CheckCircle,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-xs text-gray-600 font-medium uppercase tracking-widest">
            Admin Panel
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
        <p className="text-gray-600 text-sm mt-1">
          Real-time stats across all ShopDesk AI customers
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5"
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-medium">{s.label}</span>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: s.color + "22" }}
              >
                <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Shops Table */}
      <div
        className="rounded-2xl overflow-hidden mb-8"
        style={{
          backgroundColor: "#1a1a1a",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h2 className="font-semibold text-white">All Shops</h2>
          <Link
            href="/admin/shops"
            className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {(stats?.shops || []).length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-700">No shops yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["Shop", "Status", "Calls", "MRR", "Joined"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(stats?.shops || []).map((shop: any) => (
                <tr
                  key={shop.id}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/shops/${shop.id}`}
                      className="font-medium text-white hover:text-orange-400 transition-colors"
                    >
                      {shop.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        shop.subscription_status === "active"
                          ? "bg-green-500/15 text-green-400"
                          : "bg-gray-800 text-gray-500"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          shop.subscription_status === "active"
                            ? "bg-green-400"
                            : "bg-gray-600"
                        }`}
                      />
                      {shop.subscription_status || "inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{shop.call_count ?? 0}</td>
                  <td className="px-6 py-4">
                    {shop.subscription_status === "active" ? (
                      <span className="text-green-400 font-medium">$299</span>
                    ) : (
                      <span className="text-gray-700">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-xs">
                    {shop.created_at
                      ? new Date(shop.created_at).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent Calls */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#1a1a1a",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h2 className="font-semibold text-white">Recent Calls — All Shops</h2>
        </div>
        {calls.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-700">No calls yet.</div>
        ) : (
          <div>
            {calls.slice(0, 15).map((call: any) => (
              <div
                key={call.id}
                className="flex items-start gap-4 px-6 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    call.appointment_booked ? "bg-green-400" : "bg-gray-700"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-white">
                      {call.caller_number || "Unknown"}
                    </span>
                    {call.shops?.name && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: "rgba(234,88,12,0.12)",
                          color: "#fb923c",
                        }}
                      >
                        {call.shops.name}
                      </span>
                    )}
                    {call.appointment_booked && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">
                        Booked
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5 truncate">
                    {call.summary || "No summary"}
                  </div>
                </div>
                <div className="text-xs text-gray-600 shrink-0 text-right">
                  <div>
                    {call.duration_seconds
                      ? Math.round(call.duration_seconds / 60) + "m"
                      : "—"}
                  </div>
                  <div>
                    {call.created_at
                      ? new Date(call.created_at).toLocaleDateString()
                      : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
