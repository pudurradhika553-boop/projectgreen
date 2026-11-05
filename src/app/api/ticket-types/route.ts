import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    let event = await prisma.event.findFirst({ where: { isPublished: true } });
    if (!event) {
      try {
        event = await prisma.event.create({
          data: {
            name: "GreenRise Expo 2027",
            tagline: "Growing Towards Sustainability",
            theme: "Where Innovation Meets Impact",
            startDate: new Date("2027-02-23T00:00:00+05:30"),
            endDate: new Date("2027-02-26T23:59:59+05:30"),
            venueName: "Pune International Exhibition and Convention Centre (PIECC)",
            organizerName: "GreenRise Expo Organizing Committee",
            primaryColor: "#0f766e",
            isPublished: true,
          },
        });
      } catch {
        return NextResponse.json([]);
      }
    }

    let types = await prisma.ticketType.findMany({
      where: { eventId: event.id, isOpen: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        currency: true,
        requiresInvite: true,
      },
    });

    // If no ticket types exist (seed not run), create a default one so registration works
    if (types.length === 0) {
      const created = await prisma.ticketType.create({
        data: {
          eventId: event.id,
          name: "General Attendee Pass",
          description:
            "Access to all exhibition areas, talks and networking sessions.",
          price: 100,
          currency: "INR",
          isOpen: true,
          requiresInvite: false,
          sortOrder: 1,
        },
      });
      types = [
        {
          id: created.id,
          name: created.name,
          description: created.description,
          price: created.price,
          currency: created.currency,
          requiresInvite: created.requiresInvite,
        },
      ];
    }

    return NextResponse.json(
      types.map((t) => ({
        ...t,
        price: Number(t.price),
      }))
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 500 });
  }
}
