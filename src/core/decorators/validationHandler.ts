import { NextFunction, Request, RequestHandler, Response } from 'express';
import Joi from 'joi';
import { HttpException, NOT_FOUND, UNPROCESSABLE_ENTITY } from '../exceptions';
import { VALIDATION_ERROR } from '../exceptions/MongoErrors';
import { JOI_VALIDATION_OPTIONS } from '../validations/joiOptions';
import { IErrorResponse, IValidationRules } from './types';

export function validationHandler({
  params = {},
  query = {},
  body = undefined,
}: IValidationRules): RequestHandler {
  return (req: Request, _: Response, next: NextFunction): void => {
    // check for invalid params first, fails => not found
    const paramsSchema = Joi.object(params);
    const paramsValue = req.params;
    const { error: paramsError } = paramsSchema.validate(
      paramsValue,
      JOI_VALIDATION_OPTIONS,
    );
    if (paramsError) {
      throw new HttpException(NOT_FOUND, { message: 'Not found' });
    }

    // check for invalid query or body
    const schema = Joi.object({
      query: Joi.object(query),
      body: Joi.object(body),
    });
    const value = {
      query: req.query,
      body: req.body as unknown,
    };

    const { error } = schema.validate(value, JOI_VALIDATION_OPTIONS);

    if (error) {
      const errors = toErrorResponse(error.details);
      throw new HttpException(UNPROCESSABLE_ENTITY, {
        message: VALIDATION_ERROR,
        errors,
      });
    }

    next();
  };
}

export function toErrorResponse(
  errDetails: Joi.ValidationErrorItem[],
): IErrorResponse[] {
  return errDetails.map(
    ({ message, path, type }): IErrorResponse => ({
      label: path.join('.'),
      type,
      message,
    }),
  );
}
