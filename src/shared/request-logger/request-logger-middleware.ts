import 'reflect-metadata';
import {NextFunction, Request, Response} from 'express';
import {HttpRequestLoggerOptions} from "./request-logger-middleware-option.interface";
import {BunyanLoggerNotFoundError} from "./request-logger-error";

const debug = require('debug')('bff-core:rl:middleware');

export const bffRequestLoggerMiddleware = (options?: HttpRequestLoggerOptions) => {
  debug('Setting up request continuation context');

  const {messages = {}} = options || {};

  const {
    beforeMessage = "[START]",
    afterMessage = "[END]",
  } = messages || {};

  const {excludeRequestUri = [], includeRequestUri = []} = options || {};

  function loggeableUri(
    excludeRequestUris: string[] = [],
    includeRequestUris: string[] = [],
    urlToTest: string,
  ): boolean {
    const excluded = excludeRequestUris
      .some((excludeRequestUri => urlToTest.startsWith(excludeRequestUri)))

    const included = includeRequestUris
      .some((includeRequestUri => urlToTest.startsWith(includeRequestUri)))

    return includeRequestUris.length === 0 ? !excluded : included;
  }

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.logger) {
      return new BunyanLoggerNotFoundError();
    }

    if (loggeableUri(excludeRequestUri, includeRequestUri, req.url)) {
      req.logger!.info(beforeMessage);

      res.on('close', () => {
        req.logger!.info(afterMessage);
      })
    }

    next();
  };
}
