import express from 'express';
import { HttpException, NOT_FOUND } from '../core/exceptions';
import users from './users.route';

const router = express.Router();

router.use('/users', users);

// 404
router.all('*', () => {
  throw new HttpException(NOT_FOUND);
});

export default router;
