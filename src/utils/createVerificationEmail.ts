import { frontendBaseURIEnvVar } from '../config';
import { User } from '../models/user';

/**
 * creates html for the verification email
 */
export function createVerificationEmail(this: User): string {
  const verificationLink = `${frontendBaseURIEnvVar}/verify?token=${this.verificationToken}`;
  const removeLink = `${frontendBaseURIEnvVar}/remove?token=${this.verificationToken}`;

  return `
  <h1 align='center'>Welcome to TEAM UP!</h1> <br>
  <h3>We are happy to see you, ${this.name}.</h3>
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
