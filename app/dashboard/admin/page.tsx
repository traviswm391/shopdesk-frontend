"use client";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { Phone, Building2, TrendingUp, Calendar, Clock } from "lucide-react";
import { api } from "@/lib/api";

const ADMIN_USER_ID = "user_3BQ84qxBvEBwI5E5WaVkwKBDVYY";

interface PlatformStats {
  total_shops: number;
  active_shops: number;
  total_calls: number;
  total_appointments_booked: number;
  platform_conversion_rate: number;
  avg_call_duration_seconds: number;
  shops: any[];
}

export default function AdminPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.id === ADMIN_USER_ID;

  useEffect(() => {
    if (!isAdmin) return;
    async function load() {
      const token = await getToken();
      if (!token) return;
      try {
        const [statsData, callsData] = await Promise.all([api.adminStats(token), api.adminCalls(token)]);
        setStats(statsData);
        setRecentCalls(callsData.calls || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, [getToken, isAdmin]);

  if (!isAdmin) return <div className="flex items-center justify-center h-full"><p className="text-gray-500">Access denied.</p></div>;
  if (loading) return <div className="flex items-center justify-center h-full"><div className="text-gray-400">Loading platform data...</div></div>;

  const statCards = [
    { label: "Total Shops", value: stats?.total_shops ?? 0, icon: Building2 },
    { label: "Active Subscriptions", value: stats?.active_shops ?? 0, icon: TrendingUp },
    { label: "Total Calls", value: stats?.total_calls ?? 0, icon: Phone },
    { label: "Appointments Booked", value: stats?.total_appointments_booked ?? 0, icon: Calendar },
    { label: "Platform Conversion", value: String(stats?.platform_conversion_rate ?? 0) + "%", icon: TrendingUp },
    { label: "Avg Call Duration", value: Math.round((stats?.avg_call_duration_seconds ?? 0) / 60) + "m", icon: Clock },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Admin View</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-500 text-sm mt-1">All shops and activity across ShopDesk AI</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{s.label}</span>
              <s.icon className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-semibold text-gray-900">All Shops</h2></div>
        {(stats?.shops || []).length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400">No shops yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Shop</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Calls</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Joined</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {(stats?.shops || []).map((shop: any) => (
                  <tr key={shop.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4"><div className="font-medium text-gray-900">{shop.name}</div><div className="text-xs text-gray-400">{shop.phone_number || "No AI number yet"}</div></td>
                    <td className="px-6 py-4">
                      <span className={["inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium", shop.subscription_status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"].join(" ")}>
                        <span className={["w-1.5 h-1.5 rounded-full", shop.subscription_status === "active" ? "bg-green-500" : "bg-gray-400"].join(" ")} />
                        {shop.subscription_status || "inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{shop.call_count ?? 0}</td>
                    <td className="px-6 py-4 text-gray-400">{shop.created_at ? new Date(shop.created_at).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-semibold text-gray-900">Recent Calls — All Shops</h2></div>
        {recentCalls.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400">No calls yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentCalls.slice(0, 20).map((call: any) => (
              <div key={call.id} className="flex items-center gap-4 px-6 py-4">
                <div className={["w-2 h-2 rounded-full shrink-0", call.appointment_booked ? "bg-green-400" : "bg-gray-300"].join(" ")} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{call.caller_number || "Unknown"}</span>
                    {call.shops?.name && <span className="text-xs text-gray-400">→ {call.shops.name}</span>}
                  </div>
                  <div className="text-xs text-gray-400 truncate">{call.summary || "No summary"}</div>
                </div>
                <div className="text-xs text-gray-400 shrink-0 text-right">
                  <div>{call.duration_seconds ? Math.round(call.duration_seconds / 60) + "m" : "—"}</div>
                  <div>{call.created_at ? new Date(call.created_at).toLocaleDateString() : ""}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
