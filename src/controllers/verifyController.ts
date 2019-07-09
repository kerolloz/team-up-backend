import { Request, Response } from 'express';
import { User } from '../models/user';

export async function verify(req: Request, res: Response) {
  const token = req.params.token;
  const user = await User.findOne({
    verificationToken: token
  });

  if (!user) return res.status(400).send('Invalid token');

  if (user.isVerified)
    return res.json({
      message: 'You email has been already verified!'
    });

  user.isVerified = true;
  user.save();
  res.json({
    message: 'You email has been verified successfully!'
  });
}
