import { NextFunction, Request, Response } from 'express';

const debug = require('debug')('bff-core:404:middleware');

/**
 * Basic application middleware used for sending
 * a `NotFound` response with a **404** status code
 * and an error message as payload.
 */
export function fourOFourMiddleware() {
  debug('Setting up 404 middleware');
  return (req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      debug('Headers were sent => calling next()');
      return next();
    }
    debug(`No route matched ${req.originalUrl} => sending a 404 response`);
    res.status(404).json({ message: 'Not Found' });
  };
}
