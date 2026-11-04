# Event Management Platform  
**GreenRise Expo 2027 – Reusable Full-Stack Template**

A production-oriented event management website that college students can deploy **without using a terminal**.

---

## What is included

- Public event website (Home, About, Agenda, Speakers, Sponsors, Venue, Register, Contact)
- Configurable event details (name, dates, venue, colours, branding) stored in database
- Dynamic registration form + ticket generation
- Unique QR code per registration + verification page
- Confirmation email via Resend
- SPOC (Single Point of Contact) assignment on tickets
- Admin dashboard with real registration statistics
- Role-based access (Super Admin, Event Manager, Registration Manager, Check-in Staff, etc.)
- Secure password hashing + session cookies
- Prisma + Neon PostgreSQL schema with seed data for GreenRise Expo
- One-time `/setup` page to create the first Super Admin (no terminal needed)
- Ready for Vercel deployment

---

## Student deployment steps (no terminal required)

### 1. Download & extract
Download the project ZIP and extract it on your computer.

### 2. Create a GitHub repository
1. Go to [github.com](https://github.com) and sign in.
2. Click **New repository**.
3. Name it (e.g. `greenrise-expo-2027`).
4. Keep it **Public**.
5. Do **not** initialise with README.
6. Click **Create repository**.

### 3. Upload the project files
1. On the empty repository page click **uploading an existing file**.
2. Drag **all** the folders and files from the extracted project into the browser.
3. Click **Commit changes**.

### 4. Create a Neon database
1. Go to [console.neon.tech](https://console.neon.tech) and sign up / log in.
2. Create a new project.
3. Copy the **pooled** connection string → this becomes `DATABASE_URL`.
4. Copy the **direct** connection string → this becomes `DATABASE_URL_UNPOOLED`.

### 5. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New Project**.
3. Import the GitHub repository you just created.
4. Before deploying, open **Environment Variables** and add:

| Name | Value | Notes |
|------|-------|-------|
| `DATABASE_URL` | (Neon pooled string) | Required |
| `DATABASE_URL_UNPOOLED` | (Neon direct string) | Required |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Update after first deploy if needed |
| `AUTH_SECRET` | long random string | e.g. generate at randomkeygen.com |
| `RESEND_API_KEY` | your Resend key | From resend.com |
| `RESEND_FROM_EMAIL` | `Name <email@yourdomain.com>` | Or use `onboarding@resend.dev` for testing |

5. Click **Deploy**.

### 6. First-time setup
1. After the deployment finishes, open your site.
2. Go to `/setup`.
3. Create the Super Admin account (name, email, password).
4. You will be redirected to `/admin/login`.
5. Log in and open the dashboard.

### 7. (Optional) Run seed data
The seed creates the GreenRise event, sample speakers, sponsors, ticket types and email template.  
If the public site shows empty content, you can trigger seed from a one-time API route or by running `npx prisma db push && npx tsx prisma/seed.ts` locally (optional – only if you have Node installed).

Most students can simply use the `/setup` flow and then edit content from the admin panel.

---

## Environment variables (summary)

See `.env.example` for the full list with descriptions.

**Required for first successful deploy:**
- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `AUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`

**Required for emails:**
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

---

## Project structure

```
Event_Management_Platform/
├── prisma/
│   ├── schema.prisma      # Full database schema
│   └── seed.ts            # GreenRise seed data
├── src/
│   ├── app/
│   │   ├── page.tsx               # Public home
│   │   ├── register/              # Registration form
│   │   ├── verify/[token]/        # Ticket + QR page
│   │   ├── setup/                 # First Super Admin
│   │   ├── admin/                 # Dashboard + login
│   │   └── api/                   # Serverless API routes
│   ├── lib/
│   │   ├── db.ts
│   │   ├── auth/
│   │   ├── email/
│   │   └── qr/
│   └── components/
├── .env.example
├── package.json
├── vercel.json
└── README.md
```

---

## What works out of the box

- Public homepage with event data from database
- Registration form → creates registration + ticket + unique QR token
- Confirmation email (when Resend is configured)
- Ticket verification page with QR image and SPOC details
- Admin login + dashboard with live counts
- Secure session cookies
- Role checks on admin routes

## What is scaffolded for extension

- Full Prisma models for speakers, sponsors, exhibitors, stalls, SPOCs, email campaigns, audit logs, form fields, etc.
- Permission system
- Admin navigation placeholders for Registrations, Check-in, Event Settings, Speakers, Sponsors

You can continue building the remaining CRUD screens, visual form builder and campaign composer on top of this foundation.

**Note:** This project contains **no cron jobs** and does not rely on any scheduled background tasks.

---

## Security notes

- Passwords are hashed with bcrypt (12 rounds).
- Sessions use signed JWTs in httpOnly cookies.
- API routes validate input and check roles server-side.
- Never commit `.env` files or real API keys.
- QR tokens are 64-character random hex values – they do not contain personal data.

---

## Support / next steps

1. After deployment, visit `/setup` to create the admin.
2. Log into `/admin` and explore the dashboard.
3. Test a registration and open the ticket page.
4. Configure Resend so confirmation emails are delivered.
5. Extend the admin modules as needed for your college event.

This platform is intentionally designed so a student can go from ZIP → GitHub → Vercel → live site without opening a terminal.
