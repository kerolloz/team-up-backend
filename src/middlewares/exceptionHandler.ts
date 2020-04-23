import { NextFunction, Request, Response } from 'express';
import { HttpException, SERVER_ERROR } from '../core/exceptions';

export default function exceptionHandler(
  err: HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  const { status = 500, stack } = err;
  let { message, errors } = err;
  if (status >= 500) {
    // always general message no errors, NEVER expose the errors
    ({ message } = SERVER_ERROR);
    errors = undefined;
    console.error(stack);
  }
  return res.status(status).json({ message, errors });
}
