import { getEnvironment } from '../shared/env';

export interface AppConfig {
  logger: {
    console: boolean;
    httpClientConfig: { useLogger: boolean };
  };
  newrelic?: {
    license: string;
  };
}

export interface SqsConfiguration {
  region: string;
  waitTime: number;
  queueUrl: string;
}

const env = getEnvironment();
const config = require(`./${env.toLowerCase()}`).default as AppConfig;
export default config;
