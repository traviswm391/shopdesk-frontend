"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LayoutDashboard, Building2, ArrowLeft, Shield, Lock } from "lucide-react";

const ADMIN_USER_ID = "user_3BQ84qxBvEBwI5E5WaVkwKBDVYY";
const SESSION_KEY = "admin_unlocked";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setUnlocked(true);
    }
    setChecking(false);
  }, []);

  if (!isLoaded || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#111111" }}>
        <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isLoaded && user?.id !== ADMIN_USER_ID) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#111111" }}>
        <div className="text-center">
          <Shield className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">Access denied.</p>
          <p className="text-gray-600 text-sm mt-1">This area is restricted to administrators.</p>
        </div>
      </div>
    );
  }

  if (!unlocked) {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin-auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        if (res.ok) {
          sessionStorage.setItem(SESSION_KEY, "1");
          setUnlocked(true);
        } else {
          const data = await res.json();
          setError(data.error || "Incorrect password");
          setPassword("");
        }
      } catch {
        setError("Connection error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#111111" }}>
        <div
          className="w-full max-w-sm mx-4 rounded-2xl p-8"
          style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="text-center mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "rgba(234,88,12,0.15)" }}
            >
              <Lock className="w-6 h-6" style={{ color: "#ea580c" }} />
            </div>
            <h1 className="text-white font-semibold text-lg">Admin Access</h1>
            <p className="text-gray-500 text-sm mt-1">Enter your admin password to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600 outline-none"
              style={{
                backgroundColor: "#111111",
                border: error ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
              }}
            />
            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-opacity disabled:opacity-50"
              style={{ backgroundColor: "#ea580c" }}
            >
              {loading ? "Verifying..." : "Unlock"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const nav = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/shops", label: "Shops", icon: Building2 },
  ];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#0d0d0d" }}>
      {/* Sidebar */}
      <aside
        className="w-56 shrink-0 flex flex-col"
        style={{ backgroundColor: "#111111", borderRight: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Logo */}
        <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#ea580c" }}
            >
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm leading-none">Admin</div>
              <div className="text-gray-600 text-xs mt-0.5">ShopDesk AI</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  backgroundColor: active ? "rgba(234,88,12,0.15)" : "transparent",
                  color: active ? "#fb923c" : "#6b7280",
                }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button
            onClick={() => {
              sessionStorage.removeItem(SESSION_KEY);
              setUnlocked(false);
              setPassword("");
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-400 transition-colors w-full mb-1"
          >
            <Lock className="w-4 h-4" />
            Lock Admin
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
