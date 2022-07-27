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
        message: 'Invalid token',
      });
    }

    await user.remove();
    return { status: 204 };
  },
);
