import * as express from 'express';
import * as cookieParser from 'cookie-parser';
// TODO FIXME
//import * as core from '@bff/core';
import { appErrorHandler } from './shared/error-handler';
import { health, requestLogger } from './middlewares';
import { getEnvironment } from './shared/env';
import * as bodyParser from 'body-parser';
import { logger } from './shared/logger';
import config from './config';
import api from './api';

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
/* FIXME
server.use(core.bunyanMiddleware(logger));
server.use(core.bffRequestLogger({ ...config.logger.requestLogger }));
server.use(core.bffRequestIdentifier());
server.use(core.BffContextResolverMiddleware());
server.use(core.createContinuationContext());
*/
server.use(basePath + '/api', api);

/*FIXME
server.use(core.fourOFourMiddleware());
server.use(
  core.errorHandlerMiddleware({
    handleError: appErrorHandler,
  }),
);
*/

require('./shared/list-endpoints').listEndpoints(api);

export { server };
