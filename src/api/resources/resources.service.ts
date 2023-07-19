import { externalResourcesClient, ResourcesClient } from './client';
import { Resource } from '@domain/resource';

export class ResourcesService {
  constructor(readonly client: ResourcesClient) {}

  async getResources(): Promise<Resource[]> {
    const { data } = await this.client.getExternalResources();
    return data.map((resource) => new Resource(resource.id, resource.description));
  }
}

export const resourcesService = new ResourcesService(externalResourcesClient);
