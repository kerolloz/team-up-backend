import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.post('/', userController.signup);
router.get('/', userController.all_users); // * all_users should have search method after it  *
router.get('/', userController.search); //    *  search should have all_users before it       *

export default router;
