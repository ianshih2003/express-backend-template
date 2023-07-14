import { LoggerBuilder } from '@bff/bunyan-logger-builder';

import config from '../config';

let loggerBuilder = new LoggerBuilder('fe-contact-channels-messages-api');

if (config.logger.console) {
  loggerBuilder = loggerBuilder.addStdoutStream('debug');
}

if (config.logger.logstash) {
  loggerBuilder = loggerBuilder.addLogstashStream(config.logger.logstash);
}

const logger = loggerBuilder.build();

export { logger };
