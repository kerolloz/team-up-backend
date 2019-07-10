import mongoose from 'mongoose';
import Joi from 'joi';
import mongoosePaginate from 'mongoose-paginate-v2';
import crypto from 'crypto';
import colors from 'colors';
import nodemailer from 'nodemailer';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200,
    text: true
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    unique: true
  },
  skills: {
    type: [String],
    required: true,
    text: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    select: false,
    required: true,
    type: String
  }
});

userSchema.index({ ALB_TITLE: 'text', ART_NAME: 'text', SNG_TITLE: 'text' });

userSchema.methods.generateEmailVerificationToken = function() {
  this.verificationToken = crypto.randomBytes(16).toString('hex');
  return this.verificationToken;
};

userSchema.methods.sendVerificationEmail = function() {
  const sender = {
    email: process.env.EMAIL || '',
    password: process.env.EMAIL_PASSWORD || ''
  };

  if (!sender.email || !sender.password) {
    console.log(colors.yellow('Undefined Email | password'));
  }

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: sender.email,
      pass: sender.password
    }
  });

  const base_url = 'https://kerolloz.me/team-up';
  // const base_url = 'http://localhost:5500';

  const verfificationLink = `${base_url}/verify.html?token=${
    this.verificationToken
  }`;
  const removeLink = `${base_url}/remove.html?token=${this.verificationToken}`;

  transporter
    .sendMail({
      from: `"TEAM UP" <${sender.email}>`,
      to: this.email,
      subject: 'Registration - Verification mail',
      html: `
      <h1 align='center'>Welcome to TEAM UP!</h1> <br>
      <h2>We are happy to see you, ${this.name}.</h2>
      <p style="font-size: 15px">
        Please use <a href='${verfificationLink}' target='_blank'>this</a> link to <b>verify your Email</b>!
        <br><br>
        If there is anything wrong with the data you provided,
        You can use <a href='${removeLink}' target='_blank'>this</a> link to <b>remove yourself from our database</b>!
        <br>
        <b>Note:</b> When you join a team, we recommend that you remove yourself from our database!
        So, only students who haven't joined a team yet would appear on our website.
      </p>
      <p>
      Facing any trouble? report an issue <a href='https://github.com/kerolloz/team-up/issues'>here</a>
      </p>`
    })
    .then(() => console.log('An email was sent to ', this.email))
    .catch(() => console.log('Failed sending email to ', this.email));
};

userSchema.plugin(mongoosePaginate);

export const User = mongoose.model('User', userSchema);

// prettier-ignore
export function validateUser(user: any) {
  const schema = {
    name: Joi.string().regex(/^[a-zA-Z][a-zA-Z\s]*$/).min(5).max(200).required(),
    email: Joi.string().min(3).max(50).required().email(),
    skills: Joi.array().items(Joi.string().regex(/^[a-z][a-z0-9\-\+\.]*$/).min(2)).required()
  };

  return Joi.validate(user, schema);
}
