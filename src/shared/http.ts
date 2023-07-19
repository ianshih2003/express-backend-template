/* eslint-disable @typescript-eslint/no-explicit-any*/
import { URL } from 'url';

export interface HttpRequest {
  url: URL;
  method: string;
  headers?: any;
  params?: any;
  data?: any;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  headers: any;
  request?: HttpRequest;
}
