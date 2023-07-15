import config from '../config';
import { logger } from './logger';
import { HttpAxiosClientOptions } from '../shared/http-client/http-client';
import Axios, { AxiosError, CreateAxiosDefaults } from 'axios';
import { AppError } from '../shared/errors/index';
import * as AxiosLogger from 'axios-logger';

export const bffHttpAxiosClientOptions: HttpAxiosClientOptions = {
  logger: config.logger.httpClientConfig.useLogger ? logger : undefined,
};

function responseErrorInterceptor(error: AxiosError) {
  const response = error.response;
  if (response) {
    const data: any = response.data;
    const messageStr: string = data?.message;
    const message = messageStr ?? 'Unexpected error while calling external service';
    return Promise.reject(new AppError(message, response.status, true));
  }
  return Promise.reject(error);
}

export function createConnector(axiosConfig: CreateAxiosDefaults) {
  const connector = Axios.create(axiosConfig);
  connector.interceptors.request.use(AxiosLogger.requestLogger);
  connector.interceptors.response.use((conf) => conf, responseErrorInterceptor);
  logger.debug(`Created axios connector to ${axiosConfig.baseURL}`);
  return connector;
}
