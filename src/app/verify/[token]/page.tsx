import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function VerifyPage({
  params,
}: {
  params: { token: string };
}) {
  const ticket = await prisma.ticket.findUnique({
    where: { qrToken: params.token },
    include: {
      registration: {
        include: {
          ticketType: true,
          event: true,
        },
      },
      checkIns: {
        orderBy: { checkedInAt: "desc" },
        take: 1,
      },
    },
  });

  if (!ticket) {
    notFound();
  }

  const reg = ticket.registration;
  const event = reg.event;
  const isCheckedIn = ticket.checkIns.length > 0 || ticket.status === "used";

  // Find SPOC
  const assignment = await prisma.spocAssignment.findFirst({
    where: { ticketTypeId: reg.ticketTypeId },
    include: { spoc: true },
  });
  const spoc = assignment?.spoc;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-center">
            <div className="text-sm font-medium uppercase tracking-wide text-teal-700">
              {event.name}
            </div>
            <h1 className="mt-2 text-xl font-bold text-slate-900">Your Ticket</h1>
          </div>

          {ticket.qrCodeDataUrl && (
            <div className="mt-6 flex justify-center">
              <img
                src={ticket.qrCodeDataUrl}
                alt="Ticket QR Code"
                className="h-48 w-48 rounded border border-slate-200"
              />
            </div>
          )}

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Name</span>
              <span className="font-medium">{reg.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Ticket Type</span>
              <span className="font-medium">{reg.ticketType.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Ticket No.</span>
              <span className="font-medium">{ticket.ticketNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Registration ID</span>
              <span className="font-medium">{reg.registrationId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status</span>
              <span
                className={`font-medium ${
                  ticket.status === "valid"
                    ? "text-green-700"
                    : ticket.status === "used"
                    ? "text-amber-700"
                    : "text-red-700"
                }`}
              >
                {isCheckedIn ? "Checked In" : ticket.status.toUpperCase()}
              </span>
            </div>
          </div>

          {(spoc || event.organizerName) && (
            <div className="mt-6 rounded-md bg-slate-50 p-4 text-sm">
              <div className="font-medium text-slate-800">Your Contact (SPOC)</div>
              <div className="mt-1 text-slate-600">
                {spoc?.name || event.organizerName}
              </div>
              {(spoc?.email || event.organizerEmail) && (
                <div className="text-slate-500">
                  {spoc?.email || event.organizerEmail}
                </div>
              )}
              {(spoc?.phone || event.organizerPhone) && (
                <div className="text-slate-500">
                  {spoc?.phone || event.organizerPhone}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 text-center text-xs text-slate-400">
            Present this QR code at the entrance for check-in.
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-teal-700 hover:underline">
            ← Back to event website
          </Link>
        </div>
      </div>
    </div>
  );
}
