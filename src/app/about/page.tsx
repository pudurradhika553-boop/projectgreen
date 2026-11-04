import Link from "next/link";

export default function AboutPage() {
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

      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900">About the Event</h1>
        <div className="mt-6 space-y-4 text-slate-600 leading-relaxed">
          <p>
            GreenRise Expo 2027 is a four-day exhibition on social impact, sustainability and
            entrepreneurship, taking place from 23rd to 26th February 2027 at the Pune International
            Exhibition and Convention Centre (PIECC), Moshi, Pune, Maharashtra.
          </p>
          <p>
            The event aims to bring together college students, young entrepreneurs, start-up founders,
            professionals and organisations to showcase innovative ventures that address social and
            environmental challenges. It will feature sustainable products, green technologies, social
            enterprises, expert talks, interactive workshops, networking opportunities and start-up
            showcases.
          </p>
          <p>
            With the theme “Where Innovation Meets Impact,” the expo encourages responsible
            entrepreneurship, environmental awareness and positive social change.
          </p>
        </div>
        <Link
          href="/register"
          className="mt-8 inline-block rounded-md bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
        >
          Register Now
        </Link>
      </main>
    </div>
  );
}
