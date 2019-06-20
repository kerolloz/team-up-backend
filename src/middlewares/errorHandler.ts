import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }

  let status = err.status ? +err.status : 500;
  let message = '';
  if (status >= 500) {
    message = '🤒 Server error';
  } else {
    message = err.message ? err.message : '🤒 Something went wrong';
  }

  return res.status(status).json({ message: message });
}
