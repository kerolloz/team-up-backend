import exp from 'express';
import users from './users.route';
import verify from './verify.route';

const router = exp.Router();

router.use('/users', users);
router.use('/verify', verify);

// 404
router.all('*', function(req, res) {
  res.status(404).json({ message: '🤔 Are you lost ?!' });
});

export default router;
