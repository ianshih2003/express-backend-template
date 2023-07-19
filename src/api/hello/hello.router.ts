import { hello } from './hello.controller';
import { Router } from 'express';

const helloRouter: Router = Router();

helloRouter.get('/hello', hello);

export default helloRouter;
