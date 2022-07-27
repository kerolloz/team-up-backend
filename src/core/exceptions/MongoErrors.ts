import { DocumentType } from '@typegoose/typegoose';
import { MongoError, BulkWriteResult, BulkWriteOperationError } from 'mongodb';

export const VALIDATION_ERROR = 'Validation Error';
export const MONGO_DUPLICATE_KEY_ERROR_CODE = 11000;
export interface IDuplicateKeyError extends MongoError {
  code: 11000;
  keyValue: Record<string, string>;
}

export interface IBulkInsertManyError extends BulkWriteOperationError {
  result: {
    result: BulkWriteResult;
  };
  insertedDocs: DocumentType<unknown>[];
}
export interface IMongooseIdValidatorError {
  errors: Record<
    string,
    {
      properties: {
        message: string;
        path: string;
      };
    }
  >;
}
