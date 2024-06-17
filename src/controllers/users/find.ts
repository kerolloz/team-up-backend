import { Request } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import { SuccessfulResponse, endpoint } from '../../core/decorators';
import { HttpException, UNPROCESSABLE_ENTITY } from '../../core/exceptions';
import { UserModel } from '../../models/user';

async function findBySkills(skills: string[]): Promise<mongoose.Document[]> {
  return await UserModel.find({
    isVerified: true,
    skills: { $all: skills },
  });
}

async function findByName(name: string): Promise<mongoose.Document[]> {
  return await UserModel.find({ isVerified: true, $text: { $search: name } });
}

export default endpoint(
  {
    query: {
      skills: Joi.alternatives(
        Joi.array().items(Joi.string().lowercase()),
        Joi.string().lowercase(),
      ),
      name: Joi.string(),
    },
  },
  async (req: Request): Promise<SuccessfulResponse> => {
    const { name, skills } = req.query;

    if (!name && !skills) {
      return { content: [] }; // Return empty array if no query is passed
    }

    if (name && skills) {
      throw new HttpException(UNPROCESSABLE_ENTITY, {
        message: 'You should use only one search parameter',
        errors: [
          {
            label: 'query.search',
            type: 'query',
            message: 'use name or skills',
          },
        ],
      });
    }

    const users = skills
      ? await findBySkills(
          (typeof skills === 'string' ? [skills] : skills) as string[],
        )
      : await findByName(name as string);

    return { content: users };
  },
);
