import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.get('/:token', userController.remove);

export default router;
