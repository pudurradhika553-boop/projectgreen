import Link from "next/link";
import { prisma } from "@/lib/db";

async function getSponsors() {
  try {
    const event = await prisma.event.findFirst({
      where: { isPublished: true },
      include: {
        sponsors: {
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        },
      },
    });
    return { event, sponsors: event?.sponsors ?? [] };
  } catch {
    return { event: null, sponsors: [] };
  }
}

const tierOrder: Record<string, number> = {
  Title: 0,
  Platinum: 1,
  Gold: 2,
  Silver: 3,
  Bronze: 4,
  Partner: 5,
};

function groupByTier(sponsors: { id: string; name: string; logoUrl: string | null; websiteUrl: string | null; tier: string | null; description: string | null; sortOrder: number }[]) {
  const groups: Record<string, typeof sponsors> = {};
  for (const s of sponsors) {
    const tier = s.tier || "Partner";
    if (!groups[tier]) groups[tier] = [];
    groups[tier].push(s);
  }
  return Object.entries(groups).sort(
    ([a], [b]) => (tierOrder[a] ?? 99) - (tierOrder[b] ?? 99)
  );
}

export default async function SponsorsPage() {
  const { event, sponsors } = await getSponsors();
  const eventName = event?.name || "GreenRise Expo 2027";
  const grouped = groupByTier(sponsors);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-semibold text-teal-800">
            {eventName}
          </Link>
          <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link href="/about" className="hover:text-teal-700">
              About
            </Link>
            <Link href="/agenda" className="hover:text-teal-700">
              Agenda
            </Link>
            <Link href="/speakers" className="hover:text-teal-700">
              Speakers
            </Link>
            <Link href="/sponsors" className="text-teal-700">
              Sponsors
            </Link>
            <Link href="/venue" className="hover:text-teal-700">
              Venue
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-teal-700 px-4 py-2 text-white hover:bg-teal-800"
            >
              Register
            </Link>
          </nav>
          <Link href="/" className="text-sm text-slate-600 hover:text-teal-700 md:hidden">
            ← Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sponsors & Partners</h1>
          <p className="mt-3 text-slate-600 leading-relaxed">
            We are grateful to the organisations supporting {eventName} and helping us grow a more
            sustainable future together.
          </p>
        </div>

        {sponsors.length === 0 ? (
          <div className="mt-12 rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-500">Sponsor announcements coming soon.</p>
            <Link
              href="/register"
              className="mt-6 inline-block rounded-md bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Register Now
            </Link>
          </div>
        ) : (
          <div className="mt-12 space-y-14">
            {grouped.map(([tier, items]) => (
              <section key={tier}>
                <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-teal-700">
                  {tier} {items.length > 1 ? "Sponsors" : "Sponsor"}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((sponsor) => {
                    const Card = (
                      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:border-teal-200 hover:shadow-md">
                        {sponsor.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={sponsor.logoUrl}
                            alt={sponsor.name}
                            className="mb-4 h-16 max-w-full object-contain"
                          />
                        ) : (
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-xl font-bold text-teal-800">
                            {sponsor.name.charAt(0)}
                          </div>
                        )}
                        <h3 className="font-semibold text-slate-900">{sponsor.name}</h3>
                        {sponsor.description && (
                          <p className="mt-2 text-sm text-slate-500 line-clamp-3">
                            {sponsor.description}
                          </p>
                        )}
                      </div>
                    );

                    return sponsor.websiteUrl ? (
                      <a
                        key={sponsor.id}
                        href={sponsor.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full"
                      >
                        {Card}
                      </a>
                    ) : (
                      <div key={sponsor.id} className="h-full">
                        {Card}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        <div className="mt-16 rounded-xl bg-teal-900 px-6 py-10 text-center text-white">
          <h2 className="text-xl font-semibold">Interested in sponsoring?</h2>
          <p className="mt-2 text-teal-100">
            Partner with us to support sustainability and social impact at {eventName}.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-block rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-teal-900 hover:bg-teal-50"
          >
            Get in Touch
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500">
          <Link href="/" className="hover:text-teal-700">
            ← Back to Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
