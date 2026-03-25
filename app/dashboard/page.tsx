"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Phone, Calendar, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

interface Stats {
  total_calls: number;
  appointments_booked: number;
  conversion_rate: number;
  avg_duration_seconds: number;
}

interface Shop {
  name: string;
  phone_number?: string;
  subscription_status: string;
}

export default function DashboardPage() {
  const { getToken } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      if (!token) return;
      try {
        const [shopData, statsData, callsData] = await Promise.all([
          api.getShop(token),
          api.getCallStats(token),
          api.getCalls(token, 5),
        ]);
        setShop(shopData);
        setStats(statsData);
        setRecentCalls(callsData.calls || []);
      } catch (e) {
        // Shop may not exist yet
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-gray-400">Loading...</div>
    </div>
  );

  // No shop yet — show onboarding CTA
  if (!shop) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#fff7ed" }}>
          <Phone className="w-8 h-8" style={{ color: "#ea580c" }} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Set up your shop</h2>
        <p className="text-gray-500 mb-6">Configure your AI receptionist in a few minutes.</p>
        <Link
          href="/dashboard/settings"
          className="text-white px-6 py-3 rounded-lg font-medium transition"
          style={{ backgroundColor: "#ea580c" }}
        >
          Get Started
        </Link>
      </div>
    </div>
  );

  const statCards = [
    { label: "Total Calls", value: stats?.total_calls ?? 0, icon: Phone },
    { label: "Appointments Booked", value: stats?.appointments_booked ?? 0, icon: Calendar },
    { label: "Conversion Rate", value: `${stats?.conversion_rate ?? 0}%`, icon: TrendingUp },
    { label: "Avg Call Duration", value: `${Math.round((stats?.avg_duration_seconds ?? 0) / 60)}m`, icon: Clock },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
        <div className="flex items-center gap-3 mt-1">
          {shop.phone_number && (
            <span className="text-gray-500 text-sm">AI line: {shop.phone_number}</span>
          )}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
            shop.subscription_status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              shop.subscription_status === "active" ? "bg-green-500" : "bg-yellow-500"
            }`} />
            {shop.subscription_status === "active" ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      {/* Recent Calls */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Calls</h2>
          <Link href="/dashboard/calls" className="text-sm font-medium hover:underline" style={{ color: "#ea580c" }}>
            View all
          </Link>
        </div>
        {recentCalls.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400">
            No calls yet. Calls will appear here once your AI line is active.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentCalls.map((call) => (
              <Link
                key={call.id}
                href={`/dashboard/calls/${call.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  call.appointment_booked ? "bg-green-400" : "bg-gray-300"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {call.caller_number || "Unknown"}
                  </div>
                  <div className="text-xs text-gray-400 truncate">{call.summary || "No summary"}</div>
                </div>
                <div className="text-xs text-gray-400 shrink-0">
                  {call.duration_seconds ? `${Math.round(call.duration_seconds / 60)}m` : "—"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
