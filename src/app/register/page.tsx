"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type TicketType = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  requiresInvite: boolean;
};

export default function RegisterPage() {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [error, setError] = useState("");
  const [typesLoading, setTypesLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    designation: "",
    city: "",
    ticketTypeId: "",
  });

  useEffect(() => {
    fetch("/api/ticket-types")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const open = data.filter((t: TicketType) => !t.requiresInvite);
          setTicketTypes(open.length > 0 ? open : data);
          const defaultType = open[0] || data[0];
          if (defaultType) {
            setForm((f) => ({ ...f, ticketTypeId: defaultType.id }));
          }
        }
      })
      .catch(() => {})
      .finally(() => setTypesLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.fullName.trim() || !form.email.trim()) {
      setError("Full name and email are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }
      setSuccess(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-lg px-4 py-16">
          <div className="rounded-lg border border-green-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-green-800">Registration Successful</h1>
            <p className="mt-3 text-slate-600">
              Thank you for registering. A confirmation email has been sent (if email is configured).
            </p>
            <div className="mt-6 space-y-2 rounded-md bg-slate-50 p-4 text-left text-sm">
              <div>
                <span className="font-medium">Registration ID:</span> {success.registrationId}
              </div>
              <div>
                <span className="font-medium">Ticket Number:</span> {success.ticketNumber}
              </div>
              {success.ticketType && (
                <div>
                  <span className="font-medium">Ticket Type:</span> {success.ticketType}
                </div>
              )}
            </div>
            <Link
              href={success.verifyUrl}
              className="mt-6 inline-block rounded-md bg-teal-700 px-6 py-2 text-sm font-semibold text-white hover:bg-teal-800"
            >
              View Ticket & QR Code
            </Link>
            <div className="mt-4">
              <Link href="/" className="text-sm text-teal-700 hover:underline">
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedType = ticketTypes.find((t) => t.id === form.ticketTypeId);
  const priceLabel = selectedType
    ? `${selectedType.name}${selectedType.price > 0 ? ` – ₹${selectedType.price}` : ""}`
    : "General Attendee Pass – ₹100";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-semibold text-teal-800">
            GreenRise Expo 2027
          </Link>
          <Link href="/" className="text-sm text-slate-600 hover:text-teal-700">
            ← Home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-12">
        <h1 className="text-2xl font-bold text-slate-900">Register for the Expo</h1>
        <p className="mt-2 text-sm text-slate-500">
          {priceLabel}. Fill in your details below.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Full Name *</label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Mobile Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              placeholder="10-digit mobile number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Organization / College
            </label>
            <input
              type="text"
              value={form.organization}
              onChange={(e) => setForm({ ...form, organization: e.target.value })}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Designation / Course
            </label>
            <input
              type="text"
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          {ticketTypes.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-slate-700">Ticket Type *</label>
              <select
                value={form.ticketTypeId}
                onChange={(e) => setForm({ ...form, ticketTypeId: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                {ticketTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                    {t.price > 0 ? ` – ₹${t.price}` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || typesLoading}
            className="w-full rounded-md bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Complete Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}
