"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { Phone, LayoutDashboard, Settings, CreditCard, ShieldCheck } from "lucide-react";
import { clsx } from "clsx";

const ADMIN_USER_ID = "user_3BQ84qxBvEBwI5E5WaVkwKBDVYY";

const baseNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/calls", label: "Calls", icon: Phone },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();

  const nav = user?.id === ADMIN_USER_ID
    ? [...baseNav, { href: "/dashboard/admin", label: "Admin", icon: ShieldCheck }]
    : baseNav;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col" style={{ backgroundColor: "#111111" }}>
        <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#f97316" }}>
            <Phone className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white">ShopDesk AI</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition",
                pathname === href
                  ? "text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
              style={pathname === href ? { backgroundColor: "#ea580c" } : {}}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <span className="text-sm text-gray-400">Account</span>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
