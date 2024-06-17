import { MailDataRequired } from '@sendgrid/mail';
import { frontendBaseURIEnvVar } from '../config';
import { User } from '../models/user';
import { BaseMailer } from './base.mailer';

export class VerificationMailer extends BaseMailer {
  private readonly SUBJECT = 'Team Up - Verify your Email';
  private name: string;
  private verificationToken: string;
  private to: string;

  constructor({ email: to, verificationToken, name }: User) {
    super();
    this.to = to;
    this.name = name;
    this.verificationToken = verificationToken;
  }

  get msg(): MailDataRequired {
    return {
      to: this.to,
      from: this.from,
      subject: this.SUBJECT,
      html: this.html,
    };
  }

  get html(): string {
    const { name, verificationToken } = this;
    const verificationLink = `${frontendBaseURIEnvVar}/verify?token=${verificationToken}`;
    const removeLink = `${frontendBaseURIEnvVar}/remove?token=${verificationToken}`;

    return `
  <h1 align='center'>Welcome to TEAM UP!</h1> <br>
  <h3>We are happy to see you, ${name}.</h3>
  <p style="font-size: 16px">
    Please use <a href='${verificationLink}' target='_blank'>this</a> link to <b>verify your Email.</b>
    <br><br>
    If there is anything wrong with the data you provided,
    You can easily <b><a href='${removeLink}' target='_blank'>remove</a></b> yourself from our database.
    <br>
    <b>Note:</b> When you join a team, we recommend that you remove yourself from our database.
    So, only students who haven't joined a team yet would appear on our website.
  </p>
  <span>
  Facing any trouble? report an issue <a href='https://github.com/kerolloz/team-up/issues'>here</a>
  </span>
  `;
  }
}
