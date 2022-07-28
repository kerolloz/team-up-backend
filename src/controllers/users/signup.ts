import { Request } from 'express';
import { UserModel, userValidations } from '../../models/user';
import { endpoint, SuccessfulResponse } from '../../core/decorators';
import { HttpException, UNPROCESSABLE_ENTITY } from '../../core/exceptions';
import { generateToken } from '../../services/tokenGenerator';
import { VerificationMailer } from '../../mailer';

export default endpoint(
  {
    body: userValidations,
  },
  async (req: Request): Promise<SuccessfulResponse> => {
    const emailAlreadyExists = await UserModel.exists({
      email: req.body.email,
    });
    if (emailAlreadyExists) {
      throw new HttpException(UNPROCESSABLE_ENTITY, {
        message: 'Email already exists',
      });
    }

    const user = new UserModel(req.body);
    user.verificationToken = generateToken();
    await user.save();
    new VerificationMailer(user).sendEmail();

    return { status: 201, content: 'Registered Successfully' };
  },
);
