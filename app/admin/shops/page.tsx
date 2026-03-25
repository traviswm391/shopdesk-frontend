"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Building2, Search, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function AdminShopsPage() {
  const { getToken } = useAuth();
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const token = await getToken();
      if (!token) return;
      try {
        const data = await api.adminShops(token);
        setShops(data.shops || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  const filtered = shops.filter(
    (s) =>
      !search ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.phone_number?.includes(search)
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">All Shops</h1>
        <p className="text-gray-600 text-sm">{shops.length} total shops</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white bg-transparent border outline-none focus:border-orange-500 transition-colors"
          style={{
            backgroundColor: "#1a1a1a",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-600">Loading shops...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-700">No shops found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((shop: any) => (
            <Link
              key={shop.id}
              href={`/admin/shops/${shop.id}`}
              className="flex items-center justify-between p-5 rounded-2xl transition-all group"
              style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(234,88,12,0.15)" }}
                >
                  <Building2 className="w-5 h-5" style={{ color: "#ea580c" }} />
                </div>
                <div>
                  <div className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                    {shop.name}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5 flex items-center gap-3">
                    <span>{shop.phone_number || "No AI number"}</span>
                    <span>{shop.call_count ?? 0} calls</span>
                    <span>Joined {new Date(shop.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
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
                <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-orange-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
