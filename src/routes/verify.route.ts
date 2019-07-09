import express from 'express';
import * as verifyController from '../controllers/verifyController';

const router = express.Router();

router.get('/:token', verifyController.verify);

export default router;
