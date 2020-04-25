import express from 'express';
import { HttpException, NOT_FOUND } from '../core/exceptions';
import users from './users.route';
import { endpoint } from '../core/decorators';

const router = express.Router();

router.use('/users', users);

// healthcheck
router.get(
  '/ping',
  endpoint((_) => 'pong'),
);

// 404
router.all('*', () => {
  throw new HttpException(NOT_FOUND);
});

export default router;
