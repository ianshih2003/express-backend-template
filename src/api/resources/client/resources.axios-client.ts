import config from '@config';
import { ResourcesClient } from './resources.client';
import { Endpoint } from '@types';
import { bffHttpAxiosClientOptions } from '@shared/http-client-config';
import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { axiosResponseConverter } from '@shared/axios-response-converter';
import { HttpResponse } from '@shared/http';
import { BffHttpAxiosClient } from '@shared/http-client/http-client';
import { ExternalResource } from '@externalModels/resources';

export class AxiosCompaniesClient implements ResourcesClient {
  @BffHttpAxiosClient(bffHttpAxiosClientOptions)
  baseConnector: AxiosInstance;

  constructor(readonly basePath: Endpoint) {
    this.baseConnector = Axios.create({
      baseURL: basePath.url,
      timeout: basePath.timeout,
    });
  }

  async getExternalResources(): Promise<HttpResponse<ExternalResource[]>> {
    const response: AxiosResponse = await this.baseConnector.get(`/external-resources`);
    return axiosResponseConverter(response);
  }
}

export const externalResourcesClient = new AxiosCompaniesClient(config.endpoints.externalResources);
