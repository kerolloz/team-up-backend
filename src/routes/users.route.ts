import express from 'express';
import { users } from '../controllers';

const router = express.Router();

router.post('/', users.signup);
router.get('/', users.find);
router.delete('/:token', users.remove);
router.put('/verify/:token', users.verify);

export default router;
