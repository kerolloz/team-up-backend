import { Request } from 'express';
import Joi from 'joi';
import { endpoint, SuccessfulResponse } from '../../core/decorators';
import { BAD_REQUEST, HttpException } from '../../core/exceptions';
import { UserModel } from '../../models/user';

export default endpoint(
  {
    params: {
      token: Joi.string().required(),
    },
  },
  async (req: Request): Promise<SuccessfulResponse> => {
    const verificationToken = req.params.token;
    const user = await UserModel.findOne({ verificationToken });

    if (!user) {
      throw new HttpException(BAD_REQUEST, {
        message: 'Invalid verification token',
      });
    }

    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    return 'Your email has been verified successfully!';
  },
);
