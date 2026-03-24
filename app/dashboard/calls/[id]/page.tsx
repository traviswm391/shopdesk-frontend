"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Car, Wrench } from "lucide-react";
import { api } from "@/lib/api";

export default function CallDetailPage() {
  const { getToken } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [call, setCall] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      if (!token) return;
      try {
        const data = await api.getCall(token, id);
        setCall(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken, id]);

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;
  if (!call) return <div className="p-8 text-gray-400">Call not found.</div>;

  const appt = call.appointment_details;

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/dashboard/calls" className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to calls
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{call.caller_number || "Unknown caller"}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {call.created_at ? new Date(call.created_at).toLocaleString() : ""}
            {call.duration_seconds ? ` · ${Math.round(call.duration_seconds / 60)}m ${call.duration_seconds % 60}s` : ""}
          </p>
        </div>
        {call.appointment_booked && (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Appointment Booked
          </span>
        )}
      </div>

      {/* Summary */}
      {call.summary && (
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-gray-700 mb-1 text-sm">Summary</h2>
          <p className="text-gray-700">{call.summary}</p>
        </div>
      )}

      {/* Appointment Details */}
      {appt && call.appointment_booked && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Appointment Details</h2>
          <div className="grid grid-cols-2 gap-4">
            {appt.customer_name && (
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400">Customer</div>
                  <div className="font-medium text-gray-800">{appt.customer_name}</div>
                </div>
              </div>
            )}
            {appt.vehicle_info && (
              <div className="flex items-start gap-2">
                <Car className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400">Vehicle</div>
                  <div className="font-medium text-gray-800">{appt.vehicle_info}</div>
                </div>
              </div>
            )}
            {appt.service_requested && (
              <div className="flex items-start gap-2">
                <Wrench className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400">Service</div>
                  <div className="font-medium text-gray-800">{appt.service_requested}</div>
                </div>
              </div>
            )}
            {(appt.preferred_date || appt.preferred_time) && (
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400">Preferred Time</div>
                  <div className="font-medium text-gray-800">
                    {[appt.preferred_date, appt.preferred_time].filter(Boolean).join(" at ")}
                  </div>
                </div>
              </div>
            )}
          </div>
          {appt.notes && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-400 mb-1">Notes</div>
              <p className="text-gray-700 text-sm">{appt.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Transcript */}
      {call.transcript && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Full Transcript</h2>
          <div className="space-y-3 text-sm">
            {call.transcript.split("\n").filter(Boolean).map((line: string, i: number) => {
              const isAgent = line.startsWith("Agent:");
              return (
                <div key={i} className={`flex gap-3 ${isAgent ? "" : "flex-row-reverse"}`}>
                  <div className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isAgent
                      ? "bg-gray-100 text-gray-800 rounded-tl-sm"
                      : "bg-blue-600 text-white rounded-tr-sm"
                  }`}>
                    {line.replace(/^(Agent:|User:)\s*/, "")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
