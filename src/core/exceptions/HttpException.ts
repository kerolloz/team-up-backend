import { IErrorResponse } from '../decorators';

export type HttpExceptionStatus = 400 | 401 | 403 | 404 | 422 | 500;

export type ExceptionDetails = { message?: string; errors?: IErrorResponse[] };

export default class HttpException extends Error {
  status: HttpExceptionStatus;
  errors?: Record<string, unknown> | IErrorResponse[];
  constructor(
    status: HttpExceptionStatus,
    { message, errors }: ExceptionDetails = {},
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}
