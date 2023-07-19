import {
    getResources
} from './resources.controller';
import { Router } from 'express';

const resourcesRouter: Router = Router();

resourcesRouter.get('/resources', getResources);

export default resourcesRouter;
