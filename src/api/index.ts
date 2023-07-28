import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import resourcesRouter from './resources/resources.router';

const api: express.Application = express();

api.disable('x-powered-by');
api.use(cors());
api.use(bodyParser.json({ limit: '15mb' }));
api.use(bodyParser.urlencoded({ extended: true }));
api.use(resourcesRouter());

export default api;
