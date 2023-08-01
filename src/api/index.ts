import ordersRouter from '@api/orders/orders.router';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import resourcesRouter from './resources/resources.router';

const api: express.Application = express();

api.disable('x-powered-by');
api.use(cors());
api.use(bodyParser.json({ limit: '15mb' }));
api.use(bodyParser.urlencoded({ extended: true }));
api.use(resourcesRouter());
api.use(ordersRouter());

export default api;
