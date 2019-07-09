import express, { Request, Response } from 'express';
import users from './users.route';
import verify from './verify.route';
import remove from './remove.route';

const router = express.Router();

router.use('/users', users);
router.use('/verify', verify);
router.use('/remove', remove);

// 404
router.all('*', function(req:Request, res:Response) {
  res.status(404).json({ message: '🤔 Are you lost ?!' });
});

export default router;
