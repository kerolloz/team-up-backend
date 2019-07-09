import { Request, Response } from 'express';
import { User, validateUser } from '../models/user';

export async function signup(req: Request, res: Response) {
  const { error } = validateUser(req.body);

  if (error)
    return res.status(422).json({
      message: error.details[0].message
    });

  if (await User.findOne({ email: req.body.email }))
    return res.status(422).json({
      message: 'This email already exists!'
    });

  const user: any = new User(req.body);

  user.generateEmailVerificationToken();
  user.sendVerificationEmail();

  await user.save();

  res.json({
    user
  });
}

export async function all_users(req: Request, res: Response, next: any) {
  if (Object.keys(req.query).length)
    if (!(req.query.pageNumber || req.query.pageSize)) return next();
  // if this is a search query, go to search function
  const options = {
    page: parseInt(req.query.pageNumber) || 1,
    limit: parseInt(req.query.pageSize) || 10
  };

  User.paginate({}, options, (err, result) => {
    if (err) return res.json({ message: err });
    res.send(result);
  });
}

export async function remove(req: Request, res: Response) {
  const token = req.params.token;

  const user = await User.findOne({
    verificationToken: token
  });

  if (!user)
    return res.status(400).json({
      message: 'Invalid token'
    });

  try {
    await user.delete();
    return res.json({
      message: 'Okay, Deleted Successfully!'
    });
  } catch (err) {
    return res.status(400).json({
      message: 'Something went wrong, please report this issue!'
    });
  }
}

export async function search(req: Request, res: Response) {
  if (Object.keys(req.query).length > 1)
    return res.status(422).json({
      message: 'You should use only one search parameter'
    });

  let users;

  if (req.query.hasOwnProperty('skills')) {
    users = await get_users_with_skills(req.query.skills.split(','));
  } else if (req.query.hasOwnProperty('name')) {
    users = await get_user_by_name(req.query.name);
  } else {
    return res.status(422).json({
      message: 'You should only use ?skills or ?name search parameters'
    });
  }
  res.json(users);
}

async function get_users_with_skills(skills: string[]) {
  skills = skills.map(skill => skill.toLowerCase());
  console.log(skills);
  return await User.find({
    isVerified: true,
    skills: { $all: skills }
  });
}

async function get_user_by_name(name: String) {
  return await User.find(
    { isVerified: true, $text: { $search: name } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
}
