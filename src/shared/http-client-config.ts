import config from '../config';
import { logger } from './logger';
import { HttpAxiosClientOptions } from '@bff/core/lib/utils/http-client/http-client';
import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { AppError } from '@bff/core';
import * as AxiosLogger from 'axios-logger';

export const bffHttpAxiosClientOptions: HttpAxiosClientOptions = {
  logger: config.logger.httpClientConfig.useLogger ? logger : undefined,
};

function responseErrorInterceptor(error: AxiosError) {
  if (error.response) {
    const response = error.response;
    const data = response.data;
    const message =
      data && data.message
        ? response.data.message
        : 'Unexpected error while calling external service';
    return Promise.reject(new AppError(message, response.status, true));
  }
  return Promise.reject(error);
}

export function createConnector(axiosConfig: AxiosRequestConfig) {
  const connector = Axios.create(axiosConfig);
  connector.interceptors.request.use(AxiosLogger.requestLogger);
  connector.interceptors.response.use((conf) => conf, responseErrorInterceptor);
  logger.debug(`Created axios connector to ${axiosConfig.baseURL}`);
  return connector;
}
