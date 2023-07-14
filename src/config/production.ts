import { AppConfig } from './index';

export default {
  logger: {
    console: false,
    logstash: {
      appName: 'fe-contact-channels-messages-api',
      host: 'logstash.snaptocontact.it',
      port: 5000,
      level: 'info',
    },
    httpClientConfig: { useLogger: true },
    requestLogger: {
      excludeRequestUri: ['/tickets/health'],
    },
  },
  newrelic: {
    license: '',
  },
} as AppConfig;
