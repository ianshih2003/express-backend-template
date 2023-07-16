import { RequestHandler } from 'express';
import { logger } from '../shared/logger';

export function requestLogger(): RequestHandler {
  return (req, res, next) => {
    res.on('finish', () => {
      const method = req.method;
      const url = req.originalUrl;
      const statusCode = res.statusCode;
      const statusMessage = res.statusMessage;
      logger.info(`${method} ${url} - ${statusCode} ${statusMessage}`);
    });
    next();
  };
}
