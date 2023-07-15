import * as uuid from 'uuid';
import * as cls from 'cls-hooked';
import { NextFunction, Request, Response } from 'express';

import { requestMetadata } from './request-meta';

const enum ContextKey {
  TID = 'TID',
  CONTEXT = 'CONTEXT',
  META = 'META',
}

const namespace = cls.createNamespace(uuid.v4());

export function createContinuationContext() {
  if (namespace.active) {
    throw new Error('The continuation context has already been created');
  }
  return (req: Request, res: Response, next: NextFunction) => {
    namespace.bindEmitter(req);
    namespace.bindEmitter(res);
    namespace.run(() => {

      // TID
      let requestId = req.headers['X-ccs-RequestId'] || req.id;
      if (!requestId) {
        requestId = uuid.v4();
      }
      namespace.set(ContextKey.TID, requestId);

      // Request meta
      const meta = requestMetadata(req);
      namespace.set(ContextKey.META, meta);

      next();
    });
  };
}

function getValue(key: ContextKey) {
  if (namespace.active) {
    return namespace.get(key);
  } else {
    throw new Error(
      'There is no continuation context created, call the createContinuationContext() middleware to create one',
    );
  }
}

export class RequestContinuationContext {
  get tid(): string {
    return getValue(ContextKey.TID);
  }

  get meta(): Record<string, string> {
    return getValue(ContextKey.META);
  }

}

export const requestContext = new RequestContinuationContext();
