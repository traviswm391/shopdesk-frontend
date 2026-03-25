"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Calendar,
  CheckCircle,
  Settings,
  ExternalLink,
  Save,
  Clock,
} from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function AdminShopDetailPage() {
  const { getToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const shopId = params.shopId as string;

  const [shop, setShop] = useState<any>(null);
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "settings">("overview");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    async function load() {
      const token = await getToken();
      if (!token) return;
      try {
        const [shopData, callsData] = await Promise.all([
          api.adminGetShop(token, shopId),
          api.adminGetShopCalls(token, shopId),
        ]);
        setShop(shopData);
        setForm({
          name: shopData.name || "",
          address: shopData.address || "",
          greeting: shopData.greeting || "",
          services: (shopData.services || []).join(", "),
          declined_services: (shopData.declined_services || []).join(", "),
        });
        setCalls(callsData.calls || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken, shopId]);

  async function handleSave() {
    const token = await getToken();
    if (!token) return;
    setSaving(true);
    try {
      const updates: any = {
        name: form.name,
        address: form.address,
        greeting: form.greeting,
        services: form.services
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
        declined_services: form.declined_services
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
      };
      const updated = await api.adminUpdateShop(token, shopId, updates);
      setShop(updated);
      setEditing(false);
      setSaveMsg("Saved successfully!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (e) {
      console.error(e);
      setSaveMsg("Error saving changes.");
    } finally {
      setSaving(false);
    }
  }

  function handleManageShop() {
    localStorage.setItem("admin_impersonating_shop_id", shopId);
    localStorage.setItem("admin_impersonating_shop_name", shop?.name || "");
    router.push("/dashboard");
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 text-sm">Loading shop data...</div>
      </div>
    );

  if (!shop)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 text-sm">Shop not found.</div>
      </div>
    );

  const bookedCalls = calls.filter((c) => c.appointment_booked).length;
  const convRate = calls.length > 0 ? Math.round((bookedCalls / calls.length) * 100) : 0;
  const avgDuration =
    calls.length > 0
      ? Math.round(
          calls.reduce((sum, c) => sum + (c.duration_seconds || 0), 0) /
            calls.length /
            60
        )
      : 0;

  return (
    <div className="p-8">
      {/* Back link */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Overview
      </Link>

      {/* Shop Header */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          backgroundColor: "#1a1a1a",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{shop.name}</h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
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
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {shop.phone_number && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  {shop.phone_number}
                </span>
              )}
              {shop.address && <span>{shop.address}</span>}
              <span className="text-gray-700">
                Joined {new Date(shop.created_at).toLocaleDateString()}
              </span>
            </div>
            {shop.clerk_user_id && (
              <div className="mt-2 text-xs text-gray-700 font-mono">
                {shop.clerk_user_id}
              </div>
            )}
          </div>
          <button
            onClick={handleManageShop}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ backgroundColor: "#ea580c" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#c2410c")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#ea580c")
            }
          >
            <ExternalLink className="w-4 h-4" />
            Manage This Shop
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Calls",
            value: calls.length,
            icon: Phone,
            color: "#3b82f6",
          },
          {
            label: "Appointments Booked",
            value: bookedCalls,
            icon: Calendar,
            color: "#22c55e",
          },
          {
            label: "Conversion Rate",
            value: convRate + "%",
            icon: CheckCircle,
            color: "#a855f7",
          },
          {
            label: "Avg Call Duration",
            value: avgDuration + "m",
            icon: Clock,
            color: "#f59e0b",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5"
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">{s.label}</span>
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: s.color + "22" }}
              >
                <s.icon className="w-3 h-3" style={{ color: s.color }} />
              </div>
            </div>
            <div className="text-xl font-bold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ backgroundColor: "#1a1a1a" }}>
        {(["overview", "settings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all"
            style={{
              backgroundColor:
                activeTab === tab ? "#ea580c" : "transparent",
              color: activeTab === tab ? "#fff" : "#6b7280",
            }}
          >
            {tab === "overview" ? (
              <span className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" /> Calls
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5" /> Settings
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab - Calls List */}
      {activeTab === "overview" && (
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
            <h2 className="font-semibold text-white">
              All Calls ({calls.length})
            </h2>
          </div>
          {calls.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-700">
              No calls yet for this shop.
            </div>
          ) : (
            <div>
              {calls.map((call: any) => (
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
                      {call.appointment_booked && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">
                          Booked
                        </span>
                      )}
                    </div>
                    {call.summary && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {call.summary}
                      </div>
                    )}
                    {call.transcript && (
                      <details className="mt-2">
                        <summary className="text-xs text-orange-400 cursor-pointer hover:text-orange-300">
                          View transcript
                        </summary>
                        <div
                          className="mt-2 p-3 rounded-lg text-xs text-gray-400 whitespace-pre-wrap leading-relaxed"
                          style={{ backgroundColor: "#111111" }}
                        >
                          {call.transcript}
                        </div>
                      </details>
                    )}
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
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-white">Shop Settings</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors"
                style={{ backgroundColor: "#2a2a2a" }}
              >
                Edit Settings
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {saveMsg && (
                  <span
                    className={`text-xs ${
                      saveMsg.includes("Error")
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {saveMsg}
                  </span>
                )}
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
                  style={{ backgroundColor: "#ea580c" }}
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {[
              { key: "name", label: "Shop Name", type: "text" },
              { key: "address", label: "Address", type: "text" },
              { key: "greeting", label: "AI Greeting", type: "textarea" },
              {
                key: "services",
                label: "Services Offered (comma-separated)",
                type: "text",
              },
              {
                key: "declined_services",
                label: "Declined Services (comma-separated)",
                type: "text",
              },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                  {label}
                </label>
                {editing ? (
                  type === "textarea" ? (
                    <textarea
                      value={form[key] || ""}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white bg-transparent border outline-none resize-none focus:border-orange-500 transition-colors"
                      style={{ borderColor: "rgba(255,255,255,0.1)" }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={form[key] || ""}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl text-sm text-white bg-transparent border outline-none focus:border-orange-500 transition-colors"
                      style={{ borderColor: "rgba(255,255,255,0.1)" }}
                    />
                  )
                ) : (
                  <div className="text-sm text-gray-300 px-4 py-3 rounded-xl" style={{ backgroundColor: "#111111" }}>
                    {form[key] || (
                      <span className="text-gray-700 italic">Not set</span>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Read-only fields */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                AI Phone Number
              </label>
              <div className="text-sm text-gray-300 px-4 py-3 rounded-xl font-mono" style={{ backgroundColor: "#111111" }}>
                {shop.phone_number || (
                  <span className="text-gray-700 italic">Not provisioned</span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                Subscription Status
              </label>
              <div className="text-sm text-gray-300 px-4 py-3 rounded-xl" style={{ backgroundColor: "#111111" }}>
                {shop.subscription_status || "inactive"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
