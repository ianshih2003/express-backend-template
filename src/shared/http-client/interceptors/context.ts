import { AxiosRequestConfig } from 'axios';

import { requestContext } from '../../../request-context-continuation/request-context';

type ForwardedContextKey =
  | 'company'
  | 'channel'
  | 'site'
  | 'language'
  | 'locale'
  | 'currencyCode';

type ForwardedContext = Partial<Record<ForwardedContextKey, string>>;

function getPropertiesFromContinuationContext(): ForwardedContext {
  const properties: ForwardedContext = {};
  if (requestContext.context) {
    properties.company = requestContext.context.company;
    properties.channel = requestContext.context.channel.toUpperCase();
    properties.site = requestContext.context.site.toUpperCase();
    properties.language = requestContext.context.language;
    properties.locale = requestContext.context.locale;
    properties.currencyCode = requestContext.context.currency.code;
  }
  return properties;
}

/**
 * Axios request interceptor
 * Adds the resolved request context to the URL query params
 */
export const requestContextInterceptor = () => (request: AxiosRequestConfig) => {
  const continuationContextProperties = getPropertiesFromContinuationContext();
  if (!request.params) {
    request.params = continuationContextProperties;
  } else {
    request.params = { ...continuationContextProperties, ...request.params };
  }
  return request;
};
