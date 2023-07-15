import {Request, Response, NextFunction} from 'express';

const debug = require('debug')('bff-core:errors:middleware');

export interface ErrorHandlerOptions {
  /**
   * Error hook to be run before the response is sent.
   */
  handleError(err: any): void;
}

/**
 * Express error handler middleware.
 * There should be only one error handler middleware per application
 * and it should be added as the last middleware.
 */
export function errorHandlerMiddleware(options?: ErrorHandlerOptions) {
  debug('Setting up error handler middleware');
  return (err: any, _req: Request, res: Response, _next: NextFunction) => {
    debug('Calling the error handler');
    if (options) {
      options.handleError(err);
    }
    debug('Sending the error response');
    res.status(err.httpStatus || 500).json({...err, message: err.message});
  };
}
