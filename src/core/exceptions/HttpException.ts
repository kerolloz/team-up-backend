export type HttpExceptionStatus = 400 | 401 | 403 | 404 | 422 | 500;

export interface IHttpExceptionResponse {
  status: HttpExceptionStatus;
  message: string;
}

export default class HttpException extends Error {
  status: HttpExceptionStatus;
  errors?: object[];
  constructor({ message, status }: IHttpExceptionResponse, errors?: object[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}
