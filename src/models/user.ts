import mongoose from 'mongoose';
import Joi from 'joi';
import mongoosePaginate from 'mongoose-paginate-v2';

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
  }
});

userSchema.plugin(mongoosePaginate);

export const User = mongoose.model('User', userSchema);

// prettier-ignore
export function validateUser(user: any) {
  const schema = {
    name: Joi.string().regex(/^[a-zA-Z][a-zA-Z\s]*$/).min(5).max(200).required(),
    email: Joi.string().min(3).max(50).required().email(),
    skills: Joi.array().items(Joi.string().regex(/^[a-z][a-z\-\+\.]*$/).min(2)).required()
  };

  return Joi.validate(user, schema);
}
