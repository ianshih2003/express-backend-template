import { URL } from 'url';
import { AxiosResponse } from 'axios';
import { HttpRequest, HttpResponse } from './http';

export function axiosResponseConverter<T = any>(
  axiosResponse: AxiosResponse<T>,
): HttpResponse<T> {
  const { data, status, headers, config } = axiosResponse;

  const httpRequest: HttpRequest = {
    url: new URL(config.url!, config.baseURL),
    method: config.method!,
    headers: config.headers,
    params: config.params,
    data: config.data,
  };

  return {
    data,
    status,
    headers,
    request: httpRequest,
  };
}
