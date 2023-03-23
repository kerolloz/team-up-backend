import Joi from 'joi';
import mongoose from 'mongoose';
import { BAD_REQUEST, HttpException } from '../../core';
import { endpoint } from '../../core/decorators';
import { UserModel } from '../../models/user';

export default endpoint(
  { params: { token: Joi.string().required() } },
  async (req) => {
    const verificationToken = req.params.token;
    await UserModel.findOneAndUpdate(
      { verificationToken },
      { $set: { isVerified: true } },
    )
      .orFail()
      .catch((err) => {
        if (err instanceof mongoose.Error.DocumentNotFoundError) {
          throw new HttpException(BAD_REQUEST, {
            message: 'Invalid verification token',
          });
        }
        throw err;
      });
    return 'Your email has been verified successfully!';
  },
);
