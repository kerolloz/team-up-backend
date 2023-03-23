import { Request } from 'express';
import { endpoint, SuccessfulResponse } from '../../core/decorators';
import { VerificationMailer } from '../../mailer';
import { UserModel, userValidations } from '../../models/user';

export default endpoint(
  {
    body: userValidations,
  },
  async (req: Request): Promise<SuccessfulResponse> => {
    const user = await UserModel.create(req.body);
    new VerificationMailer(user).sendEmail();

    return { status: 201, content: 'Registered Successfully' };
  },
);
