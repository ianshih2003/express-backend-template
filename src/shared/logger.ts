import { LoggerBuilder } from '@shared/bunyan-logger-builder';

import config from '@config';

// TODO: FIXME get this from config
let loggerBuilder = new LoggerBuilder(config.logger.name);

if (config.logger.console) {
  loggerBuilder = loggerBuilder.addStdoutStream('debug');
}

if (config.logger.logstash) {
  loggerBuilder = loggerBuilder.addLogstashStream(config.logger.logstash);
}

const logger = loggerBuilder.build();

export { logger };
