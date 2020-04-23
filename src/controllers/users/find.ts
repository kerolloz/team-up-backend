import Joi from '@hapi/joi';
import { Request } from 'express';
import mongoose from 'mongoose';
import { endpoint, SuccessfulResponse } from '../../core/decorators';
import { HttpException, UNPROCESSABLE_ENTITY } from '../../core/exceptions';
import { UserModel } from '../../models/user';

async function findBySkills(skills: string[]): Promise<mongoose.Document[]> {
  skills = skills.map((skill) => skill.toLowerCase());
  return await UserModel.find({
    isVerified: true,
    skills: { $all: skills },
  });
}

async function findByName(name: string): Promise<mongoose.Document[]> {
  return await UserModel.find(
    { isVerified: true, $text: { $search: name } },
    { score: { $meta: 'textScore' } },
  ).sort({ score: { $meta: 'textScore' } });
}

export default endpoint(
  {
    query: {
      skills: Joi.alternatives(Joi.array().items(Joi.string()), Joi.string()),
      name: Joi.string(),
    },
  },
  async (req: Request): Promise<SuccessfulResponse> => {
    if (Object.keys(req.query).length > 1) {
      throw new HttpException(UNPROCESSABLE_ENTITY, [
        { message: 'You should use only one search parameter' },
      ]);
    }

    const { name, skills } = req.query;
    const s = typeof skills === 'string' ? [skills] : skills;
    const users = skills
      ? await findBySkills(s as string[])
      : await findByName(name as string);

    return { content: users };
  },
);
