import { AxiosHeaders, InternalAxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { requestContext } from '@shared/request-context-continuation/request-context';

/**
 * Axios request interceptor
 * Adds pre-defined headers to the request object
 */
export const requestHeadersInterceptor = () => (request: InternalAxiosRequestConfig) => {
  // Add request meta info in common headers
  const headers: RawAxiosRequestHeaders & AxiosHeaders = request.headers;
  headers.common = { ...request.headers?.common, ...requestContext.meta };
  request.headers = headers;
  return request;
};
