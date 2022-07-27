import Joi from 'joi';

export const JOI_VALIDATION_OPTIONS: Joi.ValidationOptions = {
  abortEarly: false,
  errors: { label: false },
};
