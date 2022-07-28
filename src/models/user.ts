import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import Joi from 'joi';

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

  @prop({ required: true, type: String })
  skills!: string[];

  @prop({ default: false, select: false })
  isVerified!: boolean;

  @prop({ required: true, select: false })
  verificationToken!: string;
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
