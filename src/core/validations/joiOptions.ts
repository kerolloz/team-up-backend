import Joi from 'joi';

export const JOI_VALIDATION_OPTIONS: Joi.ValidationOptions = {
  convert: true,
  abortEarly: false,
  errors: { label: false },
};
