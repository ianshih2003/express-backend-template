import * as newrelic from 'newrelic';
import { logger } from './logger';

/**
 * Application error handler.
 * Handles any error thrown by the app.
 */
export function appErrorHandler(err: Error) {
  logger.error(err);
}

