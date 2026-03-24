"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { CreditCard, CheckCircle, AlertCircle, ExternalLink, Zap } from "lucide-react";
import { api } from "@/lib/api";

export default function BillingPage() {
  const { getToken } = useAuth();
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      if (!token) return;
      try {
        const data = await api.getShop(token);
        setShop(data);
      } catch {
        // No shop yet
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  async function handleSubscribe() {
    const token = await getToken();
    if (!token) return;
    setCheckoutLoading(true);
    try {
      const { url } = await api.createCheckout(token);
      window.location.href = url;
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function handleManageBilling() {
    const token = await getToken();
    if (!token) return;
    setPortalLoading(true);
    try {
      const { url } = await api.getBillingPortal(token);
      window.location.href = url;
    } finally {
      setPortalLoading(false);
    }
  }

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;

  const isActive = shop?.subscription_status === "active";

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your ShopDesk AI subscription</p>
      </div>

      {/* Status Banner */}
      <div className={`rounded-xl p-4 mb-6 flex items-center gap-3 ${
        isActive
          ? "bg-green-50 border border-green-100"
          : "bg-yellow-50 border border-yellow-100"
      }`}>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
          isActive ? "bg-green-600" : "bg-yellow-500"
        }`}>
          {isActive
            ? <CheckCircle className="w-4 h-4 text-white" />
            : <AlertCircle className="w-4 h-4 text-white" />
          }
        </div>
        <div>
          <div className={`text-xs font-medium ${isActive ? "text-green-700" : "text-yellow-700"}`}>
            {isActive ? "Subscription Active" : "No Active Subscription"}
          </div>
          <div className="text-sm text-gray-700">
            {isActive
              ? "Your AI receptionist is live and answering calls."
              : "Subscribe to activate your AI phone line."}
          </div>
        </div>
      </div>

      {/* Plan Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-900 text-lg">ShopDesk AI</h2>
            <p className="text-gray-500 text-sm">Monthly Plan</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">$299</div>
            <div className="text-sm text-gray-400">/month</div>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          {[
            "Dedicated AI phone line",
            "Unlimited inbound calls",
            "Automatic appointment booking",
            "SMS confirmations to customers",
            "Full call transcripts & summaries",
            "Business hours management",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              {feature}
            </div>
          ))}
        </div>

        {!shop ? (
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
            Please <a href="/dashboard/settings" className="text-blue-600 hover:underline">set up your shop</a> first before subscribing.
          </div>
        ) : isActive ? (
          <button
            onClick={handleManageBilling}
            disabled={portalLoading}
            className="flex items-center gap-2 w-full justify-center border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-60"
          >
            <ExternalLink className="w-4 h-4" />
            {portalLoading ? "Loading..." : "Manage Subscription"}
          </button>
        ) : (
          <button
            onClick={handleSubscribe}
            disabled={checkoutLoading}
            className="flex items-center gap-2 w-full justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            <Zap className="w-4 h-4" />
            {checkoutLoading ? "Loading..." : "Subscribe Now â $299/mo"}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
        <div className="flex items-start gap-2">
          <CreditCard className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <p>
            Payments are processed securely by Stripe. You can cancel or update your subscription at any time through the billing portal. Your AI phone number is provisioned automatically upon subscription activation.
          </p>
        </div>
      </div>
    </div>
  );
}
