import APM from 'elastic-apm-node';

export function start() {
  if (process.env.ELASTIC_APM_ENABLED) {
    APM.isStarted()
      ? APM
      : APM.start({
          serviceName: 'nodejs-backend-template',
          secretToken: process.env.ELASTIC_APM_SECURE_TOKEN,
          serverUrl: 'https://apm.justo.mx',
          environment: process.env.ELASTIC_APM_ENVIRONMENT || 'staging',
          logLevel: 'info',
          captureExceptions: true,
          logUncaughtExceptions: true,
        });
  }
}
