import { AxiosRequestConfig } from 'axios';

import { requestContext } from '../../request-context-continuation/request-context';

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
  const context = requestContext.getContext();
  if (context) {
    // TODO: move this to interface
    properties.company = context.company;
    properties.channel = context.channel?.toUpperCase();
    properties.site = context.site?.toUpperCase();
    properties.language = context.language;
    properties.locale = context.locale;
    properties.currencyCode = context.currency?.code;
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
