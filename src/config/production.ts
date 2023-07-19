import { AppConfig } from './index';

export default {
  logger: {
    console: false,
    logstash: {
      appName: 'nodejs-backend-template',
      host: 'logstash.justo.it',
      port: 5000,
      level: 'info',
    },
    httpClientConfig: { useLogger: true },
    requestLogger: {
      excludeRequestUri: ['/nodejs-backend-template/health'],
    },
  },
  newrelic: {
    license: '',
  },
  endpoints: {
    externalResources: {
      url: 'https://mock-api.mx',
      timeout: 500
    }
  },
} as AppConfig;
