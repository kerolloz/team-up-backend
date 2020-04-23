import { NextFunction, Request, Response } from 'express';
import { BAD_REQUEST, HttpException } from '../exceptions';
import { EndpointHandler, SuccessfulResponse } from './types';

export function requestHandler(handler: EndpointHandler) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    let response: SuccessfulResponse;
    try {
      response = await handler(req);
    } catch (error) {
      // Mongo duplicate key error
      const MONGO_DUPLICATE_KEY_ERROR_CODE = 11000;
      const { name, code } = error;
      if (name === 'MongoError' && code === MONGO_DUPLICATE_KEY_ERROR_CODE) {
        const label = Object.keys(error.keyValue)[0];
        const value = error.keyValue[label];
        const type = 'any.unique';
        const message = `"${value}" is not a unique value`;
        return next(new HttpException(BAD_REQUEST, [{ label, type, message }]));
      }

      // other errors
      return next(error);
    }

    // content
    let content = typeof response == 'string' ? response : response.content;
    if (typeof content == 'string') {
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
