import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!_resend) _resend = new Resend(key);
  return _resend;
}

export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY);

export type SendInput = {
  to: string;
  subject: string;
  html: string;
};

export type SendResult = {
  ok: boolean;
  mode: "live" | "dry-run";
  id?: string;
  error?: string;
};

const DEFAULT_FROM = "Aetheris <onboarding@resend.dev>";

export async function sendEmail(input: SendInput): Promise<SendResult> {
  const resend = getResend();
  const from = process.env.NEWSLETTER_FROM || DEFAULT_FROM;

  if (!resend) {
    // Dry-run: log it so we can see flow in the Vercel logs without actually sending
    console.log("[newsletter dry-run]", { to: input.to, subject: input.subject });
    return { ok: true, mode: "dry-run" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });
    if (error) return { ok: false, mode: "live", error: error.message };
    return { ok: true, mode: "live", id: data?.id };
  } catch (e) {
    return { ok: false, mode: "live", error: (e as Error).message };
  }
}
