import { HttpException, SERVER_ERROR } from '../core';
import { Request, Response, NextFunction } from 'express';

export default function exceptionHandler(
  err: HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  const { errors, status = SERVER_ERROR, stack } = err;
  let message = err.message === '' ? undefined : err.message; // no empty messages
  if (status >= SERVER_ERROR) {
    message = 'Internal server error'; // always general message, NEVER expose the error
    console.error(stack);
  }
  return res.status(status).json({ message, errors });
}
