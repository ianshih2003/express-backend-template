import {
    ResourceController
} from './resources.controller';

import { Router } from 'express';

const RESOURCE_PATH = '/resources'

export default function getRouter(controller = new ResourceController()): Router {
    const resourcesRouter: Router = Router();
    resourcesRouter.get(RESOURCE_PATH, (req, res, next) => controller.getResources(req, res, next));
    return resourcesRouter;
}
