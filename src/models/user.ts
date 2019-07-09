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
    required: true,
    type: String
  }
});

userSchema.index({ ALB_TITLE: 'text', ART_NAME: 'text', SNG_TITLE: 'text' });

userSchema.methods.generateEmailVerificationToken = function() {
  this.verificationToken = crypto.randomBytes(16).toString('hex');
  return this.verificationToken;
};

userSchema.methods.sendVerificationEmail = function(host: string | undefined) {
  const sender: { email: string; password: string } = {
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

  const verfificationLink = `http://${host}/verify/${this.verificationToken}`;

  return transporter.sendMail({
    from: `"TEAM UP" <${sender.email}>`,
    to: this.email,
    subject: 'TEAM UP - Registration',
    html: `Please use the following link to verify your Email<br>${verfificationLink}`
  });
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
