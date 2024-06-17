import { Request } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import { SuccessfulResponse, endpoint } from '../../core/decorators';
import { BAD_REQUEST, HttpException } from '../../core/exceptions';
import { UserModel } from '../../models/user';

export default endpoint(
  { params: { token: Joi.string().required() } },
  async (req: Request): Promise<SuccessfulResponse> => {
    const verificationToken = req.params.token;
    await UserModel.findOneAndDelete({ verificationToken })
      .orFail()
      .catch((err) => {
        if (err instanceof mongoose.Error.DocumentNotFoundError) {
          throw new HttpException(BAD_REQUEST, {
            message: 'Invalid verification token',
          });
        }
      });
  },
);
