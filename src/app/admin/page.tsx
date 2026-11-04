import { redirect } from "next/navigation";
import { getSession, hasAnyRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  if (!hasAnyRole(session, ["SUPER_ADMIN", "EVENT_MANAGER", "REGISTRATION_MANAGER"])) {
    redirect("/admin/login");
  }

  let stats = {
    totalRegistrations: 0,
    confirmed: 0,
    checkedIn: 0,
    speakers: 0,
    sponsors: 0,
  };

  try {
    const event = await prisma.event.findFirst({ where: { isPublished: true } });
    if (event) {
      const [total, confirmed, checkedIn, speakers, sponsors] = await Promise.all([
        prisma.registration.count({ where: { eventId: event.id } }),
        prisma.registration.count({ where: { eventId: event.id, status: "confirmed" } }),
        prisma.checkIn.count({
          where: { registration: { eventId: event.id } },
        }),
        prisma.speaker.count({ where: { eventId: event.id } }),
        prisma.sponsor.count({ where: { eventId: event.id } }),
      ]);
      stats = { totalRegistrations: total, confirmed, checkedIn, speakers, sponsors };
    }
  } catch {
    // DB may not be ready
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="font-semibold text-slate-900">Event Admin</div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-500">{session.name}</span>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="text-teal-700 hover:underline">
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of your event</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="text-sm text-slate-500">Total Registrations</div>
            <div className="mt-1 text-3xl font-bold text-slate-900">{stats.totalRegistrations}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="text-sm text-slate-500">Confirmed</div>
            <div className="mt-1 text-3xl font-bold text-green-700">{stats.confirmed}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="text-sm text-slate-500">Checked In</div>
            <div className="mt-1 text-3xl font-bold text-teal-700">{stats.checkedIn}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="text-sm text-slate-500">Speakers / Sponsors</div>
            <div className="mt-1 text-3xl font-bold text-slate-900">
              {stats.speakers} / {stats.sponsors}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/registrations"
            className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-300 hover:shadow-sm"
          >
            <div className="font-medium text-slate-900">Registrations</div>
            <div className="mt-1 text-sm text-slate-500">View and manage all registrations</div>
          </Link>
          <Link
            href="/admin/checkin"
            className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-300 hover:shadow-sm"
          >
            <div className="font-medium text-slate-900">QR Check-in</div>
            <div className="mt-1 text-sm text-slate-500">Scan or look up tickets</div>
          </Link>
          <Link
            href="/admin/event"
            className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-300 hover:shadow-sm"
          >
            <div className="font-medium text-slate-900">Event Settings</div>
            <div className="mt-1 text-sm text-slate-500">Name, dates, branding, venue</div>
          </Link>
          <Link
            href="/admin/speakers"
            className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-300 hover:shadow-sm"
          >
            <div className="font-medium text-slate-900">Speakers</div>
            <div className="mt-1 text-sm text-slate-500">Manage speaker profiles</div>
          </Link>
          <Link
            href="/admin/sponsors"
            className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-300 hover:shadow-sm"
          >
            <div className="font-medium text-slate-900">Sponsors</div>
            <div className="mt-1 text-sm text-slate-500">Manage sponsors and tiers</div>
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-300 hover:shadow-sm"
          >
            <div className="font-medium text-slate-900">View Public Site</div>
            <div className="mt-1 text-sm text-slate-500">Open the event website</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
