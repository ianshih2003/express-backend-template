import { NextFunction, Request, Response } from 'express';
import { resourcesService } from './resources.service';
import { ApiError } from '@shared/api-error';
import { Resource } from '@domain/resource';

export async function getResources(req: Request, res: Response, next: NextFunction) {
  try {
    const resources: Resource[] = await resourcesService.getResources();
    return res.json(resources);
  } catch (error) {
    next(ApiError.fromError(error));
  }
}
