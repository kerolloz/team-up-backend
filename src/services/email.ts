import sgMail from '@sendgrid/mail';
import { emailEnvVar, sendGridAPIKeyEnvVar } from '../config';

sgMail.setApiKey(sendGridAPIKeyEnvVar);

/**
 * sends an email
 * @param html the email content in html
 * @param to send the email to
 */
export function sendEmail(html: string, to: string): void {
  const msg = {
    to,
    from: { name: 'TEAM UP', email: emailEnvVar },
    subject: 'Registration - Verification',
    html,
  };
  sgMail
    .send(msg)
    .then(() => console.log(`An email was sent to ${to}`))
    .catch(console.error);
}
