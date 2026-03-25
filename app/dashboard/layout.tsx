"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Phone,
  LayoutDashboard,
  Settings,
  CreditCard,
  Shield,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const ADMIN_USER_ID = "user_3BQ84qxBvEBwI5E5WaVkwKBDVYY";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const [impersonatingShopName, setImpersonatingShopName] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (user?.id === ADMIN_USER_ID) {
      const name = localStorage.getItem("admin_impersonating_shop_name");
      const id = localStorage.getItem("admin_impersonating_shop_id");
      if (name && id) {
        setImpersonatingShopName(name);
      }
    }
  }, [user]);

  function exitImpersonation() {
    localStorage.removeItem("admin_impersonating_shop_id");
    localStorage.removeItem("admin_impersonating_shop_name");
    setImpersonatingShopName(null);
    router.push("/admin");
  }

  const nav = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
    { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  ];

  const isAdmin = user?.id === ADMIN_USER_ID;

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#111111" }}>
      {/* Admin impersonation banner */}
      {impersonatingShopName && (
        <div
          className="flex items-center justify-between px-6 py-2.5"
          style={{
            backgroundColor: "#ea580c",
            borderBottom: "1px solid rgba(0,0,0,0.2)",
          }}
        >
          <div className="flex items-center gap-2 text-white text-sm font-medium">
            <Shield className="w-4 h-4" />
            Admin Mode — Managing:{" "}
            <span className="font-bold">{impersonatingShopName}</span>
          </div>
          <button
            onClick={exitImpersonation}
            className="flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-medium transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Exit Admin Mode
          </button>
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className="w-56 shrink-0 flex flex-col"
          style={{
            backgroundColor: "#111111",
            borderRight: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Logo */}
          <div
            className="px-5 py-5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#ea580c" }}
              >
                <Phone className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-sm">ShopDesk AI</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {nav.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    backgroundColor: active
                      ? "rgba(234,88,12,0.15)"
                      : "transparent",
                    color: active ? "#fb923c" : "#9ca3af",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mt-4"
                style={{
                  backgroundColor: pathname.startsWith("/admin")
                    ? "rgba(234,88,12,0.15)"
                    : "transparent",
                  color: pathname.startsWith("/admin") ? "#fb923c" : "#6b7280",
                }}
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
