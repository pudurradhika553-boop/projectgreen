import QRCode from "qrcode";
import { randomBytes } from "crypto";

export function generateSecureToken(): string {
  return randomBytes(32).toString("hex");
}

export async function generateQrDataUrl(token: string): Promise<string> {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${token}`;
  return QRCode.toDataURL(verifyUrl, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 300,
    color: {
      dark: "#0f172a",
      light: "#ffffff",
    },
  });
}

export function generateTicketNumber(prefix = "GRE"): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `${prefix}-${year}-${random}`;
}

export function generateRegistrationId(prefix = "REG"): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 90000) + 10000;
  return `${prefix}-${year}-${random}`;
}
