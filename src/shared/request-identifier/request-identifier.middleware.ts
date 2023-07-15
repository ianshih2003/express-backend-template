import * as uuid from 'uuid';
import { NextFunction, Request, Response } from 'express';

import { RequestIdentifierMiddlewareOptions } from './request-identifier-middleware-options.interface';

const BFF_REQ_ID_HEADER = 'X-justo-RequestId';
const id = 'id';
/**
 * BFF Request Identifier Middleware
 * @param {RequestIdentifierMiddlewareOptions} options
 * @returns {(req, res, next) => void}
 */
export const bffRequestIdentifier = (options?: RequestIdentifierMiddlewareOptions) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // check if a request identifier is already set in headers
    let headerSource = BFF_REQ_ID_HEADER;
    if (options && options.headerSource) headerSource = options.headerSource;

    let headerValue = req.header(headerSource);
    if (!headerValue) headerValue = uuid.v4();

    req[id] = headerValue;
    req.headers[BFF_REQ_ID_HEADER] = headerValue;
    res.setHeader(BFF_REQ_ID_HEADER, headerValue);
    next();
  };
};
