import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { emailEnvVar, sendGridAPIKeyEnvVar } from '../config';

sgMail.setApiKey(sendGridAPIKeyEnvVar);

export abstract class BaseMailer {
  protected readonly from = { name: 'TEAM UP', email: emailEnvVar };
  protected abstract get msg(): MailDataRequired;

  public sendEmail() {
    if (!this.msg) {
      throw new Error('Email not set');
    }

    sgMail
      .send(this.msg)
      .then(() => console.log(`An email was sent to ${this.msg.to as string}`))
      .catch(console.error);
  }
}
