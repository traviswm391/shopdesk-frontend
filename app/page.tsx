import Link from "next/link";
import { Phone, Clock, MessageSquare, BarChart2, CheckCircle, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Phone className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900">ShopDesk AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-gray-600 hover:text-gray-900 font-medium">
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-8 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Star className="w-3.5 h-3.5 fill-blue-700" />
          Built specifically for independent mechanic shops
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Your shop answers every call.<br />
          <span className="text-blue-600">Even when you can&apos;t.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          ShopDesk AI picks up every call, collects customer info, books appointments,
          and sends SMS confirmations — automatically. 24 hours a day, 7 days a week.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Get Started — $299/month
          </Link>
          <p className="text-gray-400 text-sm">No contracts. Cancel anytime.</p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything your front desk does, automated
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Phone,
                title: "Answers Every Call",
                desc: "Your AI receptionist picks up immediately, day or night. No more missed calls or voicemail."
              },
              {
                icon: Clock,
                title: "Books Appointments",
                desc: "Collects name, vehicle info, service needed, and preferred time — all in one call."
              },
              {
                icon: MessageSquare,
                title: "Sends SMS Confirmations",
                desc: "Customers automatically receive a text confirmation after every booked appointment."
              },
              {
                icon: BarChart2,
                title: "Call Dashboard",
                desc: "See every call, transcript, and appointment from one clean dashboard."
              }
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-md mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, flat pricing</h2>
          <p className="text-gray-500 mb-10">One price. Unlimited calls. No surprises.</p>
          <div className="bg-white border-2 border-blue-600 rounded-2xl p-8 shadow-xl shadow-blue-100">
            <div className="text-5xl font-bold text-gray-900 mb-1">$299</div>
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
                <li key={item} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/sign-up"
              className="block w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition text-center"
            >
              Start Free Trial
            </Link>
            <p className="text-gray-400 text-xs mt-3">No contracts. Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} ShopDesk AI. All rights reserved.
      </footer>
    </div>
  );
}
