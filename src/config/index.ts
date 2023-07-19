import { getEnvironment } from '@shared/env';
import { HttpRequestLoggerOptions } from '@shared/request-logger/request-logger-middleware-option.interface';
import { LogstashConfig } from '@shared/bunyan-logger-builder';
import { Endpoint } from '@types';

export interface AppConfig {
  logger: {
    console: boolean;
    httpClientConfig: { useLogger: boolean };
    requestLogger?: HttpRequestLoggerOptions;
    logstash?: LogstashConfig;

  };
  newrelic?: {
    license: string;
  },
  endpoints: {
    externalResources: Endpoint;
  }
}

export interface SqsConfiguration {
  region: string;
  waitTime: number;
  queueUrl: string;
}

const env = getEnvironment();
const config = require(`./${env.toLowerCase()}`).default as AppConfig;
export default config;
