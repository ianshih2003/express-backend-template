import 'reflect-metadata';
import * as http from 'http';
import * as https from 'https';
import * as bunyan from 'bunyan';
import { AxiosInstance } from 'axios';

import { LoggerOptions, requestLoggerInterceptor, responseLoggerInterceptor } from './interceptors/logger';
import { requestHeadersInterceptor } from './interceptors/headers';

const debug = require('debug')('bff-core:utils:http-client');

export interface HttpAxiosClientOptions {
  logger?: bunyan;
  loggerOptions?: LoggerOptions;
  addKeepAlive?: boolean;
}

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

/**
 * Decorates an Axios instance by adding logging
 * capabilities and headers + context forwarding logic
 * @param {HttpAxiosClientOptions} options
 */
export function BffHttpAxiosClient(options?: HttpAxiosClientOptions) {
  return function(target: any, key: string) {
    let value: AxiosInstance = target[key];

    const setter = (newValue: AxiosInstance) => {
      value = newValue;

      if (value) {
        const logger = options && options.logger;
        const loggerOptions = options && options.loggerOptions;
        let addKeepAlive = options && options.addKeepAlive;

        if (addKeepAlive === undefined) {
          debug('No addKeepAlive option specified, using default value: true');
          addKeepAlive = true;
        }

        if (addKeepAlive) {
          // Reduce DNS lookup time keeping connections alive
          value.defaults.httpAgent = httpAgent;
          value.defaults.httpsAgent = httpsAgent;
        }

        if (logger) {
          value.interceptors.request.use(requestLoggerInterceptor(logger, loggerOptions));
          value.interceptors.response.use(responseLoggerInterceptor(logger, loggerOptions));
        }
        value.interceptors.request.use(requestHeadersInterceptor());
      }
    };

    const getter = () => {
      return value;
    };

    Reflect.deleteProperty(target, key);
    Reflect.defineProperty(target, key, {
      get: getter,
      set: setter,
    });
  };
}
