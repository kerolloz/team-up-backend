import Joi from 'joi';
import { Request, Response } from 'express';

export interface ISuccessfulResponse {
  status?: 200 | 201 | 202 | 204;
  content?: unknown;
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

export type SuccessfulResponse = ISuccessfulResponse | string | void;
export type EndpointHandler = (
  req: Request,
  res: Response,
) => Promise<SuccessfulResponse> | SuccessfulResponse;
