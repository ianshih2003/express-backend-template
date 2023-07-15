import * as bunyan from 'bunyan';
import { AxiosHeaders, AxiosRequestConfig, AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import { requestContext } from '../../request-context-continuation/request-context';

export interface LoggerOptions {
  logRequestBody?: boolean;
  logResponseBody?: boolean;
}

/**
 * By default, Axios groups headers in different
 * categories (common, get, post, put, ...).
 * Headers added to the requestConfig.headers object
 * won't be grouped inside any of those categories.
 * This method retrieves all those headers that are
 * not grouped inside Axios categories.
 */
function getCustomHeadersFromRequest(requestHeaders: AxiosHeaders ): Record<string, string> {
  return Object.keys(requestHeaders).reduce((customHeaders, key) => {
    if (typeof requestHeaders[key] === 'string') {
      customHeaders[key] = requestHeaders[key];
    }
    return customHeaders;
  }, {} as Record<string, string>);
}

/**
 * Axios request interceptor
 * Logs the request configuration
 */
export const requestLoggerInterceptor = (logger: bunyan, loggerOptions?: LoggerOptions) => (
  request: AxiosRequestConfig,
) => {
  const url = (request.baseURL || '') + (request.url || '');
  const requestMethod = request.method as string;
  const commonHeaders = request.headers?.common;
  let methodHeaders;
  if (request.headers) {
    methodHeaders = request.headers[requestMethod];
  }
  const customHeaders = getCustomHeadersFromRequest(<AxiosHeaders> request.headers);

  const requestPayload: any = {
    headers: {
      ...commonHeaders, // common headers and request meta headers
      ...methodHeaders, // method (get, post, put, ...) headers
      ...customHeaders, // custom headers added in the request
    },
  };

  if (loggerOptions && loggerOptions.logRequestBody) {
    requestPayload.body = request.data;
  }

  const payload = {
    request: requestPayload,
    requestId: requestContext.tid,
  };

  logger.info(payload, `Making ${requestMethod.toUpperCase()} request to ${url}`);
  return request;
};

/**
 * Axios Bunyan Response Logger Interceptor
 * Logs request response
 * @param {Logger} logger
 * @param loggerOptions
 * @returns {(config: AxiosRequestConfig) => AxiosRequestConfig}
 */
export const responseLoggerInterceptor = (logger: bunyan, loggerOptions?: LoggerOptions) => (
  response: AxiosResponse,
) => {
  const responsePayload: any = {
    status: response.status,
    headers: response.headers,
  };

  if (loggerOptions && loggerOptions.logResponseBody) {
    responsePayload.body = response.data;
  }

  const payload = {
    response: responsePayload,
    requestId: requestContext.tid,
  };
  logger.info(payload, `Receiving response from ${response.config.url}`);
  return response;
};
