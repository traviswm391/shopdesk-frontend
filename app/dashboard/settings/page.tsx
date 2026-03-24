"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Save, Phone } from "lucide-react";
import { api } from "@/lib/api";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const DEFAULT_HOURS = Object.fromEntries(
  DAYS.map((d, i) => [d, { open: "08:00", close: "17:00", closed: i === 6 }])
);

export default function SettingsPage() {
  const { getToken } = useAuth();
  const [shop, setShop] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone_display: "",
    greeting: "",
    services: "",
    business_hours: DEFAULT_HOURS,
  });

  useEffect(() => {
    async function load() {
      const token = await getToken();
      if (!token) return;
      try {
        const data = await api.getShop(token);
        setShop(data);
        setForm({
          name: data.name || "",
          address: data.address || "",
          phone_display: data.phone_display || "",
          greeting: data.greeting || "",
          services: (data.services || []).join(", "),
          business_hours: data.business_hours || DEFAULT_HOURS,
        });
      } catch {
        // New user, no shop yet
      }
    }
    load();
  }, [getToken]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const token = await getToken();
    if (!token) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        address: form.address || undefined,
        phone_display: form.phone_display || undefined,
        greeting: form.greeting || undefined,
        services: form.services.split(",").map(s => s.trim()).filter(Boolean),
        business_hours: form.business_hours,
      };
      if (shop) {
        await api.updateShop(token, payload);
      } else {
        const newShop = await api.createShop(token, payload);
        setShop(newShop);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  function updateHours(day: string, field: string, value: string | boolean) {
    setForm(f => ({
      ...f,
      business_hours: {
        ...f.business_hours,
        [day]: { ...f.business_hours[day], [field]: value }
      }
    }));
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shop Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your AI receptionist</p>
      </div>

      {shop?.phone_number && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs text-blue-600 font-medium">Your AI Phone Number</div>
            <div className="font-bold text-gray-900">{shop.phone_number}</div>
            <div className="text-xs text-gray-400">Forward or advertise this number for AI to answer</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Basic Info</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
            <input
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Mike's Auto Repair"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 Main St, City, State"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Public Phone (optional)</label>
            <input
              value={form.phone_display}
              onChange={e => setForm(f => ({ ...f, phone_display: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">AI Receptionist</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opening Greeting</label>
            <input
              value={form.greeting}
              onChange={e => setForm(f => ({ ...f, greeting: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Thank you for calling Mike's Auto Repair, how can I help you today?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Services Offered (comma separated)</label>
            <input
              value={form.services}
              onChange={e => setForm(f => ({ ...f, services: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Oil change, brake service, tire rotation, diagnostics, transmission"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Business Hours</h2>
          <div className="space-y-3">
            {DAYS.map(day => {
              const h = form.business_hours[day] || { open: "08:00", close: "17:00", closed: false };
              return (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-600 capitalize">{day.slice(0, 3)}</div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!h.closed}
                      onChange={e => updateHours(day, "closed", !e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-xs text-gray-500">Open</span>
                  </label>
                  {!h.closed && (
                    <>
                      <input
                        type="time"
                        value={h.open}
                        onChange={e => updateHours(day, "open", e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-400 text-sm">to</span>
                      <input
                        type="time"
                        value={h.close}
                        onChange={e => updateHours(day, "close", e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </>
                  )}
                  {h.closed && <span className="text-sm text-gray-400">Closed</span>}
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
