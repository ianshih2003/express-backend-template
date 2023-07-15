import * as newrelic from 'newrelic';
import { logger } from './logger';

/**
 * Application error handler.
 * Handles any error thrown by the app.
 */
export function appErrorHandler(err: Error) {
  logger.error(err);
}
// tslint:disable-next-line:ban-types
export function logErrors<T extends Function>(prefix: string, fn: T) {
  // tslint:disable-next-line:only-arrow-functions
  return function () {
    try {
      fn.apply(null, arguments);
    } catch (e: any) {
      logger.error(prefix, e);
      newrelic.noticeError(e);
    }
  };
}
