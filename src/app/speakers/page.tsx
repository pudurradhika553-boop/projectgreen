import Link from "next/link";
import { prisma } from "@/lib/db";

async function getSpeakers() {
  try {
    const event = await prisma.event.findFirst({
      where: { isPublished: true },
      include: {
        speakers: {
          orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
        },
      },
    });
    return { event, speakers: event?.speakers ?? [] };
  } catch {
    return { event: null, speakers: [] };
  }
}

export default async function SpeakersPage() {
  const { event, speakers } = await getSpeakers();
  const eventName = event?.name || "GreenRise Expo 2027";

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
            <Link href="/speakers" className="text-teal-700">
              Speakers
            </Link>
            <Link href="/sponsors" className="hover:text-teal-700">
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Speakers</h1>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Meet the innovators, scientists, entrepreneurs and thought leaders sharing insights on
            sustainability, social impact and green entrepreneurship at {eventName}.
          </p>
        </div>

        {speakers.length === 0 ? (
          <div className="mt-12 rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-500">Speaker lineup will be announced soon.</p>
            <Link
              href="/register"
              className="mt-6 inline-block rounded-md bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Register Now
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {speakers.map((speaker) => (
              <article
                key={speaker.id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-teal-200 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  {speaker.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={speaker.photoUrl}
                      alt={speaker.name}
                      className="h-16 w-16 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xl font-bold text-teal-800">
                      {speaker.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-slate-900">{speaker.name}</h2>
                    {speaker.title && (
                      <p className="mt-0.5 text-sm text-teal-700">{speaker.title}</p>
                    )}
                    {speaker.company && (
                      <p className="mt-0.5 text-sm text-slate-500">{speaker.company}</p>
                    )}
                  </div>
                </div>

                {speaker.bio && (
                  <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-slate-600">
                    {speaker.bio}
                  </p>
                )}

                {(speaker.linkedinUrl || speaker.twitterUrl) && (
                  <div className="mt-4 flex gap-3 border-t border-slate-100 pt-4">
                    {speaker.linkedinUrl && (
                      <a
                        href={speaker.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-slate-500 hover:text-teal-700"
                      >
                        LinkedIn
                      </a>
                    )}
                    {speaker.twitterUrl && (
                      <a
                        href={speaker.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-slate-500 hover:text-teal-700"
                      >
                        X / Twitter
                      </a>
                    )}
                  </div>
                )}

                {speaker.isFeatured && (
                  <span className="mt-4 inline-flex w-fit items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-800">
                    Featured
                  </span>
                )}
              </article>
            ))}
          </div>
        )}

        <div className="mt-16 rounded-xl bg-teal-900 px-6 py-10 text-center text-white">
          <h2 className="text-xl font-semibold">Want to join the conversation?</h2>
          <p className="mt-2 text-teal-100">
            Register for {eventName} and meet these speakers in person.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-block rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-teal-900 hover:bg-teal-50"
          >
            Register Now
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
