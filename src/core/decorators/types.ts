import Joi from 'joi';
import { Request } from 'express';

export interface ISuccessfulResponse {
  status?: 200 | 201 | 204;
  content?: object | string;
}

export interface IErrorResponse {
  label: string;
  type: string;
  message: string;
}

export interface IValidationRules {
  params?: Joi.SchemaMap;
  query?: Joi.SchemaMap;
  body?: Joi.SchemaMap;
}

export type SuccessfulResponse = ISuccessfulResponse | string;
export type EndpointHandler = (
  req: Request,
) => Promise<SuccessfulResponse> | SuccessfulResponse;
