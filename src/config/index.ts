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
    name: string;
  };
  endpoints: {
    externalResources: Endpoint;
  };
}

export interface SqsConfiguration {
  region: string;
  waitTime: number;
  queueUrl: string;
}

const env = getEnvironment();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require(`./${env.toLowerCase()}`).default as AppConfig;
export default config;
