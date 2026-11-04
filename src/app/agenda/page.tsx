import Link from "next/link";

const days = [
  {
    date: "23 February 2027",
    theme: "Opening & Inspiration",
    activities: "Inauguration, keynote sessions, exhibition launch and networking",
  },
  {
    date: "24 February 2027",
    theme: "Green Innovation",
    activities: "Green technology demonstrations, sustainability workshops and product showcases",
  },
  {
    date: "25 February 2027",
    theme: "Social Impact & Entrepreneurship",
    activities: "Start-up pitch competition, panel discussions and investor networking",
  },
  {
    date: "26 February 2027",
    theme: "Collaboration & Closing",
    activities: "Business meetings, awards, sustainability pledges and closing ceremony",
  },
];

export default function AgendaPage() {
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
        <h1 className="text-3xl font-bold text-slate-900">Event Agenda</h1>
        <p className="mt-3 text-slate-600">
          Four days focused on sustainability, innovation, social impact and entrepreneurship.
          Session timings and speaker appearances will be announced after confirmation.
        </p>

        <div className="mt-10 space-y-4">
          {days.map((d) => (
            <div
              key={d.date}
              className="rounded-lg border border-slate-200 bg-white p-5"
            >
              <div className="text-sm font-medium text-teal-700">{d.date}</div>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">{d.theme}</h2>
              <p className="mt-2 text-sm text-slate-600">{d.activities}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
