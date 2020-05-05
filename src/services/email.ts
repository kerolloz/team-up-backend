import nodemailer from 'nodemailer';

const sender = {
  email: process.env.EMAIL,
  password: process.env.EMAIL_PASSWORD,
};

if (!sender.email || !sender.password) {
  throw new Error('Undefined Email | password');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: sender.email,
    pass: sender.password,
  },
});

/**
 * sends an email for verification
 * @param html the email content in html
 * @param to send the email to
 */
export function sendEmail(html: string, to: string): void {
  transporter
    .sendMail({
      from: `"TEAM UP" <${sender.email}>`,
      to,
      subject: 'Registration - Verification',
      html,
    })
    .then(() => console.log('An email was sent to', to))
    .catch((err) => console.log('Failed sending email to', to, err));
}
