import { EmailClient } from "@azure/communication-email";
import config from "../utils/config.js";
import logger from "../utils/logger.js";

const emailClient = new EmailClient(config.acsConnectionString);

/**
 * Send a verification OTP email to a @my.yorku.ca address.
 * @param {string} toAddress — recipient email
 * @param {string} otpCode — 6-digit code
 * @returns {Promise<boolean>} true if sent successfully
 */
export async function sendVerificationEmail(toAddress, otpCode) {
  const message = {
    senderAddress: config.emailFrom,
    content: {
      subject: "Your IEEE YorkU Hardware Club Verification Code",
      plainText: [
        `Hi,`,
        ``,
        `Your IEEE YorkU Hardware Club verification code is: ${otpCode}`,
        ``,
        `This code expires in 15 minutes.`,
        ``,
        `If you did not request this, you can safely ignore this email.`,
        ``,
        `— IEEE YorkU Hardware Club`,
      ].join("\n"),
      html: buildHtmlTemplate(otpCode),
    },
    recipients: {
      to: [{ address: toAddress }],
    },
  };

  try {
    const poller = await emailClient.beginSend(message);
    const result = await poller.pollUntilDone();

    if (result.status === "Succeeded") {
      logger.info(`Verification email sent to ${toAddress}`);
      return true;
    }

    logger.error(`Email send failed with status: ${result.status}`, result.error);
    return false;
  } catch (err) {
    logger.error(`Email send error to ${toAddress}:`, err.message);
    return false;
  }
}

/**
 * Build the HTML email template.
 * @param {string} otpCode
 * @returns {string}
 */
function buildHtmlTemplate(otpCode) {
  return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #00629B; margin-bottom: 16px; font-size: 20px;">IEEE YorkU Hardware Club</h2>
  <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
    Your verification code is:
  </p>
  <div style="background: #f1f5f9; border: 2px solid #00629B; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
    <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #00629B;">${otpCode}</span>
  </div>
  <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0 0 8px 0;">
    This code expires in <strong>15 minutes</strong>.
  </p>
  <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0;">
    If you did not request this, you can safely ignore this email.
  </p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
  <p style="color: #94a3b8; font-size: 12px; margin: 0;">
    IEEE York University Student Branch &bull; Hardware Design Club
  </p>
</div>`;
}
