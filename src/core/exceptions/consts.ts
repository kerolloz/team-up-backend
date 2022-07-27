import { HttpExceptionStatus } from './HttpException';

export const BAD_REQUEST: HttpExceptionStatus = 400;
export const UNAUTHORIZED: HttpExceptionStatus = 401;
export const FORBIDDEN: HttpExceptionStatus = 403;
export const NOT_FOUND: HttpExceptionStatus = 404;
export const UNPROCESSABLE_ENTITY: HttpExceptionStatus = 422;
export const SERVER_ERROR: HttpExceptionStatus = 500;
