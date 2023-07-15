import { NextFunction, Request, Response } from 'express';
import * as bunyan from 'bunyan';

export function BunyanMiddleware(logger: bunyan) {
  return (req: Request, _: Response, next: NextFunction) => {
    if (!logger) {
      throw new Error('Bunyan Logger is required in Bunyan Middleware');
    }
    req.logger = logger;
    next();
  };
}
