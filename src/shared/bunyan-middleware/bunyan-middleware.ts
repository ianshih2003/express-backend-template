import {NextFunction, Request, Response} from 'express';
import * as bunyan from "bunyan";

const debug = require('debug')('bff-core:bunya:middleware');

export function BunyanMiddleware(logger: bunyan) {
  debug('Setting up bunyan middleware');
  return (req: Request, _: Response, next: NextFunction) => {
    if(!logger) {
      throw new Error("Bunyan Logger is required in Bunyan Middleware");
    }

    req.logger = logger;
    next();
  };
}
