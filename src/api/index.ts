import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import helloRouter from './hello/hello.router';
import resourcesRouter from './resources/resources.router';

const api: express.Application = express();

api.disable('x-powered-by');

// Enable CORS
api.use(cors());

// Enable request body parsing
api.use(bodyParser.json({ limit: '15mb' }));
api.use(bodyParser.urlencoded({ extended: true }));
api.use(helloRouter);
api.use(resourcesRouter);

export default api;
