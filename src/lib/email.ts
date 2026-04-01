import { Resend } from "resend";

export async function sendWaitlistConfirmation(name: string, email: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("[resend] No API key configured — skipping confirmation email to", email);
    return;
  }

  const resend = new Resend(apiKey);
  const fromEmail = process.env.FROM_EMAIL || "hello@keeped.ai";

  // Use first name only for the greeting
  const firstName = name.split(" ")[0];

  await resend.emails.send({
    from: `Keeped <${fromEmail}>`,
    to: email,
    subject: "Your place is kept",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #F5F0E8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F0E8; padding: 48px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="max-width: 480px; width: 100%; padding: 0 32px; box-sizing: border-box;">
          <tr>
            <td style="padding-bottom: 40px;">
              <p style="font-family: 'IBM Plex Mono', 'Courier New', monospace; font-size: 13px; font-weight: 500; letter-spacing: 0.06em; color: #2E2A25; margin: 0;">Keeped</p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.7; color: #2E2A25; margin: 0;">Hi ${firstName},</p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.7; color: #2E2A25; margin: 0;">Your place is kept. When Keeped is ready, you will be among the first to know.</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 16px; border-top: 0.5px solid #C8BFB0;">
              <p style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #7A7268; font-style: italic; margin: 0;">Some things deserve to be kept.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  });
}
