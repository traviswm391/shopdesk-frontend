"use client";

import Link from "next/link";
import { Phone, Clock, MessageSquare, BarChart2, CheckCircle, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#111111", color: "#ffffff" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#ea580c" }}>
            <Phone className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl text-white">ShopDesk AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-gray-400 hover:text-white font-medium transition">
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="text-white px-5 py-2.5 rounded-lg font-medium transition"
            style={{ backgroundColor: "#ea580c" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#c2410c")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#ea580c")}
          >
            Start Free Trial
          </Link>
        </div>
      </nav>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-8 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: "rgba(234,88,12,0.15)", color: "#fb923c" }}>
          <Star className="w-3.5 h-3.5" style={{ fill: "#fb923c" }} />
          Built specifically for independent mechanic shops
        </div>
        <h1 className="text-5xl font-bold text-white leading-tight mb-6">
          Your shop answers every call.<br />
          <span style={{ color: "#ea580c" }}>Even when you can&apos;t.</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          ShopDesk AI picks up every call, collects customer info, books appointments, and sends SMS confirmations — automatically. 24 hours a day, 7 days a week.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/sign-up"
            className="text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
            style={{ backgroundColor: "#ea580c", boxShadow: "0 8px 30px rgba(234,88,12,0.35)" }}
          >
            Get Started — $299/month
          </Link>
          <p className="text-gray-500 text-sm">No contracts. Cancel anytime.</p>
        </div>
      </section>
      {/* Features */}
      <section className="py-20" style={{ backgroundColor: "#1e1e1e" }}>
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Everything your front desk does, automated
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Phone, title: "Answers Every Call", desc: "Your AI receptionist picks up immediately, day or night. No more missed calls or voicemail." },
              { icon: Clock, title: "Books Appointments", desc: "Collects name, vehicle info, service needed, and preferred time — all in one call." },
              { icon: MessageSquare, title: "Sends SMS Confirmations", desc: "Customers automatically receive a text confirmation after every booked appointment." },
              { icon: BarChart2, title: "Call Dashboard", desc: "See every call, transcript, and appointment from one clean dashboard." }
            ].map((f) => (
              <div key={f.title} className="rounded-2xl p-6" style={{ backgroundColor: "#2a2a2a", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(234,88,12,0.2)" }}>
                  <f.icon className="w-5 h-5" style={{ color: "#ea580c" }} />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-md mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Simple, flat pricing</h2>
          <p className="text-gray-400 mb-10">One price. Unlimited calls. No surprises.</p>
          <div className="rounded-2xl p-8" style={{ backgroundColor: "#1e1e1e", border: "2px solid #ea580c", boxShadow: "0 20px 60px rgba(234,88,12,0.2)" }}>
            <div className="text-5xl font-bold text-white mb-1">$299</div>
            <div className="text-gray-400 mb-6">per month</div>
            <ul className="text-left space-y-3 mb-8">
              {[
                "Dedicated AI phone number",
                "Unlimited inbound calls",
                "Automatic appointment booking",
                "SMS confirmations to customers",
                "Full call transcripts & recordings",
                "Real-time dashboard",
                "Customizable shop greeting & hours",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 shrink-0" style={{ color: "#ea580c" }} />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/sign-up"
              className="block w-full text-white py-4 rounded-xl font-semibold text-lg transition text-center"
              style={{ backgroundColor: "#ea580c" }}
            >
              Start Free Trial
            </Link>
            <p className="text-gray-500 text-xs mt-3">No contracts. Cancel anytime.</p>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        © {new Date().getFullYear()} ShopDesk AI. All rights reserved.
      </footer>
    </div>
  );
}
