import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const event = await prisma.event.findFirst({ where: { isPublished: true } });
    if (!event) {
      return NextResponse.json([]);
    }

    const types = await prisma.ticketType.findMany({
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
