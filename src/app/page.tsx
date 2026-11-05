import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";

async function getEvent() {
  try {
    return await prisma.event.findFirst({
      where: { isPublished: true },
      include: {
        speakers: { take: 3, orderBy: { sortOrder: "asc" } },
        sponsors: { take: 4, orderBy: { sortOrder: "asc" } },
      },
    });
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const event = await getEvent();

  const name = event?.name || "GreenRise Expo 2027";
  const tagline = event?.tagline || "Growing Towards Sustainability";
  const theme = event?.theme || "Where Innovation Meets Impact";
  const description =
    event?.description ||
    "A four-day platform for entrepreneurs, start-ups and social enterprises to showcase solutions that address real-world social and environmental challenges.";
  const venue = event?.venueName || "Pune International Exhibition and Convention Centre (PIECC)";
  const startDate = event?.startDate
    ? new Date(event.startDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "23 February 2027";
  const endDate = event?.endDate
    ? new Date(event.endDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "26 February 2027";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="text-lg font-semibold tracking-tight text-teal-800">
            {name}
          </div>
          <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link href="/about" className="hover:text-teal-700">About</Link>
            <Link href="/agenda" className="hover:text-teal-700">Agenda</Link>
            <Link href="/speakers" className="hover:text-teal-700">Speakers</Link>
            <Link href="/sponsors" className="hover:text-teal-700">Sponsors</Link>
            <Link href="/venue" className="hover:text-teal-700">Venue</Link>
            <Link href="/register" className="rounded-md bg-teal-700 px-4 py-2 text-white hover:bg-teal-800">
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero with background image */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1920&q=80"
            alt="Green sustainable landscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900/90 via-teal-800/85 to-emerald-900/90" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-teal-200">
            {tagline}
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            {theme}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-teal-100">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-teal-900 hover:bg-teal-50"
            >
              Register Now
            </Link>
            <Link
              href="/about"
              className="rounded-md border border-teal-400 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-800/50"
            >
              Learn More
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap gap-8 text-sm text-teal-200">
            <div>
              <div className="font-medium text-white">Dates</div>
              <div>{startDate} – {endDate}</div>
            </div>
            <div>
              <div className="font-medium text-white">Venue</div>
              <div>{venue}</div>
            </div>
            <div>
              <div className="font-medium text-white">Location</div>
              <div>Moshi, Pune, Maharashtra</div>
            </div>
          </div>
        </div>
      </section>

      {/* About snippet with image */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80"
              alt="Wind turbines and renewable energy"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">About the Expo</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              GreenRise Expo brings together students, entrepreneurs, investors, corporate professionals,
              NGOs and environmental experts for four days of exhibitions, workshops, pitch sessions and
              meaningful connections. Join us to turn ideas into action.
            </p>
            <Link href="/about" className="mt-4 inline-block text-sm font-medium text-teal-700 hover:underline">
              Read full about →
            </Link>
          </div>
        </div>
      </section>

      {/* Image strip */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-1 md:grid-cols-4">
          <div className="relative aspect-[4/3]">
            <Image
              src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=600&q=80"
              alt="Solar panels"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/3]">
            <Image
              src="https://images.unsplash.com/photo-1532996122723-e8e714c57e2a?auto=format&fit=crop&w=600&q=80"
              alt="Green technology conference"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/3]">
            <Image
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80"
              alt="Sustainable farming"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/3]">
            <Image
              src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80"
              alt="Eco-friendly innovation"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Speakers preview */}
      {event?.speakers && event.speakers.length > 0 && (
        <section className="border-t border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold text-slate-900">Featured Speakers</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {event.speakers.map((s) => (
                <div key={s.id} className="rounded-lg border border-slate-200 p-6">
                  <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold text-xl">
                    {s.name.charAt(0)}
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">{s.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{s.title}</p>
                </div>
              ))}
            </div>
            <Link href="/speakers" className="mt-6 inline-block text-sm font-medium text-teal-700 hover:underline">
              View all speakers →
            </Link>
          </div>
        </section>
      )}

      {/* Sponsors preview */}
      {event?.sponsors && event.sponsors.length > 0 && (
        <section className="border-t border-slate-200 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold text-slate-900">Our Sponsors</h2>
            <div className="mt-8 flex flex-wrap items-center gap-8">
              {event.sponsors.map((s) => (
                <div key={s.id} className="rounded-md border border-slate-200 bg-white px-6 py-4 text-sm font-medium text-slate-700">
                  {s.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden py-20 text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=80"
            alt="Green forest path"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-teal-900/85" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Ready to be part of the change?</h2>
          <p className="mt-3 text-teal-100">Secure your spot. Early registration is encouraged.</p>
          <Link
            href="/register"
            className="mt-6 inline-block rounded-md bg-white px-8 py-3 text-sm font-semibold text-teal-900 hover:bg-teal-50"
          >
            Register Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-6xl px-4 text-sm text-slate-500">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <div>
              <div className="font-semibold text-slate-800">{name}</div>
              <div className="mt-1">{event?.organizerName || "GreenRise Expo Organizing Committee"}</div>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-teal-700">Privacy</Link>
              <Link href="/terms" className="hover:text-teal-700">Terms</Link>
              <Link href="/contact" className="hover:text-teal-700">Contact</Link>
              <Link href="/admin" className="hover:text-teal-700">Admin</Link>
            </div>
          </div>
          <div className="mt-6 text-xs">
            © {new Date().getFullYear()} {name}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
