import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const roles = [
    { name: "SUPER_ADMIN", description: "Full system access" },
    { name: "EVENT_MANAGER", description: "Manage event content and registrations" },
    { name: "REGISTRATION_MANAGER", description: "View and manage registrations + check-in" },
    { name: "SPEAKER_MANAGER", description: "Manage speakers" },
    { name: "SPONSOR_MANAGER", description: "Manage sponsors" },
    { name: "STALL_MANAGER", description: "Manage stalls and exhibitors" },
    { name: "CHECKIN_STAFF", description: "QR scan and check-in only" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  const permissions = [
    { key: "event:read", description: "View event configuration" },
    { key: "event:write", description: "Edit event configuration" },
    { key: "registrations:read", description: "View registrations" },
    { key: "registrations:write", description: "Manage registrations" },
    { key: "tickets:checkin", description: "Perform check-ins" },
    { key: "emails:send", description: "Send emails and campaigns" },
    { key: "users:manage", description: "Manage users and roles" },
    { key: "reports:export", description: "Export reports" },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      update: {},
      create: perm,
    });
  }

  const superAdminRole = await prisma.role.findUnique({ where: { name: "SUPER_ADMIN" } });
  const allPerms = await prisma.permission.findMany();
  if (superAdminRole) {
    for (const p of allPerms) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId: superAdminRole.id, permissionId: p.id },
        },
        update: {},
        create: { roleId: superAdminRole.id, permissionId: p.id },
      });
    }
  }

  const event = await prisma.event.upsert({
    where: { id: "greenrise-2027" },
    update: {},
    create: {
      id: "greenrise-2027",
      name: "GreenRise Expo 2027",
      tagline: "Growing Towards Sustainability",
      description:
        "GreenRise Expo 2027 is a four-day event in Pune that provides a platform for entrepreneurs, start-ups and social enterprises to showcase their ventures, innovative products and solutions. The expo focuses on addressing social challenges, promoting sustainability and encouraging entrepreneurship to create a positive impact on society and the environment.",
      category: "Sustainability & Social Impact",
      theme: "Where Innovation Meets Impact",
      startDate: new Date("2027-02-23T00:00:00+05:30"),
      endDate: new Date("2027-02-26T23:59:59+05:30"),
      startTime: "10:00 AM",
      endTime: "6:00 PM",
      venueName: "Pune International Exhibition and Convention Centre (PIECC)",
      venueAddress:
        "Pune International Exhibition and Convention Centre (PIECC), Moshi, Pune, Maharashtra",
      mapsUrl: "https://share.google/RC5tX2Z6rmO4yh660",
      organizerName: "GreenRise Expo Organizing Committee",
      organizerEmail: "grise2802@gmail.com",
      organizerPhone: "8446387391",
      websiteUrl: "https://www.greenriseexpo.in",
      primaryColor: "#0f766e",
      secondaryColor: "#134e4a",
      backgroundColor: "#f8fafc",
      textColor: "#0f172a",
      fontFamily: "Inter",
      isPublished: true,
    },
  });

  await prisma.ticketType.upsert({
    where: { id: "ticket-general" },
    update: {},
    create: {
      id: "ticket-general",
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

  await prisma.ticketType.upsert({
    where: { id: "ticket-exhibitor" },
    update: {},
    create: {
      id: "ticket-exhibitor",
      eventId: event.id,
      name: "Exhibitor Stall Package",
      description: "Stall space + exhibitor passes. Quotation-based pricing.",
      price: 0,
      currency: "INR",
      isOpen: true,
      requiresInvite: true,
      sortOrder: 2,
    },
  });

  const pages = [
    { slug: "home", title: "Home", sortOrder: 1 },
    { slug: "about", title: "About the Event", sortOrder: 2 },
    { slug: "agenda", title: "Event Agenda", sortOrder: 3 },
    { slug: "speakers", title: "Speakers", sortOrder: 4 },
    { slug: "sponsors", title: "Sponsors", sortOrder: 5 },
    { slug: "exhibitors", title: "Exhibitors", sortOrder: 6 },
    { slug: "venue", title: "Venue & Location", sortOrder: 7 },
    { slug: "register", title: "Registration", sortOrder: 8 },
    { slug: "contact", title: "Contact", sortOrder: 9 },
    { slug: "privacy", title: "Privacy Policy", sortOrder: 10 },
    { slug: "terms", title: "Terms and Conditions", sortOrder: 11 },
  ];

  for (const p of pages) {
    await prisma.eventPage.upsert({
      where: { eventId_slug: { eventId: event.id, slug: p.slug } },
      update: {},
      create: {
        eventId: event.id,
        ...p,
        isEnabled: true,
        content: "",
      },
    });
  }

  const speakers = [
    { name: "Dr. Raghunath Mashelkar", title: "Renowned Scientist & Innovation Leader", sortOrder: 1, isFeatured: true },
    { name: "Anand Chordia", title: "Entrepreneur & Industry Leader", sortOrder: 2, isFeatured: true },
    { name: "Ravi Pandit", title: "Technology & Business Leader", sortOrder: 3, isFeatured: true },
  ];

  for (const s of speakers) {
    await prisma.speaker.create({
      data: { eventId: event.id, ...s },
    }).catch(() => {});
  }

  const sponsors = [
    { name: "Pune Municipal Corporation", tier: "Title", sortOrder: 1 },
    { name: "Mahindra & Mahindra", tier: "Platinum", sortOrder: 2 },
    { name: "Pune International Centre", tier: "Gold", sortOrder: 3 },
    { name: "Garware Technical Fibres", tier: "Gold", sortOrder: 4 },
  ];

  for (const s of sponsors) {
    await prisma.sponsor.create({
      data: { eventId: event.id, ...s },
    }).catch(() => {});
  }

  await prisma.spoc.create({
    data: {
      eventId: event.id,
      name: "Ananya Sharma",
      designation: "Event Coordination Manager",
      department: "Event Management and Operations",
      email: "saanvig168@gmail.com",
      phone: "8446387391",
      whatsapp: "8446387931",
      responsibility:
        "Managing registrations, coordinating with attendees and exhibitors, answering event enquiries, handling participant communication and resolving registration issues",
    },
  }).catch(() => {});

  await prisma.emailTemplate.create({
    data: {
      eventId: event.id,
      name: "Registration Confirmation",
      subject: "Your registration for {{event_name}} is confirmed",
      type: "confirmation",
      bodyHtml: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0f766e;">Registration Confirmed</h1>
          <p>Hi {{participant_name}},</p>
          <p>Thank you for registering for <strong>{{event_name}}</strong>.</p>
          <p><strong>Ticket Number:</strong> {{ticket_number}}<br/>
          <strong>Registration ID:</strong> {{registration_id}}<br/>
          <strong>Ticket Type:</strong> {{ticket_type}}</p>
          <p>Date: {{event_date}}<br/>Venue: {{event_venue}}</p>
          <p>Please keep this email and show the QR code at the entrance.</p>
          <p>Your Single Point of Contact (SPOC): {{spoc_name}}<br/>
          Email: {{spoc_email}} | Phone: {{spoc_phone}}</p>
          <p>See you at the expo!</p>
        </div>
      `,
    },
  }).catch(() => {});

  console.log("Seed completed successfully.");
  console.log("Visit /setup after deployment to create the first Super Admin account.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
