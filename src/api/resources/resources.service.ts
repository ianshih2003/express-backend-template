import { externalResourcesClient, ResourcesClient } from './client';
import { Resource } from '@domain/resource';

export interface IResourceService {
  getResources(): Promise<Resource[]>;
}

export class ResourcesService implements IResourceService {
  constructor(readonly client: ResourcesClient) {}

  async getResources(): Promise<Resource[]> {
    const { data } = await this.client.getExternalResources();
    return data.map(({ id, description }) => new Resource(id, description));
  }
}

export const resourcesService = new ResourcesService(externalResourcesClient);
