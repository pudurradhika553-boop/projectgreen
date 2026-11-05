import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const event = await prisma.event.findFirst({ where: { isPublished: true } });
    if (!event) {
      return NextResponse.json([]);
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
