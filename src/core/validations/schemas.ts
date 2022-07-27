import Joi from 'joi';

export const JoiObjectId = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/, 'objectId')
  .message('is invalid ID');
