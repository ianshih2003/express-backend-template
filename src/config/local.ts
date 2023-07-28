import { AppConfig } from './index';

export default {
  logger: {
    console: true,
    httpClientConfig: { useLogger: true },
    level: 'trace',
    name: 'nodejs-template-back'
  },
  newrelic: {
    license: '',
  },
  endpoints: {
    externalResources: {
      url: 'https://mock-api.mx',
      timeout: 500,
    },
  },
} as AppConfig;
