import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  generateSecureToken,
  generateQrDataUrl,
  generateTicketNumber,
  generateRegistrationId,
} from "@/lib/qr/generate";
import { sendEmail, personalize } from "@/lib/email/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      organization,
      designation,
      city,
      country,
      ticketTypeId: requestedTicketTypeId,
    } = body;

    if (!fullName?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Full name and email are required." },
        { status: 400 }
      );
    }

    const event = await prisma.event.findFirst({ where: { isPublished: true } });
    if (!event) {
      return NextResponse.json({ error: "No published event found." }, { status: 404 });
    }

    // Resolve ticket type: use provided id, otherwise pick first open non-invite type
    let ticketType = null;

    if (requestedTicketTypeId) {
      ticketType = await prisma.ticketType.findFirst({
        where: {
          id: requestedTicketTypeId,
          eventId: event.id,
          isOpen: true,
        },
      });
    }

    if (!ticketType) {
      ticketType = await prisma.ticketType.findFirst({
        where: {
          eventId: event.id,
          isOpen: true,
          requiresInvite: false,
        },
        orderBy: { sortOrder: "asc" },
      });
    }

    // Fallback: any open ticket type
    if (!ticketType) {
      ticketType = await prisma.ticketType.findFirst({
        where: {
          eventId: event.id,
          isOpen: true,
        },
        orderBy: { sortOrder: "asc" },
      });
    }

    // Last resort: create a default ticket type so registration never blocks
    if (!ticketType) {
      ticketType = await prisma.ticketType.create({
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
    }

    const ticketTypeId = ticketType.id;

    // Duplicate check
    const existing = await prisma.registration.findFirst({
      where: {
        eventId: event.id,
        email: email.toLowerCase().trim(),
        ticketTypeId,
      },
    });
    if (existing) {
      return NextResponse.json(
        {
          error:
            "You have already registered with this email for this ticket type.",
        },
        { status: 409 }
      );
    }

    const registrationId = generateRegistrationId("GRE");
    const ticketNumber = generateTicketNumber("TKT");
    const qrToken = generateSecureToken();
    const qrCodeDataUrl = await generateQrDataUrl(qrToken);

    // Find SPOC for this ticket type
    const assignment = await prisma.spocAssignment.findFirst({
      where: { ticketTypeId },
      include: { spoc: true },
    });
    const spoc = assignment?.spoc;

    const result = await prisma.$transaction(async (tx) => {
      const registration = await tx.registration.create({
        data: {
          eventId: event.id,
          ticketTypeId,
          registrationId,
          fullName: fullName.trim(),
          email: email.toLowerCase().trim(),
          phone: phone || null,
          organization: organization || null,
          designation: designation || null,
          city: city || null,
          country: country || "India",
          status: "confirmed",
        },
      });

      const ticket = await tx.ticket.create({
        data: {
          registrationId: registration.id,
          ticketNumber,
          qrToken,
          qrCodeDataUrl,
          status: "valid",
        },
      });

      return { registration, ticket };
    });

    // Send confirmation email (best-effort)
    try {
      const template = await prisma.emailTemplate.findFirst({
        where: { eventId: event.id, type: "confirmation", isActive: true },
      });

      if (template) {
        const html = personalize(template.bodyHtml, {
          participant_name: fullName,
          event_name: event.name,
          event_date: `${event.startDate.toLocaleDateString("en-IN")} – ${event.endDate.toLocaleDateString("en-IN")}`,
          event_venue: event.venueName || "",
          ticket_number: ticketNumber,
          ticket_type: ticketType.name,
          registration_id: registrationId,
          qr_code_url: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${qrToken}`,
          spoc_name: spoc?.name || event.organizerName || "",
          spoc_email: spoc?.email || event.organizerEmail || "",
          spoc_phone: spoc?.phone || event.organizerPhone || "",
        });

        await sendEmail({
          to: email,
          subject: personalize(template.subject, {
            event_name: event.name,
            participant_name: fullName,
          }),
          html,
        });
      }
    } catch (emailErr) {
      console.error("Confirmation email failed:", emailErr);
      // Do not fail the registration if email fails
    }

    return NextResponse.json({
      success: true,
      registrationId,
      ticketNumber,
      qrToken,
      verifyUrl: `/verify/${qrToken}`,
      ticketType: ticketType.name,
    });
  } catch (err: any) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: err.message || "Registration failed" },
      { status: 500 }
    );
  }
}
