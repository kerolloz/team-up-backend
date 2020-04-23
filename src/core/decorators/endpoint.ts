import { RequestHandler } from 'express';
import { requestHandler } from './requestHandler';
import { EndpointHandler, IValidationRules } from './types';
import { validationHandler } from './validationHandler';

export function endpoint(handler: EndpointHandler): RequestHandler[];

export function endpoint(
  validationRules: IValidationRules,
  handler: EndpointHandler,
): RequestHandler[];

export function endpoint(
  rulesOrHandler: IValidationRules | EndpointHandler,
  handler?: EndpointHandler,
): RequestHandler[] {
  const handlers = [];
  if (handler) {
    handlers.push(validationHandler(rulesOrHandler as IValidationRules));
  }
  const handlerFunc = handler || rulesOrHandler;
  handlers.push(requestHandler(handlerFunc as EndpointHandler));

  return handlers;
}
