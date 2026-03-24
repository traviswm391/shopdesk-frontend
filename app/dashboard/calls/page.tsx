"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Phone, Calendar, Clock } from "lucide-react";
import { api } from "@/lib/api";

export default function CallsPage() {
  const { getToken } = useAuth();
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      if (!token) return;
      try {
        const data = await api.getCalls(token, 100);
        setCalls(data.calls || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Call Log</h1>
        <p className="text-gray-500 text-sm mt-1">All inbound calls handled by your AI receptionist</p>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : calls.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Phone className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="font-medium text-gray-700 mb-1">No calls yet</h3>
          <p className="text-gray-400 text-sm">Calls will appear here once your AI line is active.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-3 text-gray-500 font-medium">Caller</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Summary</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Duration</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Appt</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {calls.map((call) => (
                <tr
                  key={call.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => window.location.href = `/dashboard/calls/${call.id}`}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {call.caller_number || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                    {call.summary || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {call.duration_seconds ? `${Math.round(call.duration_seconds / 60)}m ${call.duration_seconds % 60}s` : "—"}
                  </td>
                  <td className="px-6 py-4">
                    {call.appointment_booked ? (
                      <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
                        <Calendar className="w-3 h-3" /> Booked
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {call.created_at ? new Date(call.created_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
