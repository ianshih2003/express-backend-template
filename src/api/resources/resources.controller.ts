import { NextFunction, Request, Response } from 'express';
import { IResourceService, resourcesService as defaultResourceService } from './resources.service';
import { ApiError } from '@shared/api-error';

export class ResourceController {
  constructor(private readonly resourcesService: IResourceService = defaultResourceService) {}

  async getResources(_req: Request, res: Response, next: NextFunction) {
    try {
      const resources = await this.resourcesService.getResources();
      return res.json(resources);
    } catch (error) {
      next(ApiError.fromError(error));
    }
  }
}
