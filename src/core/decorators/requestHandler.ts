import { mongoose } from '@typegoose/typegoose';
import { NextFunction, Request, Response } from 'express';
import {
  BAD_REQUEST,
  HttpException,
  UNPROCESSABLE_ENTITY,
  NOT_FOUND,
} from '../exceptions';
import {
  IDuplicateKeyError,
  MONGO_DUPLICATE_KEY_ERROR_CODE,
  VALIDATION_ERROR,
} from '../exceptions/MongoErrors';
import { EndpointHandler, SuccessfulResponse } from './types';

export function requestHandler(handler: EndpointHandler) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    let response: SuccessfulResponse;
    try {
      response = await handler(req, res);
    } catch (err: unknown) {
      const error = err as IDuplicateKeyError;
      const { code } = error;
      if (code === MONGO_DUPLICATE_KEY_ERROR_CODE) {
        const label = Object.keys(error.keyValue).join('.');
        const value = Object.values(error.keyValue).join(',');
        const type = 'any.unique';
        const message = `${label} (${value}) already exists`;
        return next(
          new HttpException(BAD_REQUEST, {
            message: VALIDATION_ERROR,
            errors: [{ label, type, message }],
          }),
        );
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(
          new HttpException(UNPROCESSABLE_ENTITY, {
            message: VALIDATION_ERROR,
            errors: Object.entries(err.errors).map(([k, v]) => ({
              label: k,
              type: (v as mongoose.Error.ValidatorError).kind,
              message: v.message,
            })),
          }),
        );
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(
          new HttpException(NOT_FOUND, {
            message: 'Record was not found',
          }),
        );
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(
          new HttpException(BAD_REQUEST, {
            message: 'Invalid Value',
            errors: [
              {
                label: err.path,
                message: `Can't cast ${err.stringValue} to ${err.kind}`,
                type: 'Cast Error',
              },
            ],
          }),
        );
      }

      // otherwise, can't recognize error type => continue to error handler (Internal Server Error)
      return next(err);
    }

    if (res.headersSent) {
      return;
    }

    if (response === null || response === undefined) {
      return res.status(204).send();
    }

    // content
    let content = typeof response === 'string' ? response : response.content;
    if (typeof content === 'string') {
      content = { message: content }; // convert string to obj
    } else {
      content = content || {}; // always return obj
    }

    // status
    let status = 200;
    if (typeof response != 'string' && response.status) {
      ({ status } = response);
    } else if (content == undefined) {
      status = 204;
    }

    return res.status(status).json(content);
  };
}
