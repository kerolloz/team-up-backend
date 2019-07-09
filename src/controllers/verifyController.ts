import { Request, Response } from 'express';
import { User } from '../models/user';

export async function verify(req: Request, res: Response) {
  const token = req.params.token;
  const user = await User.findOne({
    verificationToken: token
  });

  if (!user)
    return res.status(400).json({
      message: 'Invalid token'
    });

  if (user.isVerified)
    return res.status(422).json({
      message: 'You email has already been verified!'
    });

  user.isVerified = true;
  user.save();
  res.json({
    message: 'You email has been verified successfully!'
  });
  // send another email with a link for account deletion
}
