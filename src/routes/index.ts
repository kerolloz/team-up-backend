import exp from 'express';
import users from './users.route';

const router = exp.Router();
router.use('/users', users);
// 404
router.all('*', function(req, res) {
  res.status(404).json({ message: '🤔 Are you lost ?!' });
});

export default router;
