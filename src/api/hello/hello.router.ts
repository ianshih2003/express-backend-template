import {
    hello
} from './hello.controller';
import { Router } from 'express';

const contactRouter: Router = Router();

contactRouter.get('/hello', hello);

export default contactRouter;
