import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";

export async function POST(req: NextRequest) {
  try {
    // Ensure core tables exist by attempting a lightweight query.
    let existingUsers = 0;
    try {
      existingUsers = await prisma.user.count();
    } catch (e: any) {
      return NextResponse.json(
        {
          error:
            "Database tables are missing. Redeploy the project on Vercel (the build now runs prisma db push automatically), then try /setup again.",
          detail: e?.message,
        },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { name, email, password } = body || {};

    // If users already exist we still allow creating the missing Event + TicketType + Speakers
    if (existingUsers > 0) {
      const result = await ensureEventTicketAndSpeakers(email);
      if (result.created) {
        return NextResponse.json({
          success: true,
          message: "Event, ticket type and speakers created successfully. You can now register attendees.",
          eventId: result.eventId,
        });
      }
      return NextResponse.json(
        { error: "Setup already completed. Users and event already exist. Go to /admin/login to sign in." },
        { status: 403 }
      );
    }

    // Normal first-time setup: create Super Admin + Event
    if (!name || !email || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Name, email and password (min 8 chars) are required." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Ensure SUPER_ADMIN role exists
    let role = await prisma.role.findUnique({ where: { name: "SUPER_ADMIN" } });
    if (!role) {
      role = await prisma.role.create({
        data: { name: "SUPER_ADMIN", description: "Full system access" },
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        roles: {
          create: { roleId: role.id },
        },
      },
    });

    const result = await ensureEventTicketAndSpeakers(email);

    return NextResponse.json({
      success: true,
      message: "Super Admin created successfully. Event, ticket type and speakers are ready.",
      userId: user.id,
      eventId: result.eventId,
    });
  } catch (err: any) {
    console.error("Setup error:", err);
    return NextResponse.json(
      { error: err.message || "Setup failed" },
      { status: 500 }
    );
  }
}

async function ensureEventTicketAndSpeakers(organizerEmail?: string) {
  let event = await prisma.event.findFirst();
  let created = false;

  if (!event) {
    event = await prisma.event.create({
      data: {
        name: "GreenRise Expo 2027",
        tagline: "Growing Towards Sustainability",
        description:
          "A four-day platform for entrepreneurs, start-ups and social enterprises to showcase solutions that address real-world social and environmental challenges.",
        category: "Sustainability & Social Impact",
        theme: "Where Innovation Meets Impact",
        startDate: new Date("2027-02-23T00:00:00+05:30"),
        endDate: new Date("2027-02-26T23:59:59+05:30"),
        startTime: "10:00 AM",
        endTime: "6:00 PM",
        venueName: "Pune International Exhibition and Convention Centre (PIECC)",
        venueAddress:
          "Pune International Exhibition and Convention Centre (PIECC), Moshi, Pune, Maharashtra",
        organizerName: "GreenRise Expo Organizing Committee",
        organizerEmail: organizerEmail ? organizerEmail.toLowerCase().trim() : "",
        organizerPhone: "",
        primaryColor: "#0f766e",
        secondaryColor: "#134e4a",
        backgroundColor: "#f8fafc",
        textColor: "#0f172a",
        isPublished: true,
      },
    });
    created = true;
  } else if (!event.isPublished) {
    event = await prisma.event.update({
      where: { id: event.id },
      data: { isPublished: true },
    });
    created = true;
  }

  // Default ticket type
  const existingTicket = await prisma.ticketType.findFirst({
    where: { eventId: event.id, isOpen: true },
  });

  if (!existingTicket) {
    await prisma.ticketType.create({
      data: {
        eventId: event.id,
        name: "General Attendee Pass",
        description: "Access to all exhibition areas, talks and networking sessions.",
        price: 100,
        currency: "INR",
        isOpen: true,
        requiresInvite: false,
        sortOrder: 1,
      },
    });
    created = true;
  }

  // Announced speakers
  const speakers = [
    {
      name: "Dr. Raghunath Mashelkar",
      title: "Renowned Scientist & Innovation Leader",
      sortOrder: 1,
      isFeatured: true,
    },
    {
      name: "Anand Chordia",
      title: "Entrepreneur & Industry Leader",
      sortOrder: 2,
      isFeatured: true,
    },
    {
      name: "Ravi Pandit",
      title: "Technology & Business Leader",
      sortOrder: 3,
      isFeatured: true,
    },
  ];

  for (const s of speakers) {
    const exists = await prisma.speaker.findFirst({
      where: { eventId: event.id, name: s.name },
    });
    if (!exists) {
      await prisma.speaker.create({
        data: {
          eventId: event.id,
          name: s.name,
          title: s.title,
          sortOrder: s.sortOrder,
          isFeatured: s.isFeatured,
        },
      });
      created = true;
    }
  }

  return { eventId: event.id, created };
}
