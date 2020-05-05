import Joi from '@hapi/joi';
import {
  arrayProp,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { sendEmail } from '../services/email';

@modelOptions({
  schemaOptions: {
    toJSON: {
      versionKey: false,
    },
  },
})
export class User {
  @prop({ required: true, text: true })
  name!: string;

  @prop({ required: true, unique: true })
  email!: string;

  @arrayProp({ required: true, items: String })
  skills!: string[];

  @prop({ default: false, select: false })
  isVerified!: boolean;

  @prop({ required: true, select: false })
  verificationToken!: string;

  sendVerificationEmail(): void {
    const FRONT_BASE_URI = 'https://team-up-fci.herokuapp.com';
    // const FRONT_BASE_URI = 'http://localhost:8080';

    const verificationLink = `${FRONT_BASE_URI}/verify?token=${this.verificationToken}`;
    const removeLink = `${FRONT_BASE_URI}/remove?token=${this.verificationToken}`;

    const html = `
    <h1 align='center'>Welcome to TEAM UP!</h1> <br>
    <h2>We are happy to see you, ${this.name}.</h2>
    <p style="font-size: 15px">
      Please use <a href='${verificationLink}' target='_blank'>this</a> link to <b>verify your Email</b>!
      <br><br>
      If there is anything wrong with the data you provided,
      You can use <a href='${removeLink}' target='_blank'>this</a> link to <b>remove yourself from our database</b>!
      <br>
      <b>Note:</b> When you join a team, we recommend that you remove yourself from our database!
      So, only students who haven't joined a team yet would appear on our website.
    </p>
    <p>
    Facing any trouble? report an issue <a href='https://github.com/kerolloz/team-up/issues'>here</a>
    </p>
    `;
    sendEmail(html, this.email);
  }
}

export const UserModel = getModelForClass(User);

export const userValidations = {
  name: Joi.string()
    .regex(/^[a-zA-Z][a-zA-Z\s]*$/)
    .min(5)
    .max(100)
    .required(),
  email: Joi.string().email().required(),
  skills: Joi.array()
    .items(
      Joi.string()
        .regex(/^[a-z][a-z0-9\-+.]*$/)
        .min(2)
        .max(20),
    )
    .min(2)
    .max(20)
    .required(),
};
