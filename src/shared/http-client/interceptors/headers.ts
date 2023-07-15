import { AxiosHeaders, InternalAxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { requestContext } from '../../request-context-continuation/request-context';

import lowerCaseKeys from 'lowercase-keys';
import { AxiosRequestHeaders } from 'axios';

/**
 * Axios request interceptor
 * Adds pre-defined headers to the request object
 */
export const requestHeadersInterceptor = () => (request: InternalAxiosRequestConfig) => {
  // Add request meta info in common headers
  const headers: RawAxiosRequestHeaders & AxiosHeaders = request.headers;
  headers.common = lowerCaseKeys({ ...request.headers?.common, ...requestContext.meta });
  request.headers = headers;
  // Apply lowercase to all header names
  request.headers = lowerCaseKeys(request.headers) as AxiosRequestHeaders;
  return request;
};
