import Joi from 'joi';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { HttpException, UNPROCESSABLE_ENTITY, NOT_FOUND } from '../exceptions';
import { IValidationRules, IErrorResponse } from './types';

export function validationHandler({
  params = {},
  query = {},
  body = {},
}: IValidationRules): RequestHandler {
  return (req: Request, _: Response, next: NextFunction): void => {
    const options: Joi.ValidationOptions = {
      abortEarly: false,
      errors: { label: false },
    };

    // check for invalid params first, fails => not found
    const paramsSchema = Joi.object({ params });
    const paramsValue = { params: req.params };
    const { error: paramsError } = paramsSchema.validate(paramsValue, options);
    if (paramsError) {
      throw new HttpException(NOT_FOUND);
    }

    // check for invalid query or body
    const schema = Joi.object({
      query: Joi.object(query).unknown(true),
      body: Joi.object(body),
    });
    const value = {
      query: req.query,
      body: req.body,
    };

    const { error } = schema.validate(value, options);

    if (error) {
      const errors = error.details.map(
        ({ message, path, type }): IErrorResponse => ({
          label: path.join('.'),
          type,
          message,
        }),
      );
      throw new HttpException(UNPROCESSABLE_ENTITY, errors);
    }

    next();
  };
}
