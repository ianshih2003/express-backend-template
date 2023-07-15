import { AxiosRequestConfig } from 'axios';
import { requestContext } from '../../request-context-continuation/request-context';

import lowerCaseKeys from 'lowercase-keys';

/**
 * Axios request interceptor
 * Adds pre-defined headers to the request object
 */
export const requestHeadersInterceptor = () => (request: AxiosRequestConfig) => {
  // Add request meta info in common headers
  request.headers?.common = { ...request.headers?.common, ...requestContext.meta };

  // Apply lowercase to all header names
  request.headers = lowerCaseKeys(request.headers);
  // Axios groups headers in categories (common, get, post, put, ...)
  // so we need to lowercase those header names too
  for (let key of Object.keys(request.headers)) {
    if (typeof request?.headers[key] === 'object') {
      request.headers[key] = lowerCaseKeys(request.headers[key]);
    }
  }

  return request;
};
