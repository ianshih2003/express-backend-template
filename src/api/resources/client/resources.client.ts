import { HttpResponse } from '@shared/http';
import { ExternalResource } from '@externalModels/resources';

export interface ResourcesClient {
  getExternalResources: () => Promise<HttpResponse<ExternalResource[]>>;
}
