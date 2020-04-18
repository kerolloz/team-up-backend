import { Request } from 'express';
import { UserModel, userValidations } from '../../models/user';
import { endpoint, SuccessfulResponse } from '../../core/decorators';
import { HttpException, UNPROCESSABLE_ENTITY } from '../../core/exceptions';

export default endpoint(
  {
    body: userValidations,
  },
  async (req: Request): Promise<SuccessfulResponse> => {
    const emailAlreadyExists = await UserModel.exists({
      email: req.body.email,
    });
    if (emailAlreadyExists) {
      throw new HttpException(UNPROCESSABLE_ENTITY, [
        { label: 'body.email', message: 'Email Already Exists' },
      ]);
    }

    const user = new UserModel(req.body);
    user.sendVerificationEmail();
    await user.save();

    return { status: 201, content: user };
  },
);
