import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export type SendEmailParams = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set – email skipped");
    return { id: "mock-" + Date.now(), error: null };
  }

  const from =
    process.env.RESEND_FROM_EMAIL ||
    "GreenRise Expo <onboarding@resend.dev>";

  const { data, error } = await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
  });

  if (error) {
    console.error("Resend error:", error);
    return { id: null, error };
  }

  return { id: data?.id, error: null };
}

export function personalize(
  template: string,
  vars: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{{${key}}}`, value || "");
  }
  return result;
}
