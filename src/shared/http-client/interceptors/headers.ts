import { AxiosRequestConfig } from 'axios';
import { requestContext } from '../../request-context-continuation/request-context';

import lowerCaseKeys from 'lowercase-keys';

/**
 * Axios request interceptor
 * Adds pre-defined headers to the request object
 */
export const requestHeadersInterceptor = () => (request: AxiosRequestConfig) => {
  // Add request meta info in common headers
  let headers = request.headers || {};
  headers.common = lowerCaseKeys({ ...request.headers?.common, ...requestContext.meta });
  request.headers = headers;
  // Apply lowercase to all header names
  request.headers = lowerCaseKeys(request.headers);
  return request;
};
