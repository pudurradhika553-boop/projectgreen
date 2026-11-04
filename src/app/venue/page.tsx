import Link from "next/link";

export default function VenuePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-semibold text-teal-800">
            GreenRise Expo 2027
          </Link>
          <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link href="/about" className="hover:text-teal-700">About</Link>
            <Link href="/agenda" className="hover:text-teal-700">Agenda</Link>
            <Link href="/venue" className="text-teal-700">Venue</Link>
            <Link href="/register" className="rounded-md bg-teal-700 px-4 py-2 text-white hover:bg-teal-800">
              Register
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900">Venue & Location</h1>
        <p className="mt-2 text-slate-500">Where Innovation Meets Impact</p>

        <div className="mt-10 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Pune International Exhibition and Convention Centre (PIECC)
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Moshi, Pune, Maharashtra
          </p>
          <p className="mt-2 text-slate-600 leading-relaxed">
            Pune International Exhibition and Convention Centre (PIECC), Moshi, Pune, Maharashtra
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-md bg-slate-50 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Dates</div>
              <div className="mt-1 font-medium text-slate-900">23 – 26 February 2027</div>
            </div>
            <div className="rounded-md bg-slate-50 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Timings</div>
              <div className="mt-1 font-medium text-slate-900">10:00 AM – 6:00 PM</div>
            </div>
          </div>

          <div className="mt-6">
            <a
              href="https://share.google/RC5tX2Z6rmO4yh660"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Open in Google Maps
            </a>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-slate-900">Getting there</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
            <li>Located in Moshi, on the northern side of Pune.</li>
            <li>Accessible by road from Pune city and the airport.</li>
            <li>Parking is available at the venue complex.</li>
          </ul>
        </div>

        <div className="mt-8">
          <Link
            href="/register"
            className="inline-block rounded-md bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Register for the Expo
          </Link>
        </div>
      </main>

      <footer className="mt-16 border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} GreenRise Expo 2027
        </div>
      </footer>
    </div>
  );
}
