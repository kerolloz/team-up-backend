import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY environment variable is required');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * sends an email for verification
 * @param html the email content in html
 * @param to send the email to
 */
export function sendEmail(html: string, to: string): void {
  if (!process.env.EMAIL) {
    throw new Error(
      'SENDGRID_API_KEY EMAIL environment variables are required',
    );
  }
  const msg = {
    to,
    from: { name: 'TEAM UP', email: process.env.EMAIL },
    subject: 'Registration - Verification',
    html,
  };
  sgMail
    .send(msg)
    .then((_) => console.log(`An email was sent to ${to}`))
    .catch(console.error);
}
