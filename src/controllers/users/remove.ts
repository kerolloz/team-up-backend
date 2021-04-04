import Joi from 'joi';
import { Request } from 'express';
import { endpoint, SuccessfulResponse } from '../../core/decorators';
import { HttpException, NOT_FOUND } from '../../core/exceptions';
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
      throw new HttpException(NOT_FOUND, [
        { label: 'params.token', message: 'Invalid token' },
      ]);
    }

    await user.remove();
    return { status: 204 };
  },
);
