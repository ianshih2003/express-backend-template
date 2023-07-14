import { AppConfig } from './index';

export default {
  logger: {
    console: true,
    httpClientConfig: { useLogger: true },
  },
  newrelic: {
    license: '',
  }
} as AppConfig;
