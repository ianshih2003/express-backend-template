import * as express from 'express';
import * as cookieParser from 'cookie-parser';
// TODO FIXME
import bunyanMiddleware from '/shared/bunyan-middleware/index';
import { appErrorHandler } from './shared/error-handler';
import { health, requestLogger } from './middlewares';
import { getEnvironment } from './shared/env';
import * as bodyParser from 'body-parser';
import { logger } from './shared/logger';
import config from './config';
import { api } from './api';
import { bffRequestLogger } from './shared/request-logger';
import { createContinuationContext } from './shared/request-context-continuation';
import { bffRequestIdentifier } from './shared/request-identifier';
import { fourOFourMiddleware } from './shared/404';
import { errorHandlerMiddleware } from './shared/errors';
import * as listEndpoints from 'express-list-endpoints'

const environment = getEnvironment();

const basePath = '/nodejs-backend-template';

const server: express.Application = express();
server.disable('x-powered-by');

if (environment === 'local') {
  // TODO move this to a stream with console out in bunyan
  server.use(requestLogger());
}

server.get(basePath + '/health(check)?', health());

// TODO add idm validation

server.use(cookieParser());
server.use(bodyParser.json({ limit: '15mb' })); // <-- IMPORTANT: Support parse attachments base64 encoded files
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bunyanMiddleware(logger));
server.use(bffRequestLogger({ ...config.logger.requestLogger }));
server.use(bffRequestIdentifier());
server.use(createContinuationContext());
server.use(basePath + '/api', api);

server.use(fourOFourMiddleware());
server.use(
  errorHandlerMiddleware({
    handleError: appErrorHandler,
  }),
);

// FIXME
// listEndpoints(api)

export { server };
