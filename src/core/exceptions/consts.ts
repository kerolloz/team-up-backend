import { IHttpExceptionResponse } from './HttpException';

export const BAD_REQUEST: IHttpExceptionResponse = {
  status: 400,
  message: 'Bad Request',
};

export const UNAUTHORIZED: IHttpExceptionResponse = {
  status: 401,
  message: 'Unauthorized Access',
};

export const FORBIDDEN: IHttpExceptionResponse = {
  status: 403,
  message: 'Forbidden',
};

export const NOT_FOUND: IHttpExceptionResponse = {
  status: 404,
  message: 'Not Found',
};

export const UNPROCESSABLE_ENTITY: IHttpExceptionResponse = {
  status: 422,
  message: 'Unprocessable Entity',
};

export const SERVER_ERROR: IHttpExceptionResponse = {
  status: 500,
  message: 'Internal Server Error',
};
